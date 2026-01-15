
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Define available tools
const tools = [
    {
        type: "function" as const, // Explicitly typed for TS
        function: {
            name: "cancel_reservation",
            description: "Cancel a specific reservation by its ID.",
            parameters: {
                type: "object",
                properties: {
                    reservationId: {
                        type: "string",
                        description: "The unique ID of the reservation to cancel.",
                    },
                },
                required: ["reservationId"],
            },
        },
    },
];

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const session = await getSession();
        const user = session?.user;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // 1. Fetch Context Data
        const [offices, cars, categories] = await Promise.all([
            db.office.findMany({
                select: { name: true, address: true, latitude: true, longitude: true },
            }),
            db.car.findMany({
                where: { status: "AVAILABLE" },
                select: {
                    make: true,
                    model: true,
                    year: true,
                    pricePerDay: true,
                    transmission: true,
                    fuelType: true,
                    office: { select: { name: true } },
                },
                take: 20,
            }),
            db.category.findMany({
                select: { name: true },
            }),
        ]);

        // 2. Fetch User Reservations (if logged in)
        let userReservationsContext = "User is not logged in.";
        let userReservations = [];
        if (user) {
            userReservations = await db.reservation.findMany({
                where: {
                    userId: user.id,
                    status: { not: "CANCELLED" }, // Only show active/pending/completed
                },
                include: {
                    car: {
                        select: { make: true, model: true, year: true },
                    },
                },
                orderBy: { startDate: "desc" },
            });
            userReservationsContext = `User ID: ${user.id}\nActive Reservations: ${JSON.stringify(
                userReservations
            )}`;
        }

        const systemPrompt = `
      You are a helpful and polite car rental assistant for 'OtoKiralama Premium'.
      
      CAPABILITIES:
      1. Answer questions about available cars (from provided 'Available Cars' list).
      2. Provide info on office locations.
      3. Manage user reservations (List them, or Cancel them if requested).
      
      USER CONTEXT:
      ${userReservationsContext}
      
      GENERAL DATA:
      Offices: ${JSON.stringify(offices)}
      Categories: ${JSON.stringify(categories)}
      Available Cars Sample: ${JSON.stringify(cars)}

      RULES:
      - If the user asks to cancel a reservation, look for the reservation ID in the 'Active Reservations' list that matches their description (e.g., "The BMW"). If found, call the 'cancel_reservation' tool.
      - If you can't uniquely identify the reservation to cancel, ask for clarification.
      - If the user isn't logged in but asks about their reservations, ask them to log in first.
      - Keep answers concise and helpful.
      - Language: Turkish (unless user speaks English).
    `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
        ];

        // 3. First Call to LLM
        const chatCompletion = await groq.chat.completions.create({
            messages: messages as any,
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            tools: tools,
            tool_choice: "auto",
        });

        const choice = chatCompletion.choices[0];
        const toolCalls = choice?.message?.tool_calls;

        // 4. Handle Tool Calls
        if (toolCalls && toolCalls.length > 0) {
            const assistantMessage = choice.message;
            messages.push(assistantMessage as any); // Add the assistant's "intent" to call a tool to history

            for (const toolCall of toolCalls) {
                if (toolCall.function.name === "cancel_reservation") {
                    const args = JSON.parse(toolCall.function.arguments);
                    const reservationId = args.reservationId;

                    // Verify ownership before cancelling
                    const reservation = await db.reservation.findUnique({
                        where: { id: reservationId },
                    });

                    let toolResultContent = "";

                    if (!reservation) {
                        toolResultContent = JSON.stringify({ error: "Reservation not found." });
                    } else if (!user || reservation.userId !== user.id) {
                        toolResultContent = JSON.stringify({ error: "Unauthorized access to this reservation." });
                    } else {
                        // Perform Cancellation
                        await db.reservation.update({
                            where: { id: reservationId },
                            data: { status: "CANCELLED" },
                        });
                        toolResultContent = JSON.stringify({ success: true, message: `Reservation ${reservationId} cancelled successfully.` });
                    }

                    messages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        content: toolResultContent,
                    } as any);
                }
            }

            // 5. Second Call to LLM (to confirm action to user)
            const secondResponse = await groq.chat.completions.create({
                messages: messages as any,
                model: "llama-3.3-70b-versatile",
            });

            return NextResponse.json({ reply: secondResponse.choices[0]?.message?.content });

        } else {
            // No tool called, just return the text
            return NextResponse.json({ reply: choice?.message?.content || "Anlaşılmadı." });
        }

    } catch (error: any) {
        console.error("Error in chat API:", error);
        // Graceful error handling for missing API keys or timeouts
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

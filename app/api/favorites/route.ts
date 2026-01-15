import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { carId } = await request.json();
        if (!carId) {
            return NextResponse.json({ error: "Missing carId" }, { status: 400 });
        }

        const userId = session.user.id;

        const existing = await db.favorite.findUnique({
            where: {
                userId_carId: {
                    userId,
                    carId,
                },
            },
        });

        if (existing) {
            await db.favorite.delete({
                where: {
                    userId_carId: {
                        userId,
                        carId,
                    },
                },
            });
            return NextResponse.json({ status: "removed" });
        } else {
            await db.favorite.create({
                data: {
                    userId,
                    carId,
                },
            });
            return NextResponse.json({ status: "added" });
        }
    } catch (error) {
        console.error("Favorite toggle error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const favorites = await db.favorite.findMany({
            where: { userId },
            select: { carId: true }
        });

        return NextResponse.json(favorites.map(f => f.carId));
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

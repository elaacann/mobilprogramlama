
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { Bell, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const notifications = await db.notification.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const getIcon = (type: string) => {
        switch (type) {
            case "SUCCESS":
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case "WARNING":
                return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case "DANGER":
                return <XCircle className="w-6 h-6 text-red-500" />;
            default:
                return <Info className="w-6 h-6 text-blue-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "SUCCESS":
                return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20";
            case "WARNING":
                return "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20";
            case "DANGER":
                return "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20";
            default:
                return "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <Bell className="w-8 h-8 text-blue-500 fill-blue-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Bildirimler</h1>
                    <p className="text-gray-500 dark:text-gray-400">Hesabınızla ilgili güncellemeler.</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">Bildirim Yok</h2>
                        <p className="text-gray-500">Şu anda görüntülenecek yeni bir bildiriminiz bulunmuyor.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-6 rounded-2xl border ${getBgColor(notification.type)} flex gap-4 transition-all hover:scale-[1.01]`}
                        >
                            <div className="mt-1">{getIcon(notification.type)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{notification.title}</h3>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {format(new Date(notification.createdAt), "d MMMM HH:mm", { locale: tr })}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

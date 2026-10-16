import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaBell } from "react-icons/fa";

export default function Notifications() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: () =>
            axios.get(
                "https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            ),
    });

    const notifications = data?.data?.data?.notifications ?? [];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaBell className="text-blue-600 text-xl" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Notifications
                        </h1>
                        <p className="text-sm text-gray-500">
                            Stay updated with your latest notifications
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <p className="p-8 text-center text-gray-500">
                            Loading notifications...
                        </p>
                    ) : isError ? (
                        <p className="p-8 text-center text-red-500">
                            Failed to load notifications.
                        </p>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <FaBell className="text-gray-300 text-4xl mx-auto mb-4" />
                            <h2 className="font-semibold text-gray-700">
                                No notifications yet
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                When you receive notifications, they'll appear here.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification: any) => (
                            <div
                                key={notification._id}
                                className="flex gap-4 p-5 border-b border-gray-100 hover:bg-gray-50 transition"
                            >
                                <div className="w-11 h-11 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaBell className="text-blue-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-800">
                                        {notification.message ??
                                            notification.body ??
                                            notification.text ??
                                            "You have a new notification"}
                                    </p>

                                    {notification.createdAt && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

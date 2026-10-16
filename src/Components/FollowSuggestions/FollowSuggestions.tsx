import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaUserPlus } from "react-icons/fa";
import Loader from "../Loader/Loader";

type SuggestedUser = {
    _id: string;
    name: string;
    username?: string;
    photo?: string;
};

export default function FollowSuggestions() {
    function getSuggestions() {
        return axios.get(
            "https://route-posts.routemisr.com/users/suggestions?limit=10",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
        );
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ["followSuggestions"],
        queryFn: getSuggestions,
    });

    const suggestions = data?.data?.data?.suggestions;

    if (isLoading) {
        return (
            <aside className="hidden xl:block fixed right-6 top-24 w-72 bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <Loader />
            </aside>
        );
    }

    if (isError) {
        return null;
    }

    return (
        <aside className="hidden xl:block fixed right-5 top-20 bottom-4 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-y-auto">
    <h2 className="text-sm font-bold text-gray-800 mb-5">
        Suggested Friends (10)
    </h2>

    <div className="space-y-4">
        {suggestions?.map((user: SuggestedUser) => (
            <div key={user._id} className="flex items-center gap-3">
                <img
                    src={user.photo || "/default-avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name}
                    </p>
                </div>

                <button
                    type="button"
                    title="Follow"
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                >
                    <FaUserPlus size={16} />
                </button>
            </div>
        ))}
    </div>
</aside>
    );
}
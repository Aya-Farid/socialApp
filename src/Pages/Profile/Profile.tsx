
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    FaCamera,
    FaArrowRight,
    FaCalendarAlt,
    FaEnvelope,
    FaUsers,
    FaUserFriends,
    FaBookmark,
    FaVenusMars,
    FaUser,
} from "react-icons/fa";
import type { ProfileType } from "./../../Types/ProfileUser.type";

export default function Profile() {
    const queryClient = useQueryClient();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const token = localStorage.getItem("userToken");

    // Get My Profile
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getMyProfile"],
        queryFn: async () => {
            const response = await axios.get(
                "https://route-posts.routemisr.com/users/profile-data",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        },
    });

    const user: ProfileType | undefined = data?.data?.user;
    const userId = (user as any)?._id;

    // Upload Profile Photo
    const uploadProfilePhoto = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("photo", file);

            return axios.put(
                "https://route-posts.routemisr.com/users/upload-photo",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getMyProfile"],
            });
            setPhotoPreview(null);
        },
        onError: (error) => {
            console.error("Failed to upload profile photo:", error);
            setPhotoPreview(null);
        },
    });

    // Get User Posts
    const {
        data: postsData,
        isLoading: postsLoading,
        isError: postsError,
    } = useQuery({
        queryKey: ["userPosts", userId],
        queryFn: async () => {
            const response = await axios.get(
                `https://route-posts.routemisr.com/users/${userId}/posts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        },
        enabled: !!userId,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="mx-auto mt-10 max-w-xl rounded-xl bg-red-50 p-6 text-center text-red-600">
                Failed to load profile. Please try again.
            </div>
        );
    }

    // Support common API response structures
    const posts = Array.isArray(postsData?.data?.posts)
        ? postsData.data.posts
        : Array.isArray(postsData?.data)
        ? postsData.data
        : Array.isArray(postsData?.posts)
        ? postsData.posts
        : [];

    return (
        <>
            <Helmet>
                <title>My Profile | Social App</title>
            </Helmet>

            <div className="min-h-screen bg-slate-100 px-3 py-6 sm:px-6">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Cover Photo */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 sm:h-72">
                        {user.cover && (
                            <img
                                src={user.cover}
                                alt="Cover"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}

                        <label
                            htmlFor="coverPicture"
                            className="absolute bottom-4 right-4 z-10 flex cursor-pointer items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow transition hover:bg-white"
                        >
                            <FaCamera />
                            <span>Edit Cover</span>
                        </label>

                        <input
                            type="file"
                            id="coverPicture"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    console.log("Selected cover:", file);
                                }

                                e.target.value = "";
                            }}
                        />
                    </div>

                    {/* Profile Information */}
                    <div className="px-5 pb-6 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                            {/* Profile Picture */}
                            <div className="relative z-10 -mt-16 h-36 w-36 shrink-0 self-start rounded-full sm:-mt-20">
                                <img
                                    src={photoPreview || user.photo}
                                    alt={user.name}
                                    className="h-36 w-36 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                                />

                                <label
                                    htmlFor="profilePicture"
                                    title="Edit Profile Picture"
                                    className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-700 shadow-md transition hover:bg-slate-200"
                                >
                                    {uploadProfilePhoto.isPending ? (
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                    ) : (
                                        <FaCamera size={17} />
                                    )}
                                </label>

                                <input
                                    type="file"
                                    id="profilePicture"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadProfilePhoto.isPending}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (file) {
                                            setPhotoPreview(
                                                URL.createObjectURL(file)
                                            );
                                            uploadProfilePhoto.mutate(file);
                                        }

                                        e.target.value = "";
                                    }}
                                />

                                {uploadProfilePhoto.isError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        Failed to upload photo. Please try again.
                                    </p>
                                )}
                            </div>

                            {/* Name and Username */}
                            <div className="min-w-0 pb-2">
                                <h1 className="break-words text-2xl font-bold text-slate-800">
                                    {user.name}
                                </h1>

                                <p className="mt-1 text-slate-500">
                                    @{user.username}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-7 grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-blue-300 sm:p-4">
                                <FaUsers className="mx-auto mb-2 text-xl text-blue-600" />
                                <p className="text-xl font-bold text-slate-800">
                                    {user.followersCount}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Followers
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-blue-300 sm:p-4">
                                <FaUserFriends className="mx-auto mb-2 text-xl text-indigo-600" />
                                <p className="text-xl font-bold text-slate-800">
                                    {user.followingCount}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Following
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-blue-300 sm:p-4">
                                <FaBookmark className="mx-auto mb-2 text-xl text-purple-600" />
                                <p className="text-xl font-bold text-slate-800">
                                    {user.bookmarksCount}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Bookmarks
                                </p>
                            </div>
                        </div>

                        {/* About Me */}
                        <div className="mt-8">
                            <h2 className="mb-4 border-b border-slate-200 pb-3 text-xl font-bold text-slate-800">
                                About Me
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <FaEnvelope />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500">
                                            Email Address
                                        </p>
                                        <p className="break-all font-medium text-slate-800">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                        <FaVenusMars />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Gender
                                        </p>
                                        <p className="font-medium capitalize text-slate-800">
                                            {user.gender}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Date of Birth
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {new Date(
                                                user.dateOfBirth
                                            ).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Username
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                            <h2 className="mb-2 font-bold text-slate-800">
                                Account Information
                            </h2>

                            <p className="text-sm text-slate-600">
                                Member since{" "}
                                <span className="font-semibold text-blue-700">
                                    {new Date(user.createdAt).toLocaleDateString(
                                        "en-GB",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </p>
                        </div>

                        {/* User Posts */}
                        <div className="mt-8">
                            <h2 className="mb-5 border-b border-slate-200 pb-3 text-xl font-bold text-slate-800">
                                My Posts
                            </h2>

                            {postsLoading && (
                                <div className="flex justify-center py-8">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                                </div>
                            )}

                            {postsError && (
                                <p className="py-6 text-center text-red-500">
                                    Failed to load posts. Please try again.
                                </p>
                            )}

                            {!postsLoading &&
                                !postsError &&
                                posts.length === 0 && (
                                    <p className="rounded-xl bg-slate-50 py-10 text-center text-slate-500">
                                        No posts yet.
                                    </p>
                                )}

                            <div className="grid gap-5">
                                {posts.map((post: any) => (
                                    <div
                                        key={post._id}
                                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <p className="mb-3 whitespace-pre-wrap text-slate-800">
                                            {post.body ?? post.content ?? ""}
                                        </p>

                                        {(post.image || post.photo) && (
                                            <img
                                                src={post.image || post.photo}
                                                alt="Post"
                                                className="max-h-[450px] w-full rounded-xl object-cover"
                                            />
                                        )}

                                        {/* Likes & Comments */}
                                        <div className="mt-4 flex gap-5 border-t border-slate-100 pt-3 text-sm text-slate-500">
                                            <span>
                                                Likes:{" "}
                                                {post.likes?.length ?? post.likesCount ?? 0}
                                            </span>

                                            <span>
                                                Comments:{" "}
                                                {post.comments?.length ?? post.commentsCount ?? 0}
                                            </span>
                                        </div>

                                        {/* View Post Button */}
                                        <div className="mt-4 border-t border-slate-100 pt-4">
                                            <Link
                                                to={`/postdetails/${post._id}`}
                                                className="group mt-4 flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                                            >
                                                View Post
                                                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

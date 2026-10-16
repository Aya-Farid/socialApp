import { useContext, useState } from "react";
import type { commentType } from "../Post/Comment.type";
import { Link } from "react-router-dom";
import {
    FaEllipsisH,
    FaEdit,
    FaTrash,
    FaHeart,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";

export default function Comment({
    comment,
    postId,
    isPostDetails,
}: {
    comment: commentType;
    postId: string;
    isPostDetails: boolean;
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const { userId: loginUserId } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const token = localStorage.getItem("userToken");

    // Delete Comment
    function handleDeleteComment() {
        return axios.delete(
            `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    const {
        isPending: isDeleting,
        mutate: deleteComment,
    } = useMutation({
        mutationFn: handleDeleteComment,

        onSuccess: () => {
            toast.success("Comment deleted successfully");

            queryClient.invalidateQueries({
                queryKey: ["getPostComments", postId],
            });

            queryClient.invalidateQueries({
                queryKey: ["getAllPoste"],
            });

            setShowMenu(false);
        },

        onError: () => {
            toast.error("Failed to delete comment");
        },
    });

    // Edit Comment
    function handleEditComment() {
        return axios.put(
            `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
            {
                content: editedContent.trim(),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    const {
        isPending: isEditing,
        mutate: editComment,
    } = useMutation({
        mutationFn: handleEditComment,

        onSuccess: () => {
            toast.success("Comment updated successfully");

            queryClient.invalidateQueries({
                queryKey: ["getPostComments", postId],
            });

            queryClient.invalidateQueries({
                queryKey: ["getAllPoste"],
            });

            setShowEdit(false);
        },

        onError: () => {
            toast.error("Failed to update comment");
        },
    });

    // Like / Unlike Comment
    function handleToggleCommentLike() {
        return axios.put(
            `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    const {
        isPending: isLiking,
        mutate: toggleCommentLike,
    } = useMutation({
        mutationFn: handleToggleCommentLike,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getPostComments", postId],
            });

            queryClient.invalidateQueries({
                queryKey: ["getAllPoste"],
            });
        },

        onError: () => {
            toast.error("Failed to like/unlike comment");
        },
    });

    // Check whether the current user liked this comment
    const commentLikes = comment.likes ?? [];

    const isLiked = commentLikes.some((like: any) => {
        const likedUserId =
            typeof like === "string" ? like : like?._id;

        return likedUserId === loginUserId;
    });

    return (
        <div className="mx-4 my-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">

            {/* Comment Header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {!isPostDetails && (
                        <span className="text-sm font-semibold text-slate-600">
                            Top Comment
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>

                    {loginUserId === comment.commentCreator._id && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-blue-100"
                            >
                                <FaEllipsisH />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">

                                    <button
                                        onClick={() => {
                                            setEditedContent(comment.content);
                                            setShowEdit(true);
                                            setShowMenu(false);
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
                                    >
                                        <FaEdit />
                                        Edit Comment
                                    </button>

                                    <button
                                        onClick={() => deleteComment()}
                                        disabled={isDeleting}
                                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <FaTrash />
                                        {isDeleting
                                            ? "Deleting..."
                                            : "Delete Comment"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Comment Content */}
            <div className="rounded-xl border border-slate-100 bg-white p-3">

                {/* Comment Creator */}
                <div className="mb-3 flex items-center gap-3">
                    <img
                        src={comment.commentCreator.photo}
                        alt={comment.commentCreator.name}
                        className="h-10 w-10 rounded-full border-2 border-blue-100 object-cover"
                    />

                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-800">
                            {comment.commentCreator.name}
                        </div>

                        <div className="text-xs text-slate-400">
                            @{comment.commentCreator.username}
                        </div>
                    </div>

                    <i className="fa-solid fa-comment-dots ml-auto text-lg text-blue-400" />
                </div>

                {/* Edit or Display Content */}
                <div className="border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">
                    {showEdit ? (
                        <div>
                            <textarea
                                value={editedContent}
                                onChange={(e) =>
                                    setEditedContent(e.target.value)
                                }
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setEditedContent(comment.content);
                                        setShowEdit(false);
                                    }}
                                    className="cursor-pointer rounded-lg bg-slate-200 px-3 py-2 transition hover:bg-slate-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => editComment()}
                                    disabled={
                                        isEditing ||
                                        !editedContent.trim()
                                    }
                                    className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isEditing ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        comment.content
                    )}
                </div>

                {/* Comment Image */}
                {comment.image && (
                    <img
                        src={comment.image}
                        alt="Comment image"
                        className="mt-3 max-h-80 w-full rounded-lg object-cover"
                    />
                )}

                {/* Like / Unlike */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                        onClick={() => toggleCommentLike()}
                        disabled={isLiking}
                        className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                            isLiked
                                ? "bg-red-50 text-red-500"
                                : "text-slate-500 hover:bg-red-50 hover:text-red-500"
                        }`}
                    >
                        <FaHeart
                            className={`text-base transition-transform ${
                                isLiked
                                    ? "scale-110"
                                    : "scale-100"
                            }`}
                        />

                        {isLiking
                            ? "Loading..."
                            : isLiked
                                ? "Unlike"
                                : "Like"}
                    </button>

                    <span className="text-xs font-medium text-slate-400">
                        {commentLikes.length}{" "}
                        {commentLikes.length === 1 ? "like" : "likes"}
                    </span>
                </div>
            </div>

            {/* View All Comments */}
            {!isPostDetails && (
                <Link
                    to={`/postdetails/${postId}`}
                    className="mt-3 inline-block text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                >
                    View all comments
                </Link>
            )}
        </div>
    );
}


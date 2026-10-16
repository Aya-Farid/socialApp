import { FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";
import type { PostType } from '../../Types/Post.type';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './../Loader/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Comment from './../Comment/Comment';
import type { commentType } from "./Comment.type";
import CommentCreation from './../CommentCreation/CommentCreation';
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

export default function Post({ post, isPostDetails }: { post: PostType, isPostDetails: boolean }) {

    const { body, image, user, createdAt, topComment, _id } = post;
    const { name, photo, _id: userId } = user;
    const [showMenu, setShowMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editedBody, setEditedBody] = useState(body);
    const { userId: loginUserId } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    function getPostComments() {
        return axios.get(
            `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getPostComments", _id],
        queryFn: getPostComments,
        enabled: isPostDetails
    });

    // console.log(data?.data.data.comments);

    // useEffect(() => {
    //     getAllPoste();

    //     return () => {}
    // }, []);

    // if (isLoading) {
    //     return <Loader />
    // }
    // if(isError){
    //     return <h1>{error.message}</h1>
    // }

    function handleDeletePost() {
        return axios.delete(
            `https://route-posts.routemisr.com/posts/${_id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
    }

    const { isPending, mutate } = useMutation({
        mutationFn: handleDeletePost,

        onSuccess: () => {
            toast.success("Post deleted successfully");

            queryClient.invalidateQueries({
                queryKey: ["getAllPoste"]
            });

            queryClient.invalidateQueries({
                queryKey: ["getPostDetails", _id]
            });

            navigate("/");
        },

        onError: (err) => {
            console.log(err);
        }
    });

    function handleEditPost() {
        return axios.put(
            `https://route-posts.routemisr.com/posts/${_id}`,
            {
                body: editedBody
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
    }

    const { isPending: isEditing, mutate: editPost } = useMutation({
        mutationFn: handleEditPost,

        onSuccess: () => {
            toast.success("Post updated successfully");

            queryClient.invalidateQueries({
                queryKey: ["getAllPoste"]
            });

            queryClient.invalidateQueries({
                queryKey: ["getPostDetails", _id]
            });

            setShowEdit(false);
        },

        onError: (err) => {
            console.log(err);
            toast.error("Failed to update post");
        }
    });

    return (
        <>
            <div className='w-[60%] rounded-xl border border-slate-200 shadow-sm m-6 mx-auto bg-white'>

                {/* Post Header */}
                <div className="p-4 flex gap-3 items-center justify-between">

                    <div className="flex gap-3 items-center">
                        <img
                            src={photo}
                            className="w-11 h-11 border border-slate-200 rounded-full object-cover"
                            alt=""
                        />

                        <div>
                            <p className="font-bold text-slate-800">
                                {name}
                            </p>

                            <p className="text-sm text-slate-500">
                                {createdAt}
                            </p>
                        </div>
                    </div>

                    {/* Post Options */}
                    {loginUserId === userId && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                                <FaEllipsisH size={18} />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-10 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-20">

                                    <button
                                        onClick={() => {
                                            setEditedBody(body);
                                            setShowEdit(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        <FaEdit size={15} />
                                        <span>Edit Post</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            mutate();
                                            setShowMenu(false);
                                        }}
                                        disabled={isPending}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        <FaTrash size={14} />
                                        <span>{isPending ? "Deleting..." : "Delete Post"}</span>
                                    </button>

                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Post Content */}
                <div className='px-4 pb-4'>

                    {showEdit ? (
                        <div className="mb-4">
                            <textarea
                                value={editedBody}
                                onChange={(e) => setEditedBody(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                                rows={4}
                            />

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => {
                                        setEditedBody(body);
                                        setShowEdit(false);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => editPost()}
                                    disabled={isEditing || !editedBody.trim()}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {isEditing ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className='mb-4 text-slate-800'>
                            {body}
                        </p>
                    )}

                    <img
                        src={image}
                        className='w-full rounded-lg'
                        alt=""
                    />

                </div>

                {/* Actions */}
                <div className='border-t border-slate-200 px-4 py-2 flex justify-between'>

                    <button className='flex items-center justify-center gap-2 flex-1 py-2 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-600 hover:text-blue-600'>

                        <FaThumbsUp />

                        <span>{post.likesCount} Like</span>

                    </button>

                    <Link to={`/postdetails/${_id}`} className='flex-1'>

                        <button className='flex items-center justify-center gap-2 w-full py-2 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-600'>

                            <FaComment />

                            <span>{post.commentsCount} Comment</span>

                        </button>

                    </Link>

                    <button className='flex items-center justify-center gap-2 flex-1 py-2 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-600'>

                        <FaShare />

                        <span>{post.sharesCount} Share</span>

                    </button>

                </div>

                {/* All Comments in Post Details, Top Comment Otherwise */}

                {isPostDetails ? (
                    <>
                        {isLoading && <Loader />}

                        {isError && <p>{error.message}</p>}

                        {data?.data.data.comments &&
                            data.data.data.comments.map((comment: commentType) => (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    postId={String(_id)}
                                    isPostDetails={true}
                                />
                            ))}
                    </>
                ) : (
                    topComment && (
                        <Comment
                            comment={topComment}
                            postId={String(_id)}
                            isPostDetails={false}
                        />
                    )
                )}

                {/*comment creation */}
                <CommentCreation
                    postId={_id}
                    queryKey={isPostDetails ? ["getPostComments", _id] : ["getAllPoste"]}
                />

            </div>
        </>
    );
}

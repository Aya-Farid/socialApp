import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {FaImage,FaSmile, FaPaperPlane,FaTimes,} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function PostCreation() {

    //get all posts after posting 
    const query = useQueryClient()

    /* Add emoji to post */
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [content, setContent] = useState("");

    /* Upload image */
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    function handleEmojiClick(emojiData: { emoji: string }) {
        setContent(content + emojiData.emoji);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function removeImage() {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(null);
        setImagePreview("");
    }

    //select jsx using ref // ===> Value returned {obj}
    const textInput = useRef<HTMLTextAreaElement>(null);
    const imgInput = useRef<HTMLInputElement>(null);

    function createPost(formData: FormData) {
        return axios.post(
            "https://route-posts.routemisr.com/posts",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
        );
    }

    //used w non get requests
    const { data, mutate, isPending } = useMutation({
        mutationFn: createPost,
        onSuccess: (res) => {
            // console.log(res.data.message);
            setContent("");
            setImage(null);
            setImagePreview("");
            if (imgInput.current) {
                imgInput.current.value = "";
            }
            setShowEmojiPicker(false);
            //getposts
            toast.success(res.data.message)
            query.invalidateQueries({queryKey :["getAllPosts"] })
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message);
            }
        },
        onSettled: () => {},
    });

    function handleCreatePost() {
        if (content === "" && image === null) {
            return;
        }

        const formData = new FormData();

        if (content !== "") {
            formData.append("body", content);
        }

        if (image) {
            formData.append("image", image);
        }

        mutate(formData);

        console.log("created");
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FaPaperPlane size={18} />
            </div>

            <div>
            <h2 className="text-lg font-semibold text-slate-800">
                Create Post
            </h2>
            <p className="text-sm text-slate-500">
                Share something with your community
            </p>
            </div>
        </div>

        {/* Post Content */}
        <textarea
            ref={textInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full resize-none rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
        />

        {/* Image Preview */}
        {imagePreview && (
            <div className="relative mt-4 rounded-lg border border-slate-200 overflow-hidden">
            <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                aria-label="Remove image"
            >
                <FaTimes size={14} />
            </button>

            <img
                src={imagePreview}
                alt="Post preview"
                className="w-full max-h-96 object-contain bg-slate-50"
            />
            </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4 text-slate-500">
            {/* Photo */}
            <label className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                <FaImage size={18} className="text-green-600" />
                <span className="text-sm">Photo/Video</span>

                <input
                ref={imgInput}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                />
            </label>

            {/* Emoji */}
            <div className="relative">
                <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                <FaSmile size={18} />
                <span className="text-sm">Feeling</span>
                </button>

                {showEmojiPicker && (
                <div className="absolute left-0 bottom-full mb-2 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
                )}
            </div>
            </div>

            <button
            onClick={handleCreatePost}
            type="button"
            disabled={isPending || (content === "" && image === null)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
            {isPending ? "Posting..." : (
                <>
                    <FaPaperPlane size={14} />
                    Post
                </>
            )}
            </button>
        </div>
        </div>
    );
}

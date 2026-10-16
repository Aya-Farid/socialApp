
import { FaPaperPlane, FaImage,FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation,useQueryClient  } from "@tanstack/react-query";

type CommentFormValues = {
    content: string;
    image: FileList | undefined;
};

export default function CommentCreation({ postId, queryKey }: { postId: string,queryKey :string[] }) {

    const form = useForm<CommentFormValues>({
        defaultValues: {
            content: "",
            image: undefined,
        },
    });

    const { register, handleSubmit, reset } = form;

    const queryClient = useQueryClient();
        

    function createComment(formdata: FormData) {
        return axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            formdata,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
        );
    }

    const { data ,isPending, mutate } = useMutation({
        mutationFn: createComment,

        onSuccess: async () => {
            console.log("Comment created");

            await queryClient.invalidateQueries({
                queryKey: queryKey
            });

            reset();
        },

        onError: (err) => {
            if (axios.isAxiosError(err)) {
                console.log("Error response:", err.response?.data);
            }
        },
    });

    function handleCreateComment(values: CommentFormValues) {
        if (!values.content.trim() && !values.image?.length) {
            return;
        }

        const formdata = new FormData();

        if (values.content.trim()) {
            formdata.append("content", values.content);
        }

        if (values.image && values.image.length > 0) {
            formdata.append("image", values.image[0]);
        }

        mutate(formdata);
    }

    return (
        <div className="border-t border-slate-200 p-4">
            <form
                className="flex items-center gap-3 w-full"
                onSubmit={handleSubmit(handleCreateComment)}
            >
                <label
                    htmlFor={`comment-image-${postId}`}
                    className="shrink-0 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                >
                    <FaImage size={20} />
                </label>

                <input
                    {...register("image")}
                    type="file"
                    id={`comment-image-${postId}`}
                    accept="image/*"
                    className="hidden"
                />

                <input
                    {...register("content")}
                    type="text"
                    id={`comment-${postId}`}
                    placeholder="Write a comment..."
                    className="flex-1 min-w-0 p-3 bg-slate-100 border border-transparent text-slate-800 text-sm rounded-full focus:outline-none focus:bg-white focus:border-blue-500 placeholder:text-slate-400 transition-colors"
                />


                        <button
                            type="submit"
                            disabled={isPending}
                            className="shrink-0 w-11 h-11 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-full disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending ? (
                                <FaSpinner className="animate-spin" size={15} />
                            ) : (
                                <FaPaperPlane size={15} />
                            )}
                        </button>

            </form>
        </div>
    );
}

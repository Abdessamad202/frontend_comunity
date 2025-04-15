import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../hooks/useUser";
import { handleInputChange } from "../utils/formHelpers";
import { addComment } from "../apis/apiCalls";
import { useContext, useState } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { useParams } from "react-router";

export default function AddCommentForm({ post }) {
    const { user } = useUser();
    const [formData, setFormData] = useState({ content: "" });
    const queryClient = useQueryClient();
    const notify = useContext(NotificationContext);
    const { id } = useParams();
    const param = !id ? post?.user_id : id;

    const { mutate: addCommentMutation, isPending } = useMutation({
        mutationFn: ({ postId, data }) => addComment(postId, data),

        onMutate: async ({ postId, data }) => {
            await queryClient.cancelQueries(["posts"]);
            await queryClient.cancelQueries(["post", String(postId)]);
            await queryClient.cancelQueries(["profile", param]);

            const previousPosts = queryClient.getQueryData(["posts"]);
            const previousSinglePost = queryClient.getQueryData(["post", String(postId)]);
            const previousProfileData = queryClient.getQueryData(["profile", param]);

            const optimisticComment = {
                content: data.content,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user: {
                    id: user.id,
                    profile: {
                        picture: user.profile.picture,
                        name: user.profile.name,
                    },
                },
            };

            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((p) =>
                            p.id === postId
                                ? {
                                      ...p,
                                      comments: [...p.comments, optimisticComment],
                                      comments_count: (p.comments_count || 0) + 1,
                                  }
                                : p
                        ),
                    })),
                };
            });

            queryClient.setQueryData(["post", String(postId)], (oldPost) => {
                if (!oldPost) return oldPost;
                return {
                    ...oldPost,
                    comments: [...oldPost.comments, optimisticComment],
                    comments_count: (oldPost.comments_count || 0) + 1,
                };
            });

            queryClient.setQueryData(["profile", param], (oldProfile) => {
                if (!oldProfile) return oldProfile;
                return {
                    ...oldProfile,
                    posts: oldProfile.posts.map((p) =>
                        p.id === postId
                            ? {
                                  ...p,
                                  comments: [...p.comments, optimisticComment],
                                  comments_count: (p.comments_count || 0) + 1,
                              }
                            : p
                    ),
                };
            });

            return { previousPosts, previousSinglePost, previousProfileData, postId };
        },

        onSuccess: () => {
            notify("success", "Comment added successfully");
        },

        onError: (err, _, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
            if (context?.previousSinglePost) {
                queryClient.setQueryData(["post", String(context.previousSinglePost.id)], context.previousSinglePost);
            }
            if (context?.previousProfileData) {
                queryClient.setQueryData(["profile", param], context.previousProfileData);
            }
            notify("error", "Failed to add comment");
            console.error("Error adding comment:", err);
        },

        onSettled: (_, __, ___, context) => {
            if (context?.postId) {
                queryClient.invalidateQueries(["post", String(context.postId)]);
            }
            queryClient.invalidateQueries(["posts"]);
            queryClient.invalidateQueries(["profile"]);
        },
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!formData.content.trim()) return;
        addCommentMutation({ postId: post.id, data: formData });
        setFormData({ content: "" });
    };

    return (
        <div className="p-4 border-t rounded-xl border-gray-200 sticky bottom-0 bg-white shadow-md">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
                <img
                    className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0 border border-gray-200"
                    src={user?.profile.picture}
                    alt="Your avatar"
                />
                <div className="flex-1 relative">
                    <input
                        type="text"
                        name="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange(e, setFormData)}
                        placeholder="Write a comment..."
                        className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm border border-transparent"
                        aria-label="Comment text"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!formData.content.trim() || isPending}
                    className={`ml-2 p-2 rounded-full flex items-center justify-center transition-colors ${
                        formData.content.trim() && !isPending
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label="Submit comment"
                >
                    {isPending ? (
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}

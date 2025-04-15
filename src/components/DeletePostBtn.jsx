import { deletePost } from "../apis/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationContext } from "../contexts/NotificationContext";
import { useContext } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
export default function DeletePostBtn({ postId ,setShowActions}) {
    const notify = useContext(NotificationContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            const previousPosts = queryClient.getQueryData(["posts"]);

            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        posts: page.posts.filter((p) => p.id !== postId),
                    })),
                };
            });

            return { previousPosts };
        },
        onError: (err, _, context) => {
            notify("error", "Failed to delete post. Restoring...");
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },
        onSuccess: (data) => {
            notify(data.status, data.message || "Post deleted");
            navigate("/home");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
    const handleDeletePost = (postId) => {
        deletePostMutation.mutate(postId);
    };
    return (
        <button
            onClick={() => {
                setShowActions(false);
                handleDeletePost(postId);
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-indigo-50"
        >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
        </button>
    )
}
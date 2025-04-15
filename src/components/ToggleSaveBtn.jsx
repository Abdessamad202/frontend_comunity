import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSavePost } from "../apis/apiCalls";
import { NotificationContext } from "../contexts/NotificationContext";
import { useContext } from "react";
import useUser from "../hooks/useUser";
import { Bookmark } from "lucide-react";

export default function ToggleSaveBtn({ isSaved, post }) {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const notify = useContext(NotificationContext);
    const toggleSavePostMutation = useMutation({
        mutationFn: toggleSavePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["saved",user.id] });
            const previousSavedPosts = queryClient.getQueryData(["saved",user.id]);

            // Optimistic update
            queryClient.setQueryData(["saved",user.id], (oldData = []) => {
                if (isSaved) {
                    return oldData.filter(item => item.id !== postId);
                } else {
                    return [{ ...post, pivot: { created_at: new Date() } }, ...oldData];
                }
            }); 
            return { previousSavedPosts };
        },
        onSuccess: (data) => {
            notify(data.status, data.message);
        },
        onError: (err, postId, context) => {
            queryClient.setQueryData(["saved",user.id], context.previousSavedPosts);
            notify("error", "Failed to toggle saved status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["saved",user.id] });
        },
    });

    const handleSave = (e) => {
        e.preventDefault();
        if (!user) return;
        toggleSavePostMutation.mutate(post.id);
    };
    return (
        <button
            className={`flex cursor-pointer items-center px-3 py-1.5 rounded-lg transition duration-200 text-sm font-medium ${isSaved ? "bg-yellow-100 text-yellow-600" : "text-yellow-600 hover:bg-yellow-100"
                }`}
            onClick={handleSave}
            aria-label={isSaved ? "Unsave post" : "Save post"}
        >
            <Bookmark className={`w-4 h-4 sm:mr-2 ${isSaved ? "fill-yellow-600 text-yellow-600" : ""}`} />
            <div className="hidden sm:block">{isSaved ? "Saved" : "Save"}</div>
        </button>
    )
}
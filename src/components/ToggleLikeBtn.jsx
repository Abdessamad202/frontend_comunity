import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikePost } from "../apis/apiCalls";
import { useContext, useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import useUser from "../hooks/useUser";
import { NotificationContext } from "../contexts/NotificationContext";
import { useParams } from "react-router";

export default function ToggleLikeBtn({ isLiked, post }) {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const notify = useContext(NotificationContext);
    const {id} = useParams()
    const likeMutation = useMutation({
        mutationFn: (postId) => toggleLikePost(postId),

        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["likers", postId] });
            await queryClient.cancelQueries({ queryKey: ["profile", id || String(user.id)] });
            await queryClient.cancelQueries({ queryKey: ["post", String(postId)] });

            const previousPosts = queryClient.getQueryData(["posts"]);
            const previousLikers = queryClient.getQueryData(["likers", postId]);
            const previousProfileData = queryClient.getQueryData(["profile", id || String(user.id)]);
            const previousPost = queryClient.getQueryData(["post", String(postId)]);

            // Optimistically update "posts"
            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((p) =>
                            p.id === postId
                                ? { ...p, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
                                : p
                        ),
                    })),
                };
            });

            // Optimistically update "likers"
            queryClient.setQueryData(["likers", postId], (oldLikers = []) => {
                if (isLiked) {
                    return oldLikers.filter((liker) => liker.id !== user?.id);
                }
                return [
                    ...oldLikers,
                    {
                        id: user?.id,
                        name: user?.profile?.name,
                        picture: user?.profile?.picture,
                        friendship_status: "self",
                    },
                ];
            });

            // Optimistically update "profile"
            queryClient.setQueryData(["profile", id || String(user.id)], (oldProfile) => {
                if (!oldProfile) return oldProfile;
                return {
                    ...oldProfile,
                    posts: oldProfile.posts.map((p) =>
                        p.id === postId
                            ? { ...p, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
                            : p
                    ),
                };
            });
            // Optimistically update single "post"

            queryClient.setQueryData(["post", String(postId)], (oldPost) => {
                if (!oldPost) return oldPost;
                return {
                    ...oldPost,
                    likes_count: isLiked ? oldPost.likes_count - 1 : oldPost.likes_count + 1,
                };
            });
            console.log("previousPost", previousPost);


            return { previousPosts, previousLikers, previousProfileData, previousPost };
        },

        onSuccess: (data) => {
            notify(data.status, data.message);
        },

        onError: (err, postId, context) => {
            queryClient.setQueryData(["posts"], context.previousPosts);
            queryClient.setQueryData(["likers", postId], context.previousLikers);
            queryClient.setQueryData(["profile", id || String(user.id)], context.previousProfileData);
            queryClient.setQueryData(["post", String(postId)], context.previousPost);
            notify("error", "Failed to update like status");
            console.error("Error liking post:", err);
        },

        onSettled: (data, error, postId) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["likers", postId] });
            queryClient.invalidateQueries({ queryKey: ["profile", id || String(user.id)] });
            queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
        },
    });
    const [likeSound] = useState(new Audio("/audios/mouth-plops-6688 (mp3cut.net).mp3"));
    // Preload audio
    useEffect(() => {
        likeSound.load();
    }, [likeSound]);
    const handleLike = (e) => {
        e.preventDefault();

        if (!user) return;
        likeMutation.mutate(post.id);

        if (!isLiked) {
            likeSound.play().catch((error) => console.error("Audio play error: ", error));
        }
    };
    return (
        <button
            className={`flex items-center px-3 py-1.5 rounded-lg transition duration-200 text-sm font-medium cursor-pointer ${isLiked ? "bg-indigo-100 text-indigo-600" : "text-indigo-600 hover:bg-indigo-100"
                }`}
            onClick={handleLike}
            aria-label={isLiked ? "Unlike post" : "Like post"}
        >
            <ThumbsUp className={`w-4 h-4 sm:mr-2 ${isLiked ? "fill-indigo-600 text-indigo-600" : ""}`} />
            <div className="hidden sm:block">{isLiked ? "Liked" : "Like"}</div>
        </button>
    );
}
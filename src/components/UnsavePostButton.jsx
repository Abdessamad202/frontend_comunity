import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSavePost } from "../apis/apiCalls";
import { Bookmark } from "lucide-react";
import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

const UnsavePostButton = ({ postId }) => {
  const queryClient = useQueryClient();
  const notify = useContext(NotificationContext)
  const { id } = queryClient.getQueryData(["user"]);
  const toggleSavePostMutation = useMutation({
    mutationFn: toggleSavePost,
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["saved",id] });
      
      // Snapshot the previous value
      const previousSavedPosts = queryClient.getQueryData(["saved",id]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["saved",id], (oldData = []) => {
        return oldData.filter(post => post.id !== postId);
      });
      
      return { previousSavedPosts };
    },
    onSuccess: ({status,message}) => {
      notify(status,message)
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["saved",id], context.previousSavedPosts);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["saved",id] });
    },
  });

  return (
    <button 
      className="ml-auto p-1.5 rounded-full hover:bg-gray-200 transition-colors"
      onClick={() => toggleSavePostMutation.mutate(postId)}
      title="Unsave post"
    >
      <Bookmark className="h-4 w-4 text-indigo-600 fill-indigo-600" />
    </button>
  );
};


export default UnsavePostButton;
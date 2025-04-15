import { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams } from "react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { usePost } from "../hooks/usePost";
import useUser from "../hooks/useUser";
import { NotificationContext } from "../contexts/NotificationContext";
import { addComment } from "../apis/apiCalls";

import PostPageSkeleton from "../components/PostPageSkeleton";
import CommentItem from "../components/CommentItem";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Post from "../components/Post";
import NotFound from "./NotFound";
import AddCommentForm from "../components/AddCommentForm";
import ModalHeader from "../components/ModalHeader";
import { MessageCircle } from "lucide-react";

export default function PostPage() {
  const { id } = useParams();
  const { post, isLoading, error, isError } = usePost(id);
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const notify = useContext(NotificationContext);

  const [comment, setComment] = useState({ content: "" });
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const commentsContainerRef = useRef(null);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [post?.comments]);
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, data }) => addComment(postId, data),
    onMutate: async ({ postId, data }) => {
      await queryClient.cancelQueries(["posts"]);
      await queryClient.cancelQueries(["post", String(postId)]);
      await queryClient.cancelQueries(["profile", user.id]);

      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousSinglePost = queryClient.getQueryData(["post", String(postId)]);
      const previousProfileData = queryClient.getQueryData(["profile", id]);

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

      // Optimistically update posts feed
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
                  comments_count: p.comments_count + 1,
                }
                : p
            ),
          })),
        };
      });

      // Optimistically update single post
      queryClient.setQueryData(["post", String(postId)], (oldPost) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          comments: [...oldPost.comments, optimisticComment],
          comments_count: oldPost.comments_count + 1,
        };
      });

      // Optimistically update profile with the new comment
      // Optimistically update profile with the new comment
      queryClient.setQueryData(["profile", user.id], (oldProfile) => {
        if (!oldProfile) return oldProfile;

        return {
          ...oldProfile,
          posts: oldProfile.posts.map((post) =>
            post.id === postId
              ? {
                ...post,
                comments: [...post.comments, optimisticComment], // Add the new comment to the post
                comments_count: (post.comments_count || 0) + 1,  // Increment the comments_count correctly
              }
              : post
          ),
        };
      });



      return { previousPosts, previousSinglePost, previousProfileData };
    },
    onSuccess: () => {
      notify("success", "Comment added successfully");
    },
    onError: (err, _, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(["post", post.id], context.previousSinglePost);
      }
      if (context?.previousProfileData) {
        queryClient.setQueryData(["profile", id], context.previousProfileData);
      }
      notify("error", "Failed to add comment");
      console.error("Error adding comment:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", post.id]);
      queryClient.invalidateQueries(["profile", user.id]);
    },
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.content.trim()) return;
    addCommentMutation.mutate({ postId: post.id, data: comment });
    setComment({ content: "" });
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditedContent("");
  };

  const openDeleteConfirm = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCommentToDelete(null);
  };

  if (isLoading) return <div className="mt-[64px]">
    <PostPageSkeleton />
  </div>
    ;
  if (isError && error?.response?.status === 404) {
    return <NotFound />;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load post.</div>;
  }
  return (
    <div className="flex flex-col md:flex-row mt-[64px] w-full bg-gray-100">
      {/* Left Side - Post Content */}
      <div className="md:w-7/12 h-[calc(100vh - 64px)] bg-white">
        <Post post={post} className={'h-full'}  />
      </div>
      {/* <ModalHeader data={{title: "Comments", length: post.comments?.length || 0}}/> */}
      {/* Right Side - Comments Section */}
      <div className="md:fixed top[64px] right-0  md:w-5/12 h-[calc(100vh-64px)] flex flex-col bg-white md:border-l border-gray-200">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-lg">Comments ({post.comments?.length || 0})</h3>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          ref={commentsContainerRef}
        >
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, i) => (
              <CommentItem
                key={i}
                comment={comment}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                cancelEdit={cancelEdit}
                openDeleteConfirm={openDeleteConfirm}
                post={post}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-gray-600 text-sm">No comments yet</p>
              <p className="text-gray-500 text-xs">Be the first to share your thoughts</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white sticky bottom-0">
          <AddCommentForm post={post} />
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          post={post}
          commentToDelete={commentToDelete}
          onClose={closeDeleteConfirm}
        />
      )}
    </div>
  );
}
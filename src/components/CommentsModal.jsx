import { useState, useEffect, useContext, useRef } from "react"; // Added useRef
import { MessageCircle } from "lucide-react";
import CommentItem from "./CommentItem";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import AddCommentForm from "./AddCommentForm";
export default function CommentsModal({ post, toggleModal, isCommentsModalOpen }) {
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  useEffect(() => {
    if (showDeleteConfirm || editingComment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showDeleteConfirm, editingComment]);

  useEffect(() => {
    cancelEdit();
  }, []);


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

  return (
    <>
      <Modal isModalOpen={isCommentsModalOpen} toggleModal={toggleModal} >
        <ModalHeader onClose={toggleModal} data={{ title: "Comments", length: post.comments_count }} />
        <div className="flex flex-col gap-4 p-4 ">
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment, i) => (
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-gray-600 text-sm">No comments yet</p>
                <p className="text-gray-500 text-xs">Be the first to share your thoughts</p>
              </div>
            )}
          </div>

        </div>
        <AddCommentForm post={post} />
      </Modal>
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          post={post}
          commentToDelete={commentToDelete}
          onClose={closeDeleteConfirm}
        />
      )}
    </>
  );
}
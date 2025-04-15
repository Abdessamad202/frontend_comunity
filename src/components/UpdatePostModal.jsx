import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import UpdatePostModalContent from "./UpdatePostModalContent";

export default function UpdatePostModal({ post, toggleModal ,isModalOpen }) {
  const handleOverlayClick = (e) => {
    // Only close if the click is directly on the overlay, not its children
      toggleModal();
  };

  return (
    <Modal isModalOpen={isModalOpen} toggleModal={handleOverlayClick} width="max-w-2xl">
      {/* Modal Header - Fixed at top */}
      {/* <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <h3 id="update-post-modal-title" className="text-lg font-semibold text-gray-800">
          Update Post
        </h3>
        <button
          onClick={toggleModal}
          className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Close update modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div> */}
      <ModalHeader data={{ title: "Update Post" }} onClose={toggleModal} />
      <UpdatePostModalContent toggleModal={toggleModal} post={post}  />
    </Modal>
  );
}
import { useQuery , useQueryClient} from "@tanstack/react-query";
import { fetchSavedPosts } from "../apis/apiCalls";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import SavedPostsModalContent from './SavedPostsModalContent';
export default function SavedPostsModal({ isModalOpen, toggleModal }) {
    const queryClient = useQueryClient();
    const { id } = queryClient.getQueryData(["user"]);
    const { isLoading, data: saved } = useQuery(
        {
            queryKey: ["saved", id],
            queryFn: () => fetchSavedPosts(id),
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
        },
    );
    return (
        <Modal toggleModal={toggleModal} isModalOpen={isModalOpen} width="max-w-2xl">
            <ModalHeader data={{ title: "Saved Posts", length: saved?.length }} onClose={toggleModal} isLoading={isLoading} />
            <SavedPostsModalContent
                isLoading={isLoading}
                savedPosts={saved}
                onClose={toggleModal}
            />
        </Modal>
    );
}
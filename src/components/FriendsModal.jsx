import Modal from './Modal';
import ModalHeader from './ModalHeader';
import { getFriends } from './../apis/apiCalls';
import { useContext } from 'react';
import { NotificationContext } from './../contexts/NotificationContext';
import { useQueryClient , useInfiniteQuery } from '@tanstack/react-query';
import FriendsModalContent from './FriendsModalContent';
export default function FriendsModal({ toggleModal ,isModalOpen }) {
    const queryClient = useQueryClient();
    const {id} = queryClient.getQueryData(["user"]);
    // Fetch friends data with pagination
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["friends", id],
        queryFn: getFriends,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        refetchOnWindowFocus: true,
    });

    // Flatten the paginated data into a single friends array
    const friends = data?.pages.flatMap((page) => page.friends) || [];

    return (
        <Modal toggleModal={toggleModal} isModalOpen={isModalOpen} width="max-w-2xl">
            <ModalHeader data={{ title: "Friends", length: friends.length}} onClose={toggleModal} isLoading ={isLoading}/>
            <FriendsModalContent error={error} isLoading={isLoading} friends={friends} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}/>
        </Modal>
    )
}
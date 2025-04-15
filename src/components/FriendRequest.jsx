// components/FriendRequests.jsx
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFriendRequests, respondToFriendRequest } from "../apis/apiCalls";
import { NotificationContext } from "../contexts/NotificationContext";
import { useContext, useEffect, useRef } from "react";
import FriendRequestCard from "./FriendRequestCard";
import { Loader2, Users2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useUser from "../hooks/useUser";

const FriendRequests = () => {
    const notify = useContext(NotificationContext);
    const queryClient = useQueryClient();
    const scrollRef = useRef(null);
    const { user } = useUser();
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["friendRequests", user?.id],
        queryFn: getFriendRequests,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        refetchOnWindowFocus: true,
        staleTime: 60000, // 1 minute
        enabled: !!user?.id, // Only run query if user exists
    });

    const friendRequests = data?.pages.flatMap((page) => page.friendRequests) || [];

    // Optimize mutations with shared logic
    const createMutation = (action) => useMutation({
        mutationFn: (sender) => respondToFriendRequest(sender, action),
        onMutate: async (sender) => {
            await queryClient.cancelQueries({ queryKey: ["friendRequests", user?.id] });
            const previousRequests = queryClient.getQueryData(["friendRequests", user?.id]);

            queryClient.setQueryData(["friendRequests", user?.id], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        friendRequests: page.friendRequests?.filter((req) => req.sender.id !== sender) || [],
                    })),
                };
            });

            // Also update friends list if accepting
            if (action === "accept") {
                queryClient.invalidateQueries({ queryKey: ["friends", user?.id] });
            }

            return { previousRequests };
        },
        onSuccess: (data) => {
            notify(data.status, data.message);
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(["friendRequests", user?.id], context.previousRequests);
            console.error(`Error ${action}ing request:`, err);
            notify("error", `There was an issue ${action}ing the request. Please try again.`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["friendRequests", user?.id] });
        }
    });

    const acceptMutation = createMutation("accept");
    const rejectMutation = createMutation("reject");

    // Observer for infinite scrolling
    useEffect(() => {
        if (!scrollRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(scrollRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Loading skeleton component
    const RequestSkeleton = () => (
        <div className="flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0 animate-pulse">
            <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3 w-18 bg-gray-100 rounded mt-2"></div>
                </div>
            </div>
            <div className="flex space-x-2">
                <div className="h-8 w-12 bg-gray-200 rounded-md"></div>
                <div className="h-8 w-12 bg-gray-100 rounded-md"></div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-5 max-h-[calc(5*100px)] overflow-hidden flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-gray-800 flex items-center">
                    <Users2 className="w-5 h-5 mr-2 text-indigo-500" />
                    Friend Requests
                    {friendRequests.length > 0 && (
                        <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            {friendRequests.length}
                        </span>
                    )}
                </h2>
            </div>

            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1 flex-grow">
                {isLoading ? (
                    <div>
                        {[...Array(3)].map((_, index) => (
                            <RequestSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-6 text-center text-red-500 flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 mb-2" />
                        <p>{error.message || "Unable to load friend requests"}</p>
                    </div>
                ) : !user ? (
                    <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
                        <p>Please sign in to view friend requests</p>
                    </div>
                ) : friendRequests.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                        <Users2 className="w-12 h-12 text-gray-300 mb-2" />
                        <p>No pending friend requests</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {friendRequests.map((request, index) => (
                            <motion.div
                                key={request.sender.id || index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FriendRequestCard
                                    request={request}
                                    acceptMutation={acceptMutation}
                                    rejectMutation={rejectMutation}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {hasNextPage && (
                    <div
                        ref={scrollRef}
                        className="flex justify-center items-center py-3 text-sm text-gray-500"
                    >
                        {isFetchingNextPage ? (
                            <Loader2 size={16} className="animate-spin text-indigo-500" />
                        ) : (
                            "Scroll for more"
                        )}
                    </div>
                )}
            </div>

            {hasNextPage && !isFetchingNextPage && (
                <div className="mt-3 flex justify-center pt-2 border-t border-gray-100">
                    <button
                        onClick={() => fetchNextPage()}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-200 transition-colors duration-200 flex items-center"
                    >
                        <span>Load More</span>
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default FriendRequests;
import FriendSkeleton from './FriendSkeleton';
import FriendItem from './FriendItem';
import { Users } from 'lucide-react';
export default function FriendsModalContent({ friends ,isLoading ,error ,isFetchingNextPage , fetchNextPage ,hasNextPage}) {
    return (
        <div className="p-4 max-h-[calc(90vh-8rem)] overflow-y-auto">
            {isLoading ? (
                <div className="space-y-4">
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <FriendSkeleton key={index} />
                        ))}
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-600 text-sm">Failed to load friends</p>
                    <p className="text-gray-500 text-xs mt-1">Please try again later</p>
                </div>
            ) : friends.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {friends.map((friend) => (
                            <FriendItem
                                key={friend.id}
                                friend={friend}
                            />
                        ))}
                    </div>
                    {hasNextPage && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isFetchingNextPage
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {isFetchingNextPage ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-gray-600 text-sm">No friends yet</p>
                    <p className="text-gray-500 text-xs mt-1">Connect with people to build your network</p>
                </div>
            )}
        </div>
    )
}
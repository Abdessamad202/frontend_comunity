import SavedPostSkeleton from './SavedPostSkeleton';
import SavedPost from './SavedPost'; // Assuming SavedPost is a component that displays the saved post details
export default function SavedPostsModalContent({ isLoading, savedPosts }) {
    return (
        <div className="flex flex-col gap-4 p-4 ">
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">

                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        {[1, 2].map((index) => (
                            <SavedPostSkeleton key={index} />
                        ))}
                    </div>
                ) : savedPosts.length > 0 ? (
                    savedPosts.map((post) => (
                        <SavedPost key={post.id} post={post} /> // Assuming SavedPost is a component that displays the saved post details
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No saved posts found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
export default function SavedPostSkeleton() {
    return (
        <div className="animate-pulse flex p-4 border border-gray-100 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
            <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
                <div className="h-20 bg-gray-100 rounded mb-2" />
            </div>
        </div>
    )
}
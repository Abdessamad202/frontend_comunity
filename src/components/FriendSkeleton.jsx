export default function FriendSkeleton() {
    return (
        <div className="flex items-center space-x-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-md" />
        </div>
    )
}
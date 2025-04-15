import React from 'react';

const PostPageSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row mt-[64px]  w-full bg-gray-100">
            {/* Left Side - Post Content Skeleton */}
            <div className="md:w-7/12 h-[calc(100vh-64px)] bg-white">
                <div className="animate-pulse">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                            </div>
                            <div className="w-6 h-6 bg-gray-100 rounded"></div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-80 bg-gray-100 w-full"></div>
                    </div>

                    {/* Post Image */}

                    {/* Post Actions */}
                    {/* Post Actions */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            {/* Like button */}
                            <div className="flex items-center rounded-full bg-gray-200 px-4 py-2 w-24">
                                <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                <div className="w-12 h-4 bg-gray-300 rounded"></div>
                            </div>

                            {/* Comment button */}
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            </div>

                            {/* Save button */}
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                                <div className="w-10 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Comments Section Skeleton */}
            <div className="md:w-5/12 h-[calc(100vh-64px)] flex flex-col bg-white md:border-l border-gray-200">
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse">
                    {/* Comment Items */}
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 p-3 bg-white sticky bottom-0 animate-pulse">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                        <div className="flex-1 h-10 bg-gray-100 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPageSkeleton;
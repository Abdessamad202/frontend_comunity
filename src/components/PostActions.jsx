import { ThumbsUp, MessageCircle, Bookmark } from "lucide-react";
import ToggleLikeBtn from "./ToggleLikeBtn";
import ToggleSaveBtn from "./ToggleSaveBtn";

export default function PostActions({ isLiked, isSaved, post, toggleModal }) {
    return (
        <div className="flex justify-between items-center pt-3">
            {/* Like Button */}
            <ToggleLikeBtn isLiked={isLiked} post={post}/>
            {/* Comment Button */}
            <button
                className="flex cursor-pointer items-center px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-200 text-sm font-medium"
                onClick={toggleModal}
                aria-label="Add comment"
            >
                <MessageCircle className="w-4 h-4 sm:mr-2" />
                <div className="hidden sm:block">Comment</div>
            </button>
            <ToggleSaveBtn isSaved={isSaved} post={post}/>
        </div>
    );
}

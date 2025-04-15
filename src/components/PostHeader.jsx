import {useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ProfilePictureLink from "./ProfilePictureLink";
import useUser from "../hooks/useUser";
import DeletePostBtn from "./DeletePostBtn";
import UpdatePostBtn from "./UpdatePostBtn";

export default function PostHeader({ post, handleUpdatePost }) {
    const [showActions, setShowActions] = useState(false);
    const toggleDd = useRef(null);
    
    const { user } = useUser(); // Assuming you have a custom hook to get the user context 
    const toggleDropdown = (e) => {
        e.preventDefault();
        setShowActions(!showActions)
    };

    const isPostOwner = user?.id === post.user_id;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toggleDd.current && !toggleDd.current.contains(event.target)) {
                setShowActions(false); // Fix: Use setShowActions instead of toggleDropdown
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []); // Empty dependency array since toggleDd is a ref
    
    return (
        <div className="flex justify-between items-center mb-3 relative">
            <div className="flex items-center">
                <ProfilePictureLink name={post.user.profile.name} picture={post.user.profile.picture} userId={post.user_id} />
                <div className="ml-3">
                    <div className="font-bold ">{post.user.profile.name}</div>
                    <div className="text-xs text-gray-400 flex items-center">
                        {formatDistanceToNow(post.created_at, { addSuffix: true })}
                    </div>
                </div>
            </div>

            {isPostOwner && (
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        ref={toggleDd}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors"
                        aria-label="Post actions"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {showActions && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <UpdatePostBtn handelUpdatePost={handleUpdatePost} setShowActions={setShowActions}/>
                            <DeletePostBtn postId={post.id} setShowActions={setShowActions}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
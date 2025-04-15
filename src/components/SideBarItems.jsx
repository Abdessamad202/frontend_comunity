import { Users, Bookmark } from "lucide-react";
import { useState } from "react";
import Modal from './Modal';
import ModalHeader from './ModalHeader';
import FriendsModal from './FriendsModal';
import SavedPostsModal from './SavedPostsModal';

export default function SideBarItems({ isLoading }) {
    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
    const [isSavedPostsModalOpen, setIsSavedPostsModalOpen] = useState(false);

    const items = [
        {
            onClick: () => setIsFriendsModalOpen(true),
            label: "Friends",
            icon: Users,
            description: "Connect with your network",
        },
        {
            onClick: () => setIsSavedPostsModalOpen(true),
            label: "Saved",
            icon: Bookmark,
            description: "View your bookmarked content",
        },
    ];

    return (
        <>
            <div className="mt-3 space-y-1">
                {isLoading
                    ? [1, 2].map((index) => (
                        <div
                            key={index}
                            className="flex items-center px-4 py-3 rounded-lg animate-pulse w-full"
                        >
                            <div className="w-5 h-5 bg-gray-300 rounded-md" />
                            <div className="ml-3 space-y-1">
                                <div className="h-4 bg-gray-300 rounded w-24" />
                                <div className="h-3 bg-gray-200 rounded w-36" />
                            </div>
                        </div>
                    ))
                    : items.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className="flex cursor-pointer items-center px-4 py-3 rounded-lg hover:bg-gray-50 group transition-all duration-200 w-full text-left"
                        >
                            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                            <div className="ml-3">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {item.label}
                                </span>
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                        </button>
                    ))}
            </div>

            

        </>
    );
}

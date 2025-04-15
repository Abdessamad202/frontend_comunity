// import { useState } from "react";
import { Link } from "react-router";
import useUser from "../hooks/useUser";
// import FriendsModal from "./FriendsModal";
// import SavedPostsModal from "./SavedPostsModal"; // Import the new modal
import ProfileSummarySkeleton from './ProfileSummarySkeleton';
import ProfileSummary from './ProfileSummary';
import FriendsModal from './FriendsModal';
import SavedPostsModal from './SavedPostsModal';
import { useState } from "react";
import { Bookmark, Users } from "lucide-react";
const LeftSidebar = () => {
  const { user, isLoading } = useUser();
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
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-sm border-r border-gray-100 overflow-y-auto hidden lg:block">
        {/* User Profile Summary */}
        {isLoading ? (
          <ProfileSummarySkeleton /> // Show skeleton while loading
        ) : (
          <Link to={`/profile/${user?.id}`} >
            <ProfileSummary showEmail={false} /> {/* Pass email as false to hide it */}
          </Link>
        )}

        {/* Navigation Menu */}
        <nav className="p-2">
          <div className="mt-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Navigation
            </h3>
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
          </div>
        </nav>

        {/* Footer with app version */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-400">
          App v1.0.2
        </div>
      </aside>
      {/* Modals */}

      {isFriendsModalOpen && (
        <FriendsModal
          toggleModal={() => setIsFriendsModalOpen(false)}
          isModalOpen={isFriendsModalOpen}
        />
        // <FriendsModal user={user} toggleModal={() => setIsFriendsModalOpen(false)} />
      )}

      {isSavedPostsModalOpen && (
        <SavedPostsModal
          toggleModal={() => setIsSavedPostsModalOpen(false)}
          isModalOpen={isSavedPostsModalOpen}
        />
      )}


    </>
  );
};

export default LeftSidebar;
import { useContext } from "react";
// import { UserContext } from "../contexts/UserContext";
import {
  Home,
  User,
  Bell,
  MessageCircle,
  Search,
  Image,
  Link,
  MapPin,
  Calendar,
  Users,
  Bookmark,
  Video,
  ShoppingBag,
  Menu,
  LogOut
} from "lucide-react";
import ProfileSearch from "../components/ProfileSearch";
import FriendRequests from "../components/FriendRequest";
// import SocialPost from "../components/Post";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSide";
import Posts from "../components/Posts";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="pt-16 pb-16 flex">
        {/* Left Sidebar - Fixed */}
        <LeftSidebar />

        {/* Content Area */}
        <div className="flex-1 px-4 lg:ml-64 mt-2.5 lg:mr-80 max-w-2xl mx-auto">
          {/* Create Post */}
          <CreatePost />

          {/* Posts Feed */}
          <div className="space-y-4">
            <Posts />
          </div>
        </div>

        {/* Right Sidebar - Fixed */}
        <aside className="fixed right-0 top-16 w-82.5 h-screen overflow-y-auto hidden lg:block  p-4">
          {/* Friend Requests - Small Panel */}
          <div className="mb-4">

            <ProfileSearch />
          </div>
          <FriendRequests />
        </aside>
      </main>
    </div>
  );
};

export default HomePage;
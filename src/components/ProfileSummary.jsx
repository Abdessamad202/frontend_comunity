import useUser from "../hooks/useUser"; // Custom hook to fetch user data
import ProfilePictureLink from './ProfilePictureLink';
export default function ProfileSummary({ showEmail = false }) {
    const { user } = useUser(); // Fetching user data using the custom hook
    return (
        <div className="p-4 border-b flex items-center space-x-3 border-gray-100">
            <ProfilePictureLink
                userId={user?.id}
                picture={user?.profile?.picture}
                name={user?.profile?.name}
            />
            {/* Profile Picture Link Component */}
            <div>
                <span className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {user?.profile?.name || "User"}
                </span>
                <p className="text-xs text-gray-500">{showEmail ? (user.email) : ("View your profile")}</p>
            </div>
        </div>
    )
}
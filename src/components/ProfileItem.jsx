import { Link } from "react-router";
import ProfilePictureLink from "./ProfilePictureLink";

export default function ProfileItem({ user , setIsOpen }) {
    const { id, profile } = user;   
    return (
        <li onClick={() => setIsOpen(false)}>
            <Link
                to={`/profile/${id}`}
                className="block p-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 overflow-hidden rounded-full">
                        <ProfilePictureLink
                            userId={id}
                            name={profile.name}
                            picture={profile.picture}
                        />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{profile.name}</div>
                        {profile.title && (
                            <div className="text-sm text-gray-500">{profile.title}</div>
                        )}
                    </div>
                </div>
            </Link>
        </li>
    );
}
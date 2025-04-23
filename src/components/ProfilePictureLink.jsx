import { Link } from "react-router";

export default function ProfilePictureLink({ userId, picture, name , isCompactSidebar = false }) {
    return (
        <Link
            to={`/profile/${userId}`} // Route: /profile/{id}
            aria-label={`Visit ${name || "user"}'s profile`}
        >
            <img
                src={picture || "/default-avatar.png"}
                alt={`${name || "User"}'s avatar`}
                className={`${isCompactSidebar ? 'w-8 h-8' : 'w-12 h-12'} hover:ring-2 transition-all hover:ring-indigo-500 rounded-full object-cover border`}
            />
        </Link>
    );
}

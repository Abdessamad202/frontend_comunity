
import ProfilePictureLink from './ProfilePictureLink';
import { Link } from 'react-router';
import { Calendar ,ThumbsUp ,MessageCircle ,Clock} from 'lucide-react';
import { formatDistanceToNow, format } from "date-fns";
import UnsavePostButton from './UnsavePostButton';
export default function SavedPost({post}) {
    const formatDate = (dateString) => {
        try {
          return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (e) {
          return "Unknown date";
        }
      };
    
      const formatSavedAt = (dateString) => {
        try {
          const date = new Date(dateString);
          return {
            relative: formatDistanceToNow(date, { addSuffix: true }),
            exact: format(date, "MMM d, yyyy 'at' h:mm a"),
          };
        } catch (e) {
          return { relative: "Unknown time", exact: "Unknown time" };
        }
      };
      const savedTime = formatSavedAt(post.pivot.created_at || post.updated_at);

    return (
        <div key={post.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            {/* Post author info */}
            <div className="flex items-center mb-3">
                <Link to={`/profile/${post.user_id}`} className="flex items-center">
                    <ProfilePictureLink name={post.user.profile.name} picture={post.user.profile.picture} userId={post.user_id} />
                    <div className="ml-2">
                        <p className="font-medium text-gray-900">
                            {post.user?.profile?.name || "Unknown User"}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                    </div>
                </Link>

                {/* Unsave button */}
                <UnsavePostButton postId={post.id} />
            </div>

            {/* Post content summary */}
            <Link to={`/posts/${post.id}`}>
                <div className="mb-3">
                    <p className="text-gray-800 line-clamp-3">{post.content}</p>
                </div>

                {/* Post image if available */}
                {post.image && (
                    <div className="mb-3 rounded-lg overflow-hidden h-48">
                        <img
                            src={post.image}
                            alt="Post attachment"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    </div>
                )}

                {/* Post stats */}
                <div className="flex flex-wrap items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span>{post.likes_count || 0} likes</span>
                    </div>
                    <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span>{post.comments_count || 0} comments</span>
                    </div>

                    {/* Saved timestamp - new addition */}
                    <div className="flex items-center ml-auto" title={savedTime.exact}>
                        <Clock className="h-3 w-3 mr-1 text-indigo-500" />
                        <span className="text-indigo-500">Saved {savedTime.relative}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
import ProfilePictureLink from "./ProfilePictureLink";
import { useMutation } from '@tanstack/react-query';
import { removeFriend } from './../apis/apiCalls';
import useUser from './../hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from './../contexts/NotificationContext';

export default function FriendItem({ friend, isProfileOwner }) {
  const handleRemoveFriend = () => {
    removeFriendMutation.mutate(friend.id);
  };
  const queryClient = useQueryClient();
  const { id } = queryClient.getQueryData(["user"]);
  const notify = useContext(NotificationContext);
  const isFriend = friend.pivot.user_id == id;
  console.log("FriendItem", friend, isProfileOwner, id, isFriend);
  
  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: (friendId) => removeFriend(friendId),
    onMutate: async (friendId) => {
      await queryClient.cancelQueries(["friends", id]);
      const previousFriends = queryClient.getQueryData(["friends", id]);

      queryClient.setQueryData(["friends", id], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            friends: page.friends.filter((friend) => friend.id !== friendId),
          })),
        };
      });

      return { previousFriends };
    },
    onSuccess: () => {
      notify("success", "Friend removed successfully");
    },
    onError: (err, friendId, context) => {
      queryClient.setQueryData(["friends", id], context.previousFriends);
      notify("error", "Failed to remove friend");
      console.error("Error removing friend:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["friends", id]);
    },
  });
  return (
    <div className="flex items-center space-x-3">
      <ProfilePictureLink
        userId={friend.id}
        picture={friend.profile.picture}
        name={friend.profile.name}
      />
      <div className="flex-1">
        <p className="text-gray-900 font-medium text-sm">
          {friend.profile?.name || "Unknown"}
        </p>
        {friend.profile?.title && (
          <p className="text-gray-600 text-xs">{friend.profile.title}</p>
        )}
      </div>
      {isProfileOwner || isFriend && (
        <button
          onClick={handleRemoveFriend}
          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors"
          disabled={
            removeFriendMutation.isLoading && removeFriendMutation.variables === friend.id
          }
          aria-label={`Remove ${friend.profile?.name || "friend"}`}
        >
          {removeFriendMutation.isLoading && removeFriendMutation.variables === friend.id
            ? "Removing..."
            : "Remove"}
        </button>
      )}

    </div>
  );
}
import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getPostLikers, toggleLikePost, fetchSavedPosts, toggleSavePost } from "../apis/apiCalls";
import { NotificationContext } from "../contexts/NotificationContext";
import useUser from "../hooks/useUser";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostStats from "./PostStats";
import PostActions from "./PostActions";
import CommentsModal from "./CommentsModal";
import UpdatePostModal from "./UpdatePostModal";
import LikersModal from "./LikersModal";
import { Link, useLocation, useParams } from "react-router";

export default function Post({ post, className }) {
    const { user } = useUser();

    // Audio effect
    const { data: likers = [] } = useQuery({
        queryKey: ["likers", post.id],
        queryFn: () => getPostLikers(post.id),
    });

    // Fetch saved posts
    const { data: savedPosts = [] } = useQuery({
        queryKey: ["saved", user.id],
        queryFn: fetchSavedPosts,
    });


    // Derive liked/saved state from query data
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setIsLiked(likers?.some(liker => liker.id === user?.id) || false);
    }, [likers, user]);
    useEffect(() => {
        setIsSaved(savedPosts?.some(saved => saved.id === post?.id) || false);
    }, [savedPosts, post]);

    // UI states
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);



    // Handle body scroll lock when any modal is open
    useEffect(() => {
        if (isCommentsModalOpen || isUpdateModalOpen || isLikesModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isCommentsModalOpen, isUpdateModalOpen, isLikesModalOpen]);




    const toggleCommentsModal = (e) => {
        e.preventDefault();
        setIsCommentsModalOpen((prev) => !prev);
    }
    const toggleUpdateModal = (e) => {
        setIsUpdateModalOpen((prev) => !prev)
        console.log("update modal", isUpdateModalOpen);
    };
    const toggleLikersModal = (e) => {
        e.preventDefault();
        setIsLikesModalOpen((prev) => !prev)
    };
    if (!post) return null;
    return (
        <div className={`bg-white transition-all duration-300 hover:shadow-lg p-4 flex flex-col ${className}`}>

            {/* <Link to={`/posts/${post.id}`} className="flex flex-col flex-grow"> */}
            <PostHeader
                post={post}
                handleUpdatePost={toggleUpdateModal}
            />
            <div className="min-h-[200px] flex-grow">
                <Link to={`/posts/${post.id}`} className="flex flex-col flex-grow">
                    <PostContent post={post} />
                </Link>
            </div>
            {/* </Link> */}
            <PostStats
                likes={post?.likes_count}
                comments={post?.comments_count}
                toggleCommentsModal={toggleCommentsModal}
                toggleLikersModal={toggleLikersModal}
            />
            <PostActions
                isLiked={isLiked}
                isSaved={isSaved}
               post={post}
                toggleModal={toggleCommentsModal}
            />
            {isCommentsModalOpen && (
                <CommentsModal
                    post={post}
                    comments={post?.comments_count}
                    isCommentsModalOpen = {isCommentsModalOpen}
                    toggleModal={toggleCommentsModal}
                />
            )}
            {isUpdateModalOpen && <UpdatePostModal post={post} toggleModal={toggleUpdateModal} isCommentsModalOpen={isUpdateModalOpen} />}
            {isLikesModalOpen && <LikersModal postId={post.id} toggleModal={toggleLikersModal } />}
        </div>
    );
}
import { Link } from "react-router";
import { Post } from "./PostList";

import { useAuth } from "@/context/AuthContext";
import PostStats from "./PostStats";

interface Props {
  post: Post;
}

const getTimeAgo = (timestamp: string | number | Date): string => {
  const now = new Date();
  const postDate = new Date(timestamp); // Converts string/number to Date
  const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (secondsAgo < 5) return "Just now";
  if (secondsAgo < 60) return `${secondsAgo}s`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}min `;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h `;
  if (secondsAgo < 7 * 86400) return `${Math.floor(secondsAgo / 86400)}d`;
  if (secondsAgo < 30 * 86400)
    return `${Math.floor(secondsAgo / (7 * 86400))}w`;
  if (secondsAgo < 365 * 86400)
    return `${Math.floor(secondsAgo / (30 * 86400))}m`;
  return `${Math.floor(secondsAgo / (365 * 86400))}yr`;
};

export const PostItem = ({ post }: Props) => {
  const { user } = useAuth();

  return (
    <div className="relative group px-4 min-h-screen">
      <div className=" pointer-events-none flex flex-row items-center"></div>

      <div className="border-b border-gray-900 rounded-lg shadow-sm max-w-[470px] mx-auto my-2 ">
        {/* Header: Avatar and Title */}
        <div className="flex items-center space-x-2 overflow-auto  ">
          <Link
            to={`/profile/${post.creator_id}`}
            className="block relative z-10"
          >
            {post.image_url ? (
              <img
                src={
                  post.profiles?.profile_photo ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="User Avatar"
                className="w-[45px] h-[45px] rounded-full object-cover"
              />
            ) : (
              <img
                src={
                  post.profiles?.profile_photo ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="User Avatar"
                className="w-[45px] h-[45px] rounded-full object-cover"
              />
            )}
          </Link>

          <div className="flex flex-col flex-1">
            <div className="text-[18px] leading-[22px] font-semibold ">
              {post.profiles?.username || "User"}
              <span className="text-[16px] text-gray-400 font-normal">
                {" "}
                •{" "}
                {post.created_at ? getTimeAgo(post.created_at) : "Unknown date"}
              </span>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 font-normal">
                {post.location || ""}
              </p>
            </div>
          </div>

          {/* edit button */}

          <Link
            to={`/update-post/${post.id}`}
            className={`${user?.id !== post.creator_id && "hidden"}`}
          >
            <img
              src="/assets/icons/edit.svg"
              alt="More Options"
              className="w-[20px] h-[20px] object-cover "
            />
          </Link>
        </div>

        {/* Image Banner */}

        <div className="mt-2 flex-1 border border-gray-900 ">
          <img
            src={post.image_url}
            alt="Post Image"
            className="w-full aspect-[4/5] object-cover mx-auto py-1.5"
          />
        </div>

        <PostStats postId={post.id} />

        {/* Caption */}
        <div className=" leading-[140%] lg:base-medium py-5 flex gap-2">
          <p className="font-bold">{post.profiles?.username || "User"} </p>
          <p>{post.caption}</p>
        </div>
      </div>
    </div>
  );
};

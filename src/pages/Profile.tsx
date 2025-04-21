import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase-client";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const Profile = () => {
  const { user, profile } = useAuth();
  const { id } = useParams();
  const [posts, setPosts] = useState<any[]>([]);

  const isCurrentUser = user?.id === id;

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("creator_id", id);
    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  useEffect(() => {
    if (id) fetchPosts();
  }, [id]);

  return (
    <div className="min-h-screen flex justify-center w-full px-4 pt-10 pb-20 custom-scrollbar">
      <div className="w-full max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="flex items-center gap-5 mb-8 w-full max-w-2xl p-6 mt-10 md:p-10 rounded-2xl shadow-lg border border-white/30">
          <img
            src={profile.profilePhoto || "/default-avatar.png"}
            alt="profile"
            className="w-20 h-20 rounded-full border border-white/80 shadow-sm object-cover"
          />
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{profile.username}</p>
            <p className="text-sm text-gray-500">@{profile.username}</p>
          </div>
          {isCurrentUser && (
            <Link to={`/edit-profile/${id}`} className="ml-auto">
              <img
                src="/assets/icons/edit.svg"
                width={24}
                height={24}
                className="cursor-pointer hover:scale-110 transition-transform"
                alt="edit"
              />
            </Link>
          )}
        </div>

        {/* Posts Section */}
        <div className="mt-6">
          <h2 className="h3-bold font-bold mb-4">All Posts</h2>
          {/* Placeholder for posts */}
          <div>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#1F1F22] p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                  >
                    <h3 className="font-semibold  mb-2">
                      {post.location || "Untitled Post"}
                    </h3>
                    <img
                      src={post.image_url}
                      alt="post"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm  line-clamp-3">
                      {post.caption || "No content available..."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

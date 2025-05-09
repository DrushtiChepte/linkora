import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase-client";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import Loader from "@/components/Loader";

type Post = {
  id: string;
  image_url: string;
  caption: string;
  location?: string;
};

type Profile = {
  id: string;
  username: string;
  profile_photo?: string;
};

const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileData, setProfile] = useState<Profile | null>(null);

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

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPosts();
      fetchProfile();
    }
  }, [id]);

  const handleDelete = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error("Error deleting post:", error.message);
    } else {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully!");
    }
  };
  if (!profileData) {
    return (
      <div className="text-center mt-20 text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center w-full px-4 pt-10 pb-20 custom-scrollbar">
      <div className="w-full max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="flex items-center gap-5 mb-8 w-full max-w-2xl p-6 mt-10 md:p-10 rounded-2xl shadow-lg border border-white/30">
          <img
            src={
              profileData.profile_photo ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-20 h-20 rounded-full border border-white/80 shadow-sm object-cover"
          />
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{profileData.username}</p>
            <p className="text-sm text-gray-500">@{profileData.username}</p>
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
                    <div className="flex items-center justify-between ">
                      <h3 className="font-semibold  mb-2">
                        {post.location || "Untitled Post"}
                      </h3>
                      {isCurrentUser && (
                        <Button
                          onClick={() => handleDelete(post.id)}
                          className="mb-2 cursor-pointer"
                        >
                          <img
                            src="/assets/icons/delete.svg"
                            alt="delete btn"
                          />
                        </Button>
                      )}
                    </div>
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

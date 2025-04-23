import { PostItem } from "@/components/PostItem";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Post } from "@/components/PostList";
import Loader from "@/components/Loader";

interface SavedPost {
  id: string;
  posts: Post;
}

const SavedPosts = () => {
  const { user, isLoading } = useAuth();

  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  const fetchSavedPosts = async () => {
    const { data: savedPosts, error } = await supabase
      .from("liked_posts")
      .select(
        `
    *,
    posts: post_id (
      *,
      profiles:creator_id (
        id,
        username,
        profile_photo
      )
    )
  `
      )
      .eq("user_id", user?.id)
      .eq("is_saved", true);

    if (error) {
      console.error("Error fetching saved posts:", error);
      toast.error("Error fetching saved posts");
    } else {
      setSavedPosts(savedPosts);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      fetchSavedPosts();
    } else if (isLoading) {
      <Loader />;
    }
  }, [isLoading, user]);

  return (
    <div className="saved-container custom-scrollbar max-h-screen  ">
      <h2 className="pages_heading">Saved Posts</h2>

      <div className="flex flex-col gap-5 mt-4">
        {savedPosts.length > 0 ? (
          savedPosts.map((item) => <PostItem key={item.id} post={item.posts} />)
        ) : (
          <p className="text-center body-bold text-[#ffffff90]">
            No saved posts yet
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;

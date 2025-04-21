import { useAuth } from "@/context/AuthContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import { toast } from "sonner";

interface PostStatsProps {
  postId: number;
}

interface PostStats {
  id: number;
  post_id: number;
  user_id: string;
  is_liked: boolean;
  is_saved: boolean;
}

const PostStats = ({ postId }: PostStatsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  //fetch likes
  const { data: likes = [] } = useQuery<PostStats[]>({
    queryKey: ["liked_posts", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("liked_posts")
        .select("*")
        .eq("post_id", postId)
        .eq("is_liked", true);
      if (error) throw new Error(error.message);
      return data;
    },
    refetchInterval: 5000,
  });

  //fetch saved posts
  const { data: savedPosts = [] } = useQuery<PostStats[]>({
    queryKey: ["saved_posts", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("liked_posts")
        .select("*")
        .eq("post_id", postId)
        .eq("is_saved", true);
      if (error) throw new Error(error.message);
      return data;
    },
    refetchInterval: 5000,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const { data: existingLike } = await supabase
        .from("liked_posts")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user?.id)
        .eq("is_liked", true)
        .maybeSingle();

      if (existingLike) {
        // Toggle is_liked: true -> false or false -> true
        return await supabase
          .from("liked_posts")
          .delete()
          .eq("id", existingLike.id);
      } else {
        // Insert a new entry if nothing exists
        return await supabase.from("liked_posts").insert([
          {
            post_id: postId,
            user_id: user?.id,
            is_liked: true,
            is_saved: false,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liked_posts", postId] });
    },
  });

  const { mutate: toggleSave } = useMutation({
    mutationFn: async () => {
      const { data: existingSave } = await supabase
        .from("liked_posts")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user?.id)
        .eq("is_saved", true)
        .maybeSingle();

      if (existingSave) {
        return await supabase
          .from("liked_posts")
          .delete()
          .eq("id", existingSave.id);
      } else {
        return await supabase.from("liked_posts").insert([
          {
            post_id: postId,
            user_id: user?.id,
            is_liked: false,
            is_saved: true,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_posts", postId] });
    },
  });

  const userLiked = likes.some((like) => like.user_id === user?.id);
  const userSaved = savedPosts.some((post) => post.user_id === user?.id);

  return (
    <div className="pt-2 flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={userLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={22}
          height={22}
          onClick={() => {
            if (!user) {
              toast.error("Please login to like posts");
              return;
            }
            toggleLike();
          }}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 mr-2">
        <img
          src={userSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={22}
          height={22}
          onClick={() => toggleSave()}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;

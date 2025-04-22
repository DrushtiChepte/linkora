import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import Loader from "./Loader";

export interface Post {
  id: number;
  location: string;
  caption: string;
  image_url: string;
  created_at: string;
  creator_id: string;
  profiles: {
    username: string;
    profile_photo: string;
  };
}

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:creator_id (
        username,
        profile_photo
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as any[]; // We'll fix type next
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="h-14">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-h-[500px] scrollbar-none">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

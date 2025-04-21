import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

interface postInput {
  location: string;
  caption: string;
}

const updatePost = async (updatedPost: postInput, postId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("posts")
    .update({
      location: updatedPost.location,
      caption: updatedPost.caption,
    })
    .eq("id", postId);

  if (error) throw new Error(error.message);

  return data;
};

export const EditPost = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setLocation(data.location || "");
        setCaption(data.caption || "");
      }

      if (error) {
        console.error("Error fetching post (update post):", error.message);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: postInput) => {
      return updatePost(data, id as string);
    },
    onSuccess: () => {
      toast("Post updated successfully! ✅");
      Navigate("/");
    },
    onError: (err: any) => {
      toast.error("Something went wrong while updating! 💥");
      console.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    mutate({ location, caption });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl w-full px-4 space-y-8">
      <div>
        <label className="block mb-2 font-medium text-sm sm:text-base">
          Location (Optional)
        </label>
        <input
          type="text"
          id="location"
          placeholder="Enter post location"
          className="w-full border border-white/10 bg-transparent p-2 rounded text-sm sm:text-base"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="caption"
          className="block mb-2 font-medium text-sm sm:text-base"
        >
          Caption
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          required
        />
      </div>
      <div>
        <Button
          type="submit"
          className="gradient_button w-full sm:w-auto text-sm sm:text-base"
        >
          {isPending ? "Updating..." : "Update Post"}
        </Button>

        {isError && <p className="text-red-500"> Error updating post.</p>}
      </div>
    </form>
  );
};

import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { supabase } from "../supabase-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface postInput {
  location: string;
  caption: string;
}

const createPost = async (post: postInput, imageFile: File) => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!userData) throw new Error("User not authenticated");

  const filePath = `${user?.id}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-image")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-image")
    .getPublicUrl(filePath);

  const { data, error } = await supabase.from("posts").insert({
    ...post,
    image_url: publicURLData.publicUrl,
    creator_id: user?.id,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [location, setLocation] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const Navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: postInput; imageFile: File }) =>
      createPost(data.post, data.imageFile),
    onSuccess: () => {
      toast.success("Post created successfully!");
      Navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create post.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({ post: { location, caption }, imageFile: selectedFile });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-sm sm:text-base">
          Upload Image
        </label>
        <input
          id="image"
          placeholder="Upload image"
          accept="image/*"
          type="file"
          className="w-full text-gray-200 text-sm sm:text-base"
          required
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div className="w-full">
            <p className="mb-2 text-sm sm:text-base font-medium">Preview:</p>
            <img
              src={previewUrl}
              alt="Image Preview"
              className="rounded-lg max-h-96 w-full object-cover border border-white/10"
            />
          </div>
        )}
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
          {isPending ? "Creating..." : "Create Post"}
        </Button>

        {isError && <p className="text-red-500"> Error creating post.</p>}
      </div>
    </form>
  );
};

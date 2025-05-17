import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
  const { user, profile, setProfile, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && profile && !profile.username) {
      console.log("Modal shown: profile incomplete after full load");
      setIsOpen(true);
    }
  }, [user, profile, isLoading]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return;

    let profilePhoto = null;
    if (file) {
      const filePath = `${user.id}/${file.name}`;
      const { error } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, file, {
          upsert: true,
        });
      if (error) {
        console.error("Error uploading file:", error.message);
        return;
      }
      const { data } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filePath);
      profilePhoto = data?.publicUrl || null;
    }

    await supabase.from("profiles").upsert({
      email: user.email,
      username,
      profile_photo: profilePhoto,
      id: user.id,
    });

    const { data: updatedProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (updatedProfile && !fetchError) {
      setProfile(updatedProfile); // ✅ update context state
    }

    setIsOpen(false);
    navigate("/");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <DialogPanel className=" rounded-2xl bg-black/70 shadow-xl p-4 sm:p-6 w-[90vw] max-w-md space-y-10">
        <DialogTitle className="text-4xl font-bold text-center bg-gradient-to-r from-[#2a5d44] to-[#3e8d69] bg-clip-text text-transparent">
          Complete Your Profile
        </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block pb-2 text-md font-medium">Username</label>
            <input
              className="w-full p-2 border border-white/10 rounded-xl dark:bg-zinc-800"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-16 h-16 rounded-full object-cover border"
              />
            )}
          </div>

          <button type="submit" className="w-full gradient_button">
            Save Profile
          </button>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

export default CreateProfile;

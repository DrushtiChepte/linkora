import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, profile, setProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    profile?.profilePhoto || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
    if (profile?.profilePhoto) {
      setPreview(profile.profilePhoto);
    }
  }, [profile]);

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

    let profilePhoto = profile?.profilePhoto || null;
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
      id: user.id,
      email: user.email,
      username,
      profile_photo: profilePhoto,
    });

    const { data: updatedProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (updatedProfile && !fetchError) {
      setProfile(updatedProfile);
    }

    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center mt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full px-4  space-y-10 "
      >
        <h1 className="pages_heading">Edit Profile</h1>

        <div>
          <label className="block mb-2 font-medium text-sm sm:text-base text-white">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
            className="w-full border border-white/10 bg-transparent p-2 rounded text-white placeholder:text-white/60 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm sm:text-base text-white">
            Profile Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full text-gray-200 text-sm sm:text-base"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-16 h-16 rounded-full object-cover border border-white/20"
            />
          )}
        </div>

        <div>
          <button
            type="submit"
            className="gradient_button w-full sm:w-auto text-sm sm:text-base"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

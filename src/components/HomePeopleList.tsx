import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase-client";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const HomePeopleList = () => {
  const { user, isLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());

  //fetch all th users
  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
    console.log(data);
    return data;
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoadingUsers(true);
      const data = await fetchAllUsers();
      if (data) setProfiles(data);
      setLoadingUsers(false);
    };

    getUsers();
  }, []);

  const handleClick = (profileId: string) => {
    setFollowingSet((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  return (
    <div className="custom-scrollbar h-screen">
      <div className="">
        <h3 className="h3-bold text-center py-4">People you may know</h3>
        {isLoading || loadingUsers ? (
          <Loader />
        ) : (
          <ul className="grid grid-cols-3 space-y-4 p-5">
            {profiles.map(
              (profile) =>
                user?.id !== profile.id && (
                  <li key={profile.id} className="w-full">
                    <div className="bg-[#09090A] rounded-xl shadow-md w-35 h-35 flex flex-col items-center pt-3 text-center">
                      <Link to={`/profile/${profile.id}`}>
                        <img
                          src={
                            profile.profile_photo ||
                            "/assets/icons/profile-placeholder.svg"
                          }
                          alt="Profile"
                          className="w-15 h-15 rounded-full object-cover mb-2"
                        />
                      </Link>
                      <h3 className="text-sm font-semibold text-[#ffffffe3]">
                        {profile.username || "Unknown User"}
                      </h3>
                      <button
                        onClick={() => handleClick(profile.id)}
                        className={`w-full py-0.5 mt-2 sm:w-auto text-sm sm:text-base rounded-md px-4 transition duration-300 ${
                          followingSet.has(profile.id)
                            ? "bg-[#09090A] border-1 text-white"
                            : "gradient_button text-white"
                        }`}
                      >
                        {followingSet.has(profile.id) ? "Following" : "Follow"}
                      </button>
                    </div>
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePeopleList;

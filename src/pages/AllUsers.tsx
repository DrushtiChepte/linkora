import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AllUsers = () => {
  const { user, isLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

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
      if (data) setProfiles(data); // ✅ Fixed: store data into state
      setLoadingUsers(false);
    };

    getUsers();
  }, []);

  return (
    <div className="common-container custom-scrollbar h-screen">
      <div className="">
        <h2 className="pages_heading pb-2">People</h2>
        {isLoading || loadingUsers ? (
          <Loader />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {profiles.map(
              (profile) =>
                user?.id !== profile.id && (
                  <li key={profile.id} className="w-full">
                    <div className="bg-[#09090A] rounded-xl shadow-md w-50 h-50 flex flex-col items-center p-10 text-center">
                      <img
                        src={
                          profile.profile_photo ||
                          "/assets/icons/profile-placeholder.svg"
                        }
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover mb-4"
                      />
                      <h3 className="text-lg font-semibold text-[#ffffffd3]">
                        {profile.username || "Unknown User"}
                      </h3>
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

export default AllUsers;

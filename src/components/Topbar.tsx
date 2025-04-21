import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signOut, profile } = useAuth();

  const userImage =
    profile.profilePhoto || "/assets/icons/profile-placeholder.svg";

  const handleSignOut = async () => {
    await signOut(); // Wait for sign out
    navigate("/"); // Redirect to home or login page
  };

  return (
    <section className="topbar">
      <div className="flex justify-between py-2 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src="\linkora.svg" alt="logo" width={130} height={325} />
        </Link>

        <div className="flex gap-4 items-center">
          <div className="md:flex flex-col items-start space-y-4">
            {user ? (
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <img src="/assets/icons/logout.svg" alt="logout" />
              </Button>
            ) : (
              <Button
                variant={"ghost"}
                onClick={signInWithGoogle}
                className="bg-white text-black rounded-full flex items-center "
              >
                <img
                  src="/assets/icons/google.svg"
                  alt="Google icon"
                  className="h-5 w-5"
                />
                <span className="text-sm sm:text-base py-2">Sign in</span>
              </Button>
            )}
          </div>

          <Link to={"/"} className="flex-center gap-3 items-center">
            <img
              src={userImage}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;

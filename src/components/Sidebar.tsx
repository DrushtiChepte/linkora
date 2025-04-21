import { Link, NavLink, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

import { Button } from "./ui/button";
import { sidebarLinks } from "@/constants";
import { CompleteProfile } from "@/pages";

interface INavLink {
  imgURL: string;
  route: string;
  label: string;
}

export const Sidebar = () => {
  const { signInWithGoogle, signOut, user, profile } = useAuth();
  const { pathname } = useLocation();

  const userImage = user?.user_metadata.avatar_url || "/default-avatar.png";
  const userName =
    user?.user_metadata.user_name || user?.user_metadata.full_name || "User";

  return (
    <nav className="leftsidebar h-screen ">
      <div className="flex flex-col gap-11">
        {/* Logo */}
        <div>
          <Link to={"/"} className="flex gap-3 items-center">
            <img src="/linkora.svg" alt="Linkora Logo" className="h-20" />
          </Link>

          {user ? (
            <Link
              to={`/profile/${user.id}`}
              className="flex gap-3 items-center py-4 pb-6 cursor-pointer "
            >
              <img
                src={
                  profile.profilePhoto ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <p className="body-bold">{userName || "User"}</p>
                <p className="small-regular">@{profile.username || "User"}</p>
              </div>
            </Link>
          ) : (
            <div className="flex gap-3 items-center py-4 pb-6 ">
              <img
                src={
                  profile.profilePhoto ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <p className="body-bold">Guest</p>
                <p className="small-regular text-[14px] text-light-3">
                  Sign in
                </p>
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link: INavLink) => {
              const isActive = pathname === link.route;

              return (
                <li
                  key={link.label}
                  className={`leftsidebar-link group ${
                    isActive && "bg-[#2a5d44]"
                  } `}
                >
                  <NavLink
                    to={link.route}
                    className="flex gap-4 items-center p-3"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`filter group-hover:invert group-hover:brightness-0
                         ${isActive ? "invert-white" : ""}`}
                    />
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Desktop Auth */}
      <div className="hidden md:flex flex-col items-start space-y-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <img
              src={userImage}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-300">{userName}</span>
            <button onClick={signOut} className="relative group">
              <img
                src="/assets/icons/logout.svg"
                alt="Sign Out"
                className="w-5 h-5 cursor-pointer"
              />
              <span className="absolute whitespace-nowrap left-13 -top-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 transition-opacity">
                Sign Out
              </span>
            </button>
          </div>
        ) : (
          <Button
            variant={"ghost"}
            onClick={signInWithGoogle}
            className="bg-white text-black  rounded-full cursor-pointer hover:bg-zinc-200 transition duration-200"
          >
            <img
              src="/assets/icons/google.svg"
              alt="Google icon"
              className="h-5 w-5"
            />
            <span className="text-sm sm:text-base mb-[2.5px]">
              Sign in with Google
            </span>
          </Button>
        )}
        <CompleteProfile />
      </div>
    </nav>
  );
};

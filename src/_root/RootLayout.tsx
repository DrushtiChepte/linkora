import Topbar from "@/components/Topbar";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Bottombar from "@/components/Bottombar";

const RootLayout = () => {
  return (
    <div className="w-full md:flex min-h-screen ">
      <Topbar />
      <Sidebar />

      <section className="flex flex-1 overflow-y-auto">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;

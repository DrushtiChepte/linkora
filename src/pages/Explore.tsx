import { Input } from "@headlessui/react";
import { useState } from "react";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="explore-container custom-scrollbar min-h-screen">
      <div className="explore-inner_container">
        <h2 className="pages_heading">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-[#1F1F22] ">
          {" "}
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search..."
            className="explore-search "
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center w-full max-w-5xl mt-7 mb-7">
          <h3 className="h3-bold"> Popular Today</h3>
          <div className="flex justify-center items-center gap-3 bg-[#101012] rounded-xl px-4 py-2 cursor-pointer">
            <p className="small-medium md:base-medium text-[#EFEFEF]">All</p>
            <img
              src="/assets/icons/filter.svg"
              width={20}
              height={20}
              alt="filter"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

import HomePeopleList from "@/components/HomePeopleList";
import { PostList } from "@/components/PostList";

const Home = () => {
  return (
    <div className="flex w-full">
      <div className="w-full md:w-2/3 home-container custom-scrollbar h-screen ">
        <h2 className="pages_heading pt-2 md:pt-4"> Recent Posts</h2>
        <PostList />
      </div>
      <div className="hidden md:block  md:w-1/3">
        <HomePeopleList />
      </div>
    </div>
  );
};

export default Home;

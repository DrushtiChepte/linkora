import { PostList } from "@/components/PostList";

const Home = () => {
  return (
    <div className="home-container custom-scrollbar ">
      <h2 className="pages_heading pt-2 md:pt-4"> Recent Posts</h2>
      <PostList />
    </div>
  );
};

export default Home;

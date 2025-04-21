import { CreatePost } from "../components/CreatePost";

const CreatePostPage = () => {
  return (
    <div className="md:pt-20 py-4 mx-auto w-full max-w-2xl">
      <h2 className="pages_heading">Create New Post</h2>
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;

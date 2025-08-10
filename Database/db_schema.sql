-- Table: profiles
-- Stores user profile details with unique usernames and emails
CREATE TABLE public.profiles (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  username text NOT NULL UNIQUE,
  profile_photo text NOT NULL,
  email text,
  auth_id uuid UNIQUE,
  id uuid NOT NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Table: posts
-- Stores posts created by users including caption, image, and location
CREATE TABLE public.posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  caption text NOT NULL,
  image_url text NOT NULL,
  location text,
  creator_id uuid NOT NULL,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
);

-- Table: liked_posts
-- Tracks user interactions such as likes and saved posts
CREATE TABLE public.liked_posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  post_id bigint NOT NULL,
  user_id uuid NOT NULL,
  is_liked boolean NOT NULL,
  is_saved boolean NOT NULL,
  CONSTRAINT liked_posts_pkey PRIMARY KEY (id),
  CONSTRAINT liked_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

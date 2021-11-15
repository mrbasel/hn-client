import { Box, Button, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Route } from "react-router-dom";

import PostItem from "./PostItem";
import Post from "../interfaces/Post";
import { capitalizeFirstLetter } from "../utils";
import savedPostsStorage from "../savedPostsStorage";

interface PostsListProps {
  posts: Post[];
  getPosts: (page: string) => void;
  postsType: "top" | "ask" | "show" | "newest" | "jobs";
  setSavedPosts: (postIds: number[]) => void;
  savedPosts: number[];
}

function PostsList(props: PostsListProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (props.posts.length === 0) props.getPosts(page.toString());
    props.setSavedPosts(savedPostsStorage.loadPosts());
  }, []);

  const savePost = (postId: number) => {
    const idsString = localStorage.getItem("posts");
    let posts: number[] = [];

    if (idsString != null) posts = JSON.parse(idsString);

    if (posts.includes(postId)) posts.splice(posts.indexOf(postId), 1);
    else posts.push(postId);

    props.setSavedPosts(posts);
    localStorage.setItem("posts", JSON.stringify(posts));
  };

  useEffect(() => {
    if (props.postsType === "top") document.title = "HN App";
    else document.title = `${capitalizeFirstLetter(props.postsType)} - HN`;
  }, []);

  // Fetch posts each time page changes
  useEffect(() => {
    if (page !== 1) props.getPosts(page.toString());
  }, [page]);

  // Show loading spinner if posts havent loaded yet
  if (props.posts.length === 0) {
    return (
      <Center height="90vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Route path="/" key="root">
      <Box maxW="960px" mx="auto" mt="8" p={4} color="white">
        {props.posts.map((post: Post, i: number) => (
          <PostItem
            key={post.id}
            index={i}
            post={post}
            isSaved={props.savedPosts.includes(post.id)}
            savePost={savePost}
          />
        ))}

        <Center>
          <Button
            display={page > 5 ? "none" : "block"}
            mt="4"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Load more
          </Button>
        </Center>
      </Box>
    </Route>
  );
}

export default PostsList;

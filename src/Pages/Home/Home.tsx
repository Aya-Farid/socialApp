import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import type { PostType } from "./../../Types/Post.type";
import Post from "./../../Components/Post/Post";
import Loader from './../../Components/Loader/Loader';
import { useQuery } from "@tanstack/react-query";
import PostCreation from './../../Components/PostCreation/PostCreation';
import { Helmet } from "react-helmet-async";
import FollowSuggestions from    "./../../Components/FollowSuggestions/FollowSuggestions";
export default function Home() {
    // const [allPosts, setallPosts] = useState([]);
    // const [isLoading, setisLoading] = useState(true);
    // const [isError, setisError] = useState(false);

    function getAllPosts() {
        return axios
        .get("https://route-posts.routemisr.com/posts?sort=-createdAt", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        })



        // .then((res) => {
        //     console.log(res.data.data.posts);
        //     setallPosts(res.data.data.posts);
        // })
        // .catch((err) => {
        //     console.log(err);
        //     setisError(true);
        // })
        // .finally(() =>{
        //     setisLoading(false);
        // })
    }


    const {data, isLoading, isError, error, isFetching} = useQuery({
        queryKey : ["getAllPosts"],
        queryFn : getAllPosts
    })

    // useEffect(() => {
    //     getAllPosts();

    //     return () => {};
    // }, []);

    if (isLoading) {
        return <Loader />
    }
    if(isError){
        return <h1>{error.message}</h1>
    }

    return <>
        <Helmet>
            <title>Home</title>
        </Helmet>

        <FollowSuggestions />

        <div className="my-8">
            <div className="w-[60%] mx-auto">
                <PostCreation />
            </div>

            {data?.data.data.posts.map((post: PostType) => (
                <Post
                    post={post}
                    key={post.id}
                    isPostDetails={false}
                />
            ))}
        </div>
    </>

    }

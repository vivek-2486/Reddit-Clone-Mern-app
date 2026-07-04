import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

function Home() {
  const nav = useNavigate();
  const serverUrl = "http://localhost:3000/";
  const { user } = useAuth();

  const [yourCommunities, setYourCommunities] = useState([]);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const limit = 10;

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);

  const getYourCommunities = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${serverUrl}api/subreddit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setYourCommunities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getYourCommunities();
  }, []);

  const getFeed = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${serverUrl}api/post/feed?page=${pageRef.current}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const feed = res.data.feed;

      if (feed.length < limit) {
        hasMoreRef.current = false;
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...feed]);

      pageRef.current++;
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getFeed();
    }
  }, [user, getFeed]);


  const observerRef = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMoreRef.current) {
            getFeed();
          }
        },
        {
          root: null,
          threshold: 0,
          rootMargin: "200px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleUpVote = async (postID) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${serverUrl}api/post/${postID}/upVote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) => (post._id === postID ? res.data.post : post))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownVote = async (postID) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${serverUrl}api/post/${postID}/downVote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) => (post._id === postID ? res.data.post : post))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      
      <div className="mx-3 w-full">
        {posts.map((post, index) => {
          const hasUpVoted = user && post.upVotes.includes(user._id);
          const hasDownVoted = user && post.downVotes.includes(user._id);
          const isLastElement = posts.length === index + 1;

          return (
            <div
              key={post._id}
              ref={isLastElement ? lastPostElementRef : null}
              className="border border-neutral-700 rounded-lg p-4 my-4 bg-green-900 cursor-pointer"
              onClick={() => nav(`/p/${post._id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <span className="text-sm text-neutral-400">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
                <span>Posted by: {post.creator.username}</span>
              </div>

              <p className="text-neutral-200 whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              <hr className="border-neutral-700 mb-3" />

              <div className="flex gap-6 items-center">
                <button
                  className={`transition ${
                    hasUpVoted ? "text-orange-500" : "hover:text-orange-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpVote(post._id);
                  }}
                >
                  ⬆ {post.upVotes.length}
                </button>

                <button
                  className={`transition ${
                    hasDownVoted ? "text-blue-500" : "hover:text-blue-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownVote(post._id);
                  }}
                >
                  ⬇ {post.downVotes.length}
                </button>

                <button
                  className="hover:text-green-500 transition"
                 
                 >
                  💬 Comments
                </button>
              </div>
            </div>
          );
        })}

    
        {loading && (
          <div className="text-center my-6 text-neutral-400 w-full block">
            Getting posts...
          </div>
        )}

        {!hasMore && (
          <div className="text-center my-6 text-neutral-500 w-full block">
            No more posts
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
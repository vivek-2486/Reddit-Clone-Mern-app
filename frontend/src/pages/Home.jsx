import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";

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

      <div className="max-w-3xl mx-auto px-4">
        {posts.map((post, index) => {
          const hasUpVoted = user && post.upVotes.includes(user._id);
          const hasDownVoted = user && post.downVotes.includes(user._id);
          const isLastElement = posts.length === index + 1;

          return (
            <div
              key={post._id}
              onClick={() => nav(`/p/${post._id}`)}
              className="my-5 cursor-pointer rounded-xl border border-orange-200 bg-white p-5 shadow-sm transition-all hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h2>

                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span>
                      Posted by{" "}
                      <span className="font-medium text-gray-700">
                        {post.creator.username}
                      </span>
                    </span>

                    <span>•</span>

                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>

            
              </div>

              {/* Content */}
              <p className="mb-4 whitespace-pre-wrap leading-7 text-gray-700">
                {post.content}
              </p>

              {post.image?.url && (
                <img
                  src={post.image.url}
                  alt="post"
                  className="mb-5 max-h-[450px] w-full rounded-lg border border-gray-200 object-cover"
                />
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center gap-2">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpVote(post._id);
                    }}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 transition ${hasUpVoted
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                  >
                    ⬆ {post.upVotes.length}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownVote(post._id);
                    }}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 transition ${hasDownVoted
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                  >
                    ⬇ {post.downVotes.length}
                  </button>

                  <button className="rounded-lg px-3 py-2 text-gray-600 transition hover:bg-green-50 hover:text-green-600">
                    💬 Comments
                  </button>

                </div>
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
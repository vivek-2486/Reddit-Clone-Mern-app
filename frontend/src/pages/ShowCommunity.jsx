import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import logo from '../assets/icon-reddit.png'
import { useOutletContext } from 'react-router';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router';
import Modal from '../components/CreatePostModal'
import { Trash2 } from 'lucide-react';

function ShowCommunity() {
  const { name } = useParams();
  const nav = useNavigate()
  const { user } = useAuth()
  const serverUrl = 'http://localhost:3000/'
  const { getFollowingCommunities, getYourCommunities } = useOutletContext()
  const [subId, setSubId] = useState("")
  const [followers, setFollowers] = useState(0)
  useEffect(() => {
    if (user) {
      getCommunity();
    }
  }, [name, user]);
  useEffect(() => {
    if (subId) {
      fetchPost();
    }
  }, [subId]);
  const [about, setAbout] = useState("")
  const [image, setImage] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [date,setDate] = useState("")

  const getCommunity = async () => {
    try {
      const url = `${serverUrl}api/subreddit/${name}`
      const token = localStorage.getItem('token')
      const comm = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (user._id === comm.data.creator) {
        setIsAdmin(true)
      }
      else setIsAdmin(false)
      setDate(new Date(comm.data.createdAt).toLocaleDateString())
      setImage(comm.data.image.url)
      setSubId(comm.data._id)
      const isMember = comm.data.followers.includes(user._id)
      setJoin(isMember)
      setAbout(comm.data.description)
      console.log(comm.data.followers.length)
      setFollowers(comm.data.followers.length)
      console.log(comm)
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Community not found");
        nav("/home");
        return;
      }

      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }
  const [join, setJoin] = useState(false)
  const handleJoin = async () => {
    setJoin(!join)
    try {
      const token = localStorage.getItem('token')
      const url = `${serverUrl}api/subreddit/${subId}/join`
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setFollowers(res.data.sub.followers.length)
      getFollowingCommunities()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete() {
    try {
      const url = `${serverUrl}api/subreddit/${name}/delete`
      const token = localStorage.getItem('token')
      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getFollowingCommunities()
      getYourCommunities()
      nav('/home')
    } catch (error) {
      console.error(error)
    }
  }

  const [posts, setPosts] = useState([])
  const fetchPost = async () => {
    try {
      const url = `${serverUrl}api/post/${subId}`
      const token = localStorage.getItem('token')
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPosts(res.data)
    } catch (error) {
      console.error(error)
    }
  }


  const deletePost = async (postID) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;
    try {
      const url = `${serverUrl}api/post/${postID}/delete`
      const token = localStorage.getItem('token')
      const post = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setPosts(prev => prev.filter(post => post._id !== postID));

    } catch (error) {
      console.error(error)
    }
  }

  const handleUpVote = async (postID) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${serverUrl}api/post/${postID}/upVote`
      const res = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPosts(prev => prev.map(post => post._id === postID ? res.data.post : post))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownVote = async (postID) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${serverUrl}api/post/${postID}/downVote`
      const res = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPosts(prev => prev.map(post => post._id === postID ? res.data.post : post))
    } catch (error) {
      console.error(error)
    }
  }
  return (
  <div className="w-full min-h-screen bg-orange-50 p-6">
    <div className="max-w-5xl mx-auto rounded-xl border border-orange-200 bg-white shadow-sm overflow-hidden">

      {/* ================= Header ================= */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-5">
            <img
              src={image}
              alt={name}
              className="h-20 w-20 rounded-full border-2 border-orange-300 object-cover"
            />

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                r/{name}
              </h1>

              <p className="mt-1 text-gray-500">
                {followers} members
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            {isAdmin && (
              <button
                onClick={handleDelete}
                className="rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 transition"
              >
                Delete Community
              </button>
            )}

            <button
              onClick={handleJoin}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                join
                  ? "border border-orange-300 bg-orange-100 text-orange-700"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {join ? "Joined" : "Join"}
            </button>

            <Modal communityId={subId} fetchPost={fetchPost} />

          </div>
        </div>

        {/* About */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            About
          </h2>

          <p className="text-gray-600 leading-7">
            Created On: {date}<br/>
            {about}
          </p>
        </div>
      </div>

      {/* ================= Posts ================= */}

      <div className="border-t border-gray-200 bg-white p-6">

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Posts
        </h2>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-orange-300 bg-white p-10 text-center text-gray-500">
            No Posts Yet!
          </div>
        ) : (
          posts.map((post) => {
            const hasUpVoted = post.upVotes.includes(user._id);
            const hasDownVoted = post.downVotes.includes(user._id);

            return (
              <div
                key={post._id}
                onClick={() => nav(`/p/${post._id}`)}
                className="mb-5 cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-orange-300"
              >
                {/* Header */}
                <div className="mb-4 flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>
                        Posted by{" "}
                        <span className="font-medium text-gray-700">
                          {post.creator.username}
                        </span>
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {(isAdmin || post.creator._id === user._id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(post._id);
                      }}
                      className="rounded-md p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
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

                {/* Footer */}
                <div className="flex gap-2 border-t border-gray-200 pt-3">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpVote(post._id);
                    }}
                    className={`rounded-lg px-3 py-2 transition ${
                      hasUpVoted
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
                    className={`rounded-lg px-3 py-2 transition ${
                      hasDownVoted
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    ⬇ {post.downVotes.length}
                  </button>

                  <button className="rounded-lg px-3 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition">
                    💬 Comments
                  </button>

                </div>
              </div>
            );
          })
        )}

      </div>

    </div>
  </div>
);
}

export default ShowCommunity

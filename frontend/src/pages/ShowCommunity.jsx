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

  const [isAdmin, setIsAdmin] = useState(false)

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
    <div className='w-full m-3.5'>
      <header className='flex justify-between m-2 p-2 items-center'>
        <div className='flex gap-3'>
          <img src={logo} className='h-12 w-12 rounded-full' />
          <span className='text-5xl'>r/ {name}</span>
        </div>
        <div>
          {isAdmin && <button className='border border-neutral-600 rounded-2xl p-2 m-2' onClick={handleDelete}>Delete Community</button>}
          <button className='border border-neutral-600 rounded-2xl p-2 m-2' onClick={handleJoin}>{join ? <span>Joined</span> : <span>Join</span>}</button>
          <Modal communityId={subId} fetchPost={fetchPost} />
          <span>Followers : </span>
          <span>{followers}</span>
        </div>
      </header>
      <hr />
      <div>
        <span className='text-3xl'>About</span>
        <div>this is a about section {about}</div>
      </div>
      <hr />
      <div>
        {posts.length === 0 ? (
          <div className="text-center text-neutral-500 mt-6">
            No Posts Yet!
          </div>
        ) : (
          posts.map((post) => {
            const hasUpVoted = post.upVotes.includes(user._id);
            const hasDownVoted = post.downVotes.includes(user._id); return (
              <div
                key={post._id}
                className="border border-neutral-700 rounded-lg p-4 my-4 bg-green-900"
                onClick={() => nav(`/p/${post._id}`)}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <span className="text-sm text-neutral-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  <span>Posted by: {post.creator.username}</span>
                </div>

                {/* Content */}
                <p className="text-neutral-200 whitespace-pre-wrap mb-4">
                  {post.content}
                </p>

                <hr className="border-neutral-700 mb-3" />

                {/* Actions */}
                <div className="flex gap-6 items-center">

                  <button className={`transition ${hasUpVoted && hasUpVoted ? "text-orange-500" : "hover:text-orange-500"
                    } `} onClick={(e) => {e.stopPropagation(); handleUpVote(post._id)}}>
                    ⬆ {post.upVotes.length}
                  </button>

                  <button className={`transition ${hasDownVoted && hasDownVoted ? "text-blue-500" : "hover:text-blue-500"
                    }`} onClick={(e) => {e.stopPropagation(); handleDownVote(post._id)}}>
                    ⬇ {post.downVotes.length}
                  </button>

                  <button className="hover:text-green-500 transition">
                    💬 Comments
                  </button>
                  {(isAdmin || (post.creator._id === user._id)) && <button className='bg-red-500' onClick={() => deletePost(post._id)}><Trash2 /></button>}
                </div>
              </div>
            )
          })
        )}
      </div>
      <hr />
      this is a community {name}
    </div>
  )
}

export default ShowCommunity

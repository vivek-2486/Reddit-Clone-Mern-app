import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import CommentBox from '@/components/CommentBox'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'  

function ShowPost() {
  const nav = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/";

  const getPost = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        `${serverUrl}api/post/singlePost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPost(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getComments = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        `${serverUrl}api/post/comment/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setComments(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user) {
      getPost()
    }
  }, [id, user])

  useEffect(() => {
    if (user && post?._id) {
      getComments()
    }
  }, [user, post?._id])

  if (!post) {
    return <div>Loading post...</div>
  }

  const hasUpVoted =
    user && post.upVotes
      ? post.upVotes.includes(user._id)
      : false

  const hasDownVoted =
    user && post.downVotes
      ? post.downVotes.includes(user._id)
      : false

  const handleUpVote = async (postID) => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.put(
        `${serverUrl}api/post/${postID}/upVote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPost(res.data.post)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownVote = async (postID) => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.put(
        `${serverUrl}api/post/${postID}/downVote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPost(res.data.post)
    } catch (error) {
      console.error(error)
    }
  }
  const deletePost = async () => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;
    const postID = post._id
    try {
      const url = `${serverUrl}api/post/${postID}/delete`
      const token = localStorage.getItem('token')
      const post = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      nav('/home')

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Post */}
      <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">

        {/* Header */}
        <header className="mb-6">
          <div className='flex justify-between'>
            <h1 className="text-3xl font-bold text-gray-900">
              {post.title}
            </h1>
            <button onClick={deletePost}><Trash2/></button>

          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>
              Posted by{" "}
              <span className="font-semibold text-gray-700">
                {post.creator.username}
              </span>
            </span>

            <span>•</span>

            <span className="text-gray-700 font-medium">
              r/{post.subreddit.name}
            </span>

            <span>•</span>

            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </header>

        {/* Content */}
        <article className="whitespace-pre-wrap leading-8 text-gray-700">
          {post.content}
        </article>

        {/* Image */}
        {post.image?.url && (
          <img
            src={post.image.url}
            alt="post"
            className="mt-6 max-h-[500px] w-full rounded-xl border border-gray-200 object-cover"
          />
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-gray-200 pt-4">

          <button
            className={`rounded-lg px-4 py-2 font-medium transition ${hasUpVoted
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            onClick={() => handleUpVote(post._id)}
          >
            ⬆ {post.upVotes.length}
          </button>

          <button
            className={`rounded-lg px-4 py-2 font-medium transition ${hasDownVoted
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            onClick={() => handleDownVote(post._id)}
          >
            ⬇ {post.downVotes.length}
          </button>

        </div>
      </div>



        <CommentBox
          comments={comments}
          setComments={setComments}
          post={post._id}
        />
      </div>
  )
}

export default ShowPost
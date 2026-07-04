import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import CommentBox from '@/components/CommentBox'

function ShowPost() {
  const { id } = useParams()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])

  const serverUrl = 'http://localhost:3000/'

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

  return (
    <div className="max-w-3xl mx-auto p-5 font-sans">

      <header className="mb-5">
        <h1 className="text-4xl font-bold mb-2.5 text-gray-900">
          {post.title}
        </h1>

        <div className="text-gray-600 text-sm flex items-center gap-2">
          <span>
            By{" "}
            <strong className="font-semibold text-gray-800">
              {post.creator.username}
            </strong>
          </span>

          <span>•</span>

          <time>{post.date}</time>
        </div>

        <div>Posted in r/{post.subreddit.name}</div>
      </header>

      <hr className="border-t border-gray-300 mb-5" />

      <article className="leading-relaxed text-lg text-gray-800 mb-10">
        <p>{post.content}</p>
      </article>

      <hr className="border-t border-gray-300 mb-5" />

      <div>
        <button
          className={`transition ${
            hasUpVoted
              ? "text-orange-500"
              : "hover:text-orange-500"
          }`}
          onClick={() => handleUpVote(post._id)}
        >
          ⬆ {post.upVotes.length}
        </button>

        <button
          className={`transition ${
            hasDownVoted
              ? "text-blue-500"
              : "hover:text-blue-500"
          }`}
          onClick={() => handleDownVote(post._id)}
        >
          ⬇ {post.downVotes.length}
        </button>
      </div>

      <div className="comments-section bg-gray-50 p-5 rounded-lg">
        <CommentBox
          comments={comments}
          setComments={setComments}
          post={post._id}
        />
      </div>

    </div>
  )
}

export default ShowPost
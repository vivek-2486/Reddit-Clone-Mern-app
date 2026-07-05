import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

function Comment({ comment, handleCommentAdded, post }) {
  const {user} = useAuth()
  const [isReply, setIsReply] = useState(false)
  const [description, setDescription] = useState("")

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/";

  const addComment = async (e, parentId) => {
    e.preventDefault()

    if (!description.trim()) return

    try {
      const token = localStorage.getItem("token")

      const res = await axios.post(
        `${serverUrl}api/post/comment/${post}`,
        {
          description,
          parentId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      handleCommentAdded(res.data)

      setDescription("")
      setIsReply(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="ml-6 mt-5 border-l-2 border-orange-200 pl-5">
      {/* Comment */}
      <div className="rounded-lg bg-orange-50 p-4">
          <p className="whitespace-pre-wrap text-gray-700">
            {comment.description}
          </p>
          <hr className='py-1'/>
          <div className=''>By: {comment.creator.username}</div>
        <button
          className="mt-3 text-sm font-medium text-orange-600 transition hover:text-orange-700 hover:underline"
          onClick={() => setIsReply((prev) => !prev)}
        >
          {isReply ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Reply Form */}
      {isReply && (
        <form
          onSubmit={(e) => addComment(e, comment._id)}
          className="mt-4 flex flex-col gap-3"
        >
          <textarea
            name="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 placeholder-gray-400 resize-none focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />

          <button
            type="submit"
            className="w-fit rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
          >
            Reply
          </button>
        </form>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              handleCommentAdded={handleCommentAdded}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
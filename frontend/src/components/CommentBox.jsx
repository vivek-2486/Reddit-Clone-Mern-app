import React, { useState } from 'react'
import axios from 'axios'
import Comment from './Comment'

function CommentBox({ comments, setComments, post }) {
  const [description, setDescription] = useState("")
  const serverUrl = 'http://localhost:3000/'

  const addReply = (tree, parent, comment) => {
    return tree.map((item) => {
      if (item._id.toString() === parent.toString()) {
        return {
          ...item,
          replies: [comment, ...(item.replies || [])]
        }
      }

      if (item.replies?.length) {
        return {
          ...item,
          replies: addReply(item.replies, parent, comment)
        }
      }

      return item
    })
  }

  const handleCommentAdded = (comment) => {
    if (comment.parentComment) {
      setComments(prev => addReply(prev, comment.parentComment, comment))
    } else {
      setComments(prev => [...prev, comment])
    }
  }

  const addComment = async (e) => {
    e.preventDefault()

    if (!description.trim()) return

    try {
      const token = localStorage.getItem("token")

      const res = await axios.post(
        `${serverUrl}api/post/comment/${post}`,
        {
          description,
          parentId: null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      handleCommentAdded(res.data)
      setDescription("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold text-gray-900">
        Comments
      </h2>

      <form onSubmit={addComment} className="mb-8">
        <textarea
          name="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
          rows={4}
        />

        <button
          type="submit"
          className="mt-3 rounded-lg bg-orange-500 px-5 py-2 font-medium text-white transition hover:bg-orange-600"
        >
          Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            handleCommentAdded={handleCommentAdded}
            post={post}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentBox
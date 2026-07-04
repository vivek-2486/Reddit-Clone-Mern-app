import React, { useState } from 'react'
import axios from 'axios'

function Comment({ comment, handleCommentAdded, post }) {
  const [isReply, setIsReply] = useState(false)
  const [description, setDescription] = useState("")

  const serverUrl = 'http://localhost:3000/'

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
    <div className="ml-4 mt-4 border-l border-gray-300 pl-4">
      {/* Comment */}
      <div className="flex flex-col gap-2">
        <p>{comment.description}</p>

        <button
          className="w-fit text-blue-600 hover:underline"
          onClick={() => setIsReply(prev => !prev)}
        >
          Reply
        </button>
      </div>

      {/* Reply Form */}
      {isReply && (
        <form
          className="mt-2 flex flex-col gap-2"
          onSubmit={(e) => addComment(e, comment._id)}
        >
          <textarea
            name="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your reply"
            className="border rounded p-2"
          />

          <button
            type="submit"
            className="w-fit rounded bg-blue-500 px-3 py-1 text-white"
          >
            Submit
          </button>
        </form>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
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
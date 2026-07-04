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
    <div>
      <h2>Comment Section</h2>

      <form onSubmit={addComment}>
        <textarea
          name="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your thoughts"
        />

        <button type="submit">Submit</button>
      </form>

      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          handleCommentAdded={handleCommentAdded}
          post={post}
        />
      ))}
    </div>
  )
}

export default CommentBox
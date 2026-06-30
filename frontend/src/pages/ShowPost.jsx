import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
function ShowPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  const serverUrl = 'http://localhost:3000/'
  // Simulating fetching post data based on the ID

  const getPost = async()=>{
    try {
        const url = `${serverUrl}api/post/singlePost/${id}`;
        const token = localStorage.getItem("token");
        const post = await axios.get(url,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        setPost(post.data)
    } catch (error) {
        console.error(error)
    }
  }
  useEffect(() => {

    getPost()
  }, [id])

  if (!post) {
    return <div>Loading post...</div>
  }

  return (
  <div className="max-w-3xl mx-auto p-5 font-sans">
    {/* Post Header */}
    <header className="mb-5">
      <h1 className="text-4xl font-bold mb-2.5 text-gray-900">{post.title}</h1>
      <div className="text-gray-600 text-sm flex items-center gap-2">
        <span>By <strong className="font-semibold text-gray-800">{post.creator.username}</strong></span>
        <span>•</span>
        <time>{post.date}</time>
      </div>
      <div>Posted in r/{post.subreddit.name}</div>
    </header>

    <hr className="border-t border-gray-300 mb-5" />

    {/* Post Content */}
    <article className="leading-relaxed text-lg text-gray-800 mb-10">
      <p>{post.content}</p>
    </article>

    <hr className="border-t border-gray-300 mb-5" />

    {/* Comments Section */}
    <div className="comments-section bg-gray-50 p-5 rounded-lg">
      <h3 className="text-xl font-semibold mt-0 mb-2 text-gray-900">Comments</h3>
      <p className="text-gray-500 italic">No comments yet. Be the first to say something!</p>
    </div>
  </div>
)
}

export default ShowPost
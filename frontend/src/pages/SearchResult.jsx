import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import axios from 'axios'
export default function SearchResult() {

  const [communities, setCommunities] = useState([])
  const [posts, setPosts] = useState([])
  const [searchParams] = useSearchParams()
  const Query = searchParams.get('q')

  const [loading, setLoading] = useState(false);
  const [showPosts, setShowPosts] = useState(false)
  useEffect(() => {
    handleSearch()


  }, [Query])


  const handleSearch = async () => {
    const serverUrl = 'http://localhost:3000/';
    if (!Query) {
      setCommunities([]);
      setPosts([]);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = `${serverUrl}api/search?q=${Query}`;

      const data = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCommunities(data.data.communities || []);
      setPosts(data.data.post || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const convertTime = (a) => {
    const date = new Date(a);
    const formatted = date.toLocaleString();
    return formatted
  }

  return (
    <div className='w-full max-w-4xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Search Results for "{Query}"</h2>


      <div className='flex gap-2 mb-4'>
        <button
          className={`border rounded-full px-4 py-2 text-sm font-semibold transition ${!showPosts ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-700'}`}
          onClick={() => setShowPosts(false)}
        >
          Communities
        </button>
        <button
          className={`border rounded-full px-4 py-2 text-sm font-semibold transition ${showPosts ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-700'}`}
          onClick={() => setShowPosts(true)}
        >
          Posts
        </button>
      </div>
      <hr className='mb-4' />


      {loading ? (
        <div className="flex justify-center items-center py-10">

          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-600">Searching Reddit...</span>
        </div>
      ) : (

        <div>
          {!showPosts ? (

            <div className='space-y-3'>
              {communities.length === 0 ? <p className='text-gray-500'>No communities found.</p> : (
                communities.map((comm) => (
                  <Link to={`/r/${comm.name}`} key={comm._id} className="p-4 block border rounded-xl bg-white shadow-xs">
                    <div className='flex justify-between '>
                      <span className='font-bold text-lg text-gray-900'>r/{comm.name}</span>
                      <span className='text-[13px]'>{convertTime(comm.createdAt)}</span>
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>{comm.description || 'No description'}</p>
                  </Link>
                ))
              )}
            </div>
          ) : (

            <div className='space-y-3'>
              {posts.length === 0 ? <p className='text-gray-500'>No posts found.</p> : (
                posts.map((post) => (
                  <Link to={`/p/${post._id}`} key={post._id} className="p-4 border rounded-xl block bg-white shadow-xs">
                    <div className='flex justify-between'>
                      <h3 className='font-bold text-xl text-blue-600'>{post.title}</h3>
                      <div>posted by {post.creator.username}</div>
                      <div>Posted on r/{post.subreddit.name}</div>
                    </div>
                    <p className='text-sm text-gray-700 mt-1'>{post.content}</p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


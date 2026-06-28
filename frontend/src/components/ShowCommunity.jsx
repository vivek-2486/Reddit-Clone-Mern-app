import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import logo from '../assets/icon-reddit.png'

function ShowCommunity() {
  const {name} = useParams();
  const serverUrl = 'http://localhost:3000/'
  
  useEffect(() => {
    getCommunity()
    
  }, [name])
  const [about,setAbout] = useState("")
  const [followers,setFollowers] = useState(0)

  const getCommunity = async() => {
    try {
      const url = `${serverUrl}api/subreddit/${name}`
      const token = localStorage.getItem('token')
      const comm = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAbout(comm.data.description)
      setFollowers(comm.data.followers)
      console.log(comm)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='w-full m-3.5'>
      <header className='flex justify-between m-2 p-2 items-center'>
        <div className='flex gap-3'>
          <img src={logo} className='h-12 w-12 rounded-full'/>
          <span className='text-5xl'>r/ {name}</span>
        </div>
        <div>
          <button className='border border-neutral-600 rounded-2xl p-2 m-2'>Follow </button>
          <button className='border border-neutral-600 rounded-2xl p-2 m-2'>+ Create Post </button>
          <span>Followers : </span>
          <span>{followers}</span>
        </div>
      </header>
      <hr/>
      <div>
        <span className='text-3xl'>About</span>
        <div>this is a about section {about}</div>
      </div>
      <hr/>
      <div>
        No Posts yet
      </div>
      <hr />
      this is a community {name}
    </div>
  )
}

export default ShowCommunity

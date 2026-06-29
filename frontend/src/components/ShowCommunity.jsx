import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import logo from '../assets/icon-reddit.png'
import {jwtDecode} from 'jwt-decode'
import { useOutletContext } from 'react-router';

function ShowCommunity() {
  const {name} = useParams();
  const serverUrl = 'http://localhost:3000/'
  const {getFollowingCommunities} = useOutletContext()
  const [followers,setFollowers] = useState(0)
  useEffect(() => {
    getCommunity()
    
  }, [name,followers])
  const [about,setAbout] = useState("")
  
  const [subId,setSubId] = useState("")

  const getCommunity = async() => {
    try {
      const url = `${serverUrl}api/subreddit/${name}`
      const token = localStorage.getItem('token')
      const comm = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSubId(comm.data._id)
      
      let loggedId = ""
      if(token){
        const decoded = jwtDecode(token)
        loggedId = decoded.id
      }
      const isMember = comm.data.followers.includes(loggedId)
      setJoin(isMember)
      setAbout(comm.data.description)
      console.log(comm.data.followers.length)
      setFollowers(comm.data.followers.length)
      console.log(comm)
    } catch (error) {
      console.error(error)
    }
  }
  const [join,setJoin] = useState(false)
  const handleJoin = async() => {
    setJoin(!join)
    try {
      const token = localStorage.getItem('token')
      const url = `${serverUrl}api/subreddit/${subId}/join`
      const res = await axios.get(url,{
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
  return (
    <div className='w-full m-3.5'>
      <header className='flex justify-between m-2 p-2 items-center'>
        <div className='flex gap-3'>
          <img src={logo} className='h-12 w-12 rounded-full'/>
          <span className='text-5xl'>r/ {name}</span>
        </div>
        <div>
          <button className='border border-neutral-600 rounded-2xl p-2 m-2' onClick={handleJoin}>{join? <span>Joined</span>:<span>Join</span>}</button>
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

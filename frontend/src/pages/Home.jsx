import React, { useEffect ,useState} from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import SidebarItem from '@/components/SidebarItem'


function Home() {
  const serverUrl = 'http://localhost:3000/'

  const [yourCommunities,setYourCommunities] = useState([])

  const getYourCommunities = async() => {

    try {
      const url = `${serverUrl}api/subreddit`
      const token = localStorage.getItem('token');
      const communities = await axios.get(url, {
        headers : {
          Authorization: `Bearer ${token}`,
        }
      })
      console.log(communities.data)
      if(communities){
        setYourCommunities(communities.data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getYourCommunities()
  },[])
  
  
  return (
    <div className='mx-3'>Feeds</div>
  )
}

export default Home

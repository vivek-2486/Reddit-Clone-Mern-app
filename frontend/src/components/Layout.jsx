import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import SidebarItem from './SidebarItem'
import { useNavigate } from 'react-router'

function Layout() {
    const serverUrl = 'http://localhost:3000/'

    const nav = useNavigate() 
    const [yourCommunities, setYourCommunities] = useState([])
    const [followingCommunities, setFollowingCommunities] = useState([])

    const verifyUser = async() => {
        const url = `${serverUrl}api/verify`
        const token = localStorage.getItem('token')
        if(!token){
            nav('/login')
        }
        try {
            const isLogged = await axios.get(url,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        } catch (error) {
            localStorage.removeItem('token')
            nav('login')
        }
    }
     const getYourCommunities = async () => {

        try {
            const url = `${serverUrl}api/subreddit`
            const token = localStorage.getItem('token');
            const communities = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(communities.data)
            if (communities) {
                setYourCommunities(communities.data)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const getFollowingCommunities = async () => {

        try {
            const url = `${serverUrl}api/subreddit/following`
            const token = localStorage.getItem('token');
            const followingSubs = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(followingSubs);
            console.log(followingSubs.data);

            if (followingSubs) {
                setFollowingCommunities(followingSubs.data.followingSubs)
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        verifyUser()
        getYourCommunities()
        getFollowingCommunities()
    }, [])

    return (
        <div>
            <Navbar />
            <div className='flex'>
                <Sidebar onCommunityCreated={getYourCommunities} 
                    yourCommunities={yourCommunities.map((comm, index) => (<SidebarItem key={comm._id} id= {comm._id} name={comm.name} />))}
                    followingCommunities={followingCommunities.map((comm, index) => (<SidebarItem key={comm._id} id= {comm._id} name={comm.name} />))}
                />
                <Outlet context={{getFollowingCommunities}}/>
            </div>s
        </div>
    )
}

export default Layout

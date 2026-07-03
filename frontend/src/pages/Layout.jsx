import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import SidebarItem from '../components/SidebarItem'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'


function Layout() {
    const serverUrl = 'http://localhost:3000/'

    const { user, setUser } = useAuth()
    const nav = useNavigate()
    const [yourCommunities, setYourCommunities] = useState([])
    const [followingCommunities, setFollowingCommunities] = useState([])

    const verifyUser = async () => {
        const url = `${serverUrl}api/verify`
        const token = localStorage.getItem('token')
        if (!token) {
            nav('/login')
        }
        try {
            const isLogged = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(isLogged.data.userData)
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

    const [expanded, setExpanded] = useState(true)
    return (
        <div className = "">
            <div className=''>
            <Navbar />

            </div>
            <div className='flex'>
                <Sidebar onCommunityCreated={getYourCommunities} expanded= {expanded} setExpanded={setExpanded}
                    yourCommunities={yourCommunities.map((comm, index) => (<SidebarItem key={comm._id} id={comm._id} name={comm.name} />))}
                    followingCommunities={followingCommunities.map((comm, index) => (<SidebarItem key={comm._id} id={comm._id} name={comm.name} />))}
                />
                <main className={` ${expanded? "ml-[250px]":"ml-[40px]"} pt-16 w-full`}>
                    <Outlet context={{ getFollowingCommunities, getYourCommunities }} />
                </main>
            </div>
        </div>
    )
}

export default Layout

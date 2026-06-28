import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import SidebarItem from './SidebarItem'

function Layout() {
    const serverUrl = 'http://localhost:3000/'

    const [yourCommunities, setYourCommunities] = useState([])

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
    useEffect(() => {
        getYourCommunities()
    }, [])

    return (
        <div>
            <Navbar />
            <div className='flex'>
                <Sidebar onCommunityCreated={getYourCommunities}>
                    {yourCommunities.map((comm, index) => (<SidebarItem key={comm._id} id= {comm._id} name={comm.name} />))}
                </Sidebar>
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout

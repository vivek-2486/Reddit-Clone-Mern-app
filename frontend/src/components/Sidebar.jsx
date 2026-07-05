import React, { useState } from 'react'
import { ChevronLast, ChevronFirst ,BadgePlus,BookUser,Users} from 'lucide-react'
import Modal from './CreateCommunityModal'
import { useNavigate,useLocation } from 'react-router'

function Sidebar({yourCommunities ,followingCommunities, onCommunityCreated,expanded,setExpanded}) {
	const nav = useNavigate()
    const location = useLocation()
	return (
		<aside className={`fixed top-16 left-0 h-[calc(100vh-64px)] z-40 transition-all duration-300 ease-in-out border-r border-orange-100 ${expanded ? "w-[260px]" : "w-[64px]"}`}>
    <nav className='bg-gradient-to-b from-orange-50/50 to-white h-full flex flex-col p-3 shadow-sm select-none'>
        
        <div className='flex items-center justify-between min-h-[40px] mb-4 px-1'>
            <button 
                className={`overflow-hidden transition-all duration-300 font-medium ${location.pathname === "/home"? "text-[#ff4705]" : "text-slate-700"} hover:opacity-80 cursor-pointer whitespace-nowrap ${expanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0 pointer-events-none"}`} 
                onClick={() => nav('/home')}
            >
                Home
            </button>
            <button 
                className="p-1.5 rounded-lg hover:bg-orange-100/70 text-slate-700transition-colors cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
            </button>
        </div>

        <Modal expanded={expanded} setExpanded={setExpanded} onCommunityCreated={onCommunityCreated} />
        
        <hr className="border-orange-100/70 my-3"/>

        <div className='group cursor-pointer p-2 rounded-lg hover:bg-orange-50 flex items-center justify-between text-slate-700 hover:text-[#ff4705] transition-colors mb-1'>
            <div className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${expanded ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"}`}>
                Your Communities
            </div>
            <div  onClick={() => !expanded && setExpanded(true)} className="text-slate-400 group-hover:text-[#ff4705] transition-colors"><BookUser size={20}/></div>
        </div>
        <div className={expanded ? "mb-4" : "hidden"}>
            {yourCommunities}
        </div>

        <hr className="border-orange-100/70 my-3"/>

        <div className='group cursor-pointer p-2 rounded-lg hover:bg-orange-50 flex items-center justify-between text-slate-700 hover:text-[#ff4705] transition-colors mb-1'>
            <div className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${expanded ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"}`}>
                Following Communities
            </div>
            <div  onClick={() => !expanded && setExpanded(true)} className="text-slate-400 group-hover:text-[#ff4705] transition-colors"><Users size={20}/></div>
        </div>
        <div className={expanded ? "" : "hidden"}>
            {followingCommunities}
        </div>
    </nav>
</aside>
	)
}

export default Sidebar

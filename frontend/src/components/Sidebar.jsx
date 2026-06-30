import React, { useState } from 'react'
import { ChevronLast, ChevronFirst ,BadgePlus,BookUser,Users} from 'lucide-react'
import Modal from './CreateCommunityModal'
import { useNavigate } from 'react-router'

function Sidebar({yourCommunities ,followingCommunities, onCommunityCreated}) {
	const nav = useNavigate()
	const [expanded, setExpanded] = useState(true)
	return (
		<aside className='h-screen w-fit pr-0.5'>
			<nav className='bg-pink-300 h-full flex flex-col'>
				<div className='flex gap-1 m-1 my-2 justify-between'>
					<button className={`overflow-hidden transition-all  ${expanded ? "w-fit" : "w-0 display-none"} cursor-pointer`} onClick= {() => nav('/home')}>Home</button>
					<button className="cursor-pointer" value={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ChevronFirst /> : <ChevronLast />}</button>
				</div>
				<Modal expanded={expanded} onCommunityCreated={onCommunityCreated}/>
				<hr/>
				<div className='cursor-pointer m-1 flex gap-1 justify-between h-[24px] my-2 '>
					<div className={`${expanded? "mr-2 ": "w-0 overflow-hidden"}`}>Your Communities</div>
					<div><BookUser/></div>
				</div>
				<div>{expanded && yourCommunities}</div>
				<hr/>
				<div className='cursor-pointer m-1 flex gap-1 justify-between h-[24px] my-2 '>
					<div className={`${expanded? "mr-2 ": "w-0 overflow-hidden"}`}>Following Communitites</div>
					<div><Users/></div>
				</div>
				<div>{expanded && followingCommunities}</div>
			</nav>
		</aside>
	)
}

export default Sidebar

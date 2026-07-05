import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router"
import userIcon from '../assets/user.png'

export default function DropdownMenuIcons() {
    const nav = useNavigate()
    const {user} = useAuth()
    const handleLogout = () => {
        localStorage.removeItem('token')
        nav('/login')
    }

    const handleProfile = (id) =>{
      nav(`/profile/${id}`)
    }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* user.profilePicture?.url? user.profilePicture.url:  */}
        <Button variant="outline" className="text-[15px] p-1">Welcome <span>{user?.username} </span>
        
        {user?.profilePicture?.url? (<img src={user?.profilePicture.url} className=' rounded-full h-7 w-7 object-contain block'/>) : (<img src={userIcon} className=' rounded-full h-7 w-7 object-contain block'/>)}
        
        </Button>
      
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => handleProfile(user._id)}>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect = {handleLogout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

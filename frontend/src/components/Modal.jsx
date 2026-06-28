import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { BadgePlus } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Modal({ expanded ,onCommunityCreated}) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const url = `http://localhost:3000/api/subreddit`
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const subreddit = await axios.post(url, {
                name: name,
                description: description
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            onCommunityCreated()
        } catch (error) {

        } finally{
            setDescription("")
            setName("")
            setOpen(!open)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className='cursor-pointer m-1 flex gap-1 justify-between h-[24px] my-2 '>
                    <div className={`${expanded ? "mr-2 " : "w-0 overflow-hidden"}`}>Create Community</div>
                    <div className={`${expanded ? "" : ""}`}><BadgePlus /></div>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Community</DialogTitle>
                    <DialogDescription>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam alias voluptatum saepe asperiores quibusdam ab odit exercitationem aliquid, sed cum ducimus doloremque laudantium quod ipsum repellendus nostrum sit voluptatibus. Asperiores?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-neutral-900 text-neutral-100 rounded-xl border border-neutral-800 shadow-lg space-y-6">

                    {/* Subreddit Name Section */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="subreddit-name" className="text-sm font-medium text-neutral-300">
                            Subreddit name <span className="text-red-500">*</span>
                        </label>

                        {/* Input Wrapper for r/ prefix styling */}
                        <div className="flex items-center rounded-lg bg-neutral-800 border border-neutral-700 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 overflow-hidden transition-all">
                            <span className="pl-3 pr-1 text-neutral-500 select-none font-medium">r/</span>
                            <input
                                id="subreddit-name"
                                type="text"
                                required
                                maxLength={21}
                                value={name}
                                onChange={(e) => setName(e.target.value.replace(/\s+/g, ''))} // Removes spaces as subreddits can't have them
                                placeholder="javascript"
                                className="w-full bg-transparent py-2 pr-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between text-xs text-neutral-500 px-1">
                            <span>Names cannot be changed later.</span>
                            <span>{21 - name.length} characters left</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="subreddit-desc" className="text-sm font-medium text-neutral-300">
                            Description <span className="text-red-500">*</span>
                        </label>

                        <textarea
                            id="subreddit-desc"
                            required
                            maxLength={500}
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us what your community is about..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none transition-all"
                        />

                        <div className="flex justify-end text-xs text-neutral-500 px-1">
                            <span>{500 - description.length} characters left</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-md shadow-pink-500/10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                    >
                        Create Community
                    </button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

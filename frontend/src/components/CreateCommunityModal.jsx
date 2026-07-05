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

export default function Modal({ expanded, onCommunityCreated }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [picture, setPicture] = useState(null)

    const url = `http://localhost:3000/api/subreddit`
    const handleSubmit = async (e) => {
        const formData = new FormData()
        e.preventDefault()
        try {
            formData.append('name', name)
            formData.append('description', description)
            formData.append('image', picture)
            const token = localStorage.getItem('token')
            const subreddit = await axios.post(url, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            onCommunityCreated()
        } catch (error) {

        } finally {
            setDescription("")
            setName("")
            setPicture(null)
            setOpen(!open)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="cursor-pointer m-1 flex justify-between gap-1 items-center my-2 text-gray-700 hover:text-orange-600 transition">
                    <div className={`${expanded ? "mr-2" : "w-0 overflow-hidden"}`}>
                        Create Community
                    </div>
                    <BadgePlus />
                </button>
            </DialogTrigger>

            <DialogContent className="border border-orange-200 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Create a Community
                    </DialogTitle>

                    <DialogDescription className="text-gray-500">
                        Create a place where people can share posts and discuss topics.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md mx-auto space-y-6"
                >
                    {/* Community Name */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="subreddit-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Community Name <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 overflow-hidden transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200">
                            <span className="pl-3 pr-1 text-gray-500 font-medium">r/</span>

                            <input
                                id="subreddit-name"
                                type="text"
                                required
                                maxLength={21}
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value.replace(/\s+/g, ""))
                                }
                                placeholder="javascript"
                                className="w-full bg-transparent py-2 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Names cannot be changed later.</span>
                            <span>{21 - name.length} characters left</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="subreddit-desc"
                            className="text-sm font-medium text-gray-700"
                        >
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
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 placeholder-gray-400 resize-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                        />

                        <div className="flex justify-end text-xs text-gray-500">
                            {500 - description.length} characters left
                        </div>
                    </div>

                    {/* Community Icon */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Community Icon
                        </label>

                        <input
                            type="file"
                            onChange={(e) => setPicture(e.target.files[0])}
                            className="text-sm text-gray-600
            file:mr-4
            file:rounded-md
            file:border-0
            file:bg-orange-100
            file:px-3
            file:py-2
            file:text-orange-700
            hover:file:bg-orange-200"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-500 py-2.5 text-white font-medium shadow hover:bg-orange-600 transition"
                    >
                        Create Community
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

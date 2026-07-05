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

export default function Modal({ communityId, fetchPost }) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [picture, setPicture] = useState(null)
    const [addPicture, setAddPicture] = useState(false)


    const serverUrl = `http://localhost:3000/`
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        try {
            formData.append('title', title)
            formData.append('content', content)
            formData.append('image', picture)
            formData.append('subredditId', communityId)
            const url = `${serverUrl}api/post`
            const token = localStorage.getItem('token')
            const post = await axios.post(url, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

            fetchPost()
        } catch (error) {
            console.error(error)
        } finally {
            setTitle("")
            setContent("")
            setPicture(null)
            setAddPicture(false)
            setOpen(!open)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="rounded-lg bg-orange-500 px-4 py-2 text-white font-medium shadow hover:bg-orange-600 transition">
                    + Create Post
                </button>
            </DialogTrigger>

            <DialogContent className="border border-orange-200 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Create a Post
                    </DialogTitle>

                    <DialogDescription className="text-gray-500">
                        Share something with your community.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md mx-auto rounded-xl bg-white space-y-6"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="post-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Post Title <span className="text-red-500">*</span>
                        </label>

                        <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-50 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 transition">
                            <input
                                id="post-name"
                                type="text"
                                required
                                maxLength={50}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Title cannot be changed later.</span>
                            <span>{50 - title.length} characters left</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="post-content"
                            className="text-sm font-medium text-gray-700"
                        >
                            Content <span className="text-red-500">*</span>
                        </label>

                        <textarea
                            id="post-content"
                            required
                            maxLength={500}
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter the post content"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 placeholder-gray-400 resize-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                        />

                        <div className="flex justify-end text-xs text-gray-500">
                            {500 - content.length} characters left
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAddPicture(true)}
                        className="rounded-lg border border-orange-300 px-4 py-2 text-orange-600 hover:bg-orange-50 transition"
                    >
                        Add Image
                    </button>

                    {addPicture && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Post Image
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
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-500 py-2.5 text-white font-medium shadow hover:bg-orange-600 transition"
                    >
                        Publish Post
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

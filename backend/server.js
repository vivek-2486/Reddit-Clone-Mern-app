import express from 'express'
import cors from 'cors'
import connectDb from './db.js'
import userRoutes from './routes/userRoutes.js'
import subRedditRoutes from './routes/subRedditRoutes.js'
import postRoutes from './routes/postRoutes.js'
import searchRoutes from './routes/searchRutes.js'

const app = express();
const port = process.env.PORT || 3000;
connectDb();


const frontEnd = process.env.VITE_URl || "http://localhost:5173"


app.use(express.json())
app.use(cors({
    origin: frontEnd
}))

app.use('/api/user',userRoutes);
app.use('/api/subreddit',subRedditRoutes);
app.use('/api/post',postRoutes);
app.use('/api/search',searchRoutes)

app.listen(port,()=>{
    console.log('App is listening at ',port);
})
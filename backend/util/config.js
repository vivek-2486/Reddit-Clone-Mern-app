import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error ("Mongo uri s not found");
}
if(!process.env.JSONSECRET){
    throw new Error ("JSONSECRET s not found");
}
const config = {
    MONGODB_URI : process.env.MONGODB_URI,
    jsonwebtoken : process.env.JSONSECRET
}


export default config;
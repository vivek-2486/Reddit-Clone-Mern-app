import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
// import Dashboard from "./Dashboard";
function Signup() {
    const navigate = useNavigate()
    const[name,setName] = useState('');
    const [email, setEmail] = useState('')
    const[password,setPassword] = useState('');
    const server = `${import.meta.env.VITE_SERVER_URL}api/user`;
    const handleSubmit = async(e) => {
        e.preventDefault()

        const requ = {
          username: name,
          email,
          password
        }
         const response = await axios.post(server, requ);
         localStorage.setItem('token',response.data.token)
         localStorage.setItem('username',response.data.user.name)
         localStorage.setItem('email',response.data.user.email)
         console.log(localStorage.getItem('token'))
         console.log(response);
         navigate('/home');
    }
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-orange-50 px-4">

  <div className="w-full max-w-md rounded-2xl border border-orange-200 bg-white p-8 shadow-md">

    <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
      Sign Up
    </h2>

    <p className="mb-6 text-center text-gray-500">
      Create your account ✨
    </p>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />

      <button
        type="submit"
        className="w-full rounded-lg bg-orange-500 p-3 font-semibold text-white transition hover:bg-orange-600"
      >
        Create Account
      </button>

    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      <span>Already have an account? </span>

      <button
        onClick={() => navigate("/login")}
        className="font-semibold text-orange-600 transition hover:text-orange-700 hover:underline"
      >
        Login
      </button>
    </div>

  </div>

</div>
  );
}

export default Signup;

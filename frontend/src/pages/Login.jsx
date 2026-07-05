import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
// import Dashboard from "./Dashboard";
function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const[password,setPassword] = useState('');
    const server = `${import.meta.env.VITE_SERVER_URL}api/user/login`;

    const handleSubmit = async(e) => {
        e.preventDefault()

        const requ = {
          email,
          password
        }
        try {
          const response = await axios.post(server, requ);
          localStorage.setItem('token',response.data.token)
          console.log(response.data.user.name)
          localStorage.setItem('username',response.data.user.name)
          localStorage.setItem('email',response.data.user.email)
          console.log(localStorage.getItem('username'));
          console.log(localStorage.getItem('token'))
          console.log(response);
          navigate('/home');
        } catch (error) {
          if (error.response) {
            // The backend responded with an error status code (like 401 or 400)
            console.error("Login failed:", error.response.data.message);
            alert(error.response.data.message); // Displays "Invalid email or password" to the user
        } else {
            // Something went wrong setting up the request (like the backend server being offline)
            console.error("Network error:", error.message);
            alert("Could not connect to the server. Please try again later.");
        }
        }
        
    }
  return (
 <div className="flex min-h-[80vh] items-center justify-center bg-orange-50 px-4">

  <div className="w-full max-w-md rounded-2xl border border-orange-200 bg-white p-8 shadow-md">

    <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
      Login
    </h2>

    <p className="mb-6 text-center text-gray-500">
      Welcome back 👋
    </p>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
        Login
      </button>

    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      <span>Don't have an account? </span>

      <button
        onClick={() => navigate("/signup")}
        className="font-semibold text-orange-600 transition hover:text-orange-700 hover:underline"
      >
        Sign Up
      </button>
    </div>

  </div>

</div>
  );
}

export default Login;

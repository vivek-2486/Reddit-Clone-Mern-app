import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
// import Dashboard from "./Dashboard";
function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const[password,setPassword] = useState('');
    const server = `${import.meta.env.VITE_API_URL}api/user/login`;

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
 <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-yellow-50">

  <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-yellow-200">

    <h2 className="text-3xl font-bold text-center text-yellow-900 mb-2">
      Login
    </h2>

    <p className="text-center text-yellow-700 mb-6">
      Welcome back 👋
    </p>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-yellow-300 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-yellow-300 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-3 rounded-xl transition"
      >
        Login
      </button>

    </form>

    <div className="text-center mt-6 text-sm text-yellow-800">
      <span>Don't have an account? </span>
      <button
        onClick={() => navigate('/signup')}
        className="font-semibold underline hover:text-yellow-600"
      >
        Sign Up
      </button>
    </div>

  </div>

</div>
  );
}

export default Login;

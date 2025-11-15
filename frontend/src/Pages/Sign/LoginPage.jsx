import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { LogIn, UserPlus, Zap } from 'lucide-react';
import logo from "../../assets/logo.png";

// (CustomMessage component is unchanged)
const CustomMessage = ({ message, type }) => (
  <div className={`p-3 rounded-lg text-sm mb-4 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
    {message}
  </div>
);

function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState({ text: '', type: 'error' });

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // ================================================================
  // === 1. FIX: REGISTRATION MUST ALSO SAVE THE TOKEN ===
  // ================================================================
  const handleCreateAccount = async () => {
    if (!username || !email || !password) {
      setUserMessage({ text: 'All fields are required for signup.', type: 'error' });
      return;
    }
    setUserMessage({ text: '', type: 'error' });
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      if (res.status === 201 && res.data.token) { // Check for token
        setUserMessage({ text: "Account created successfully! Logging you in...", type: 'success' });
        
        // --- THIS IS THE FIX ---
        // Your backend MUST send a token on register if you log them in
        localStorage.setItem("token", res.data.token); 
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
        navigate("/");
  
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error registering user.";
      setUserMessage({ text: msg, type: 'error' });
    }
    setLoading(false);
  };

  // ================================================================
  // === 2. FIX: LOGIN MUST SAVE THE TOKEN ===
  // ================================================================
  const handleLogin = async () => {
    if (!email || !password) {
      setUserMessage({ text: 'Email and password are required for login.', type: 'error' });
      return;
    }
    setUserMessage({ text: '', type: 'error' });
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token); 
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
       setUserMessage({ text: "Login successful!", type: 'success' });
    
      navigate("/");
       
      } else {
        setUserMessage({ text: res.data.message || "Invalid email or password.", type: 'error' });
      }
    } catch (error) {
      setUserMessage({
        text: "Login failed: " + (error.response?.data?.message || "Server error"),
        type: 'error'
      });
      console.error(error);
    }
    setLoading(false);
  };

  // ================================================================
  // === 3. FIX: GOOGLE LOGIN MUST SAVE THE TOKEN ===
  // ================================================================
  const handleGoogleLogin = async (credentialResponse) => {
    setUserMessage({ text: '', type: 'error' });
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      });

      if (res.data.token) { // Check for token
        // --- THIS IS THE FIX ---
        localStorage.setItem("token", res.data.token); 
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
        // ---------------------

        setUserMessage({ text: "Google login successful!", type: 'success' });
       
      navigate("/");
    
      } else {
         throw new Error("No token received from Google login");
      }
    } catch (err) {
      console.error("Google login failed:", err);
      setUserMessage({ text: "Google login failed.", type: 'error' });
    }
    setLoading(false);
  };
  
  // (Rest of your component's JSX is unchanged and looks great)
  
  const buttonClasses = "w-full py-3 mt-4 text-white font-bold text-lg rounded-lg cursor-pointer transition flex items-center justify-center space-x-2";
  const primaryButtonClass = `bg-green-600 hover:bg-green-700 ${buttonClasses}`;
   const toggleOptionClass = "flex-1 p-2 rounded-xl cursor-pointer transition font-medium text-sm";


  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/Sign1.png')" }} 
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-10 w-full max-w-lg text-white text-center shadow-2xl">
        <div className="flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full overflow-hidden mb-3 ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900 shadow-xl">
              <img
               src={logo}
                alt="FlaunaFlux Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-bold text-4xl m-0 tracking-wide">FlaunaFlux</h1> 
            <p className="text-xl font-light text-white/90 mt-2 mb-0">Track and manage environmental data with ease</p> 
          </div>

          <div className="flex justify-center mb-6 bg-black/20 rounded-full p-1 border border-white/10 w-full max-w-xs">
            <div 
              className={`${toggleOptionClass} ${isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
              onClick={() => { setIsLogin(true); setUserMessage({ text: '', type: 'error' }); }}
            >
              Login
            </div>
            <div 
              className={`${toggleOptionClass} ${!isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
              onClick={() => { setIsLogin(false); setUserMessage({ text: '', type: 'error' }); }}
            >
              Sign Up
            </div>
          </div>
          
          {userMessage.text && <CustomMessage message={userMessage.text} type={userMessage.type} />}

          <div className="w-full flex flex-col space-y-4">
            
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3.5 border border-white/30 bg-white/5 text-white rounded-lg text-lg box-border focus:outline-none focus:border-green-500 transition placeholder:text-white/70"
              />
            )}

            <input
            type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 border border-white/30 bg-white/5 text-white rounded-lg text-lg box-border focus:outline-none focus:border-green-500 transition placeholder:text-white/70"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 border border-white/30 bg-white/5 text-white rounded-lg text-lg box-border focus:outline-none focus:border-green-500 transition placeholder:text-white/70"
            />
          </div>

          <div className="w-full">
            {isLogin ? (
              <>
                <button className={primaryButtonClass} onClick={handleLogin} disabled={loading}>
                  <LogIn className="w-5 h-5"/> {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-sm mt-3 text-white/80">
                  Don’t have an account?{" "}
                  <span
                    className="text-green-500 cursor-pointer font-semibold hover:underline"
                    onClick={() => {
                      setIsLogin(false);
                      setUserMessage({ text: '', type: 'error' });
                  S }}
                  >
                    Sign up
                  </span>
                </p>
            </>
            ) : (
              <>
                <button className={primaryButtonClass} onClick={handleCreateAccount} disabled={loading}>
                  <UserPlus className="w-5 h-5"/> {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-sm mt-3 text-white/80">
                  Already have an account?{" "}
                  <span
className="text-green-500 cursor-pointer font-semibold hover:underline"
                    onClick={() => {
                      setIsLogin(true);
                    setUserMessage({ text: '', type: 'error' });
                    }}
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </div>
          
          <div className="flex items-center w-full my-6">
           <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/70 text-sm">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google Login Failed");
                setUserMessage({ text: "Google Login Failed. Try again.", type: 'error' });
              }}
              theme="filled_black" 
            size="large"
              width="100%"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
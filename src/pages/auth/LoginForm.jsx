import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdMail, MdLock } from "react-icons/md";
import api from "../../api/axios";
import logo from "../../assets/logo.png";
import { useAccess } from "../../context/AccessContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const { access, setAccess } = useAccess();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn && access?.tabs?.length > 0) {
      const first = access.tabs[0].replace(/\s+/g, "-").toLowerCase();
      navigate(`/${first}`);
    }
  }, [isLoggedIn, access]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return setLoading(false);
      }

      const response = await api.post("/admin/login", formData);
      const { token, user } = response.data;

      if (remember) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      login(user, token, remember);
      setAccess(user.access);
      toast.success(`Welcome back, ${user.email}!`);
      navigate(`/${user.access.tabs[0].replace(/\s+/g, "-").toLowerCase()}`);
    } catch (err) {
      const msg = err?.response?.data?.message;

      if (msg) {
        toast.error(msg || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen px-2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 relative overflow-hidden">
      {/* Animated floating light blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg border border-white/30 rounded-md shadow-[0_10px_50px_rgba(0,0,0,0.05)] p-10 text-center">
        {/* Logo Section */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute w-28 h-28 bg-gradient-to-tr from-sky-200 via-blue-300 to-blue-500 blur-2xl rounded-full opacity-70 animate-[pulse_4s_ease-in-out_infinite]"></div>
          <img
            src={
              logo ||
              "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            }
            alt="Lloyd Logo"
            className="relative z-10 h-16 drop-shadow-md"
          />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to access your Lloyd Admin Dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email */}
          <div className="relative">
            <MdMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleOnChange}
              placeholder="Email address"
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-400 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleOnChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-400 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300 text-sky-600 focus:ring-sky-400"
              />
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 cursor-pointer rounded-md font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-sky-300 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-blue-500 hover:scale-[1.02] hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

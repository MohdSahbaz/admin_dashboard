import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdMail, MdLock } from "react-icons/md";
import api from "../../api/axios";
import logo from "../../assets/logo.png"; // optional if you have a logo

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      toast.success(`Welcome back, ${user.email}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* --- Left Section (Brand Hero) --- */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_70%)]"></div>

        <div className="z-10 text-center space-y-6">
          <img
            src={
              logo ||
              "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            }
            alt="Lloyd Logo"
            className="h-20 mx-auto rounded-lg p-2 bg-white/20 backdrop-blur-sm 
             shadow-[0_4px_20px_rgba(255,255,255,0.35)] 
             ring-1 ring-white/40 hover:scale-[1.03] transition-all duration-300"
          />

          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Lloyd Admin
          </h1>
          <p className="text-blue-100 max-w-md mx-auto text-lg">
            Manage doctors, camps, and users efficiently — all from one powerful
            dashboard.
          </p>
        </div>

        <div className="absolute bottom-6 text-xs text-blue-100">
          © {new Date().getFullYear()} Lloyd Healthcare Pvt. Ltd.
        </div>
      </div>

      {/* --- Right Section (Login Form) --- */}
      <div className="flex justify-center items-center px-6 py-10 md:py-0">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-md shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 tracking-tight">
              Sign in
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Access your admin dashboard securely
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <MdMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleOnChange}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleOnChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 cursor-pointer px-4 rounded-md font-medium text-white transition-all duration-200 shadow-sm ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-md hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Need help?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

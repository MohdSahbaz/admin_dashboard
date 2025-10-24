import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdMail, MdLock } from "react-icons/md";
import axios from "axios";
import api from "../../api/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      const response = await api.post("/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Save token securely
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user); // update context
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Let’s Get You Signed In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <MdMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 z-20" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleOnChange}
                className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 z-20" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleOnChange}
                className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex justify-end text-sm">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              {/* Forgot your password? */}
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

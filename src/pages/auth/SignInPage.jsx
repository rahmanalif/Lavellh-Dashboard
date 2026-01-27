import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo ayudane.png";
import { adminLogin } from "../../store/adminAuthSlice";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, accessToken } = useSelector((s) => s.adminAuth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  useEffect(() => {
    if (status === "succeeded" && accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate, status]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-[#F3F8F4] p-8 shadow-lg">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full p-2">
              <div className="h-24 w-24 overflow-hidden rounded-full">
                <img
                  src={logo}
                  alt="ayudame logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <h1 className="text-center text-2xl font-semibold text-gray-900">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-md bg-white p-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:outline-none"
              />
            </div>

            <div className="rounded-md bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgotpass")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-md bg-[#1C5941] py-3 text-base font-medium text-white hover:bg-emerald-900 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Logging in..." : "Sign in"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

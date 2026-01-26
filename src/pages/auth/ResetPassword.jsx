import { useState } from "react";
import logo from "../../assets/logo ayudane.png";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Password Reset Successfully:", newPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg  bg-[#F3F8F4] p-8 shadow-lg">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="rounded-full b p-2">
              <div className="h-24 w-24 overflow-hidden rounded-full">
                <img
                  src={logo}
                  alt="ayudame logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <Link to={"/otpverification"}>
            <div className="flex items-center justify-center gap-2 text-[#1C5941] font-semibold text-lg">
              <ArrowLeft className="h-5 w-5 cursor-pointer" />
              <h2>Reset Password</h2>
            </div>
          </Link>

          {/* Description */}
          <p className="text-center text-gray-600 text-sm">
            Please enter your new password below.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="rounded-md  bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            {/* Confirm Password */}
            <div className="rounded-md  bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Reset Button */}
            <Link to={"/dashboard"}>
              <button
                type="submit"
                className="w-full rounded-md bg-[#1C5941] py-3 text-base font-medium text-white hover:bg-emerald-900 transition-colors"
              >
                Reset Password
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

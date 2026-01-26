import { useState } from "react";
import logo from "../../assets/logo ayudane.png";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Send OTP to:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md  bg-[#F3F8F4] p-8 shadow-lg">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="rounded-full ] p-2">
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
          <Link to={"/"}>
            <div className="flex items-center justify-center gap-2 text-[#1C5941] font-semibold text-lg">
              <ArrowLeft className="h-5 w-5 cursor-pointer" />
              <h2>Forgot Password</h2>
            </div>
          </Link>

          {/* Description */}
          <p className="text-center text-gray-600 text-sm">
            Please enter your email address to reset your password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-md   bg-white p-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:outline-none"
              />
            </div>

            <Link to={"/otpverification"}>
              <button
                type="submit"
                className="w-full rounded-md bg-[#1C5941] py-3 text-base font-medium text-white hover:bg-emerald-900 transition-colors"
              >
                Send OTP
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

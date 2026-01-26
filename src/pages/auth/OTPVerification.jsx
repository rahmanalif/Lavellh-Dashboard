import { useState } from "react";
import logo from "../../assets/logo ayudane.png";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OTP entered:", otp);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg  bg-[#F3F8F4] p-8 shadow-lg">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="rounded-full  p-2">
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
          <Link to={"/forgotpass"}>
            <div className="flex items-center justify-center gap-2 text-[#1C5941] font-semibold text-lg">
              <ArrowLeft className="h-5 w-5 cursor-pointer" />
              <h2>Verify OTP</h2>
            </div>
          </Link>

          {/* Description */}
          <p className="text-center text-gray-600 text-sm">
            Please enter the 6-digit OTP sent to your email address.
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-md  bg-white p-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full border-0 p-0 text-center text-gray-900 placeholder:text-gray-500 focus:outline-none tracking-widest text-lg"
              />
            </div>

            <Link to={"/resetPassword"}>
              <button
                type="submit"
                className="w-full rounded-md bg-[#1C5941] py-3 text-base font-medium text-white hover:bg-emerald-900 transition-colors"
              >
                Verify OTP
              </button>
            </Link>
          </form>

          {/* Resend Option */}
          <p className="text-center text-sm text-gray-600">
            Didn’t receive OTP?{" "}
            <button
              type="button"
              className="text-[#1C5941] font-medium hover:underline"
              onClick={() => alert("OTP resent!")}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

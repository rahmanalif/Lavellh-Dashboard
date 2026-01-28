import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { selectAdmin, selectAdminRole, loadAdminProfile } from "@/store/adminAuthSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const admin = useSelector(selectAdmin);
  const role = useSelector(selectAdminRole);

  useEffect(() => {
    if (!admin) {
      dispatch(loadAdminProfile());
    }
  }, [admin, dispatch]);

  const displayName =
    admin?.name || admin?.fullName || admin?.email || "Admin";
  const roleLabel = role
    ? role
        .split("-")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ")
    : "Admin";

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <div className="bg-[#1C5941] text-white p-4 text-xl font-semibold rounded-md">
        Personal Information
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Card and Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Profile Section */}
          <div>
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <Avatar className="h-40 w-40 mb-4">
                <AvatarImage
                  src="https://images.app.goo.gl/mrJyRYZVPjsik1j19"
                  alt="Isabela"
                />
                <AvatarFallback>
                  {displayName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-lg font-medium text-gray-800">Profile</p>
              <p className="text-gray-600">{roleLabel}</p>
            </div>

            {/* Edit Profile Button (separate) */}
            <div className="mt-4">
              <Button
                className="bg-[#1C5941]/80 text-white px-6 py-2 w-full flex items-center justify-center space-x-2 shadow-md rounded-md transition-all duration-200"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586l-4 4V17h4l4-4-4-4z" />
                </svg>
                <span>Edit Profile</span>
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Self edit not supported yet.
              </p>
            </div>
          </div>

          {/* Right Information Section */}
          <div className="md:col-span-2 p-6 space-y-6 bg-white rounded-lg shadow-md">
            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Name
              </Label>
              <Input
                id="name"
                value={displayName}
                readOnly
                className="bg-gray-50 border border-gray-200 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Email
              </Label>
              <Input
                id="email"
                value={admin?.email || "â€”"}
                readOnly
                className="bg-gray-50 border border-gray-200 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label
                htmlFor="role"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Role
              </Label>
              <Input
                id="role"
                value={roleLabel}
                readOnly
                className="bg-gray-50 border border-gray-200 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

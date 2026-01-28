import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  loadAdminProfile,
  selectAdmin,
  selectAdminRole,
} from "@/store/adminAuthSlice";

const EditProfile = () => {
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
      <div className="bg-[#1C5941] text-white p-4 text-xl font-semibold flex gap-2 items-center rounded-md">
        <Link to="/dashboard/settings/profile">
          <ArrowLeft className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform duration-200" />
        </Link>
        <span>Edit Personal Information</span>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Self edit is not supported yet. Please contact a super-admin to update
          your profile details.
        </div>
        {/* Profile Card and Information Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-40 w-40">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>
                  {displayName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-lg font-medium text-gray-800">Profile</p>
            <p className="text-gray-600">{roleLabel}</p>
          </div>

          {/* Information Fields */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
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
                className="bg-gray-50 border border-gray-300 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none"
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
                type="email"
                value={admin?.email || "â€”"}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none"
              />
            </div>

            {/* Additional Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <div>
                <Link to={"/dashboard/settings/profile"}>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

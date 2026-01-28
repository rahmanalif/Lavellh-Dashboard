import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MobileSidebar } from "./DashboardSidebar";
import { adminLogout, selectAdmin, selectAdminRole } from "@/store/adminAuthSlice";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector(selectAdmin);
  const role = useSelector(selectAdminRole);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/signin");
  };

  const displayName =
    admin?.name ||
    admin?.fullName ||
    admin?.email ||
    "Admin";

  const roleLabel = role
    ? role
        .split("-")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ")
    : "Admin";

  return (
    <header className="bg-white text-[#606060] px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Sidebar Trigger */}
          <div className="lg:hidden">
            <MobileSidebar />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold">
              <span className="hidden sm:inline font-bold text-2xl sm:text-3xl text-[#1C5941]">
                Welcome, {displayName}
              </span>
            </h1>
            <span className="text-sm sm:text-base text-[#606060]">
              Role: {roleLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <Link to={"/dashboard/notifications"}>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#1C5941] bg-[#DFE7DE] hover:bg-[#cbd7ca] rounded-full relative h-8 w-8 sm:h-10 sm:w-10 transition-colors"
            >
              <Bell size={20} className="text-[#1C5941]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8  sm:h-10 sm:w-10 rounded-full  hover:bg-white/10"
              >
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                  />
                  <AvatarFallback className="bg-black text-[#017783] text-xs sm:text-sm font-semibold">
                    {displayName
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-gray-500">
                Signed in as
              </DropdownMenuLabel>
              <div className="px-2 pb-2">
                <p className="text-sm font-semibold text-gray-800">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

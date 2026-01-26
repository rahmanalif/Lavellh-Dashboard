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
import { Bell, Search, LogOut, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MobileSidebar } from "./DashboardSidebar";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/signin");
  };

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
                Welcome to Admin
              </span>
            </h1>
            <span className="text-xl text-[#606060]">Have a nice day!</span>
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
                    DA
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

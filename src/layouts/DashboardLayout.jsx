// DashboardLayout.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "../components/dashboardcomponents/DashboardHeader";
import DashboardSidebar from "../components/dashboardcomponents/DashboardSidebar";
import { Outlet } from "react-router-dom"; // Import Outlet
import { loadAdminProfile, selectAdmin } from "@/store/adminAuthSlice";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const admin = useSelector(selectAdmin);
  const accessToken = useSelector((state) => state.adminAuth.accessToken);

  useEffect(() => {
    if (accessToken && !admin) {
      dispatch(loadAdminProfile());
    }
  }, [accessToken, admin, dispatch]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - শুধুমাত্র desktop এ দেখাবে */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - এতে MobileSidebar আছে mobile এর জন্য */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F8F4] p-4 sm:p-6 ">
          <Outlet /> {/* Replace {children} with Outlet */}
        </main>
      </div>
    </div>
  );
}

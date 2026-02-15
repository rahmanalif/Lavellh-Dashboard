import { createBrowserRouter, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import SignInPage from "../pages/auth/SignInPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OTPVerification from "../pages/auth/OTPVerification";
import ResetPassword from "../pages/auth/ResetPassword";

// Dashboard Pages
import DashboardOverview from "../pages/dashboardpages/DashboardOverview/DashboardOverview";
import Profile from "../pages/dashboardpages/personalinformation/Profile";

import TermsAndConditions from "../pages/dashboardpages/terms/TermsAndConditions";
import EditTermsAndConditions from "../pages/dashboardpages/terms/EditTermsAndConditions";
import PrivacyPolicy from "../pages/dashboardpages/privacypolicy/PrivacyPolicy";
import EditPrivacyPolicy from "../pages/dashboardpages/privacypolicy/EditPrivacyPolicy";
import AboutUs from "../pages/dashboardpages/about/AboutUs";
import EditAbout from "../pages/dashboardpages/about/EditAbout";

import AllUsers from "../pages/dashboardpages/user/AllUsers";
import Earnings from "../pages/dashboardpages/earnings/Earnings";
import Providers from "../pages/dashboardpages/providers/Providers";
import AllNotifications from "../pages/dashboardpages/notification/AllNotifications";
import Categories from "../pages/dashboardpages/categories/Categories";
import Transactions from "@/pages/dashboardpages/transactions/Transactions";
import WithdrawRequest from "@/pages/dashboardpages/withdrawrequest/WithdrawRequest";
import ChangedPassword from "@/pages/dashboardpages/personalinformation/ChangedPassword";
import { FAQSection } from "@/pages/dashboardpages/faq/FAQSection";
import EditFAQ from "@/pages/dashboardpages/faq/EditFAQ";
import { InboxSection } from "@/pages/dashboardpages/support/InboxSection";
import EditProfile from "@/pages/dashboardpages/personalinformation/EditProfile";
import BusinessOwner from "@/pages/dashboardpages/businessOwner/BusinessOwner";
import EventManager from "@/pages/event-manager/EventManager";
import CreateNotification from "@/pages/createNotification/CreateNotification";
import Admins from "@/pages/dashboardpages/admins/Admins";
import DiscoveryRanking from "@/pages/dashboardpages/discoveryRanking/DiscoveryRanking";
import BroadcastNotificationPage from "@/pages/dashboardpages/notificationBroadcast/BroadcastNotificationPage";
import ReviewModerationPage from "@/pages/dashboardpages/reviewModeration/ReviewModerationPage";
import ProtectedRoute from "./ProtectedRoute";
// import FAQ from "../pages/dashboardpages/faq/FAQ";
// import EditFAQ from "../pages/dashboardpages/faq/EditFAQ";
// import Listings from "../pages/dashboardpages/listings/Listings";
// import Providers from "../pages/dashboardpages/providers/Providers";
// import Categories from "../pages/dashboardpages/categories/Categories";
// import WithdrawRequest from "../pages/dashboardpages/withdraw/WithdrawRequest";
// import Support from "../pages/dashboardpages/support/Support";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SignInPage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/forgotpass",
    element: <ForgotPassword />,
  },
  {
    path: "/otpverification",
    element: <OTPVerification />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "notifications", element: <AllNotifications /> },
      { path: "notifications/broadcast", element: <BroadcastNotificationPage /> },
      { path: "reviews/moderation", element: <ReviewModerationPage /> },
      { path: "users", element: <AllUsers /> },
      { path: "earnings", element: <Earnings /> },
      { path: "transactions", element: <Transactions /> },
      { path: "providers", element: <Providers /> },
      { path: "business-owner", element: <BusinessOwner /> },
      { path: "event-manager", element: <EventManager /> },
      { path: "discovery-ranking", element: <DiscoveryRanking /> },
      { path: "categories", element: <Categories /> },
      { path: "withdraw-request", element: <WithdrawRequest /> },
      { path: "support", element: <InboxSection /> },
      { path: "admins", element: <Admins /> },

      // Settings
      { path: "settings/profile", element: <Profile /> },
      { path: "settings/editpersonal", element: <EditProfile /> },
      { path: "settings/create-notification", element: <CreateNotification /> },
      {
        path: "settings/changedpasswoard",
        element: <ChangedPassword />,
      },
      { path: "settings/terms", element: <TermsAndConditions /> },
      { path: "settings/editterms", element: <EditTermsAndConditions /> },
      { path: "settings/privacy", element: <PrivacyPolicy /> },
      { path: "settings/editprivacy", element: <EditPrivacyPolicy /> },
      { path: "settings/about", element: <AboutUs /> },
      { path: "settings/editabout", element: <EditAbout /> },
      { path: "settings/faq", element: <FAQSection /> },
      { path: "settings/editfaq", element: <EditFAQ /> },
    ],
  },
  {
    path: "/admin/discovery-ranking",
    element: <Navigate to="/dashboard/discovery-ranking" replace />,
  },
  {
    path: "/admin/notifications/broadcast",
    element: <Navigate to="/dashboard/notifications/broadcast" replace />,
  },
  {
    path: "/admin/reviews/moderation",
    element: <Navigate to="/dashboard/reviews/moderation" replace />,
  },
]);

export default routes;

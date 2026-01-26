import {
  LayoutDashboard,
  Users2,
  Settings,
  UserCog,
  Info,
  FileText,
  ScrollText,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  HelpCircle,
  Package,
  Calendar,
  MessageSquare,
  ClipboardList,
  BanknoteArrowUp,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "../../assets/logo ayudane.png";

// Sidebar Items
const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "earnings", href: "/dashboard/earnings", icon: BanknoteArrowUp },
  { title: "Users", href: "/dashboard/users", icon: Users2 },
  { title: "Providers", href: "/dashboard/providers", icon: Package },
  { title: "Business Owner", href: "/dashboard/business-owner", icon: Package },
  { title: "Event manager", href: "/dashboard/event-manager", icon: Package },
  { title: "Categories", href: "/dashboard/categories", icon: ClipboardList },
  {
    title: "Withdraw Request",
    href: "/dashboard/withdraw-request",
    icon: Calendar,
  },
  {
    title: "Subscription",
    href: "/dashboard/subscription",
    icon: Calendar,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    children: [
      { title: "Profile", href: "/dashboard/settings/profile", icon: UserCog },
      { title: "Create Notification", href: "/dashboard/settings/create-notification", icon: UserCog },
      {
        title: "Terms & Condition",
        href: "/dashboard/settings/terms",
        icon: ScrollText,
      },
      {
        title: "Privacy Policy",
        href: "/dashboard/settings/privacy",
        icon: FileText,
      },
      { title: "About Us", href: "/dashboard/settings/about", icon: Info },
      { title: "FAQ", href: "/dashboard/settings/faq", icon: HelpCircle },
    ],
  },
  { title: "Support", href: "/dashboard/support", icon: MessageSquare },
];

// Logo Section
function LogoSection({ name = "Ayudame", title = "" }) {
  return (
    <Link to="/dashboard">
      <div className="flex flex-col sm:flex-row items-center  p-6 sm:p-8 bg-transparent">
        <div className="w-20 h-20 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          {title && (
            <p className="text-sm sm:text-base text-white/70 mt-1">{title}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Sidebar Navigation List
function SidebarNav({ onLinkClick }) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpanded = (href) =>
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((i) => i !== href) : [...prev, href]
    );

  const isExpanded = (href) => expandedItems.includes(href);

  return (
    <nav className="flex-1 p-2 sm:p-4 overflow-y-auto flex flex-col">
      <ul className="space-y-1 sm:space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          const hasChildren = !!item.children?.length;
          const expanded = isExpanded(item.href);

          return (
            <li key={item.href}>
              {hasChildren ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => toggleExpanded(item.href)}
                    className={cn(
                      "w-full justify-start gap-2 h-8 sm:h-10 text-sm sm:text-base",
                      isActive
                        ? "bg-white text-[#1C5941]"
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <div
                    className={cn(
                      "transition-all overflow-hidden duration-200 ml-3 sm:ml-4",
                      expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <ul className="space-y-1 mt-1 sm:mt-2">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link to={child.href} onClick={onLinkClick}>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start gap-2 h-7 sm:h-9 text-xs sm:text-sm",
                                  isChildActive
                                    ? "bg-white text-[#1C5941]"
                                    : "text-white hover:bg-white/20"
                                )}
                              >
                                <child.icon className="h-3 w-3" />
                                {child.title}
                              </Button>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                <Link to={item.href} onClick={onLinkClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-8 sm:h-10 text-sm sm:text-base",
                      isActive
                        ? "bg-white text-[#1C5941]"
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    {item.title}
                  </Button>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Logout button */}
      <div className="mt-auto p-2 sm:p-4 border-t border-white/20">
        <Link to="/" onClick={onLinkClick}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-8 sm:h-10 hover:text-red-700 text-red-700 border-2 border-red-500 bg-white "
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            Log Out
          </Button>
        </Link>
      </div>
    </nav>
  );
}

// Desktop Sidebar
function DesktopSidebar() {
  return (
    <div className="hidden lg:flex h-full w-72 flex-col bg-[#165039] border-r border-gray-200">
      <LogoSection />
      <SidebarNav />
    </div>
  );
}

// Mobile Sidebar
function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant=""
          size="icon"
          className="lg:hidden bg-[#2d5f4f] text-white h-8 w-8 border border-white/20"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 sm:max-w-sm bg-[#2d5f4f]">
        <div className="flex h-full flex-col">
          <LogoSection />
          <SidebarNav onLinkClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Exports
export { DesktopSidebar, MobileSidebar };
export default function DashboardSidebar() {
  return <DesktopSidebar />;
}

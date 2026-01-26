"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const AllNotifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample notifications data
  const allNotifications = [
    {
      id: 1,
      type: "money",
      message: "A host request for money withdraw",
      time: "2h 12 min ago",
    },
    {
      id: 2,
      type: "register",
      message: "A host are register Now",
      time: "2h 12 min ago",
    },
    {
      id: 3,
      type: "payment",
      message: "A guest pay now for confirmation",
      time: "2h 12 min ago",
    },
    {
      id: 4,
      type: "user_joined",
      message: "An user joined in app",
      time: "2h 12 min ago",
    },
    {
      id: 5,
      type: "money",
      message: "A host request for money withdraw",
      time: "2h 12 min ago",
    },
    {
      id: 6,
      type: "user_joined",
      message: "An user joined in app",
      time: "2h 12 min ago",
    },
    {
      id: 7,
      type: "payment",
      message: "A guest pay now for confirmation",
      time: "2h 12 min ago",
    },
    {
      id: 8,
      type: "user_joined",
      message: "An user joined in app",
      time: "2h 12 min ago",
    },
    {
      id: 9,
      type: "money",
      message: "A host request for money withdraw",
      time: "3h 15 min ago",
    },
    {
      id: 10,
      type: "register",
      message: "A host are register Now",
      time: "3h 20 min ago",
    },
    {
      id: 11,
      type: "payment",
      message: "A guest pay now for confirmation",
      time: "4h 10 min ago",
    },
    {
      id: 12,
      type: "user_joined",
      message: "An user joined in app",
      time: "4h 25 min ago",
    },
    {
      id: 13,
      type: "money",
      message: "A host request for money withdraw",
      time: "5h 30 min ago",
    },
    {
      id: 14,
      type: "register",
      message: "A host are register Now",
      time: "6h 45 min ago",
    },
    {
      id: 15,
      type: "payment",
      message: "A guest pay now for confirmation",
      time: "7h 20 min ago",
    },
    {
      id: 16,
      type: "user_joined",
      message: "An user joined in app",
      time: "8h 15 min ago",
    },
  ];

  const totalPages = Math.ceil(allNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = allNotifications.slice(startIndex, endIndex);

  const getNotificationIcon = () => {
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  // Pagination page numbers (dynamic visible pages)
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full mx-auto bg-white">
      {/* Header */}
      <div className="bg-[#1C5941] text-white p-4 flex items-center gap-3">
        <ChevronLeft className="w-5 h-5" />
        <h1 className="text-lg font-medium">All Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {currentNotifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">{getNotificationIcon()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "bg-[#1C5941] hover:bg-[#1C5941] text-white"
                  : "hover:bg-gray-100"
              }
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllNotifications;

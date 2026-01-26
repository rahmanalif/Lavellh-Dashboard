"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WithdrawRequestList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteRequest, setDeleteRequest] = useState(null);
  const [requests, setRequests] = useState(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      providerName: "Enrique",
      bankName: "Brac Bank",
      accountType: "Savings",
      accountNumber: "123456789",
      amount: "$250",
      status: i % 3 === 0 ? "Pending" : i % 4 === 0 ? "Cancelled" : "Approved",
    }))
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = requests.slice(startIndex, startIndex + itemsPerPage);

  // Delete handler
  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setDeleteRequest(null);
  };

  return (
    <div className="">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className=" text-lg font-semibold">
            Withdraw Request List
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1C5941]  text-white">
                <TableHead className="text-center text-white font-semibold">
                  #Sl
                </TableHead>
                <TableHead className="text-center text-white font-semibold">
                  Provider Name
                </TableHead>
                <TableHead className="text-center text-white  font-semibold">
                  Bank Name
                </TableHead>
                <TableHead className="text-center text-white font-semibold">
                  A/C Type
                </TableHead>
                <TableHead className="text-center text-white font-semibold">
                  A/C Number
                </TableHead>
                <TableHead className="text-center text-white font-semibold">
                  Withdraw Amount
                </TableHead>
                <TableHead className="text-center text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-center text-white font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentRequests.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.providerName}
                  </TableCell>
                  <TableCell className="text-center">{item.bankName}</TableCell>
                  <TableCell className="text-center">
                    {item.accountType}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.accountNumber}
                  </TableCell>
                  <TableCell className="text-center">{item.amount}</TableCell>
                  <TableCell
                    className={cn(
                      "text-center font-medium",
                      item.status === "Approved" && "text-green-600",
                      item.status === "Pending" && "text-yellow-500",
                      item.status === "Cancelled" && "text-red-600"
                    )}
                  >
                    {item.status}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedRequest(item)}
                    >
                      <Eye className="h-4 w-4 text-[#1C5941]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteRequest(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader className="flex justify-between items-center border-b pb-2">
            <DialogTitle className="text-[#1C5941]">
              Withdraw Request Details
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between">
                <span>Provider Name</span>
                <span className="font-semibold">
                  {selectedRequest.providerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bank Name</span>
                <span className="font-semibold">
                  {selectedRequest.bankName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>A/C Type</span>
                <span className="font-semibold">
                  {selectedRequest.accountType}
                </span>
              </div>
              <div className="flex justify-between">
                <span>A/C Number</span>
                <span className="font-semibold">
                  {selectedRequest.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Withdraw Amount</span>
                <span className="font-semibold">{selectedRequest.amount}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between pt-3">
            <Button
              variant="outline"
              className="border-[#1C5941] text-[#1C5941] hover:bg-gray-100"
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </Button>
            <Button className="bg-[#1C5941] hover:bg-[#1C5941] text-white">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteRequest}
        onOpenChange={() => setDeleteRequest(null)}
      >
        <DialogContent className="sm:max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1C5941] text-center">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600">
            Are you sure you want to delete this withdraw request?
          </p>
          <DialogFooter className="flex justify-between pt-3">
            <Button
              variant="outline"
              className="border-[#1C5941] text-[#1C5941] hover:bg-gray-100"
              onClick={() => setDeleteRequest(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleDelete(deleteRequest.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawRequestList;

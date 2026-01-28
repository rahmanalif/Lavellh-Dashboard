"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchTransactions,
  selectTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "@/store/transactionsSlice";

const typeOptions = [
  { label: "Provider", value: "provider" },
  { label: "Biz Owners", value: "businessOwner" },
  { label: "Event manager", value: "eventManager" },
  { label: "All", value: "all" },
];

export default function RecentTransactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);

  const [selectedType, setSelectedType] = useState("provider");
  const [viewDialog, setViewDialog] = useState({
    open: false,
    transaction: null,
  });

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: 1,
        limit: 5,
        type: selectedType || "all",
      })
    );
  }, [dispatch, selectedType]);

  const handleView = (transaction) => {
    setViewDialog({ open: true, transaction });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm mt-5 p-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Transactions
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-none shadow-none hover:bg-transparent text-gray-600 font-medium"
            >
              {typeOptions.find((t) => t.value === selectedType)?.label ||
                "All"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {typeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSelectedType(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1C5941]">
            <TableRow className="hover:bg-[#1C5941]">
              <TableHead className="text-center text-white text-xs">#Tr.ID</TableHead>
              <TableHead className="text-center text-white text-xs">User Name</TableHead>
              <TableHead className="text-center text-white text-xs">Provider Name</TableHead>
              <TableHead className="text-center text-white text-xs">Amount</TableHead>
              <TableHead className="text-center text-white text-xs">Date</TableHead>
              <TableHead className="text-center text-white text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" && transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-400"
                >
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.transactionId || transaction.orderId || transaction.id}
                  className="hover:bg-gray-50 border-b"
                >
                  <TableCell className="text-center text-sm">
                    {transaction.transactionId || transaction.orderId || "N/A"}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {transaction.userName || "N/A"}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {transaction.providerName ||
                      transaction.businessOwnerName ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    {transaction.amount ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {transaction.date
                      ? new Date(transaction.date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(transaction)}
                      className="h-8 w-8 text-[#1C5941] hover:bg-emerald-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                  {error || "No transactions found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, transaction: null })}
      >
        <DialogContent className="sm:max-w-[450px] bg-[#f8faf9] p-0 overflow-hidden border-none rounded-xl">
          <div className="relative p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-center text-xl font-medium text-gray-700">
                Transaction Details
              </DialogTitle>
            </DialogHeader>

            {viewDialog.transaction && (
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden bg-white">
                <DetailRow label="Transaction ID :" value={`#${viewDialog.transaction.transactionId || viewDialog.transaction.orderId || "N/A"}`} />
                <DetailRow label="Date :" value={viewDialog.transaction.date ? new Date(viewDialog.transaction.date).toLocaleString() : "N/A"} />
                <DetailRow label="User name :" value={viewDialog.transaction.userName || "N/A"} />
                <DetailRow label="Provider name :" value={viewDialog.transaction.providerName || viewDialog.transaction.businessOwnerName || "N/A"} />
                <DetailRow label="Payment status :" value={viewDialog.transaction.paymentStatus || "N/A"} />
                <DetailRow label="Amount :" value={viewDialog.transaction.amount ?? "N/A"} last />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value, last = false }) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-3 ${
        !last ? "border-b border-gray-100" : ""
      }`}
    >
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <span className="text-gray-800 text-sm font-semibold">{value}</span>
    </div>
  );
}

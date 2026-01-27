
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchTransactions,
  selectTransactions,
  selectTransactionsCurrentPage,
  selectTransactionsError,
  selectTransactionsStatus,
  selectTransactionsTotalPages,
} from "@/store/transactionsSlice";

export function TransactionsTable() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const totalPages = useSelector(selectTransactionsTotalPages);
  const apiCurrentPage = useSelector(selectTransactionsCurrentPage);

  const [selectedRole, setSelectedRole] = useState("Provider");
  const [searchUser, setSearchUser] = useState("");
  const [searchProvider, setSearchProvider] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPage, setGoToPage] = useState("");

  const itemsPerPage = 10;

  const typeMap = {
    Provider: "provider",
    "Biz Owners": "businessOwner",
    "Event Planers": "eventManager",
  };

  const activeSearch = searchUser.trim() || searchProvider.trim();
  const from = searchDate ? searchDate : null;
  const to = searchDate ? searchDate : null;

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: currentPage,
        limit: itemsPerPage,
        type: typeMap[selectedRole] || "all",
        search: activeSearch || undefined,
        from: from || undefined,
        to: to || undefined,
      })
    );
  }, [activeSearch, currentPage, dispatch, itemsPerPage, from, selectedRole, to]);

  const currentItems = useMemo(() => transactions, [transactions]);

  const handlePrint = () => window.print();
  const handleDownload = () => {
    alert("Downloading Transaction #" + selectedTransaction?.id);
  };

  return (
    <Card className="mt-5 border-none shadow-none bg-[#F9FAFB]">
      <CardHeader className="px-0">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 font-medium">
                  {selectedRole} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["Provider", "Biz Owners", "Event Planers"].map(role => (
                  <DropdownMenuItem key={role} onClick={() => {setSelectedRole(role); setCurrentPage(1);}}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2">
             <div className="relative">
                <Input
                  placeholder="YYYY-MM-DD"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-40"
                />
                <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
             </div>
             <Input placeholder="User Name" className="w-40" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
             <Input placeholder="Provider Name" className="w-52" value={searchProvider} onChange={(e) => setSearchProvider(e.target.value)} />
             <Button size="icon" className="bg-[#1C5941] rounded-full h-9 w-9">
               <Search className="h-4 w-4" />
             </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden border border-gray-100">
          <Table>
            <TableHeader className="bg-[#1C5941]">
              <TableRow className="hover:bg-[#1C5941]">
                <TableHead className="text-white text-center py-4">#Tr.ID</TableHead>
                <TableHead className="text-white text-center">User Name</TableHead>
                <TableHead className="text-white text-center">Provider Name</TableHead>
                <TableHead className="text-white text-center">Amount</TableHead>
                <TableHead className="text-white text-center">Date</TableHead>
                <TableHead className="text-white text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {status === "loading" && currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : currentItems.length > 0 ? (
                currentItems.map((t) => (
                  <TableRow key={t.transactionId || t.orderId} className="border-b ">
                    <TableCell className="text-center text-gray-600 py-4">
                      {t.transactionId || t.orderId || "—"}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">{t.userName || "—"}</TableCell>
                    <TableCell className="text-center text-gray-600">{t.providerName || "—"}</TableCell>
                    <TableCell className="text-center font-medium">
                      {t.amount ?? "—"}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">
                      {t.date ? new Date(t.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-center flex justify-center gap-3">
                      <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => {setSelectedTransaction(t); setIsModalOpen(true);}} />
                      <Trash2 className="h-5 w-5 text-red-400 cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    {error || "No transactions found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end mt-6 gap-2 text-sm text-gray-600">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-md border-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <span className={`px-3 py-1 border rounded-md ${currentPage === 1 ? 'border-[#1C5941] text-[#1C5941]' : 'border-gray-200'}`} onClick={() => setCurrentPage(1)}>1</span>
          
          {currentPage > 3 && <span>...</span>}
          
          <span className="px-3 py-1 border border-[#1C5941] bg-[#1C5941] text-white rounded-md">{currentPage}</span>
          
          {currentPage < totalPages - 1 && <span>...</span>}
          
          <span className="px-3 py-1 border border-gray-200 rounded-md" onClick={() => setCurrentPage(totalPages)}>{totalPages}</span>

          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="bg-[#1C5941] hover:bg-[#144230] rounded-md"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          <div className="flex items-center gap-2 ml-4">
            <span>Page</span>
            <Input 
              className="w-12 h-8 text-center border-gray-200" 
              value={goToPage} 
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  const p = parseInt(goToPage);
                  if(p > 0 && p <= totalPages) setCurrentPage(p);
                }
              }}
            />
            <span>Go</span>
          </div>
        </div>


        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-2xl">
            <div className="bg-[#F8FAF9] relative p-6">
              <div className="absolute top-0 right-0  p-2 cursor-pointer rounded-bl-xl" onClick={() => setIsModalOpen(false)}>

              </div>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-center text-gray-700 font-medium ">Transaction Details</DialogTitle>
              </DialogHeader>

              {selectedTransaction && (
                <div className="space-y-0 border rounded-lg bg-white border-gray-200 overflow-hidden">
                  <DetailRow label="Transaction ID :" value={selectedTransaction.transactionId || selectedTransaction.orderId} />
                  <DetailRow label="Date :" value={selectedTransaction.date ? new Date(selectedTransaction.date).toLocaleString() : "—"} />
                  <DetailRow label="User name :" value={selectedTransaction.userName || "—"} />
                  <DetailRow label="Provider name :" value={selectedTransaction.providerName || "—"} />
                  <DetailRow label="Payment status :" value={selectedTransaction.paymentStatus || "—"} />
                  <DetailRow label="Amount :" value={selectedTransaction.amount ?? "—"} isBold />
                  <DetailRow label="Down payment :" value={selectedTransaction.downPayment ?? "—"} />
                  <DetailRow label="Due amount :" value={selectedTransaction.dueAmount ?? "—"} />
                  <DetailRow label="Remaining amount :" value={selectedTransaction.remainingAmount ?? "—"} />
                  <DetailRow label="Paid via :" value={selectedTransaction.paidVia ?? "—"} />
                  <DetailRow label="Status :" value={selectedTransaction.status || "—"} last />
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={handleDownload} className="flex-1 border-[#1C5941] text-[#1C5941] rounded-full py-6">Download</Button>
                <Button onClick={handlePrint} className="flex-1 bg-[#1C5941] text-white rounded-full py-6 hover:bg-[#144230]">Print</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value, last, isBold }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`text-xs ${isBold ? "font-bold" : "font-medium"} text-gray-800`}>{value}</span>
    </div>
  );
}

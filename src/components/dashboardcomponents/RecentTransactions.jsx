

// "use client";

// import React, { useState, useMemo } from "react";
// import { Eye, Trash2, Download, Printer, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// export default function RecentTransactions() {

//   const [selectedRole, setSelectedRole] = useState("Provider");
//   const [transactions, setTransactions] = useState([
//     {
//       id: "12345671",
//       userName: "Rokey",
//       providerName: "John Doe",
//       amount: "$250",
//       date: "16 Apr 2024",
//       accountNumber: "**** **** **** 1645",
//       accountHolder: "Rokey",
//       role: "Provider",
//     },
//     {
//       id: "12345672",
//       userName: "Siam",
//       providerName: "Alex Smith",
//       amount: "$180",
//       date: "15 Apr 2024",
//       accountNumber: "**** **** **** 8899",
//       accountHolder: "Siam",
//       role: "Provider",
//     },
//     {
//       id: "12345673",
//       userName: "Niloy",
//       providerName: "John Doe",
//       amount: "$320",
//       date: "14 Apr 2024",
//       accountNumber: "**** **** **** 4455",
//       accountHolder: "Niloy",
//       role: "Provider",
//     },

//     // --- Biz Owners Data ---
//     {
//       id: "22345681",
//       userName: "Tanvir",
//       providerName: "Tech Solutions",
//       amount: "$1250",
//       date: "10 Apr 2024",
//       accountNumber: "**** **** **** 1122",
//       accountHolder: "Tanvir",
//       role: "Biz Owners",
//     },
//     {
//       id: "22345682",
//       userName: "Arif",
//       providerName: "Global Trade",
//       amount: "$950",
//       date: "09 Apr 2024",
//       accountNumber: "**** **** **** 3344",
//       accountHolder: "Arif",
//       role: "Biz Owners",
//     },

//     // --- Event Manager Data ---
//     {
//       id: "33445691",
//       userName: "Rahat",
//       providerName: "Grand Plaza",
//       amount: "$450",
//       date: "12 Apr 2024",
//       accountNumber: "**** **** **** 9900",
//       accountHolder: "Rahat",
//       role: "Event manager",
//     },
//     {
//       id: "33445692",
//       userName: "Karim",
//       providerName: "Dream Wedding",
//       amount: "$700",
//       date: "11 Apr 2024",
//       accountNumber: "**** **** **** 7766",
//       accountHolder: "Karim",
//       role: "Event manager",
//     },
//     {
//       id: "33445693",
//       userName: "Zayan",
//       providerName: "Skyline Events",
//       amount: "$550",
//       date: "08 Apr 2024",
//       accountNumber: "**** **** **** 5522",
//       accountHolder: "Zayan",
//       role: "Event manager",
//     },
//   ]);

//   const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
//   const [viewDialog, setViewDialog] = useState({
//     open: false,
//     transaction: null,
//   });


//   const filteredTransactions = useMemo(() => {
//     return transactions.filter((t) => t.role === selectedRole);
//   }, [selectedRole, transactions]);

//   const handleDelete = (id) => {
//     setTransactions(transactions.filter((t) => t.id !== id));
//     setDeleteDialog({ open: false, id: null });
//   };

//   const handleView = (transaction) => {
//     setViewDialog({ open: true, transaction });
//   };

//   const handleDownload = () => alert("Downloading...");
//   const handlePrint = () => window.print();

//   return (
//     <div className="w-full bg-white rounded-lg shadow-sm mt-5 p-4">
//       {/* --- Header Section with Dropdown --- */}
//       <div className="flex justify-between items-center mb-4 px-2">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Recent Transactions
//         </h2>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="flex items-center gap-2 border-none shadow-none hover:bg-transparent text-gray-600 font-medium"
//             >
//               {selectedRole} <ChevronDown className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="bg-white">
//             <DropdownMenuItem onClick={() => setSelectedRole("Provider")}>
//               Provider
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setSelectedRole("Biz Owners")}>
//               Biz Owners
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setSelectedRole("Event manager")}>
//               Event manager
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Table Section */}
//       <div className="border rounded-lg overflow-hidden">
//         <Table>
//           <TableHeader className="bg-[#1C5941]">
//             <TableRow className="hover:bg-[#1C5941]">
//               <TableHead className="text-center text-white text-xs">
//                 #Tr.ID
//               </TableHead>
//               <TableHead className="text-center text-white text-xs">
//                 User Name
//               </TableHead>
//               <TableHead className="text-center text-white text-xs">
//                 Provider Name
//               </TableHead>
//               <TableHead className="text-center text-white text-xs">
//                 Amount
//               </TableHead>
//               <TableHead className="text-center text-white text-xs">
//                 Date
//               </TableHead>
//               <TableHead className="text-center text-white text-xs">
//                 Action
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredTransactions.length > 0 ? (
//               filteredTransactions.map((transaction) => (
//                 <TableRow
//                   key={transaction.id}
//                   className="hover:bg-gray-50 border-b"
//                 >
//                   <TableCell className="text-center text-sm">
//                     {transaction.id}
//                   </TableCell>
//                   <TableCell className="text-center text-sm">
//                     {transaction.userName}
//                   </TableCell>
//                   <TableCell className="text-center text-sm">
//                     {transaction.providerName}
//                   </TableCell>
//                   <TableCell className="text-center text-sm font-medium">
//                     {transaction.amount}
//                   </TableCell>
//                   <TableCell className="text-center text-sm">
//                     {transaction.date}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex justify-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleView(transaction)}
//                         className="h-8 w-8 text-[#1C5941] hover:bg-emerald-50"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           setDeleteDialog({ open: true, id: transaction.id })
//                         }
//                         className="h-8 w-8 text-red-500 hover:bg-red-50"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={6}
//                   className="text-center py-10 text-gray-400"
//                 >
//                   No transactions found for this role.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog
//         open={deleteDialog.open}
//         onOpenChange={(open) => setDeleteDialog({ open, id: null })}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the
//               transaction.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => handleDelete(deleteDialog.id)}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* View Transaction Dialog */}
//       <Dialog
//         open={viewDialog.open}
//         onOpenChange={(open) => setViewDialog({ open, transaction: null })}
//       >
//         <DialogContent className="sm:max-w-md bg-[#F9F9F6]">
//           <DialogHeader className="border-b pb-4">
//             <DialogTitle className="text-xl font-semibold text-gray-800">
//               Transaction Details
//             </DialogTitle>
//           </DialogHeader>

//           {viewDialog.transaction && (
//             <div className="space-y-4 py-4">
//               <div className="flex justify-between py-2 border-b border-gray-200/50">
//                 <span className="text-gray-500 text-sm">Transaction ID :</span>
//                 <span className="font-medium text-gray-800">
//                   #{viewDialog.transaction.id}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-200/50">
//                 <span className="text-gray-500 text-sm">Date :</span>
//                 <span className="font-medium text-gray-800">
//                   {viewDialog.transaction.date}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-200/50">
//                 <span className="text-gray-500 text-sm">User name :</span>
//                 <span className="font-medium text-gray-800">
//                   {viewDialog.transaction.userName}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-200/50">
//                 <span className="text-gray-500 text-sm">A/C number :</span>
//                 <span className="font-medium text-gray-800">
//                   {viewDialog.transaction.accountNumber}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-200/50">
//                 <span className="text-gray-500 text-sm">
//                   Transaction amount :
//                 </span>
//                 <span className="font-bold text-gray-800">
//                   {viewDialog.transaction.amount}
//                 </span>
//               </div>

//               <div className="flex gap-3 pt-6">
//                 <Button
//                   onClick={handleDownload}
//                   variant="outline"
//                   className="flex-1 border-gray-300"
//                 >
//                   <Download className="h-4 w-4 mr-2" /> Download
//                 </Button>
//                 <Button
//                   onClick={handlePrint}
//                   className="flex-1 bg-[#1C5941] hover:bg-[#144230] text-white"
//                 >
//                   <Printer className="h-4 w-4 mr-2" /> Print
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import React, { useState, useMemo } from "react";
import { Eye, Trash2, Download, Printer, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

export default function RecentTransactions() {
  const [selectedRole, setSelectedRole] = useState("Provider");
  const [transactions, setTransactions] = useState([
    {
      id: "12345671",
      userName: "Rokey",
      providerName: "John Doe",
      amount: "$250",
      date: "16 Apr 2024",
      accountNumber: "**** **** **** 1645",
      accountHolder: "Rokey",
      role: "Provider",
    },
    {
      id: "12345672",
      userName: "Siam",
      providerName: "Alex Smith",
      amount: "$180",
      date: "15 Apr 2024",
      accountNumber: "**** **** **** 8899",
      accountHolder: "Siam",
      role: "Provider",
    },
    {
      id: "22345681",
      userName: "Tanvir",
      providerName: "Tech Solutions",
      amount: "$1250",
      date: "10 Apr 2024",
      accountNumber: "**** **** **** 1122",
      accountHolder: "Tanvir",
      role: "Biz Owners",
    },
    {
      id: "33445691",
      userName: "Rahat",
      providerName: "Grand Plaza",
      amount: "$450",
      date: "12 Apr 2024",
      accountNumber: "**** **** **** 9900",
      accountHolder: "Rahat",
      role: "Event manager",
    },
  ]);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [viewDialog, setViewDialog] = useState({ open: false, transaction: null });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.role === selectedRole);
  }, [selectedRole, transactions]);

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setDeleteDialog({ open: false, id: null });
  };

  const handleView = (transaction) => {
    setViewDialog({ open: true, transaction });
  };

  const handleDownload = () => alert("Downloading...");
  const handlePrint = () => window.print();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm mt-5 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-none shadow-none hover:bg-transparent text-gray-600 font-medium">
              {selectedRole} <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={() => setSelectedRole("Provider")}>Provider</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Biz Owners")}>Biz Owners</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Event manager")}>Event manager</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Section */}
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
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50 border-b">
                <TableCell className="text-center text-sm">{transaction.id}</TableCell>
                <TableCell className="text-center text-sm">{transaction.userName}</TableCell>
                <TableCell className="text-center text-sm">{transaction.providerName}</TableCell>
                <TableCell className="text-center text-sm font-medium">{transaction.amount}</TableCell>
                <TableCell className="text-center text-sm">{transaction.date}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(transaction)} className="h-8 w-8 text-[#1C5941] hover:bg-emerald-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteDialog({ open: true, id: transaction.id })} className="h-8 w-8 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Transaction Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, transaction: null })}>
        <DialogContent className="sm:max-w-[450px] bg-[#f8faf9] p-0 overflow-hidden border-none rounded-xl">
          <div className="relative p-6">
            {/* Close Button UI like your image */}
            <div 
              className="absolute top-0 right-0  p-2 cursor-pointer rounded-bl-xl"
              onClick={() => setViewDialog({ open: false, transaction: null })}
            >
              {/* <X className="h-5 w-5 text-white" /> */}
            </div>

            <DialogHeader className="mb-6">
              <DialogTitle className="text-center text-xl font-medium text-gray-700">
                Transaction Details
              </DialogTitle>
            </DialogHeader>

            {viewDialog.transaction && (
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden bg-white">
                <DetailRow label="Transaction ID :" value={`#${viewDialog.transaction.id}`} />
                <DetailRow label="Date :" value={viewDialog.transaction.date} />
                <DetailRow label="User name :" value={viewDialog.transaction.userName} />
                <DetailRow label="A/C number :" value={viewDialog.transaction.accountNumber} />
                <DetailRow label="A/C holder name :" value={viewDialog.transaction.accountHolder} />
                <DetailRow label="Transaction amount :" value={viewDialog.transaction.amount} />
                <DetailRow label="Provider name :" value={viewDialog.transaction.providerName} last />
              </div>
            )}

            <div className="flex gap-4 mt-8 px-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1 border-[#1C5941] text-[#1C5941] hover:bg-emerald-50 rounded-full py-6">
                Download
              </Button>
              <Button onClick={handlePrint} className="flex-1 bg-[#1C5941] hover:bg-[#144230] text-white rounded-full py-6">
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog (Keep it same) */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteDialog.id)} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper Component for Modal Rows
function DetailRow({ label, value, last = false }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <span className="text-gray-800 text-sm font-semibold">{value}</span>
    </div>
  );
}
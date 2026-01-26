// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Calendar,
//   Search,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// // Generate fake user data
// const generateUsers = () => {
//   const names = [
//     "Rokey",
//     "Sakib",
//     "Halima",
//     "Sonia",
//     "Nabil",
//     "Tuhin",
//     "Ayman",
//     "Sarah",
//     "David",
//     "John",
//   ];
//   const emails = [
//     "fzaaaa@gmail.com",
//     "dric@gmail.com",
//     "ziar@gmail.com",
//     "xeno@yandex.ru",
//     "zhks@mail.ru",
//     "bertou@yandex.ru",
//     "rrlan@yandex.ru",
//     "hamil@gmail.com",
//     "xterris@gmail.com",
//     "abc@gmail.com",
//   ];

//   return Array.from({ length: 150 }).map((_, i) => ({
//     id: i + 1,
//     userName: names[i % names.length],
//     email: emails[i % emails.length],
//     number: `(+33)${Math.floor(Math.random() * 90 + 10)} ${Math.floor(
//       Math.random() * 90 + 10
//     )} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(
//       Math.random() * 90 + 10
//     )}`,
//     date: `${Math.floor(Math.random() * 28 + 1)} Apr 2024`,
//     address: `South Dakota ${83400 + i}`,
//     joiningDate: `${Math.floor(Math.random() * 28 + 1)} Jun 2025`,
//   }));
// };

// export default function UserList() {
//   const [users] = useState(generateUsers());
//   const [filteredData, setFilteredData] = useState(users);

//   const [searchName, setSearchName] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const itemsPerPage = 8;

//   // Filter search results
//   const handleSearch = () => {
//     const filtered = users.filter((user) => {
//       return (
//         user.userName.toLowerCase().includes(searchName.toLowerCase())

//       );
//     });
//     setFilteredData(filtered);
//     setCurrentPage(1);
//   };

//   // View user details
//   const handleViewDetails = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   // Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentItems = filteredData.slice(startIdx, startIdx + itemsPerPage);

//   // Generate visible page numbers (show current ±1 pages)
//   const getVisiblePages = () => {
//     const pages = [];
//     const start = Math.max(1, currentPage - 1);
//     const end = Math.min(totalPages, currentPage + 1);
//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const visiblePages = getVisiblePages();

//   return (
//     <div className="mt-5">
//       <Card className="shadow-xl">
//         <CardHeader>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle className="text-xl font-semibold text-gray-800">
//               User List
//             </CardTitle>

//             {/* Search Fields */}
//             <div className="flex flex-wrap items-center gap-2">
              
//               <Input
//                 type="text"
//                 placeholder="User Name"
//                 value={searchName}
//                 onChange={(e) => setSearchName(e.target.value)}
//                 className="w-40 border-gray-300"
//               />
//               <Button
//                 className="bg-[#165039]"
//                 size="icon"
//                 onClick={handleSearch}
//               >
//                 <Search className="h-4 w-4 " />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-[#165039] hover:bg-[#165039]">
//                   <TableHead className="text-white font-semibold text-center">
//                     #SI
//                   </TableHead>
//                   <TableHead className="text-white font-semibold text-center">
//                     User Name
//                   </TableHead>
//                   <TableHead className="text-white font-semibold text-center">
//                     Email
//                   </TableHead>
//                   <TableHead className="text-white font-semibold text-center">
//                     Number
//                   </TableHead>
//                   <TableHead className="text-white font-semibold text-center">
//                     Date
//                   </TableHead>
//                   <TableHead className="text-white font-semibold text-center">
//                     Action
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {currentItems.length > 0 ? (
//                   currentItems.map((user, index) => (
//                     <TableRow
//                       key={user.id}
//                       className={index % 2 === 0 ? "" : "bg-white"}
//                     >
//                       <TableCell className="text-center font-medium">
//                         {startIdx + index + 1}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {user.userName}
//                       </TableCell>
//                       <TableCell className="text-center text-gray-600">
//                         {user.email}
//                       </TableCell>
//                       <TableCell className="text-center text-gray-600">
//                         {user.number}
//                       </TableCell>
//                       <TableCell className="text-center">{user.date}</TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex justify-center gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-[#165039] hover:text-[#165039] hover:bg-blue-50"
//                             onClick={() => handleViewDetails(user)}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan="6"
//                       className="text-center py-8 text-gray-500"
//                     >
//                       No users found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* User Details Modal */}
//           <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
//             <DialogContent className="sm:max-w-lg bg-[#f5f5f0] border-4">
//               <DialogHeader className="relative pb-4">
//                 <DialogTitle className="text-center text-lg font-semibold text-gray-800">
//                   User Details
//                 </DialogTitle>
//               </DialogHeader>

//               {selectedUser && (
//                 <div className="space-y-0 py-4">
//                   <div className="flex justify-between items-center py-4 border-b-2">
//                     <p className="text-sm font-medium text-gray-700">
//                       User name :
//                     </p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {selectedUser.userName}
//                     </p>
//                   </div>

//                   <div className="flex justify-between items-center py-4 border-b-2">
//                     <p className="text-sm font-medium text-gray-700">Email :</p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div className="flex justify-between items-center py-4 border-b-2">
//                     <p className="text-sm font-medium text-gray-700">
//                       Phone Number
//                     </p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {selectedUser.number}
//                     </p>
//                   </div>

//                   <div className="flex justify-between items-center py-4 border-b-2">
//                     <p className="text-sm font-medium text-gray-700">Address</p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {selectedUser.address}
//                     </p>
//                   </div>

//                   <div className="flex justify-between items-center py-4">
//                     <p className="text-sm font-medium text-gray-700">
//                       Joining Date
//                     </p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {selectedUser.joiningDate}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </DialogContent>
//           </Dialog>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-4 flex items-center justify-center gap-1">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4 mr-1" />
//                 Back
//               </Button>

//               {visiblePages.map((page) => (
//                 <Button
//                   key={page}
//                   variant={currentPage === page ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setCurrentPage(page)}
//                   className={
//                     currentPage === page
//                       ? "bg-[#1C5941] hover:bg-[#1C5941]"
//                       : "hover:bg-gray-100"
//                   }
//                 >
//                   {page}
//                 </Button>
//               ))}

//               <Button
//                 variant="default"
//                 size="sm"
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="bg-[#1C5941] hover:bg-[#1C5941]"
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4 ml-1" />
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
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
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const generateUsers = () => {
  const names = ["Rokey", "Sakib", "Halima", "Sonia", "Nabil", "Tuhin", "Ayman", "Sarah", "David", "John"];
  const emails = ["abc@gmail.com", "fzaaaa@gmail.com", "dric@gmail.com", "ziar@gmail.com"];

  return Array.from({ length: 150 }).map((_, i) => ({
    id: i + 1,
    userName: names[i % names.length],
    email: emails[i % emails.length],
    number: `+7397386837`,
    date: `16 Apr 2024`,
    address: `South Dakota 83475`,
    bankName: "Asia Bank",
    acNumber: "29 Jun 2025",
    acHolderName: names[i % names.length],
    joiningDate: `29 Jun 2025`,
  }));
};

export default function UserList() {
  const [users] = useState(generateUsers());
  const [filteredData, setFilteredData] = useState(users);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 8;

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.userName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };



  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIdx, startIdx + itemsPerPage);

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="mt-5">
      <Card className="shadow-none border-none bg-[#F9FAFB]">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-800">User List</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="User Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-44"
              />
              <Button className="bg-[#1C5941] rounded-full h-9 w-9 p-0" onClick={handleSearch}>
                <Search className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#1C5941]">
              <TableRow className="hover:bg-[#1C5941]">
                <TableHead className="text-white text-center py-4">#SI</TableHead>
                <TableHead className="text-white text-center">User Name</TableHead>
                <TableHead className="text-white text-center">Email</TableHead>
                <TableHead className="text-white text-center">Number</TableHead>
                <TableHead className="text-white text-center">Date</TableHead>
                <TableHead className="text-white text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {currentItems.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center py-4">{startIdx + index + 1}</TableCell>
                  <TableCell className="text-center">{user.userName}</TableCell>
                  <TableCell className="text-center text-gray-500">{user.email}</TableCell>
                  <TableCell className="text-center text-gray-500">{user.number}</TableCell>
                  <TableCell className="text-center">{user.date}</TableCell>
                  <TableCell className="text-center flex justify-center gap-2">
                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => handleViewDetails(user)} />
                    <Trash2 className="h-5 w-5 text-red-400 cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>


          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-2xl">
              <div className="bg-[#F8FAF9] relative p-6">
                <div 
                  className="absolute top-0 right-0  p-2 cursor-pointer rounded-bl-xl"
                  onClick={() => setIsModalOpen(false)}
                >

                </div>
                
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-center text-gray-700 font-medium">User Details</DialogTitle>
                </DialogHeader>

                {selectedUser && (
                  <div className="space-y-0 border rounded-lg bg-white overflow-hidden text-2xl border-gray-200 py-4">
                    <DetailRow label="User name :" value={selectedUser.userName} />
                    <DetailRow label="Email :" value={selectedUser.email} />
                    <DetailRow label="Phone Number" value={selectedUser.number} />
                    <DetailRow label="Address" value={selectedUser.address} />
                    <DetailRow label="Bank Name" value={selectedUser.bankName} showAvatar />
                    <DetailRow label="A/C number :" value={selectedUser.acNumber} />
                    <DetailRow label="A/C holder name :" value={selectedUser.acHolderName} />
                    <DetailRow label="Joining Date" value={selectedUser.joiningDate} last />
                  </div>
                )}


              </div>
            </DialogContent>
          </Dialog>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-1 pb-4">
             <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
               <ChevronLeft className="h-4 w-4 mr-1" /> Back
             </Button>
             {getVisiblePages().map(page => (
               <Button key={page} size="sm" onClick={() => setCurrentPage(page)} 
                 className={currentPage === page ? "bg-[#1C5941] text-white" : "bg-white text-gray-700 border"}>
                 {page}
               </Button>
             ))}
             <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>
               Next <ChevronRight className="h-4 w-4 ml-1" />
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 🔹 Modal Row Component
function DetailRow({ label, value, last, showAvatar }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <span className="text-gray-500 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {showAvatar && (
          <img src="https://github.com/shadcn.png" alt="bank" className="h-5 w-5 rounded-full object-cover" />
        )}
        <span className="text-xs font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}
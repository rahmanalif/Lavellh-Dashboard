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

// // Generate fake provider data
// const generateProviders = () => {
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
//     providerName: names[i % names.length],
//     email: emails[i % emails.length],
//     number: `(+33)${Math.floor(Math.random() * 90 + 10)} ${Math.floor(
//       Math.random() * 90 + 10
//     )} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(
//       Math.random() * 90 + 10
//     )}`,
//     date: `16 Apr 2024`,
//     address: `South Dakota ${83400 + i}`,
//     joiningDate: `29 Jun 2025`,
//     nid: `ID${1000000 + i}`,
//   }));
// };

// export default function ProviderList() {
//   const [providers] = useState(generateProviders());
//   const [filteredData, setFilteredData] = useState(providers);
//   const [searchName, setSearchName] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const itemsPerPage = 9;

//   // Filter search results
//   const handleSearch = () => {
//     const filtered = providers.filter((provider) => {
//       return (
//         provider.providerName
//           .toLowerCase()
//           .includes(searchName.toLowerCase()) 

//       );
//     });
//     setFilteredData(filtered);
//     setCurrentPage(1);
//   };

//   // View provider details
//   const handleViewDetails = (provider) => {
//     setSelectedProvider(provider);
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedProvider(null);
//   };

//   // Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentItems = filteredData.slice(startIdx, startIdx + itemsPerPage);

//   // Generate visible page numbers
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
//       <Card className="">
//         <CardHeader className="bg-white ">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle className="text-xl font-semibold text-gray-800">
//               Provider List
//             </CardTitle>

//             {/* Search Fields */}
//             <div className="flex flex-wrap items-center gap-2">
              
//               <Input
//                 type="text"
//                 placeholder="Provider Name"
//                 value={searchName}
//                 onChange={(e) => setSearchName(e.target.value)}
//                 className="w-40 border-gray-300"
//               />
//               <Button
//                 size="icon"
//                 onClick={handleSearch}
//                 className="bg-[#165039] hover:bg-[#1C5941] rounded-full"
//               >
//                 <Search className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-[#1C5941] hover:bg-[#1C5941]">
//                   <TableHead className="text-white font-semibold text-center">
//                     #SI
//                   </TableHead>
//                   <TableHead className="text-white font-semibold text-center">
//                     Provider Name
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
//                   currentItems.map((provider, index) => (
//                     <TableRow
//                       key={provider.id}
//                       className="bg-white hover:bg-gray-50 transition-colors"
//                     >
//                       <TableCell className="text-center font-medium">
//                         {startIdx + index + 1}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {provider.providerName}
//                       </TableCell>
//                       <TableCell className="text-center text-gray-600">
//                         {provider.email}
//                       </TableCell>
//                       <TableCell className="text-center text-gray-600">
//                         {provider.number}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {provider.date}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex justify-center gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-[#1C5941] hover:text-[#1C5941] hover:bg-blue-50"
//                             onClick={() => handleViewDetails(provider)}
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
//                       No providers found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Provider Details Modal */}
//           <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
//             <DialogContent className="sm:max-w-lg bg-[#f5f5f0]  ">
//               <DialogHeader className="relative pb-4 border-b-2 border-gray-300">
//                 <DialogTitle className="text-center text-lg font-semibold text-gray-800">
//                   Provider Details
//                 </DialogTitle>
//               </DialogHeader>

//               {selectedProvider && (
//                 <div className="space-y-0 py-4">
//                   {[
//                     ["Provider name :", selectedProvider.providerName],
//                     ["Email :", selectedProvider.email],
//                     ["Phone Number :", selectedProvider.number],
//                     ["Address :", selectedProvider.address],
//                     ["Joining Date :", selectedProvider.joiningDate],
//                   ].map(([label, value], i) => (
//                     <div
//                       key={i}
//                       className="flex justify-between items-center py-4 border-b-2 border-gray-300"
//                     >
//                       <p className="text-sm font-medium text-gray-700">
//                         {label}
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {value}
//                       </p>
//                     </div>
//                   ))}

//                   {/* NID Section */}
//                   <div className="pt-6">
//                     <p className="text-sm font-medium text-gray-700 mb-4">
//                       NID
//                     </p>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex flex-col items-center">
//                         <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-2 border-gray-300 flex items-center justify-center mb-2">
//                           <div className="text-center">
//                             <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
//                             <div className="text-xs text-gray-600">
//                               ID Photo
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-xs text-gray-600">ID Card Front</p>
//                       </div>

//                       <div className="flex flex-col items-center">
//                         <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-gray-300 flex items-center justify-center mb-2">
//                           <div className="text-center p-2">
//                             <div className="text-xs text-gray-700 font-mono">
//                               {selectedProvider.nid}
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-xs text-gray-600">ID Card Back</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </DialogContent>
//           </Dialog>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="py-4 px-4">
//               <div className="flex items-center justify-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(1, prev - 1))
//                   }
//                   disabled={currentPage === 1}
//                   className="border-[#1C5941] text-[#1C5941] hover:bg-teal-50"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-1" />
//                   Back
//                 </Button>

//                 {currentPage > 2 && (
//                   <>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPage(1)}
//                       className=" "
//                     >
//                       1
//                     </Button>
//                     {currentPage > 3 && (
//                       <span className="px-2 text-gray-500">...</span>
//                     )}
//                   </>
//                 )}

//                 {visiblePages.map((page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setCurrentPage(page)}
//                     className={
//                       currentPage === page
//                         ? "bg-[#1C5941] hover:bg-[#1C5941] text-white"
//                         : "border-[#1C5941] hover:bg-teal-50"
//                     }
//                   >
//                     {page}
//                   </Button>
//                 ))}

//                 {currentPage < totalPages - 1 && (
//                   <>
//                     {currentPage < totalPages - 2 && (
//                       <span className="px-2 text-gray-500">...</span>
//                     )}
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPage(totalPages)}
//                       className="border-[#1C5941] hover:bg-[#1C5941]"
//                     >
//                       {totalPages}
//                     </Button>
//                   </>
//                 )}

//                 <Button
//                   variant="default"
//                   size="sm"
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="bg-[#1C5941] hover:bg-[#1C5941]"
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </div>
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

// Generate fake provider data including new fields from image_8f1507.png
const generateProviders = () => {
  const names = ["Rokey", "Sakib", "Halima", "Sonia", "Nabil", "Tuhin", "Ayman", "Sarah", "David", "John"];
  const emails = ["abc@gmail.com", "fzaaaa@gmail.com", "dric@gmail.com", "ziar@gmail.com"];

  return Array.from({ length: 150 }).map((_, i) => ({
    id: i + 1,
    providerName: names[i % names.length],
    email: emails[i % emails.length],
    number: `+7397386837`,
    date: `16 Apr 2024`,
    address: `South Dakota 83475`,
    birthday: "10/3/2026",
    occupation: "Bom",
    referenceId: "Bom",
    bankName: "Asia Bank",
    acNumber: "29 Jun 2025",
    acHolderName: names[i % names.length],
    joiningDate: `29 Jun 2025`,
  }));
};

export default function ProviderList() {
  const [providers] = useState(generateProviders());
  const [filteredData, setFilteredData] = useState(providers);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 9;

  const handleSearch = () => {
    const filtered = providers.filter((provider) =>
      provider.providerName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
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
      <Card className="shadow-none border-none">
        <CardHeader className="bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-800">Provider List</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Provider Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-44 border-gray-300"
              />
              <Button className="bg-[#1C5941] rounded-full h-9 w-9 p-0" onClick={handleSearch}>
                <Search className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1C5941]">
                <TableRow className="hover:bg-[#1C5941]">
                  <TableHead className="text-white text-center py-4">#SI</TableHead>
                  <TableHead className="text-white text-center">Provider Name</TableHead>
                  <TableHead className="text-white text-center">Email</TableHead>
                  <TableHead className="text-white text-center">Number</TableHead>
                  <TableHead className="text-white text-center">Date</TableHead>
                  <TableHead className="text-white text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((provider, index) => (
                  <TableRow key={provider.id} className="bg-white hover:bg-gray-50">
                    <TableCell className="text-center py-4">{startIdx + index + 1}</TableCell>
                    <TableCell className="text-center">{provider.providerName}</TableCell>
                    <TableCell className="text-center text-gray-500">{provider.email}</TableCell>
                    <TableCell className="text-center text-gray-500">{provider.number}</TableCell>
                    <TableCell className="text-center">{provider.date}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Eye className="h-5 w-5 text-[#1C5941] cursor-pointer" onClick={() => handleViewDetails(provider)} />
                        <Trash2 className="h-5 w-5 text-red-500 cursor-pointer" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Provider Details Modal - Updated based on image_8f1507.png */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-2xl bg-[#F8FAF9]">
              <div className="relative p-6">
                {/* Close Button Style from Image */}

                
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-center text-gray-700 font-medium">Provider Details</DialogTitle>
                </DialogHeader>

                {selectedProvider && (
                  <div className="space-y-0 border rounded-lg bg-white overflow-hidden border-gray-200">
                    <DetailRow label="User name :" value={selectedProvider.providerName} />
                    <DetailRow label="Birthday :" value={selectedProvider.birthday} />
                    <DetailRow label="Email :" value={selectedProvider.email} />
                    <DetailRow label="Phone Number :" value={selectedProvider.number} />
                    <DetailRow label="Address :" value={selectedProvider.address} />
                    <DetailRow label="occupation :" value={selectedProvider.occupation} />
                    <DetailRow label="Reference Id :" value={selectedProvider.referenceId} showAvatar />
                    <DetailRow label="Bank Name :" value={selectedProvider.bankName} />
                    <DetailRow label="A/C number :" value={selectedProvider.acNumber} />
                    <DetailRow label="A/C holder name :" value={selectedProvider.acHolderName} />
                    <DetailRow label="Joining Date :" value={selectedProvider.joiningDate} last />
                    
                    {/* NID Section at Bottom */}
                    <div className="p-4 bg-white">
                       <p className="text-gray-500 text-xs font-medium mb-3">NID</p>
                       <div className="flex gap-2">
                          <div className="flex-1">
                             <div className="bg-gray-100 rounded h-20 flex items-center justify-center overflow-hidden">
                                <img src="https://via.placeholder.com/150x100?text=ID+Front" alt="NID Front" className="w-full h-full object-cover" />
                             </div>
                             <p className="text-[10px] text-center text-gray-400 mt-1">ID Card Front</p>
                          </div>
                          <div className="flex-1">
                             <div className="bg-gray-100 rounded h-20 flex items-center justify-center overflow-hidden">
                                <img src="https://via.placeholder.com/150x100?text=ID+Back" alt="NID Back" className="w-full h-full object-cover" />
                             </div>
                             <p className="text-[10px] text-center text-gray-400 mt-1">ID Card Back</p>
                          </div>
                       </div>
                    </div>
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

// 🔹 Modal Row Component for consistent styling
function DetailRow({ label, value, last, showAvatar }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <span className="text-gray-500 text-[11px] font-medium uppercase tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        {showAvatar && (
          <img src="https://github.com/shadcn.png" alt="ref" className="h-4 w-4 rounded-full" />
        )}
        <span className="text-[11px] font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}
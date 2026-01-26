// import React, { useState } from 'react';
// import { Eye, Trash2, Search, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';

// const BizOwnerList = () => {
//   // --- States ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeModal, setActiveModal] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // --- Dummy Data (50 items) ---
//   const itemsPerPage = 8;
//   const allOwners = Array.from({ length: 50 }, (_, i) => ({
//     id: i + 1,
//     name: i % 2 === 0 ? 'Rokey' : 'Hassan',
//     email: `abc${i}@gmail.com`,
//     number: `+739738${6837 + i}`,
//     birthday: '10/3/2026',
//     address: 'South Dakota 83475',
//     occupation: 'Born',
//     bank: 'Asia Bank',
//     accNo: '29 Jun 2025',
//     joiningDate: '29 Jun 2025',
//     businessName: 'Kom',
//     category: 'Tang tang',
//     employees: 20
//   }));

//   const employees = Array.from({ length: 10 }, (_, i) => ({
//     id: i + 1, name: 'Rokey', email: `fzaaaa${i}@gmail.com`, number: '(+33)6 55 53 38 10', date: '16 Apr 2024'
//   }));

//   // --- Pagination Logic ---
//   const totalPages = Math.ceil(allOwners.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOwners = allOwners.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const closeAllModals = () => {
//     setActiveModal(null);
//     setSelectedItem(null);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-[#1a4d3c]">Biz Owner List</h2>
//         <div className="relative flex items-center">
//           <input type="text" placeholder="User Name" className="border rounded-full py-2 px-5 w-64 focus:outline-none" />
//           <div className="absolute right-1 bg-[#1a4d3c] p-2 rounded-full text-white"><Search size={18} /></div>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
//         <table className="w-full text-left">
//           <thead className="bg-[#1a4d3c] text-white">
//             <tr>
//               <th className="p-4">ID</th>
//               <th className="p-4">Biz Owner Name</th>
//               <th className="p-4">Email</th>
//               <th className="p-4">Number</th>
//               <th className="p-4">Date</th>
//               <th className="p-4 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {currentOwners.map((owner) => (
//               <tr key={owner.id} className="hover:bg-gray-50">
//                 <td className="p-4">{owner.id}</td>
//                 <td className="p-4">{owner.name}</td>
//                 <td className="p-4">{owner.email}</td>
//                 <td className="p-4">{owner.number}</td>
//                 <td className="p-4">16 Apr 2024</td>
//                 <td className="p-4 flex justify-center gap-3">
//                   <button onClick={() => { setSelectedItem(owner); setActiveModal('owner'); }} className="text-gray-400 hover:text-emerald-600">
//                     <Eye size={20} />
//                   </button>
//                   <button className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* --- Dynamic Pagination Section --- */}
//       <div className="mt-8 flex justify-center items-center gap-2">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`flex items-center px-4 py-2 border rounded-lg bg-white ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <ChevronLeft size={18} /> Back
//         </button>

//         {[...Array(totalPages)].map((_, i) => {
//           const pageNum = i + 1;
//           if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => handlePageChange(pageNum)}
//                 className={`w-10 h-10 rounded-lg border font-medium ${currentPage === pageNum ? 'bg-[#1a4d3c] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
//               >
//                 {pageNum}
//               </button>
//             );
//           } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
//             return <span key={pageNum} className="px-2">...</span>;
//           }
//           return null;
//         })}

//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="flex items-center px-4 py-2 bg-[#1a4d3c] text-white rounded-lg hover:bg-emerald-900 transition-colors"
//         >
//           Next <ChevronRight size={18} />
//         </button>

//         <div className="ml-4 flex items-center gap-2">
//             <span className="text-gray-500 text-sm">Page</span>
//             <input
//               type="text"
//               readOnly
//               value={currentPage}
//               className="w-10 border rounded text-center py-1 text-sm bg-white"
//             />
//             <span className="text-gray-500 text-sm">Go</span>
//         </div>
//       </div>

//       {/* 1st Modal: Biz Owner Details */}
//       {activeModal === 'owner' && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
//           <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl">
//             <div className="bg-[#1a4d3c] p-3 flex justify-between items-center text-white">
//               <span className="flex-1 text-center font-semibold text-lg">Biz Owner Details</span>
//               <button onClick={closeAllModals} className="bg-red-600 p-1 rounded hover:bg-red-700 transition-colors"><X size={18} /></button>
//             </div>
//             <div className="p-4 max-h-[70vh] overflow-y-auto text-sm space-y-1">
//               <DetailRow label="User name" value={selectedItem?.name} />
//               <DetailRow label="Birthday" value={selectedItem?.birthday} />
//               <DetailRow label="Email" value={selectedItem?.email} />
//               <DetailRow label="Phone Number" value={selectedItem?.number} />
//               <DetailRow label="Address" value={selectedItem?.address} />
//               <DetailRow label="Occupation" value={selectedItem?.occupation} />
//               <DetailRow label="Bank Name" value={selectedItem?.bank} />
//               <DetailRow label="A/C number" value={selectedItem?.accNo} />
//               <DetailRow label="Joining Date" value={selectedItem?.joiningDate} />
//               <DetailRow label="Total Employee" value={selectedItem?.employees} />

//               <button
//                 onClick={() => setActiveModal('employeeList')}
//                 className="mt-6 w-full border border-emerald-600 text-emerald-700 py-2.5 rounded-lg hover:bg-emerald-50 font-bold"
//               >
//                 View All Employee
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 2nd Modal: Employee List */}
//       {activeModal === 'employeeList' && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl">
//             <div className="p-4 flex justify-between items-center border-b">
//               <div className="flex items-center gap-2">
//                 <button onClick={() => setActiveModal('owner')} className="text-gray-600 hover:text-[#1a4d3c]"><ArrowLeft size={24}/></button>
//                 <h3 className="text-xl font-bold text-gray-800">Employee List</h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <input type="text" placeholder="User Name" className="border rounded-full px-4 py-1 text-sm focus:outline-emerald-500" />
//                 <button className="bg-[#1a4d3c] p-2 rounded-full text-white"><Search size={16}/></button>
//               </div>
//             </div>
//             <div className="p-4 overflow-x-auto">
//               <table className="w-full text-left text-sm border">
//                 <thead className="bg-[#1a4d3c] text-white">
//                   <tr>
//                     <th className="p-3">ID</th>
//                     <th className="p-3">User Name</th>
//                     <th className="p-3">Email</th>
//                     <th className="p-3">Number</th>
//                     <th className="p-3">Date</th>
//                     <th className="p-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {employees.map(emp => (
//                     <tr key={emp.id} className="hover:bg-gray-50">
//                       <td className="p-3">{emp.id}</td>
//                       <td className="p-3">{emp.name}</td>
//                       <td className="p-3">{emp.email}</td>
//                       <td className="p-3">{emp.number}</td>
//                       <td className="p-3">{emp.date}</td>
//                       <td className="p-3">
//                         <button onClick={() => { setSelectedItem(emp); setActiveModal('employeeDetail'); }} className="text-gray-400 hover:text-emerald-600">
//                           <Eye size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3rd Modal: Employee Details */}
//       {activeModal === 'employeeDetail' && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4">
//           <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
//             <div className="p-3 bg-gray-50 flex justify-between items-center border-b">
//               <span className="flex-1 text-center font-bold text-gray-700">Employee Details</span>
//               <button onClick={() => setActiveModal('employeeList')} className="bg-red-600 text-white p-1 rounded hover:bg-red-700"><X size={16} /></button>
//             </div>
//             <div className="p-6 space-y-4">
//               <DetailRow label="User name" value={selectedItem?.name} />
//               <DetailRow label="Email" value={selectedItem?.email} />
//               <DetailRow label="Phone Number" value={selectedItem?.number} />
//               <DetailRow label="Address" value="South Dakota 83475" />
//               <DetailRow label="Joining Date" value="29 Jun 2025" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const DetailRow = ({ label, value }) => (
//   <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0 items-center">
//     <span className="text-gray-500 font-medium">{label} :</span>
//     <span className="text-gray-800 font-semibold">{value}</span>
//   </div>
// );

// export default BizOwnerList;

import React, { useState } from "react";
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Camera,
} from "lucide-react";

const BizOwnerList = () => {
  // --- States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Dummy Data ---
  const itemsPerPage = 8;
  const allOwners = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: "Rokey",
    email: `abc${i}@gmail.com`,
    number: `+739738${6837 + i}`,
    birthday: "10/3/2026",
    address: "South Dakota 83475",
    occupation: "Born",
    referenceId: "Born",
    bank: "Asia Bank",
    accNo: "29 Jun 2025",
    accHolder: "Rokey",
    joiningDate: "29 Jun 2025",
    businessName: "Kom",
    category: "Teng teng",
    employees: 20,
  }));

  const employees = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: "Rokey",
    email: `fzaaaa${i}@gmail.com`,
    number: "(+33)6 55 53 38 10",
    date: "16 Apr 2024",
  }));

  // --- Pagination Logic ---
  const totalPages = Math.ceil(allOwners.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOwners = allOwners.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a4d3c]">Biz Owner List</h2>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="User Name"
            className="border rounded-full py-2 px-5 w-64 focus:outline-none shadow-sm"
          />
          <div className="absolute right-1 bg-[#1a4d3c] p-2 rounded-full text-white cursor-pointer hover:bg-emerald-900 transition-colors">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-[#1a4d3c] text-white">
            <tr>
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Biz Owner Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Number</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentOwners.map((owner) => (
              <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-700">{owner.id}</td>
                <td className="p-4 text-gray-700">{owner.name}</td>
                <td className="p-4 text-gray-600">{owner.email}</td>
                <td className="p-4 text-gray-600">{owner.number}</td>
                <td className="p-4 text-gray-600">16 Apr 2024</td>
                <td className="p-4 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedItem(owner);
                      setActiveModal("owner");
                    }}
                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <Eye size={22} />
                  </button>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 border rounded-lg bg-white ${
            currentPage === 1
              ? "text-gray-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={18} /> Back
        </button>
        {[...Array(totalPages)].map((_, i) =>
          i + 1 === 1 ||
          i + 1 === totalPages ||
          (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1) ? (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-lg border font-medium ${
                currentPage === i + 1
                  ? "bg-[#1a4d3c] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ) : i + 1 === currentPage - 2 || i + 1 === currentPage + 2 ? (
            <span key={i} className="px-1 text-gray-400">
              ...
            </span>
          ) : null
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-[#1a4d3c] text-white rounded-lg hover:bg-emerald-900 transition-colors"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* 1st Modal: Biz Owner Details (Comprehensive Version) */}
      {activeModal === "owner" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1a4d3c] p-3 flex justify-between items-center text-white">
              <span className="flex-1 text-center font-bold">
                Biz Owner Details
              </span>
              <button
                onClick={closeAllModals}
                className="bg-[#c0392b] p-1 rounded hover:bg-red-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-0.5 border rounded-lg overflow-hidden">
                <DetailRow label="User name" value={selectedItem?.name} />
                <DetailRow label="Birthday" value={selectedItem?.birthday} />
                <DetailRow label="Email" value={selectedItem?.email} />
                <DetailRow label="Phone Number" value={selectedItem?.number} />
                <DetailRow label="Address" value={selectedItem?.address} />
                <DetailRow
                  label="Occupation"
                  value={selectedItem?.occupation}
                />
                <DetailRow
                  label="Reference Id"
                  value={selectedItem?.referenceId}
                />
                <DetailRow label="Bank Name" value={selectedItem?.bank} />
                <DetailRow label="A/C number" value={selectedItem?.accNo} />
                <DetailRow
                  label="A/C holder name"
                  value={selectedItem?.accHolder}
                />
                <DetailRow
                  label="Joining Date"
                  value={selectedItem?.joiningDate}
                />
                <DetailRow
                  label="Business name"
                  value={selectedItem?.businessName}
                />
                <DetailRow
                  label="Business category"
                  value={selectedItem?.category}
                />
                <DetailRow
                  label="Total Employee"
                  value={selectedItem?.employees}
                />
              </div>

              <button
                onClick={() => setActiveModal("employeeList")}
                className="mt-5 w-full border-2 border-[#1a4d3c] text-[#1a4d3c] py-2.5 rounded-full hover:bg-emerald-50 font-bold transition-all text-sm"
              >
                View All Employee
              </button>

              {/* Business Photo Section */}
              <div className="mt-6">
                <p className="text-gray-700 font-bold mb-3 text-sm">
                  Business photo
                </p>
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[#1a4d3c]">
                    <div className="bg-emerald-100 p-2 rounded-full mb-2">
                      <Camera size={24} />
                    </div>
                    <p className="text-xs font-semibold">Upload</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>

              {/* NID Section */}
              <div className="mt-6">
                <p className="text-gray-700 font-bold mb-3 text-sm">NID</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden border border-gray-100">
                      <img
                        src="https://via.placeholder.com/150x100?text=ID+Front"
                        alt="NID Front"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      ID Card Front
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden border border-gray-100">
                      <img
                        src="https://via.placeholder.com/150x100?text=ID+Back"
                        alt="NID Back"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      ID Card Back
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2nd Modal: Employee List (Nested) */}
      {activeModal === "employeeList" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="p-5 flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModal("owner")}
                  className="text-gray-500 hover:text-emerald-700 transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h3 className="text-xl font-bold text-gray-800">
                  Employee List
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="User Name"
                    className="border rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-48"
                  />
                  <div className="absolute right-0 top-0 bg-[#1a4d3c] p-2 rounded-full text-white cursor-pointer">
                    <Search size={14} />
                  </div>
                </div>
                <button
                  onClick={closeAllModals}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1a4d3c] text-white">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Number</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="p-3">{emp.id}</td>
                        <td className="p-3">{emp.name}</td>
                        <td className="p-3">{emp.email}</td>
                        <td className="p-3">{emp.number}</td>
                        <td className="p-3">{emp.date}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedItem(emp);
                              setActiveModal("employeeDetail");
                            }}
                            className="text-gray-400 hover:text-emerald-600"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3rd Modal: Employee Details */}
      {activeModal === "employeeDetail" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border-2 border-white">
            <div className="p-3 bg-gray-50 flex justify-between items-center border-b">
              <span className="flex-1 text-center font-bold text-[#1a4d3c]">
                Employee Details
              </span>
              <button
                onClick={() => setActiveModal("employeeList")}
                className="bg-[#c0392b] text-white p-1 rounded hover:bg-red-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="User name" value={selectedItem?.name} />
              <DetailRow label="Email" value={selectedItem?.email} />
              <DetailRow label="Phone Number" value={selectedItem?.number} />
              <DetailRow label="Address" value="South Dakota 83475" />
              <DetailRow label="Joining Date" value="29 Jun 2025" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Helper Component for Modal Rows (Stylized like the Image)
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 px-3 border-b border-gray-200 last:border-0 items-center">
    <span className="text-gray-500 font-medium text-[13px]">{label} :</span>
    <span className="text-gray-800 font-semibold text-[13px]">{value}</span>
  </div>
);

export default BizOwnerList;

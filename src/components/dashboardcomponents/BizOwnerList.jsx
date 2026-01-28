"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchBusinessOwners,
  fetchBusinessOwnerById,
  toggleBusinessOwnerStatus,
  deleteBusinessOwner,
  selectBusinessOwners,
  selectBusinessOwnersError,
  selectBusinessOwnersStatus,
  selectBusinessOwnersTotalPages,
  selectSelectedBusinessOwner,
  selectSelectedBusinessOwnerError,
  selectSelectedBusinessOwnerStatus,
  selectToggleBusinessOwnerError,
  selectToggleBusinessOwnerStatus,
  selectDeleteBusinessOwnerError,
  selectDeleteBusinessOwnerStatus,
} from "@/store/businessOwnersSlice";
import { selectAdminPermissions } from "@/store/adminAuthSlice";
import {
  fetchEmployeesByOwner,
  fetchEmployeeById,
  selectEmployees,
  selectEmployeesError,
  selectEmployeesStatus,
  selectEmployeesTotalPages,
  selectSelectedEmployee,
  selectSelectedEmployeeError,
  selectSelectedEmployeeStatus,
} from "@/store/employeesSlice";

const BizOwnerList = () => {
  const dispatch = useDispatch();
  const owners = useSelector(selectBusinessOwners);
  const status = useSelector(selectBusinessOwnersStatus);
  const error = useSelector(selectBusinessOwnersError);
  const totalPages = useSelector(selectBusinessOwnersTotalPages);
  const selectedOwnerData = useSelector(selectSelectedBusinessOwner);
  const selectedOwnerStatus = useSelector(selectSelectedBusinessOwnerStatus);
  const selectedOwnerError = useSelector(selectSelectedBusinessOwnerError);
  const toggleStatus = useSelector(selectToggleBusinessOwnerStatus);
  const toggleError = useSelector(selectToggleBusinessOwnerError);
  const deleteStatus = useSelector(selectDeleteBusinessOwnerStatus);
  const deleteError = useSelector(selectDeleteBusinessOwnerError);
  const permissions = useSelector(selectAdminPermissions);
  const canManageProviders = permissions?.canManageProviders ?? true;
  const employees = useSelector(selectEmployees);
  const employeesStatus = useSelector(selectEmployeesStatus);
  const employeesError = useSelector(selectEmployeesError);
  const employeesTotalPages = useSelector(selectEmployeesTotalPages);
  const selectedEmployee = useSelector(selectSelectedEmployee);
  const selectedEmployeeStatus = useSelector(selectSelectedEmployeeStatus);
  const selectedEmployeeError = useSelector(selectSelectedEmployeeError);

  const [searchName, setSearchName] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeSearchActive, setEmployeeSearchActive] = useState("");

  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(
      fetchBusinessOwners({
        page: currentPage,
        limit: itemsPerPage,
        search: activeSearch,
      })
    );
  }, [activeSearch, currentPage, dispatch]);

  const currentOwners = useMemo(() => owners, [owners]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearch(searchName.trim());
  };

  const handleViewDetails = (owner) => {
    const id = owner._id || owner.id;
    if (id) {
      dispatch(fetchBusinessOwnerById(id));
    }
    setSelectedItem(owner);
    setActiveModal("owner");
  };

  const handleToggleStatus = async () => {
    const id = selectedOwnerData?._id || selectedItem?._id || selectedItem?.id;
    if (!id) return;
    try {
      await dispatch(toggleBusinessOwnerStatus(id)).unwrap();
    } catch {
      // handled by slice error
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await dispatch(deleteBusinessOwner(deleteDialog.id)).unwrap();
      setDeleteDialog({ open: false, id: null });
      if (
        selectedItem &&
        (selectedItem._id || selectedItem.id) === deleteDialog.id
      ) {
        closeAllModals();
      }
    } catch {
      // handled by slice error
    }
  };

  const openEmployees = () => {
    const ownerId = selectedItem?._id || selectedItem?.id;
    if (!ownerId) return;
    dispatch(
      fetchEmployeesByOwner({
        ownerId,
        page: employeePage,
        limit: 8,
        search: employeeSearchActive,
      })
    );
    setActiveModal("employees");
  };

  const openEmployeeDetails = (employee) => {
    const id = employee._id || employee.id;
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
    setActiveModal("employeeDetail");
  };

  useEffect(() => {
    if (activeModal !== "employees") return;
    const ownerId = selectedItem?._id || selectedItem?.id;
    if (!ownerId) return;
    dispatch(
      fetchEmployeesByOwner({
        ownerId,
        page: employeePage,
        limit: 8,
        search: employeeSearchActive,
      })
    );
  }, [activeModal, dispatch, employeePage, employeeSearchActive, selectedItem]);

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a4d3c]">Biz Owner List</h2>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="User Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border rounded-full py-2 px-5 w-64 focus:outline-none shadow-sm"
          />
          <button
            className="absolute right-1 bg-[#1a4d3c] p-2 rounded-full text-white cursor-pointer hover:bg-emerald-900 transition-colors"
            onClick={handleSearch}
          >
            <Search size={18} />
          </button>
        </div>
      </div>

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
            {status === "loading" && currentOwners.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  Loading business owners...
                </td>
              </tr>
            ) : currentOwners.length > 0 ? (
              currentOwners.map((owner, index) => {
                const user = owner.userId || owner.user || {};
                return (
                  <tr
                    key={owner._id || owner.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-700">
                      {owner._id || owner.id || "—"}
                    </td>
                    <td className="p-4 text-gray-700">
                      {user.fullName || owner.fullName || "—"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {user.email || owner.email || "—"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {user.phoneNumber || owner.phoneNumber || "—"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : owner.createdAt
                        ? new Date(owner.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleViewDetails(owner)}
                        className="text-gray-400 hover:text-emerald-600 transition-colors"
                      >
                        <Eye size={22} />
                      </button>
                      {canManageProviders && (
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: owner._id || owner.id,
                            })
                          }
                        >
                          <Trash2 size={22} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  {error || "No business owners found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

            <div className="p-4 max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="space-y-0.5 border rounded-lg overflow-hidden">
                {selectedOwnerStatus === "loading" && (
                  <DetailRow label="Loading" value="Please wait..." />
                )}
                {selectedOwnerError && (
                  <DetailRow label="Error" value={selectedOwnerError} />
                )}
                {toggleError && (
                  <DetailRow label="Status error" value={toggleError} />
                )}
                {deleteError && (
                  <DetailRow label="Delete error" value={deleteError} />
                )}
                {selectedOwnerData && selectedOwnerStatus === "succeeded" && (
                  <>
                    <DetailRow
                      label="User name"
                      value={
                        selectedOwnerData.userId?.fullName ||
                        selectedOwnerData.fullName ||
                        "—"
                      }
                    />
                    <DetailRow
                      label="User ID"
                      value={selectedOwnerData.userId?._id || "—"}
                    />
                    <DetailRow
                      label="Email"
                      value={
                        selectedOwnerData.userId?.email ||
                        selectedOwnerData.email ||
                        "—"
                      }
                    />
                    <DetailRow
                      label="Phone Number"
                      value={
                        selectedOwnerData.userId?.phoneNumber ||
                        selectedOwnerData.phoneNumber ||
                        "—"
                      }
                    />
                    <DetailRow
                      label="Address"
                      value={
                        selectedOwnerData.businessAddress?.fullAddress ||
                        selectedOwnerData.userId?.location?.address ||
                        "—"
                      }
                    />
                    <DetailRow
                      label="Date of Birth"
                      value={
                        selectedOwnerData.dateOfBirth
                          ? new Date(
                              selectedOwnerData.dateOfBirth
                            ).toLocaleDateString()
                          : "—"
                      }
                    />
                    <DetailRow
                      label="Business name"
                      value={selectedOwnerData.businessName || "—"}
                    />
                    <DetailRow
                      label="Business category"
                      value={
                        selectedOwnerData.businessCategory?.name ||
                        selectedOwnerData.category ||
                        "—"
                      }
                    />
                    <DetailRow
                      label="Business photo"
                      value={
                        selectedOwnerData.businessPhoto ? (
                          <img
                            src={selectedOwnerData.businessPhoto}
                            alt="Business"
                            className="h-16 w-24 rounded object-cover border"
                          />
                        ) : (
                          "—"
                        )
                      }
                      isElement
                    />
                    <DetailRow
                      label="Occupation"
                      value={selectedOwnerData.occupation || "—"}
                    />
                    <DetailRow
                      label="Reference Id"
                      value={selectedOwnerData.referenceId || "—"}
                    />
                    <DetailRow
                      label="Active"
                      value={
                        typeof selectedOwnerData.userId?.isActive === "boolean"
                          ? selectedOwnerData.userId.isActive
                            ? "Yes"
                            : "No"
                          : "—"
                      }
                    />
                    <DetailRow
                      label="Pending Verification"
                      value={
                        typeof selectedOwnerData.userId?.isPendingVerification ===
                        "boolean"
                          ? selectedOwnerData.userId.isPendingVerification
                            ? "Yes"
                            : "No"
                          : "—"
                      }
                    />
                    <DetailRow
                      label="Total Employee"
                      value={selectedOwnerData.employees || "—"}
                    />
                    <DetailRow
                      label="Created At"
                      value={
                        selectedOwnerData.createdAt
                          ? new Date(
                              selectedOwnerData.createdAt
                            ).toLocaleString()
                          : "—"
                      }
                    />
                    <div className="p-4 bg-white">
                      <p className="text-gray-500 text-xs font-medium mb-3">
                        ID Card
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded h-20 flex items-center justify-center overflow-hidden">
                            {selectedOwnerData.idCard?.frontImage ? (
                              <img
                                src={selectedOwnerData.idCard.frontImage}
                                alt="ID Front"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </div>
                          <p className="text-[10px] text-center text-gray-400 mt-1">
                            ID Card Front
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded h-20 flex items-center justify-center overflow-hidden">
                            {selectedOwnerData.idCard?.backImage ? (
                              <img
                                src={selectedOwnerData.idCard.backImage}
                                alt="ID Back"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </div>
                          <p className="text-[10px] text-center text-gray-400 mt-1">
                            ID Card Back
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border-t border-gray-100">
                      <button
                        onClick={openEmployees}
                        className="w-full border-2 border-[#1a4d3c] text-[#1a4d3c] py-2.5 rounded-full hover:bg-emerald-50 font-bold transition-all text-sm"
                      >
                        View All Employee
                      </button>
                    </div>
                    {canManageProviders && (
                      <>
                        <div className="p-4 bg-white border-t border-gray-100">
                          <button
                            onClick={handleToggleStatus}
                            disabled={toggleStatus === "loading"}
                            className="w-full border-2 border-[#1a4d3c] text-[#1a4d3c] py-2.5 rounded-full hover:bg-emerald-50 font-bold transition-all text-sm disabled:opacity-60"
                          >
                            {toggleStatus === "loading"
                              ? "Updating..."
                              : selectedOwnerData.userId?.isActive
                              ? "Block Business Owner"
                              : "Unblock Business Owner"}
                          </button>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100">
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                id: selectedOwnerData._id || selectedOwnerData.id,
                              })
                            }
                            disabled={deleteStatus === "loading"}
                            className="w-full border-2 border-red-500 text-red-600 py-2.5 rounded-full hover:bg-red-50 font-bold transition-all text-sm disabled:opacity-60"
                          >
                            {deleteStatus === "loading"
                              ? "Deleting..."
                              : "Delete Business Owner"}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "employees" && (
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
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    className="border rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-48"
                  />
                  <button
                    className="absolute right-0 top-0 bg-[#1a4d3c] p-2 rounded-full text-white cursor-pointer"
                    onClick={() => {
                      setEmployeePage(1);
                      setEmployeeSearchActive(employeeSearch.trim());
                    }}
                  >
                    <Search size={14} />
                  </button>
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
                      <th className="p-3">Service Count</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employeesStatus === "loading" && employees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-6 text-center text-gray-500"
                        >
                          Loading employees...
                        </td>
                      </tr>
                    ) : employees.length > 0 ? (
                      employees.map((emp) => (
                        <tr key={emp._id || emp.id} className="hover:bg-gray-50">
                          <td className="p-3">{emp._id || emp.id || "—"}</td>
                          <td className="p-3">
                            {emp.fullName || emp.userId?.fullName || "—"}
                          </td>
                          <td className="p-3">
                            {emp.email || emp.userId?.email || "—"}
                          </td>
                          <td className="p-3">
                            {emp.phoneNumber || emp.userId?.phoneNumber || "—"}
                          </td>
                          <td className="p-3">
                            {emp.serviceCount ?? 0}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => openEmployeeDetails(emp)}
                              className="text-gray-400 hover:text-emerald-600"
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-6 text-center text-gray-500"
                        >
                          {employeesError || "No employees found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setEmployeePage((p) => Math.max(1, p - 1))
                  }
                  disabled={employeePage === 1}
                  className={`flex items-center px-4 py-2 border rounded-lg bg-white ${
                    employeePage === 1
                      ? "text-gray-300"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={18} /> Back
                </button>
                {[...Array(employeesTotalPages)].map((_, i) =>
                  i + 1 === 1 ||
                  i + 1 === employeesTotalPages ||
                  (i + 1 >= employeePage - 1 && i + 1 <= employeePage + 1) ? (
                    <button
                      key={i}
                      onClick={() => setEmployeePage(i + 1)}
                      className={`w-10 h-10 rounded-lg border font-medium ${
                        employeePage === i + 1
                          ? "bg-[#1a4d3c] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ) : i + 1 === employeePage - 2 ||
                    i + 1 === employeePage + 2 ? (
                    <span key={i} className="px-1 text-gray-400">
                      ...
                    </span>
                  ) : null
                )}
                <button
                  onClick={() =>
                    setEmployeePage((p) =>
                      Math.min(employeesTotalPages, p + 1)
                    )
                  }
                  disabled={employeePage === employeesTotalPages}
                  className="flex items-center px-4 py-2 bg-[#1a4d3c] text-white rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "employeeDetail" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border-2 border-white">
            <div className="p-3 bg-gray-50 flex justify-between items-center border-b">
              <span className="flex-1 text-center font-bold text-[#1a4d3c]">
                Employee Details
              </span>
              <button
                onClick={() => setActiveModal("employees")}
                className="bg-[#c0392b] text-white p-1 rounded hover:bg-red-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedEmployeeStatus === "loading" && (
                <DetailRow label="Loading" value="Please wait..." />
              )}
              {selectedEmployeeError && (
                <DetailRow label="Error" value={selectedEmployeeError} />
              )}
              {selectedEmployee && selectedEmployeeStatus === "succeeded" && (
                <>
                  <DetailRow
                    label="User name"
                    value={selectedEmployee.fullName || "—"}
                  />
                  <DetailRow label="Email" value={selectedEmployee.email || "—"} />
                  <DetailRow
                    label="Phone Number"
                    value={selectedEmployee.phoneNumber || "—"}
                  />
                  <DetailRow
                    label="Services"
                    value={
                      Array.isArray(selectedEmployee.services)
                        ? selectedEmployee.services.length
                        : "—"
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete business owner?</AlertDialogTitle>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-red-500">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteStatus === "loading"}
            >
              {deleteStatus === "loading" ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DetailRow = ({ label, value, isElement }) => (
  <div className="flex justify-between py-2 px-3 border-b border-gray-200 last:border-0 items-center">
    <span className="text-gray-500 font-medium text-[13px]">{label} :</span>
    {isElement ? (
      value
    ) : (
      <span className="text-gray-800 font-semibold text-[13px]">{value}</span>
    )}
  </div>
);

export default BizOwnerList;

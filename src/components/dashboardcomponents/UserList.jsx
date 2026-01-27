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
import { Search, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchUsers,
  fetchUserById,
  deleteUser,
  selectUsers,
  selectUsersCurrentPage,
  selectUsersError,
  selectUsersStatus,
  selectSelectedUser,
  selectSelectedUserError,
  selectSelectedUserStatus,
  selectDeleteUserError,
  selectDeleteUserStatus,
  selectUsersTotalPages,
} from "@/store/usersSlice";

export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);
  const totalPages = useSelector(selectUsersTotalPages);
  const apiCurrentPage = useSelector(selectUsersCurrentPage);
  const selectedUserData = useSelector(selectSelectedUser);
  const selectedUserStatus = useSelector(selectSelectedUserStatus);
  const selectedUserError = useSelector(selectSelectedUserError);
  const deleteStatus = useSelector(selectDeleteUserStatus);
  const deleteError = useSelector(selectDeleteUserError);

  const [searchName, setSearchName] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 8;

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearch(searchName.trim());
  };

  const handleViewDetails = (user) => {
    const id = user._id || user.id;
    if (id) {
      dispatch(fetchUserById(id));
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const id = user._id || user.id;
    if (!id) return;
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;
    try {
      await dispatch(deleteUser(id)).unwrap();
    } catch {
      // handled by slice error state
    }
  };

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: activeSearch,
      })
    );
  }, [activeSearch, currentPage, dispatch]);

  // Keep pagination controlled by UI to avoid extra state churn.

  const currentItems = useMemo(() => users, [users]);

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
            <CardTitle className="text-2xl font-semibold text-gray-800">
              User List
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="User Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-44"
              />
              <Button
                className="bg-[#1C5941] rounded-full h-9 w-9 p-0"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#1C5941]">
              <TableRow className="hover:bg-[#1C5941]">
                <TableHead className="text-white text-center py-4">
                  #SI
                </TableHead>
                <TableHead className="text-white text-center">User ID</TableHead>
                <TableHead className="text-white text-center">
                  User Name
                </TableHead>
                <TableHead className="text-white text-center">Email</TableHead>
                <TableHead className="text-white text-center">Number</TableHead>
                <TableHead className="text-white text-center">Date</TableHead>
                <TableHead className="text-white text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {status === "loading" && currentItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : currentItems.length > 0 ? (
                currentItems.map((user, index) => (
                  <TableRow key={user._id || user.id}>
                    <TableCell className="text-center py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="text-center text-gray-500">
                      {user._id
                        ? `${user._id.slice(0, 8)}…`
                        : user.id
                        ? String(user.id)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.fullName || user.userName || "—"}
                    </TableCell>
                    <TableCell className="text-center text-gray-500">
                      {user.email || "—"}
                    </TableCell>
                    <TableCell className="text-center text-gray-500">
                      {user.phoneNumber || user.number || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : user.date || "—"}
                    </TableCell>
                    <TableCell className="text-center flex justify-center gap-2">
                      <Eye
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => handleViewDetails(user)}
                      />
                      <Trash2
                        className={`h-5 w-5 text-red-400 cursor-pointer ${
                          deleteStatus === "loading"
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        onClick={() => handleDeleteUser(user)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    {error ? error : "No users found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-2xl">
              <div className="bg-[#F8FAF9] relative p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-center text-gray-700 font-medium">
                    User Details
                  </DialogTitle>
                </DialogHeader>

                {selectedUser && (
                  <div className="space-y-0 border rounded-lg bg-white overflow-hidden text-2xl border-gray-200 py-4">
                    {selectedUserStatus === "loading" && (
                      <DetailRow label="Loading" value="Please wait..." last />
                    )}
                    {selectedUserError && (
                      <DetailRow label="Error" value={selectedUserError} last />
                    )}
                    {deleteError && (
                      <DetailRow label="Delete error" value={deleteError} last />
                    )}
                    {selectedUserData && selectedUserStatus === "succeeded" && (
                      <>
                        <DetailRow
                          label="Profile"
                          value={
                            selectedUserData.profilePicture ? (
                              <img
                                src={selectedUserData.profilePicture}
                                alt={selectedUserData.fullName || "User"}
                                className="h-10 w-10 rounded-full object-cover border"
                              />
                            ) : (
                              "—"
                            )
                          }
                          isElement
                        />
                        <DetailRow
                          label="User name :"
                          value={selectedUserData.fullName || "—"}
                        />
                        <DetailRow
                          label="Email :"
                          value={selectedUserData.email || "—"}
                        />
                        <DetailRow
                          label="Phone Number"
                          value={selectedUserData.phoneNumber || "—"}
                        />
                        <DetailRow
                          label="User Type"
                          value={selectedUserData.userType || "user"}
                        />
                        <DetailRow
                          label="Active"
                          value={
                            typeof selectedUserData.isActive === "boolean"
                              ? selectedUserData.isActive
                                ? "Yes"
                                : "No"
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Email Verified"
                          value={
                            typeof selectedUserData.isEmailVerified ===
                            "boolean"
                              ? selectedUserData.isEmailVerified
                                ? "Yes"
                                : "No"
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Phone Verified"
                          value={
                            typeof selectedUserData.isPhoneVerified ===
                            "boolean"
                              ? selectedUserData.isPhoneVerified
                                ? "Yes"
                                : "No"
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Auth Provider"
                          value={selectedUserData.authProvider || "—"}
                        />
                        <DetailRow
                          label="Created At"
                          value={
                            selectedUserData.createdAt
                              ? new Date(
                                  selectedUserData.createdAt
                                ).toLocaleString()
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Updated At"
                          value={
                            selectedUserData.updatedAt
                              ? new Date(
                                  selectedUserData.updatedAt
                                ).toLocaleString()
                              : "—"
                          }
                          last
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-6 flex items-center justify-center gap-1 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {getVisiblePages().map((page) => (
              <Button
                key={page}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-[#1C5941] text-white"
                    : "bg-white text-gray-700 border"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value, last, showAvatar, isElement }) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-3 ${
        !last ? "border-b border-gray-100" : ""
      }`}
    >
      <span className="text-gray-500 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {showAvatar && (
          <img
            src="https://github.com/shadcn.png"
            alt="bank"
            className="h-5 w-5 rounded-full object-cover"
          />
        )}
        {isElement ? (
          value
        ) : (
          <span className="text-xs font-semibold text-gray-800">{value}</span>
        )}
      </div>
    </div>
  );
}

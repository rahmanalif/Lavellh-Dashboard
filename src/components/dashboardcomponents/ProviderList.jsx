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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchProviders,
  fetchProviderById,
  approveProvider,
  rejectProvider,
  toggleProviderStatus,
  deleteProvider,
  selectProviders,
  selectProvidersError,
  selectProvidersStatus,
  selectSelectedProvider,
  selectSelectedProviderError,
  selectSelectedProviderStatus,
  selectApproveProviderStatus,
  selectApproveProviderError,
  selectRejectProviderStatus,
  selectRejectProviderError,
  selectToggleProviderStatus,
  selectToggleProviderError,
  selectDeleteProviderStatus,
  selectDeleteProviderError,
  selectProvidersTotalPages,
} from "@/store/providersSlice";
import { selectAdminPermissions } from "@/store/adminAuthSlice";

export default function ProviderList() {
  const dispatch = useDispatch();
  const providers = useSelector(selectProviders);
  const status = useSelector(selectProvidersStatus);
  const error = useSelector(selectProvidersError);
  const totalPages = useSelector(selectProvidersTotalPages);
  const selectedProviderData = useSelector(selectSelectedProvider);
  const selectedProviderStatus = useSelector(selectSelectedProviderStatus);
  const selectedProviderError = useSelector(selectSelectedProviderError);
  const approveStatus = useSelector(selectApproveProviderStatus);
  const approveError = useSelector(selectApproveProviderError);
  const rejectStatus = useSelector(selectRejectProviderStatus);
  const rejectError = useSelector(selectRejectProviderError);
  const toggleStatus = useSelector(selectToggleProviderStatus);
  const toggleError = useSelector(selectToggleProviderError);
  const deleteStatus = useSelector(selectDeleteProviderStatus);
  const deleteError = useSelector(selectDeleteProviderError);
  const permissions = useSelector(selectAdminPermissions);
  const canManageProviders = permissions?.canManageProviders ?? true;

  const [searchName, setSearchName] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const itemsPerPage = 9;

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearch(searchName.trim());
  };

  const handleViewDetails = (provider) => {
    const id = provider._id || provider.id;
    if (id) {
      dispatch(fetchProviderById(id));
    }
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    const id = selectedProviderData?._id || selectedProvider?.id;
    if (!id) return;
    try {
      await dispatch(approveProvider(id)).unwrap();
    } catch {
      // handled in slice state
    }
  };

  const handleReject = () => {
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    const id = selectedProviderData?._id || selectedProvider?.id;
    if (!id || !rejectReason.trim()) return;
    try {
      await dispatch(
        rejectProvider({ id, reason: rejectReason.trim() })
      ).unwrap();
      setRejectModalOpen(false);
    } catch {
      // handled in slice state
    }
  };

  const handleToggleStatus = async () => {
    const id = selectedProviderData?._id || selectedProvider?.id;
    if (!id) return;
    try {
      await dispatch(toggleProviderStatus(id)).unwrap();
    } catch {
      // handled in slice state
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await dispatch(deleteProvider(deleteDialog.id)).unwrap();
      setDeleteDialog({ open: false, id: null });
      if (
        selectedProvider &&
        (selectedProvider._id || selectedProvider.id) === deleteDialog.id
      ) {
        setIsModalOpen(false);
        setSelectedProvider(null);
      }
    } catch {
      // handled in slice state
    }
  };

  useEffect(() => {
    dispatch(
      fetchProviders({
        page: currentPage,
        limit: itemsPerPage,
        search: activeSearch,
        status: statusFilter === "all" ? undefined : statusFilter,
      })
    );
  }, [activeSearch, currentPage, dispatch, statusFilter]);

  const currentItems = useMemo(() => providers, [providers]);

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "—";

  return (
    <div className="mt-5">
      <Card className="shadow-none border-none">
        <CardHeader className="bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Provider List
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[160px] border-gray-300">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Provider Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-44 border-gray-300"
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1C5941]">
                <TableRow className="hover:bg-[#1C5941]">
                  <TableHead className="text-white text-center py-4">
                    #SI
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Provider ID
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Provider Name
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-white text-center">Email</TableHead>
                  <TableHead className="text-white text-center">Number</TableHead>
                  <TableHead className="text-white text-center">Date</TableHead>
                  <TableHead className="text-white text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === "loading" && currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      Loading providers...
                    </TableCell>
                  </TableRow>
                ) : currentItems.length > 0 ? (
                  currentItems.map((provider, index) => {
                    const user = provider.userId || {};
                    return (
                      <TableRow
                        key={provider._id || provider.id}
                        className="bg-white hover:bg-gray-50"
                      >
                        <TableCell className="text-center py-4">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          {provider._id || provider.id || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.fullName || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const statusLabel = provider.verificationStatus
                              ? provider.verificationStatus
                              : provider.isApproved
                              ? "approved"
                              : "pending";
                            return statusLabel === "verified"
                              ? "approved"
                              : statusLabel;
                          })()}
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          {user.email || "—"}
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          {user.phoneNumber || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDate(provider.createdAt || user.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Eye
                              className="h-5 w-5 text-[#1C5941] cursor-pointer"
                              onClick={() => handleViewDetails(provider)}
                            />
                            {canManageProviders && (
                              <Trash2
                                className="h-5 w-5 text-red-500 cursor-pointer"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    id: provider._id || provider.id,
                                  })
                                }
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      {error ? error : "No providers found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-2xl bg-[#F8FAF9]">
              <div className="relative p-6 max-h-[75vh] overflow-y-auto no-scrollbar">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-center text-gray-700 font-medium">
                    Provider Details
                  </DialogTitle>
                </DialogHeader>

                {selectedProvider && (
                  <div className="space-y-0 border rounded-lg bg-white overflow-hidden border-gray-200">
                    {selectedProviderStatus === "loading" && (
                      <DetailRow label="Loading" value="Please wait..." last />
                    )}
                    {selectedProviderError && (
                      <DetailRow label="Error" value={selectedProviderError} last />
                    )}
                    {approveError && (
                      <DetailRow label="Approve error" value={approveError} last />
                    )}
                    {rejectError && (
                      <DetailRow label="Reject error" value={rejectError} last />
                    )}
                    {toggleError && (
                      <DetailRow label="Status error" value={toggleError} last />
                    )}
                    {deleteError && (
                      <DetailRow label="Delete error" value={deleteError} last />
                    )}
                    {selectedProviderData &&
                      selectedProviderStatus === "succeeded" && (
                        <>
                          <DetailRow
                            label="Profile :"
                            value={
                              selectedProviderData.userId?.profilePicture ? (
                                <img
                                  src={selectedProviderData.userId.profilePicture}
                                  alt={selectedProviderData.userId?.fullName || "Provider"}
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
                            value={selectedProviderData.userId?.fullName || "—"}
                          />
                          <DetailRow
                            label="Email :"
                            value={selectedProviderData.userId?.email || "—"}
                          />
                          <DetailRow
                            label="Phone Number :"
                            value={selectedProviderData.userId?.phoneNumber || "—"}
                          />
                          <DetailRow
                            label="User ID :"
                            value={selectedProviderData.userId?._id || "—"}
                          />
                          <DetailRow
                            label="User Type :"
                            value={selectedProviderData.userId?.userType || "—"}
                          />
                          <DetailRow
                            label="Auth Provider :"
                            value={selectedProviderData.userId?.authProvider || "—"}
                          />
                          <DetailRow
                            label="Active :"
                            value={
                              typeof selectedProviderData.userId?.isActive ===
                              "boolean"
                                ? selectedProviderData.userId.isActive
                                  ? "Yes"
                                  : "No"
                                : "—"
                            }
                          />
                          <DetailRow
                            label="Pending Verification :"
                            value={
                              typeof selectedProviderData.userId
                                ?.isPendingVerification === "boolean"
                                ? selectedProviderData.userId
                                    .isPendingVerification
                                  ? "Yes"
                                  : "No"
                                : "—"
                            }
                          />
                          <DetailRow
                            label="Address :"
                            value={
                              selectedProviderData.userId?.location?.address || "—"
                            }
                          />
                          <DetailRow
                            label="Verification :"
                            value={selectedProviderData.verificationStatus || "—"}
                          />
                          <DetailRow
                            label="Occupation :"
                            value={selectedProviderData.occupation || "—"}
                          />
                          <DetailRow
                            label="Reference Id :"
                            value={selectedProviderData.referenceId || "—"}
                            showAvatar
                          />
                          <DetailRow
                            label="Available :"
                            value={
                              typeof selectedProviderData.isAvailable ===
                              "boolean"
                                ? selectedProviderData.isAvailable
                                  ? "Yes"
                                  : "No"
                                : "—"
                            }
                          />
                          <DetailRow
                            label="Rating :"
                            value={`${selectedProviderData.rating ?? 0}`}
                          />
                          <DetailRow
                            label="Total Reviews :"
                            value={`${selectedProviderData.totalReviews ?? 0}`}
                          />
                          <DetailRow
                            label="Completed Jobs :"
                            value={`${selectedProviderData.completedJobs ?? 0}`}
                          />
                          <DetailRow
                            label="Created At :"
                            value={formatDate(selectedProviderData.createdAt)}
                            last
                          />

                          <div className="p-4 bg-white">
                            <p className="text-gray-500 text-xs font-medium mb-3">
                              ID Card
                            </p>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <div className="bg-gray-100 rounded h-20 flex items-center justify-center overflow-hidden">
                                  {selectedProviderData.idCard?.frontImage ? (
                                    <img
                                      src={selectedProviderData.idCard.frontImage}
                                      alt="ID Front"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-400">
                                      N/A
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-center text-gray-400 mt-1">
                                  ID Card Front
                                </p>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-100 rounded h-20 flex items-center justify-center overflow-hidden">
                                  {selectedProviderData.idCard?.backImage ? (
                                    <img
                                      src={selectedProviderData.idCard.backImage}
                                      alt="ID Back"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-400">
                                      N/A
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-center text-gray-400 mt-1">
                                  ID Card Back
                                </p>
                              </div>
                            </div>
                          </div>

                          {canManageProviders &&
                            selectedProviderData.verificationStatus ===
                              "pending" && (
                              <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                <Button
                                  type="button"
                                  className="flex-1 bg-[#1C5941] hover:bg-[#1C5941] text-white"
                                  onClick={handleApprove}
                                  disabled={approveStatus === "loading"}
                                >
                                  {approveStatus === "loading"
                                    ? "Approving..."
                                    : "Approve"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={handleReject}
                                  disabled={rejectStatus === "loading"}
                                >
                                  {rejectStatus === "loading"
                                    ? "Rejecting..."
                                    : "Reject"}
                                </Button>
                              </div>
                            )}

                          {canManageProviders && (
                            <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full border-[#1C5941] text-[#1C5941] hover:bg-emerald-50"
                                onClick={handleToggleStatus}
                                disabled={toggleStatus === "loading"}
                              >
                                {toggleStatus === "loading"
                                  ? "Updating..."
                                  : selectedProviderData.userId?.isActive
                                  ? "Block Provider"
                                  : "Unblock Provider"}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    id:
                                      selectedProviderData._id ||
                                      selectedProviderData.id,
                                  })
                                }
                                disabled={deleteStatus === "loading"}
                              >
                                {deleteStatus === "loading"
                                  ? "Deleting..."
                                  : "Delete Provider"}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Reject Provider</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Please provide a reason for rejection.
                </p>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection"
                  rows={4}
                />
                {rejectError && (
                  <p className="text-sm text-red-500">{rejectError}</p>
                )}
                <Button
                  type="button"
                  className="w-full bg-[#1C5941] text-white"
                  onClick={submitReject}
                  disabled={rejectStatus === "loading" || !rejectReason.trim()}
                >
                  {rejectStatus === "loading" ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={deleteDialog.open}
            onOpenChange={(open) => setDeleteDialog({ open, id: null })}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete provider?</AlertDialogTitle>
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
      <span className="text-gray-500 text-[11px] font-medium uppercase tracking-tight">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {showAvatar && (
          <img
            src="https://github.com/shadcn.png"
            alt="ref"
            className="h-4 w-4 rounded-full"
          />
        )}
        {isElement ? (
          value
        ) : (
          <span className="text-[11px] font-semibold text-gray-800">{value}</span>
        )}
      </div>
    </div>
  );
}

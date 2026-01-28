import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAdmin,
  deleteAdmin,
  fetchAdminById,
  fetchAdmins,
  selectAdminUsers,
  selectAdminUsersError,
  selectAdminUsersStatus,
  selectCreateAdminError,
  selectCreateAdminStatus,
  selectDeleteAdminError,
  selectDeleteAdminStatus,
  selectSelectedAdmin,
  selectSelectedAdminError,
  selectSelectedAdminStatus,
  selectToggleAdminStatus,
  selectUpdateAdminError,
  selectUpdateAdminStatus,
  toggleAdminStatus,
  updateAdmin,
} from "@/store/adminUsersSlice";
import { selectAdmin, selectAdminRole } from "@/store/adminAuthSlice";
import { Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

const roleOptions = [
  { label: "Super Admin", value: "super-admin" },
  { label: "Admin", value: "admin" },
  { label: "Moderator", value: "moderator" },
];

const emptyCreateForm = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  isActive: true,
};

export default function Admins() {
  const dispatch = useDispatch();
  const admins = useSelector(selectAdminUsers);
  const status = useSelector(selectAdminUsersStatus);
  const error = useSelector(selectAdminUsersError);
  const selectedAdmin = useSelector(selectSelectedAdmin);
  const selectedStatus = useSelector(selectSelectedAdminStatus);
  const selectedError = useSelector(selectSelectedAdminError);
  const createStatus = useSelector(selectCreateAdminStatus);
  const createError = useSelector(selectCreateAdminError);
  const updateStatus = useSelector(selectUpdateAdminStatus);
  const updateError = useSelector(selectUpdateAdminError);
  const deleteStatus = useSelector(selectDeleteAdminStatus);
  const deleteError = useSelector(selectDeleteAdminError);
  const toggleStatus = useSelector(selectToggleAdminStatus);

  const currentAdmin = useSelector(selectAdmin);
  const currentRole = useSelector(selectAdminRole);
  const currentAdminId = currentAdmin?._id || currentAdmin?.id;

  const [searchName, setSearchName] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState(emptyCreateForm);

  const itemsPerPage = 10;

  const isSuperAdmin = currentRole === "super-admin";

  useEffect(() => {
    if (!isSuperAdmin) return;
    dispatch(
      fetchAdmins({
        page: currentPage,
        limit: itemsPerPage,
        search: activeSearch,
      })
    );
  }, [activeSearch, currentPage, dispatch, isSuperAdmin]);

  useEffect(() => {
    if (selectedAdmin) {
      setEditForm({
        name: selectedAdmin.name || selectedAdmin.fullName || "",
        email: selectedAdmin.email || "",
        password: "",
        role: selectedAdmin.role || "admin",
        isActive:
          typeof selectedAdmin.isActive === "boolean"
            ? selectedAdmin.isActive
            : true,
      });
    }
  }, [selectedAdmin]);

  const currentItems = useMemo(() => admins, [admins]);

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearch(searchName.trim());
  };

  const openEdit = (admin) => {
    const id = admin?._id || admin?.id;
    if (id) {
      dispatch(fetchAdminById(id));
      setEditOpen(true);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAdmin(createForm)).unwrap();
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
    } catch {
      // errors handled in slice
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = selectedAdmin?._id || selectedAdmin?.id;
    if (!id) return;

    const payload = {
      name: editForm.name,
      email: editForm.email,
      ...(editForm.password ? { password: editForm.password } : {}),
      role: editForm.role,
      isActive: editForm.isActive,
    };

    try {
      await dispatch(updateAdmin({ id, payload })).unwrap();
      setEditOpen(false);
    } catch {
      // errors handled in slice
    }
  };

  const handleToggle = async (admin) => {
    const id = admin?._id || admin?.id;
    if (!id) return;
    try {
      await dispatch(toggleAdminStatus(id)).unwrap();
    } catch {
      // handled in slice
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await dispatch(deleteAdmin(deleteDialog.id)).unwrap();
      setDeleteDialog({ open: false, id: null });
    } catch {
      // handled in slice
    }
  };

  const isModerator = selectedAdmin?.role === "moderator";
  const isEditingSelf =
    (selectedAdmin?._id || selectedAdmin?.id) === currentAdminId;

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Admins</h2>
        <p className="mt-2 text-sm text-gray-500">
          You do not have permission to manage admins.
        </p>
      </div>
    );
  }

  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardHeader className="px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Admin Management
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                placeholder="Search admin"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-52 border-gray-300"
              />
            </div>
            <Button
              className="bg-[#1C5941] text-white rounded-full px-5"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              className="bg-[#1C5941] text-white rounded-full px-5"
              onClick={() => {
                setCreateForm(emptyCreateForm);
                setCreateOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Admin
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
          <table className="w-full text-left">
            <thead className="bg-[#1C5941] text-white">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {status === "loading" && currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Loading admins...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((admin) => {
                  const id = admin?._id || admin?.id;
                  const isSelf = id && id === currentAdminId;
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-700">
                        {admin.name || admin.fullName || "—"}
                      </td>
                      <td className="p-4 text-gray-600">
                        {admin.email || "—"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-emerald-100"
                        >
                          {admin.role || "admin"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={admin.isActive ? "default" : "destructive"}
                          className={
                            admin.isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(admin)}
                          >
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggle(admin)}
                            disabled={isSelf || toggleStatus === "loading"}
                            title={
                              isSelf
                                ? "You cannot deactivate yourself"
                                : "Toggle active status"
                            }
                          >
                            {admin.isActive ? (
                              <ToggleRight className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteDialog({ open: true, id })
                            }
                            disabled={isSelf}
                            title={
                              isSelf ? "You cannot delete yourself" : "Delete"
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    {error || "No admins found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Create Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {createError && (
              <p className="text-sm text-red-500">{createError}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#1C5941] text-white"
              disabled={createStatus === "loading"}
            >
              {createStatus === "loading" ? "Creating..." : "Create Admin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            {selectedStatus === "loading" && (
              <p className="text-sm text-gray-500">Loading details...</p>
            )}
            {selectedError && (
              <p className="text-sm text-red-500">{selectedError}</p>
            )}
            {isModerator && (
              <p className="text-xs text-amber-600">
                Moderator role is read-only. Updates are disabled.
              </p>
            )}
            {isEditingSelf && (
              <p className="text-xs text-amber-600">
                You cannot change your own role or deactivate yourself.
              </p>
            )}
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={isModerator}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={isModerator}
              />
            </div>
            <div>
              <Label>Password (optional)</Label>
              <Input
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, password: e.target.value }))
                }
                disabled={isModerator}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, role: value }))
                }
                disabled={isModerator || isEditingSelf}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions
                    .filter((role) => role.value !== "moderator")
                    .map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editForm.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    isActive: value === "active",
                  }))
                }
                disabled={isModerator || isEditingSelf}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {updateError && (
              <p className="text-sm text-red-500">{updateError}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#1C5941] text-white"
              disabled={updateStatus === "loading" || isModerator}
            >
              {updateStatus === "loading" ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete admin?</AlertDialogTitle>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-red-500">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteStatus === "loading"}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteStatus === "loading" ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

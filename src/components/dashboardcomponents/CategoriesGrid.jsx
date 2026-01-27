import React, { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategoryById,
  selectCategories,
  selectCategoriesError,
  selectCategoriesStatus,
  selectCreateError,
  selectCreateStatus,
  selectDeleteError,
  selectDeleteStatus,
  selectSelectedCategory,
  selectSelectedError,
  selectSelectedStatus,
  selectToggleError,
  selectToggleStatus,
  selectUpdateError,
  selectUpdateStatus,
  selectUploadError,
  selectUploadStatus,
  toggleCategoryStatus,
  updateCategory,
  uploadCategoryIcon,
} from "@/store/categoriesSlice";

export default function CategoriesGrid() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);
  const createStatus = useSelector(selectCreateStatus);
  const createError = useSelector(selectCreateError);
  const uploadStatus = useSelector(selectUploadStatus);
  const uploadError = useSelector(selectUploadError);
  const selectedCategoryData = useSelector(selectSelectedCategory);
  const selectedStatus = useSelector(selectSelectedStatus);
  const selectedError = useSelector(selectSelectedError);
  const updateStatus = useSelector(selectUpdateStatus);
  const updateError = useSelector(selectUpdateError);
  const toggleStatus = useSelector(selectToggleStatus);
  const toggleError = useSelector(selectToggleError);
  const deleteStatus = useSelector(selectDeleteStatus);
  const deleteError = useSelector(selectDeleteError);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryActive, setCategoryActive] = useState(true);
  const [categoryIconFile, setCategoryIconFile] = useState(null);
  const [categoryIconPreview, setCategoryIconPreview] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryParentId, setCategoryParentId] = useState("");
  const [categoryDisplayOrder, setCategoryDisplayOrder] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!categoryIconPreview) return;
    return () => URL.revokeObjectURL(categoryIconPreview);
  }, [categoryIconPreview]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    setCategoryIconFile(file || null);
    setCategoryIconPreview(file ? URL.createObjectURL(file) : "");
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setCategoryActive(true);
    setCategoryIconFile(null);
    setCategoryIconPreview("");
    setCategorySlug("");
    setCategoryParentId("");
    setCategoryDisplayOrder("");
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      let icon = "";
      if (categoryIconFile) {
        icon = await dispatch(uploadCategoryIcon(categoryIconFile)).unwrap();
      }
      const payload = {
        name: categoryName,
        description: categoryDescription,
        icon,
        isActive: categoryActive,
      };
      // TODO: Confirm if backend requires slug/parentId and keep these inputs if needed.
      if (categorySlug) payload.slug = categorySlug;
      if (categoryParentId) payload.parentId = categoryParentId;
      if (categoryDisplayOrder !== "") {
        payload.displayOrder = Number(categoryDisplayOrder);
      }

      await dispatch(createCategory(payload)).unwrap();
      resetForm();
      setIsAddDialogOpen(false);
      dispatch(fetchCategories());
      window.alert("Category created successfully.");
    } catch {
      // errors are handled by slice state
    }
  };

  const loadCategoryAndOpen = async (category, mode) => {
    setSelectedCategory(category);
    const id = category._id || category.id;
    if (id) {
      try {
        const data = await dispatch(fetchCategoryById(id)).unwrap();
        setCategoryName(data?.name || "");
        setCategoryDescription(data?.description || "");
        setCategoryActive(
          typeof data?.isActive === "boolean" ? data.isActive : true
        );
        setCategoryIconPreview(data?.icon || "");
        setCategoryIconFile(null);
        setCategorySlug(data?.slug || "");
        setCategoryParentId(data?.parentId || "");
        setCategoryDisplayOrder(
          data?.displayOrder !== undefined && data?.displayOrder !== null
            ? String(data.displayOrder)
            : ""
        );
      } catch {
        // handled by slice state
      }
    }
    if (mode === "view") {
      setIsViewDialogOpen(true);
    } else {
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    const id = selectedCategory._id || selectedCategory.id;
    if (!id) return;
    try {
      let icon = categoryIconPreview;
      if (categoryIconFile) {
        icon = await dispatch(uploadCategoryIcon(categoryIconFile)).unwrap();
      }
      const payload = {
        name: categoryName,
        description: categoryDescription,
        icon,
        isActive: categoryActive,
      };
      if (categorySlug) payload.slug = categorySlug;
      if (categoryParentId) payload.parentId = categoryParentId;
      if (categoryDisplayOrder !== "") {
        payload.displayOrder = Number(categoryDisplayOrder);
      }
      await dispatch(updateCategory({ id, payload })).unwrap();
      setIsEditDialogOpen(false);
      dispatch(fetchCategories());
      window.alert("Category updated successfully.");
    } catch {
      // handled by slice state
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedCategory) return;
    const id = selectedCategory._id || selectedCategory.id;
    if (!id) return;
    try {
      await dispatch(toggleCategoryStatus(id)).unwrap();
      dispatch(fetchCategories());
      window.alert("Category status updated.");
    } catch {
      // handled by slice state
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    const id = selectedCategory._id || selectedCategory.id;
    if (!id) return;
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      setIsEditDialogOpen(false);
      setIsViewDialogOpen(false);
      dispatch(fetchCategories());
      window.alert("Category deleted.");
    } catch {
      // handled by slice state
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button
          onClick={openAddDialog}
          className="bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {error && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchCategories())}
          >
            Retry
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.id || category._id}
            className=" border-2 cursor-pointer  transition-colors overflow-hidden rounded-md"
            onClick={() => loadCategoryAndOpen(category, "edit")}
          >
            <div className="w-full h-32 p-3  flex items-center justify-center overflow-hidden">
              <img
                src={category.icon || "/placeholder.svg"}
                alt={category.name || "Category"}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4 flex flex-col space-y-3">
              <p className="text-sm font-medium text-center">
                {category.name || "Unnamed"}
              </p>
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadCategoryAndOpen(category, "edit");
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadCategoryAndOpen(category, "view");
                  }}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </div>
        ))}
        {status === "loading" && categories.length === 0 && (
          <p className="text-sm text-gray-500">Loading categories...</p>
        )}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className="font-semibold">ayudame</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddDialogOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-xl">Add new category</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="add-category-name" className="text-base">
                Category name
              </Label>
              <Input
                id="add-category-name"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-description" className="text-base">
                Description
              </Label>
              <Input
                id="add-category-description"
                placeholder="Enter description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-icon" className="text-base">
                Upload category icon
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="add-category-icon"
                  placeholder={
                    categoryIconFile ? "Image uploaded" : "Upload icon"
                  }
                  className="h-12"
                  readOnly
                  value={categoryIconFile ? "Image uploaded" : ""}
                />
                <label htmlFor="add-file-input">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0 bg-transparent"
                    onClick={() =>
                      document.getElementById("add-file-input")?.click()
                    }
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </label>
                <input
                  id="add-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e)}
                />
              </div>
              {categoryIconPreview && (
                <img
                  src={categoryIconPreview}
                  alt="Category preview"
                  className="h-12 w-12 rounded border object-cover"
                />
              )}
              {uploadStatus === "loading" && (
                <p className="text-sm text-gray-500">Uploading icon...</p>
              )}
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="add-category-active"
                type="checkbox"
                checked={categoryActive}
                onChange={(e) => setCategoryActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="add-category-active" className="text-base">
                Active
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-slug" className="text-base">
                Slug (optional)
              </Label>
              <Input
                id="add-category-slug"
                placeholder="TODO: confirm if required"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-parent" className="text-base">
                Parent ID (optional)
              </Label>
              <Input
                id="add-category-parent"
                placeholder="TODO: confirm if required"
                value={categoryParentId}
                onChange={(e) => setCategoryParentId(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-order" className="text-base">
                Display order (optional)
              </Label>
              <Input
                id="add-category-order"
                type="number"
                min="0"
                placeholder="0"
                value={categoryDisplayOrder}
                onChange={(e) => setCategoryDisplayOrder(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              onClick={handleAddCategory}
              disabled={createStatus === "loading"}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white text-base"
            >
              {createStatus === "loading" ? "Adding..." : "Add Category"}
            </Button>
            {createError && <p className="text-sm text-red-600">{createError}</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className="font-semibold">ayudame</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-xl">Edit category</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name" className="text-base">
                Category name
              </Label>
              <Input
                id="edit-category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-description" className="text-base">
                Description
              </Label>
              <Input
                id="edit-category-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-icon" className="text-base">
                Upload category icon
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-category-icon"
                  placeholder={categoryIconFile ? "Image uploaded" : "Upload icon"}
                  className="h-12"
                  readOnly
                  value={categoryIconFile ? "Image uploaded" : ""}
                />
                <label htmlFor="edit-file-input">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0 bg-transparent"
                    onClick={() =>
                      document.getElementById("edit-file-input")?.click()
                    }
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </label>
                <input
                  id="edit-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e)}
                />
              </div>
              {(categoryIconPreview || categoryIconFile) && (
                <img
                  src={categoryIconPreview}
                  alt="Category icon"
                  className="h-12 w-12 rounded border object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="edit-category-active"
                type="checkbox"
                checked={categoryActive}
                onChange={(e) => setCategoryActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="edit-category-active" className="text-base">
                Active
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-slug" className="text-base">
                Slug
              </Label>
              <Input
                id="edit-category-slug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-parent" className="text-base">
                Parent ID
              </Label>
              <Input
                id="edit-category-parent"
                value={categoryParentId}
                onChange={(e) => setCategoryParentId(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-order" className="text-base">
                Display order
              </Label>
              <Input
                id="edit-category-order"
                value={categoryDisplayOrder}
                onChange={(e) => setCategoryDisplayOrder(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              onClick={handleUpdateCategory}
              disabled={updateStatus === "loading"}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white text-base"
            >
              {updateStatus === "loading" ? "Saving..." : "Save Changes"}
            </Button>
            {updateError && <p className="text-sm text-red-600">{updateError}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={toggleStatus === "loading"}
                onClick={handleToggleStatus}
              >
                {toggleStatus === "loading"
                  ? "Updating..."
                  : categoryActive
                  ? "Deactivate"
                  : "Activate"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                disabled={deleteStatus === "loading"}
                onClick={handleDeleteCategory}
              >
                {deleteStatus === "loading" ? "Deleting..." : "Delete"}
              </Button>
            </div>
            {toggleError && <p className="text-sm text-red-600">{toggleError}</p>}
            {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Category Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className="font-semibold">ayudame</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsViewDialogOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-xl">Category details</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-sm text-gray-700">
            {selectedStatus === "loading" && (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
            {selectedError && (
              <p className="text-sm text-red-600">{selectedError}</p>
            )}
            {selectedCategoryData && (
              <>
                <div className="space-y-1">
                  <p className="font-semibold">Name</p>
                  <p>{selectedCategoryData.name || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Description</p>
                  <p>{selectedCategoryData.description || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Icon</p>
                  {selectedCategoryData.icon ? (
                    <img
                      src={selectedCategoryData.icon}
                      alt={selectedCategoryData.name || "Category"}
                      className="h-16 w-16 rounded border object-cover"
                    />
                  ) : (
                    <p>—</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Active</p>
                  <p>
                    {typeof selectedCategoryData.isActive === "boolean"
                      ? selectedCategoryData.isActive
                        ? "Yes"
                        : "No"
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Created</p>
                  <p>{selectedCategoryData.createdAt || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Updated</p>
                  <p>{selectedCategoryData.updatedAt || "—"}</p>
                </div>
              </>
            )}
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white text-base"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

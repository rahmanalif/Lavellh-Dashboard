import React, { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import img from "../../assets/images.avif";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft } from "lucide-react";

export default function CategoriesGrid() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Technology", icon: img },
    { id: "2", name: "Technology", icon: img },
    { id: "3", name: "Technology", icon: img },
    { id: "4", name: "Technology", icon: img },
    { id: "5", name: "Technology", icon: img },
    { id: "6", name: "Technology", icon: img },
    { id: "7", name: "Technology", icon: img },
    { id: "8", name: "Technology", icon: img },
    { id: "9", name: "Technology", icon: img },
    { id: "10", name: "Technology", icon: img },
    { id: "11", name: "Technology", icon: img },
    { id: "12", name: "Technology", icon: img },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: categoryName,
        icon: categoryIcon || "/category-icon.png",
      };
      setCategories([...categories, newCategory]);
      setCategoryName("");
      setCategoryIcon("");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = () => {
    if (selectedCategory && categoryName.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, name: categoryName, icon: categoryIcon || cat.icon }
            : cat
        )
      );
      setCategoryName("");
      setCategoryIcon("");
      setSelectedCategory(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryIcon(category.icon || "");
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setCategoryName("");
    setCategoryIcon("");
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className=" border-2 cursor-pointer  transition-colors overflow-hidden rounded-md"
            onClick={() => openEditDialog(category)}
          >
            <div className="w-full h-32 p-3  flex items-center justify-center overflow-hidden">
              <img
                src={category.icon || "/placeholder.svg"}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4 flex flex-col space-y-3">
              <p className="text-sm font-medium text-center">{category.name}</p>
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs bg-transparent"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </div>
        ))}
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
              <Label htmlFor="add-category-icon" className="text-base">
                Upload category icon
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="add-category-icon"
                  placeholder={categoryIcon ? "Image uploaded" : "Upload icon"}
                  className="h-12"
                  readOnly
                  value={categoryIcon ? "Image uploaded" : ""}
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
            </div>

            <Button
              onClick={handleAddCategory}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white text-base"
            >
              Add Category
            </Button>
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
              <Label htmlFor="edit-category-icon" className="text-base">
                Upload category icon
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-category-icon"
                  placeholder={categoryIcon ? "Image uploaded" : "Upload icon"}
                  className="h-12"
                  readOnly
                  value={categoryIcon ? "Image uploaded" : ""}
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
                  onChange={(e) => handleImageUpload(e, true)}
                />
              </div>
            </div>

            <Button
              onClick={handleEditCategory}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white text-base"
            >
              Edit Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

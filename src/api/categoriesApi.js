import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const uploadCategoryIcon = async (file) => {
  const formData = new FormData();
  formData.append("icon", file);
  const res = await adminClient.post(
    "/admin/categories/upload-icon",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  const data = extractData(res);
  return data?.icon || data?.iconUrl || data?.url || data;
};

export const createCategory = async (payload) => {
  const res = await adminClient.post("/admin/categories", payload);
  return extractData(res);
};

export const fetchCategories = async () => {
  const res = await adminClient.get("/admin/categories");
  return extractData(res);
};

export const fetchCategoryById = async (id) => {
  const res = await adminClient.get(`/admin/categories/${id}`);
  const data = extractData(res);
  return data?.category || data?.data?.category || data;
};

export const updateCategory = async (id, payload) => {
  const res = await adminClient.put(`/admin/categories/${id}`, payload);
  const data = extractData(res);
  return data?.category || data?.data?.category || data;
};

export const toggleCategoryStatus = async (id) => {
  const res = await adminClient.put(`/admin/categories/${id}/toggle-status`);
  const data = extractData(res);
  return data?.category || data?.data?.category || data;
};

export const deleteCategory = async (id) => {
  const res = await adminClient.delete(`/admin/categories/${id}`);
  return extractData(res);
};

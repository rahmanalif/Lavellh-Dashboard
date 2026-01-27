import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchEmployeesByOwner = async ({
  ownerId,
  page = 1,
  limit = 10,
  search = "",
}) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get(
    `/admin/business-owners/${ownerId}/employees`,
    { params }
  );
  return extractData(res);
};

export const fetchEmployeeById = async (id) => {
  const res = await adminClient.get(`/admin/employees/${id}`);
  const data = extractData(res);
  return data?.employee || data?.data?.employee || data;
};

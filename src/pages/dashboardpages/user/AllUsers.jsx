import React from "react";
import UserList from "../../../components/dashboardcomponents/UserList";
import UserOverview from "@/components/dashboardcomponents/UserOverview";


const AllUsers = () => {
  return (
    <div>
      <UserOverview />
      <UserList />
    </div>
  );
};

export default AllUsers;

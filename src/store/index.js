import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./adminAuthSlice";
import categoriesReducer from "./categoriesSlice";
import usersReducer from "./usersSlice";
import providersReducer from "./providersSlice";
import businessOwnersReducer from "./businessOwnersSlice";
import employeesReducer from "./employeesSlice";
import eventManagersReducer from "./eventManagersSlice";
import eventManagerEventsReducer from "./eventManagerEventsSlice";
import dashboardStatsReducer from "./dashboardStatsSlice";
import transactionsReducer from "./transactionsSlice";

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    categories: categoriesReducer,
    users: usersReducer,
    providers: providersReducer,
    businessOwners: businessOwnersReducer,
    employees: employeesReducer,
    eventManagers: eventManagersReducer,
    eventManagerEvents: eventManagerEventsReducer,
    dashboardStats: dashboardStatsReducer,
    transactions: transactionsReducer,
  },
});

export default store;

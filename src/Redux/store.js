import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { ordersReducer } from "./slices/orders";
import { periodsReducer } from "./slices/periods";
import { usersReducer } from "./slices/users";


const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth: authReducer,
    users: usersReducer,
    periods: periodsReducer
  }
})

export default store
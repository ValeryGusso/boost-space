import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axiosSettings'

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const { data } = await axios().get('/orders')
  return data
})

const initialState = {
	items: [],
  myOrders: [],
	isLoaded: true,
}

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {},
	extraReducers: {
    [fetchOrders.pending]: state => {
      state.items = []
      state.myOrders = []
      state.isLoaded = false
    },
    [fetchOrders.fulfilled]: (state, action) => {
      state.items = action.payload.orders
      state.myOrders = action.payload.myOrders
      state.isLoaded = true
    },
    [fetchOrders.rejected]: state => {
      state.items = []
      state.myOrders = []
      state.isLoaded = false
    },
  },
})

export const ordersReducer = ordersSlice.reducer

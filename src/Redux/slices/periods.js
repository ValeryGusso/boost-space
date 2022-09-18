import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axiosSettings'

export const fetchPeriods = createAsyncThunk('periods/fetchPeriods', async () => {
  const { data } = await axios().get('/period')
  return data
})

const initialState = {
	data: [],
  isLoaded: false
}

const periodsSlice = createSlice({
	name: 'periods',
	initialState,
	reducers: {},
	extraReducers: {
    [fetchPeriods.pending]: state => {
      state.data = []
      state.isLoaded = false
    },
    [fetchPeriods.fulfilled]: (state, action) => {
      state.data = action.payload
      state.isLoaded = true
    },
    [fetchPeriods.rejected]: state => {
      state.data = []
      state.isLoaded = false
    },
  },
})

export const periodsReducer = periodsSlice.reducer
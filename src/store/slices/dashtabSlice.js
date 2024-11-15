import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tab: 'dashboard',
}

const dashtabSlice = createSlice({
  name: 'dashtab',
  initialState,
  reducers: {
    setDashTab: (state, action) => {
      return { ...state, tab: action.payload }
    },
  },
})

export const { setDashTab } = dashtabSlice.actions
export default dashtabSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

// No longer needed, socket is managed via context
const socketSlice = createSlice({
    name: "socketio",
    initialState: {},
    reducers: {}
});
export default socketSlice.reducer;
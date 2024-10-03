import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:[],
    addUser: (state, action) => {
        state.push(action.payload);
    },
    removeUser: ( ) => {
        return []
    },
})

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

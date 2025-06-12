import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat:{},
  messages: [], 
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload.messages;
      state.chat = action.payload.chat;
    },
    addMessage : (state, action) => {
        state.messages.push(action.payload);
    },
    removeMessage : (state, action) => {
        state.messages = state.messages.filter(message=> message._id !== action.payload._id);
    }
  },
});

export const { setMessages, addMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
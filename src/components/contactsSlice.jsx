
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
  const response = await fetch('https://64eb4d3ee51e1e82c5773025.mockapi.io/contacts');
  const data = await response.json();
  return data;
});


export const addContact = createAsyncThunk('contacts/addContact', async (contactData) => {
  const response = await fetch('https://64eb4d3ee51e1e82c5773025.mockapi.io/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });
  const data = await response.json();
  return data;
});


export const deleteContact = createAsyncThunk('contacts/deleteContact', async (contactId) => {
  await fetch(`https://64eb4d3ee51e1e82c5773025.mockapi.io/contacts/${contactId}`, {
    method: 'DELETE',
  });
  return contactId;
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: { contacts: [], filter: '' },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((contact) => contact.id !== action.payload);
      });
  },
});

export const { setFilter, resetContacts } = contactsSlice.actions;

export default contactsSlice.reducer;

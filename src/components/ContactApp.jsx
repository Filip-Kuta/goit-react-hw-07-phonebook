import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addContact, deleteContact, fetchContacts, setFilter, resetContacts } from './contactsSlice';
import { nanoid } from 'nanoid';
import './ContactApp.css';

function ContactApp() {
  const contacts = useSelector(state => state.contacts.contacts);
  const filter = useSelector(state => state.contacts.filter);
  const dispatch = useDispatch();
  const [surname, setSurname] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  useEffect(() => {
    saveContactsToLocalStorage(contacts);
  }, [contacts]);

  const handleChange = (event, setterFunction, formatFunction) => {
    const { value } = event.target;
    if (formatFunction) {
      const formattedValue = formatFunction(value);
      setterFunction(formattedValue);
    } else {
      setterFunction(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const existingContact = contacts.find(
      (contact) =>
        contact.surname.toLowerCase() === surname.toLowerCase() &&
        contact.number === number
    );
    if (existingContact) {
      alert('Contact with the same surname and number already exists.');
    } else {
      const id = nanoid();
      const newContact = { id, surname, number };
      dispatch(addContact(newContact));
      setSurname('');
      setNumber('');
    }
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    dispatch(setFilter(value)); // Aktualizuj filtrowanie w Redux Store
  };

  const handleDeleteContact = (id) => {
    dispatch(deleteContact(id));
  };

  const handleResetContacts = () => {
    if (window.confirm('Are you sure you want to delete all contacts? This action cannot be undone.')) {
      dispatch(resetContacts([]));
    }
  };

  const formatPhoneNumber = (value) => {
    const formattedValue = value.replace(/\D/g, '').slice(0, 9);
    const formattedNumber = formattedValue.replace(/(\d{3})(\d{1,3})?(\d{1,3})?/, (_, p1, p2, p3) => {
      let result = p1;
      if (p2) result += '-' + p2;
      if (p3) result += '-' + p3;
      return result;
    });
    return formattedNumber;
  };

  const saveContactsToLocalStorage = (contacts) => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.surname.toLowerCase().includes(filter.toLowerCase()) ||
      contact.number.includes(filter) // Dodaj filtrację po numerze telefonu
  );

  return (
    <div className="ContactApp">
      <h1>Phonebook</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor='surname'>Name:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            placeholder='Jan Kowalski'
            pattern="^[a-zA-Zа-яА-Я\s'-]*$"
            title="Surname"
            required
            value={surname}
            onChange={(event) => handleChange(event, setSurname)}
          />
        </div>

        <div className="form-section">
          <label htmlFor="number">Phone Number:</label>
          <input
            type="text"
            name="number"
            placeholder='000-000-000'
            title="Phone number"
            required
            value={number}
            onChange={(event) => handleChange(event, setNumber, formatPhoneNumber)}
          />
        </div>

        <button type="submit">Add Contact</button>
      </form>

      <h2>Contacts</h2>
      <input
        type="text"
        placeholder="Search by surname or number" // Zaktualizowano placeholder
        value={filter}
        onChange={handleFilterChange}
      />
      <ul>
        {filteredContacts.map((contact) => (
          <li key={contact.id}>
            {contact.surname}: {contact.number}{' '}
            <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button className="reset-button" type="button" onClick={handleResetContacts}>
        Reset Contacts
      </button>
    </div>
  );
}

export default ContactApp;

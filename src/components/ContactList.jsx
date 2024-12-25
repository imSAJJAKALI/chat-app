import React, { useState, useEffect } from "react";
import { db } from "../instantDB/db";

const ContactList = ({ currentUser, onSelectContact }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null); // State for the selected contact

  useEffect(() => {
    // Subscribe to the list of users, excluding the current user
    const unsubscribe = db.subscribeQuery(
      {
        users: {},
      },
      (resp) => {
        if (resp.data && Array.isArray(resp.data.users)) {
          setContacts(resp.data.users.filter((el) => el.id !== currentUser.id));
        }
      }
    );

    // Cleanup subscription when the component unmounts or when currentUser changes
    return () => unsubscribe();
  }, [currentUser]);

  // Handle contact selection
  const handleSelectContact = (contact) => {
    setSelectedContact(contact); // Set selected contact
    onSelectContact(contact); // Call the onSelectContact prop
  };

  return (
    <div className="space-y-4 overflow-y-auto p-4 h-full">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
            selectedContact?.id === contact.id ? "bg-gray-600" : "hover:bg-gray-700"
          }`}
          onClick={() => handleSelectContact(contact)}
        >
          {/* Contact Avatar */}
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          {/* Contact Name */}
          <div className="flex-1">
            <p className="text-black hover:text-white text-sm font-semibold">{contact.name}</p>
            {/* Last Message Preview */}
            <p className="text-gray-400 text-xs truncate">
              {/* {contact.lastMessage || "No messages yet"} */}
            </p>
          </div>
          {/* Online Status Indicator */}
         
        </div>
      ))}
    </div>
  );
};

export default ContactList;

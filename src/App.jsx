import React, { useState, useEffect } from "react";
import ProfileForm from "./components/CreateProfile";
import ContactList from "./components/ContactList";
import ChatBox from "./components/ChatBox";
import { db } from "./instantDB/db";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");

    // If a user ID is saved in localStorage, subscribe to user data
    if (savedUserId) {
      // Fetch the user data based on the saved user ID
      const unsubscribe = db.subscribeQuery(
        {
          users: {
            $filter: { id: savedUserId }, // Filter for the saved user ID
          },
        },
        (resp) => {
          if (resp.data?.users?.length > 0) {
            setCurrentUser(resp.data.users[0]); // Set the current user if found
          }
        }
      );

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    }
  }, []);

  const handleProfileCreated = (user) => {
    setCurrentUser(user);
    localStorage.setItem("userId", user.id); // Save the user ID to localStorage
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  if (!currentUser) {
    return <ProfileForm onProfileCreated={handleProfileCreated} />;
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/3 border-r p-4">
        <ContactList currentUser={currentUser} onSelectContact={handleSelectContact} />
      </div>
      <div className="w-2/3">
        {selectedContact ? (
          <ChatBox currentUser={currentUser} selectedContact={selectedContact} />
        ) : (
          <p className="text-center text-gray-500 mt-8">Select a contact to chat</p>
        )}
      </div>
    </div>
  );
};

export default App;

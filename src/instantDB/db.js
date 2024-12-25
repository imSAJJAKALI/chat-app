import { init, i, id } from "@instantdb/core";

// ID for your app
const APP_ID = "101117db-3ce3-4421-b1ad-0d9fe7dd5976";

// Define schema
export const schema = i.schema({
  entities: {
    users: i.entity({
      id: i.string(),
      name: i.string(),
      email: i.string(),
      createdAt: i.date(),
    }),
    messages: i.entity({
      senderId: i.string(),
      receiverId: i.string(),
      text: i.string(),
      timestamp: i.date(),
    }),
  },
});

// Initialize database
export const db = init({ appId: APP_ID, schema });

// Utility for generating unique IDs
export const generateId = id;

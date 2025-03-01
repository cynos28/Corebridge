import React from "react";

// Define the structure of a User object using TypeScript interface
interface User {
  id: number;
  name: string;
  role: "Admin" | "Manager" | "User"; // Union type restricting values
}

// Sample user data
const users: User[] = [
  { id: 1, name: "Alice Johnson", role: "Admin" },
  { id: 2, name: "Bob Smith", role: "Manager" },
  { id: 3, name: "Charlie Brown", role: "User" },
];



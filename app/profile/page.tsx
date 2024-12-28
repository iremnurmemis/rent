'use client'
import React from "react";
import { useUser } from "@/contexts/UserContext";

const ProfilePage = () => {
  const { user } = useUser();

  if (!user) {
    return <div>You must be logged in to view your profile.</div>;
  }

  console.log(user);

  return (
    <div className="pt-64">
      <h1>Welcome, {user.firstName} {user.lastName}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
    </div>
  );
};

export default ProfilePage;

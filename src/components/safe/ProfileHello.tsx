import React from 'react';
import { useUser } from '@clerk/clerk-react';

export default function ProfileHello() {
  const { isLoaded, user } = useUser();
  if (!isLoaded) return null; // prevent render until Clerk is ready
  return <span>Hello, {user?.firstName ?? 'there'}!</span>;
}

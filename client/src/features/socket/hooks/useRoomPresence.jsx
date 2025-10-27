import { useState } from "react";
import { useSocketEvent } from "./useSocketEvent";

/**
 * Hook for tracking online users in a room
 * @param {string} roomId - Room ID
 */
export const useRoomPresence = (roomId) => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useSocketEvent('room:users', (data) => {
    if (data.roomId === roomId) {
      setUsers(data.users || []);
      setUserCount(data.count || data.users?.length || 0);
    }
  });

  useSocketEvent('room:user:joined', (data) => {
    if (data.roomId === roomId) {
      setUsers((prev) => [...prev, data.user]);
      setUserCount((prev) => prev + 1);
    }
  });

  useSocketEvent('room:user:left', (data) => {
    if (data.roomId === roomId) {
      setUsers((prev) => prev.filter((u) => u.id !== data.userId));
      setUserCount((prev) => Math.max(0, prev - 1));
    }
  });

  return {
    users,
    userCount,
  };
};
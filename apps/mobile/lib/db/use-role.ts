import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getRole, setRole as persistRole, type Role } from './settings';

export function useRole() {
  const [role, setLocalRole] = useState<Role>('client');

  useFocusEffect(
    useCallback(() => {
      setLocalRole(getRole());
    }, []),
  );

  const updateRole = (next: Role) => {
    persistRole(next);
    setLocalRole(next);
  };

  return { role, updateRole };
}

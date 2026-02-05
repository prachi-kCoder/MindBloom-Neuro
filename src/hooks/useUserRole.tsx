import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'student' | 'educator' | 'parent';

interface UserRoleState {
  role: AppRole | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserRole() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [state, setState] = useState<UserRoleState>({
    role: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user?.id) {
      setState({ role: null, isLoading: false, error: null });
      return;
    }

    async function fetchRole() {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setState({ role: null, isLoading: false, error: error.message });
          return;
        }

        setState({
          // IMPORTANT: maybeSingle() returns null/undefined when no row exists.
          // If we cast undefined, the UI can think the user "hasRole" and render a blank dashboard.
          role: (data?.role ?? null) as AppRole | null,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching user role:', err);
        setState({
          role: null,
          isLoading: false,
          error: 'Failed to fetch user role',
        });
      }
    }

    fetchRole();
  }, [user?.id, isAuthLoading]);

  const isEducator = state.role === 'educator';
  const isStudent = state.role === 'student';
  const isParent = state.role === 'parent';
  const hasRole = state.role !== null;

  return {
    ...state,
    isEducator,
    isStudent,
    isParent,
    hasRole,
    isAuthLoading,
  };
}

export async function assignRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (error) {
      // If the role was already assigned, treat as success.
      // (Some schemas enforce uniqueness; users should not get stuck.)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === '23505') return true;
      console.error('Error assigning role:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error assigning role:', err);
    return false;
  }
}

export async function createProfile(userId: string, fullName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({ user_id: userId, full_name: fullName });

    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === '23505') return true;
      console.error('Error creating profile:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error creating profile:', err);
    return false;
  }
}


import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  user_id?: string;
  username?: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  created_at?: string;
  updated_at?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch user profile when session changes
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
      } else if (data) {
        // Create the profile with only the guaranteed fields from the database schema
        const profileData: UserProfile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          created_at: data.created_at,
          updated_at: data.updated_at,
          email: user?.email || undefined
        };
        
        // Add optional fields only if they exist in the returned data
        if ('user_id' in data) {
          profileData.user_id = data.user_id as string;
        }
        
        if ('username' in data) {
          profileData.username = data.username as string;
        }
        
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Exception fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, session, profile, loading };
}

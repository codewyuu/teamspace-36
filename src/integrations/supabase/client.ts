// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bedwnwvfhcsckytvtkgx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZHdud3ZmaGNzY2t5dHZ0a2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjA1NTksImV4cCI6MjA2MDM5NjU1OX0.BnHyCVZV_1aEqK6VoYXUt-5BzVVgc-elCoatIbT60XU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  // process.env.SUPABASE_URL as string,
  // process.env.SUPABASE_ANON_KEY as string
  "https://repbfhpyuppbokrprkbk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcGJmaHB5dXBwYm9rcnBya2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzE4ODIsImV4cCI6MjAzMjY0Nzg4Mn0.HyzeOAkTtEAzgIrDHkcc7v82BFqfQwJaeozR0lgpdb0"
);

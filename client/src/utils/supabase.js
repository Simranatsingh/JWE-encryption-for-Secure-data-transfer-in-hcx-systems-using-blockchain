import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://ekhuscbqsqrljhkzukak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHVzY2Jxc3FybGpoa3p1a2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTU2MjAsImV4cCI6MjA2MDk3MTYyMH0.LS9TlpTsYNW859wHMwjdGkitDOcC5-YkkR93VKXCwDE';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 
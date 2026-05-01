// supabase-config.js
// Copy your Supabase project values here.
// WARNING: This file contains your public anon key; do not store service_role keys here.

window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
  url: 'https://ebgdwvalapqalpkdmzhr.supabase.co', // <-- replace with your Supabase project URL
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2R3dmFsYXBxYWxwa2RtemhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjQ5ODAsImV4cCI6MjA4NjkwMDk4MH0.0YrxV1VCczEjHB3uR6FeOhrOHH_X_uKGwqHqcCQErus' // <-- replace with your public anon key
};

// Initialize the Supabase wrapper if present
(function(){
  try {
    if (window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.key && window.SupabaseDB) {
      window.SupabaseDB.init(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.key);
      console.info('Supabase configured (supabase-config.js)');
    } else {
      console.info('supabase-config.js loaded but SupabaseDB or keys not available');
    }
  } catch (e) {
    console.warn('Error initializing SupabaseDB:', e);
  }
})();

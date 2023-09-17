require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: true,
  },
};

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey, options);

module.exports = supabase;

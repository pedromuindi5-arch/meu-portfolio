/**
 * supabase-client.js
 * Inicializa a ligação ao Supabase. Incluir DEPOIS do CDN do supabase-js
 * e ANTES de js/data.js em todas as páginas.
 */
const SUPABASE_URL = 'https://drdvngmmaisqmyyahftn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZHZuZ21tYWlzcW15eWFoZnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzAxODUsImV4cCI6MjEwMDQwNjE4NX0.l8mo-dC8wOHs99EZ6RKZ2WtTUpAJENdUX2g6EvqvGbg';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

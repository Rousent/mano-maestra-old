
import { createClient } from "@supabase/supabase-js"

const PROYECT_URL = "https://wpkrpmthehwfsdayyjnv.supabase.co"
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwa3JwbXRoZWh3ZnNkYXl5am52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA4MDU3NDUsImV4cCI6MTk5NjM4MTc0NX0.og8fNR5GI4_vmjbItDF9JKFG9M5gHBV0NQt00oUvgHw"

export const supabase = createClient(PROYECT_URL, ANON_KEY)
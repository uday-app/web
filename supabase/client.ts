import { createBrowserClient } from "@supabase/ssr";

import { supabasePublishableKey, supabaseUrl } from "@/supabase/config";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}

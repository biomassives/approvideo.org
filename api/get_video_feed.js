 // api/get_video_feed.js

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
  try {
    // Create a Supabase client using environment variables

    const supabaseUrl =   Deno.env.get("https://vlvbodwrtblttvwnxkjx.supabase.co")!,
    const supabaseAnonKey =  Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJvZHdydGJsdHR2d254a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDk2NzIsImV4cCI6MjAwMjMyNTY3Mn0.TRT1HeX85vP1zDxnU7qBz5GqNPgYZUj-BOdek4qmtEg")!
  
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500 },
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Use a raw SQL query to fetch and format the video data
    const { data: videos, error } = await supabaseClient.rpc(
      "get_video_feed",
      {},
    );

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
     

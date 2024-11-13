import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // Get the authorization header from the request
    const authorizationHeader = req.headers.get("Authorization");

    // Check if the authorization header is present and starts with "Bearer "
    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Extract the JWT from the authorization header
    const jwt = authorizationHeader.split("Bearer ")[1];

    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the JWT
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.api.getUser(jwt);

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 401 }
      );
    }

    // If the JWT is valid, fetch the video data
    const { data: videos, error } = await supabaseClient
      .from("Video")
      .select(`
        id,
        title,
        description,
        youtubeId,
        transcript,
        rating,
        creator,
        host,
        datePublished,
        createdAt,
        updatedAt,
        duration,
        url,
        thumbnail_url,
        featured,
        user_id,
        status,
        tag_ids,
        category_ids
      `);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    // Return the video data as JSON
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

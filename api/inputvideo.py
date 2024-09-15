from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client
import json
import os

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/videos':
            self.handle_get_videos()
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        if self.path == '/api/videos':
            self.handle_create_video()
        else:
            self.send_error(404, "Not Found")

    def do_PUT(self):
        if self.path.startswith('/api/videos/'):
            video_id = self.path.split('/')[-1]
            self.handle_update_video(video_id)
        else:
            self.send_error(404, "Not Found")

    def do_DELETE(self):
        if self.path.startswith('/api/videos/'):
            video_id = self.path.split('/')[-1]
            self.handle_delete_video(video_id)
        else:
            self.send_error(404, "Not Found")

    def handle_get_videos(self):
        try:
            response = supabase.table('videos').select('*').execute()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response.data).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_create_video(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        video_data = json.loads(post_data.decode('utf-8'))

        try:
            response = supabase.table('videos').insert(video_data).execute()
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response.data[0]).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_update_video(self, video_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        video_data = json.loads(post_data.decode('utf-8'))

        try:
            response = supabase.table('videos').update(video_data).eq('id', video_id).execute()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response.data[0]).encode())
        except Exception as e:
            self.send_error(500, str(e))

    def handle_delete_video(self, video_id):
        try:
            supabase.table('videos').delete().eq('id', video_id).execute()
            self.send_response(204)
            self.end_headers()
        except Exception as e:
            self.send_error(500, str(e))

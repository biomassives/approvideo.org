# api/update_video.py

from http.server import BaseHTTPRequestHandler
import json
from supabase import create_client, Client

url: str = "https://vlvbodwrtblttvwnxkjx.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJvZHdydGJsdHR2d254a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDk2NzIsImV4cCI6MjAwMjMyNTY3Mn0.TRT1HeX85vP1zDxnU7qBz5GqNPgYZUj-BOdek4qmtEg"
supabase: Client = create_client(url, key)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        video_id = data.get('id')
        updated_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'tags': data.get('tags'),
            'rating': data.get('rating')
        }

        try:
            response = supabase.table('video').update(updated_data).eq('id', video_id).execute()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response.data).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

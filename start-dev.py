#!/usr/bin/env python3
"""
Simple development server for the Constellation Viewer
Serves the application with proper MIME types for ES6 modules
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class ConstellationHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def guess_type(self, path):
        """Override MIME type guessing for JavaScript modules"""
        mimetype, encoding = super().guess_type(path)
        
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.mjs'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        
        return mimetype

def main():
    # Change to the src directory
    src_dir = Path(__file__).parent / 'src'
    if not src_dir.exists():
        print("Error: src directory not found!")
        print("Please run this script from the constellation project root directory.")
        sys.exit(1)
    
    os.chdir(src_dir)
    
    PORT = 8000
    
    # Check if port is available
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', PORT))
    sock.close()
    
    if result == 0:
        print(f"Port {PORT} is already in use. Trying port {PORT + 1}...")
        PORT += 1
    
    Handler = ConstellationHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Constellation Viewer Development Server")
        print(f"Serving at http://localhost:{PORT}")
        print(f"Press Ctrl+C to stop the server")
        print(f"Directory: {src_dir.absolute()}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    main()

"""Local test server. Run:  python3 serve.py  (Windows: py serve.py)  then open http://localhost:8000/listening.html
Unlike 'python -m http.server', it supports byte ranges, so audio/video seeking works as on GitHub Pages."""
import http.server,os,re,sys
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store');super().end_headers()
    def send_head(self):
        rng=self.headers.get('Range');path=self.translate_path(self.path)
        m=re.match(r'bytes=(\d*)-(\d*)$',rng or '')
        if not m or not os.path.isfile(path): return super().send_head()
        size=os.path.getsize(path);a,b=m.groups()
        start,end=(max(0,size-int(b or 0)),size-1) if a=='' else (int(a),min(int(b),size-1) if b else size-1)
        if start>end: self.send_error(416);return None
        f=open(path,'rb');f.seek(start);self.n=end-start+1
        self.send_response(206);self.send_header('Content-Type',self.guess_type(path))
        self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(self.n));self.send_header('Accept-Ranges','bytes');self.end_headers();return f
    def copyfile(self,src,dst):
        n=getattr(self,'n',None);self.n=None
        dst.write(src.read(n)) if n else super().copyfile(src,dst)
port=int(sys.argv[1]) if len(sys.argv)>1 else 8000
print(f'Open http://localhost:{port}/listening.html   (Ctrl+C to stop)')
http.server.ThreadingHTTPServer(('',port),H).serve_forever()

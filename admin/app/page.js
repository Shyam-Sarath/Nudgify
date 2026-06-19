'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7325/ingest/ec45b7eb-196d-4933-afd3-e540532f9309',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'78bd0c'},body:JSON.stringify({sessionId:'78bd0c',runId:'initial',hypothesisId:'A',location:'admin/app/page.js:useEffect',message:'Admin home page mounted',data:{apiUrl:process.env.NEXT_PUBLIC_API_URL||'http://localhost:5001',appUrl:process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 select-none">
      <div className="glass-panel p-10 max-w-md w-full text-center border border-border/25 shadow-xl animate-slide-up">
        <h1 className="text-5xl font-bold font-serif text-primary-950 mb-3 tracking-tight">Nudgify</h1>
        <p className="text-lg font-serif font-bold text-secondary-600 mb-8 tracking-widest uppercase">Admin Portal</p>
        <div className="flex justify-center">
          <a
            href="/login"
            className="btn-primary text-base px-8 py-3 shadow-md"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

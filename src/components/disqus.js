// components/DisqusThread.jsx - Manual Loading Approach
import React, { useEffect, useRef } from 'react';

export default function DisqusThread({ shortname, identifier, title, url }) {
  const disqusRef = useRef(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    // Clean up any existing Disqus elements
    const cleanup = () => {
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = '';
      }
      
      // Remove existing Disqus scripts
      const scripts = document.querySelectorAll('script[src*="disqus"]');
      scripts.forEach(script => script.remove());
      
      // Clear Disqus global variables
      if (window.DISQUS) {
        delete window.DISQUS;
      }
      if (window.disqus_config) {
        delete window.disqus_config;
      }
    };

    cleanup();

    // Set up Disqus configuration
    window.disqus_config = function () {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    // Load Disqus script
    const script = document.createElement('script');
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', +new Date());
    script.async = true;
    
    script.onload = () => {
      isLoadingRef.current = false;
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      isLoadingRef.current = false;
      cleanup();
    };
  }, [shortname, identifier, title, url]);

  return (
    <div className="disqus-container" style={{ marginTop: '2rem' }} ref={disqusRef}>
      <div id="disqus_thread"></div>
    </div>
  );
}
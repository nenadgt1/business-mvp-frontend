import { useEffect, useRef } from "react";

const fallbackImages = ["/fallback1.jpg", "/fallback2.jpg"];

export default function Preview({
  html,
  onUserScroll,
  onLinkBlocked
}: {
  html: string;
  onUserScroll?: () => void;
  onLinkBlocked?: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the injected script in a single backticked string with no nested backticks.
  // Avoid TypeScript syntax in the injected code (it's plain JS inside the iframe).
  const injectedScript = `
(function(){
  function notify(reason, detail){
    try { parent.postMessage({ type: 'preview-link-click', reason: reason, detail: detail }, '*'); } catch(e){}
  }

  // Ensure relative links don't resolve to the parent app
  try {
    var base = document.createElement('base');
    base.href = 'about:blank';
    document.head.appendChild(base);
  } catch(e){}

  // Image fallbacks
  var fallbacks = ${JSON.stringify(fallbackImages)};
  var i = 0;
  Array.prototype.forEach.call(document.images, function(img){
    img.addEventListener('error', function(e){
      if (i < fallbacks.length) {
        var el = e.target;
        el.onerror = null;
        el.src = fallbacks[i++];
      }
    }, { once: true });
  });

  // Block <a>/<area> clicks
  document.addEventListener('click', function(e){
    var el = e.target && (e.target.closest ? e.target.closest('a,area') : null);
    if (el && el.getAttribute && (el.getAttribute('href') || el.getAttribute('xlink:href'))) {
      e.preventDefault();
      e.stopPropagation();
      var href = el.getAttribute('href') || el.getAttribute('xlink:href');
      notify('anchor', { href: href });
      return false;
    }
  }, true);

  // Block form submissions
  document.addEventListener('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    notify('form');
    return false;
  }, true);

  // Block programmatic navigation
  try { window.location.assign = function(u){ notify('js-location-assign', { url: u }); }; } catch(e){}
  try { window.location.replace = function(u){ notify('js-location-replace', { url: u }); }; } catch(e){}
  try { window.open = function(){ notify('window-open'); return null; }; } catch(e){}
  try {
    history.pushState = function(state, title, url){ notify('history-push', { url: url }); };
    history.replaceState = function(state, title, url){ notify('history-replace', { url: url }); };
  } catch(e){}

  // Block unload-driven navigations
  window.addEventListener('beforeunload', function(e){
    e.preventDefault();
    notify('beforeunload');
    return '';
  });
})();`;

  useEffect(() => {
    const node = iframeRef.current;
    if (!node) return;

    // Safely append our script right before </body>, or at the end if no body tag
    const scriptTag = `<script>${injectedScript}<\/script>`;
    const withScript = /<\/body>/i.test(html)
      ? html.replace(/<\/body>/i, `${scriptTag}</body>`)
      : html + scriptTag;

    node.srcdoc = withScript;
  }, [html, injectedScript]);

  // Listen for wheel/touch to hide hint
  useEffect(() => {
    const holder = containerRef.current;
    if (!holder || !onUserScroll) return;
    const handler = () => onUserScroll();
    holder.addEventListener("wheel", handler, { passive: true });
    holder.addEventListener("touchmove", handler, { passive: true });
    return () => {
      holder.removeEventListener("wheel", handler);
      holder.removeEventListener("touchmove", handler);
    };
  }, [onUserScroll]);

  // Receive "blocked" message from iframe
  useEffect(() => {
    if (!onLinkBlocked) return;
    const listener = (e: MessageEvent) => {
      if (e?.data && e.data.type === "preview-link-click") onLinkBlocked();
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [onLinkBlocked]);

  return (
    <div ref={containerRef} className="preview-scroll" aria-label="Generated website preview (scrollable)">
      <iframe
        ref={iframeRef}
        className="preview-iframe"
        title="Website Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

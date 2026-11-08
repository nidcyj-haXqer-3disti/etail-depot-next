"use client";

import { useEffect } from "react";

// Native disclosures work without JavaScript. Fragment navigation opens only the
// relevant ancestors during parsing, so a saved step is visible on first paint.
const restoreSavedStep = `(function(){
  var pendingDisclosure;
  function reveal(hash, scroll, focus) {
    var target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { return; }
    if (!target || !target.closest('[data-integration-guide]')) return;
    var node = target;
    while (node && node !== document.body) {
      if (node.tagName === 'DETAILS') node.open = true;
      node = node.parentElement;
    }
    if (focus) {
      var summary = target.matches('details') ? target.querySelector('summary') : null;
      if (summary) summary.focus({preventScroll:true});
    }
    if (scroll) target.scrollIntoView({behavior:'instant',block:'start'});
  }
  var guide = document.querySelector('[data-integration-guide]');
  if (!guide || guide.__etailStepsInitialized) return;
  guide.__etailStepsInitialized = true;
  reveal(location.hash, true, false);
  // Navigation between guides reuses the same document. Bind delegated listeners once.
  if (window.__etailIntegrationGuideReady) return;
  window.__etailIntegrationGuideReady = true;
  // A slow image can finish after the visitor has already started reading.
  // Only untouched reloads should align the saved step when loading completes.
  var interactedWhileLoading = false;
  var readingEvents = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
  function preserveReadingPosition() { interactedWhileLoading = true; }
  readingEvents.forEach(function(type) {
    addEventListener(type, preserveReadingPosition, {capture:true, passive:true});
  });
  document.addEventListener('click', function(event) {
    var summary = event.target.closest && event.target.closest('[data-integration-guide] summary');
    if (summary && summary.parentElement.id && !summary.parentElement.open) {
      pendingDisclosure = summary.parentElement;
      history.replaceState(history.state, '', '#' + summary.parentElement.id);
    }
    var link = event.target.closest && event.target.closest('[data-integration-guide] a[href^="#"]');
    if (!link) return;
    reveal(link.getAttribute('href'), false, true);
  });
  document.addEventListener('toggle', function(event){
    if (event.target === pendingDisclosure && pendingDisclosure.open) {
      pendingDisclosure.scrollIntoView({behavior:'instant',block:'start'});
      pendingDisclosure = null;
    }
  }, true);
  addEventListener('hashchange', function(){ reveal(location.hash, true, false); });
  addEventListener('pageshow', function(event){
    function stopTracking() {
      readingEvents.forEach(function(type) { removeEventListener(type, preserveReadingPosition, true); });
    }
    // Back/Forward restores the saved viewport and the visitor's disclosure choices.
    if (event.persisted || interactedWhileLoading) { stopTracking(); return; }
    reveal(location.hash, false, false);
    var navigation = performance.getEntriesByType('navigation')[0];
    if (navigation && navigation.type === 'reload') requestAnimationFrame(function(){
      if (!interactedWhileLoading) reveal(location.hash, true, false);
      stopTracking();
    });
    else stopTracking();
  });
})();`;

export function IntegrationGuideStepState() {
  useEffect(() => {
    // React route navigation inserts script markup without executing it. Run the
    // same fixed initializer on mount; its guard prevents duplicate listeners.
    const initializer = document.createElement("script");
    initializer.textContent = restoreSavedStep;
    document.body.append(initializer);
    initializer.remove();
  }, []);
  return <script dangerouslySetInnerHTML={{ __html: restoreSavedStep }} />;
}

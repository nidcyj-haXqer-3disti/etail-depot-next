/**
 * Runs as the main HTML finishes parsing, before the final page marker releases the native render boundary.
 * Only responsive disclosure attributes differ from SSR. Their components suppress
 * that expected attribute difference and preserve native choices during hydration.
 * Client navigations use layout effects; no script or network request is awaited.
 */
export const initialArtworkState = `(function(){
  var target = null;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) {}
  document.querySelectorAll('details[data-responsive-artwork]').forEach(function(details){
    var wallet = details.getAttribute('data-responsive-artwork') === 'wallet';
    var open = wallet ? matchMedia('(min-width: 851px)').matches
      : !matchMedia('(max-width: 680px)').matches || !!(target && details.parentElement.contains(target));
    details.open = open;
    details.setAttribute('data-initial-open', String(open));
  });
})();`;

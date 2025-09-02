function isAnimationTimelineSupported() {
  const viewTimelineSupport = CSS.supports('animation-timeline: view()');
  return viewTimelineSupport;
}
async function loadAnimationTimelinePolyfill() {
  if (!isAnimationTimelineSupported()) {
    try {
      await import(gspb_scroll_params.gspbLibraryUrl + '/libs/utility/scroll-timeline.js');
    } catch (error) {
      console.error('Error loading Animation Timeline polyfills:', error);
    }
  }
}
loadAnimationTimelinePolyfill();
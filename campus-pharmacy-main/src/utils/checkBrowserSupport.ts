// Check if View Transitions API is supported
export const checkViewTransitionsSupport = (): boolean => {
  // @ts-ignore
  return typeof document.startViewTransition === 'function';
};

// Log browser support info
export const logBrowserInfo = () => {
  const supported = checkViewTransitionsSupport();
  console.log('=== Browser Support Check ===');
  console.log('View Transitions API supported:', supported);
  console.log('User Agent:', navigator.userAgent);
  console.log('============================');
  return supported;
};

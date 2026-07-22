export const getPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  // Desktop OS detection
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'desktop_mac';
  if (/Windows/i.test(userAgent)) return 'desktop_windows';
  if (/Linux/i.test(userAgent)) return 'desktop_linux';
  
  return 'unknown';
};

export const getBrowser = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf("Edg") > -1) {
    return "edge";
  } else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1) {
    return "chrome";
  } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    return "safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "firefox";
  }
  
  return "unknown";
};

export const isStandalone = () => {
  return (
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    (window.navigator as any).standalone === true
  );
};

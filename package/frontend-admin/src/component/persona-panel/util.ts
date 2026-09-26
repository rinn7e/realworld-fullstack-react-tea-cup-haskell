/**
 * Browser name from a user agent. Order matters: e.g. Chrome's UA also
 * contains "Safari", and Edge/Opera UAs also contain "Chrome".
 */
export const detectBrowser = (userAgent: string): string => {
  if (userAgent.includes('Firefox')) {
    return 'Firefox'
  } else if (userAgent.includes('SamsungBrowser')) {
    return 'Samsung Browser'
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'Opera'
  } else if (userAgent.includes('Trident')) {
    return 'Internet Explorer'
  } else if (userAgent.includes('Edge')) {
    return 'Edge'
  } else if (userAgent.includes('Chrome')) {
    return 'Chrome'
  } else if (userAgent.includes('Safari')) {
    return 'Safari'
  } else {
    return 'Unknown'
  }
}

/** Operating system from a user agent, checked in the same order as before. */
export const detectOs = (userAgent: string): string => {
  if (userAgent.includes('Win')) {
    return 'Windows'
  } else if (userAgent.includes('Mac')) {
    return 'MacOS'
  } else if (userAgent.includes('Linux')) {
    return 'Linux'
  } else if (userAgent.includes('Android')) {
    return 'Android'
  } else if (userAgent.includes('like Mac')) {
    return 'iOS'
  } else {
    return 'Unknown'
  }
}

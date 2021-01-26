export function isInternalUrlWithCan(href: string) {
  return href.includes('covidactnow.org');
}

export function isInternalLink(href: string) {
  return (
    href.startsWith('#') || href.startsWith('/') || isInternalUrlWithCan(href)
  );
}

export function formatInternalLink(href: string) {
  if (isInternalUrlWithCan(href)) {
    const canUrl = new URL(href);
    const formatted = `${canUrl.pathname}${canUrl.hash}`;
    return formatted.toLowerCase();
  } else {
    return href.toLowerCase();
  }
}

export function isValidURL(href: string): boolean {
  const isInternal = isInternalLink(href);
  try {
    isInternal
      ? new URL(formatInternalLink(href), 'https://covidactnow.org')
      : new URL(href);
  } catch (err) {
    console.error(err, href);
    return false;
  }
  return true;
}

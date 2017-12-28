export const getOrganizationId = () => {
  let host = '';
  if (typeof (window) !== 'undefined') {
    host = window.location.hostname;
  }
  let subdomain = 'sg';
  if (host.match(/^[^.]*/g).length > 0) {
    subdomain = host.match(/^[^.]*/g)[0];
  }

  if (subdomain === 'sg') {
    /* eslint-disable no-undef */
    return __SG_ORGANIZATION_ID__;
    /* eslint-enable no-undef */
  } else if (subdomain === 'my') {
    /* eslint-disable no-undef */
    return __MY_ORGANIZATION_ID__;
    /* eslint-enable no-undef */
  } else if (subdomain === 'ph') {
    /* eslint-disable no-undef */
    return __PH_ORGANIZATION_ID__;
    /* eslint-enable no-undef */
  }

  return null;
};

export const getSubdomain = () => {
  let host = '';
  if (typeof (window) !== 'undefined') {
    host = window.location.hostname;
  }
  let subdomain = 'sg';
  if (host.match(/^[^.]*/g).length > 0) {
    subdomain = host.match(/^[^.]*/g)[0];
  }

  return subdomain;
};

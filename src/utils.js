// @ts-check

/**
 * Check if given param is function
 * @param {Function} fn
 * @returns {boolean}
 */
export const isFunction = (fn) => {
  return fn.constructor.name.toLowerCase() === "function";
};

/**
 * Check if given param is async function
 * @param {Function} fn
 * @returns {boolean}
 */
export const isAsyncFunction = (fn) => {
  return fn.constructor.name.toLowerCase() === "asyncfunction";
};

/**
 * Remove trailing slash of a give url
 * @param {string} url
 * @returns {string}
 */
export const removeTrailingSlash = (url) => {
  if (url.endsWith("/")) {
    url = url.replace(/\/$/, "");
  }

  return url;
};

/**
 * Find anchor element from click event.
 * @param {Event} e - The click event.
 * @returns {HTMLAnchorElement|undefined}
 */
export const findAnchor = (e) => {
  return e.composedPath().find((elem) => {
    return elem.tagName === "A";
  });
};

/**
 * Check if the router should handle a click event on an anchor element.
 * @param {Event} e - The click event.
 * @param {HTMLAnchorElement} anchor - The anchor element.
 * @returns {boolean} - True if the router should handle the event, false otherwise.
 */
export const shouldRouterHandleClick = (e, anchor) => {
  // If the event has already been handled by another event listener
  if (e.defaultPrevented) {
    return false;
  }

  // If the user is holding down the meta, control, or shift key
  if (e.metaKey || e.ctrlKey || e.shiftKey) {
    return false;
  }

  if (!anchor) {
    return false;
  }

  if (anchor.target) {
    return false;
  }

  if (
    anchor.hasAttribute("download") ||
    anchor.getAttribute("rel") === "external"
  ) {
    return false;
  }

  const href = anchor.href;
  if (!href || href.startsWith("mailto:")) {
    return false;
  }

  // If the href attribute does not start with the same origin
  if (!href.startsWith(location.origin)) {
    return false;
  }

  return true;
};

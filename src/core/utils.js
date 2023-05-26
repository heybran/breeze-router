// @ts-check

export const isFunction = (fn) => {
  return fn.constructor.name.toLowerCase() === "function";
}

export const isAsyncFunction = (fn) => {
  return fn.constructor.name.toLowerCase() === "asyncfunction"; 
}

/**
 * Remove trailing slash of a give url
 * @param {string} url
 * @returns {string}
 */
export const removeTrailingSlash = (url) => {
  if (url.endsWith('/')) {
    url = url.replace(/\/$/, '');
  }
  
  return url;
}
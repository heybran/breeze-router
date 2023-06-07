/**
 * @typedef {Object} Route
 * @property {string} path - The path of the route
 * @property {Function} handler - The handler function for the route.
 */

/**
 * @typedef {Object.<string, string>} RouteParams
 */

/**
 * @typedef {Object} MatchedRoute
 * @property {Route} route
 * @property {RouteParams} params
 */

export { Route, RouteParams, MatchedRoute };

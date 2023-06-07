// @ts-check
import {
  isFunction,
  isAsyncFunction,
  removeTrailingSlash,
} from "./core/utils.js";

/**
 * Class representing a router.
 */
export default class BreezeRouter {
  /**
   * Creates a new BreezeRouter instance.
   * @constructor
   */
  constructor() {
    /**
     * Object containing all registered routes.
     * @type {import('./types.js').Route}
     * @private
     */
    this._routes = {};

    /**
     * The previous route that was navigated to
     * @type {import('./types.js').Route}
     * @private
     */
    this._previousRoute = {};

    // Bind event listeners
    window.addEventListener("popstate", this._onChanged.bind(this));
    document.body.addEventListener("click", this._handleClick.bind(this));
  }

  /**
   * Initializes the router by triggering the initial navigation event.
   * @returns {void}
   */
  init() {
    this._onChanged();
  }

  /**
   * Adds a new route to the router.
   * @param {string} route - The route path to add.
   * @param {Function} handler - The async function to handle the route
   * @returns {BreezeRouter|void} The BreezeRouter instance.
   */
  add(route, handler) {
    route = route.trim();
    if (route !== "/") {
      route = removeTrailingSlash(route.trim());
    }

    if (this._routes[route]) {
      return console.warn(`Route already exists: ${route}`);
    }

    if (typeof handler !== "function") {
      return console.error(`handler on route '${route}' is not a function.`);
    }

    this._routes[route] = {
      path: route,
      handler,
    };

    return this;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url - The URL to navigate to
   * @returns {void}
   */
  navigateTo(url) {
    window.history.pushState({ url }, "", url);
    this._onChanged();
  }

  /**
   * Redirects a URL
   * @param {string} url
   * @returns {void}
   */
  redirect(url) {
    this.navigateTo(url);
  }

  async _onChanged() {
    const path = window.location.pathname;
    const { route, params } = this._matchUrlToRoute(path);

    // If no matching route found, route will be '404' route
    // which has been handled by _matchUrlToRoute already
    await this._handleRoute({ route, params });
  }

  /**
   * Processes route callbacks registered by app
   * @param {import('./types.js').MatchedRoute} options
   * @returns {Promise<void>}
   */
  async _handleRoute({ route, params }) {
    if (isFunction(route.handler)) {
      route.handler({ route, params });
    }

    if (isAsyncFunction(route.handler)) {
      await route.handler({ route, params });
    }
  }

  /**
   *
   * @param {string} url - Current url users visite or nagivate to.
   * @returns {import('./types.js').MatchedRoute}
   */
  _matchUrlToRoute(url) {
    /** @type {import('./types.js').RouteParams} */
    const params = {};

    if (url !== "/") {
      url = removeTrailingSlash(url);
    }

    const matchedRoute = Object.keys(this._routes).find((route) => {
      if (url.split("/").length !== route.split("/").length) {
        return false;
      }

      let routeSegments = route.split("/").slice(1);
      let urlSegments = url.split("/").slice(1);

      // If each segment in the url matches the corresponding segment in the route path,
      // or the route path segment starts with a ':' then the route is matched.
      const match = routeSegments.every((segment, i) => {
        return segment === urlSegments[i] || segment.startsWith(":");
      });

      if (!match) {
        return false;
      }

      // If the route matches the URL, pull out any params from the URL.
      routeSegments.forEach((segment, i) => {
        if (segment.startsWith(":")) {
          const propName = segment.slice(1);
          params[propName] = decodeURIComponent(urlSegments[i]);
        }
      });

      return true;
    });

    if (matchedRoute) {
      return { route: this._routes[matchedRoute], params };
    } else {
      return { route: this._routes[404], params };
    }
  }

  _handleClick(event) {}
}

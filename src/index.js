// @ts-check
import {
  isFunction,
  isAsyncFunction,
  removeTrailingSlash,
  findAnchor,
  shouldRouterHandleClick,
} from "./utils.js";

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
   * Starts the router.
   * @returns {void}
   */
  start() {
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

    /**
     * Update previous route, so application route handler can check and decide if it should re-render whole page.
     */
    this._previousRoute = route;
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

  /**
   * Handles <a> link clicks
   * @param {Event} event
   * @returns {void}
   */
  _handleClick(event) {
    const anchor = findAnchor(event);
    if (!anchor) {
      return;
    }

    if (!shouldRouterHandleClick(event, anchor)) {
      return;
    }

    event.preventDefault();
    let href = anchor.getAttribute("href")?.trim();
    if (!href?.startsWith("/")) {
      href = "/" + href;
    }

    this.navigateTo(href);
  }

  /**
   * Add or remove search param to current url.
   * @param {HTMLInputElement} checkbox 
   * @param {string} value
   * @returns void
   */
  toggleParam(checkbox, value) {
    const params = new URLSearchParams(location.search);
    const name = checkbox.getAttribute('name')
    if (!name) {
      return console.warn(`name attribute is not set on ${checkbox.outerHTML}`);
    }
    if (checkbox.checked) {
      !params.has(name) && params.set(name, value);
    } else if (!checkbox.checked) {
      params.has(name) && params.delete(name);
    }
    
    const newUrl = !!params.size
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;
    this.navigateTo(newUrl);
  }
}

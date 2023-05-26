// @ts-check

/**
 * Class representing a router.
 */
class BreezeRouter {
  /**
   * Creates a new BreezeRouter instance.
   * @constructor
   */
  constructor() {
    /**
     * Object containing all registered routes.
     * @type {Object.<string, Function>} 
     * @private
     */
    this._routes = {};

    /**
     * The previous route that was navigated to
     * @type {Object|null}
     * @private
     */
    this._previousRoute = null;

    /**
     * Flag indicating whether this is the first initial page load.
     * @type {boolean}
     * @private
     */
    this._isInitialLoad = false;

    // Bind event listeners
    window.addEventListener('popstate', this._onChanged.bind(this));
    document.body.addEventListener('click', this._handleClick.bind(this));
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
   * @returns {BreezeRouter} The BreezeRouter instance.
   */
  add(route, handler) {
    if (this._routes[route]) {
      return console.warn(`Route already exists: ${route}`);
    }

    this._routes[route] = {
      path: route,
      handler
    };

    return this;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url - The URL to navigate to
   * @returns {void}
   */
  navigateTo(url) {
    window.history.pushState({url}, '', url);
    this._onChanged();
  }

  async _onChanged() {
    const path = window.location.pathname;
    const { route, params } = this._matchUrlToRoute(path);

    if (!route) {
      return;
    }

    if (typeof route.handler === "function" && route.handler.constructor.name.toLowerCase() === "function") {
      route.handler({ route, param });
    } 

    if (typeof route.handler === "function" && route.handler.constructor.name.toLowerCase() === "asyncfunction") {
      await route.handler({ route, params });
    }
  }

  // @param {string} url
  _matchUrlToRoute(url) {
    // params will be storing some information of matched route
    const params = {};

    // If url ends with "/", e.g. "/project/edit/123/",
    // then remove the trailing slash using replace() method with a regular expression.
    if (url.endsWith('/')) {
      url = url.replace(/\/$/, '');
    }

    // When we visit url: /project/edit/123,
    // first we need to figure out which route match the url pattern.
    const matchedRoute = Object.keys(this._routes).find((route) => {
      // '/dashboard' will not match '/project/edit/123'
      // as they have different length if we compare them after split with "/".
      if (url.split('/').length !== route.split('/').length) {
        return false;
      }

      // '/project/edit/:id' => [ "project", "edit", ":id" ]
      let routeSegments = route.split('/').slice(1);
      // '/project/edit/123' => [ "project", "edit", "123" ]
      let urlSegments = url.split('/').slice(1);

      // If each segment in the url matches the corresponding segment in the route path,
      // or the route path segment starts with a ':' then the route is matched.
      const match = routeSegments.every((segment, i) => {
        return segment === urlSegments[i] || segment.startsWith(':');
      });

      // If the route matches the URL, pull out any params from the URL.
      if (match) {
        routeSegments.forEach((segment, i) => {
          if (segment[0] === ':') {
            const propName = segment.slice(1);
            params[propName] = decodeURIComponent(urlSegments[i]);
          }
        });
      }

      return match;
    });

    return { route: this._routes[matchedRoute], params };
  }

  _handleClick() {
    
  }
}

export { BreezeRouter as default };
//# sourceMappingURL=BreezeRouter.js.map

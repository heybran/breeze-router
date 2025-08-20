# Breeze Router

A lightweight, zero-dependency client-side router for single page applications (SPAs).

**Note: This project is not production ready and is still in development.**

## Installation

To use this router in your project, install the router using npm:

### 1. Through NPM
```bash
npm install breeze-router
```

### 2. Through CDN link
```javascript
<script type="module">
	import BreezeRouter from "https://unpkg.com/breeze-router@0.3.0/dist/BreezeRouter.min.js";
</script>
```

## Usage

To use the router in your application, you need to import `BreezeRouter` and define routes and handlers using the `Router` class:

```javascript
// NPM.
import BeezeRouter from "breeze-router";

// CDN.
import BreezeRouter from "https://unpkg.com/breeze-router@0.3.0/dist/BreezeRouter.min.js";

// Create a new `BreezeRouter` instance.
const ROUTER = new BreezeRouter();

// Define routes using the `add()` method.
ROUTER.add("/", async () => {
  // Handle the root route
});

ROUTER.add("/about", async ({ route, params }) => {
  // Handle the about route.
  // route.path equals to current route with a trailing splash, e.g.: /about/
});

ROUTER.add("/users/:userId", async ({ route, params }) => {
  // Handle the users route with a dynamic parameter :userId
  const userId = params.userId;
});

ROUTER.add("/users/:username/posts/:postId", async ({ route, params }) => {
  // Handle the posts route with a dynamic parameter :username and :userId
  const { username, postId } = params;
});

// Call the `start` method to start the router.
ROUTER.start();
```

## Util functions

### `toggleParam(this, 1)`

```html
<input
  type="checkbox"
  name="freelance"
  onclick="window.ROUTER.toggleParam(this, 1)"
/>
```

If checked, then it will append search params to url like this: `localhost/users?freelance=1`, if you click checkbox again, it will remove that search param from url.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

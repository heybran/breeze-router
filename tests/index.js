// @ts-check
import BreezeRouter from "../src/index.js";

const renderPage = async (path) => {
  const html = `./pages/${path.replaceAll("/", "")}.html`;
  const response = await fetch(html);
  const data = await response.text();
  document.querySelector("#root").innerHTML = data;
  document.title = "About Us";
};

// Initialize the router
const ROUTER = new BreezeRouter();

ROUTER.add("/", async ({ route, params }) => {
  console.log({ route, params });
  await renderPage("/home");
  console.log("home page rendered");
});

ROUTER.add("/brandon", ({ route, params }) => {
  console.log({ route, params });
  ROUTER.redirect("/about");
});

ROUTER.add("/about", async ({ route, params }) => {
  console.log({ route, params });
  await renderPage(route.path);
  console.log(`${route.path} page rendered`);
});

ROUTER.add("/services", async ({ route, params }) => {
  console.log({ route, params });
  await renderPage(route.path);
  console.log(`${route.path} page rendered`);
});

ROUTER.add("/contact", async ({ route, params }) => {
  console.log({ route, params });
  await renderPage(route.path);
  console.log(`${route.path} page rendered`);
});

ROUTER.add("/users/:id", async ({ route, params }) => {
  console.log({ route, params });
});

ROUTER.add("/users/:username/posts/:postId", async ({ route, params }) => {
  console.log({ route, params });
});

ROUTER.add("404", async ({ route, params }) => {
  console.log({ route, params });
  await renderPage(route.path);
  console.log(`${route.path} page rendered`);
});

ROUTER.start();
window.ROUTER = ROUTER;

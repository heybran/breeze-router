import BreezeRouter from "@heybran/breeze-spa-router";

const output = document.createElement('output');
document.body.append(output);

// Initialize the router
window.ROUTER = new BreezeRouter(document.querySelector('#app'));

ROUTER.add('/', async () => {
  output.textContent = 'Home';
});

ROUTER.add('/users/:id', async ({ route, params }) => {
  output.textContent = `
    ${JSON.stringify({ route} , null, 2)}
    ${JSON.stringify({ params }, null, 2)}
  `;
  console.log({ route, params });
});

ROUTER.add('/users/:username/posts/:postId', async ({ route, params }) => {
  output.textContent = `
    ${JSON.stringify({ route} , null, 2)}
    ${JSON.stringify({ params }, null, 2)}
  `;
  console.log({ route, params });
});

ROUTER.init();
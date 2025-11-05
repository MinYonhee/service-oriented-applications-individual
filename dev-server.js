import { app } from './api/index.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Dev server listening on http://localhost:${port}`);
});

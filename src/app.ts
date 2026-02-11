import { Hono } from 'hono'
import groups from "./routes/groups.js";
import vinyls from "./routes/vinyls.js";
import auth from "./routes/auth.js";

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', auth);
app.route('/groups', groups);
app.route('/vinyls', vinyls);

export default app

import path from 'path';
import cors from 'cors';

function globalMiddlewareHandler(app, express) {
  const dirname = path.resolve();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(dirname + '/public'));
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
    })
  );
}

export default globalMiddlewareHandler;

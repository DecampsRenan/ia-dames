import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';

import BoardRouter from './routes/BoardRouter';

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(helmet());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
  
  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res) => {
      res.send({ message: 'Hello World!' });
    });

    this.express.use('/', router);
    this.express.use('/board', BoardRouter);
  }
}

export default new App().express;

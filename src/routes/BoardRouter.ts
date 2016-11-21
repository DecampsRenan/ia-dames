import { Router, Request, Response, NextFunction } from 'express';

export class BoardRouter {

  router: Router;

  /**
   * Initialize the BoardRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.getAll);
  }

  getAll(req: Request,
         res: Response,
         next: NextFunction) {
    res.send({
      board: [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      ]
    });
  }
}

const boardRouter = new BoardRouter();
boardRouter.init();

export default boardRouter.router;

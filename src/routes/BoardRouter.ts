import { Router, Request, Response, NextFunction } from 'express';

import {IAService} from '../services/IAService';

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
    this.router.route('/')
      .get(this.getAll);
  }

  getAll(req: Request, res: Response) {
    let iaService = new IAService();
    // On reçoit ici un tableau de jeu,
    let score = iaService.score([
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ],
      [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
      [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ],
      [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
    ]);

    console.log(score);
    
    res.send({
      score,      
      board: [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ],
        [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
        [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ],
        [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
      ]
    });
  }
}

const boardRouter = new BoardRouter();
boardRouter.init();

export default boardRouter.router;

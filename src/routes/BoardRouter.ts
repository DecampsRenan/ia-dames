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
    let iaService = new IAService(3);
    let iaService2 = new IAService(1);
    console.log(iaService.getNbPiece(iaService.getBoard()));

    // On reçoit ici un tableau de jeu,
    let score = iaService.score(iaService.getBoard());
    console.log(score);

    iaService.setActions();
    let graph = iaService.getGraph();
    console.log("BOARD: ")
    console.log(iaService.getBoard());

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
      ],
      graph: graph
    });
  }
}

const boardRouter = new BoardRouter();
boardRouter.init();

export default boardRouter.router;

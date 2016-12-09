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
    let iaService = new IAService(1, true);
    let iaService2 = new IAService(3, true);

    let board = iaService.getBoard();

    while(iaService.getNbPiece(board) > 0 || iaService2.getNbPiece(board) > 0) {
      iaService.setBoard(board);
      iaService.buildGraph();
      board = iaService.takeAdecision()['board'];

      console.log("WHITE TURN");
      console.log(board);

      iaService2.setBoard(board);
      iaService2.buildGraph();
      board = iaService2.takeAdecision()['board'];

      console.log("BLACK TURN");
      console.log(board);
    }

    let score = iaService.score(board);

    res.send({
      score,
      board: board
    });
  }
}

const boardRouter = new BoardRouter();
boardRouter.init();

export default boardRouter.router;

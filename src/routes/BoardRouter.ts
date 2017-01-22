import { Router, Request, Response } from 'express';

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

  // Test function : Local Battle
  getAll(req: Request, res: Response) {
    let iaService = new IAService(1, false);
    let iaService2 = new IAService(3, false);

    let board = iaService.getBoard();

    while(iaService.getNbPiece(board) > 0 && iaService2.getNbPiece(board) > 0) {
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

      console.log("WHITE PAWN: "+iaService.getNbPiece(board));
      console.log("Black PAWN: "+iaService2.getNbPiece(board));
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

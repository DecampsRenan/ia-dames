
enum Type {
  EMPTY = 0,
  WHITE_PAWN = 1,
  WHITE_QUEEN = 2,
  BLACK_PAWN = 3,
  BLACK_QUEEN = 4
}

export class IAService {

  constructor() {

  }

  /**
   * Calcule le score d'un état passé en paramètre.
   */
  score(board: [[number]]): number {
    return board.reduce( (score, row) => {
      return score += row.reduce( (value, piece) => {
        switch(piece) {

          case Type.WHITE_PAWN:
          case Type.BLACK_PAWN:
            return value + 1;
          
          case Type.WHITE_QUEEN:
          case Type.BLACK_QUEEN:
            return value + 2;
          
          default:
            return value + 0;
        }
      }, 0);
    }, 0);
  }

  buildTree(depth: number) {

  }
}

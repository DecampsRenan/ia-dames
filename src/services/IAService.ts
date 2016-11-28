import {isUndefined} from 'util';

enum Type {
    EMPTY = 0,
    WHITE_PAWN = 1,
    WHITE_QUEEN = 2,
    BLACK_PAWN = 3,
    BLACK_QUEEN = 4
}

export class IAService {
    private debug = false;
    private color;
    private board: [[number]];
    private graph = [];

    constructor(color, debug) {
        this.debug = debug;
        this.color = color;

        this.board = [
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0, 3 ],
            [ 3, 0, 3, 0, 3, 0, 3, 0, 3, 0 ],
            [ 0, 3, 0, 3, 0, 3, 0, 3, 0, 3 ],
            [ 3, 0, 3, 0, 3, 0, 3, 0, 3, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ],
            [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
            [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ],
            [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
        ];
    }

    // return state of board
    getBoard() : [[number]] {
        return this.board;
    }

    // return number of piece
    getNbPiece(board: [[number]]) : number {
        return board.reduce( (nb, row) => {
            return nb += row.reduce( (value, piece) => {
                if (this.color == 3) {
                    switch(piece) {
                        case Type.BLACK_PAWN:
                            return value + 1;

                        case Type.BLACK_QUEEN:
                            return value + 1;

                        default:
                            return value + 0;
                    }
                } else {
                    switch(piece) {
                        case Type.WHITE_PAWN:
                            return value + 1;

                        case Type.WHITE_QUEEN:
                            return value + 1;

                        default:
                            return value + 0;
                    }
                }
            }, 0);
        }, 0);
    }

    // change the actual state board
    setBoard(board:[[number]]) {
        this.board = this.copy(board);
    }

    // return list of possible actions
    getGraph() {
        return this.graph;
    }

    // list of possible actions (board)
    buildGraph() {
        let board = this.copy(this.board);
        let i=0;
        for(let row of board) {
            let j=0;

            for (let piece of row) {
                if (piece == this.color) {
                    if (this.color == 3) {
                        if (i + 1 < 10 && (j + 1 < 10 || j-1 >= 0)) this.movePiece(board, piece, i, j, 'top');
                    } else {
                        if (i - 1 >= 0 && (j + 1 < 10 || j-1 >= 0)) this.movePiece(board, piece, i, j, 'bottom');
                    }
                }
                j++;
            }
            i++;
        }
    }

    // listing of all possible movements of this piece
    movePiece(board: [[number]], piece:number, i:number, j:number, direction:string) {
        let boardNext = this.copy(board);

        if(piece == this.color) {
            // PAWN
            let k = -1;
            if(direction == 'top') k = 1;

            if ((i + k < 10 || i + k >= 0) && j + 1 < 10) {

                // right direction
                let next = boardNext[i + k][j + 1];
                if (next == 0) {
                    if ((i+k == 0 && piece == 1) || (i+k == 9 && piece == 3)) piece++; // PAWN => QUEEN
                    boardNext[i + k][j + 1] = piece;
                    boardNext[i][j] = 0;
                    this.addBoard(boardNext);
                    boardNext = this.copy(board);
                } else if (next == this.color-(k*2) || next == this.color-(k*2-1)) {
                    this.attack(boardNext, i, j, direction);
                }
            }

            if ((i + k < 10 || i + k >= 0) && j - 1 >= 0) {

                // left direction
                let next2 = boardNext[i + k][j - 1];
                if (next2 == 0) {
                    if ((i+k == 0 && piece == 1) || (i+k == 9 && piece == 3)) piece++; // PAWN => QUEEN
                    boardNext[i + k][j - 1] = piece;
                    boardNext[i][j] = 0;
                    this.addBoard(boardNext);
                } else if (next2 == this.color-(k*2) || next2 == this.color-(k*2-1)) {
                    this.attack(boardNext, i, j, direction);
                }
            }
        } else if (piece == this.color+1) {
            // QUEEN
            
        }
    }

    // attack method (recursive) with PAWN
    attack(board: [[number]], i:number, j:number, direction:string) : boolean {
        let boardNext = this.copy(board);

        let k = -1;
        if (direction == 'top') k = 1;


        let next = -1;
        if ((i+k < 10 || i-k >= 0) && j+1 < 10) next = boardNext[i+k][j+1];
        let next2 = -1;
        if ((i+k < 10 || i-k >= 0) && j-1 >= 0) next2 = boardNext[i+k][j-1];

        let piece = boardNext[i][j];
        if ( next > -1 || next2 > -1) {

            // right direction
            if ((next == this.color-(k*2) || next == this.color-(k*2-1)) && ((i+(k*2) < 10 || i+(k*2) >= 0) && j+2 < 10) ) {
                if (boardNext[i + (k*2)][j+2] == 0) {
                    if ((i+(k*2) == 0 && piece == 1) || (i+(k*2) == 9 && piece == 3)) piece++; // PAWN => QUEEN
                    boardNext[i + (k*2)][j + 2] = piece;
                    boardNext[i][j] = 0;
                    boardNext[i + k][j + 1] = 0;

                    if(!this.attack(boardNext, i + (k*2), j + 2, direction)) {
                        this.addBoard(boardNext);
                    }
                    boardNext = this.copy(board);
                    return true;
                }
            }

            // left direction
            if ((next2 == this.color-(k*2) || next2 == this.color-(k*2-1)) && ((i+(k*2) < 10 || i+(k*2) >= 0) && j-2 >= 0)) {
                if (boardNext[i + (k*2)][j - 2] == 0) {
                    if ((i+(k*2) == 0 && piece == 1) || (i+(k*2) == 9 && piece == 3)) piece++; // PAWN => QUEEN
                    boardNext[i + (k*2)][j - 2] = piece;
                    boardNext[i][j] = 0;
                    boardNext[i + k][j - 1] = 0;

                    if(!this.attack(boardNext, i + (k*2), j - 2, direction)) {
                        this.addBoard(boardNext);
                    }
                    return true;
                }
            }
        }

        return false;
    }

    // method to push a board in graph
    addBoard(board: [[number]]) {
        if (this.debug) console.log(board);
        this.graph.push({score: this.score(board),board: board});
    }

    /**
     * Calcule le score d'un état passé en paramètre.
     * TODO: ici la matrice B donnant un poid aux cases du board
     * n'est pas prise en compte. Il faut l'implémenter.
     */
    score(board: [[number]]): number {
        let whiteScore = 0, blackScore = 0;
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

// choice the board in the graph who have the best score
    takeAdecision() {
        return this.graph.reduce( (board, row) => {
            if (board == 0 || row['score'] > board['score']) {
                board = row;
            }
            return board;
        }, 0);
    }

// clone value of object without references
    copy(o) {
        let output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.copy(v) : v;
        }
        return output;
    }
}

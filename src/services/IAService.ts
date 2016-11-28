import {isUndefined} from 'util';

enum Type {
    EMPTY = 0,
    WHITE_PAWN = 1,
    WHITE_QUEEN = 2,
    BLACK_PAWN = 3,
    BLACK_QUEEN = 4
}

export class IAService {
    private color;
    private board: [[number]];
    private graph = [];

    constructor(color) {
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
                    let boardNext = this.copy(this.board);

                    if (this.color == 3 || this.color == 4) {
                        if(piece == Type.BLACK_PAWN) {

                            if (i + 1 < 10 && j + 1 < 10) {

                                // right direction
                                let next = boardNext[i + 1][j + 1];
                                if (next == 0) {
                                    boardNext[i + 1][j + 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addBoard(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next == 1 || next == 2) {
                                    this.attack(boardNext, i, j);
                                }
                            }

                            if (i + 1 < 10 && j - 1 >= 0) {

                                // left direction
                                let next2 = boardNext[i + 1][j - 1];
                                if (next2 == 0) {
                                    boardNext[i + 1][j - 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addBoard(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next2 == 1 || next2 == 2) {
                                    this.attack(boardNext, i, j);
                                }
                            }
                        }
                    } else {
                        if(piece == Type.WHITE_PAWN) {

                            if (i - 1 >= 0 && j + 1 < 10) {

                                // right direction
                                let next = boardNext[i - 1][j + 1];
                                if (next == 0) {
                                    boardNext[i - 1][j + 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addBoard(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next == 1 || next == 2) {
                                    this.attack(boardNext, i, j);
                                }
                            }

                            if (i - 1 >= 0 && j - 1 >= 0) {

                                // left direction
                                let next2 = boardNext[i - 1][j - 1];
                                if (next2 == 0) {
                                    boardNext[i - 1][j - 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addBoard(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next2 == 1 || next2 == 2) {
                                    this.attack(boardNext, i, j);
                                }
                            }
                        }
                    }
                }
                j++;
            }
            i++;
        }
    }

    // method to push a board in graph
    addBoard(board: [[number]]) {
        console.log(board);
        this.graph.push({score: this.score(board),board: board});
    }

    // attack method (recursive)
    attack(board: [[number]], i:number, j:number) {
        let boardNext = this.copy(board);

        if (this.color == 3) {

            let next = -1;
            if (i+1 < 10 && j+1 < 10) next = boardNext[i+1][j+1];
            let next2 = -1;
            if (i+1 < 10 && j-1 >= 0) next2 = boardNext[i+1][j-1];

            let piece = boardNext[i][j];
            if ( next > -1 || next2 > -1) {

                // right direction
                if ((next == 1 || next == 2) && (i+2 < 10 && j+2 < 10) ) {
                    if (boardNext[i+2][j+2] == 0) {
                        boardNext[i + 2][j + 2] = piece;
                        boardNext[i][j] = 0;
                        boardNext[i + 1][j + 1] = 0;
                        this.addBoard(boardNext);
                        this.attack(boardNext, i + 2, j + 2);
                        boardNext = this.copy(board);
                    }
                }

                // left direction
                if ((next2 == 1 || next2 == 2) && (i+2 < 10 && j-2 >= 0)) {
                    if (boardNext[i+2][j-2] == 0) {
                        boardNext[i + 2][j - 2] = piece;
                        boardNext[i][j] = 0;
                        boardNext[i + 1][j - 1] = 0;
                        this.addBoard(boardNext);
                        this.attack(boardNext, i + 2, j - 2);
                        boardNext = this.copy(board);
                    }
                }
            }
        } else {

            let next = -1;
            if (i-1 < 10 && j+1 < 10) next = boardNext[i-1][j+1];
            let next2 = -1;
            if (i-1 < 10 && j-1 >= 0) next2 = boardNext[i-1][j-1];

            let piece = boardNext[i][j];
            if ( next > -1 || next2 > -1) {

                // right direction
                if ((next == 1 || next == 2) && (i-2 < 10 && j+2 < 10) ) {
                    if (boardNext[i-2][j+2] == 0) {
                        boardNext[i - 2][j + 2] = piece;
                        boardNext[i][j] = 0;
                        boardNext[i - 1][j + 1] = 0;
                        this.addBoard(boardNext);
                        this.attack(boardNext, i - 2, j + 2);
                        boardNext = this.copy(board);
                    }
                }

                // left direction
                if ((next2 == 1 || next2 == 2) && (i-2 < 10 && j-2 >= 0)) {
                    if (boardNext[i-2][j-2] == 0) {
                        boardNext[i - 2][j - 2] = piece;
                        boardNext[i][j] = 0;
                        boardNext[i - 1][j - 1] = 0;
                        this.addBoard(boardNext);
                        this.attack(boardNext, i - 2, j - 2);
                        boardNext = this.copy(board);
                    }
                }
            }
        }
    }

    // Calcule le score d'un état passé en paramètre
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

/**
 * 
 * 
 * 
 * TODO: essayer la méthode Array.prototype.slice(0) pour
 * la création d'un nouvel Array
 * 
 */

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
    private actions = [];
    private weightedBoard: [[number]];

    constructor(color) {
        this.color = color;

        this.weightedBoard = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]

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

    getBoard() : [[number]] {
        return this.board;
    }

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

    setBoard(board:[[number]]) {
        this.board = this.copy(this.board);
    }

    getGraph() {
        return this.actions;
    }

    // list of possible actions
    setActions() {
        let board = this.copy(this.board);
        let i=0;
        for(var row of board) {
            let j=0;

            for (let piece of row) {
                if (piece == this.color) {
                    let boardNext = new this.constructor(this.color).getBoard();

                    if (this.color == 3 || this.color == 4) {
                        if(piece == Type.BLACK_PAWN) {

                            if (i + 1 < 10 && j + 1 < 10) {

                                // right direction
                                let next = boardNext[i + 1][j + 1];
                                if (next == 0) {
                                    boardNext[i + 1][j + 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addAction(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next == 1 || next == 2) {
                                    this.chainAction(boardNext, i, j);
                                }
                            }

                            if (i + 1 < 10 && j - 1 >= 0) {

                                // left direction
                                let next2 = boardNext[i + 1][j - 1];
                                if (next2 == 0) {
                                    boardNext[i + 1][j - 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addAction(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next2 == 1 || next2 == 2) {
                                    this.chainAction(boardNext, i, j);
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
                                    this.addAction(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next == 1 || next == 2) {
                                    this.chainAction(boardNext, i, j);
                                }
                            }

                            if (i - 1 >= 0 && j - 1 >= 0) {

                                // left direction
                                let next2 = boardNext[i - 1][j - 1];
                                if (next2 == 0) {
                                    boardNext[i - 1][j - 1] = piece;
                                    boardNext[i][j] = 0;
                                    this.addAction(boardNext);
                                    boardNext = this.copy(this.board);
                                } else if (next2 == 1 || next2 == 2) {
                                    this.chainAction(boardNext, i, j);
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

    addAction(board: [[number]]) {
        console.log(board);
        this.actions.push({score: this.score(board),board});
    }

    chainAction(board: [[number]], i:number, j:number) {
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
                        this.addAction(boardNext);
                        this.chainAction(boardNext, i + 2, j + 2);
                        boardNext = this.copy(board);
                    }
                }

                // left direction
                if ((next2 == 1 || next2 == 2) && (i+2 < 10 && j-2 >= 0)) {
                    if (boardNext[i+2][j-2] == 0) {
                        boardNext[i + 2][j - 2] = piece;
                        boardNext[i][j] = 0;
                        boardNext[i + 1][j - 1] = 0;
                        this.addAction(boardNext);
                        this.chainAction(boardNext, i + 2, j - 2);
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
                        this.addAction(boardNext);
                        this.chainAction(boardNext, i - 2, j + 2);
                        boardNext = this.copy(board);
                    }
                }

                // left direction
                if ((next2 == 1 || next2 == 2) && (i-2 < 10 && j-2 >= 0)) {
                    if (boardNext[i-2][j-2] == 0) {
                        boardNext[i - 2][j - 2] = piece;
                        boardNext[i][j] = 0;
                        boardNext[i - 1][j - 1] = 0;
                        this.addAction(boardNext);
                        this.chainAction(boardNext, i - 2, j - 2);
                        boardNext = this.copy(board);
                    }
                }
            }
        }
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

    buildTree(depth: number) {
        
    }

    copy(o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.copy(v) : v;
        }
        return output;
    }
}

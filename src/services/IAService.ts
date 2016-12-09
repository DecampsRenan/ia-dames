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
            let attack:boolean=false;

            let next = -1;
            if ((i + k < 10 || i + k >= 0) && j + 1 < 10) {
                next = boardNext[i + k][j + 1];
            }
            let next2 = -1;
            if ((i + k < 10 || i + k >= 0) && j - 1 >= 0) {
                let next2 = boardNext[i + k][j - 1];
            }

            // right attack
            if (next == this.color-(k*2) || next == this.color-(k*2-1)) {
                this.attack(boardNext, i, j, direction);
                attack=true;
            }
            // left attack
            if (next2 == this.color-(k*2) || next2 == this.color-(k*2-1)) {
                this.attack(boardNext, i, j, direction);
                attack=true;
            }

            // right direction
            if (next == 0 && !attack) {
                if ((i+k == 0 && piece == 1) || (i+k == 9 && piece == 3)) piece++; // PAWN => QUEEN
                boardNext[i + k][j + 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
                boardNext = this.copy(board);
            }

            // left direction
            if (next2 == 0 && !attack) {
                if ((i+k == 0 && piece == 1) || (i+k == 9 && piece == 3)) piece++; // PAWN => QUEEN
                boardNext[i + k][j - 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
            }

        } else if (piece == 4 || piece == 2) {
            // QUEEN
            let nextRT = boardNext[i + 1][j + 1]; //right-top
            let nextLT = boardNext[i + 1][j - 1];//left-top
            let nextRB = boardNext[i - 1][j + 1];//right-bottom
            let nextLB = boardNext[i - 1][j - 1];//left-bottom

            if (   ((this.color == 3 && (nextRT == 1 || nextRT == 2)) || (this.color == 1 && (nextRT == 3 || nextRT == 4)))
                || ((this.color == 3 && (nextLT == 1 || nextLT == 2)) || (this.color == 1 && (nextLT == 3 || nextLT == 4)))
                || ((this.color == 3 && (nextRB == 1 || nextRB == 2)) || (this.color == 1 && (nextRB == 3 || nextRB == 4)))
                || ((this.color == 3 && (nextLB == 1 || nextLB == 2)) || (this.color == 1 && (nextLB == 3 || nextLB == 4))) ) {
                this.attackQueen(boardNext, i, j);
            } else {
                this.queenMove(boardNext, i, j, null);
            }
        }
    }

    queenMove(board: [[number]], i:number, j:number, direction) {
        let boardNext = this.copy(board);
        let piece = boardNext[i][j];


        //right-top
        if (i + 1 < 10 && j + 1 < 10 && (direction == "RT" || direction == null)) {

            let next = boardNext[i + 1][j + 1];
            if (next == 0) {
                boardNext[i + 1][j + 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
                this.queenMove(boardNext, i+1, j+1, "RT");
                boardNext = this.copy(board);
            }
        }

        //left-top
        if (i + 1 < 10 && j - 1 >= 0 && (direction == "LT" || direction == null)) {

            let next = boardNext[i + 1][j - 1];
            if (next == 0) {
                boardNext[i + 1][j - 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
                this.queenMove(boardNext, i+1, j-1, "LT");
                boardNext = this.copy(board);
            }
        }

        //right-bottom
        if (i - 1 >= 0 && j + 1 < 10 && (direction == "RB" || direction == null)) {

            let next = boardNext[i - 1][j + 1];
            if (next == 0) {
                boardNext[i - 1][j + 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
                this.queenMove(boardNext, i-1, j+1, "RB");
                boardNext = this.copy(board);
            }
        }

        //left-bottom
        if (i - 1 >= 0 && j - 1 >= 0 && (direction == "LB" || direction == null)) {

            let next = boardNext[i - 1][j - 1];
            if (next == 0) {
                boardNext[i - 1][j - 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
                this.queenMove(boardNext, i-1, j-1, "LB");
            }
        }
    }

    attackQueen(board: [[number]], i:number, j:number) : boolean {
        let boardNext = this.copy(board);
        let piece = boardNext[i][j];
        let whenAttack = false;

        //right-top
        if (i + 2 < 10 && j + 2 < 10) {

            let next = boardNext[i + 1][j + 1];
            if (((this.color == 3 && (next == 1 || next == 2)) || (this.color == 1 && (next == 3 || next == 4)))
                && boardNext[i + 2][j + 2] == 0) {

                boardNext[i + 2][j + 2] = piece;
                boardNext[i+1][j+1] = 0;
                boardNext[i][j] = 0;
                if(!this.attackQueen(boardNext, i+2, j+2)) {
                    this.addBoard(boardNext);
                }
                boardNext = this.copy(board);
                whenAttack = true;
            }
        }

        //left-top
        if (i + 2 < 10 && j - 2 >= 0) {

            let next = boardNext[i + 1][j - 1];
            if (((this.color == 3 && (next == 1 || next == 2)) || (this.color == 1 && (next == 3 || next == 4)))
                && boardNext[i + 2][j - 2] == 0) {

                boardNext[i + 2][j - 2] = piece;
                boardNext[i+1][j-1] = 0;
                boardNext[i][j] = 0;
                if(!this.attackQueen(boardNext, i+2, j-2)) {
                    this.addBoard(boardNext);
                }
                boardNext = this.copy(board);
                whenAttack = true;
            }
        }


        //right-bottom
        if (i - 2 < 10 && j + 2 >= 0) {

            let next = boardNext[i - 1][j + 1];
            if (((this.color == 3 && (next == 1 || next == 2)) || (this.color == 1 && (next == 3 || next == 4)))
                && boardNext[i - 2][j + 2] == 0) {

                boardNext[i - 2][j + 2] = piece;
                boardNext[i-1][j+1] = 0;
                boardNext[i][j] = 0;
                if(!this.attackQueen(boardNext, i-2, j+2)) {
                    this.addBoard(boardNext);
                }
                boardNext = this.copy(board);
                whenAttack = true;
            }
        }

        //left-bottom
        if (i - 2 < 10 && j - 2 >= 0) {

            let next = boardNext[i - 1][j - 1];
            if (((this.color == 3 && (next == 1 || next == 2)) || (this.color == 1 && (next == 3 || next == 4)))
                && boardNext[i - 2][j - 2] == 0) {

                boardNext[i - 2][j - 2] = piece;
                boardNext[i-1][j-1] = 0;
                boardNext[i][j] = 0;
                if(!this.attackQueen(boardNext, i-2, j-2)) {
                    this.addBoard(boardNext);
                }
                whenAttack = true;
            }
        }

        if (whenAttack) return true;
        return false;
    }

    // attack method (recursive) with PAWN
    attack(board: [[number]], i:number, j:number, direction:string) : boolean {
        let boardNext = this.copy(board);
        let whenAttack = false;

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
                    whenAttack = true;
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
                    whenAttack = true;
                }
            }

            if(whenAttack) return true;
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

import {isUndefined} from 'util';

enum Type {
    EMPTY = 0,
    WHITE_PAWN = 1,
    WHITE_QUEEN = 2,
    BLACK_PAWN = 3,
    BLACK_QUEEN = 4
}

export class IAService {
    private INFINITY = Number.MAX_SAFE_INTEGER;
    private debug = false;
    private color:number;
    private board: [[number]];
    private graph = [];
    private cluster;
    private attackRequired:boolean = false;
    private depth = 0; // profondeur

    constructor(color, depth, debug) {
        this.debug = debug;
        this.color = color;
        this.depth = depth;

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
        this.graph = [];
        this.attackRequired = false;
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
                if (this.color == 3 && (piece == 3 || piece == 4)) {
                    this.movePiece(board, piece, i, j, 'top');
                } else if (this.color == 1 && (piece == 1 || piece == 2)) {
                    this.movePiece(board, piece, i, j, 'bottom');
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

            let next = -1;
            if (((k == -1 && i+k >= 0) || (k == 1 && i+k < 10)) && j + 1 < 10) {
                next = boardNext[i + k][j + 1];
            }
            let next2 = -1;
            if (((k == -1 && i+k >= 0) || (k == 1 && i+k < 10)) && j - 1 >= 0) {
                next2 = boardNext[i + k][j - 1];
            }

            // right attack
            if (next > -1 && (next == this.color-(k*2) || next == this.color-(k*2-1))) {
                if ((((k == 1 && i+(k*2) < 10) || (k == -1 && i+(k*2) >= 0)) && j+2 < 10) && boardNext[i + (k*2)][j+2] == 0) {
                    this.attack(boardNext, i, j, direction);
                    // score += 1 pour chaque pion pris
                }
            }
            // left attack
            if (next2 > -1 && (next2 == this.color-(k*2) || next2 == this.color-(k*2-1))) {
                if ((((k == 1 && i+(k*2) < 10) || (k == -1 && i+(k*2) >= 0)) && j-2 >= 0) && boardNext[i + (k*2)][j-2] == 0) {
                    this.attack(boardNext, i, j, direction);
                    // score += 1 pour chaque pion pris
                }
            }

            // right direction
            if (next == 0 && !this.attackRequired) {
                if ((i+k == 0 && piece == 1) || (i+k == 9 && piece == 3)) piece++; // PAWN => QUEEN
                // score += 1 pour la promotion du pion en reine
                boardNext[i + k][j + 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
                boardNext = this.copy(board);
            }

            // left direction
            if (next2 == 0 && !this.attackRequired) {
                if ((i+k == 0 && piece == 1) || (i+k == 9 && piece == 3)) piece++; // PAWN => QUEEN
                // score += 1 pour la promotion du pion en reine
                boardNext[i + k][j - 1] = piece;
                boardNext[i][j] = 0;
                this.addBoard(boardNext);
            }
        } else if ((this.color == 1 && piece == 2) || (this.color == 3 && piece == 4)) {

            // QUEEN
            let nextRT = -1;
            if (i+1 < 10 && j+1 < 10) {
                nextRT = boardNext[i + 1][j + 1]; //right-top
            }
            let nextLT = -1;
            if (i+1 < 10 && j-1 >= 0) {
                nextLT = boardNext[i + 1][j - 1]; //left-top
            }
            let nextRB = -1;
            if (i-1 >= 0 && j+1 < 10) {
                nextRB = boardNext[i - 1][j + 1]; //right-bottom
            }
            let nextLB = -1;
            if (i-1 >= 0 && j-1 >= 0) {
                nextLB = boardNext[i - 1][j - 1]; //left-bottom
            }

            if (   (nextRT > -1 && ((this.color == 3 && (nextRT == 1 || nextRT == 2)) || (this.color == 1 && (nextRT == 3 || nextRT == 4))))
                || (nextLT > -1 && ((this.color == 3 && (nextLT == 1 || nextLT == 2)) || (this.color == 1 && (nextLT == 3 || nextLT == 4))))
                || (nextRB > -1 && ((this.color == 3 && (nextRB == 1 || nextRB == 2)) || (this.color == 1 && (nextRB == 3 || nextRB == 4))))
                || (nextLB > -1 && ((this.color == 3 && (nextLB == 1 || nextLB == 2)) || (this.color == 1 && (nextLB == 3 || nextLB == 4)))) ) {
                this.attackQueen(boardNext, i, j);
                // ici on incrémente le score du nombre de pions qu'elle peut prendre
            } else {
                if (!this.attackRequired) {
                    this.queenMove(boardNext, i, j, null);
                    // ici on incrémente de  +2 (mouvement de la reine certainement plus intéressant que celui des pions)
                }
            }
        }
    }


    // attack method (recursive) with PAWN
    attack(board: [[number]], i:number, j:number, direction:string) : boolean {
        let boardNext = this.copy(board);
        let whenAttack = false;

        let k = -1;
        if (direction == 'top') k = 1;

        let next = -1;
        if (((k == -1 && i+k >= 0) || (k == 1 && i+k < 10)) && j+1 < 10) next = boardNext[i+k][j+1];
        let next2 = -1;
        if (((k == -1 && i+k >= 0) || (k == 1 && i+k < 10)) && j-1 >= 0) next2 = boardNext[i+k][j-1];

        let piece = boardNext[i][j];
        if ( next > -1 || next2 > -1) {

            // right direction
            if (next > -1 && (next == this.color-(k*2) || next == this.color-(k*2-1)) && (((k == 1 && i+(k*2) < 10) || (k == -1 && i+(k*2) >= 0)) && j+2 < 10) ) {
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
                    this.attackRequired = true;
                }
            }

            // left direction
            if (next2 > -1 && (next2 == this.color-(k*2) || next2 == this.color-(k*2-1)) && (((k == 1 && i+(k*2) < 10) || (k == -1 && i+(k*2) >= 0)) && j-2 >= 0)) {
                if (boardNext[i + (k*2)][j - 2] == 0) {
                    if ((i+(k*2) == 0 && piece == 1) || (i+(k*2) == 9 && piece == 3)) piece++; // PAWN => QUEEN
                    boardNext[i + (k*2)][j - 2] = piece;
                    boardNext[i][j] = 0;
                    boardNext[i + k][j - 1] = 0;

                    if(!this.attack(boardNext, i + (k*2), j - 2, direction)) {
                        this.addBoard(boardNext);
                    }
                    whenAttack = true;
                    this.attackRequired = true;
                }
            }

            if(whenAttack) return true;
        }

        return false;
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
                this.attackRequired = true;
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
                this.attackRequired = true;
            }
        }


        //right-bottom
        if (i - 2 >= 0 && j + 2 < 10) {

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
                this.attackRequired = true;
            }
        }

        //left-bottom
        if (i - 2 >= 0 && j - 2 >= 0) {

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
                this.attackRequired = true;
            }
        }

        if (whenAttack) return true;
        return false;
    }

    // method to push a board in graph
    addBoard(board: [[number]]) {
        if (this.debug) console.log(board);

        /**
         * Profondeur du graphe : nbDepth
         * TODO : BUG lors de graphe avec une profondeur > 1
          */
        let nbDepth = 0;
        if (this.depth < nbDepth) {
            let iaService = null;
            if (this.color == 1) {
                iaService = new IAService(3, ++this.depth, false);
            } else {
                iaService = new IAService(1, ++this.depth, false);
            }

            iaService.setBoard(board);
            iaService.buildGraph();

            this.graph.push({score: this.score(board), board: board, leaf: iaService.getGraph()});
        }
        this.graph.push({score: this.score(board), board: board, leaf: null});
    }

    /**
     * Calcule le score d'un état passé en paramètre.
     * TODO: ici la matrice B donnant un poid aux cases du board
     * n'est pas prise en compte. Il faut l'implémenter.
     */
    score(board: [[number]]): number {
        let whiteScore = 0, blackScore = 0;
        return board.reduce( (score, row, i) => {
            return score += row.reduce( (value, piece, j) => {
                if (piece == Type.WHITE_PAWN)  value += 1;
                if (piece == Type.WHITE_QUEEN) value += 2;

                if (!this._isTakable(piece, board, i, j)) value += 1;
                value += this._canTake(piece, board, i, j);
                if (this._canBecomeQueen(piece, board, i, j)) value += 1;

                return value;
            }, 0);
        }, 0);
    }

    _canBecomeQueen(piece: number, board: [[number]], i: number, j: number): boolean {
        if (piece == Type.BLACK_PAWN) {
            if (i == 1 && (board[i-1][j-1] == Type.EMPTY || board[i-1][j+1] == Type.EMPTY)) return true;
        } else {
            if (i == 8 && (board[i+1][j-1] == Type.EMPTY || board[i+1][j+1] == Type.EMPTY)) return true;
        }
        return false;
    }

    _canTake(piece: number, board: [[number]], i: number, j: number): number {
        let nbTakable: number = 0;
        return this._findBR(piece, board, i, j) + this._findTR(piece, board, i, j);
    }
    _isTakable(piece: number, board: [[number]], i: number, j: number): boolean {
        // A partir du pion, on regarde si un autre pion peu le prendre
        // en diagonale
        return (this._findBR(piece, board, i, j) == 1 ||
        this._findTR(piece, board, i, j) == 1 );
    }
    _findTR(piece: number, board: [[number]], i: number, j: number): number {
        let firstLoop = true;
        let Ylength = board.length;
        let Xlength = board[0].length;
        let maxLength = Math.max(Xlength, Ylength);
        for (let k = i; k <= 2 * (maxLength - 1); ++k) {
            for (let y = Ylength - 1; y >= j; --y) {
                let x = k - (Ylength - y);
                if (x >= 0 && x < Xlength) {
                    if (piece == Type.WHITE_PAWN || piece == Type.WHITE_QUEEN) {
                        if (board[y][x] == Type.BLACK_PAWN && firstLoop ) {
                            firstLoop = false;
                            return 1;
                        }
                    } else {
                        if (board[y][x] == Type.WHITE_PAWN && firstLoop ) {
                            firstLoop = false;
                            return 1;
                        }
                    }
                }
            }
        }
        return 0;
    }
    _findBR(piece: number, board: [[number]], i: number, j: number): number {
        let firstLoop = true;
        let Ylength = board.length;
        let Xlength = board[0].length;
        let maxLength = Math.max(Xlength, Ylength);
        for (let k = i; k <= 2 * (maxLength - 1); ++k) {
            for (let y = Ylength - 1; y >= j; --y) {
                let x = k - y;
                if (x >= 0 && x < Xlength) {
                    if (piece == Type.WHITE_PAWN || piece == Type.WHITE_QUEEN) {
                        if (board[y][x] == Type.BLACK_PAWN && firstLoop ) {
                            firstLoop = false;
                            return 1;
                        }
                    } else {
                        if (board[y][x] == Type.WHITE_PAWN && firstLoop ) {
                            firstLoop = false;
                            return 1;
                        }
                    }
                }
            }
        }
        return 0;
    }

// choice the board in the graph who have the best score
    takeAdecision() {
        if (isUndefined(this.graph[0])) {
            return this.board;
        }
        return this.performAlgo()['board'];

        // méthode classique avec le meilleur score (MAX)
        /*return this.graph.reduce( (board, row) => {
         if (board == 0 || row['score'] > board['score']) {
         board = row;
         }
         return board;
         }, 0);*/
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

    _negamaxAplhaBeta(noeud, alpha, beta, father) {
        /* A < B */
        if (noeud.leaf == null) {
            if (father != null) {
                father.value = noeud.value;
                return father;
            }
            return noeud;
        } else {
            let best = { value :  this.INFINITY * -1};
            for (let child of noeud.leaf) {
                let val = this._negamaxAplhaBeta(child,-beta,-alpha, noeud);
                val.value = val.value  * -1;
                if (val.value > best.value) {
                    best = val;
                    if (best.value > alpha.value) {
                        alpha = best;
                        if (alpha.value >= beta.value) {
                            if (father != null) {
                                father.value = best.value;
                                return father;
                            }
                            return best;
                        }
                    }
                }
            }
            return best;
        }
    }

    performAlgo() {
        this.cluster = require('cluster');
        let noeud = this.getGraph()[0];
        let father = null;
        let alpha = { value : this.INFINITY * -1};
        let beta = { value : this.INFINITY };
        if (noeud.leaf == null) {
            if (father != null) {
                father.value = noeud.value;
                return father;
            }
            return noeud;
        } else {
            let best = { value :  this.INFINITY * -1};

            for (let child of noeud.leaf) {
                if (this.cluster.isMaster) {
                    this.cluster.fork();
                } else {

                    let val = this._negamaxAplhaBeta(child,-beta,-alpha, noeud);
                    val.value = val.value  * -1;
                    if (val.value > best.value) {
                        best = val;
                        if (best.value > alpha.value) {
                            alpha = best;
                            if (alpha.value >= beta.value) {
                                if (father != null) {
                                    father.value = best.value;
                                    return father;
                                }
                                return best;
                            }
                        }
                    }
                }
            }
            return best;
        }

    }
}

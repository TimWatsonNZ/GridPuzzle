//  automated player spec

var Board = require("../board.js");
var Player = require("../automatedPlayer.js");
var Node = require("../node.js");
var Color = require("../color.js");

describe("findMostCommonColorInAdjacentNodes finds the most common color in an array of nodes", () => {
    it("Should return a node with the most common color", () => {
        let nodes = [
            new Node(0, 0, Color.Black),
            new Node(0, 0, Color.Red),
            new Node(0, 0, Color.White),
            new Node(0, 0, Color.Yellow),
            new Node(0, 0, Color.Red),
            new Node(0, 0, Color.Black),
            new Node(0, 0, Color.Black)
        ];

        let player = new Player();
        let mostCommonColor = player.findMostCommonColorInAdjacentNodes(nodes);
        expect(mostCommonColor.color).toBe(Color.Black);
    });
});

describe("Pick move should pick a move that results in the largest change of color", () => {
    it("should pick the most common color adjacent to the connected area.", () => {
        let size = 3;
        let colorCount = 2;

        let board = new Board(size, colorCount);
        let player = new Player();
        player.makeMove(board);
    });
    it(`should result in the adjacent nodes with the picked nodes color adding to the connected area and the connected area nodes changing to the picked nodes color`, () => {
        let size = 3;
        let colorCount = 3;

        let board = new Board(size, colorCount);
        
        /*
            B   B   R
            B   W   B
            B   W   B
        */

        board.boardArray[0][0].color = Color.Black;
        board.boardArray[0][1].color = Color.Black;
        board.boardArray[0][2].color = Color.Red;

        board.boardArray[1][0].color = Color.Black;
        board.boardArray[1][1].color = Color.White;
        board.boardArray[1][2].color = Color.Black;

        board.boardArray[2][0].color = Color.Black;
        board.boardArray[2][1].color = Color.White;
        board.boardArray[2][2].color = Color.Black;

        let player = new Player();
        player.makeMove(board);

        /*
            W   W   R
            W   W   B
            W   W   B
        */

        expect(board.boardArray[0][0].color).toBe(Color.White);
        expect(board.boardArray[0][1].color).toBe(Color.White);
        expect(board.boardArray[0][2].color).toBe(Color.Red);

        expect(board.boardArray[1][0].color).toBe(Color.White);
        expect(board.boardArray[1][1].color).toBe(Color.White);
        expect(board.boardArray[1][2].color).toBe(Color.Black);

        expect(board.boardArray[2][0].color).toBe(Color.White);
        expect(board.boardArray[2][1].color).toBe(Color.White);
        expect(board.boardArray[2][2].color).toBe(Color.Black);
    });
});

describe("Play till complete", () => {
    it("Should complete the board eventually", () => {
        let size = 3;
        let colorCount = 3;

        let board = new Board(size, colorCount);
        let player = new Player();

        player.playTillComplete(board);

        //  Board should all have one color.
        let connectedNodes = board.bfsSearch();
        expect(connectedNodes.length).toBe(9);
    });
});
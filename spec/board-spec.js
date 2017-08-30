//  board-spec

var Board = require("../board.js");
var Node = require("../node.js");
var Colors = require("../color.js");

describe("Board must have a size greater than 1 and at least 1 color", () => {
    it("should generate an empty board.", () => {
       
        let size = 0;
        let colorCount = 1; 
        let board = new Board(size, colorCount);

        expect(board.boardArray.length).toBe(0);

        size = 0;
        colorCount = 1; 
        board = new Board(size, colorCount);

        expect(board.boardArray.length).toBe(0);
    });
});

describe("Board can't have more colors than are available.", () => {
    it("should generate an empty board.", () => {
       
        let size = 0;
        let colorCount = 10; 
        let board = new Board(size, colorCount);

        expect(board.boardArray.length).toBe(0);
    });
});

describe("Board generates the correct size of board.", () => {
    it("should generate an NxN board.", () => {
        let size = 4;
        let colorCount = 1;
        let board = new Board(size, colorCount);

        expect(board.boardArray.length).toBe(size);
        board.boardArray.forEach((rowItem) => {
            expect(rowItem.length).toBe(size);
        });
    });
});

describe("Board.isComplete tests if a board contains all the same color", () => {
    it("should return true if all colours are equal", () => {
        let size = 1;
        let colorCount = 2;

        let board = new Board(size, colorCount);
        expect(board.isComplete()).toBe(true);

        size = 5;
        colorCount = 1;
        board = new Board(size, colorCount);
        expect(board.isComplete()).toBe(true);
    });
});

describe("findNeighbours accepts a node and returns all neighbouring nodes", () => {
    it("should return no nodes because every neighbour position is illegal", () => {
        let size = 1;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        let neighbours = board.findNeighbours(board.boardArray[0][0]);

        expect(neighbours.length).toBe(0);
    });
    it("should return 2 nodes, the east and west of the roots", () => {
        let size = 2;
        let colorCount = 1;
        let board = new Board(size, colorCount);
        let neighbours = board.findNeighbours(board.boardArray[0][0]);
        expect(neighbours.length).toBe(2);
        expect(neighbours[0].row).toBe(0);
        expect(neighbours[0].column).toBe(1);
        expect(neighbours[1].row).toBe(1);
        expect(neighbours[1].column).toBe(0);
    });

    it("should return 4 nodes, all neighbours of the central node", () => {
        let size = 3;
        let colorCount = 1;
        let board = new Board(size, colorCount);
        let neighbours = board.findNeighbours(board.boardArray[1][1]);
        expect(neighbours.length).toBe(4);

        //  W
        expect(neighbours[0].row).toBe(1);
        expect(neighbours[0].column).toBe(0);

        //  N
        expect(neighbours[1].row).toBe(0);
        expect(neighbours[1].column).toBe(1);

        //  E
        expect(neighbours[2].row).toBe(1);
        expect(neighbours[2].column).toBe(2);
        
        //  S
        expect(neighbours[3].row).toBe(2);
        expect(neighbours[3].column).toBe(1);
    });
});

describe("filterNeighbours returns neighbours that are unvisited and of the correct color", () => {
    it(`should return all nodes because none are visited and all have the connected color`, () => {
        
        let neighbours = [
            new Node(0, 0, Colors.White),
            new Node(0, 0, Colors.White),
            new Node(0, 0, Colors.White),
            new Node(0, 0, Colors.White),
        ];

        let board = new Board(1, 1);
        var filteredNeighbours = board.filterNeighbours({neighbours: neighbours, colorMatch: Colors.White});
        expect(filteredNeighbours.length).toBe(neighbours.length);
    });

    it(`should return no nodes because none are visited and all have the incorrect color`, () => {
        let neighbours = [
            new Node(0, 0, Colors.Black),
            new Node(0, 0, Colors.Black),
            new Node(0, 0, Colors.Black),
            new Node(0, 0, Colors.Black),
        ];

        let board = new Board(1, 1);
        var filteredNeighbours = board.filterNeighbours({neighbours: neighbours, colorMatch: [Colors.White]});
        expect(filteredNeighbours.length).toBe(0);
    });
});

describe("BFS search should find all nodes that match either the connected color or the target and return nodes only once", () => {
    it("should return only the root node", () => {
        let size = 1;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        let graph = board.bfsSearch(Colors.ColorArray[0]);

        expect(graph.length).toBe(1);
    });

    it("should return all nodes on a board of size 2", () => {
        let size = 2;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        let graph = board.bfsSearch(Colors.ColorArray[0]);

        expect(graph.length).toBe(4);
    });

    it("should return all nodes on a board of size 3", () => {
        let size = 3;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        let graph = board.bfsSearch(Colors.ColorArray[0]);

        expect(graph.length).toBe(9);
    });

    it("should return only the nodes that match the connected color", () => {
        let size = 3;
        let colorCount = 2;

        let board = new Board(size, colorCount);
        /*
            B   B   B
            B   W   B
            B   W   B
        */
        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.Black;
        board.boardArray[0][2].color = Colors.Black;

        board.boardArray[1][0].color = Colors.Black;
        board.boardArray[1][1].color = Colors.White;
        board.boardArray[1][2].color = Colors.Black;

        board.boardArray[2][0].color = Colors.Black;
        board.boardArray[2][1].color = Colors.White;
        board.boardArray[2][2].color = Colors.Black;

        let graph = board.bfsSearch(Colors.Black);

        expect(graph.length).toBe(7);
    });

    it("should return only the nodes that match the connected color or the target color", () => {
        let size = 3;
        let colorCount = 3;

        let board = new Board(size, colorCount);
        /*
            B   R   B
            R   R   B
            R   R   B
        */
        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.Red;
        board.boardArray[0][2].color = Colors.Black;

        board.boardArray[1][0].color = Colors.Red;
        board.boardArray[1][1].color = Colors.Red;
        board.boardArray[1][2].color = Colors.Black;

        board.boardArray[2][0].color = Colors.Red;
        board.boardArray[2][1].color = Colors.Red;
        board.boardArray[2][2].color = Colors.Black;

        let graph = board.bfsSearch(Colors.Red);

        expect(graph.length).toBe(6);
    });

    it("should return all nodes in the connected area", () => {
        let size = 3;
        let colorCount = 2;

        let board = new Board(size, colorCount);
        /*
            B   B   W
            B   W   W
            B   B   W
        */
        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.Black;
        board.boardArray[0][2].color = Colors.White;

        board.boardArray[1][0].color = Colors.Black;
        board.boardArray[1][1].color = Colors.White;
        board.boardArray[1][2].color = Colors.White;

        board.boardArray[2][0].color = Colors.Black;
        board.boardArray[2][1].color = Colors.Black;
        board.boardArray[2][2].color = Colors.White;

        let graph = board.bfsSearch(Colors.Black);

        expect(graph.length).toBe(5);
    });

    it("should reset all nodes to unvisited after a search", () => {
        let size = 3;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        board.bfsSearch(Colors.ColorArray[0]);

        board.boardArray.forEach( (row) => {
            row.forEach( (cell) => {
                expect(cell.visited).toBe(false);
            });
        })
    });
});

describe("isNodeAdjacentToConnectedArea tests if a given node is adjacent to the connected area.", () => {
    it("should return true when adjacent", () => {
        let size = 2;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        var isAdjacent = board.isNodeAdjacentToConnectedArea(board.boardArray[0][1]);

        expect(isAdjacent).toBe(true);
    });

    it("should return false when not adjacent", () => {
        let size = 2;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        
        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][0].color = Colors.White;
        board.boardArray[0][0].color = Colors.White;
        board.boardArray[0][0].color = Colors.Black;
        
        var isAdjacent = board.isNodeAdjacentToConnectedArea(board.boardArray[1][1]);

        expect(isAdjacent).toBe(false);
    });
});

describe(`PerformMove accepts an adjacent node and converts all connected areas plus all 
          nodes of matching colors adjacent to the connected area.`, () => {

    it("should not accept a non-adjacent node", () => {
        let size = 2;
        let colorCount = 1;

        let board = new Board(size, colorCount);    
    
        /*
            B   W
            W   W
        */

        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.White;

        board.boardArray[1][0].color = Colors.White;
        board.boardArray[1][1].color = Colors.White;

        var isSuccessful = board.performMove(board.boardArray[1][1]);
        expect(isSuccessful).toBe(false);
    });

    it("should convert all connected nodes to the target color with a board of size 2", () => {
        let size = 2;
        let colorCount = 2;

        let board = new Board(size, colorCount);
        
        let selectedNode = board.boardArray[0][1];

        /*
            B   W
            W   W
        */

        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.White;

        board.boardArray[1][0].color = Colors.White;
        board.boardArray[1][1].color = Colors.White;

        board.performMove(selectedNode);

        board.boardArray.forEach( (row) => {
            row.forEach( (cell) => {
                expect(cell.color).toBe(selectedNode.color);
            });
        });
    });

    it("should convert all connected nodes to the target color with a board of size 3", () => {
        let size = 3;
        let colorCount = 2;

        let board = new Board(size, colorCount);
        
        let selectedNode = board.boardArray[0][1];

        /*
            B   W   B
            B   W   B
            W   B   W
        */

        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.White;
        board.boardArray[0][2].color = Colors.Black;

        board.boardArray[1][0].color = Colors.Black;
        board.boardArray[1][1].color = Colors.White;
        board.boardArray[1][2].color = Colors.Black;

        board.boardArray[2][0].color = Colors.White;
        board.boardArray[2][1].color = Colors.Black;
        board.boardArray[2][2].color = Colors.White;

        board.performMove(selectedNode);
        /*
            W   W   B
            W   W   B
            W   B   W
        */

        expect(board.boardArray[0][0].color).toBe(Colors.White);
        expect(board.boardArray[0][1].color).toBe(Colors.White);
        expect(board.boardArray[0][2].color).toBe(Colors.Black);

        expect(board.boardArray[1][0].color).toBe(Colors.White);
        expect(board.boardArray[1][1].color).toBe(Colors.White);
        expect(board.boardArray[1][2].color).toBe(Colors.Black);

        expect(board.boardArray[2][0].color).toBe(Colors.White);
        expect(board.boardArray[2][1].color).toBe(Colors.Black);
        expect(board.boardArray[2][2].color).toBe(Colors.White);
    });
});

describe("findNodesAdjacentToConnectedArea", () => {
    it("Should find no nodes as all nodes are connected", () => {
        let size = 3;
        let colorCount = 1;

        let board = new Board(size, colorCount);
        let adjacentNodes = board.findNodesAdjacentToConnectedArea();

        expect(adjacentNodes.length).toBe(0);
    });

    it("Should find nodes adjacent to connected area.", () => {
        let size = 3;
        let colorCount = 2;

        let board = new Board(size, colorCount);

        /*
            B   B   W
            B   W   W
            W   B   W

        */

        board.boardArray[0][0].color = Colors.Black;
        board.boardArray[0][1].color = Colors.Black;
        board.boardArray[0][2].color = Colors.White;

        board.boardArray[1][0].color = Colors.Black;
        board.boardArray[1][1].color = Colors.White;
        board.boardArray[1][2].color = Colors.White;

        board.boardArray[2][0].color = Colors.White;
        board.boardArray[2][1].color = Colors.Black;
        board.boardArray[2][2].color = Colors.White;

        let adjacentNodes = board.findNodesAdjacentToConnectedArea();
        
        expect(adjacentNodes.length).toBe(3);

    });
});


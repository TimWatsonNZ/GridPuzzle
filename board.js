var Node = require("./Node.js");
var Colors = require("./color.js");
//  Board
module.exports = class Board {
    constructor(size, colorCount) {
        this.size = size;
        this.colorCount = colorCount;

        this.colors = Colors.ColorArray;
        this.maxSize = 10;

        this.boardArray = [];
        this.generateBoard();
        this.originalState = this.boardArray.slice();
    }

    //  Generate board with size and number of colors
    generateBoard() {
        if (this.size === 0 || this.colorCount === 0) {
            this.boardArray = [];
            return;
        }

        if (this.colorCount > this.colors.length) {
            this.boardArray = [];
            return;
        }

        for (let i = 0; i < this.size; i++) {
            var column = [];
            for (let j = 0; j < this.size; j++) {
                let color = this.colors[Math.floor(Math.random() * (this.colorCount))];
                column.push(new Node(i, j, color));
            }
            this.boardArray.push(column);
        }
    }

    //  Apply a given move to the board
    performMove(node) {
        //  Test if node is adjacent.
        if (!this.isNodeAdjacentToConnectedArea(node)) {
            return false;
        }

        //  Perform bfs search with the targets color.
        var connectedArea = this.bfsSearch();
        var newArea = this.bfsSearch(node.color, connectedArea);

        //  Then set every connected area node to the target color.
        connectedArea.forEach((cell) => {
            this.boardArray[cell.row][cell.column].color = node.color;
        });

        return true;
    }

    isNodeAdjacentToConnectedArea(node) {
        let nodeNeighbours = this.findNeighbours(node);
        var connectedAreaNodes = this.bfsSearch();

        for (var connectedAreaIndex = 0; connectedAreaIndex < connectedAreaNodes.length; connectedAreaIndex++) {
            for (var neighbourIndex = 0; neighbourIndex < nodeNeighbours.length; neighbourIndex++) {
                if (nodeNeighbours[neighbourIndex].row == connectedAreaNodes[connectedAreaIndex].row &&
                    nodeNeighbours[neighbourIndex].column == connectedAreaNodes[connectedAreaIndex].column) {
                    return true;
                }
            }
        }

        return false;
    }

    findNodesAdjacentToConnectedArea() {
        var connectedAreaNodes = this.bfsSearch();
        var neighboursOfConnectedArea = connectedAreaNodes.reduce((array, node) => {
            var neighbours = this.findNeighbours(node);
            array.push.apply(array, neighbours);
            return array;
        }, []);

        // filter duplicates
        neighboursOfConnectedArea = [...new Set(neighboursOfConnectedArea)];

        neighboursOfConnectedArea = neighboursOfConnectedArea.filter((node) => {
            return !connectedAreaNodes.includes(node);
        });

        return neighboursOfConnectedArea;
    }

    //  Check if a board is solved, all colors are the same.
    isComplete() {
        if (this.size <= 1) return true;

        let connectedArea = this.bfsSearch();
        return connectedArea.length == this.size*this.size;
    }

    bfsSearch(targetColor, connectedArea) {
        var queue = [];
        var graph = [];
        targetColor = targetColor || this.boardArray[0][0].color;

        if(connectedArea){
            connectedArea.forEach( (node) => {
                queue.push(node);
            });
        }else{
            queue.push(this.boardArray[0][0]);
        }

        while (queue.length > 0) {
            // Find neighbours
            let node = queue.pop();

            if (!node.visited) {
                graph.push(node);
                node.visited = true;
            } else {
                continue;
            }

            let neighbours = this.findNeighbours(node);
            let neighboursToVisit = this.filterNeighbours(
                {
                    neighbours: neighbours,
                    colorMatch: targetColor
                });

            neighboursToVisit.forEach((neighbour) => {
                queue.push(neighbour);
            });
        }

        //  Reset visited nodes.
        this.boardArray.forEach((row) => {
            row.forEach((column) => {
                column.visited = false;
            });
        });

        return graph;
    }

    filterNeighbours({ neighbours, colorMatch }) {
        // Filter
        var filtered = neighbours.reduce((graph, neighbour) => {
            if (neighbour.visited == false &&
                neighbour.color == colorMatch) {
                graph.push(neighbour)
            };
            return graph;
        }, []);

        return filtered;
    }

    findNeighbours(node) {
        let neighbours = [];

        //     O N O
        //     W X E
        //     O S O

        //  WEST
        if (node.column > 0) {
            neighbours.push(this.boardArray[node.row][node.column - 1]);
        }

        //  NORTH
        if (node.row > 0) {
            neighbours.push(this.boardArray[node.row - 1][node.column]);
        }

        //  EAST
        if (node.column < this.size - 1) {
            neighbours.push(this.boardArray[node.row][node.column + 1]);
        }

        //  SOUTH
        if (node.row < this.size - 1) {
            neighbours.push(this.boardArray[node.row + 1][node.column]);
        }


        return neighbours;
    }

    resetBoard(){
        this.boardArray = this.originalState.slice();
    }

    print(){
        this.boardArray.forEach( (row) => {
            row.forEach( (cell) => {
                process.stdout.write(`\t${cell.color.symbol}\t`);
            });
            process.stdout.write("\n\n");
        });
    }
}
// Automated player

var Colors = require("./color.js");

module.exports = class AutomatedPlayer{
    constructor(){

    }

    makeMove(board){
        //  Find squares adjacent to the connected area.
        let adjacentNodes = board.findNodesAdjacentToConnectedArea();
        let mostCommonColor = this.findMostCommonColorInAdjacentNodes(adjacentNodes);
        let move = adjacentNodes.filter( (node) => node.color == mostCommonColor.color)[0];

        board.performMove(move);
    }

    findMostCommonColorInAdjacentNodes(adjacentNodes){
        //  Pick a square of the most common color.
        let colorCounts = adjacentNodes.reduce( (colorDict, node) => {
            if(colorDict[node.color.name]){
                colorDict[node.color.name].count++;
            }else{
                colorDict[node.color.name] = { color: node.color, count: 1 };
            }

            return colorDict;
        }, {});

        let mostCommonColor = {};
        for(var property in colorCounts){
            if(colorCounts.hasOwnProperty(property)){
                mostCommonColor = colorCounts[property];
                break;
            }
        }
        
        colorCounts[Colors.Black.name];
        for(var property in colorCounts){

            if(colorCounts.hasOwnProperty(property)){
                if(colorCounts[property].count > mostCommonColor.count){
                    mostCommonColor = colorCounts[property];
                }
            }
        }

        return mostCommonColor;
    }

    playTillComplete(board){
        let moveCount = 0;
        while(!board.isComplete()){
            this.makeMove(board);
            moveCount++;
        }

        return moveCount;
    }
}
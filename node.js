//  Node.js

module.exports = class Node {
    constructor(row, column, color){
        this.row = row;
        this.column = column;
        this.color = color;
        this.visited = false;
    }
}
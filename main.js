//  Main
//  On start generate board, make automated player
//  play and print the resulting boards till done.

process.stdin.resume();
process.stdin.setEncoding("utf8");

let Board = require("./board");
let Player = require("./automatedPlayer.js");

let gridSize = 1;
let colorCount = 1;
let board = new Board(gridSize, colorCount);
let player = new Player();

let states = {
    INPUT_SIZE: {
        entry: function(){
            console.log(`Please input a board size number, maximum size is ${board.maxSize}.`);
        },

        processInput: function(input){
            let parsed = parseInt(input);
            if(!isNaN(parsed) || parsed > board.maxSize){
                gridSize = parsed;
                return this.transitions.TO_INPUT_COLOR_COUNT;
            }else{
                console.log("Input was not a number.");
                console.log(this.print);
                return this.transitions.ERROR;
            }
        },
        transitions: { ERROR: "INPUT_SIZE", TO_INPUT_COLOR_COUNT: "INPUT_COLOR_COUNT"}
    },
    INPUT_COLOR_COUNT: {
        entry: function(){
            console.log(`Please input a number of colors, max is ${board.colors.length}:`);
        },
        processInput: function(input){
            let parsed = parseInt(input);
            if(!isNaN(parsed)){
                colorCount = parsed;

                board = new Board(gridSize, colorCount);
                board.print();

                return this.transitions.AUTOMATED_PLAYER_TURN;
            }else{
                console.log("Input was not a number.");
                console.log(this.print);
                return this.transitions.ERROR;
            }
        },
        transitions: { ERROR: "INPUT_COLOR_COUNT", AUTOMATED_PLAYER_TURN: "AUTOMATED_PLAYER_TURN"}
    },
    AUTOMATED_PLAYER_TURN: {
        entry: function(){
            let moveCount = player.playTillComplete(board);
            console.log(`The computer player completed the board in ${moveCount} moves:`)
            return this.transitions.PLAYER_TURN;
        }
    },
    PLAYER_TURN: {
        entry: () => {
            console.log("Now it is your turn, input two numbers separated by a space to make a move.");
            console.log("The first number is the row, the second is the column. Both are 0-indexed.");
        }
    }
};

let stateMachine = {
    currentState: states.INPUT_SIZE
};


stateMachine.currentState.entry();

process.stdin.on("data", (input) => {
    let transition = stateMachine.currentState.processInput(input);
    stateMachine.currentState = states[transition];
    stateMachine.currentState.entry();
});
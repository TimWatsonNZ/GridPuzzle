//  Color

class Color{
    constructor(name, symbol){
        this.name = name;
        this.symbol = symbol;
    }
}

const White = new Color("white", "w");
const Black = new Color("black", "b");
const Red = new Color("red", "r");
const Yellow = new Color("yellow", "y");


module.exports.ColorArray = Colors =  [
    White, Black, Red, Yellow
];

module.exports.White = White;
module.exports.Black = Black;
module.exports.Red = Red;
module.exports.Yellow = Yellow;
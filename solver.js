const edges = require('./edges')

const sudoku = [
    [null, null, 7, null, null, null, null, 3, null],
    [null, null, null, null, 2, null, 8, null, null],
    [null, 2, 3, 4, 8, 7, null, 5, null],
    [null, null, 8, 5, null, null, 1, null, null],
    [null, 1, 9, null, null, null, 2, 4, null],
    [null, null, 4, null, null, 3, 6, null, null],
    [null, 5, null, 2, 3, 6, 7, 9, null],
    [4, null, 2, null, 5, null, null, null, null],
    [null, null, null, null, null, null, 5, null, null]
]

const possibilitiesMatrix = [
    [], [], [], [], [], [], [], [], []
]

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// edge = edges.getEdge(7, 2)
// console.log(edge);
// console.log(getQuadrantNumber(edge));
// console.log(getLineNumbers(7));
// console.log(getColumnNumbers(2));

while (sudokuHasNull()) {
    for (let i = 0; i < sudoku.length; i++) {
        for (let j = 0; j < sudoku[i].length; j++) {
            const possibilities = generatePossibilities(i, j, sudoku[i][j]);
            possibilitiesMatrix[i][j] = possibilities;

            if (possibilities.length === 1) {
                sudoku[i][j] = possibilities[0]
            }
        }
    }
    console.log(possibilitiesMatrix);
}
// console.log(generatePossibilities(0, 0));

console.log("################################");
console.log(sudoku);

function generatePossibilities(i, j, except) {
    const edge = edges.getEdge(i, j)
    const quadrantNumbers = getQuadrantNumber(edge);
    const lineNumbers = getLineNumbers(i);
    const columnNumbers = getColumnNumbers(j);

    const allFoundNumbers = new Set(quadrantNumbers.concat(lineNumbers, columnNumbers));
    allFoundNumbers.delete(except);

    const possibilities = []

    numbers.forEach(number => {
        if (!allFoundNumbers.has(number)) {
            possibilities.push(number);
        }
    })
    return possibilities;
}

function getQuadrantNumber(edges) {
    const numbersInQuadrant = []
    for (let i = edges.start_i; i <= edges.end_i; i++) {
        for (let j = edges.start_j; j <= edges.end_j; j++) {
            if (sudoku[i][j]) {
                numbersInQuadrant.push(sudoku[i][j])
            }
        }
    }
    return numbersInQuadrant
}

function getLineNumbers(line) {
    const numbersInLine = []
    for (let i = 0; i < 9; i++) {
        if (sudoku[line][i]) {
            numbersInLine.push(sudoku[line][i])
        }
    }
    return numbersInLine
}

function getColumnNumbers(column) {
    const numbersInColumn = []
    for (let i = 0; i < 9; i++) {
        if (sudoku[i][column]) {
            numbersInColumn.push(sudoku[i][column])
        }
    }
    return numbersInColumn
}

function sudokuHasNull() {
    return sudoku.some(lines => lines.includes(null))
}
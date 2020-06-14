const edges = require('./edges')

// const sudoku = [
//     [null, null, 7, null, null, null, null, 3, null],
//     [null, null, null, null, 2, null, 8, null, null],
//     [null, 2, 3, 4, 8, 7, null, 5, null],
//     [null, null, 8, 5, null, null, 1, null, null],
//     [null, 1, 9, null, null, null, 2, 4, null],
//     [null, null, 4, null, null, 3, 6, null, null],
//     [null, 5, null, 2, 3, 6, 7, 9, null],
//     [4, null, 2, null, 5, null, null, null, null],
//     [null, null, null, null, null, null, 5, null, null]
// ]

const possibilitiesMatrix = [
    [], [], [], [], [], [], [], [], []
]

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function solveSudoku(sudoku) {
    const solvedSudoku = Object.assign([], sudoku);

    let count = 0;

    let minPossibility = {
        qtd: Number.MAX_VALUE,
        i: -1,
        j: -1
    }

    while (count < 100 && sudokuHasNull(solvedSudoku)) {
        count++;

        let hasChanged = false;

        for (let i = 0; i < solvedSudoku.length; i++) {
            for (let j = 0; j < solvedSudoku[i].length; j++) {

                if (solvedSudoku[i][j]) break;

                const possibilities = generatePossibilities(i, j, solvedSudoku[i][j], solvedSudoku);
                possibilitiesMatrix[i][j] = possibilities;
                // BEST CHOICE
                if (possibilities.length === 1) {
                    solvedSudoku[i][j] = possibilities[0];
                    hasChanged = true;
                } else if (possibilities.length < minPossibility.qtd) {
                    // FOUND THE BEST POSSIBILITY TO CAN GUESS
                    minPossibility =  {
                        qtd: possibilities.length,
                        possibilities,
                        i,
                        j
                    }
                }
            }
        }

        if (!hasChanged) {
            let guess = minPossibility.possibilities[0]
            solvedSudoku[minPossibility.i][minPossibility.j] = guess
            // console.log(minPossibility);
        }
    }
    return solvedSudoku
} 

function generatePossibilities(i, j, except, sudoku) {
    const edge = edges.getEdge(i, j, sudoku)
    const quadrantNumbers = getQuadrantNumber(edge, sudoku);
    const lineNumbers = getLineNumbers(i, sudoku);
    const columnNumbers = getColumnNumbers(j, sudoku);

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

function getQuadrantNumber(edges, sudoku) {
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

function getLineNumbers(line, sudoku) {
    const numbersInLine = []
    for (let i = 0; i < 9; i++) {
        if (sudoku[line][i]) {
            numbersInLine.push(sudoku[line][i])
        }
    }
    return numbersInLine
}

function getColumnNumbers(column, sudoku) {
    const numbersInColumn = []
    for (let i = 0; i < 9; i++) {
        if (sudoku[i][column]) {
            numbersInColumn.push(sudoku[i][column])
        }
    }
    return numbersInColumn
}

function sudokuHasNull(sudoku) {
    return Array.isArray(sudoku) && sudoku.some(lines => lines.includes(null))
}

module.exports = ({ solveSudoku })
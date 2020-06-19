const edges = require('./edges')
const generator = require('./generator')

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

// Possibilites - Blacklist
const realPossibilitiesMatrix = [
    [], [], [], [], [], [], [], [], []
]

const blacklistMatrix = generator.generateEmptySudoku()

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function solveSudoku(sudoku) {
    const solvedSudoku = Object.assign([], sudoku);

    let count = 0;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!solvedSudoku[i][j]) {
                possibilitiesMatrix[i][j] = generatePossibilities(i, j, solvedSudoku[i][j], solvedSudoku);
            } else {
                addBlacklistInLine(solvedSudoku[i][j], solvedSudoku, i)
                addBlacklistInColumn(solvedSudoku[i][j], solvedSudoku, j)
                addBlackListInQuadrant(solvedSudoku[i][j], solvedSudoku, i, j)
            }
        }
    }

    while (count < 500 && sudokuHasNull(solvedSudoku)) {
        count++;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (solvedSudoku[i][j]) continue;

                const realPossibilities = getRealPossibilities(possibilitiesMatrix[i][j], blacklistMatrix[i][j])
                realPossibilitiesMatrix[i][j] = Object.assign([], realPossibilities);

                if (realPossibilities.length === 1) {
                    solvePosition(realPossibilities[0], solvedSudoku, i, j)
                } else {
                    // verifico se alguma das possibiladedes é blacklsitada no quadrante inteiro
                    realPossibilities.forEach(realPossibility => {
                        if (isOnlyPossibilityOnQuadrant(realPossibility, solvedSudoku, i, j)) {
                            solvePosition(realPossibility, solvedSudoku, i, j)
                        }
                    })
                }
            }
            //Percorre a linha que acabou de gerar as possibilidades e verifica se existe alguma possibilidade q é unica
            for (let j = 0; j < 9; j++) {
                if (!solvedSudoku[i][j] && realPossibilitiesMatrix[i][j]) {
                    realPossibilitiesMatrix[i][j].forEach(realPossibility => {
                        if (!solvedSudoku[i][j] && isOnlyPossibilityInLine(realPossibility, solvedSudoku, i, j)) {
                            solvePosition(realPossibility, solvedSudoku, i, j)
                        }
                    })
                }
            }

        }

    }
    console.log(`Resolvido em ${count} iterações`);

    return solvedSudoku
}

/**
 * Return true if the passed number is the only possibility among all the possibility vectors of the line
 * @param { Number } possibility 
 * @param { Array<Array> } solvedSudoku 
 * @param { Number } actualLine 
 * @param { Number } actualColumn 
 * @returns { Boolean }
 */
function isOnlyPossibilityInLine(possibility, solvedSudoku, actualLine, actualColumn) {
    for (let j = 0; j < 9; j++) {
        if (j === actualColumn) continue;

        if (solvedSudoku[actualLine][j] && solvedSudoku[actualLine][j] === possibility) {
            return false
        }

        if (solvedSudoku[actualLine][j]) continue;

        if (realPossibilitiesMatrix[actualLine][j] && realPossibilitiesMatrix[actualLine][j].includes(possibility)) {
            return false;
        }
    }
    return true;
}

/**
 * Returns true if the passed number is blacklist in all quadrant
 * @param { Number } possibility
 * @param { Array<Array> } solvedSudoku
 * @param { Number } actualLine
 * @param { Number } actualColumn
 * @returns { Boolean }
 */
function isOnlyPossibilityOnQuadrant(possibility, solvedSudoku, actualLine, actualColumn) {
    const edge = edges.getEdge(actualLine, actualColumn)

    for (let i = edge.start_i; i <= edge.end_i; i++) {
        for (let j = edge.start_j; j <= edge.end_j; j++) {
            if (i === actualLine && j === actualColumn) continue;
            if (solvedSudoku[i][j] && solvedSudoku[i][j] !== possibility) continue;

            if (solvedSudoku[i][j] && solvedSudoku[i][j] === possibility ||
                (blacklistMatrix[i][j] && !blacklistMatrix[i][j].has(possibility))) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Put a number on solvedMatrix and blacklist himself in him line, column and quadrant
 * @param { Number } number 
 * @param { Array<Array> } solvedSudoku 
 * @param { Number } i 
 * @param { Number } j 
 */
function solvePosition(number, solvedSudoku, i, j) {
    solvedSudoku[i][j] = number
    addBlacklistInLine(number, solvedSudoku, i)
    addBlacklistInColumn(number, solvedSudoku, j)
    addBlackListInQuadrant(number, solvedSudoku, i, j)
}

/**
 * Get possibilities without blacklist numbers
 * @param { Array } possibilities 
 * @param { Set } blacklist 
 */
function getRealPossibilities(possibilities, blacklist) {
    if (!blacklist) return possibilities

    return possibilities.filter(possibity => {
        return !blacklist.has(possibity)
    })
}

/**
 * Add number in blacklist for each position to entire quadrant of matrix
 * @param { Number } numberToBlackList 
 * @param { Array<Array> } solvedSudoku 
 * @param { Number } actualLine - line index
 * @param { Number } actualColumn - column index
 * @returns { Void }
 */
function addBlackListInQuadrant(numberToBlackList, solvedSudoku, actualLine, actualColumn) {
    const edge = edges.getEdge(actualLine, actualColumn)

    for (let i = edge.start_i; i <= edge.end_i; i++) {
        for (let j = edge.start_j; j <= edge.end_j; j++) {
            if (solvedSudoku[i][j]) continue

            if (!blacklistMatrix[i][j]) {
                blacklistMatrix[i][j] = new Set()
            }

            blacklistMatrix[i][j].add(numberToBlackList)
        }
    }
}

/**
 * Add number in blacklist for each position to entire line of matrix
 * @param { Number } numberToBlackList
 * @param { Array<Array> } solvedSudoku
 * @param { Number } line
 * @returns { Void }
 */
function addBlacklistInLine(numberToBlackList, solvedSudoku, line) {
    for (let j = 0; j < 9; j++) {
        if (solvedSudoku[line][j]) continue

        if (!blacklistMatrix[line][j]) {
            blacklistMatrix[line][j] = new Set()
        }

        blacklistMatrix[line][j].add(numberToBlackList)
    }
}

/**
 * Add number in blacklist for each position to entire column of matrix
 * @param { Number } numberToBlackList
 * @param { Array<Array> } solvedSudoku
 * @param { Number } column
 * @returns { Void }
 */
function addBlacklistInColumn(numberToBlackList, solvedSudoku, column) {
    for (let i = 0; i < 9; i++) {
        if (solvedSudoku[i][column]) continue

        if (!blacklistMatrix[i][column]) {
            blacklistMatrix[i][column] = new Set()
        }

        blacklistMatrix[i][column].add(numberToBlackList)
    }
}

function generatePossibilities(i, j, except, sudoku) {
    const edge = edges.getEdge(i, j)
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
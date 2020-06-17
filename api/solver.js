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

const blacklistMatrix = generator.generateEmptySudoku()

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function solveSudoku(sudoku) {
    const solvedSudoku = Object.assign([], sudoku);

    let count = 0;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            possibilitiesMatrix[i][j] = generatePossibilities(i, j, solvedSudoku[i][j], solvedSudoku);
        }
    }

    while (count < 100 && sudokuHasNull(solvedSudoku)) {
        count++;

        const mapColumnPossibilites = []
        for (let i = 0; i < 9; i++) {
            const mapLinePossibilites = []

            for (let j = 0; j < 9; j++) {
                if (solvedSudoku[i][j]) continue;

                const realPossibilities = getRealPossibilities(possibilitiesMatrix[i][j], blacklistMatrix[i][j])

                if (realPossibilities.length === 1) {
                    const uniquePossibility = realPossibilities[0]
                    solvedSudoku[i][j] = uniquePossibility
                    addBlacklistInLine(uniquePossibility, solvedSudoku, i)
                    addBlacklistInColumn(uniquePossibility, solvedSudoku, j)
                    addBlackListInQuadrant(uniquePossibility, solvedSudoku, i, j)
                }

                // VERIFICO SE EXISTE ALGUMA POSSIVILIDADE QUE E UNICA NA LINHA
                realPossibilities.forEach(possibity => {
                    const found = mapLinePossibilites.find(el => el.possibity === possibity)

                    if (!found) {
                        mapLinePossibilites.push({
                            index: j,
                            count: 1,
                            possibity
                        })
                    } else {
                        const indexFound = mapLinePossibilites.indexOf(found)
                        mapLinePossibilites[indexFound].count++
                    }
                })

                // const realPossibilitiesC = getRealPossibilities(possibilitiesMatrix[j][i], blacklistMatrix[j][i])
                // // VERIFICO SE EXISTE ALGUMA POSSIVILIDADE QUE E UNICA NA COLUNA
                // realPossibilitiesC.forEach(possibity => {
                //     const found = mapColumnPossibilites.find(el => el.possibity === possibity)

                //     if (!found) {
                //         mapColumnPossibilites.push({
                //             index: j,
                //             count: 1,
                //             possibity
                //         })
                //     } else {
                //         const indexFound = mapColumnPossibilites.indexOf(found)
                //         mapColumnPossibilites[indexFound].count++
                //     }
                // })
            }

            mapLinePossibilites
                .filter(possibity => possibity.count === 1)
                .forEach(possibity => {
                    solvedSudoku[i][possibity.index] = possibity.possibity
                    addBlacklistInLine(possibity.possibity, solvedSudoku, i)
                    addBlacklistInColumn(possibity.possibity, solvedSudoku, possibity.index)
                    addBlackListInQuadrant(possibity.possibity, solvedSudoku, i, possibity.index)
                })

            mapColumnPossibilites
                .filter(possibity => possibity.count === 1)
                .forEach(possibity => {
                    // solvedSudoku[possibity.index][i] = possibity.possibity
                    // addBlacklistInLine(possibity.possibity, solvedSudoku, possibity.index)
                    // addBlacklistInColumn(possibity.possibity, solvedSudoku, i)
                    // addBlackListInQuadrant(possibity.possibity, solvedSudoku, possibity.index, i)
                })


            console.log('eita');

        }



        // if (!hasChanged) {
        //     let guess = minPossibility.possibilities[0]
        //     solvedSudoku[minPossibility.i][minPossibility.j] = guess
        // console.log(minPossibility);
        // }
    }
    console.log(`Resolvido em ${count} iterações`);

    return solvedSudoku
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
 * @param { Number } i - line index
 * @param { Number } j - column index
 * @returns { Void }
 */
function addBlackListInQuadrant(numberToBlackList, solvedSudoku, i, j) {
    const edge = edges.getEdge(i, j)

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
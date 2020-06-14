/**
 * Generate the base matrix, with all positions with null
 * @returns { Array<Array> }
 */
const generateEmptySudoku = () => {
    const baseLine = [null, null, null, null, null, null, null, null, null]

    return [
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine),
        Object.assign([], baseLine)
    ]
}

const generateSudoku = () => {
    // Easy
    // return [
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
    // Impossible
    return [
        [null, null, 3, null, null, 6, null, null, 4],
        [null, null, 8, null, null, null, null, null, null],
        [9, 4, 1, 5, null, null, null, null, null],
        [null, null, null, 2, null, null, null, 7, 1],
        [null, 9, null, 3, 1, 5, null, null, null],
        [6, null, null, null, null, null, 9, 2, null],
        [3, null, null, 8, null, null, null, null, null],
        [null, null, 6, null, 3, 4, null, null, null],
        [null, null, null, null, null, null, null, 5, null]
    ]
}



module.exports = ({ generateEmptySudoku, generateSudoku })
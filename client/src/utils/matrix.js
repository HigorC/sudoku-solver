function generateBaseMatrix() {
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

export { generateBaseMatrix }
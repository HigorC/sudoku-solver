const allEdges = [
    {
        start_i: 0,
        end_i: 2,
        start_j: 0,
        end_j: 2,
    },
    {
        start_i: 3,
        end_i: 5,
        start_j: 0,
        end_j: 2,
    },
    {
        start_i: 6,
        end_i: 8,
        start_j: 0,
        end_j: 2,
    },
    {
        start_i: 0,
        end_i: 2,
        start_j: 3,
        end_j: 5,
    },
    {
        start_i: 3,
        end_i: 5,
        start_j: 3,
        end_j: 5,
    },
    {
        start_i: 6,
        end_i: 8,
        start_j: 3,
        end_j: 5,
    },
    {
        start_i: 0,
        end_i: 2,
        start_j: 6,
        end_j: 8,
    },
    {
        start_i: 3,
        end_i: 5,
        start_j: 6,
        end_j: 8,
    },
    {
        start_i: 6,
        end_i: 8,
        start_j: 6,
        end_j: 8,
    }
]

const getEdge = (i, j) => {
    return allEdges.reduce((acc, edge) => {
        if (i >= edge.start_i && i <= edge.end_i &&
            j >= edge.start_j && j <= edge.end_j) {
            acc.push(edge)
        }
        return acc;
    }, [])[0];
}

module.exports = ({
    allEdges,
    getEdge
})
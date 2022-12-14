import * as Collections from 'typescript-collections';
import { EventEmitter } from 'events';

type NodeData = {
    value: string,
    row: number,
    col: number
    distance: number, // Minimum distance from source node
    prevNode: NodeData | undefined, // used when backtracking along the shortest path
    visited: boolean
}

export type VisualizerData = {
    value: string,
    wasVisited: boolean,
    isOnCurrentNodeMinPath: boolean
}


// Returns the length of the shortest path 
// between the start character
// and end character, if it is possible.
// Includes dataEmitter parameter for visualizing data.
export const minPathfinder = (input: string, dataEmitter?: EventEmitter): number => {
    const START_CHAR = "S";
    const END_CHAR = "E";

    // Converts single string text input into 2D grid of NodeData elements
    const grid: NodeData[][] = input.split('\n').map((line, row) => line.split('').map((char, col) => ({ row, col, distance: Infinity, visited: false, value: char, prevNode: undefined })))

    const rowCount = grid.length;
    const colCount = grid[0].length;

    // Find source (S) and destination (E) coordinates
    const startRow = grid.findIndex(row => row.map(r => r.value).includes(START_CHAR));
    const startCol = grid[startRow].findIndex(node => node.value === START_CHAR);
    // Update source node
    grid[startRow][startCol].distance = 0;

    const unvisitedSet = new Collections.Set<NodeData>((node) => `${node.row},${node.col}`);
    grid.forEach(r => r.forEach(node => unvisitedSet.add(node)));
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    // Helper functions
    const getCellHeight = (cellChar: string) => {
        let char = cellChar;
        switch (cellChar) {
            case START_CHAR:
                char = "a";
                break;
            case END_CHAR:
                char = "z";
                break;
        }
        return char.charCodeAt(0) - 97;
    }
    
    const getShortestPathToSource = (terminalCell: NodeData) => {
        const nodeList = [];
        let current = terminalCell;
        while (current && current.prevNode) {
            nodeList.push(current);
            current = current.prevNode;
        }
        return nodeList;
    }
    const isValidTraversal = (a: NodeData, b: NodeData) => {
        return getCellHeight(b.value) - getCellHeight(a.value) <= 1;
    }

    const getMinNode = () => {
        let minDistance = Infinity;
        let currentMinNode;
        unvisitedSet.forEach(n => {
            if (n.distance < minDistance) {
                minDistance = n.distance
                currentMinNode = n;
            }
        });
        return currentMinNode;
    }

    // Iterate as long as there are still unvisited nodes, and it is possible to reach them from the source
    while (!unvisitedSet.isEmpty() && getMinNode() && (getMinNode() as unknown as NodeData).distance < Infinity) {
        // Get shortest total path node
        const currentNode = getMinNode() as unknown as NodeData;
        unvisitedSet.remove(currentNode);
        currentNode.visited = true;
        
        // Check which neighboring cells can be traversed to, and haven't been visited yet
        const validNeighbors = directions.map(([dX, dY]) => [currentNode.row + dX, currentNode.col + dY])
            .filter(([neighborCellRow, neighborCellCol]) => {
                const areRowAndColWithinGrid = neighborCellRow >= 0 && neighborCellCol >= 0 && neighborCellRow < rowCount && neighborCellCol < colCount;
                return areRowAndColWithinGrid;
            })
            .map(([neighborCellRow, neighborCellCol]) => grid[neighborCellRow][neighborCellCol])
            .filter(neighborCell => !neighborCell.visited && isValidTraversal(currentNode, neighborCell));

        // If the path along this cell to the neighbor cell
        // would shorten their min path,
        // update the distance and prevNode pointer
        validNeighbors.forEach(neighborCell => {
            const tentativeDistance = currentNode.distance + 1;
            if (neighborCell.distance > tentativeDistance) {
                neighborCell.distance = tentativeDistance;
                neighborCell.prevNode = currentNode;
            }
        });
        
        // Emit state
        if (dataEmitter) {
            const minPath = getShortestPathToSource(currentNode);
            const mappedVisitNodes = grid.map(nodeRow => nodeRow.map(node => ({ value: node.value, wasVisited: node.visited, isOnCurrentNodeMinPath: minPath.includes(node) })))
            dataEmitter.emit('event', mappedVisitNodes);
        }

        // Returns the min distance if the end cell is reached
        if (currentNode.value === END_CHAR) {
            return currentNode.distance;
        }
    }

    return Infinity;
}
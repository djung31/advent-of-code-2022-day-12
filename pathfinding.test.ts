import { minPathfinder } from './pathfinding';


describe('minPathFinder', () => {
    it('returns the correct value for the example data', () => {
        const exampleText = `Sabqponm\nabcryxxl\naccszExk\nacctuvwj\nabdefghi`;
        expect(minPathfinder(exampleText)).toBe(31)
    })

    it('returns infinity for non traversable grids', () => {
        const exampleText = `Scccc\nccccc\nccccc\nccccc\nccccE`;
        expect(minPathfinder(exampleText)).toBe(Infinity)
    })
})
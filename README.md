# Advent of Code Day 12 Solver/Visualizer

I used this code to help solve a challenge puzzle from [Advent of Code 2022 Day 12](https://adventofcode.com/2022/day/12).
The challenge was a pathfinding exercise from a source node to an end node.
The valid edges were explained as how an elf can move from one cell to another.

I coded the pathfinding algorithm to use Dijkstra's algorithm, although since the edges between nodes were all equally weighted, BFS could also work.
I wanted to created my own visualizer as a way to help me see what the algorithm is actually doing, since I had never actually implemented Dijkstra's algorithm before.
The visualizer takes 2D data from the solver and creates PNGs which are temporarily saved to disk. Then, a NodeJS wrapper around ffmpeg combines the individual frames into a single video, which is also saved to disk.

## Screenshots
![Visualizer showing height in grayscale](https://github.com/djung31/advent-of-code-2022-day-12/blob/main/visualize-01.png?raw=true)
![Visualizer showing height as color and shortest path as a black line](https://github.com/djung31/advent-of-code-2022-day-12/blob/main/visualize-02.png?raw=true)

## License

ISC


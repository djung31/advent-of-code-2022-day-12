# Advent of Code Day 12 Solver/Visualizer

## Motivation

I used this code to help solve a challenge puzzle from [Advent of Code 2022 Day 12](https://adventofcode.com/2022/day/12).
The challenge was a pathfinding exercise from a source node to an end node.
The valid edges were explained as how an elf can move from one cell to another.

I coded the pathfinding algorithm to use Dijkstra's algorithm, although since the edges between nodes were all equally weighted, BFS could also work.
I wanted to created my own visualizer as a way to help me see what the algorithm is actually doing, since I had never actually implemented Dijkstra's algorithm before.
The visualizer takes 2D data from the solver and creates PNGs which are temporarily saved to disk. Then, a NodeJS wrapper around ffmpeg combines the individual frames into a single video, which is also saved to disk.

## Instructions
---------------
### Installation
- Install: `$ npm install` 

### Set input data
- Put an input text file (no filetype) in `./data` 
- Input must have single source character `"S"` and single end character `"E"`.
- Note: the script is currently hardcoded to use `input` as the input). 

### Run script
- Run script: `$ npm run start`.
- Output video found as: `./out/video.mp4`

### Test
- Run unit test: `$ npm run test`

## Example
----------------
### Screenshots

Note:
- Pre-traversal cell heights are visualized in grayscale from low (black) to high (white).
- Post-traversal cell heights are visualed from green (low) to red (high).
- The current path/minimum distance path is colored in black

![Visualizer showing height in grayscale](https://github.com/djung31/advent-of-code-2022-day-12/blob/main/doc/visualize-01.png)
![Visualizer showing height as color and shortest path as a black line](https://github.com/djung31/advent-of-code-2022-day-12/blob/main/doc/visualize-02.png)

### Video
https://user-images.githubusercontent.com/29995136/207649207-47c758ff-9d7f-4cc0-afc5-97bb2d6f6739.mp4

## License
ISC


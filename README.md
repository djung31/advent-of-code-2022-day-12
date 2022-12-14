# Advent of Code Day 12 Solver/Visualizer

## Motivation

I used this code to help solve a challenge puzzle from [Advent of Code 2022 Day 12](https://adventofcode.com/2022/day/12). 
The challenge was to find the length of the shortest path from the source node `S` to the end node `E`. 
The other cells ranged from `a` to `z`. The only valid traversals were one character up or any character down. (`S` is equivalent to `a` and `E` is equivalent to `z`)

I used Dijkstra's algorithm as a learning exercise. However, since the edges are all equally weighted, BFS could also work.
As another exercise, I wanted to created my own visualizer to see how the algorithm progressed through the graph, as well as the minimum path.
This was implemented as a script which runs the algorithm on the input data, generating screenshots which are then stitched together with ffmpeg.

## Instructions
---------------
### Installation
- Install: `$ npm install` 
- Prerequisite: `ffmpeg` ver >0.9 installed.

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


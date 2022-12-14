import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import type { SharpOptions } from 'sharp';

import { asyncReadFiles } from './readFile'
import { createUint8rgba, stitchFramesToVideo } from './utils';
import { minPathfinder } from './pathfinding';
import type { VisualizerData } from './pathfinding';

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic as string);

(async () => {
    // This script is used to solve/visualize
    // the 2022 Advent of Code Day 12 challenge.
    // This script reads test or challenge input 
    // from a text file and then calculates the 
    // shortest path from a source node to an exit node.
    // The pathfinding function is used as a 
    // source for 2D graphical data, which is then
    // rendered to images and then to ffmpeg
    // to be converted to video.


    // Clean up the temporary directories first
    for (const path of ['out', 'tmp/output']) {
        if (fs.existsSync(path)) {
            await fs.promises.rm(path, { recursive: true });
        }
        await fs.promises.mkdir(path, { recursive: true });
    }

    // Set up visualizer image/video options
    const SCALE_FACTOR = 2;
    let frameCounter = 0;

    // Set up data emitter/listeners
    // These are used to listen for state emissions
    // from the pathfinding function.
    const dijkstraEmitter = new EventEmitter();

    // When the pathfinding function emits state, 
    // create and save a temporary image as png.
    dijkstraEmitter.on('event', async (data: VisualizerData[][]) => {
        if (!Array.isArray(data) && !data[0] && !Array.isArray(data[0])) {
            console.error('Invalid data emitted.')
            process.exit(1);
        }

        // Build image
        const sharpImageParameters: SharpOptions = {
            raw: {
                height: data.length * SCALE_FACTOR,
                width: data[0].length * SCALE_FACTOR,
                channels: 4,
            }
        }
        const image = sharp(createUint8rgba(data, SCALE_FACTOR), sharpImageParameters)
        const paddedNumber = String(frameCounter).padStart(4, '0');
        
        // Update state
        frameCounter++;

        // Output to temp folder
        await image.toFile(`tmp/output/frame-${paddedNumber}.png`);      
    })

    // When the pathfinding function ends,
    // Combine the recorded images into a video
    // With ffmpeg
    dijkstraEmitter.on('end', async () => {
        const frameRatePerSec = 60;
        const durationSec = Math.ceil(frameCounter/frameRatePerSec);

        await stitchFramesToVideo(
            'tmp/output/frame-%04d.png',
            // 'assets/catch-up-loop-119712.mp3',
            'out/video.mp4',
            durationSec,
            frameRatePerSec,
        );

        // Clean up temporary files
        for (const path of ['tmp/output']) {
            if (fs.existsSync(path)) {
                await fs.promises.rm(path, { recursive: true });
            }
            await fs.promises.mkdir(path, { recursive: true });
        }
    })

    // Read data from text
    const inputPath = '../data/testinput';
    const fileName = path.join(__dirname, inputPath);

    const data = await asyncReadFiles(fileName);
    console.log(minPathfinder(data, dijkstraEmitter));
})()
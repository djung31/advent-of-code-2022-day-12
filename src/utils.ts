import ffmpeg from 'fluent-ffmpeg';
import type { VisualizerData } from './pathfinding';

export async function stitchFramesToVideo(
  framesFilepath: string,
//   soundtrackFilePath,
  outputFilepath: string,
  duration: number,
  frameRate: number,
) {

  await new Promise<void>((resolve, reject) => {
    ffmpeg()

      // Tell FFmpeg to stitch all images together in the provided directory
      .input(framesFilepath)
      .inputOptions([
        // Set input frame rate
        `-framerate ${frameRate}`,
      ])

    //   // Add the soundtrack
    //   .input(soundtrackFilePath)
    //   .audioFilters([
    //     // Fade out the volume 2 seconds before the end
    //     `afade=out:st=${duration - 2}:d=2`,
    //   ])

      .videoCodec('libx264')
      .outputOptions([
        '-vf scale=iw*5:ih*5', // scale multiply by 5
        // YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
        // video players
        '-pix_fmt yuv420p',
      ])

      // Set the output duration. It is required because FFmpeg would otherwise
      // automatically set the duration to the longest input, and the soundtrack might
      // be longer than the desired video length
      .duration(duration)
      // Set output frame rate
      .fps(frameRate)

      // Resolve or reject (throw an error) the Promise once FFmpeg completes
      .saveToFile(outputFilepath)
      .on('end', () => resolve())
      .on('error', (error, stdout, stderr) => {
        console.log(error.message)
        console.log(stdout);
        console.log(stderr)
        reject(new Error(error))
      });
  })
}


// Calculate [R,G,B,A] value along a 
// linear green -> yellow -> red gradient
const normalizedColor = (fraction: number) => {
    let percent = fraction * 100;
    if (percent === 100) {
        percent = 99
    }
    const b = 0;
    let r, g;
    if (percent < 50) {
        // green to yellow
        r = Math.floor(255 * (percent / 50));
        g = 255;
    } else {
        // yellow to red
        r = 255;
        g = Math.floor(255 * ((50 - percent % 50) / 50));
    }

    return [r, g, b, 255];
}

// Returns shades of gray
const normalizedGray = (fraction: number) => {
    return [255 * fraction, 255 * fraction, 255* fraction, 255];
}

export const createUint8rgba = (nestedArray: VisualizerData[][], scaleFactor: number): Uint8ClampedArray => {
    // Converts a height object into a single pixel color
    // If not yet visited:
    // Height is plotted from black to gray to white
    // If visited:
    // Height is plotted from green to red
    // If on current examined path:
    // Is black
    const convertHeightData = (heightData: VisualizerData) => {
        const { value, wasVisited, isOnCurrentNodeMinPath } = heightData;

        // black
        if (isOnCurrentNodeMinPath) {
            return [0, 0, 0, 255];
        }

        let numVal;
        switch (value) {
            case "S":
                numVal = "a".charCodeAt(0) - 97;
                break;
            case "E":
                numVal = "z".charCodeAt(0) - 97;
                break;
            default:
                numVal = value.charCodeAt(0) - 97;
                break;
        }

        // gray
        if (!wasVisited) {
            const rgbVal = numVal/25;
            return normalizedGray(rgbVal);
        }

        // color
        return normalizedColor(numVal/25)
    };

    // Takes nested VisualizerData grid and returns [R, G, B, A, R, G, B, A...]
    const convertNestedArraysToLinearPixelValues = (input: VisualizerData[][]) => {
        // console.log(input.map(i => i.map(c => c.wasVisited ? '#' : '.').join('')).join('\n'))
        // console.log(input.flatMap(h => h.map(convertHeightData)))
        return Uint8ClampedArray.from(input.flat().map(h => convertHeightData(h)).flat());
    }

    // Duplicates entries according to integer scale factor
    const scale2DArray = (testArr: (VisualizerData)[][], scaler: number) => {
        const wideRows = testArr.map(row => row.flatMap(val => new Array(scaler).fill(val)));
        const arr = wideRows.flatMap((row) => new Array(scaler).fill('').map(() => [...row]));
        return arr;
    }

    const imageDataArray = convertNestedArraysToLinearPixelValues(scale2DArray(nestedArray, scaleFactor));
    return imageDataArray;
}

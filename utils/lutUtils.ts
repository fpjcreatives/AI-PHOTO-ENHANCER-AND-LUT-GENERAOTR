/**
 * Generates a neutral 64x64x64 HALD CLUT image as a 512x512 PNG data URL.
 * This is the standard identity LUT used as a base for color transformations.
 * @returns A promise that resolves with the data URL of the neutral HALD image.
 */
export const generateNeutralHaldImage = (): Promise<string> => {
    return new Promise((resolve) => {
        const size = 512; // 64 * 8
        const cubeSize = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Could not create canvas context for HALD generation.');
        }

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;

        let i = 0;
        for (let b = 0; b < cubeSize; b++) {
            for (let g = 0; g < cubeSize; g++) {
                for (let r = 0; r < cubeSize; r++) {
                    data[i++] = Math.floor((r * 255) / (cubeSize - 1));
                    data[i++] = Math.floor((g * 255) / (cubeSize - 1));
                    data[i++] = Math.floor((b * 255) / (cubeSize - 1));
                    data[i++] = 255; // Alpha
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
    });
};

/**
 * Converts a color-graded HALD image data URL into a .cube file string.
 * @param haldImageUrl The data URL of the color-graded 512x512 HALD image.
 * @returns A promise that resolves with the contents of the .cube file.
 */
export const convertHaldToCube = (haldImageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const size = 512;
            const cubeSize = 64;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            if (!ctx) {
                return reject(new Error('Could not get canvas context for HALD conversion.'));
            }

            // Draw the source image to the canvas, resizing it to 512x512 in the process.
            // This acts as a safeguard if the AI model returns a different size (e.g., 1024x1024).
            ctx.drawImage(image, 0, 0, size, size);
            
            const imageData = ctx.getImageData(0, 0, size, size).data;
            
            let cubeFile = `TITLE "AI Generated LUT"\n`;
            cubeFile += `LUT_3D_SIZE ${cubeSize}\n`;
            cubeFile += `DOMAIN_MIN 0.0 0.0 0.0\n`;
            cubeFile += `DOMAIN_MAX 1.0 1.0 1.0\n\n`;

            let i = 0;
            for (let b = 0; b < cubeSize; b++) {
                for (let g = 0; g < cubeSize; g++) {
                    for (let r = 0; r < cubeSize; r++) {
                        const red = imageData[i++] / 255.0;
                        const green = imageData[i++] / 255.0;
                        const blue = imageData[i++] / 255.0;
                        i++; // Skip alpha

                        cubeFile += `${red.toFixed(6)} ${green.toFixed(6)} ${blue.toFixed(6)}\n`;
                    }
                }
            }
            
            resolve(cubeFile);
        };
        image.onerror = (error) => reject(error);
        image.src = haldImageUrl;
    });
};
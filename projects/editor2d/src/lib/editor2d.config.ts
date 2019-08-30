import { FeetToPixel } from './model/feetToPixel';

export class Editor2DConfig extends FeetToPixel {  
    
    paperConfig = {
        gridGap: 10,
        containerHeight: 800,
        containerWidth: 800,
        ratio: 1,
        offset: 3,
        xLabels: [],
        yLabels: [],
        data: {
            offset: 30,
            width: 420,
            height: 300,
            viewboxOffset: 30,
            viewboxRatio: this.calFeetToPixel(420, 300, 30, 'svg_canvas'),
        }        
    };

    corridorConfig = {
        x: 10,
        y: 10,
        w: 1,
        h: 30 * this.paperConfig.data.viewboxRatio,
        g: 10 * this.paperConfig.data.viewboxRatio,
        gridSize: 10 // in feet
    };

    freeFormConfig = {  
        radius: 5, // Radius for circle drawn at the end of the line
        ignoreDeviation: 10, // Snapping correction of line to the nearest point
        ratioOne: 1 // Snapping correction of line to the nearest point it stays same as '1'
    };
}
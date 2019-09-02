import { FeetToPixel } from './model/feetToPixel';

export class Editor2DConfig extends FeetToPixel {  
    // TODO: Needs to remove unused variables to make it DRY
    paperConfig = {
        gridGap: 10, // Gap between two Grid lines
        containerHeight: 800, // Height of the Paper
        containerWidth: 800, // Width of the Paper
        ratio: this.calFeetToPixel(420, 300, 30, 'svg_paper'), // Pixel to Feet Ratio
        offset: 3, // Paper offset for coordinates(0,0) start point
        xLabels: [], // Labels stored for x Axis
        yLabels: [], // Labels stored for y Axis
        // ============ Paper Configuration ===========//    
        data: {
            offset: 30,
            width: 420,
            height: 300,
            viewboxOffset: 30,
            viewboxRatio: this.calFeetToPixel(420, 300, 30, 'svg_paper'),
        }        
    };

    corridorConfig = {
        x: 10, // x Axis of corridor
        y: 10, // y Axis of corridor
        w: 1, //  Default widht of corridor  
        h: 30 * this.paperConfig.data.viewboxRatio, // Height of the one sided corridor 
        g: 10 * this.paperConfig.data.viewboxRatio, // Gap between two corridor sides
        gridSize: 10 // Gap between two Grid lines
    };

    freeFormConfig = {  
        radius: 5, // Radius for circle drawn at the end of the line
        ignoreDeviation: 10, // Snapping correction of line to the nearest point
        ratioOne: 1 // Snapping correction of line to the nearest point it stays same as '1'
    };
}
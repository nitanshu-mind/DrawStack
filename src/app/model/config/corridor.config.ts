import {PaperConfig} from './paper.config';
export class CorridorConfig{
    corridorConfig = {
        x: 10,
        y: 10,
        w: 1,
        h: 30 * this.paperConfig.viewboxRatio,
        g: 10 * this.paperConfig.viewboxRatio,
        gridSize: 10 // in feet
      };
}
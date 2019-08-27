import { PaperConfig } from './paper.config';
export class CorridorConfig {
  paperConfig: PaperConfig = new PaperConfig();
  corridorConfig = {
    x: 10,
    y: 10,
    w: 1,
    h: 30 * this.paperConfig.additionalPaperConfig.viewboxRatio,
    g: 10 * this.paperConfig.additionalPaperConfig.viewboxRatio,
    gridSize: 10 // in feet
  };
}
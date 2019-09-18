import { FeetToPixel } from './model/feetToPixel';

export class Editor2DConfig extends FeetToPixel {
  // TODO: Needs to remove unused variables to make it DRY

  // Client Screen Area
  screenArea = {
    Width: document.getElementById('svg_paper').clientWidth,
    Height: document.getElementById('svg_paper').clientHeight
  };

  // Drawing area
  drawingProperty = {
    height: 300, //Passing for ratio calculation
    width: 420 //Passing for ratio calculation
  };

  viewPortConfig = {
    // Drawable axis area width configuration
    offset:30,
    widthConfig: {
      vpw: 420, // Viewport width
      vlo: -400, // Viewport Left Offset
      vro: 380   // Viewport Right Offset
    },
    // Drawable axis height configuration
    heightConfig: {
      vph: 300, // Viewport height
      vto: -300, // Viewport top offset
      vbo: 300   // Viewport bottom offset
    }
  };

  ratio = {
    cr: this.calFeetToPixel(this.drawingProperty.width, this.drawingProperty.height, 30, 'svg_paper')
  };

  canVasConfig = {
    width: this.snapInitPoint(this.screenArea.Width, 10, this.ratio.cr),
    height: this.snapInitPoint(this.screenArea.Height, 10, this.ratio.cr),
  };

  paperConfig = {
    canVasConfig: this.canVasConfig,  // Canvas size {width,height}
    viewPortConfig: this.viewPortConfig, // Drawable axis area configuration
    gridGap: 10, // Gap between two Grid lines
    //drawable: this.drawingProperty,
    ratio: this.ratio.cr, //this.calFeetToPixel(this.drawingProperty.width, this.drawingProperty.height, 30, 'svg_paper'), // Pixel to Feet Ratio
    offset: 3, // Paper offset for coordinates(0,0) start point
    xLabels: [], // Labels stored for x Axis
    yLabels: [], // Labels stored for y Axis
    xPaths:[],
    yPaths:[],
    xBoldPaths:[],
    yBoldPaths:[],
    // ============ Paper Configuration ===========//
    data: {
      offset: 30,
      width: 420,
      height: 300,
      viewboxOffset: 30,
      viewboxRatio: this.ratio.cr,
    }
  };

  corridorConfig = {
    x: 10, // x Axis of corridor
    y: 10, // y Axis of corridor
    w: 1, //  Default width of corridor
    h: 30 * this.paperConfig.data.viewboxRatio, // Height of the one sided corridor
    g: 10 * this.paperConfig.data.viewboxRatio, // Gap between two corridor sides
    gridSize: 10 // Gap between two Grid lines
  };

  freeFormConfig = {
    radius: 5, // Radius for circle drawn at the end of the line
    ignoreDeviation: 10, // Snapping correction of line to the nearest point
    ratioOne: 1 // Snapping correction of line to the nearest point it stays same as '1'
  };

  snapInitPoint(point, gridSize, ratio): number {
    var gridSizeInPX = gridSize * ratio;
    let pt = Math.floor(point / gridSizeInPX) * gridSizeInPX;
    let deviation = point % (gridSizeInPX);
    if (deviation > gridSizeInPX / 2)
      pt = pt + (gridSizeInPX);
    return pt;
  }
}

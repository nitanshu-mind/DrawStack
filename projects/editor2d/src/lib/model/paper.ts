import { Editor2DConfig } from '../editor2d.config';

export class Paper extends Editor2DConfig{

  public drawAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid) {
    let paperWidth = paper.width,
      paperHeight = paper.height,
      paperCenterOfX = containerWidth / 2,
      paperCenterOfY = containerHeight / 2;
    this.drawXAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperCenterOfY)
    this.drawYAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperWidth, paperHeight, paperCenterOfX)
  }
  
  private drawXAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperCenterOfY) {
    for (var i = gridGap * ratio * -30, j = -33; i <= containerWidth; i += gridGap * ratio, j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (containerHeight + (gridGap * ratio * 30))).attr({ "stroke": "#696969", "stroke-width": 0.50 });
        }
        let xAxisPoints = paper.text(i, paperCenterOfY, j * gridGap).attr({ "fill": "blue", "font-size": 10 });
        xAxisPoints.transform('t0,' + (paperCenterOfY - 10));
        this.paperConfig.xLabels.push(xAxisPoints);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (containerHeight + (gridGap * ratio * 30))).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
  }

  private drawYAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperWidth, paperHeight, paperCenterOfX) {
    for (var i = gridGap * ratio * -30, j = -33; i <= containerHeight; i += gridGap * ratio, j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          // debugger
          paper.path("M" + (gridGap * ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.50 });
        }
        let yAxisPoints = paper.text(paperCenterOfX, (paperHeight - i), j * gridGap).attr({ "fill": "blue", "font-size": 10 });
        yAxisPoints.transform('t' + (-paperCenterOfX + 10) + ",0");
        this.paperConfig.yLabels.push(yAxisPoints);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + (gridGap * ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
  }
}
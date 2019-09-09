import { Editor2DConfig } from '../editor2d.config';
declare const loadSVGCorridor: any;

export class Paper extends Editor2DConfig {
  paper: any;
  tranformX = 9;
  tranformY = 5;
  xAxisText: any;
  yAxisText: any;
  rullerLeft = document.getElementById('ruller_left');
  rullerBottom = document.getElementById('ruller_bottom');
  rullerLeftPaper: any;
  rullerBottomPaper: any;

  constructor(paper, rullerLeftPaper, rullerBottomPaper) {
    super();
    this.paper = paper;
    this.rullerLeftPaper = rullerLeftPaper;
    this.rullerBottomPaper = rullerBottomPaper;
  }

  public drawAxis(paper, rullerLeftPaper, rullerBottomPaper, isDrawGrid) {
    let paperWidth = paper.width,
      paperHeight = paper.height,
      paperCenterOfX = this.paperConfig.containerWidth / 2,
      paperCenterOfY = this.paperConfig.containerHeight / 2;

    this.drawXAxis(paper, rullerLeftPaper, rullerBottomPaper, isDrawGrid)
    this.drawYAxis(paper, paperWidth, paperHeight, paperCenterOfX, rullerLeftPaper, rullerBottomPaper, isDrawGrid);
  }

  //
  private drawXAxis(paper, rullerLeftPaper, rullerBottomPaper, isDrawGrid, ) {
    for (var i = this.paperConfig.gridGap * this.paperConfig.ratio * -30, j = -33; i <= this.paperConfig.containerWidth; i += (this.paperConfig.gridGap * this.paperConfig.ratio), j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (this.paperConfig.drawableHeight * this.paperConfig.ratio)).attr({ "stroke": "#696969", "stroke-width": 0.50 });
          this.xAxisText = rullerBottomPaper.text(i, 0, j * this.paperConfig.gridGap).attr({ "fill": "blue", "font-size": 10 });
        }
        this.xAxisText.transform('t0,' + this.tranformY);
        this.paperConfig.xLabels.push(this.xAxisText);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (this.paperConfig.drawableHeight * this.paperConfig.ratio)).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
  }

  private drawYAxis(paper, paperWidth, paperHeight, paperCenterOfX, rullerLeftPaper, rullerBottomPaper, isDrawGrid) {
    for (var i = (this.paperConfig.gridGap * this.paperConfig.ratio * -30), j = -33; i <= this.paperConfig.containerHeight; i += (this.paperConfig.gridGap * this.paperConfig.ratio), j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          paper.path("M" + (this.paperConfig.gridGap * this.paperConfig.ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.50 });
          this.yAxisText = rullerLeftPaper.text(0, (paperHeight - i), j * this.paperConfig.gridGap).attr({ "fill": "blue", "font-size": 10 });
        }
        this.yAxisText.transform('t' + (this.tranformX) + ",0");
        this.paperConfig.yLabels.push(this.yAxisText);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + (this.paperConfig.gridGap * this.paperConfig.ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
  }

  drawing2DArea(paper, svgUrl) {
    paper.image(svgUrl,
      this.paperConfig.data.viewboxOffset * this.paperConfig.data.viewboxRatio,
      paper.height - (this.paperConfig.data.height * this.paperConfig.data.viewboxRatio - this.paperConfig.data.viewboxOffset * this.paperConfig.data.viewboxRatio),
      360 * this.paperConfig.data.viewboxRatio,
      240 * this.paperConfig.data.viewboxRatio
    )
  }

  resetView(paper, rullerLeftPaper, rullerBottomPaper) {
    paper.clear();
    rullerLeftPaper.clear();
    rullerBottomPaper.clear();
  }
}

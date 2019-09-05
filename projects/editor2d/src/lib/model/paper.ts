import { Editor2DConfig } from '../editor2d.config';
declare const loadSVGCorridor: any;

export class Paper extends Editor2DConfig{
  paper: any;
  tranformX =9;
  tranformY=5;
  xAxisText: any;
  yAxisText: any;
  rullerLeft =document.getElementById('ruller_left');
  rullerBottom = document.getElementById('ruller_bottom');
  rullerLeftPaper: any;
  rullerBottomPaper: any;

  constructor(paper,rullerLeftPaper,  rullerBottomPaper) {
    super();
    this.paper = paper;  
    this.rullerLeftPaper = rullerLeftPaper;
    this.rullerBottomPaper = rullerBottomPaper;  
  }
  public drawAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, rullerLeftPaper, rullerBottomPaper) {
    let paperWidth = paper.width,
      paperHeight = paper.height,
      paperCenterOfX = containerWidth / 2,
      paperCenterOfY = containerHeight / 2;
    this.drawXAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperCenterOfY, rullerLeftPaper, rullerBottomPaper)
    this.drawYAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperWidth, paperHeight, paperCenterOfX, rullerLeftPaper, rullerBottomPaper)    
  }

  private drawXAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperCenterOfY, rullerLeftPaper, rullerBottomPaper) {    
    for (var i = gridGap * ratio * -30, j = -33; i <= containerWidth; i += gridGap * ratio, j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (containerHeight + (gridGap * ratio * 30))).attr({ "stroke": "#696969", "stroke-width": 0.50 });
          this.xAxisText= rullerBottomPaper.text(i,0,j*gridGap).attr({"fill": "blue", "font-size": 10});
        }        
        this.xAxisText.transform('t0,'+this.tranformY);
        this.paperConfig.xLabels.push(this.xAxisText);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (containerHeight + (gridGap * ratio * 30))).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
  }

  private drawYAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid, paperWidth, paperHeight, paperCenterOfX, rullerLeftPaper, rullerBottomPaper) {    
    for (var i = gridGap * ratio * -30, j = -33; i <= containerHeight; i += gridGap * ratio, j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          paper.path("M" + (gridGap * ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.50 });
          this.yAxisText = rullerLeftPaper.text(0,(paperHeight-i),j*gridGap).attr({"fill": "blue", "font-size": 10});
        }           
        this.yAxisText.transform('t'+ (this.tranformX)+",0");
        this.paperConfig.yLabels.push(this.yAxisText);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + (gridGap * ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.25 });
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
import { Editor2DConfig } from '../editor2d.config';
import { ZoomHandler } from './zoomHandler';

declare const loadSVGCorridor: any;

export class Paper extends Editor2DConfig {
  paper: any;
  tranformX = 9;
  tranformY = 5;
  xAxisText: any;
  yAxisText: any;
  //rullerLeft = document.getElementById('ruller_left');
  //rullerBottom = document.getElementById('ruller_bottom');
  rullerLeftPaper: any;
  rullerBottomPaper: any;
  zoovtoandler: ZoomHandler;
  zoomPoint: any;

  constructor(paper, rullerLeftPaper, rullerBottomPaper) {
    super();
    this.paper = paper;
    this.rullerLeftPaper = rullerLeftPaper;
    this.rullerBottomPaper = rullerBottomPaper;
  }

  public drawAxis(paper, isDrawGrid) {
    this.drawXAxis(paper, this.rullerLeftPaper, this.rullerBottomPaper, isDrawGrid);
    this.drawYAxis(paper, this.rullerLeftPaper, this.rullerBottomPaper, isDrawGrid);
  }

  //
  private drawXAxis(paper, rullerLeftPaper, rullerBottomPaper, isDrawGrid) {
    let ratio = this.paperConfig.ratio;
    let vpw = this.paperConfig.viewPortConfig.widthConfig.vpw,
      mw = this.paperConfig.viewPortConfig.widthConfig.vlo,
      pw = this.paperConfig.viewPortConfig.widthConfig.vro,p_offset=this.paperConfig.viewPortConfig.offset;

    let vph = this.paperConfig.viewPortConfig.heightConfig.vph,
      vto = this.paperConfig.viewPortConfig.heightConfig.vto,
      ph = this.paperConfig.viewPortConfig.heightConfig.vbo,pth;

    for (var i = ratio * mw, j = mw-p_offset; i < (pw + vpw) * ratio; i += ratio * this.paperConfig.gridGap, j += this.paperConfig.gridGap) {
      if (j % 50 == 0) {
        pth=paper.path(`M${i},${vto * ratio}L${i},${((ph + vph) * ratio)}`).attr({ "stroke": "#696969", "stroke-width": 0.50 });
        this.paperConfig.xBoldPaths.push(pth);
        pth.attr({ "stroke-width":   0.5});
        this.xAxisText = rullerBottomPaper.text(i, 0, j).attr({ "fill": "blue", "font-size": 10 });
        this.xAxisText.transform('t0,' + this.tranformY);
        this.paperConfig.xLabels.push(this.xAxisText);
      } else
      {
        pth=paper.path(`M${i},${vto * ratio}L${i},${(ph + vph) * ratio}`).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        this.paperConfig.xPaths.push(pth);
      }
    }
  }

  private drawYAxis(paper, rullerLeftPaper, rullerBottomPaper, isDrawGrid) {
    let ratio = this.paperConfig.ratio;

    let vpw = this.paperConfig.viewPortConfig.widthConfig.vpw,
      mw = this.paperConfig.viewPortConfig.widthConfig.vlo,
      pw = this.paperConfig.viewPortConfig.widthConfig.vro,p_offset=this.paperConfig.viewPortConfig.offset;;

    let vph = this.paperConfig.viewPortConfig.heightConfig.vph,
      vto = this.paperConfig.viewPortConfig.heightConfig.vto,
      ph = this.paperConfig.viewPortConfig.heightConfig.vbo,path;

    for (var i = ratio * vto, j = vph + ph-p_offset; i < (ph + vph) * ratio; i += ratio * this.paperConfig.gridGap, j -= this.paperConfig.gridGap) {
      if (j % 50 == 0) {
        path=paper.path(`M ${mw * ratio},${i}L${((pw + vpw) * ratio)},${i}`).attr({ "stroke": "#696969", "stroke-width": 0.50 });
        this.paperConfig.yBoldPaths.push(path);
        this.yAxisText = rullerLeftPaper.text(0, i, j).attr({ "fill": "blue", "font-size": 10 });
        this.yAxisText.transform('t' + (this.tranformX) + ",0");
        this.paperConfig.yLabels.push(this.yAxisText);
      } else{
      path= paper.path(`M${mw * ratio},${i}L${((pw + vpw) * ratio)},${i}`).attr({ "stroke": "#696969", "stroke-width": 0.25 });
      this.paperConfig.yPaths.push(path);
    }

    }
  }

  drawing2DArea(paper, svgUrl) {
    paper.image(svgUrl,
      this.paperConfig.data.viewboxOffset * this.paperConfig.data.viewboxRatio,
      paper.height - (this.paperConfig.data.height * this.paperConfig.data.viewboxRatio - this.paperConfig.data.viewboxOffset * this.paperConfig.data.viewboxRatio),
      360 * this.paperConfig.data.viewboxRatio,
      240 * this.paperConfig.data.viewboxRatio
    );
  }

  resetView(paper, rullerLeftPaper, rullerBottomPaper) {
    paper.clear();
    rullerLeftPaper.clear();
    rullerBottomPaper.clear();
  }


}

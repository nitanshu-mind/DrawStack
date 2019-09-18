import $ from "jquery";
import { PaperConfig } from './userConfig';

declare const svgPanZoom: any;

export class ZoomHandler {
  zoomRatio = 1;
  panZoomInstance: any;
  panAndZoomRullerLeftPaper;
  panAndZoomRullerBottomPaper;
  panLeftPaper = { x: 0, y: 0 };
  panBottomPaper = { x: 0, y: 0 };
  zoomLeftPaper = { x: 0, y: 0 };
  zoomBottomPaper = { x: 0, y: 0 };
  viewportMatrix;
  isPanZoomAplly = false;
  xLabels = [];
  yLabels = [];
  paperConfig:any;
  constructor(paperConfig) {
    this.bindZoomHandler()
    this.paperConfig=paperConfig;
  }

  bindZoomHandler() {
    this.panZoomInstance = svgPanZoom('svg', {
      viewportSelector: 'svg',
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: false,
      fit: false,
      center: false,
      dblClickZoomEnabled: false,
      minZoom: 0.5,
      maxZoom: 30,
      onZoom: (newZoom) => {
        this.isPanZoomAplly = true;
        this.zoomRatio = newZoom;
        var ele = $('.svg-pan-zoom_viewport')[0];
        this.viewportMatrix = ele.transform.baseVal.consolidate().matrix;
        var viewboxSizes = this.panZoomInstance.getSizes();
        this.maintainFontSize(newZoom);
        this.maintainStrokeWidth(newZoom);
        var mouseMovepoint = this.panZoomInstance.getMouseMovePoint();
        this.zoomLeftPaper = { x: 0, y: mouseMovepoint.y };
        this.zoomBottomPaper = { x: mouseMovepoint.x, y: 0 };
        this.panAndZoomRullerLeftPaper.zoomAtPoint(newZoom, this.zoomLeftPaper);
        this.panAndZoomRullerBottomPaper.zoomAtPoint(newZoom, this.zoomBottomPaper);
      },
      onPan: (newPan) => {
        this.panLeftPaper = { x: 0, y: newPan.y };
        this.panBottomPaper = { x: newPan.x, y: 0 };
        this.panAndZoomRullerLeftPaper.pan(this.panLeftPaper);
        this.panAndZoomRullerBottomPaper.pan(this.panBottomPaper)
      }
    });

    this.panAndZoomRullerLeftPaper = svgPanZoom('#rullerLeftPaper', {
      zoomEnabled: false,
      panEnabled: false,
      controlIconsEnabled: false,
      fit: false,
      center: false,
      dblClickZoomEnabled: false,
      minZoom: 0.5,
      maxZoom: 30
    });

    this.panAndZoomRullerBottomPaper = svgPanZoom('#rullerBottomPaper', {
      zoomEnabled: false,
      panEnabled: false,
      controlIconsEnabled: false,
      fit: false,
      center: false,
      dblClickZoomEnabled: false,
      minZoom: 0.5,
      maxZoom: 30
    });
  }

  destroyPanZoom() {
    this.panZoomInstance.destroy();
    delete this.panZoomInstance;
    this.panAndZoomRullerLeftPaper.destroy();
    delete this.panAndZoomRullerLeftPaper
    this.panAndZoomRullerBottomPaper.destroy();
    delete this.panAndZoomRullerBottomPaper
  }

  maintainFontSize(zoomRatio) {
    var trX = "t0," + (10 / zoomRatio);
    var trY = "t" + (10 / zoomRatio) + ",0";
    for (var i = 0; i <  this.paperConfig.xLabels.length; i++) {
      this.paperConfig.xLabels[i].transform(` ${trX} s${1.5 / zoomRatio}`);
    }
    for (var i = 0; i < this.paperConfig.yLabels.length; i++) {
      this.paperConfig.yLabels[i].transform(`${trY}s${1 / zoomRatio}`);
    }
  }

  maintainStrokeWidth(zoomRatio) {
    var trX = "t0," + (10 / zoomRatio);
    var trY = "t" + 10 / zoomRatio + ",0";
    var strokeWidth = .25 / zoomRatio,
      boldStrokeWidth = .50 / zoomRatio;

   for(var i=0; i<this.paperConfig.xPaths.length; i++){
   this.paperConfig.xPaths[i].attr({ "stroke-width":   strokeWidth>0.25? 0.25:strokeWidth});
   }
   for(var i=0; i<this.paperConfig.xBoldPaths.length; i++){
    this.paperConfig.xBoldPaths[i].attr({ "stroke-width":   boldStrokeWidth>0.50? 0.50:boldStrokeWidth});
  }
   for(var i=0; i<this.paperConfig.yPaths.length; i++){
    this.paperConfig.yPaths[i].attr({ "stroke-width": strokeWidth>0.25? 0.25:strokeWidth });
   }
   for(var i=0; i<this.paperConfig.yBoldPaths.length; i++){
    this.paperConfig.yBoldPaths[i].attr({ "stroke-width":  boldStrokeWidth>0.50? 0.50:boldStrokeWidth });
   }


  }
}

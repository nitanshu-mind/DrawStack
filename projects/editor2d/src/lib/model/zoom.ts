declare const svgPanZoom: any;
export class Zoom {
  zoomRatio=1;
  panZoomInstance: any;
  panAndZoomRullerLeftPaper;
  panAndZoomRullerBottomPaper;
  panLeftPaper={x:0,y:0};
  panBottomPaper={x:0,y:0};
  zoomLeftPaper={x:0,y:0};
  zoomBottomPaper={x:0,y:0};
  viewportMatrix;
  isPanZoomAplly = false;
  xLabels = [];
  yLabels = [];  

  destroyPanZoom(){
      this.panZoomInstance.destroy();
      delete this.panZoomInstance;
      this.panAndZoomRullerLeftPaper.destroy();
      delete this.panAndZoomRullerLeftPaper
      this.panAndZoomRullerBottomPaper.destroy();
      delete this.panAndZoomRullerBottomPaper
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
        minZoom: 0,
        maxZoom: 2,
        onZoom: (newZoom) =>{
          this.isPanZoomAplly = true;
          this.zoomRatio = newZoom;
          var ele = $('.svg-pan-zoom_viewport')[0];
          this.viewportMatrix = ele.transform.baseVal.consolidate().matrix;
          debugger
          var viewboxSizes = this.panZoomInstance.getSizes();
          this.clearLabels(newZoom);
          var mouseMovepoint = this.panZoomInstance.getMouseMovePoint();
          this.zoomLeftPaper = {x: 0, y: mouseMovepoint.y};
          this.zoomBottomPaper = {x: mouseMovepoint.x, y: 0};
          this.panAndZoomRullerLeftPaper.zoomAtPoint(newZoom, this.zoomLeftPaper);
          this.panAndZoomRullerBottomPaper.zoomAtPoint(newZoom, this.zoomBottomPaper);
        },       
        onPan : (newPan)=>{
          this.panLeftPaper = {x: 0, y: newPan.y};
          this.panBottomPaper = {x: newPan.x, y: 0};
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
        dblClickZoomEnabled: false
     });
    
     this.panAndZoomRullerBottomPaper = svgPanZoom('#rullerBottomPaper', {
        zoomEnabled: false,
        panEnabled: false,
        controlIconsEnabled: false,
        fit: false,
        center: false,
        dblClickZoomEnabled: false
      });
      this.panZoomInstance.zoom(1)
    }
          
    clearLabels(zoomRatio){
        var trX="t0,"+ (10/zoomRatio);
        var trY="t"+ 10/zoomRatio+",0";
    
        for(var i=0; i<xLabels.length; i++){
            xLabels[i].attr({ "font-size": 10/zoomRatio });
            xLabels[i].transform(trX);
        }
        for(var i=0; i<yLabels.length; i++){
            yLabels[i].attr({ "font-size": 10/zoomRatio });
            yLabels[i].transform(trY);
        }
    }
}
  
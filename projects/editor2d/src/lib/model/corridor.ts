import $ from "jquery";
import { Editor2DConfig } from '../editor2d.config';
import { CorridorDrawPoints } from './corridorDrawPoints';

declare const svgPanZoom: any;

export class Corridor extends Editor2DConfig {
  paper: any;
  shape: any;
  constructor(paper) {
    super();
    this.paper = paper;    
  }
  corridor: CorridorDrawPoints = new CorridorDrawPoints();
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
          var viewboxSizes = this.panZoomInstance.getSizes();
          this.clearLabels(newZoom);
          console.log(this.shape,"shape")
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
    

  drawShape(corridorConfig, containerId, paper, corridor, paperConfig) {    
    var panBy = this.panZoomInstance.getPan(),
    zoomBy = this.panZoomInstance.getZoom(),
      zoom = this.zoomRatio,
      panLeft = this.panLeftPaper,
      panBottom = this.panBottomPaper,
      zoomBottom = this.zoomBottomPaper,
      zoomLeft = this.zoomLeftPaper;    
    var x = corridorConfig.x,
      y = corridorConfig.y,
      w = corridorConfig.w,
      h = corridorConfig.h,
      g = corridorConfig.g,
      isCorridorDrawn = false;
    var topToCenter = corridorConfig.h + corridorConfig.g / 2;
    var ft;
    var startPoint, endPoint;
    let mouseDownX;
    let mouseDownY;
    $("#" + containerId).unbind("mousedown mousemove mouseup");
    // mousedown event
    $("#" + containerId).mousedown((e) => {
      console.log('this', this);
      // Prevent text edit cursor while dragging in webkit browsers
      $("#" + containerId).unbind("mousedown");      
      e.originalEvent.preventDefault();
      var offset = $("#"+containerId).offset();
      mouseDownX = this.snapInitPoint(e.pageX - offset.left, corridorConfig.gridSize, paperConfig.data.viewboxRatio);
      mouseDownY = this.snapInitPoint(e.pageY - offset.top, corridorConfig.gridSize, paperConfig.data.viewboxRatio);
      mouseDownY -= topToCenter;
      if (isCorridorDrawn == true) return false; this.corridor
      this.shape = this.drawCorridor(paper, mouseDownX, mouseDownY, w, h, g);
      ft = paper.freeTransform(this.shape);
    });

    // mousemove event
    $("#" + containerId).mousemove((e) => {
      var zoomPoint;

      if (this.shape) {
        this.shape.remove();
        ft.unplug();
        zoomPoint = this.isPanZoomAplly? this.panZoomInstance.getMouseMovePoint(): null;
        this.destroyPanZoom();
      } else return false;
      console.log(mouseDownX,"mousedownX");
      console.log(mouseDownX/zoom,"mousex/zoom")
      var offset = $("#" + containerId).offset(),
        upX = e.pageX - offset.left,
        upY = e.pageY - offset.top,
        width = this.getDistaanceBetween(300, mouseDownY + topToCenter, upX, upY),
        height = upY - mouseDownY,
        angle = this.getAngle(mouseDownX, mouseDownY + topToCenter, upX, upY);
        width = this.snapInitPoint(width, corridorConfig.gridSize, paperConfig.data.viewboxRatio);
        var   snapValue = corridorConfig.gridSize * paperConfig.viewboxRatio;
        this.shape = this.drawCorridor(paper, mouseDownX, mouseDownY, width, h, g);
        console.log(mouseDownX,mouseDownY,"x,y");
        //shape.transform(`t${-distX},${-distY}`)
        console.log(zoom,"zoom");
        console.log(zoomBottom,"zoomBottom")
      ft = paper.freeTransform(this.shape,{},this.freeTransformHandler.bind(this));
      ft.attrs.rotate = angle;           
      ft.apply();
      this.bindZoomHandler();
      if(zoomPoint){
        this.panZoomInstance.zoomAtPointBy(zoom,{
          x: zoomPoint.x+(mouseDownX-zoomPoint.x)/zoom,
          y: zoomPoint.y+(mouseDownY-zoomPoint.y)/zoom
        });
    
        this.panZoomInstance.panBy({
          x:mouseDownX-(zoomPoint.x+(mouseDownX-zoomPoint.x)/zoom),
          y:mouseDownY- (zoomPoint.y+(mouseDownY-zoomPoint.y)/zoom)
        });
    
        ft.attrs.translate.x -= mouseDownX-(zoomPoint.x+(mouseDownX-zoomPoint.x)/zoom);
        ft.attrs.translate.y -= 17.5+mouseDownY- (zoomPoint.y+(mouseDownY-zoomPoint.y)/zoom);
        ft.apply();
      }
      $("#" + containerId).click((e) => {
        e.originalEvent.preventDefault();
        $("#" + containerId).unbind("mousemove");
        var BBox = this.shape.getBBox();
        if (BBox.width == 0 && BBox.height == 0) this.shape.remove();
      });
    });
    return this.corridor;
  }

  freeTransformHandler(ft, events) {
    let handles = ft.handles;
    let startPoint;
    let endPoint;
    if (handles && handles.y) {
      startPoint = { x: handles.y.disc.attrs.cx, y: handles.y.disc.attrs.cy };
      endPoint = { x: handles.x.disc.attrs.cx, y: handles.x.disc.attrs.cy };
      console.log(this.paperConfig)
      var snapStartPoint = {
        x: this.snapInitPoint(
          ((startPoint.x - this.paperConfig.data.offset * this.paperConfig.data.viewboxRatio) / this.paperConfig.data.viewboxRatio).toFixed(2),
          this.corridorConfig.gridSize, 1),
        y: this.snapInitPoint(
          ((this.paper.height - this.paperConfig.data.offset * this.paperConfig.data.viewboxRatio - startPoint.y) / this.paperConfig.data.viewboxRatio).toFixed(2),
          this.corridorConfig.gridSize, 1),
      };

      this.corridor.rotate = ft.attrs.rotate.toFixed(2);
      this.corridor.ratio = this.paperConfig.data.viewboxRatio;
      this.corridor.sp = {
        x: snapStartPoint.x,
        y: snapStartPoint.y,
        z: 0
      };
      this.corridor.ep = {
        x: ((endPoint.x - this.paperConfig.data.offset * this.paperConfig.data.viewboxRatio) / this.paperConfig.data.viewboxRatio).toFixed(2),
        y: ((this.paper.height - this.paperConfig.data.offset * this.paperConfig.data.viewboxRatio - (endPoint.y)) / this.paperConfig.data.viewboxRatio).toFixed(2),
        z: 0
      };
      this.corridor.paper = { width: this.paper.width, height: this.paper.height };
      this.corridor.bbox = this.shape.getBBox();

      if(events[0] == "drag start" || events[0] == "rotate start" || events[0] == "scale start"){
        if(this.panZoomInstance){
          this.panZoomInstance.disablePan();
        }
      };

      if (events[0] == "drag end" || events[0] == "rotate end" || events[0] == "scale end") {
        var cx = this.snapInitPoint(startPoint.x, this.corridorConfig.gridSize, this.paperConfig.data.viewboxRatio),
          cy = this.snapInitPoint(startPoint.y, this.corridorConfig.gridSize, this.paperConfig.data.viewboxRatio);  
          let snapValue = this.corridorConfig.gridSize * this.paperConfig.data.viewboxRatio,
          distX = startPoint.x - Math.round(startPoint.x / snapValue) * snapValue,
          distY = startPoint.y - Math.round(startPoint.y / snapValue) * snapValue;

        ft.attrs.translate.x -= distX;
        ft.attrs.translate.y -= distY;        
        ft.apply();

        this.corridor.sp = {
          x: this.snapInitPoint(cx, this.corridorConfig.gridSize, 1),
          y: this.snapInitPoint(cy, this.corridorConfig.gridSize, 1),
          z: 0
        };
        this.corridor.ep = {
          x: endPoint.x.toFixed(2),
          y: (this.paper.height - endPoint.y).toFixed(2),
          z: 0
        };
        this.panZoomInstance.enablePan();
      }
    }
  };

  drawCorridor(paper, x, y, w, h, g) {
    var element = paper.path(`M ${x},${y}  L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} L ${x}, ${y} z` +
      `M ${x},${y + h + g}  L ${x + w},${y + h + g} L ${x + w},${2 * h + y + g} L ${x},${2 * h + y + g} L ${x},${y + h + g} z`)
      .attr({ 'fill': '#D3D3D3', "stroke": '#D3D3D3' })
    this.selectElement(element, x, y);
    element.class = "drawCorridor";
    return element;
  }

  selectElement(element, x, y) {
    $(element.node).attr('id', 'path' + x + y);
    element.click(function (e) {
      $(element.node).attr('id');
    });
  }

  /**
       * Fetches angle between centre of x and y and current x  and y
       * where 3 O'Clock is 0 and 12 O'Clock is 270 degrees
       *
       * @param cx centre of x co-ordinate
       * @param cy centre of y co-ordinate
       * @param x current mouse x co-ordinate
       * @param y current mouse y co-ordinate
       * @return angle in degress from 0-360.
  */

  getAngle(cx, cy, x, y) {
    var dx = x - cx;
    // Minus to correct for coord re-mapping
    var dy = -(y - cy);
    var inRads = Math.atan2(dy, dx);
    // We need to map to coord system when 0 degree is at 3 O'clock, 270 at 12 O'clock
    if (inRads < 0)
      inRads = Math.abs(inRads);
    else
      inRads = 2 * Math.PI - inRads;
    return inRads * 180 / Math.PI;
  }

  getWidth(w, h) {
    return Math.sqrt(w * w + h * h);
  }

  getDistaanceBetween(cx, cy, mx, my) {
    return this.getWidth(cx - mx, cy - my);
  }

  roundDown(number, modulus) {
    var remainder = number % modulus;
    if (remainder == 0) {
      return number;
    } else {
      return number - remainder;
    }
  }

  snapPoint(point, gridSize, ratio) {
    return this.snapInitPoint(point, gridSize, ratio);
  }

  snapInitPoint(point, gridSize, ratio): any {
    console.log(point, gridSize, ratio, "point,gridSize, ratio")
    var gridSizeInPX = gridSize * ratio;
    let p = Math.floor(point / gridSizeInPX) * gridSizeInPX;
    let deviation = point % (gridSizeInPX);
    if (deviation > gridSizeInPX / 2)
      p = p + (gridSizeInPX)    
      console.log(p, "p")
      return p;
  }

  getPoint(obj) {
    return { x: obj.attrs.cx, y: obj.attrs.cy }
  }

  getUpdateCorridorPath(paper, x, y, w, h, g) {
    var path = `M ${x},${y}  L ${x+w},${y} L ${x+w},${y+h} L ${x},${y+h} L ${x}, ${y} z` +
        `M ${x},${y+h+g}  L ${x+w},${y+h+g} L ${x+w},${2*h+y+g} L ${x},${2*h+y+g} L ${x},${y+h+g} z`
     
    return path;                
  }

  clearLabels(zoomRatio){
    var trX="t0,"+ (10/zoomRatio);
    var trY="t"+ 10/zoomRatio+",0";

    for(var i=0; i< this.xLabels.length; i++){
      this.xLabels[i].attr({ "font-size": 10/zoomRatio });
      this.xLabels[i].transform(trX);
    }
    for(var i=0; i<this.yLabels.length; i++){
      this.yLabels[i].attr({ "font-size": 10/zoomRatio });
      this.yLabels[i].transform(trY);
    }
}
}



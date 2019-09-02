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

  drawShape(corridorConfig, containerId, paper, corridor, paperConfig) {
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
      if (this.shape) {
        this.shape.remove();
        ft.unplug();
      } else return false;

      var offset = $("#" + containerId).offset(),
        upX = e.pageX - offset.left,
        upY = e.pageY - offset.top,
        width = this.getDistaanceBetween(mouseDownX, mouseDownY + topToCenter, upX, upY),
        height = upY - mouseDownY,
        angle = this.getAngle(mouseDownX, mouseDownY + topToCenter, upX, upY);
        width = this.snapInitPoint(width, corridorConfig.gridSize, paperConfig.data.viewboxRatio);
        this.shape = this.drawCorridor(paper, mouseDownX, mouseDownY, width, h, g);
      ft = paper.freeTransform(this.shape,{},this.freeTransformHandler.bind(this));
      ft.attrs.rotate = angle;           
      ft.apply();

      $("#" + containerId).click((e) => {
        e.originalEvent.preventDefault();
        $("#" + containerId).unbind("mousemove");
        var BBox = this.shape.getBBox();
        if (BBox.width == 0 && BBox.height == 0) this.shape.remove();
        // this.bindZoomHandler()
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

      // if(events[0] == "drag start" || events[0] == "rotate start" || events[0] == "scale start"){
      //   if(panZoomInstance){
      //     panZoomInstance.disablePan();
      //   }
      // };

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
        // this.bindZoomHandler();
        // panZoomInstance.enablePan();
      }
    }
  };

  drawCorridor(paper, x, y, w, h, g) {
    var element = paper.path(`M ${x},${y}  L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} L ${x}, ${y} z` +
      `M ${x},${y + h + g}  L ${x + w},${y + h + g} L ${x + w},${2 * h + y + g} L ${x},${2 * h + y + g} L ${x},${y + h + g} z`)
      .attr({ 'fill': '#D3D3D3', "stroke": '#D3D3D3' })
    this.selectElement(element, x, y);
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

  bindZoomHandler = function () {
    let panZoomInstance = svgPanZoom('svg', {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: false,
      minZoom: 0,
      maxZoom: 2,
      onZoom: function (newZoom) {
        var ele = $('.svg-pan-zoom_viewport')[0];
        var viewportMatrix = ele.transform.baseVal.consolidate().matrix;
        var viewboxSizes = panZoomInstance.getSizes();
        // clearLabels(newZoom, viewportMatrix, viewboxSizes);
      },
      beforePan: function (oldPan, newPan) {
        console.log("pan....")
      }
    });
  }

  getPoint(obj) {
    return { x: obj.attrs.cx, y: obj.attrs.cy }
  }
}

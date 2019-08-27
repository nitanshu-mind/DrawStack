import $ from "jquery";
import { CorridorConfig } from './config/corridor.config';
declare const svgPanZoom: any;

export class Corridor {
  x: number;
  y: number;
  w: number;
  h: number;
  g: number;
  gridSize: number;

  drawShape(corridorConfig, containerId, paper, corridor, paperConfig) {
    var x = corridorConfig.x,
      y = corridorConfig.y,
      w = corridorConfig.w,
      h = corridorConfig.h,
      g = corridorConfig.g,
      isCorridorDrawn = false;
    var topToCenter = corridorConfig.h + corridorConfig.g / 2;
    var ft;
    let shape;
    var startPoint, endPoint;
    let mouseDownX;
    let mouseDownY;
    $("#" + containerId).unbind("mousedown");
    $("#" + containerId).unbind("mousemove");
    $("#" + containerId).unbind("mouseup");
    // mousedown event
    $("#" + containerId).mousedown((e) => {
      console.log('this', this);
      // Prevent text edit cursor while dragging in webkit browsers
      $("#" + containerId).unbind("mousedown");
      $("#" + containerId).unbind("mousedown");
      e.originalEvent.preventDefault();
      var offset = $("#svg_paper").offset();
      mouseDownX = this.snapInitPoint(e.pageX - offset.left, corridorConfig.gridSize, paperConfig.additionalPaperConfig.viewboxRatio);
      mouseDownY = this.snapInitPoint(e.pageY - offset.top, corridorConfig.gridSize, paperConfig.additionalPaperConfig.viewboxRatio);
      mouseDownY -= topToCenter;
      if (isCorridorDrawn == true) return false;
      shape = this.drawCorridor(paper, mouseDownX, mouseDownY, w, h, g);
      ft = paper.freeTransform(shape);
    });

    // mousemove event
    $("#" + containerId).mousemove((e) => {
      if (shape) {
        shape.remove();
        ft.unplug();
      } else return false;

      var offset = $("#" + containerId).offset(),
        upX = e.pageX - offset.left,
        upY = e.pageY - offset.top,
        width = this.getDistaanceBetween(mouseDownX, mouseDownY + topToCenter, upX, upY),
        height = upY - mouseDownY,
        angle = this.getAngle(mouseDownX, mouseDownY + topToCenter, upX, upY);
      width = this.snapInitPoint(width, corridorConfig.gridSize, paperConfig.additionalPaperConfig.viewboxRatio);
      shape = this.drawCorridor(paper, mouseDownX, mouseDownY, width, h, g);
      ft = paper.freeTransform(
        shape,
        {
          snap: { drag: corridorConfig.gridSize * paperConfig.additionalPaperConfig.viewboxRatio },
          snapDist: {
            drag: corridorConfig.gridSize * paperConfig.additionalPaperConfig.viewboxRatio
          }

        },
        // this.freeTransformHandler
      );
      ft.attrs.rotate = angle;
      ft.apply();


      $("#" + containerId).click((e) => {
        e.originalEvent.preventDefault();
        $("#" + containerId).unbind("mousemove");
        var BBox = shape.getBBox();
        if (BBox.width == 0 && BBox.height == 0) shape.remove();
        // this.bindZoomHandler()
      });
    });
  }

  drawCorridor(paper, x, y, w, h, g) {
    var element = paper.path(`M ${x},${y}  L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} L ${x}, ${y} z` +
      `M ${x},${y + h + g}  L ${x + w},${y + h + g} L ${x + w},${2 * h + y + g} L ${x},${2 * h + y + g} L ${x},${y + h + g} z`)
      .attr({ 'fill': '#D3D3D3', "stroke": '#D3D3D3' })
    this.selectElement(element, x, y);
    return element;
  }

  // draw corridor
  drawCircle(paper, x, y, w) {
    var element = paper.circle(x, y, 5);
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
}
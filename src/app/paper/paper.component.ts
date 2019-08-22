import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaperConfig } from './paper.config'
import {Corridor} from '../model/corridor';
import * as $ from "jquery";
declare const svgPanZoom: any;
declare const Raphael: any; // 

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})

export class PaperComponent implements OnInit {

  paper: any;
  corridor: any;
  corridorConfig:Corridor
  paperConfig: { offset: any; width: any; height: any; viewboxOffset: any; viewboxRatio: any; };
  @ViewChild('view2d', { static: true })
  private canvasRef: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor() {
    console.log(this.canvasRef, '=============')
    this.paperConfig = this.getPaperConfig(420, 300, 30, 'svg_paper');
  }
  
  ngOnInit() {
    console.log(this.canvas, '===========================dsfasdfasdfas');

    this.corridorConfig = {
      x: 10,
      y: 10,
      w: 1,
      h: 30 * this.paperConfig.viewboxRatio,
      g: 10 * this.paperConfig.viewboxRatio,
      gridSize: 10 // in feet
    };
    this.paper = Raphael('container', PaperConfig.containerWidth, PaperConfig.containerHeight);
    this.drawAxis(this.paper, PaperConfig.gridGap, PaperConfig.offset, PaperConfig.ratio, PaperConfig.containerWidth, PaperConfig.containerHeight, true);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.drawShape(this.corridorConfig, 'svg_paper', this.paper, this.corridor, this.paperConfig);
  }

  getPaperConfig = function(width, height, viewboxOffset, canvasId) {
    let data = {
      offset: viewboxOffset,
      width: width,
      height: height,
      viewboxOffset: viewboxOffset,
      viewboxRatio: this.calFeetToPixel(width, height, viewboxOffset, canvasId),    
    };
    return data;
  }
 
  drawAxis(paper, gridGap, offset, ratio, containerWidth, containerHeight, isDrawGrid) {
    let paperWidth = paper.width,
      paperHeight = paper.height,
      paperCenterOfX = containerWidth / 2,
      paperCenterOfY = containerHeight / 2;

    for (var i = gridGap * ratio * -30, j = -33; i <= containerWidth; i += gridGap * ratio, j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (containerHeight + (gridGap * ratio * 30))).attr({ "stroke": "#696969", "stroke-width": 0.50 });
        }
        let xAxisPoints = paper.text(i, paperCenterOfY, j * gridGap).attr({ "fill": "blue", "font-size": 10 });
        xAxisPoints.transform('t0,' + (paperCenterOfY - 10));
        PaperConfig.xLabels.push(xAxisPoints);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + i + ",0L" + i + "," + (containerHeight + (gridGap * ratio * 30))).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
    // y axis
    for (var i = gridGap * ratio * -30, j = -33; i <= containerHeight; i += gridGap * ratio, j++) {
      if (j % 5 == 0) {
        if (isDrawGrid) {
          // debugger
          paper.path("M" + (gridGap * ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.50 });
        }
        let yAxisPoints = paper.text(paperCenterOfX, (paperHeight - i), j * gridGap).attr({ "fill": "blue", "font-size": 10 });
        yAxisPoints.transform('t' + (-paperCenterOfX + 10) + ",0");
        PaperConfig.yLabels.push(yAxisPoints);
      }
      else {
        if (isDrawGrid) {
          paper.path("M" + (gridGap * ratio * -30) + "," + (paperHeight - i) + "L" + paperWidth + "," + (paperHeight - i)).attr({ "stroke": "#696969", "stroke-width": 0.25 });
        }
      }
    }
  }

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
    $("#" + containerId).mousedown(function (e) {
      // Prevent text edit cursor while dragging in webkit browsers
      $("#" + containerId).unbind("mousedown");
      $("#" + containerId).unbind("mousedown");
      e.originalEvent.preventDefault();
      var offset = $("#svg_paper").offset();
      mouseDownX = this.snapInitPoint(e.pageX - offset.left, corridorConfig.gridSize, paperConfig.viewboxRatio);
      mouseDownY = this.snapInitPoint(e.pageY - offset.top, corridorConfig.gridSize, paperConfig.viewboxRatio);
      mouseDownY -= topToCenter;
      if (isCorridorDrawn == true) return false;
      this.drawCorridor(paper, mouseDownX, mouseDownY, w, h, g);
      ft = paper.freeTransform(shape);
    });

    // mousemove event
    $("#" + containerId).mousemove(function (e) {
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
      width = this.snapInitPoint(width, corridorConfig.gridSize, paperConfig.viewboxRatio);
      shape = this.drawCorridor(paper, mouseDownX, mouseDownY, width, h, g);
      ft = paper.freeTransform(
        shape,
        {
          snap: { drag: corridorConfig.gridSize * paperConfig.viewboxRatio },
          snapDist: {
            drag: corridorConfig.gridSize * paperConfig.viewboxRatio
          }

        },
        // freeTransformHandler
      );
      ft.attrs.rotate = angle;
      ft.apply();


      $("#" + containerId).click(function (e) {
        e.originalEvent.preventDefault();
        $("#" + containerId).unbind("mousemove");
        var BBox = shape.getBBox();
        if (BBox.width == 0 && BBox.height == 0) shape.remove();
          this.bindZoomHandler()
      });
    });
  }

  drawCorridor(paper, x, y, w, h, g) {    
    var element = paper.path(`M ${x},${y}  L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} L ${x}, ${y} z` +
      `M ${x},${y + h + g}  L ${x + w},${y + h + g} L ${x + w},${2 * h + y + g} L ${x},${2 * h + y + g} L ${x},${y + h + g} z`)
      .attr({ 'fill': '#D3D3D3', "stroke": '#D3D3D3' })
    this.selectElement(element.node, x, y);
    return element;
  }

  // draw corridor
  drawCircle(paper, x, y, w) {  
    var element = paper.circle(x, y, 5);
    this.selectElement(element, x, y);
    return element;
  }

  selectElement(element, x , y){
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

  snapInitPoint(point, gridSize, ratio) {
    console.log(point, gridSize, ratio, "point,gridSize, ratio")
    var gridSizeInPX = gridSize * ratio;
    let p = Math.floor(point / gridSizeInPX) * gridSizeInPX;
    let deviation = point % (gridSizeInPX);
    if (deviation > gridSizeInPX / 2)
      p = p + (gridSizeInPX)
    console.log(p, "p")
    return p;
  }

  bindZoomHandler = function(){
    let panZoomInstance = svgPanZoom('svg', {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: false,
      minZoom: 0,
      maxZoom: 2,
      onZoom: function(newZoom){
        var ele = $('.svg-pan-zoom_viewport')[0];
        var viewportMatrix = ele.transform.baseVal.consolidate().matrix;
        var viewboxSizes = panZoomInstance.getSizes();
        // clearLabels(newZoom, viewportMatrix, viewboxSizes);
      },
      beforePan : function(oldPan, newPan){
       console.log("pan....")
      }
    });
  }
  calFeetToPixel(width, height, viewboxOffset, canvasId) {
    debugger
    var clientWidth =429,
    clientHeight = 427;
    var viewboxWidth = clientWidth;
    var actualHeight = clientHeight,
        feetToPixel: any = (viewboxWidth / width).toFixed(3),
        rh = height * feetToPixel;
  
    feetToPixel = feetToPixel.slice(0, feetToPixel.length - 1);
    if (rh > actualHeight) {
      feetToPixel = (actualHeight / height).toFixed(3);
      feetToPixel = feetToPixel.slice(0, feetToPixel.length - 1);
      console.log(
        "pixel ratio is getting consider by height actual height is in pixel is " +
          clientHeight +
          "and Required height is " +
          height +
          "ration of fitto pixelis" +
          feetToPixel
      );
    } else
      console.log(
        "pixel ratio is getting consider by width actual width is in pixel is " +
          clientWidth +
          "and Required width is " +
          width +
          "ration of fitto pixelis" +
          feetToPixel
      );
  
    return feetToPixel;
    
  };  

}

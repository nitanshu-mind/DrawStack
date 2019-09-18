import $ from "jquery";
import { Editor2DConfig } from '../editor2d.config';
import { ZoomHandler } from './zoomHandler';

export class FreeForm extends Editor2DConfig {

  paper: any;
  freeformPoint = []
  manupulateFreeformPoints = [];
  freeFormPath;
  startingPoint;
  isDrawing = false;
  context = "LINE";
  circle = [];
  tmpLine;
  cuurentPoint;
  zoomHandler: ZoomHandler;

  constructor(paper,paperconfig) {
    super();
    this.paper = paper;
    this.paperConfig=paperconfig;
  }

  isClosedPolyLoop(lastPoint) {
    if (!this.startingPoint || this.circle.length < 3) return false;
    var dx = this.startingPoint.x - lastPoint.x, dy = this.startingPoint.y - lastPoint.y;
    return (dx > -this.freeFormConfig.ignoreDeviation && dx < this.freeFormConfig.ignoreDeviation) &&
      (dy > -this.freeFormConfig.ignoreDeviation && dy < this.freeFormConfig.ignoreDeviation)
  }

  snapPointToLine(lastPoint, currentPoint) {
    if (!lastPoint && !currentPoint) return null;
    if (this.circle.length) {
      let c = this.circle[this.circle.length - 1];
      if (c.cx >= -this.freeFormConfig.ignoreDeviation && c.cx <= this.freeFormConfig.ignoreDeviation)
        currentPoint.x = c.cx;
      if (c.cy >= -this.freeFormConfig.ignoreDeviation && c.cy <= this.freeFormConfig.ignoreDeviation)
        currentPoint.y = c.cy
    }
    return currentPoint;
  }

  buildPath(paper, point, isClosed, isMoving) {
    this.zoomHandler = new ZoomHandler(this.paperConfig);
    if (!this.freeFormPath) {
      this.freeFormPath = `M ${point.x},${point.y}`
      this.startingPoint = { x: point.x, y: point.y };
    }
    else if (!isMoving) {
      if (isClosed)
        this.freeFormPath += `L ${this.startingPoint.x},${this.startingPoint.y} Z`
      else
        this.freeFormPath += `L ${point.x},${point.y} `

      if (this.tmpLine) {
        this.zoomHandler.destroyPanZoom();
        this.tmpLine.remove();
      }
      this.tmpLine = paper.path(this.freeFormPath);
      this.zoomHandler.bindZoomHandler();
    }
    else {
      if (this.tmpLine) {
        this.zoomHandler.destroyPanZoom();
        this.tmpLine.remove();
      }
      this.tmpLine = paper.path(this.freeFormPath + `L ${point.x},${point.y} `);
      this.zoomHandler.bindZoomHandler();
    }
  }

  drawCircle(paper, x, y, r) {
    var element = paper.circle(x, y, r);
    this.selectElement(element, x, y);
    return element;
  }

  selectElement(element, x, y) {
    $(element.node).attr('id', 'path' + x + y);
    element.click(function (e) {
      $(element.node).attr('id');
    });
  }

  drawFreeform(containerId,freeFormDrawInfo) {
    this.context = "LINE"
    let mouseDownX = 0;
    let mouseDownY = 0;
    let mouseUpX = 0;
    let mouseUpY: any;
    let shape: any;
    var isDrawing = false
    var lastPoint;

    $('#' + containerId).unbind('mousedown mousemove mouseup click');
    $('#' + containerId).mousedown((e) => {
      if (this.context === "LINE") {
        isDrawing = true;
        e.originalEvent.preventDefault();
        var offset = $("#" + containerId).offset();
        mouseDownX = e.pageX - offset.left;
        mouseDownY = e.pageY - offset.top;
        lastPoint = { x: mouseDownX, y: mouseDownY };
      }
    });

    $('#' + containerId).mousemove((e) => {
      if (this.context === "LINE") {
        var offset = $('#' + containerId).offset(),
          upX = e.pageX - offset.left,
          upY = e.pageY - offset.top,
          cuurentPoint = { x: upX, y: upY };
        if (lastPoint)
          cuurentPoint = this.snapPointToLine(lastPoint, cuurentPoint);
        var isClosedPath = this.isClosedPolyLoop(cuurentPoint);
        if (isDrawing) {
          this.buildPath(this.paper, cuurentPoint, isClosedPath, true);
          if (isClosedPath) {
            this.buildPath(this.paper, cuurentPoint, isClosedPath, false);
          }
          lastPoint = cuurentPoint;
        }
      }
    });

    $('#' + containerId).mouseup((e) => {
      if (this.context === "LINE") {
        e.originalEvent.preventDefault();
        var offset = $("#" + containerId).offset();
        var yRemainingHeight = this.paper.height % (this.corridorConfig.gridSize * this.paperConfig.data.viewboxRatio);
        mouseUpX = super.snapInitPoint(e.pageX - offset.left, this.corridorConfig.gridSize, this.paperConfig.data.viewboxRatio);
        mouseUpY = super.snapInitPoint(e.pageY - offset.top, this.corridorConfig.gridSize, this.paperConfig.data.viewboxRatio);
        var pOffset = this.paperConfig.data.viewboxOffset * this.paperConfig.data.viewboxRatio;
        this.cuurentPoint = { x: mouseUpX, y: mouseUpY }
        this.freeformPoint.push(this.cuurentPoint);
        this.manupulateFreeformPoints.push({
          x: super.snapInitPoint((mouseUpX - pOffset) / this.paperConfig.data.viewboxRatio, this.corridorConfig.gridSize, this.freeFormConfig.ratioOne),
          y: super.snapInitPoint((this.paper.height - mouseUpY.toFixed(2) - pOffset) / this.paperConfig.data.viewboxRatio, this.corridorConfig.gridSize, this.freeFormConfig.ratioOne)
        });
        freeFormDrawInfo.drawPoints = this.manupulateFreeformPoints;
        freeFormDrawInfo.realPoints = { snapY: mouseUpY, x: e.pageX - offset.left, y: e.pageY - offset.top, yRemainingHeight: yRemainingHeight, ratio: this.paperConfig.data.viewboxRatio };
        freeFormDrawInfo.paper = { width: this.paper.width, height: this.paper.height }
        var isClosed = this.isClosedPolyLoop(this.cuurentPoint);
        if (!this.freeFormPath || !isClosed) {
          shape = this.drawCircle(this.paper, this.cuurentPoint.x, this.cuurentPoint.y,this.freeFormConfig.radius);
          this.circle.push(shape);
        }
        if (isDrawing) {
          this.buildPath(this.paper, this.cuurentPoint, isClosed, false);
        }
        if (isClosed) {
          this.context = "NONE"
          isDrawing = false;
          shape.remove();
          for (var i = 0; i < this.circle.length; i++) {
            this.circle[i].remove();
          }
          this.tmpLine.attr({ fill: '#d9f7a5' })
          var tempPath
          for (var i = 0; i < this.freeformPoint.length; i++) {
            if (i == 0)
              tempPath = `M ${this.freeformPoint[i].x},${this.freeformPoint[i].y},`
            else
              tempPath += ` L ${this.freeformPoint[i].x},${this.freeformPoint[i].y} `
          }
          this.tmpLine.attr({ path: tempPath + `Z` });
        }
      }
    });
    return this.manupulateFreeformPoints;
  }
}

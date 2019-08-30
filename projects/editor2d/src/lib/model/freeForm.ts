import $ from "jquery";
import { Editor2DConfig } from '../editor2d.config';

export class FreeForm extends Editor2DConfig{
  freeformPoint = []
  manupulateFreeformPoints = [];
  freeFormPath;
  startingPoint;
  isDrawing = false;
  context = "LINE";
  circle = [];
  tmpLine;
  cuurentPoint;

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
    if (!this.freeFormPath) {
      this.freeFormPath = `M ${point.x},${point.y}`
      this.startingPoint = { x: point.x, y: point.y };
    }
    else if (!isMoving) {
      if (isClosed)
        this.freeFormPath += `L ${this.startingPoint.x},${this.startingPoint.y} Z`
      else
        this.freeFormPath += `L ${point.x},${point.y} `

      if (this.tmpLine)
        this.tmpLine.remove();
      this.tmpLine = paper.path(this.freeFormPath);
    }
    else {
      if (this.tmpLine)
        this.tmpLine.remove();
      this.tmpLine = paper.path(this.freeFormPath + `L ${point.x},${point.y} `);
    }
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

  drawFreeform(paper, freeFormConfig, containerId, corridorConfig, paperConfig, freeFormDrawInfo) {
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
        var offset = $("#"+containerId).offset();
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
          this.buildPath(paper, cuurentPoint, isClosedPath, true);
          if (isClosedPath) {
            this.buildPath(paper, cuurentPoint, isClosedPath, false);
          }
          lastPoint = cuurentPoint;
        }
      }
    });

    $('#' + containerId).mouseup((e) => {
      if (this.context === "LINE") {
        e.originalEvent.preventDefault();
        var offset = $("#"+containerId).offset();
        var yRemainingHeight = paper.height % (corridorConfig.gridSize * paperConfig.data.viewboxRatio);
        mouseUpX = this.snapInitPoint(e.pageX - offset.left, corridorConfig.gridSize, paperConfig.data.viewboxRatio);
        mouseUpY = this.snapInitPoint(e.pageY - offset.top, corridorConfig.gridSize, paperConfig.data.viewboxRatio);
        var pOffset = paperConfig.data.viewboxOffset * paperConfig.data.viewboxRatio;
        this.cuurentPoint = { x: mouseUpX, y: mouseUpY }
        this.freeformPoint.push(this.cuurentPoint);
        this.manupulateFreeformPoints.push({
          x: this.snapInitPoint((mouseUpX - pOffset) / paperConfig.data.viewboxRatio, corridorConfig.gridSize, freeFormConfig.ratioOne),
          y: this.snapInitPoint((paper.height - mouseUpY.toFixed(2) - pOffset) / paperConfig.data.viewboxRatio, corridorConfig.gridSize, freeFormConfig.ratioOne)
        });
        freeFormDrawInfo.drawPoints = this.manupulateFreeformPoints;
        freeFormDrawInfo.realPoints = { snapY: mouseUpY, x: e.pageX - offset.left, y: e.pageY - offset.top, yRemainingHeight: yRemainingHeight, ratio: paperConfig.data.viewboxRatio };
        freeFormDrawInfo.paper = { width: paper.width, height: paper.height }
        var isClosed = this.isClosedPolyLoop(this.cuurentPoint);
        if (!this.freeFormPath || !isClosed) {
          shape = this.drawCircle(paper, this.cuurentPoint.x, this.cuurentPoint.y, freeFormConfig.radius);
          this.circle.push(shape);
        }
        if (isDrawing) {
          this.buildPath(paper, this.cuurentPoint, isClosed, false);
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

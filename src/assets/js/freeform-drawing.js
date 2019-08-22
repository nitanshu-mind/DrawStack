var freeformPoint = [];
var manupulateFreeformPoints = [];
var freeFormPath;
var startingPoint;
var isDrawing = false;
var context = "LINE";
var freeFormConfig = {
    ignoreDeviation: 10
}

var circle = [];
    function isClosedPolyLoop(lastPoint){
        if(!startingPoint || circle.length<3) return false;
        var dx= startingPoint.x-lastPoint.x, dy=startingPoint.y-lastPoint.y;
        return (dx>-freeFormConfig.ignoreDeviation && dx<freeFormConfig.ignoreDeviation) &&
            (dy>-freeFormConfig.ignoreDeviation && dy<freeFormConfig.ignoreDeviation)
   }

   function snapPointToLine(lastPoint, currentPoint){
       if(!lastPoint && !currentPoint) return null;
    if(circle.length)
    {
        c= circle[circle.length-1];
        if(c.cx>=-freeFormConfig.ignoreDeviation && c.cx<=freeFormConfig.ignoreDeviation)
            currentPoint.x=c.cx;
        if(c.cy>=-freeFormConfig.ignoreDeviation && c.cy<=freeFormConfig.ignoreDeviation)
        currentPoint.y=c.cy
    }

    return currentPoint;
}


function isIgnorable(tLine){
    path=tLine.attrs.path;
    len= path.length;
    if(len>1)
     return (path[len-2][1]<5 || path[len-1][1]>-5)  &&  (path[len-1][2]<5 || path[len-2][2]>-5);
    return false;
}

function matchPoint(point,tLine){
  var  path=tLine.attrs.path,
    len= path.length,
    dx= point.x- path[len-1][1],
    dy=point.y- path[len-1][2];
  
    if( dx>-5 &&  dx<5 )
      point.x=path[len-1][1];
    
     if( dy>-5 &&  dy<5 )
     point.y=path[len-1][2];
  
    return point;
}

var tmpLine;
function buildPath(paper, point,isClosed,isMoving){
  if(!freeFormPath){
    freeFormPath = `M ${point.x},${point.y}`
    startingPoint = {x:point.x,y:point.y};
 }
 else if(!isMoving)
 {
      if(isClosed)
          freeFormPath+= `L ${startingPoint.x},${ startingPoint.y} Z`
      else
          freeFormPath+= `L ${point.x},${ point.y} `

      if(tmpLine)
          tmpLine.remove();
      tmpLine = paper.path(freeFormPath);
  }
  else{
      if(tmpLine)
      tmpLine.remove();
      tmpLine = paper.path(freeFormPath+`L ${point.x},${ point.y} `);
  }
  
 }

var cuurentPoint;
function drawFreeform(paper, r,containerId, corridorConfig, paperConfig, freeFormDrawInfo){
    context = "LINE"
    isCorridorDrawn = false;
    $('#'+containerId).unbind('mousedown');
    $('#'+containerId).unbind('mousemove');
    $('#'+containerId).unbind('mouseup');
    $('#'+containerId).unbind('click');
    var isDrawing=false
    var lastPoint

    $('#'+containerId).mousedown(function (e) {
        if(context === "LINE"){
            isDrawing = true;
            isClosedPath = false;
            e.originalEvent.preventDefault();
            var offset = $("#svg_paper").offset();
            mouseDownX = e.pageX - offset.left;
            mouseDownY = e.pageY - offset.top;
            lastPoint ={x:mouseDownX, y:mouseDownY};
        }
    });  

    $('#'+containerId).mousemove(function (e) {
        if(context === "LINE"){
            var offset = $('#'+containerId).offset(),
            upX = e.pageX - offset.left,
            upY = e.pageY - offset.top,
            cuurentPoint ={x:upX, y:upY};
            if(lastPoint)
                cuurentPoint=snapPointToLine(lastPoint,cuurentPoint);

            var isClosedPath=isClosedPolyLoop(cuurentPoint);
            if(isDrawing){
                buildPath(paper, cuurentPoint,isClosedPath,true);

                if(isClosedPath)  {
                    buildPath(paper, cuurentPoint,isClosedPath,false);
                    
                }
                lastPoint=cuurentPoint;
            }
        }
    });
    
    $('#'+containerId).mouseup(function (e) {
        if(context === "LINE"){
            e.originalEvent.preventDefault();
            var offset = $("#svg_paper").offset();
            var yRemainingHeight= paper.height%  (corridorConfig.gridSize* paperConfig.viewboxRatio);
            mouseUpX = snapInitPoint(e.pageX - offset.left, corridorConfig.gridSize, paperConfig.viewboxRatio);
            mouseUpY = snapInitPoint(e.pageY - offset.top, corridorConfig.gridSize, paperConfig.viewboxRatio);
            var pOffset = paperConfig.viewboxOffset*paperConfig.viewboxRatio;
            cuurentPoint = {x:mouseUpX, y:mouseUpY}
            freeformPoint.push(cuurentPoint);  
            manupulateFreeformPoints.push({x:snapInitPoint((mouseUpX-pOffset)/paperConfig.viewboxRatio, corridorConfig.gridSize,1), 
                    y: snapInitPoint((paper.height- mouseUpY.toFixed(2)-pOffset)/paperConfig.viewboxRatio,corridorConfig.gridSize,1)
            });
            freeFormDrawInfo.drawPoints = manupulateFreeformPoints;
            freeFormDrawInfo.realPoints = {snapY: mouseUpY, x:e.pageX - offset.left, y:e.pageY - offset.top, yRemainingHeight:yRemainingHeight, ratio: paperConfig.viewboxRatio};
            freeFormDrawInfo.paper={width:paper.width, height:paper.height}
            
            var isClosed=isClosedPolyLoop(cuurentPoint);
            if( !freeFormPath || !isClosed){
                shape = drawCircle(paper, cuurentPoint.x, cuurentPoint.y, r);
                circle.push(shape);
            }
              
            if(isDrawing){
                buildPath(paper,cuurentPoint,isClosed,false);
            }
            
            if(isClosed){
                context = "NONE"
                isDrawing = false;
                shape.remove();
                for(var i=0; i<circle.length; i++){
                    circle[i].remove();
                }
                tmpLine.attr({fill: '#d9f7a5'})
                var tempPath
                for(var i=0; i<freeformPoint.length; i++){
                    if(i==0)
                        tempPath = `M ${freeformPoint[i].x},${freeformPoint[i].y},`
                    else 
                        tempPath += ` L ${freeformPoint[i].x},${ freeformPoint[i].y} `
                }
                tmpLine.attr({path: tempPath+`Z`})
            }
        }
    });  
}

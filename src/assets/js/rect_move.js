var isNext = false,
gPaper, gCorridorConfig, gPaperConfig, gCorridor;
var viewBox = {X:0,Y:0};
var zoomValue = 0;
var calFeetToPixel = function(width, height, viewboxOffset, canvasId) {
  var clientWidth = document.getElementById(canvasId).clientWidth,
    clientHeight = document.getElementById(canvasId).clientHeight;
  var viewboxWidth = clientWidth;
  var actualHeight = clientHeight,
    feetToPixel = (viewboxWidth / width).toFixed(3),
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

var getPaperConfig = function(width, height, viewboxOffset, canvasId) {
  var data = {};
  data.offset = viewboxOffset;
  data.width = width;
  data.height = height;
  data.viewboxOffset = viewboxOffset;
  data.viewboxRatio = calFeetToPixel(width, height, viewboxOffset, canvasId);
  return data;
};

var paper,
  mouseDownX = 0, 
  mouseDownY = 0,
  shape,
  isCorridorDrawn = false;

function getPoint(obj){
  return { x:obj.attrs.cx, y:obj.attrs.cy}
} 

bindZoomHandler = function(){
  panZoomInstance = svgPanZoom('svg', {
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
      clearLabels(newZoom, viewportMatrix, viewboxSizes);
    },
    beforePan : function(oldPan, newPan){
     console.log("pan....")
    }
  });
}

freeTransformHandler=  function(ft, events) {
  shape.mouseover(function(eve){
    panZoomInstance.disablePan();
  })
  shape.mouseout(function(eve){
    panZoomInstance.enablePan();
  })
   var paper = gPaper, corridorConfig  = gCorridorConfig, paperConfig= gPaperConfig, corridor = gCorridor;
   var h = corridorConfig.h,
   g = corridorConfig.g,
   handles = ft.handles;

  if(handles && handles.y){
    startPoint = getPoint(handles.y.disc);
    endPoint = getPoint(handles.x.disc);
    var snapStartPoint = {
      x:  snapInitPoint(
        ((startPoint.x - paperConfig.offset*paperConfig.viewboxRatio)/paperConfig.viewboxRatio).toFixed(2),
        corridorConfig.gridSize,1),
      y: snapInitPoint(
        ((paper.height- paperConfig.offset*paperConfig.viewboxRatio - startPoint.y)/paperConfig.viewboxRatio).toFixed(2),
        corridorConfig.gridSize,1),
    };
  
  corridor.rotate = ft.attrs.rotate.toFixed(2);
  corridor.ratio =paperConfig.viewboxRatio;
  corridor.sp = {
    x: snapStartPoint.x,
    y: snapStartPoint.y,
    z: 0
  };
  corridor.ep = {
    x:   snapInitPoint(((endPoint.x - paperConfig.offset*paperConfig.viewboxRatio)/paperConfig.viewboxRatio).toFixed(2),corridorConfig.gridSize,1),
    y:  snapInitPoint(((paper.height-  paperConfig.offset*paperConfig.viewboxRatio- (endPoint.y ))/paperConfig.viewboxRatio).toFixed(2),corridorConfig.gridSize,1),
    z: 0
  };
  corridor.paper = { width: paper.width, height: paper.height };
  corridor.bbox = shape.getBBox();

  if(events[0] == "drag end" || events[0] == "rotate end" || events[0] == "scale end"){
    var cx = snapInitPoint(startPoint.x, corridorConfig.gridSize, paperConfig.viewboxRatio),
    cy = snapInitPoint(startPoint.y, corridorConfig.gridSize, paperConfig.viewboxRatio),
    cx2 = snapInitPoint(endPoint.x, corridorConfig.gridSize, paperConfig.viewboxRatio), 
    cy2 = snapInitPoint(endPoint.y, corridorConfig.gridSize, paperConfig.viewboxRatio) 
    width = getDistaanceBetween( cx, cy, cx2,cy2);
    
    var angle1 =  getAngle(cx,cy, cx2, cy2);
    var transformShape="t"+(cx-startPoint.x)+","+ (startPoint.y-cy);
    console.log(transformShape,"transformShape")
    shape.transform(transformShape);
   
    ft.attrs.rotate= angle1;
    ft.apply();
    corridor.rotate = angle1.toFixed(2);
    
    corridor.sp = {
      x:  snapInitPoint(cx, corridorConfig.gridSize, 1),
      y:  snapInitPoint(cy, corridorConfig.gridSize, 1),
      z: 0
    };
    corridor.ep = {
      x:   snapInitPoint(((cx2 - paperConfig.offset*paperConfig.viewboxRatio)/paperConfig.viewboxRatio).toFixed(2), corridorConfig.gridSize, 1),
      y: snapInitPoint(((paper.height-  paperConfig.offset*paperConfig.viewboxRatio- (cy2 ))/paperConfig.viewboxRatio).toFixed(2), corridorConfig.gridSize, 1),
      z: 0
    };
    corridor.bbox = shape.getBBox();
    bindZoomHandler()
  }
}
};

function drawShape(corridorConfig, containerId, paper, corridor, paperConfig) {
  gPaper = paper; gCorridorConfig = corridorConfig; gPaperConfig=paperConfig; gCorridor = corridor;
  var x = corridorConfig.x,
    y = corridorConfig.y,
    w = corridorConfig.w,
    h = corridorConfig.h,
    g = corridorConfig.g,
    isCorridorDrawn = false;
    var startPoint,endPoint;
  $("#" + containerId).unbind("mousedown");
  $("#" + containerId).unbind("mousemove");
  $("#" + containerId).unbind("mouseup");
  var topToCenter = corridorConfig.h + corridorConfig.g / 2;
  var ft;

  // mousedown event
  $("#" + containerId).mousedown(function(e) {
    // Prevent text edit cursor while dragging in webkit browsers
    $("#" + containerId).unbind("mousedown");
    $("#" + containerId).unbind("mousedown");
    e.originalEvent.preventDefault();
    var offset = $("#svg_paper").offset();
    mouseDownX = snapInitPoint(e.pageX - offset.left, corridorConfig.gridSize, paperConfig.viewboxRatio);
    mouseDownY = snapInitPoint(e.pageY - offset.top, corridorConfig.gridSize, paperConfig.viewboxRatio); 
    mouseDownY -= topToCenter;

    if (isCorridorDrawn == true) return false;
    shape = DrawCorridor(paper, mouseDownX, mouseDownY, w, h, g);
    ft = paper.freeTransform(shape);
  });

  // mousemove event
  $("#" + containerId).mousemove(function(e) {
    if(shape){
      shape.remove();
      ft.unplug();
    }else return false;
      
    var offset = $("#" + containerId).offset(),
      upX = e.pageX - offset.left,
      upY = e.pageY - offset.top,
      width = getDistaanceBetween(mouseDownX, mouseDownY + topToCenter, upX, upY);
      height = upY - mouseDownY,
      angle = getAngle(mouseDownX, mouseDownY + topToCenter, upX, upY);

    width = snapInitPoint(width, corridorConfig.gridSize, paperConfig.viewboxRatio);
    shape = DrawCorridor(paper, mouseDownX, mouseDownY, width, h, g);

    ft = paper.freeTransform(
      shape,
      {
        snap:  { drag: corridorConfig.gridSize * paperConfig.viewboxRatio },
        snapDist: {
          drag: corridorConfig.gridSize * paperConfig.viewboxRatio
        }
       
      },
      freeTransformHandler
     );
    ft.attrs.rotate=angle;
    ft.apply();
   

    $("#" + containerId).click(function(e) {
      e.originalEvent.preventDefault();
      $("#" + containerId).unbind("mousemove");
      var BBox = shape.getBBox();
      if (BBox.width == 0 && BBox.height == 0) shape.remove();
      bindZoomHandler()
    });
    
  });
};

function loadCorridorArea(paper, h, url, paperConfig) {
  paper.image(
    url,
    0,
    paper.height - paperConfig.height * paperConfig.viewboxRatio,
    paperConfig.width * paperConfig.viewboxRatio,
    300 * paperConfig.viewboxRatio
  );
}

function deleteScatch(paper) {
  isCorridorDrawn = false;
  isfreeFormDrawn = false;
  freeFormPath = null;
  paper.clear();
}

// Delete corridor
function deleteCorridor(paper) {
  if (!shape) return false;
  var ft = paper.freeTransform(shape);
  shape.remove();
  ft.unplug();
  return true;
}

function rotateScatch90() {
  var ft = paper.freeTransform(shape);
  ft.attrs.rotate = 90;
  ft.apply();
}

function loadSVGCorridor(paper, x, y, width, height, svgUrl, paperConfig) {
  isNext = true;
  paper.image(svgUrl, x, y,width,height);
  
}

function freeformDraw() {
  var ft = paper.freeTransform(shape);
  ft.unplug();
  shape.remove();
  isCorridorDrawn = false;
  drawFreeform(10, "svg_paper");
}

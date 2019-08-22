// for create grid
var g, o, w, h, len, gPaper, gGap, gGrid, gOffset, gRatio, containerWidth, containerHeight, circle;
var xLabels=[], yLabels= [];
function clearLabels(zoomRatio, matrix, viewboxSizes){
    console.log(matrix,"matrix");
    console.log(viewboxSizes,"viewboxSizes");
    var y =(gPaper.height/2)*zoomRatio/10;
    var d = zoomRatio*100/2;
    var trX="t0,"+ (((containerHeight/2)/zoomRatio)-10); //(-y);  t.transform('t0,'+(cy-10) );
    var trY="t"+ ((-(containerWidth/2)/zoomRatio)+10)+",0";
    console.log(trX, trY,"trX,trY");
   // circle.transform('t' + ((-(containerWidth/2)/zoomRatio)+10) +",0")
    for(var i=0; i<xLabels.length; i++){
        xLabels[i].transform(trX);
        if(zoomRatio>1)
            xLabels[i].attr({ "font-size": 10/zoomRatio });
    }
    for(var i=0; i<yLabels.length; i++){
        yLabels[i].transform(trY);
        if(zoomRatio>1)
            yLabels[i].attr({ "font-size": 10/zoomRatio });
    }
  
}

function drawAxis (r,gridGap, grid, offset,ratio, cw, ch, isDrawGrid) {
    gPaper= r,
    gGap = gridGap, 
    gGrid = grid, 
    gOffset = offset,
    gRatio = ratio,
    g = grid || false;
    o = offset || 2;
    w=r.width;
    h=r.height;
    len = grid ? h : 50,
    containerWidth = cw,
    containerHeight = ch;
    // circle = r.circle(containerWidth/2, containerHeight/2, 5);
    // circle.transform('t'+ (-cw/2+10)+",0");
    var cx = containerWidth/2,
    cy = containerHeight/2;

    for (var i=gridGap*ratio*-30,j=-33; i<=containerWidth ; i+=gridGap*ratio,j++) {    
        if(j%5 == 0 ) {
          if(isDrawGrid)
           r.path("M"+i+",0L"+i+","+(containerHeight+(gridGap*ratio*30))).attr({"stroke": "#696969", "stroke-width":0.50});
            t= r.text(i,cy,j*gridGap).attr({"fill": "blue", "font-size": 10});
            t.transform('t0,'+(cy-10) );
            xLabels.push(t); 
        }
        else{
            if(isDrawGrid)
                r.path("M"+i+",0L"+i+","+(containerHeight+(gridGap*ratio*30))).attr({"stroke": "#696969", "stroke-width":0.25});
        }
    }
    // y axis
    for (var i=gridGap*ratio*-30,j=-33 ;i<=containerHeight;i+=gridGap*ratio,j++) {
        if(j%5==0){
          if(isDrawGrid)
            r.path("M"+(gridGap*ratio*-30)+","+(h-i)+"L"+w+","+(h- i)).attr({"stroke": "#696969","stroke-width":0.50});
       t= r.text(cx,(h-i),j*gridGap).attr({"fill": "blue", "font-size": 10});
       t.transform('t'+ (-cx+10)+",0");
        yLabels.push(t); 
        }else{
            if(isDrawGrid)
                r.path("M"+(gridGap*ratio*-30)+","+(h-i)+"L"+w+","+(h- i)).attr({"stroke": "#696969","stroke-width":0.25});
        }
        
    }
}

// draw corridor
function DrawCorridor(paper, x, y, w, h, g) {
    isCorridorDrawn = true;
    var element = paper.path(`M ${x},${y}  L ${x+w},${y} L ${x+w},${y+h} L ${x},${y+h} L ${x}, ${y} z` +
        `M ${x},${y+h+g}  L ${x+w},${y+h+g} L ${x+w},${2*h+y+g} L ${x},${2*h+y+g} L ${x},${y+h+g} z`)
        .attr({'fill': '#D3D3D3', "stroke": '#D3D3D3'})                            
    $(element.node).attr('id', 'path' + x + y);
    element.click(function (e) {
        elemClicked = $(element.node).attr('id');
    });
    return element;                
}

// draw corridor
function drawCircle(paper, x, y, w) {
    isCorridorDrawn = true;
    // var element = paper.path(`M ${x},${y}  L ${x+w},${y} `)
    //     .attr({'fill': '#D3D3D3', "stroke": '#D3D3D3'}) 
    var element = paper.circle(x, y, 5);                           
        
    $(element.node).attr('id', 'path' + x + y);
    element.click(function (e) {
        elemClicked = $(element.node).attr('id');
    });


    return element;                
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
				
function getAngle(cx,cy,x,y) {
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

function getWidth(w,h){
    return Math.sqrt( w*w + h*h );
}

function getDistaanceBetween(cx,cy,mx,my){
    return getWidth(cx-mx,cy-my);
}

function roundDown(number, modulus) {
    var remainder = number % modulus;
    if (remainder == 0) {
        return number;
    } else {
        return number  - remainder;
    }
}

function snapPoint(point, gridSize, ratio){
  return snapInitPoint(point, gridSize, ratio);
}

function snapInitPoint(point, gridSize, ratio){
    console.log(point,gridSize, ratio, "point,gridSize, ratio")
    var gridSizeInPX = gridSize*ratio;
    p = parseInt(point/gridSizeInPX)*gridSizeInPX;
    
    deviation =  point%(gridSizeInPX);
    if(deviation>gridSizeInPX/2)
        p = p + (gridSizeInPX) 
         console.log(p, "p")
    return p;
}

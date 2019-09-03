export class Zoom {
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
  
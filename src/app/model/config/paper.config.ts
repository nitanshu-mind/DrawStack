export class PaperConfig {
    static gridGap: number = 10;
    static containerHeight: number = 500;
    static containerWidth: number = 500;
    static ratio: number = 1;
    static offset: number = 3;
    static xLabels = [];
    static yLabels = [];
    // paperConfig = this.getPaperConfig(420, 300, 30, 'svg_canvas')
    let w = this.snapPoint(
        this.canvas.clientWidth,
        this.corridorConfig.gridSize,
        this.paperConfig.viewboxRatio
      ),
        h = this.snapPoint(
          this.canvas.clientHeight,
          this.corridorConfig.gridSize,
          this.paperConfig.viewboxRatio
        )
    getPaperConfig = function (width, height, viewboxOffset, canvasId) {
        let data = {
            offset: viewboxOffset,
            width: width,
            height: height,
            viewboxOffset: viewboxOffset,
            viewboxRatio: this.calFeetToPixel(width, height, viewboxOffset, canvasId),
        };
        return data;
    }
    calFeetToPixel(width, height, viewboxOffset, canvasId) {
        // debugger
        // var clientWidth = document.getElementById(canvasId).clientWidth,
        // clientHeight = document.getElementById(canvasId).clientHeight;
        var clientWidth = 429,
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
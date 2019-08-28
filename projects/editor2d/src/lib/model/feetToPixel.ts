export abstract class FeetToPixel{
public calFeetToPixel(width, height, viewboxOffset, canvasId) {
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
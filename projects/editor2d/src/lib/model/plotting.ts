import { ZoomHandler } from './zoomHandler';
import $ from "jquery";

export class Plotting {
    paper;
    shapesHolder = {};
    lastColumn = -1;
    dsw = 20;
    h = 40;
    g = 5;
    angle;
    cx;
    cy;
    cx1;
    cy1;
    zoomHandler;

    selectedPolicy = "parallelPercentage";

    typesAndPercentage = [
        {
            "type": { w: 15, color: '#228B22' },
            "percentage": 10
        },
        {
            "type": { w: 20, color: '#32CD32' },
            "percentage": 20
        }
        ,
        {
            "type": { w: 30, color: '#00FF00' },
            "percentage": 30
        },
        {
            "type": { w: 40, color: '#FFFF99' },
            "percentage": 40
        },
    ];
    STRAIRS_WIDTH = 13; //Feet
    STRAIR_PLACEMENT_GAP = 150;
    STAIRS = {
        w: 13
    }

    constructor(paper) {
        this.paper = paper;
    }
    applyPlotting(ft, events, isPlaceholder) {

        this.angle = ft.attrs.rotate;
        this.cx = ft.handles.y.disc.attrs.cx;
        this.cy = ft.handles.y.disc.attrs.cy;
        this.cx1 = ft.handles.x.disc.attrs.cx;
        this.cy1 = ft.handles.x.disc.attrs.cy;
        this.cx1 = this.cx1 - this.cx1 % this.dsw;
        let w = this.distanceBetween(this.cx, this.cy, this.cx1, this.cy1);
        let column = ((w - w % this.dsw) / this.dsw) - 1;
        this.zoomHandler = new ZoomHandler();

        // Case 1: Add Shape and transform if does ot exist
        if (column !== this.lastColumn && !this.shapesHolder[column] && column > Object.keys(this.shapesHolder).length + 1) {
            this.addColumn(column);
            this.transformColumnToAlign(this.shapesHolder[column]);
        }// Case2: if user has drawn more column and wanted to remove
        else if (column < Object.keys(this.shapesHolder).length + 1 && this.lastColumn != column) {
            this.removeLastShape(column + 1);
        } else // Case 3: just changing the angle
        this.transformAllToAlign();

        this.lastColumn = column;
       if (!isPlaceholder && events[0] == "apply") {
        //    debugger
           this.applyMixedPercentageLayoutPolicy(this.typesAndPercentage, { x: this.cx, y: this.cy }, w, this.angle, this.shapesHolder);
       }
    }

    recreateShapes(w) {
        this.removeAllShape(this.shapesHolder);
        for (let i = 0, column = 1; i < w; i += this.dsw, column++) {
            this.addColumn(column);
            this.transformColumnToAlign(this.shapesHolder[column]);
        }
    }
    getPoint(cx, cy, r, angle) {
        return { x: cx + this.getX(r, angle), y: cy + this.getY(r, angle) };
    }

    distanceBetween(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    getX(r, angle) {
        return r * Math.cos(angle * (Math.PI / 180));
    }

    getY(r, angle) {
        return r * Math.sin(angle * (Math.PI / 180));
    }

    createShape(x, y) {
        return this.paper.rect(x, y, this.dsw, this.h);
    }

    createAndColumn(column, topSP, bottomSP) {
        let d = (column - 1) * this.dsw;
        this.shapesHolder[column] = {
            "type": "placeholder",
            "top": {
                shape: this.createShape(topSP.x, topSP.y),
                d: d
            },
            "bottom": {
                shape: this.createShape(bottomSP.x, bottomSP.y),
                d: d
            }
        };
    }

    removeBuildingIfAny() {
        for (let property in this.shapesHolder) {
            if (this.shapesHolder[property].type == "building")
                this.removeShape(parseInt(property));
        }
    }

    addColumn(column) {
        this.removeBuildingIfAny();
        //checking if negative column
        if (column < 1)
            return;
        let topSP = this.getPoint(this.cx, this.cy, (this.h + this.g), 270 + this.angle);
        let bottomSP = this.getPoint(this.cx, this.cy, 5, 90 + this.angle);
        // adding  if any column is missing    
        for (let i = 1; i <= column; i++) {
            if (!this.shapesHolder[i])
                this.createAndColumn(i, topSP, bottomSP);
        }
    }

    removeShape(index) {
        if (this.shapesHolder[index] && this.shapesHolder[index].top) {
            this.shapesHolder[index].top.shape.remove();
            this.shapesHolder[index].bottom.shape.remove();
            delete this.shapesHolder[index];
        }
    }

    removeAllShape(shapesHolder) {
        for (let property in shapesHolder) {
            this.removeShape(parseInt(property));
        }
    }

    removeLastShape(index) {
        this.removeShape(index);
        // This need to be used if user is moving the mouse fastly
        for (let property in this.shapesHolder) {
            if (parseInt(property) > index) {
                this.removeShape(parseInt(property));
            }
        }
    }

    transformToAlign(columnNode, point) {
        let shape = columnNode.shape;
        let p = this.getPoint(point.x, point.y, columnNode.d, this.angle);
        let ts = `t${p.x - shape.attrs.x},${((p.y - shape.attrs.y))} r${this.angle},${shape.attrs.x},${shape.attrs.y}`;
        shape.transform(ts);
    }

    transformColumnToAlign(col) {
        let topSP = this.getPoint(this.cx, this.cy, (this.h + this.g), -90 + this.angle);
        let bottomSP = this.getPoint(this.cx, this.cy, 5, 90 + this.angle);
        this.transformToAlign(col.top, topSP);
        this.transformToAlign(col.bottom, bottomSP);
    }

    transformAllToAlign() {
        for (let property in this.shapesHolder) {
            this.transformColumnToAlign(this.shapesHolder[property]);
        }
    }

    shuffleRandomly(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    create(shapesHolder, topSP, bottomSP, h, g, angle, type, column, d) {
        this.createColumn(shapesHolder, topSP, bottomSP, h, g, angle, type, column, d)
    };

    createColumn(shapesHolder, topSP, bottomSP, h, g, angle, type, column, d) {
        shapesHolder[column] = {
            "type": "building",
            "top": { shape: this.createBuilding(topSP.x, topSP.y, column, type, h), d: d },
            "bottom": { shape: this.createBuilding(bottomSP.x, bottomSP.y, column, type, h), d: d }
        };
    };

    createBuilding(x, y, index, type, h) {
        return this.paper.rect(x, y, type.w, h).attr({ 'fill': type.color, 'stroke-width': 2 });
    };

    applyLayoutPolicy(typesAndPercentage, point, w, angle, shapesHolder) {
        this.removeAllShape(shapesHolder);
        let stairsPlacementX = this.STRAIR_PLACEMENT_GAP;
        let pRatio = Math.floor(w / 100); // pixel ratio
        let column = 1;
        let topSP = this.getPoint(point.x, point.y, (this.h + this.g), -90 + angle);
        let bottomSP = this.getPoint(point.x, point.y, 5, 90 + angle);
        let lr = 0; //last r  or last created distance        
        for (let property in typesAndPercentage) {
            let type = typesAndPercentage[property].type;
            let percentage = typesAndPercentage[property].percentage;
            let r = 0;// Radius 
            for (; r < percentage * pRatio && lr + r + type.w < w; r += type.w) {
                if (lr + r > stairsPlacementX) {
                    lr += this.STRAIRS_WIDTH;
                    stairsPlacementX = lr + r + this.STRAIR_PLACEMENT_GAP;
                }
                this.create(shapesHolder, topSP, bottomSP, this.h, this.g, angle, type, column, lr + r);
                column++;
            }
            lr += r;
        }

        this.transformAllToAlign();
    }

    applyMixedPercentageLayoutPolicy(typesAndPercentage, point, w, angle, shapesHolder) {
        this.removeAllShape(shapesHolder);
        let stairsPlacementX = this.STRAIR_PLACEMENT_GAP;
        let pRatio = Math.floor(w / 100);
        let topSP = this.getPoint(point.x, point.y, 35, -90 + angle);
        let bottomSP = this.getPoint(point.x, point.y, 5, 90 + angle);
        let lr = 0;
        let randomlyOrderedBuilding = [];
        for (let property in typesAndPercentage) {
            let type = typesAndPercentage[property].type;
            let percentage = typesAndPercentage[property].percentage;
            let r = 0;
            for (; r < percentage * pRatio && lr + r + type.w < w; r += type.w) {
                if (lr + r > stairsPlacementX) {
                    lr += this.STAIRS.w;
                    stairsPlacementX = lr + r + this.STRAIR_PLACEMENT_GAP;
                }
                randomlyOrderedBuilding.push(type);
            }
            lr += r;
        }
        // this.shuffleRandomly(randomlyOrderedBuilding);
        stairsPlacementX = this.STRAIR_PLACEMENT_GAP;
        for (let i = 0, r = 0; i < randomlyOrderedBuilding.length; i++) {
            if (r > stairsPlacementX) {
                r += this.STAIRS.w;
                stairsPlacementX = r + this.STRAIR_PLACEMENT_GAP;
            }
            this.create(shapesHolder, topSP, bottomSP, this.h, this.g, angle, randomlyOrderedBuilding[i], i + 1, r);
            r += randomlyOrderedBuilding[i].w;
        }
        this.transformAllToAlign();
    }
}
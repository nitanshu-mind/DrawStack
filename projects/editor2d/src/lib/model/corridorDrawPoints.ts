import { Point } from './point';

export class CorridorDrawPoints {
    cx: number;
    cy: number;
    width: number;
    height: number;
    rotate: number;
    gap: number;
    ratio: number;
    sp: Point;
    ep: Point;
    paper: {width: any, height: any};
    bbox: any;
}
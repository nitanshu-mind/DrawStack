import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, DoCheck, OnDestroy, Output, EventEmitter, SimpleChanges, KeyValueDiffers, AfterViewInit } from '@angular/core';
import { Paper } from './model/paper'
import { Editor2DConfig } from './editor2d.config';
import { FreeFormDrawingData } from './model/freeFormDrawingData';
import { Corridor } from './model/corridor';
import { FreeForm } from './model/freeForm';
import { PaperConfig } from './model/userConfig';
import { ZoomHandler } from './model/zoomHandler';

declare const Raphael: any;

@Component({
  selector: 'lib-editor2d',
  template: `
  <div id="view2d-canvas" style="padding-right: 5px; position: relative;">
    <div #view2d id="svg_paper"></div>
    <div id="ruller_left"></div>
    <div id="ruller_bottom"></div>
  </div>
  `,
  styleUrls: ['./editor2d.component.scss']
})
export class Editor2dComponent implements OnInit, OnChanges, AfterViewInit, DoCheck {

  @Input() public shapeType: string = "";
  @Input() public userConfig: PaperConfig = null;
  @Input() public svgUrl: string = "";
  @Output() public output: EventEmitter<any> = new EventEmitter();

  paper: any;
  rullerLeft: any;
  rullerBottom: any;
  rullerLeftPaper: any;
  rullerBottomPaper: any;
  zoomHandler: any;
  paperConfigObject: Editor2DConfig;
  paperObject: Paper;
  paperConfig: any;
  corridorObject: Corridor; // = new Corridor(this.paper);
  freeFormObject: FreeForm;  //= new FreeForm();
  freeFormDrawingInfo: FreeFormDrawingData; // = new FreeFormDrawingData();
  corridorCordinates: any;
  oldCorridorCordinates: any = {};
  oldfreeformCordinates = {};
  freeformCordinates: any;


  readonly CONTEXT = {
    corridor: 'corridor',
    line: 'line'
  };

  @ViewChild('view2d', { static: true })

  private canvasRef: ElementRef;


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(private differs: KeyValueDiffers) {
    this.oldCorridorCordinates = {};
    this.corridorCordinates = {};
    this.freeformCordinates = {};
    this.oldCorridorCordinates['shapeCorridor'] = differs.find(this.corridorCordinates).create();
    this.oldfreeformCordinates['shapeFreeform'] = differs.find(this.freeformCordinates).create();
  }

  ngOnInit() {
      //console.log(this.userConfig);
  }

  ngOnChanges(changes) {
    if (this.shapeType == this.CONTEXT.corridor) {
     this.corridorCordinates = this.corridorObject.drawShape(this.paper,this.canvas.id);
    }
    if (this.shapeType == this.CONTEXT.line) {
      this.freeformCordinates = this.freeFormObject.drawFreeform(this.canvas.id, this.freeFormDrawingInfo);
    }
    if (this.svgUrl != undefined && this.paper != undefined) {
      this.paperObject.resetView(this.paper, this.rullerLeftPaper, this.rullerBottomPaper);
      this.shapeType = "";
      this.paperObject.drawAxis(this.paper,true);
      this.paperObject.drawing2DArea(this.paper, this.svgUrl);
    }
  }

  ngDoCheck() {
    var checkDetectionCorridor = this.oldCorridorCordinates['shapeCorridor'].diff(this.corridorCordinates);
    var checkDetectionFreeform = this.oldfreeformCordinates['shapeFreeform'].diff(this.freeformCordinates);
    if (checkDetectionCorridor != null || checkDetectionFreeform != null) {
      this.output.emit({ freeForm: this.freeformCordinates, corridor: this.corridorCordinates });
    }
  }

  setDrawableSpace(){
    this.paperConfigObject.drawingProperty.width=this.userConfig.width;
    this.paperConfigObject.drawingProperty.height=this.userConfig.height;
  }

  ngAfterViewInit(): void {
    this.paperConfigObject = new Editor2DConfig();
    //this.setDrawableSpace();
    this.paperConfig = this.paperConfigObject.paperConfig;
    this.initializePaper();
  }

  initializePaper() {
    //console.log(this.canvas);
    this.paper = Raphael(this.canvas.id, this.paperConfig.canVasConfig.width, this.paperConfig.canVasConfig.height); // Init Svg Paper
    this.rullerLeft = document.getElementById('ruller_left');
    this.rullerBottom = document.getElementById('ruller_bottom');
    this.rullerLeftPaper = Raphael('ruller_left', this.rullerLeft.containerWidth, this.rullerLeft.containerHeight);
    this.rullerBottomPaper = Raphael('ruller_bottom', this.rullerBottom.containerWidth, this.rullerBottom.containerHeight);
    this.rullerBottomPaper.canvas.id = 'rullerBottomPaper';
    this.rullerLeftPaper.canvas.id = 'rullerLeftPaper';
    this.paperObject = new Paper(this.paper, this.rullerLeftPaper, this.rullerBottomPaper); // Init graph object

    this.paperObject.drawAxis(this.paper,true);  // Plotting graph over paper
    this.corridorObject = new Corridor(this.paper,this.paperObject.paperConfig);
    this.freeFormObject = new FreeForm(this.paper,this.paperObject.paperConfig);
    this.freeFormDrawingInfo = new FreeFormDrawingData();
  }
}

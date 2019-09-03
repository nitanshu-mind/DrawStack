import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, DoCheck, OnDestroy, Output, EventEmitter, SimpleChanges, KeyValueDiffers } from '@angular/core';
import { Paper } from './model/paper'
import { Editor2DConfig } from './editor2d.config';
import { FreeFormDrawingData } from './model/freeFormDrawingData';
import { Corridor } from './model/corridor';
import { FreeForm } from './model/freeForm';
import { PaperConfig } from './model/userConfig';

declare const Raphael: any;

@Component({
  selector: 'lib-editor2d',
  template: `
    <div id="container"></div>
    <div id="view2d-canvas" style="padding-right: 5px">
      <div #view2d id="svg_paper"></div>
    </div>
  `,
  styles: []
})
export class Editor2dComponent implements OnInit, OnChanges, DoCheck {

  @Input() public shapeType: string = "";
  @Input() public userConfig: PaperConfig = null;
  @Input() public svgUrl: string = "";
  @Output() public output: EventEmitter<any> = new EventEmitter();

  paper: any;
  paperObject: Paper = new Paper(this.paper);
  paperConfigObject: Editor2DConfig = new Editor2DConfig();
  paperConfig: any = this.paperConfigObject.paperConfig;
  corridorConfig: any = this.paperConfigObject.corridorConfig;
  freeFormConfig: any = this.paperConfigObject.freeFormConfig;
  corridorObject: Corridor = new Corridor(this.paper);
  freeFormObject: FreeForm = new FreeForm();
  freeFormDrawingInfo: FreeFormDrawingData = new FreeFormDrawingData();

  readonly CONTEXT = {
    corridor: 'corridor',
    line: 'line'
  };

  @ViewChild('view2d', { static: true })

  private canvasRef: ElementRef;

  messageFromSibling: string;
  corridorCordinates: any;
  oldCorridorCordinates: any = {};
  oldfreeformCordinates = {};
  freeformCordinates: any;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(private differs: KeyValueDiffers) {
    this.oldCorridorCordinates = {};
    this.corridorCordinates = {};
    this.freeformCordinates = {};
    this.oldCorridorCordinates['myCorridor'] = differs.find(this.corridorCordinates).create();
    this.oldfreeformCordinates['myFreeform'] = differs.find(this.freeformCordinates).create();
  }

  ngOnInit() {
    if (this.userConfig != null) {
      if (this.userConfig.width) this.paperConfigObject.paperConfig.containerWidth = this.userConfig.width;
      if (this.userConfig.height) this.paperConfigObject.paperConfig.containerHeight = this.userConfig.height;
      if (this.userConfig.gridGap) this.paperConfigObject.paperConfig.containerHeight = this.userConfig.gridGap;
    }
  }

  ngOnChanges(changes) {
    if (this.shapeType == this.CONTEXT.corridor) {
      this.corridorCordinates = this.corridorObject.drawShape(this.corridorConfig, this.canvas.id, this.paper, this.corridorObject, this.paperConfig);
    }
    if (this.shapeType == this.CONTEXT.line) {
      this.freeformCordinates = this.freeFormObject.drawFreeform(this.paper, this.freeFormConfig, this.canvas.id, this.corridorConfig, this.paperConfig, this.freeFormDrawingInfo);
    }
    if (this.svgUrl != undefined && this.paper != undefined){     
      this.paperObject.resetView(this.paper);
      this.shapeType= "";
      this.paperObject.drawAxis(this.paper, this.paperConfig.gridGap, this.paperConfig.offset, this.paperConfig.ratio, this.paperConfig.containerWidth, this.paperConfig.containerHeight, true);
      this.paperObject.drawing2DArea(this.paper, this.svgUrl);
    }
  }

  ngDoCheck() {
    var checkDetectionCorridor = this.oldCorridorCordinates['myCorridor'].diff(this.corridorCordinates);
    var checkDetectionFreeform = this.oldfreeformCordinates['myFreeform'].diff(this.freeformCordinates);
    if (checkDetectionCorridor != null || checkDetectionFreeform != null) {
      this.output.emit({ freeForm: this.freeformCordinates, corridor: this.corridorCordinates });
    }
  }

  ngAfterViewInit(): void {
    this.initializePaper();
  }
  
  initializePaper(){
    this.paper = Raphael(this.canvas.id, this.paperConfig.containerWidth, this.paperConfig.containerHeight);
    this.corridorObject = new Corridor(this.paper);
    this.paperObject.drawAxis(this.paper, this.paperConfig.gridGap, this.paperConfig.offset, this.paperConfig.ratio, this.paperConfig.containerWidth, this.paperConfig.containerHeight, true);
  }
}

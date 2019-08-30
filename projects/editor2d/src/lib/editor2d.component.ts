import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, DoCheck, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  @Output() public output: EventEmitter<any> = new EventEmitter();

  paper: any;
  paperObject: Paper = new Paper();
  paperConfigObject: Editor2DConfig = new Editor2DConfig();
  paperConfig: any = this.paperConfigObject.paperConfig;
  corridorConfig: any = this.paperConfigObject.corridorConfig;
  freeFormConfig: any = this.paperConfigObject.freeFormConfig;
  corridorObject: Corridor = new Corridor(this.paper);
  freeFormObject: FreeForm = new FreeForm();
  freeFormDrawingInfo: FreeFormDrawingData = new FreeFormDrawingData();

  @ViewChild('view2d', { static: true })

  private canvasRef: ElementRef;
  corridorCordinates: any;
  freeformCordinates: any;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() { }

  ngOnInit() {
    if (this.userConfig != null) {
      if (this.userConfig.width) this.paperConfigObject.paperConfig.containerWidth = this.userConfig.width;
      if (this.userConfig.height) this.paperConfigObject.paperConfig.containerHeight = this.userConfig.height;
      if (this.userConfig.gridGap) this.paperConfigObject.paperConfig.containerHeight = this.userConfig.gridGap;
    }
  }

  ngOnChanges(changes) {
    if (this.shapeType == 'Corridor') {
      this.corridorCordinates = this.corridorObject.drawShape(this.corridorConfig, this.canvas.id, this.paper, this.corridorObject, this.paperConfig);
    }
    if (this.shapeType == 'Line') {
      this.freeformCordinates = this.freeFormObject.drawFreeform(this.paper, 10, this.canvas.id, this.corridorConfig, this.paperConfig, this.freeFormDrawingInfo);
    }
  }

  ngDoCheck() {
    this.output.emit({ freeFormCordinates: this.freeformCordinates, corridorCordinates: this.corridorCordinates });
  }

  ngAfterViewInit(): void {
    this.paper = Raphael(this.canvas.id, this.paperConfig.containerWidth, this.paperConfig.containerHeight);
    this.corridorObject = new Corridor(this.paper);
    this.paperObject.drawAxis(this.paper, this.paperConfig.gridGap, this.paperConfig.offset, this.paperConfig.ratio, this.paperConfig.containerWidth, this.paperConfig.containerHeight, true);
  }
}

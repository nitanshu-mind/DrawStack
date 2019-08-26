import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Corridor } from '../model/corridor';
import { CorridorConfig } from '../model/config/corridor.config';
import { Paper } from '../model/paper'
import { PaperConfig } from '../model/config/paper.config';
import { FreeForm } from '../model/freeForm';
import { FreeFormConfig } from '../model/config/freeForm.config';
import { FreeFormDrawingData } from '../model/freeFormDrawingData';
declare const Raphael: any;

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})

export class PaperComponent implements OnInit {
  paper: any;
  paperObject: Paper = new Paper();
  paperConfig: PaperConfig = new PaperConfig();
  corridorObject: Corridor = new Corridor();
  corridorConfig: CorridorConfig = new CorridorConfig();
  freeFormObject: FreeForm = new FreeForm();
  freeFormConfig: FreeFormConfig = new FreeFormConfig();
  freeFormDrawingInfo: FreeFormDrawingData = new FreeFormDrawingData();
  @ViewChild('view2d', { static: true })
  private canvasRef: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.paper = Raphael(this.canvas.id, this.paperConfig.containerWidth, this.paperConfig.containerHeight);
    this.paperObject.drawAxis(this.paper, this.paperConfig.gridGap, this.paperConfig.offset, this.paperConfig.ratio, this.paperConfig.containerWidth, this.paperConfig.containerHeight, true);    
    this.corridorObject.drawShape(this.corridorConfig.corridorConfig, this.canvas.id, this.paper, this.corridorObject, this.paperConfig);
    // this.freeFormObject.drawFreeform(this.paper, 10, this.canvas.id, this.corridorConfig.corridorConfig, this.paperConfig, this.freeFormDrawingInfo);
  }
}
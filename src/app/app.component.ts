import { Component } from '@angular/core';
import { PaperConfig } from 'projects/editor2d/src/lib/model/userConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DrawStack';
  shapeType: any;
  svgUrl: string
  updatedData: any = {};

  userConfig: PaperConfig = {
    width: 600,
    height: 600
  };
  
  enableCorridorDrawing() {
    this.shapeType = 'corridor';
  }

  enableLineDrawing() {
    this.shapeType = 'line';
  }

  dataEmit($event) {
    this.updatedData = $event;
  }
  
  sendSvgUrl(){
    this.svgUrl = "http://team.d-alchemy.com:9192//Content/assets/files/models/60eabfd6-cbf7-4cab-8b1f-f69675a23df9/60eabfd6-cbf7-4cab-8b1f-f69675a23df9_637029952369406483.svg"
  }

}

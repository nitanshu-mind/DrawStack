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
}

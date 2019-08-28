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

  userConfig: PaperConfig = {
    width: 100
  };
  
  enableCorridorDrawing() {
    this.shapeType = 'Corridor';
  }
  enableLineDrawing() {
    this.shapeType = 'Line';
  }

}

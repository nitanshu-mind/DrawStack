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
  svgUrl: string;
  updatedData: any = {};

  userConfig: PaperConfig = {
    width: 600,
    height: 600
  };

  enableCorridorDrawing() {
    this.shapeType = 'corridor';
    console.log(this.shapeType);
  }

  enableLineDrawing() {
    this.shapeType = 'line';
  }

  dataEmit($event) {
    this.updatedData = $event;
  }

  sendSvgUrl(){
    this.svgUrl = "http://172.29.38.153/PegasusAPI/Content/assets/files/models/b10ea613-42c7-4343-950a-e1508b15444c/b10ea613-42c7-4343-950a-e1508b15444c_637038864225431435.svg";
  }

}

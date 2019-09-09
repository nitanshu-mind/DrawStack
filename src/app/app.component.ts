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
    this.svgUrl = "http://team.d-alchemy.com:9192//Content/assets/files/models/e72a3f62-1700-46c8-87f9-8429f988768a/e72a3f62-1700-46c8-87f9-8429f988768a_637032480569269579.svg"
  }

}

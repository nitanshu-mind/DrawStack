import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DrawStack';
  shapeType: any;
  
  enableCorridorDrawing(){    
    this.shapeType = 'Corridor';
  }
  enableLineDrawing(){
    this.shapeType = 'Line';
  }
  
}

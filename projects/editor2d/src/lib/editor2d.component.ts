import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-editor2d',
  template: `  
    <div id="container"></div>
    <app-paper [shapeType] = "shapeType"></app-paper>
  `,
  styles: []
})
export class Editor2dComponent implements OnInit {
  @Input() public shapeType: string = "";
  constructor() { }
  
  ngOnInit() {
    console.log(this.shapeType, "=====================")
  }

}

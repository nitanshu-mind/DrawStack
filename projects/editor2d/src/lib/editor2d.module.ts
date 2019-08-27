import { NgModule } from '@angular/core';
import { Editor2dComponent } from './editor2d.component';
import { PaperComponent } from './paper/paper.component';



@NgModule({
  declarations: [Editor2dComponent, PaperComponent],
  imports: [
  ],
  exports: [Editor2dComponent]
})
export class Editor2dModule { }

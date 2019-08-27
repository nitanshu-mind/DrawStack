import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaperComponent } from './paper/paper.component';
import { Editor2dModule } from 'projects/editor2d/src/public-api';


@NgModule({
  declarations: [
    AppComponent,
    PaperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Editor2dModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

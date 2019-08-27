import { Injectable } from '@angular/core';
import { Point } from './point';
// import { EditorState } from 'src/app/models/editor-state-enum';

@Injectable()
export class AppData {
    projectName: string;
    projectID: string;
    existingProject: boolean;

    corridor: Corridor = new Corridor();
    // editorState: EditorState = EditorState.New;

    freeFormDrawingInfo: FreeFormDrawingData = new FreeFormDrawingData();

  resetAppData(){
    this.projectID = '';
    this.projectName = '';
    this.existingProject = false;
  }

  setProject(projectData){
    this.projectID = projectData.ProjectId;
    this.projectName = projectData.Name;
    this.existingProject = true;
  }

}


export class Corridor {
    cx: number;
    cy: number;
    width: number;
    height: number;
    rotate: number;
    gap: number;
    ratio: number;
    sp: Point;
    ep: Point;
}

export class FreeFormDrawingData {
    drawPoints: Point[] = [];
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Editor2dComponent } from './editor2d.component';

describe('Editor2dComponent', () => {
  let component: Editor2dComponent;
  let fixture: ComponentFixture<Editor2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editor2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editor2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

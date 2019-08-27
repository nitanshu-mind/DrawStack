import { TestBed } from '@angular/core/testing';

import { Editor2dService } from './editor2d.service';

describe('Editor2dService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Editor2dService = TestBed.get(Editor2dService);
    expect(service).toBeTruthy();
  });
});

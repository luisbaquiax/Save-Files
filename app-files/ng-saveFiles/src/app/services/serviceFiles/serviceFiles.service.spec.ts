/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceFilesService } from './serviceFiles.service';

describe('Service: ServiceFiles', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceFilesService]
    });
  });

  it('should ...', inject([ServiceFilesService], (service: ServiceFilesService) => {
    expect(service).toBeTruthy();
  }));
});

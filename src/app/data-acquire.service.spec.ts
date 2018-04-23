import { TestBed, inject } from '@angular/core/testing';

import { DataAcquireService } from './data-acquire.service';

describe('DataAcquireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAcquireService]
    });
  });

  it('should be created', inject([DataAcquireService], (service: DataAcquireService) => {
    expect(service).toBeTruthy();
  }));
});

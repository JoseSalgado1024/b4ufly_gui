import { TestBed, inject } from '@angular/core/testing';

import { GgGeocoderService } from './gg-geocoder.service';

describe('GgGeocoderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GgGeocoderService]
    });
  });

  it('should be created', inject([GgGeocoderService], (service: GgGeocoderService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { WeatherAcquireService } from './weather-acquire.service';

describe('WeatherAcquireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherAcquireService]
    });
  });

  it('should be created', inject([WeatherAcquireService], (service: WeatherAcquireService) => {
    expect(service).toBeTruthy();
  }));
});

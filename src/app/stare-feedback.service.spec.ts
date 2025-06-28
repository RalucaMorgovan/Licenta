import { TestBed } from '@angular/core/testing';

import { StareFeedbackService } from './stare-feedback.service';

describe('StareFeedbackService', () => {
  let service: StareFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StareFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ExpenseServicesService } from './expense-services.service';

describe('ExpenseServicesService', () => {
  let service: ExpenseServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

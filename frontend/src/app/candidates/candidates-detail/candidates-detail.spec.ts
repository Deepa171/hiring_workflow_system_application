import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDetail } from './candidates-detail';

describe('CandidatesDetail', () => {
  let component: CandidatesDetail;
  let fixture: ComponentFixture<CandidatesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

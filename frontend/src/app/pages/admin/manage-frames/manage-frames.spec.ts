import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFrames } from './manage-frames';

describe('ManageFrames', () => {
  let component: ManageFrames;
  let fixture: ComponentFixture<ManageFrames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFrames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFrames);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

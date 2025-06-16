import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameGallery } from './frame-gallery';

describe('FrameGallery', () => {
  let component: FrameGallery;
  let fixture: ComponentFixture<FrameGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

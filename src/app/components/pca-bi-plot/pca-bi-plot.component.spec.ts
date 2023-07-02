import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcaBiPlotComponent } from './pca-bi-plot.component';

describe('PcaBiPlotComponent', () => {
  let component: PcaBiPlotComponent;
  let fixture: ComponentFixture<PcaBiPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcaBiPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcaBiPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunburstPlotComponent } from './sunburst-plot.component';

describe('SunburstPlotComponent', () => {
  let component: SunburstPlotComponent;
  let fixture: ComponentFixture<SunburstPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunburstPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SunburstPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

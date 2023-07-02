import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcpPlotComponent } from './pcp-plot.component';

describe('PcpPlotComponent', () => {
  let component: PcpPlotComponent;
  let fixture: ComponentFixture<PcpPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcpPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcpPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

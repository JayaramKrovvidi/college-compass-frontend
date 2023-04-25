import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLinePlotComponent } from './multi-line-plot.component';

describe('MultiLinePlotComponent', () => {
  let component: MultiLinePlotComponent;
  let fixture: ComponentFixture<MultiLinePlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiLinePlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiLinePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

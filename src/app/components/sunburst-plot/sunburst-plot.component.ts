import { Component, ElementRef, OnInit } from '@angular/core';
import * as d2b from 'd2b';
import * as d3 from 'd3';
import { BackendService } from 'src/app/services/compass-backend-service';

@Component({
  selector: 'sunburst-plot',
  templateUrl: './sunburst-plot.component.html',
  styleUrls: ['./sunburst-plot.component.scss'],
  providers: [BackendService]
})
export class SunburstPlotComponent implements OnInit {

  svg: any;
  backend: BackendService;

  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  ngOnInit(): void {
    this.renderSunBurst();
  }

  renderSunBurst() {
    var sunburst = d2b.chartSunburst();
    const { width, height } = this.getMapContainerWidthAndHeight();
    sunburst.chartFrame().size({ width: width, height: height });
    var chart = d3.select('.sunburst-chart');
    chart
      .datum(this.getMockData())
      .transition()
      .call(sunburst)
      .on("interrupt", (data) => console.log(data));
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const mapContainerEl = this.el.nativeElement.querySelector('.sunburst-chart') as HTMLDivElement;
    const width = mapContainerEl.clientWidth;
    const height = (width / 960) * 800;
    return { width, height };
  };

  getMockData() {
    return {
      label: 'root',
      children: [
        {
          label: 'child 1',
          children: [
            {
              label: 'child 1-1',
              size: 10
            },
            {
              label: 'child 1-2',
              children: [
                {
                  label: 'child 1-2-1',
                  size: 5
                },
                {
                  label: 'child 1-3-1',
                  size: 8
                }
              ]
            },
            {
              label: 'child 1-3',
              selected: true,
              children: [
                {
                  label: 'child 1-3-1',
                  children: [
                    {
                      label: 'child 1-3-1-1',
                      size: 2
                    },
                    {
                      label: 'child 1-3-1-2',
                      size: 16
                    }
                  ]
                },
                {
                  label: 'child 1-3-2',
                  size: 8
                }
              ]
            }
          ]
        },
        {
          label: 'child 2',
          size: 25
        }
      ]
    }
  }
}

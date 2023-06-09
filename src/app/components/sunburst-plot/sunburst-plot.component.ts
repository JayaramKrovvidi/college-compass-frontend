import { Component, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as d2b from 'd2b';
import * as d3 from 'd3';
import { BackendService } from 'src/app/services/compass-backend-service';

@Component({
  selector: 'sunburst-plot',
  templateUrl: './sunburst-plot.component.html',
  styleUrls: ['./sunburst-plot.component.scss'],
  providers: [BackendService]
})
export class SunburstPlotComponent implements OnChanges {

  svg: any;
  backend: BackendService;

  @Input()
  unit_ids: number[]

  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.unit_ids && this.unit_ids.length > 0) {
      this.renderSunBurst();
    }
  }

  renderSunBurst() {
    d3.select('.sunburst-chart').select('*').remove()
    var sunburst = d2b.chartSunburst();
    const { width, height } = this.getMapContainerWidthAndHeight();
    this.backend.getSunBurstData(this.unit_ids).subscribe(data => {
      sunburst.chartFrame().size({ width: width, height: height });
      var chart = d3.select('.sunburst-chart');
      chart
        .datum(data)
        .transition()
        .call(sunburst);
    })
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const mapContainerEl = this.el.nativeElement.querySelector('.sunburst-chart') as HTMLDivElement;
    const width = mapContainerEl.clientWidth;
    const height = (width / 960) * 600;
    return { width, height };
  };

  getMockData() {
    return {
      label: 'year',
      children: [
        {
          label: '2017',
          children: [
            {
              label: 'American Indian / Alaskan Native',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Asian',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Black / African',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hispanic',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hawaiian Pacific',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'White',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Multiple Races',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Unknown',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Non Resident Alien',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            }
          ]
        },
        {
          label: '2018',
          children: [
            {
              label: 'American Indian / Alaskan Native',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Asian',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Black / African',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hispanic',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hawaiian Pacific',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'White',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Multiple Races',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Unknown',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Non Resident Alien',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            }
          ]
        },
        {
          label: '2019',
          children: [
            {
              label: 'American Indian / Alaskan Native',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Asian',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Black / African',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hispanic',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hawaiian Pacific',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'White',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Multiple Races',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Unknown',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Non Resident Alien',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            }
          ]
        },
        {
          label: '2020',
          children: [
            {
              label: 'American Indian / Alaskan Native',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Asian',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Black / African',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hispanic',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hawaiian Pacific',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'White',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Multiple Races',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Unknown',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Non Resident Alien',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            }
          ]
        },
        {
          label: '2021',
          children: [
            {
              label: 'American Indian / Alaskan Native',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Asian',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Black / African',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hispanic',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Hawaiian Pacific',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'White',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Multiple Races',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Unknown',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            },
            {
              label: 'Non Resident Alien',
              children: [
                {
                  label: 'men',
                  size: 10
                },
                {
                  label: 'women',
                  size: 10
                }
              ]
            }
          ]
        }
      ]
    }
  }
}

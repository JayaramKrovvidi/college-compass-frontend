// @ts-nocheck
import { Component, ElementRef, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { BackendService, LocationDataPoint } from 'src/app/services/compass-backend-service';
import * as topojson from 'topojson-client';

@Component({
  selector: 'usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.scss'],
  providers: [BackendService]
})
export class UsaMapComponent implements OnChanges {

  @Input('unit_ids')
  unit_ids: number[]

  @Output()
  onBrush: EventEmitter<number[]> = new EventEmitter<number[]>();

  svg: any;
  backend: BackendService
  colleges: LocationDataPoint[]

  projection: any; width: any; height: any;

  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.unit_ids && this.unit_ids.length > 0) {
      this.refreshColleges()
      this.draw()
    }
  }

  async draw() {
    this.getMapContainerWidthAndHeight();
    this.projection = d3.geoAlbersUsa().scale(this.width).translate([this.width / 2, this.height / 2.2]);
    const path = d3.geoPath().projection(this.projection);

    this.svg = d3.select('#map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append("g")

    await this.renderMap(path);
    this.plotColleges()
  }

  getMapContainerWidthAndHeight = () => {
    const mapContainerEl = this.el.nativeElement.querySelector('#map') as HTMLDivElement;
    this.width = mapContainerEl.clientWidth;
    this.height = (this.width / 960) * 500;
  };


  private async renderMap(path: d3.GeoPath<any, d3.GeoPermissibleObjects>) {
    const usa = await d3.json('assets/states-10m.json');
    this.svg.selectAll('path')
      .data(topojson.feature(usa, usa.objects.nation).features)
      .enter().append("path")
      .attr("d", path)
      .style('fill', '#d9d9d9')
      .style('stroke', '#FFF')
      .style('stroke-width', '0.7')

    this.svg.append("path")
      .datum(topojson.mesh(usa, usa.objects.states, function (a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path)
      .style('fill', '#d9d9d9')
      .style('stroke', '#FFF')
      .style('stroke-width', '0.7')
  }

  private async plotColleges() {
    this.backend.getMapData(this.unit_ids ? this.unit_ids : []).subscribe(data => {
      this.colleges = data.colleges;

      const radiusScale = d3.scaleLinear()
        .domain([d3.min(this.colleges, d => d.population), d3.max(this.colleges, d => d.population)] as number[])
        .range([5, 25]);

      this.svg.selectAll('.map-circle')
        .data(this.colleges)
        .enter()
        .append('circle')
        .attr('class', 'map-circle')
        .attr('cx', (d) => this.projection([d.longitude, d.latitude]) ? this.projection([d.longitude, d.latitude])![0] : 0)
        .attr('cy', (d) => this.projection([d.longitude, d.latitude]) ? this.projection([d.longitude, d.latitude])![1] : 0)
        .attr('r', (d) => this.projection([d.longitude, d.latitude]) && d.population ? 2 * radiusScale(d.population) : 0)
        .transition()
        .delay(500)
        .duration(1000)
        .ease(d3.easeElasticOut)
        .style('fill', '#8365a3')
        .style("opacity", 0.2)
        .attr('r', (d: any) => this.projection([d.longitude, d.latitude]) && d.population ? radiusScale(d.population) : 0)
      // .append('title')
      // .text((d) => `${d.name}, Population: ${d.population}`)

      this.addBrushing();
    })
  }

  refreshColleges() {
    d3.select('#map').html('');
  }

  addBrushing() {
    const _this = this
    const brush = d3.brush()
      .extent([[0, 0], [this.width, this.height]])
      .on("end", (event) => {
        const selection = event.selection
        if (selection) {
          const selectedColleges = _this.colleges.filter(d => {
            const point = this.projection([d.longitude, d.latitude]);
            return point && selection[0][0] <= point[0] && point[0] <= selection[1][0] && selection[0][1] <= point[1] && point[1] <= selection[1][1];
          });
          const unitIds = selectedColleges.map(d => d.unit_id);
          _this.onBrush.emit(unitIds)
        }
      })
    this.svg.call(brush);
  }

}

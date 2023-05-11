// @ts-nocheck

import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BackendService, LocationDataPoint } from 'src/app/services/compass-backend-service';
import * as topojson from 'topojson-client';

@Component({
  selector: 'usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.scss'],
  providers: [BackendService]
})
export class UsaMapComponent implements OnInit {

  svg: any;
  backend: BackendService
  col: LocationDataPoint[]

  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  ngOnInit(): void {
    this.draw()
  }

  draw() {
    d3.select(`#map`).html("");
    const { width, height } = this.getMapContainerWidthAndHeight();
    this.svg = d3.select('#map')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append("g")

    const projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2.2]);
    const path = d3.geoPath().projection(projection);

    this.renderMap(path, projection, width, height);
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const mapContainerEl = this.el.nativeElement.querySelector('#map') as HTMLDivElement;
    const width = mapContainerEl.clientWidth;
    const height = (width / 960) * 500;
    return { width, height };
  };


  private renderMap(path: d3.GeoPath<any, d3.GeoPermissibleObjects>, projection: any, width: any, height: any) {
    d3.json('https://unpkg.com/us-atlas@3.0.0/states-10m.json').then((usa: any) => {

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

      this.backend.getMapData().subscribe(data => {
        this.col = data.colleges;

        const radiusScale = d3.scaleLinear()
          .domain([d3.min(this.col, d => d.population), d3.max(this.col, d => d.population)] as number[])
          .range([4, 12]);

        this.svg.selectAll('circle')
          .data(this.col)
          .enter()
          .append('circle')
          .attr('cx', (d) => projection([d.longitude, d.latitude]) ? projection([d.longitude, d.latitude])![0] : 0)
          .attr('cy', (d) => projection([d.longitude, d.latitude]) ? projection([d.longitude, d.latitude])![1] : 0)
          .attr('r', (d) => projection([d.longitude, d.latitude]) && d.population ? 2 * radiusScale(d.population) : 0)
          .transition()
          .delay(500)
          .duration(1000)
          .ease(d3.easeElasticOut)
          .style('fill', '#8365a3')
          .style("opacity", 0.2)
          .attr('r', (d: any) => projection([d.longitude, d.latitude]) && d.population ? radiusScale(d.population) : 0)
        // .append('title')
        // .text((d) => `${d.name}, Population: ${d.population}`)

        this.addBrushing(width, height, projection);
      })
    });
  }

  addBrushing(width, height, projection) {
    const _this = this
    const brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on("end", (event) => {
        const selection = event.selection
        if (selection) {
          const selectedColleges = _this.col.filter(d => {
            const point = projection([d.longitude, d.latitude]);
            return point && selection[0][0] <= point[0] && point[0] <= selection[1][0] && selection[0][1] <= point[1] && point[1] <= selection[1][1];
          });
          const unitIds = selectedColleges.map(d => d.unit_id);
          console.log(unitIds)
        }
      })
    this.svg.call(brush);

  }

}

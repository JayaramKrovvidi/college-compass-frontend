import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';

interface College {
  name: string;
  latitude: number;
  longitude: number;
  enrolled_students: number;
}

@Component({
  selector: 'usa-map',
  templateUrl: './usa-map.component.html',
  styleUrls: ['./usa-map.component.scss']
})
export class UsaMapComponent implements OnInit {

  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  projection: d3.GeoIdentityTransform;
  collegeProjection: d3.GeoIdentityTransform;
  states: any; nation: any; colleges: GeoJSON.FeatureCollection<GeoJSON.Point, College>;
  path: d3.GeoPath<any, d3.GeoPermissibleObjects>;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    d3.json('https://d3js.org/us-10m.v1.json').then((topology: any) => {
      this.states = topojson.feature(topology, topology.objects.states as GeometryCollection);
      this.nation = topojson.feature(topology, topology.objects.nation)
      this.drawMap();
    });
    d3.select(window).on('resize', this.resizeMap);
  }

  private drawMap() {
    const { width, height } = this.getMapContainerWidthAndHeight();
    this.projection = d3.geoIdentity().fitSize([width, height], this.states);
    this.path = d3.geoPath(this.projection)

    this.svg = d3.select('#map')
      .append('svg')
      .attr('width', width + 50)
      .attr('height', height);

    this.renderNationFeatures();
    this.renderStateFeatures();
    this.plotColleges(width, height);
  }

  renderNationFeatures(): void {
    this.svg.select('defs')
      .append('path')
      .datum(this.nation)
      .attr('id', 'nation')
      .attr('d', this.path);

    this.svg.append('use')
      .attr('xlink:href', '#nation')
      .attr('fill-opacity', 0.2)
      .attr('filter', 'url(#blur)');

    this.svg.append('use')
      .attr('xlink:href', '#nation')
      .attr('fill', '#fff');
  }

  renderStateFeatures(): void {
    this.svg.append('g')
      .attr('class', 'state')
      .attr('fill', 'none')
      .attr('stroke', '#BDBDBD')
      .attr('stroke-width', '0.7')
      .selectAll('path.state')
      .data(this.states["features"])
      .join('path')
      .attr('id', (d: any) => d.id)
      .attr('d', this.path as any);
  }

  plotColleges(width: number, height: number) {
    const col: College[] = this.generateRandomColleges();

    this.colleges = {
      type: "FeatureCollection",
      features: [],
    };

    // convert each college data point into a GeoJSON feature
    col.forEach((college) => {
      const feature: GeoJSON.Feature<GeoJSON.Point, College> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [college.longitude, college.latitude],
        },
        properties: college,
      };
      this.colleges.features.push(feature);
    });

    const radiusScale = d3.scaleLinear()
      .domain([d3.min(col, d => d.enrolled_students), d3.max(col, d => d.enrolled_students)] as number[])
      .range([3, 10]);

    this.collegeProjection = d3.geoIdentity()
      .fitSize([width, height], this.colleges);

    const _this = this
    const collegeCircles = this.svg.selectAll(".college")
      .data(this.colleges.features)
      .enter().append("circle")
      .attr("class", "college")
      .attr("cx", (d: any) => _this.getCollegeCoordinates(d)[0])
      .attr("cy", (d: any) => _this.getCollegeCoordinates(d)[1])
      .attr("r", (d: any) => radiusScale(d.properties.enrolled_students))
      .style("fill", "blue")
      .style("opacity", 0.1);
  }

  generateRandomColleges() {
    const colleges: College[] = []

    for (let i = 0; i < 1000; i++) {
      let college: College = {
        name: 'College ' + i,
        latitude: Math.random() * (72 - 13) + 13,
        longitude: Math.random() * (146 + 177) - 177,

        enrolled_students: Math.floor(Math.random() * 10000)
      };

      colleges.push(college);
    }
    return colleges
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const mapContainerEl = this.el.nativeElement.querySelector('#map') as HTMLDivElement;
    const width = mapContainerEl.clientWidth - 50;
    const height = (width / 960) * 600;
    return { width, height };
  };

  resizeMap = () => {
    const { width, height } = this.getMapContainerWidthAndHeight();
    this.svg.attr('width', width + 50).attr('height', height);

    // update projection
    this.projection.fitSize([width, height], this.states);
    this.collegeProjection.fitSize([width, height], this.colleges);

    // resize the map
    this.svg.selectAll('path').attr('d', this.path as any);
    this.svg.selectAll('circle')
      .attr("cx", (d: any) => this.getCollegeCoordinates(d)[0])
      .attr("cy", (d: any) => this.getCollegeCoordinates(d)[1])
  };

  getCollegeCoordinates(d: any) {
    return [this.collegeProjection(d.geometry.coordinates as [number, number])?.[0] || 0,
    this.collegeProjection(d.geometry.coordinates as [number, number])?.[1] || 0]
  }
}

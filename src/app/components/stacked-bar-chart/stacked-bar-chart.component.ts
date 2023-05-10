import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BackendService, BarChartData } from 'src/app/services/compass-backend-service';

@Component({
  selector: 'stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
  providers: [BackendService]
})
export class StackedBarChartComponent implements OnInit {

  svg: any;
  backend: BackendService;

  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }


  ngOnInit(): void {
    this.drawBarChart()
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const mapContainerEl = this.el.nativeElement.querySelector('#stacked-bar') as HTMLDivElement;
    const width = mapContainerEl.clientWidth;
    const height = (width / 960) * 800;
    return { width, height };
  };

  drawBarChart() {
    const { width, height } = this.getMapContainerWidthAndHeight();
    const margin = { top: 20, right: 40, bottom: 50, left: 60 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const graph = this.createGraph(width, height, margin, graphWidth, graphHeight);

    const data = this.backend.getStackedBarChartData();
    const { xScale, yScale, colorScale } = this.createAxes(data, graphWidth, graphHeight, graph);
    this.drawBars(graph, data, xScale, yScale, colorScale);
  }

  private createGraph(width: number, height: number, margin: any, graphWidth: number, graphHeight: number) {
    this.svg = d3.select('#stacked-bar')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const graph = this.svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    graph.append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "end")
      .attr("x", graphWidth / 2)
      .attr("y", graphHeight + 40)
      .style('font-weight', 'bolder')
      .text('Time (Year) \u2192');

    graph.append("text")
      .attr("class", "y-axis-label")
      .attr("y", -40)
      .attr("x", -graphHeight / 4)
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .style('font-weight', 'bolder')
      .text('Average Number of People \u2192');
    return graph;
  }

  private createAxes(data: BarChartData[], graphWidth: number, graphHeight: number, graph: any) {
    const years = data.map(d => d.year);
    const maxCount = d3.max(data.flatMap(d => [
      d.applicants.men + d.applicants.women,
      d.admissions.men + d.admissions.women,
      d.enrollments.men + d.enrollments.women,
    ]));

    const xScale = d3.scaleBand()
      .domain(years.map(y => y.toString()))
      .range([0, graphWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, maxCount])
      .range([graphHeight, 0])
      .nice();

    const colorScale = d3.scaleOrdinal()
      .domain(['men', 'women'])
      .range(['#98abc5', '#8a89a6']);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const xAxisGrid = d3.axisBottom(xScale).tickSize(-graphHeight).tickFormat((s, i) => "");
    const yAxisGrid = d3.axisLeft(yScale).tickSize(-graphWidth).tickFormat((s, i) => "");

    graph.append('g')
      .attr('class', 'x-axis')
      .attr('opacity', '0.1')
      .attr('transform', 'translate(0,' + graphHeight + ')')
      .call(xAxisGrid);

    graph.append('g')
      .attr('class', 'y-axis')
      .attr('opacity', '0.1')
      .call(yAxisGrid);

    graph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`)
      .call(xAxis);

    graph.append('g').call(yAxis);
    return { xScale, yScale, colorScale };
  }

  private drawBars(graph: any, data: BarChartData[], xScale: any, yScale: any, colorScale: any) {
    const groups = graph.selectAll('g.group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'group')
      .attr('transform', d => `translate(${xScale(d.year.toString())}, 0)`);

    const rects = groups.selectAll('rect')
      .data(d => [
        { key: 'applicants', values: d.applicants },
        { key: 'admissions', values: d.admissions },
        { key: 'enrollments', values: d.enrollments },
      ]);

    rects.enter()
      .append('rect')
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .attr('x', (d, i) => i * (xScale.bandwidth() / 3))
      .attr('y', d => yScale(d.values.men))
      .attr('height', d => yScale(0) - yScale(d.values.men))
      .attr('width', xScale.bandwidth() / 3 - 5)
      .attr('fill', (d, i) => colorScale('men'));

    rects.enter()
      .append('rect')
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .attr('x', (d, i) => i * (xScale.bandwidth() / 3))
      .attr('y', d => yScale(d.values.men + d.values.women))
      .attr('height', d => yScale(0) - yScale(d.values.women))
      .attr('width', xScale.bandwidth() / 3 - 5)
      .attr('fill', (d, i) => colorScale('women'));
  }
}

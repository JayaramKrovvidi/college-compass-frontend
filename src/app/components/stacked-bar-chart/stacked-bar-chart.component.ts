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

    this.backend.getStackedBarChartData([]).subscribe(d => {
      const data = d;
      const { xScale, yScale, colorScale, highlightColorScale } = this.createAxes(data, graphWidth, graphHeight, graph);
      this.drawBars(graph, data, xScale, yScale, colorScale, highlightColorScale);
    })
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

    const highlightColorScale = d3.scaleOrdinal()
      .domain(['men', 'women'])
      .range(['#ff6600', '#b24700']);

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
    return { xScale, yScale, colorScale, highlightColorScale };
  }

  private drawBars(graph: any, data: BarChartData[], xScale: any, yScale: any, colorScale: any, highlightColorScale: any) {
    const year_groups = graph.selectAll('g.group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'year-group')
      .attr('transform', d => `translate(${xScale(d.year.toString())}, 0)`);

    const bars = year_groups.selectAll('.bar-group')
      .data((d, i) => {
        console.log(d);
        return [
          { key: 'applicants', values: d.applicants, id: (i * 3) + 0 },
          { key: 'admissions', values: d.admissions, id: (i * 3) + 1 },
          { key: 'enrollments', values: d.enrollments, id: (i * 3) + 2 },
        ]
      })
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('class', 'group-item')
      .on("mouseover", (event, d) => {
        event.currentTarget.setAttribute('class', "highlighted-group-item")
        d3.select(event.currentTarget).style('cursor', 'pointer');
        d3.select(event.currentTarget).selectAll('rect')
          .attr('fill', (x, i) => (i % 2 == 0) ? highlightColorScale('men') : highlightColorScale('women'));

        const tooltip = d3.select(event.currentTarget).append('g')
          .attr('class', 'tooltip')

        tooltip.append('rect')
          .attr('width', 100)
          .attr('height', 50)
          .attr('fill', '#333')
          .attr('fill-opacity', 0.8);

        tooltip.append('text')
          .text(`Men: ${d.values.men}`)
          .attr('x', 10)
          .attr('y', 20)
          .attr('fill', '#fff');

        tooltip.append('text')
          .text(`Women: ${d.values.women}`)
          .attr('x', 10)
          .attr('y', 40)
          .attr('fill', '#fff');
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).selectAll('g.tooltip').remove()
        event.currentTarget.setAttribute('class', "group-item")
        d3.select(event.currentTarget).style('cursor', 'default');
        d3.select(event.currentTarget).selectAll('rect')
          .attr('fill', (d, i) => (i % 2 == 0) ? colorScale('men') : colorScale('women'));
      })

    const rects = bars.selectAll('.rect')
      .data(d => {
        console.log(d);
        return [
          { key: d.key, men: d.values.men, women: d.values.women, id: (d.id * 2) },
          { key: d.key, men: d.values.men, women: d.values.women, id: (d.id * 2) + 1 }
        ]
      })

    const barWidth = xScale.bandwidth() / 3;

    rects
      .enter()
      .filter((d) => d.id % 2 == 0)
      .append('rect')
      .transition()
      .duration(500)
      .delay((d) => (d.id % 3) * 50)
      .attr('x', (d) => ((d.id / 2) % 3) * barWidth)
      .attr('y', d => yScale(d.men))
      .attr('height', d => yScale(0) - yScale(d.men))
      .attr('width', barWidth - 5)
      .attr('fill', (d, i) => colorScale('men'));

    rects.enter()
      .filter((d) => d.id % 2 == 1)
      .append('rect')
      .transition()
      .duration(500)
      .delay((d) => (d.id % 3) * 50)
      .attr('x', (d) => (((d.id - 1) / 2) % 3) * barWidth)
      .attr('y', d => yScale(d.men + d.women))
      .attr('height', d => yScale(0) - yScale(d.women))
      .attr('width', barWidth - 5)
      .attr('fill', (d, i) => colorScale('women'));
  }
}

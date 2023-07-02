import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { BackendService, Point, Tuition } from 'src/app/services/compass-backend-service';

@Component({
  selector: 'multi-line-plot',
  templateUrl: './multi-line-plot.component.html',
  styleUrls: ['./multi-line-plot.component.scss'],
  providers: [BackendService]
})
export class MultiLinePlotComponent implements OnInit, OnChanges {

  @Input()
  unit_ids: number[]

  backend: BackendService;
  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  margin = { top: 20, right: 30, bottom: 40, left: 80 };
  width: number; height: number;
  graphWidth: number; graphHeight: number;

  private lineColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
  private years = ["2017", "2018", "2019", "2020", "2021"];

  private labels: string[] = ['(In-District) On Campus', '(In-District) Off Campus', '(In-State) On Campus', '(In-State) Off Campus', '(Out-of-State) On Campus', '(Out-of-State) Off Campus']

  private svg: any;
  public legendItems = [
    { label: '(In-District) On Campus', color: this.lineColors[0] },
    { label: '(In-District) Off Campus', color: this.lineColors[3] },
    { label: '(In-State) On Campus', color: this.lineColors[1] },
    { label: '(In-State) Off Campus', color: this.lineColors[4] },
    { label: '(Out-of-State) On Campus', color: this.lineColors[2] },
    { label: '(Out-of-State) Off Campus', color: this.lineColors[5] },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.unit_ids && this.unit_ids.length > 0) {
      d3.select('#multi-line-plot').html('')
      this.backend.getTuitionData(this.unit_ids).subscribe(data => this.createChart(data));
    }
  }

  ngOnInit(): void {
    const { width, height } = this.getMapContainerWidthAndHeight()
    this.width = width;
    this.height = height;
    this.graphWidth = width - this.margin.left - this.margin.right;
    this.graphHeight = height - this.margin.top - this.margin.bottom;
  }

  generateRandomData(numYears: number): Point[] {
    return this.years.slice(0, numYears).map(year => ({
      year,
      cost: Math.round(Math.random() * 5000 + 10000), // random cost between $10,000 and $15,000
    }));
  }

  createChart(data) {
    this.svg = d3.select('#multi-line-plot').append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const chart = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    chart.append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "end")
      .attr("x", this.graphWidth / 1.5)
      .attr("y", this.graphHeight + 40)
      .style('font-weight', 'bolder')
      .text('Time (Year) \u2192');

    chart.append("text")
      .attr("class", "y-axis-label")
      .attr("y", -55)
      .attr("x", -this.graphHeight / 10)
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .style('font-weight', 'bolder')
      .text('Average Tuition Cost (USD) \u2192');

    // create the x and y scales
    const xScale: any = d3.scaleBand()
      .domain(this.years)
      .range([0, this.graphWidth]);

    const maxY = Math.max(...Object.keys(data).map((d) => Math.max(...data[d].map(p => p.cost))))
    const minY = Math.min(...Object.keys(data).map((d) => Math.min(...data[d].map(p => p.cost))))

    const yScale = d3.scaleLinear()
      .domain([minY, maxY])
      .range([this.graphHeight, 0]);

    // create the line generators
    const line = d3.line<Point>()
      .x((d) => xScale(d.year) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.cost));

    // create a color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(this.labels)
      .range(this.lineColors);

    const xAxisGrid = d3.axisBottom(xScale).tickSize(-this.graphHeight).tickFormat((s, i) => "");
    const yAxisGrid = d3.axisLeft(yScale).tickSize(-this.graphWidth).tickFormat((s, i) => "");

    chart.append('g')
      .attr('class', 'x-axis')
      .attr('opacity', '0.1')
      .attr('transform', 'translate(0,' + this.graphHeight + ')')
      .call(xAxisGrid);

    chart.append('g')
      .attr('class', 'y-axis')
      .attr('opacity', '0.1')
      .call(yAxisGrid);

    // add the x axis
    const xAxis = d3.axisBottom(xScale);
    chart.append("g")
      .attr("transform", `translate(0, ${this.graphHeight})`)
      .call(xAxis);

    // add the y axis
    const yAxis = d3.axisLeft(yScale);
    chart.append("g")
      .call(yAxis);

    Object.keys(data).forEach((key, idx) => {
      chart.append("path")
        .datum(data[key])
        .attr("fill", "none")
        .attr("stroke", colorScale(this.labels[idx]))
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("class", `line-${key}`)
        .transition()
        .duration(1000)
        .attrTween("stroke-dasharray", function () {
          var length = this.getTotalLength();
          return d3.interpolate(`0,${length}`, `${length},${length}`);
        });

      const lineCircles = chart.selectAll(`.circle-${key}`)
        .data(data[key])
        .enter()
        .append("circle")
        .attr("class", `circle circle-${key}`)
        .attr("cx", (d: any) => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", (d: any) => yScale(d.cost))
        .attr("r", 4)
        .style("fill", (d: any) => colorScale(this.labels[idx]))


      lineCircles.on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style('cursor', 'pointer')
        const txt = `Year: ${d.year}, Average Cost: ${d.cost}`;
        const tooltip = chart.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${(xScale(d.year) + xScale.bandwidth() / 2) - txt.length*5}, ${yScale(d.cost) - 15})`);

        const text = tooltip.append('text')
          .text(txt)
          .attr('fill', '#374787')
          .attr('font-size', '1rem')
          .attr('font-weight', '600');

        const bbox = text.node()?.getBBox();

        tooltip.insert('rect', 'text')
          .attr('fill', '#F9F9F9')
          .attr('stroke', '#374787')
          .attr('stroke-width', '1px')
          .attr('rx', '5px')
          .attr('ry', '5px')
          .attr('width', bbox?.width ? bbox.width + 10 : 0)
          .attr('height', bbox?.height ? bbox.height + 10 : 0)
          .attr('x', bbox?.x ? bbox.x - 5 : 0)
          .attr('y', bbox?.y ? bbox.y - 5 : 0);


      }).on("mouseout", (event, d) => {
        this.svg.select('g.tooltip').remove()
        d3.select(event.currentTarget).style('cursor', 'default')
      })
    })

  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const lineContainer = this.el.nativeElement.querySelector('#multi-line-plot') as HTMLDivElement;
    const width = lineContainer.clientWidth - 50;
    const height = (width / 960) * 600;
    return { width, height };
  };
}

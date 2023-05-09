import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface TuitionData {
  year: number;
  [key: string]: any;
}

@Component({
  selector: 'multi-line-plot',
  templateUrl: './multi-line-plot.component.html',
  styleUrls: ['./multi-line-plot.component.scss']
})
export class MultiLinePlotComponent implements OnInit {

  constructor(private el: ElementRef) { }

  margin = { top: 20, right: 20, bottom: 40, left: 50 };
  width: number; height: number;
  graphWidth: number; graphHeight: number;
  data: TuitionData[] = [
    { year: 2017, avgTuitionInState: 10000, avgOtherExpInState: 5000, avgTuitionOutState: 20000, avgOtherExpOutState: 7000 },
    { year: 2018, avgTuitionInState: 12000, avgOtherExpInState: 6500, avgTuitionOutState: 22000, avgOtherExpOutState: 7500 },
    { year: 2019, avgTuitionInState: 13000, avgOtherExpInState: 6000, avgTuitionOutState: 24000, avgOtherExpOutState: 8000 },
    { year: 2020, avgTuitionInState: 18000, avgOtherExpInState: 7300, avgTuitionOutState: 26000, avgOtherExpOutState: 8500 },
    { year: 2021, avgTuitionInState: 22000, avgOtherExpInState: 8000, avgTuitionOutState: 28000, avgOtherExpOutState: 9000 },
    { year: 2022, avgTuitionInState: 22000, avgOtherExpInState: 15000, avgTuitionOutState: 30000, avgOtherExpOutState: 9500 }
  ];
  lineColors = ['#00AEEF', '#FFC726', '#ED1C24', '#8DC63F'];
  private colors = d3.scaleOrdinal(d3.schemeCategory10);
  private svg: any;
  public legendItems = [
    { label: 'Avg. Tuition (In-State)', color: this.lineColors[0] },
    { label: 'Avg. Other Exp. (In-State)', color: this.lineColors[1] },
    { label: 'Avg. Tuition (Out-of-State)', color: this.lineColors[2] },
    { label: 'Avg. Other Exp. (Out-of-State)', color: this.lineColors[3] },
  ];

  ngOnInit(): void {
    const { width, height } = this.getMapContainerWidthAndHeight()
    this.width = width;
    this.height = height;
    this.graphWidth = width - this.margin.left - this.margin.right;
    this.graphHeight = height - this.margin.top - this.margin.bottom;
    this.createChart();
  }

  createChart(): void {

    this.svg = d3.select('#multi-line-plot').append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const chart = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // create the x and y scales
    const xScale: any = d3.scaleBand().range([0, this.graphWidth]);
    xScale.domain(this.data.map(d => d.year))

    const yScale = d3.scaleLinear()
      .domain([0, 35000])
      .range([this.graphHeight, 0]);

    // create the line generators
    const lineAvgInStateTuition = d3.line<TuitionData>()
      .x((d) => xScale(d['year']))
      .y((d) => yScale(d['avgTuitionInState']));

    const lineAvgInStateExpenditures = d3
      .line<TuitionData>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d['avgOtherExpInState']));

    const lineAvgOutOfStateTuition = d3
      .line<TuitionData>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d['avgTuitionOutState']));

    const lineAvgOutOfStateExpenditures = d3
      .line<TuitionData>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d['avgOtherExpOutState']));

    // create a color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["Avg In-State Tuition", "Avg In-State Expenditures", "Avg Out-of-State Tuition", "Avg Out-of-State Expenditures"])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

    // add the x axis
    const xAxis = d3.axisBottom(xScale);
    chart.append("g")
      .attr("transform", `translate(0, ${this.graphHeight})`)
      .call(xAxis);

    // add the y axis
    const yAxis = d3.axisLeft(yScale);
    chart.append("g")
      .call(yAxis);

    // add the lines
    chart.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", colorScale("Avg In-State Tuition"))
      .attr("stroke-width", 2)
      .attr("d", lineAvgInStateTuition);

    chart.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", colorScale("Avg In-State Expenditures"))
      .attr("stroke-width", 2)
      .attr("d", lineAvgInStateExpenditures);

    chart.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", colorScale("Avg Out-of-State Tuition"))
      .attr("stroke-width", 2)
      .attr("d", lineAvgOutOfStateTuition);

    chart.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", colorScale("Avg Out-of-State Expenditures"))
      .attr("stroke-width", 2)
      .attr("d", lineAvgOutOfStateExpenditures);

    // add the legend
    const legend = chart.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.width - 100}, 10)`);

    // Add colored squares to legend
    const _this = this
    legend.selectAll("square")
      .data(this.legendItems)
      .enter()
      .append("rect")
      .attr("x", 100 + this.width - 100)
      .attr("y", function (d: any, i: any) { return i * (100 + _this.width - 100); })
      .attr("width", 100)
      .attr("height", 100)
      .style("fill", function (d: any) { return d.color })
      .style("stroke", function (d: any) { return d.color });

    // Add text to legend
    legend.selectAll("label")
      .data(this.legendItems)
      .enter()
      .append("text")
      .attr("x", 100 + this.width - 100 + 20)
      .attr("y", function (d: any, i: any) { return i * (100 + _this.width - 100) + (100 / 2); })
      .text(function (d: any) { return d.label; });
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const lineContainer = this.el.nativeElement.querySelector('#multi-line-plot') as HTMLDivElement;
    const width = lineContainer.clientWidth - 50;
    const height = (width / 960) * 600;
    return { width, height };
  };
}

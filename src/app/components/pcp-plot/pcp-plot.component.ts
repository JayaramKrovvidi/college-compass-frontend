import { Component, EventEmitter, OnInit, ElementRef, Output } from '@angular/core';
import * as d3 from 'd3';
import ParCoords from 'parcoord-es';
import { ViewEncapsulation } from '@angular/core';
import { BackendService } from 'src/app/services/compass-backend-service';

@Component({
  selector: 'pcp-plot',
  templateUrl: './pcp-plot.component.html',
  styleUrls: ['./pcp-plot.component.scss'],
  providers: [BackendService],
  encapsulation: ViewEncapsulation.None
})
export class PcpPlotComponent implements OnInit {

  @Output()
  onBrush: EventEmitter<number[]> = new EventEmitter<number[]>();

  backend: BackendService
  svg; container;
  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  ngOnInit(): void {
    this.x();
    this.container = this.el.nativeElement.querySelector('#pcp') as HTMLDivElement;
    this.renderPCP();
  }
  renderPCP() {
    this.removeExistingPlot();
    const { width, height } = this.getMapContainerWidthAndHeight();
    this.svg = d3.select(this.container)
      .attr("style", "width: " + (width + 100) + "px; height: " + height + "px;")

    const colors = this.get_color_generator();
    console.log(this.svg.node())

    var pcpPlot = ParCoords()(this.svg.node());

    pcpPlot.data(this.backend.getPCPData())
      .hideAxis(["unit_id"])
      .color(function (item) { return colors(item["state"]); })
      .alpha(0.2)
      .reorderable()
      .composite("darker")
      .render()
      .brushMode("1D-axes")
      .on("brushend", this.brushed);
  }

  brushed = (data) => {
    var unit_ids = data.map(function(d) { return d.unit_id; });
    this.onBrush.emit(unit_ids);
  }

  removeExistingPlot() {
    d3.select(`figure#parcoords`).html("");
  }

  get_color_generator() {
    return d3.scaleOrdinal()
      .domain(["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"])
      .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22',
      '#17becf', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22',
      '#17becf', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22',
      '#17becf', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22',
      '#17becf', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']);
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const width = this.container.clientWidth;
    const height = (width / 960) * 600;
    return { width, height };
  };

  x() {
    const stateAbbrs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    const colorScale = d3.scaleOrdinal()
      .domain(stateAbbrs)
      .range(d3.schemeCategory10);
    const distinctColors = [];

    for (const state of stateAbbrs) {
      const color = colorScale(state);
      distinctColors.push(color);
    }
    console.log(distinctColors)
  }

}
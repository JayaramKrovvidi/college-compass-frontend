import { Component, EventEmitter, SimpleChanges, OnChanges, ElementRef, Input, Output } from '@angular/core';
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
export class PcpPlotComponent implements OnChanges {

  @Input()
  unit_ids: number[]

  @Output()
  onBrush: EventEmitter<number[]> = new EventEmitter<number[]>();

  backend: BackendService
  svg; container;
  constructor(private el: ElementRef, backend: BackendService) {
    this.backend = backend;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.unit_ids && this.unit_ids.length > 0) {
      this.container = this.el.nativeElement.querySelector('#pcp') as HTMLDivElement;
      this.backend.getPCPData(this.unit_ids).subscribe(data => {
        this.renderPCP(data);
      })
    }
  }

  renderPCP(data) {
    this.removeExistingPlot();
    const { width, height } = this.getMapContainerWidthAndHeight();
    this.svg = d3.select(this.container)
      .attr("style", "width: " + (width) + "px; height: " + height + "px;")

    const colors = this.get_color_generator();

    var pcpPlot = ParCoords()(this.svg.node());

    pcpPlot.data(data)
      .hideAxis(["unit_id", "cluster_num"])
      .color(function (item) { return colors(item["cluster_num"].toString()); })
      .alpha(0.2)
      .reorderable()
      .composite("darker")
      .bundleDimension("Admissions")
      .smoothness(0.2)
      .render()
      .brushMode("1D-axes")
      .on("brushend", this.brushed)
      .createAxes()
      .updateAxes(750)
  }

  brushed = (data) => {
    var unit_ids = data.map(function (d) { return d.unit_id; });
    this.onBrush.emit(unit_ids);
  }

  removeExistingPlot() {
    d3.select(`figure#pcp`).html("");
  }

  get_color_generator() {
    return d3.scaleOrdinal()
      .domain(["0", "1", "2", "3", "4"])
      .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']);
  }

  getMapContainerWidthAndHeight = (): { width: number; height: number } => {
    const width = this.container.clientWidth;
    const height = (width / 960) * 500;;
    return { width, height };
  };

}
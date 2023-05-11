import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/compass-backend-service';

@Component({
  selector: 'college-dashboard',
  templateUrl: './college-dashboard.component.html',
  styleUrls: ['./college-dashboard.component.scss'],
  providers: [BackendService]
})
export class CollegeDashboardComponent implements OnInit {

  backend: BackendService
  map_unit_ids: number[]
  pcp_unit_ids: number[]
  stats_unit_ids: number[]

  constructor(backend: BackendService) {
    this.backend = backend;
  }

  ngOnInit(): void {
    this.backend.getAllUnitIds().subscribe(data => {
      this.map_unit_ids = data['unit_ids']
      this.pcp_unit_ids = data['unit_ids']
      this.stats_unit_ids = data['unit_ids']
    });
  }

  pcpBrushed(unit_ids: number[]) {
    this.map_unit_ids = unit_ids;
    this.stats_unit_ids = unit_ids;
  }

  mapBrushed(unit_ids: number[]) {
    this.pcp_unit_ids = unit_ids
    this.stats_unit_ids = unit_ids
  }
}

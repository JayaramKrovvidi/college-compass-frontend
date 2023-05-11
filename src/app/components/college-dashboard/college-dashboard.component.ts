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
  unit_ids: number[]

  constructor(backend: BackendService) {
    this.backend = backend;
  }

  ngOnInit(): void {
    this.backend.getAllUnitIds().subscribe(data => this.unit_ids = data['unit_ids']);
  }

  pcpBrushed(unit_ids: number[]) {
    this.unit_ids = unit_ids;
  }
}

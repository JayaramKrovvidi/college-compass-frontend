import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface LocationDataPoint {
  unit_id: number;
  name: string;
  population: number;
  latitude: number;
  longitude: number;
}

export interface MapData {
  colleges: LocationDataPoint[];
}

export interface PCPDataPoint {
  unit_id: number;
  avg_applicants_total: number;
  avg_admissions_total: number;
  avg_enrolled_total: number;
  avg_grand_total: number;
  avg_price_in_st_on_campus: number;
  avg_price_out_st_on_campus: number;
  avg_price_in_st_off_campus: number;
  avg_price_out_st_off_campus: number;
  state: string;
};

export interface BarChartData {
  year: number;
  applicants: {
    men: number;
    women: number;
  };
  admissions: {
    men: number;
    women: number;
  };
  enrollments: {
    men: number;
    women: number;
  };
}

@Injectable()
export class BackendService {

  http: HttpClient
  constructor(http: HttpClient) {
    this.http = http;
  }

  getMapData() {
    return this.http.get<MapData>("http://localhost:6969/map_data");
  }

  getPCPData(): PCPDataPoint[] {
    return this.generateMockPCPData();
  }

  getStackedBarChartData() {
    const years = [2017, 2018, 2019, 2020, 2021];

    return years.map((year) => {
      const applicants = {
        men: Math.floor(Math.random() * 1000),
        women: Math.floor(Math.random() * 1000),
      };

      const admissions = {
        men: Math.floor(Math.random() * 800),
        women: Math.floor(Math.random() * 800),
      };

      const enrollments = {
        men: Math.floor(Math.random() * 600),
        women: Math.floor(Math.random() * 600),
      };

      return {
        year,
        applicants,
        admissions,
        enrollments,
      };
    });
  }

  generateMockPCPData = (): PCPDataPoint[] => {
    const states = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
      "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
      "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
      "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT",
      "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    const data: PCPDataPoint[] = [];

    for (let i = 0; i < 2000; i++) {
      const unit_id = i;
      const avg_applicants_total = Math.floor(Math.random() * 10000);
      const avg_admissions_total = Math.floor(Math.random() * 8000);
      const avg_enrolled_total = Math.floor(Math.random() * 6000);
      const avg_grand_total = Math.floor(Math.random() * 50000);
      const avg_price_in_st_on_campus = Math.floor(Math.random() * 20000);
      const avg_price_out_st_on_campus = Math.floor(Math.random() * 30000);
      const avg_price_in_st_off_campus = Math.floor(Math.random() * 15000);
      const avg_price_out_st_off_campus = Math.floor(Math.random() * 25000);
      const state = states[Math.floor(Math.random() * states.length)];
      data.push({
        unit_id,
        avg_applicants_total,
        avg_admissions_total,
        avg_enrolled_total,
        avg_grand_total,
        avg_price_in_st_on_campus,
        avg_price_out_st_on_campus,
        avg_price_in_st_off_campus,
        avg_price_out_st_off_campus,
        state
      });
    }

    return data;
  };
}
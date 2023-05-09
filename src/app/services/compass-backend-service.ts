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

@Injectable()
export class BackendService {

    http: HttpClient
    constructor(http: HttpClient) {
        this.http = http;
    }

    getMapData() {
        return this.http.get<MapData>("http://localhost:6969/map_data");
    }
}
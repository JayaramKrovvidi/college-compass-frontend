import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app.material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { CollegeDashboardComponent } from './components/college-dashboard/college-dashboard.component';
import { UsaMapComponent } from './components/usa-map/usa-map.component';
import { PcpPlotComponent } from './components/pcp-plot/pcp-plot.component';
import { PcaBiPlotComponent } from './components/pca-bi-plot/pca-bi-plot.component';
import { MultiLinePlotComponent } from './components/multi-line-plot/multi-line-plot.component';
import { SunburstPlotComponent } from './components/sunburst-plot/sunburst-plot.component';
import { StackedBarChartComponent } from './components/stacked-bar-chart/stacked-bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    CollegeDashboardComponent,
    UsaMapComponent,
    PcpPlotComponent,
    PcaBiPlotComponent,
    MultiLinePlotComponent,
    SunburstPlotComponent,
    StackedBarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

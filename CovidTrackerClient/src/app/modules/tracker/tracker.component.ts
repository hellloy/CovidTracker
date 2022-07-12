import { Component, ElementRef, OnInit } from '@angular/core';
import { default as statesdata } from '../tracker/data/states.json';
import * as d3 from 'd3';
import { TrackerService } from './services/tracker.service';
import { BusyService } from 'src/app/core/services/busy.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  hostElement;
  svg;
  g;

  projection;
  path;
  width = 960;
  height = 500;
  legendContainerSettings = {
    x: 320,
    y: this.height,
    width: 420,
    height: 75,
  };
  legendBoxSettings = {
    width: 50,
    height: 15,
    y: this.legendContainerSettings.y + 30,
  };
  legendData = [0, 1, 2, 3, 4];
  states: any[] = [];
  covid: any[] = [];
  merged: any[] = [];
  coviddata;
  start = 1;
  end;
  metric = 'Overall risk level';


  constructor(private elRef: ElementRef, private trackerService: TrackerService, public busyService: BusyService) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    this.trackerService.getTracks().subscribe(res =>{
      this.coviddata = res.data;
      this.updateMap();
    })

  }

  metricChange(e) {
    this.metric = e;
    this.updateMap()
  }

  private updateMap() {

    d3.select(this.hostElement).select("svg").remove();

    this.projection = d3
      .geoAlbersUsa()
      .scale(1000)
      .translate([this.width / 2, this.height / 2]);

    this.path = d3.geoPath().projection(this.projection);

    this.svg = d3
      .select(this.hostElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height + 75);

    var that = this;

    that.g = this.svg.append('g');

    that.start = 1;

    switch (that.metric) {
      case "Cases per 100k level":
        that.end = d3.max(that.coviddata, function (d: any) {
          return d.casesLevel;
        })
        break;
      case "Test positivity ration level":
        that.end = d3.max(that.coviddata, function (d: any) {
          return d.testPositivityLevel;
        })
        break;
      case "Overall risk level":
        that.end = d3.max(that.coviddata, function (d: any) {
          return d.overallLevel;
        })
        break;
      case "Infection rate level":
        that.end = d3.max(that.coviddata, function (d: any) {
          return d.infectionLevel;
        })
        break;
    }

    that.states = statesdata.features;

    that.merged = that.trackerService.joinTable(
      that.coviddata,
      that.states,
      'state',
      'code',
      function (state, covid) {
        var metric;
        switch (that.metric) {
          case 'Cases per 100k level':
            metric = covid ? covid.casesLevel : 0;
            break;
          case 'Test positivity ration level':
            metric = covid ? covid.testPositivityLevel : 0;
            break;
          case 'Overall risk level':
            metric = covid ? covid.overallLevel : 0;
            break;
          case 'Infection rate level':
            metric = covid ? covid.infectionLevel : 0;
            break;
        }

        return {
          name: state.properties.name,
          metric: metric,
          geometry: state.geometry,
          type: state.type,
        };
      }
    );


    that.g
      .attr('class', 'county')
      .selectAll('path')
      .data(that.merged)
      .enter()
      .append('path')
      .attr('d', that.path)
      .attr('class', 'feature')
      .attr('class', 'county')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.3)
      .attr('fill', function (d) {
        return that.trackerService.colorSwitcher(d.metric);
      });


     that.svg
      .append('text')
      .attr('x', that.legendContainerSettings.x -40 )
      .attr('y', that.legendContainerSettings.y + 42)
      .style('font-size', 14)
      .style('font-weight', 'bold')
      .text('Low ');

      that.svg
      .append('text')
      .attr('x', that.legendContainerSettings.x - 10)
      .attr('y', that.legendContainerSettings.y + 42)
      .style('font-size', 14)
      .style('font-weight', '300')
      .text('risk')

    var legend = that.svg
      .selectAll('g.legend')
      .data(that.legendData)
      .enter()
      .append('g')
      .attr('class', 'legend');

      legend
      .append('rect')
      .attr('x', function (d, i) {
        return (
          that.legendContainerSettings.x + that.legendBoxSettings.width * i + 20
        );
      })
      .attr('y', that.legendBoxSettings.y)
      .attr('width', that.legendBoxSettings.width)
      .attr('height', that.legendBoxSettings.height)
      .style('fill', function (d, i) {
        return that.trackerService.colorSwitcher(d);
      })
      .style('opacity', 1);

      that.svg
      .append('text')
      .attr('x', that.legendContainerSettings.x + 278)
      .attr('y', that.legendContainerSettings.y + 42)
      .style('font-size', 14)
      .style('font-weight', 'bold')
      .text('Severe');

      that.svg
      .append('text')
      .attr('x', that.legendContainerSettings.x + 325)
      .attr('y', that.legendContainerSettings.y + 42)
      .style('font-size', 14)
      .style('font-weight', '300')
      .text('risk');

  }

}

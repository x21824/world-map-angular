import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { CommonModule } from '@angular/common';
import { GeoNamesService } from '../geo-names.service'; 
import { WorldBankService } from '../world-bank.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {
  selectedCountryDetails: any = null;

  constructor(
    private geoNamesService: GeoNamesService,
    private worldBankService: WorldBankService
  ) { }

  ngOnInit() {
    let root = am5.Root.new("chartdiv");

    // Create a map chart
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator()
      })
    );

    // Load geodata and create polygon 
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
      })
    );

    
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true
    });

    //event listener
    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        const country = dataItem.dataContext as { id: string; name: string };
        const countryCode = country.id;

        forkJoin([
          this.geoNamesService.getCountryDetails(countryCode),
          this.worldBankService.getIncomeLevel(countryCode)
        ]).subscribe(([geoNamesData, worldBankData]) => {
          this.selectedCountryDetails = this.processCountryData(geoNamesData, worldBankData);
          console.log(this.selectedCountryDetails);
        });
      }
    });
  }

  processCountryData(geoNamesData: any, worldBankData: any) {
    const worldBankCountryData = worldBankData[1][0];
    return {
      name: geoNamesData.geonames[0].countryName,
      capital: geoNamesData.geonames[0].capital,
      region: geoNamesData.geonames[0].continentName,
      incomeLevel: worldBankCountryData.incomeLevel.value,
      population: geoNamesData.geonames[0].population,
      currency: geoNamesData.geonames[0].currencyCode
    };
  }
}

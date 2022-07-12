import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { TrackerApiService } from "src/app/core/api/tracker/tracker-api.service";
import { TrackerItemApiModel } from "src/app/core/models/tracker/tracker-item";
import { Result } from "src/app/core/models/wrappers/Result";

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor(private trackerApi:TrackerApiService){}

  getTracks():Observable<Result<TrackerItemApiModel[]>>{
    return this.trackerApi.get()
    .pipe(map((response: Result<TrackerItemApiModel[]>) => response));
  }

  joinTable(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
      m = mainTable.length,
      lookupIndex = [],
      output = [];
    for (var i = 0; i < l; i++) {
      var row = lookupTable[i];
      lookupIndex[row[lookupKey]] = row;
    }
    for (var j = 0; j < m; j++) {
      var y = mainTable[j];
      var x = lookupIndex[y.properties[mainKey]];
      output.push(select(y, x));
    }
    return output;
  }

  colorSwitcher(metric){
    switch (metric) {
      case 0:
        return 'MediumSeaGreen';
      case 1:
        return 'Gold';
      case 2:
        return 'DarkOrange';
      case 3:
        return 'Crimson';
      case 4:
        return 'Maroon';
      default:
        return 'MediumSeaGreen';
    }
  }


}


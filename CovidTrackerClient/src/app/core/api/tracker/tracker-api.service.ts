import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Result } from '../../models/wrappers/Result';
import {TrackerItemApiModel} from '../../models/tracker/tracker-item'

@Injectable({
  providedIn: 'root'
})
export class TrackerApiService{

  private baseUrl = environment.apiUrl + 'tracker';

  constructor(private http: HttpClient) {
  }

  get(){
    return this.http.get<Result<TrackerItemApiModel[]>>(this.baseUrl);
  }
}

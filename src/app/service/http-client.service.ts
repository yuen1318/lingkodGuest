import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'protractor';
import {tap,map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient : HttpClient) { }

  get(url: string, httpOptions: any): Observable<any>{
    return this.httpClient.get(url , httpOptions);
  }

  handleError(error: HttpErrorResponse){
    console.log(error);
  }

}



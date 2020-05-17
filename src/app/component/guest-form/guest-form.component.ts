import { HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from 'src/app/service/http-client.service';

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.css']
})
export class GuestFormComponent implements OnInit {

   GUEST_LIST_URL = `https://spreadsheets.google.com/feeds/cells/1jRnXZpMuPl4s-l7TyKpc0QpIwIAEHKOAS7Vp2Y4tp18/1/public/full?alt=json`;
   EVENT_LIST_URL = `https://spreadsheets.google.com/feeds/cells/1fw0uh2FIX4EAMud_RbKZ84hz_yeGe1Kj87_EsJ8FMYE/1/public/full?alt=json`;
   GUEST_ATTENDANCE_URL =`https://docs.google.com/forms/d/e/1FAIpQLScnfsZ8J6fKtozzUsE2csEPATrGsXX2-Wi0lPLkuJ0998O6Bw/formResponse`;
   guestList: any = [];
   eventList: any = [];
   guestForm : FormGroup;

  constructor(private apiService: HttpClientService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.buildGuestForm();
    this.getEventList();
    this.getGuestList();
  }

  buildGuestForm(){
    this.guestForm = this.fb.group({
      guest: [null, [Validators.required]],
      attendance: [null, [Validators.required]]
    });
  }

  submitGuestForm(formValues){
    console.log(formValues.attendance.eventName);
    this.guestForm.reset();
    console.warn('Your order has been submitted', formValues);

    let queryString = new HttpParams();
    queryString = queryString.append('usp', 'pp_url');
    queryString = queryString.append('entry.1113375792', formValues.guest);
    queryString = queryString.append('entry.1515683084', formValues.attendance.eventName);
    queryString = queryString.append('entry.891344423',  formValues.attendance.eventDate);
    queryString = queryString.append('entry.2107590943', formValues.attendance.eventType);

    let headers = new HttpHeaders();
    headers = headers.append('Access-Control-Allow-Origin', '*');

    const httpOptions = {
      // headers: headers,
      observe: 'response' as 'body',
      params: queryString
    }

    this.apiService.get(this.GUEST_ATTENDANCE_URL, httpOptions).subscribe((resp: HttpResponse<any>) => {
      console.log(resp.body);
    },this.apiService.handleError);

  }

  getEventList(){

    const httpOptions ={
      observe: 'response' as 'body'
    };

    let rowColVal = [];
    let totalRow;

    this.apiService.get(this.EVENT_LIST_URL, httpOptions).subscribe((resp: HttpResponse<any>) => {
      let x = resp.body;

      totalRow = x.feed.gs$rowCount.$t;
      console.log(totalRow);

      x.feed.entry.forEach(x => {
        rowColVal.push({
          row : parseInt(x.gs$cell.row),
          col : parseInt(x.gs$cell.col),
          value : x.gs$cell.inputValue
        });
      });


      for (let index = 2; index <= totalRow; index++) {

        const eventName = rowColVal.find(x => x.row === index && x.col === 1).value;
        const eventDate = rowColVal.find(x => x.row === index && x.col === 2).value;
        const eventType = rowColVal.find(x => x.row === index && x.col === 3).value;

        let obj = {
          'eventName' :  eventName,
          'eventDate' :  eventDate,
          'eventType' :  eventType
        }

        this.eventList.push(obj);
      }

    },this.apiService.handleError);

    console.log( this.eventList);
  }


  getGuestList(){

    // col: 1 "Timestamp"
  // col: 2 "Given Name"
// col: 3 "Middle Name"
// col: 4 "Family Name"
// col: 5 "Nickname"
// col: 6 "Gender"
// col: 7 "Birthdate"
// col: 8 "Contact #"
// col: 9 "Invited By"
// col: 10 "Email Address"
// col: 11 "Device"

    const httpOptions ={
      observe: 'response' as 'body'
    };

    let rowColVal = [];
    let totalRow;

    this.apiService.get(this.GUEST_LIST_URL, httpOptions).subscribe((resp: HttpResponse<any>) => {

      let x = resp.body;
      totalRow = x.feed.gs$rowCount.$t;

      x.feed.entry.forEach(x => {
        rowColVal.push({
          row : parseInt(x.gs$cell.row),
          col : parseInt(x.gs$cell.col),
          value : x.gs$cell.inputValue
        });
      });


      for (let index = 2; index <= totalRow; index++) {

        let filterByName = x => x.row === index && (x.col === 2 || x.col === 3 || x.col === 4) ;
        let result = rowColVal.filter(filterByName);

        let fullName = '';
        result.forEach(x => {
          fullName += `${x.value} `;
        });

        this.guestList.push(fullName.trim());
      }

     },this.apiService.handleError);

      console.log( this.guestList);
  }

}

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/service/http-client.service';

@Component({
  selector: 'app-guest-table',
  templateUrl: './guest-table.component.html',
  styleUrls: ['./guest-table.component.css']
})
export class GuestTableComponent implements OnInit {

  GUEST_LIST_URL = `https://spreadsheets.google.com/feeds/cells/1jRnXZpMuPl4s-l7TyKpc0QpIwIAEHKOAS7Vp2Y4tp18/1/public/full?alt=json`;
  GUEST_ATTENDANCE_URL = `https://spreadsheets.google.com/feeds/cells/1BmuEyIrD2NjHgGsRE-rdeWUU3EnSZnBnnGembaY3z6g/1/public/full?alt=json`;
  DEFAULT_IMG_SRC = `https://scontent.fmnl9-1.fna.fbcdn.net/v/t1.0-9/80659652_143302930439841_6708500433997922304_o.jpg?_nc_cat=108&_nc_sid=85a577&_nc_eui2=AeGGHxggy1FR3RBVaAjgksd9LvqqXTncm9Iu-qpdOdyb0u5l-WYuxrgF_uJQD7o2IWYv5BYTakwxILVV0z_FjDXw&_nc_ohc=1UTClXr35QcAX8oelsn&_nc_ht=scontent.fmnl9-1.fna&oh=d96d55dba250ce33e773b9022ed9ce5a&oe=5EED4E5D`;
  EVENT_LIST_URL = `https://spreadsheets.google.com/feeds/cells/1fw0uh2FIX4EAMud_RbKZ84hz_yeGe1Kj87_EsJ8FMYE/1/public/full?alt=json`;
  guestList: any = [];
  guestAttendance: any = [];
  guestTableFilter: string;
  guestDetail: any ;
  isDetailHidden: boolean = true;
  totalEvent: number = 0;

  constructor(private apiService: HttpClientService) {}

  ngOnInit() {
    // this.getGuestList();
    // this.getGuestAttendance();
    this.loadData();
  }

  closeGuestDetail($event){
    this.isDetailHidden = $event;
  }

  refreshTable(){
    this.guestList = [];
    this.guestAttendance = [];
    this.loadData();
  }

  loadData(){

    const getGuestAttendance = new Observable(x =>{
      this.getGuestAttendance();
      x.next();
    });

    const getTotalEvent = new Observable(x =>{
      this.getEventList();
      x.next();
    });

    const getGuestList = new Observable(x =>{
      this.getGuestList();
      x.next();
    });

    getGuestAttendance.subscribe(x =>
      getTotalEvent.subscribe(x =>
        getGuestList.subscribe()));

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
// col: 11 "Image"

    const httpOptions ={
      observe: 'response' as 'body'
    };

    let rowColVal = [];
    let totalRow;
    let gg = [];

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
        const filterByName = x => x.row === index && (x.col === 2 || x.col === 3 || x.col === 4) ;
        const result = rowColVal.filter(filterByName);

        let fullName = '';
        result.forEach(x => {
          fullName += `${x.value} `;
        });

        const obj = {
          "name" : fullName.trim(),
          "gender" :  this.filterByCol(rowColVal, index, 6),
          "birthDate" : this.filterByCol(rowColVal, index, 7),
          "contactNo" : this.filterByCol(rowColVal, index, 8),
          "invitedBy" : this.filterByCol(rowColVal, index, 9),
          "email" : (this.filterByCol(rowColVal, index, 10) === null) ? "email not available" : this.filterByCol(rowColVal, index, 10) ,
          "image" : (this.filterByCol(rowColVal, index, 11) === null) ? this.DEFAULT_IMG_SRC : this.filterByCol(rowColVal, index, 11),
          "eventList" : (this.guestAttendance.find( x => x.name === fullName.trim()) === undefined) ? [] : this.guestAttendance.find( x => x.name === fullName.trim()).eventList,
          "totalEvent" : this.totalEvent
        }
        this.guestList.push(obj);
      }

      this.guestList.sort((a, b) => b.eventList.length - a.eventList.length );

      console.log(this.guestList);
      this.guestList.forEach(x => {

        const funEvent = x.eventList.filter(x => x.eventType === "FUN").length;
        const feedEvent = x.eventList.filter(x => x.eventType === "FEED").length;
        const faithEvent= x.eventList.filter(x => x.eventType === "FAITH").length;
        let probability;

        if( x.eventList.length > (x.totalEvent/2) ){
          probability = "HIGH"
        }else if(x.eventList.length > (x.totalEvent * 0.25) ){
          probability = "MID"
        }else{
          probability = "LOW"
        }

        x["funEvent"] = funEvent;
        x["feedEvent"] = feedEvent;
        x["faithEvent"] = faithEvent;
        x["probability"] = probability;
      });

     },this.apiService.handleError);

  }


  getGuestAttendance(){

    // col: 1 "Fullname"
    // col: 2 "Event Name"
    // col: 3 "Event Date"
    // col: 4 "Event Type"
    // col: 5 "Timestamp"

    const httpOptions ={
      observe: 'response' as 'body'
    };

    let rowColVal = [];
    let totalRow;
    let tempGuestAttendance =[];

    this.apiService.get(this.GUEST_ATTENDANCE_URL, httpOptions).subscribe((resp: HttpResponse<any>) => {

      let x = resp.body;
      totalRow = x.feed.gs$rowCount.$t;

      x.feed.entry.forEach(x => {
        rowColVal.push({
          row : parseInt(x.gs$cell.row),
          col : parseInt(x.gs$cell.col),
          value : x.gs$cell.inputValue
        });
      });


      // { guide
      //   "name" : {},
      //   "eventList" []
      // }

      for (let index = 2; index <= totalRow; index++) {

        const name = this.filterByCol(rowColVal, index, 1);

        const eventObj = {
          "eventName" :  this.filterByCol(rowColVal, index, 2),
          "eventDate" : this.filterByCol(rowColVal, index, 3),
          "eventType" : this.filterByCol(rowColVal, index, 4)
        }

        const tempObj = tempGuestAttendance.find(x => x.name === name);

        if(tempObj === undefined){

          tempGuestAttendance.push({
            "name" : name,
            "eventList" : [eventObj]
          });

        }else{
          tempObj.eventList.push(eventObj);
        }

      }

      this.guestAttendance = tempGuestAttendance;
      console.log(this.guestAttendance);
     },this.apiService.handleError);

  }


  getEventList(){
    const httpOptions ={
      observe: 'response' as 'body'
    };
    this.apiService.get(this.EVENT_LIST_URL, httpOptions).subscribe((resp: HttpResponse<any>) => {
      // this.totalEvent = resp.body.feed.gs$rowCount.$t;
      this.totalEvent = parseInt(resp.body.feed.gs$rowCount.$t);
    }, this.apiService.handleError);
  }

  filterByCol(rowColVal: any, index: any, colNo: any){
    const data = rowColVal.find(x => x.row === index && x.col === colNo);
    return (data === undefined) ? null : data.value;
  }

  setGuestDetail(guestDetail: any){
    this.isDetailHidden = false;
    this.guestDetail = guestDetail;
  }

}

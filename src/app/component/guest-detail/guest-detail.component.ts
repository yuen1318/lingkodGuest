import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';




@Component({
  selector: 'app-guest-detail',
  templateUrl: './guest-detail.component.html',
  styleUrls: ['./guest-detail.component.css']
})
export class GuestDetailComponent implements OnInit, OnChanges {

  @Input() guestDetail: any;
  @Output() closeGuestDetailEvent = new EventEmitter<boolean>();
  guestAttendanceGraph: any[];

  constructor() {}


  ngOnChanges(changes: SimpleChanges): void {
    console.log("changed!")
    this.buildGraph(this.guestDetail);
  }

  ngOnInit() {
    this.guestDetail = {
      "birthDate": "",
      "contactNo": "",
      "email": "",
      "eventList": [],
      "gender": "",
      "image": "",
      "invitedBy": "",
      "name": "",
      "totalEvent": 0,
      "funEvent": 0,
      "feedEvent": 0,
      "faithEvent": 0,
      "probability": ""
    }
  }


  closeGuestDetail(){
    this.closeGuestDetailEvent.emit(true);
  }

  buildGraph(guestDetail){
    if(guestDetail !== undefined){

      let   data = {
        labels: ["FUN", "FEED", "FAITH"],
        datasets: [{
          // {
          //   label: "FUN",
          //   fill: true,
          //   backgroundColor: "orange",
          //   borderColor: "orange",
          //   pointBorderColor: "orange",
          //   pointBackgroundColor: "orange",
          //   data: [10,10]
          // },
          // {
          //   label: "FEED",
          //   fill: true,
          //   backgroundColor: "rgba(33, 150, 243, 0.4)",
          //   // borderColor: "#2196f3",
          //   pointBorderColor: "#2196f3",
          //   pointBackgroundColor: "#2196f3",
          //   borderWidth : 0.5
          // },

            label: guestDetail.name,
            data: [
                  guestDetail.funEvent === undefined ? 0 : guestDetail.funEvent ,
                  guestDetail.feedEvent === undefined ? 0 : guestDetail.feedEvent,
                  guestDetail.faithEvent === undefined ? 0 : guestDetail.faithEvent
            ],

            fill: true,
            backgroundColor: "rgba(33, 150, 243, 0.4)",
            // borderColor: "#2196f3",
            pointBorderColor: "#2196f3",
            pointBackgroundColor: "#2196f3",
            borderWidth : 0.5

        }]
      };

      let options={
        title: {
          display: true,
          text: 'Distribution in % of world population'
        }
      }

      this.guestAttendanceGraph = new Chart('canvas', {
        type: 'radar',
        data: data,
      // options : options
      });
    }



  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { JourneyHttpService } from './journey-http.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(
    private http: HttpClient,
    private httpService: JourneyHttpService
  ) {}

  websocket!: WebSocket;
  webForOldData!: WebSocket;
  message = new Subject<any>();
  wsData = new Subject<any>();

  // ws!: WebSocket;

  // step 4: Listening for Websocket events

  url: any;

  connectWebSocket(userID: any, sessionID: any, token: any) {
    this.url = `wss://app.journeyid.io/api/iframe/ws/users/${userID}/sessions/${sessionID}`;

    this.websocket = new WebSocket(this.url);

    // send message after connection open

    this.websocket.onopen = (e) => {
      console.log('onopen: ', e);
      console.log('websocket', this.websocket);
      this.websocket.send(token);
    };

    // listen events of web sockets

    this.websocket.onmessage = (e: any) => {
      console.log('In onmessage');
      let SocketEvent = JSON.parse(e.data);
      this.message.next(SocketEvent);
    };

    // throw error if occurs
    this.websocket.onerror = (event: any) => {
      this.message.error(event);
    };
    
    this.websocket.onclose = (e) => {
      console.log('socket close: ', e);
      this.message.next(e);
    };
  }

  closeWebSocket() {
    // this.websocket.close();
    this.webForOldData.close();
  }

  getWSPreviousData(userID: any, sessionID: any, token: any) {
    // console.log("User id: ",userID)
    // console.log("Session id: ",sessionID)
    let oldurl = `wss://app.journeyid.io/api/iframe/ws/users/${userID}/sessions/${sessionID}`;
    // console.log('web socket send data: ', oldurl);

    // create new web socket connection

    this.webForOldData = new WebSocket(oldurl);

    // send message after connection open

    this.webForOldData.onopen = (e) => {
      console.log('onopen: ', e);
      console.log('websocket', this.webForOldData);

      // send message "CONNECT token"

      this.webForOldData.send(token);
    };

    // listen events of web sockets

    this.webForOldData.onmessage = (e: any) => {
      console.log('Old data');
      let SocketEvent = JSON.parse(e.data);
      this.wsData.next(SocketEvent);
    };

    // throw error if occurs
    this.webForOldData.onerror = (event: any) => {
      this.wsData.error(event);
    };

    this.webForOldData.onclose = (e) => {
      console.log('socket close: ', e);
      this.wsData.next(e);
      this.closeWebSocket();
    };
  }
}

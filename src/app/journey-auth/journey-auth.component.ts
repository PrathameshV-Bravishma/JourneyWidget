import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { JourneyHttpService } from '../services/journey-http.service';

import { WebSocketService } from '../services/websocket.service';
import { UUID } from 'angular2-uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-journey-auth',
  templateUrl: './journey-auth.component.html',
  styles: [
    `
      .Frame {
        border: 2px red solid;
        max-width: 90%;
        margin: 10px auto;
        text-align: center;
        padding: 20px;
        height: 800px;
        max-height: 1000px;
      }

      .action {
        /* border: 10px green solid; */
        margin: 10px auto;
        height: 650px;
        /* max-height: 820px; */
        padding: 20px;
      }

      .notice {
        padding: 15px;
        background-color: #fafafa;
        border-left: 6px solid #7f7f84;
        margin-bottom: 10px;
        -webkit-box-shadow: 0 5px 8px -6px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0 5px 8px -6px rgba(0, 0, 0, 0.2);
        box-shadow: 0 5px 8px -6px rgba(0, 0, 0, 0.2);
      }

      .notice-success {
        /* border-color: #80d651; */
        /* border-color: red; */
        /* border-color: orange; */
        border-color: gray;
      }

      .card {
        height: 610px;
      }

      .dark-modal .modal-content {
        background-color: #292b2c;
        color: white;
      }
      .dark-modal .close {
        color: white;
      }
      .light-blue-backdrop {
        background-color: #5cb3fd;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class JourneyAuthComponent implements OnInit {
  executionID: any;
  executionUserID: any;
  sessionBootstrapData: any;
  sessionBootstrapIsEnrolled = false;

  CountryCode!: any;

  RequestLabelName: any;
  RequestLabelColor: any;
  RequestIconColor: any;

  processLabelName: any;
  processLabelBGColor: any;
  processLabelColor: any;
  processIconColor: any;
  alertBoxColor: any;

  pipelineKey: any;
  bootstrapData: any;
  authRequestedData: any;
  sendAuthRequestFlag = false;

  jwtToken: any;
  srcLink: any;

  externalRef: any;
  getIDsObj: any;

  filterEventOnDate: any;
  websocketConnData: any;
  uuidValue!: string;
  webSocketEvents: any;

  // showRequestNotification = false;
  constructor(
    private httpService: JourneyHttpService,
    private websocket_Service: WebSocketService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    // this.CountryCode = [...phData];
    // console.log(this.CountryCode);

    // *** step 1:  create token
    // this.jwtToken = this.getToken();
    let agentName = 'agenttest1';
    this.generateUUID();
    this.jwtToken = this.httpService.signToken(agentName);
    console.log(this.jwtToken);
  }

  getToken() {
    this.httpService.getJwtToken().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.jwtToken = data?.token;
        localStorage.setItem('journeyJwt', JSON.stringify(this.jwtToken));
      },
      error: (err: any) => console.log(err),
    });
  }

  generateUUID() {
    this.uuidValue = UUID.UUID();
    console.log(this.uuidValue);
  }

  // *** get mongodb response to create bootstrap session

  getMongoDBResponse(mobileNo: any) {
    // console.log(mobileNo.value);
    this.externalRef = mobileNo.value;

    // console.log('enterd mobno: ', typeof mobileNo.value);

    this.httpService.getMongodbResponse(this.externalRef).subscribe({
      next: (data: any) => {
        let res = data.documents[0];
        console.warn(' res of mongodb:  ', data);
        let customerUniqueID = res?.journeyid_customer_uniqueid;

        this.getIDsObj = {
          journeyUniqueId: res?.journeyid_customer_uniqueid,
          journeyExternalRef: this.uuidValue,
        };

        this.createJouneyBootstrapSession();
        console.log(
          'unique id & ext ref to create bootstrap session',
          this.getIDsObj
        );

        this.httpService.getLookupCustomerData(customerUniqueID).subscribe({
          next: (LookupData: any) => {
            console.log('LookupData: ', LookupData);
          },
          error: (err: any) => {
            console.log('Lookup api error: ', err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Step 2: create Bootstrap Session

  createJouneyBootstrapSession() {
    let reqData = {
      event: 'start-session',
      session: {
        externalRef: this.getIDsObj.journeyExternalRef,
      },
      user: {
        uniqueId: this.getIDsObj.journeyUniqueId,
      },
    };

    console.warn('bootstrap start session req obj: ', reqData);

    this.httpService.createBootstrapSession(reqData, this.jwtToken).subscribe({
      next: (data: any) => {
        console.log('get bootstrap data', data);
        this.bootstrapData = data;
        this.sessionBootstrapData = data.user;
        this.sessionBootstrapIsEnrolled = data.metadata.isEnrolled;

        this.websocketConnData = {
          user_ID: this.bootstrapData.user.id,
          session_ID: this.bootstrapData.session.id,
        };

        this.createNewRequest();

        if (this.sessionBootstrapIsEnrolled) {
          this.alertBoxColor = '#fc6a03';
          this.RequestIconColor = '#fc6a03';

          this.RequestLabelName = 'Enrolled';
          this.RequestLabelColor = '#fc6a03';
        }

        console.log(data);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // creating new external ref for any new request

  createNewRequest() {
    // this.showRequestNotification = true;
    this.generateUUID();
    this.getIDsObj.journeyExternalRef = this.uuidValue;
  }

  // Step 3: Making Pipeline (execution ) requests

  sendFacialEnrollmentRequest() {
    console.log('bootstrap data', this.bootstrapData);

    // pipelineKey: this.bootstrapData.metadata.authenticationPipelineIDs[0],

    this.createNewRequest();

    let pipelineKey = '7214289b-47d8-4313-970a-567f8c0b685f';

    let reqPayload = this.createPayloadRequest(pipelineKey);

    console.log('exe payload: ', reqPayload);

    this.executeRequest(reqPayload);
  }

  sendFacialAuthRequest() {
    console.log('bootstrap data', this.bootstrapData);
    // d73d7733-5450-46a3-a1c7-42bf06e09ea0
    // pipelineKey: this.bootstrapData.metadata.authenticationPipelineIDs[0],

    this.createNewRequest();

    let pipelineKey = 'd73d7733-5450-46a3-a1c7-42bf06e09ea0';

    let reqPayload = this.createPayloadRequest(pipelineKey);

    console.log('exe payload: ', reqPayload);

    this.executeRequest(reqPayload);
  }

  sendBiometricAuthenticatoinRequest() {
    console.log('bootstrap data', this.bootstrapData);
    this.createNewRequest();
    let pipelineKey = '5ec2c1da-f7e8-4c07-b608-8b426dadc549';
    let reqPayload = this.createPayloadRequest(pipelineKey);
    console.log('exe payload: ', reqPayload);
    this.executeRequest(reqPayload);
  }

  executeRequest(reqPayload: any) {
    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            console.log('Execution data: ', data);
            this.authRequestedData = data;
            this.sendAuthRequestFlag = true;
            // this.showRequestNotification = false;
            // ui change
            this.processLabelBGColor = '#ffd580';
            this.processLabelName = 'Requested';
            this.processIconColor = '#fc6a03';
            this.processLabelColor = '#fc6a03';
            // ui change end

            // step 4: Listening for Websocket events

            console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.websocketConnData.user_ID,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                console.log('comp events: ', value);

                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents.event !== 'session-authenticated'
                ) {
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.websocketConnData.user_ID,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;
                this.statusOfRequest(this.webSocketEvents.event);
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  // send biometric request

  sendBiometricEnrollRequest() {
    // https://app.journeyid.io/api/iframe/executions

    this.createNewRequest();

    let pipelineKey = '5d6cc1a7-e7b5-48d1-9865-a71b77113c03';

    let reqPayload = this.createPayloadRequest(pipelineKey);

    this.executeRequest(reqPayload);
  }

  // send SDK enroll request
  sdkEnroll() {
    this.createNewRequest();
    let pipelineKey = '060284b0-68dd-4c02-9534-7688d967b193';

    let reqPayload = this.createSDKPayload(pipelineKey);
    this.httpService
      .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
      .subscribe({
        next: (data: any) => {
          console.log('Execution data: ', data);
          this.authRequestedData = data;
          this.sendAuthRequestFlag = true;

          // ui change
          this.processLabelBGColor = '#ffd580';
          this.processLabelName = 'Requested';
          this.processIconColor = '#fc6a03';
          this.processLabelColor = '#fc6a03';
          // ui change end

          // step 4: Listening for Websocket events

          console.log('connecting web socket ');

          this.websocket_Service.connectWebSocket(
            this.websocketConnData.user_ID,
            this.authRequestedData.session.id,
            `CONNECT ${this.jwtToken}`
          );

          this.websocket_Service.message.subscribe({
            next: (value: any) => {
              console.log('comp events: ', value);

              if (
                (value.type === 'close' || value.code === 1006) &&
                this.webSocketEvents.event !== 'session-authenticated'
              ) {
                setTimeout(() => {
                  this.websocket_Service.connectWebSocket(
                    this.websocketConnData.user_ID,
                    this.authRequestedData.session.id,
                    `CONNECT ${this.jwtToken}`
                  );
                }, 3000);
              }

              this.webSocketEvents = value;

              this.statusOfRequest(this.webSocketEvents.event);
            },
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sdkAuthentication() {
    this.createNewRequest();
    let pipelineKey = '6871934e-a546-4d9b-910b-2b566df42376';

    let reqPayload = this.createSDKPayload(pipelineKey);
    this.httpService
      .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
      .subscribe({
        next: (data: any) => {
          console.log('Execution data: ', data);
          this.authRequestedData = data;
          this.sendAuthRequestFlag = true;

          // ui change
          this.processLabelBGColor = '#ffd580';
          this.processLabelName = 'Requested';
          this.processIconColor = '#fc6a03';
          this.processLabelColor = '#fc6a03';
          // ui change end

          // step 4: Listening for Websocket events

          console.log('connecting web socket ');

          this.websocket_Service.connectWebSocket(
            this.websocketConnData.user_ID,
            this.authRequestedData.session.id,
            `CONNECT ${this.jwtToken}`
          );

          this.websocket_Service.message.subscribe({
            next: (value: any) => {
              console.log('comp events: ', value);

              if (
                (value.type === 'close' || value.code === 1006) &&
                this.webSocketEvents.event !== 'session-authenticated'
              ) {
                setTimeout(() => {
                  this.websocket_Service.connectWebSocket(
                    this.websocketConnData.user_ID,
                    this.authRequestedData.session.id,
                    `CONNECT ${this.jwtToken}`
                  );
                }, 3000);
              }

              this.webSocketEvents = value;

              this.statusOfRequest(this.webSocketEvents.event);
            },
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sendSignatureRequest() {
    // 8c46fab2-51b1-41c5-ac7d-0f7140d29c11
    this.createNewRequest();
    // this.showRequestNotification = true;
    let pipelineKey = '8c46fab2-51b1-41c5-ac7d-0f7140d29c11';

    let reqPayload = this.createPayloadRequest(pipelineKey);

    this.executeRequest(reqPayload);
    // this.httpService
    //   .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
    //   .subscribe({
    //     next: (data: any) => {
    //       console.log('Execution data: ', data);
    //       this.authRequestedData = data;
    //       this.sendAuthRequestFlag = true;

    //       // ui change
    //       this.processLabelBGColor = '#ffd580';
    //       this.processLabelName = 'Requested';
    //       this.processIconColor = '#fc6a03';
    //       this.processLabelColor = '#fc6a03';
    //       // ui change end

    //       // step 4: Listening for Websocket events

    //       console.log('connecting web socket ');

    //       this.websocket_Service.connectWebSocket(
    //         this.websocketConnData.user_ID,
    //         this.authRequestedData.session.id,
    //         `CONNECT ${this.jwtToken}`
    //       );

    //       this.websocket_Service.message.subscribe({
    //         next: (value: any) => {
    //           console.log('comp events: ', value);

    //           if (
    //             (value.type === 'close' || value.code === 1006) &&
    //             this.webSocketEvents.event !== 'session-authenticated'
    //           ) {
    //             setTimeout(() => {
    //               this.websocket_Service.connectWebSocket(
    //                 this.websocketConnData.user_ID,
    //                 this.authRequestedData.session.id,
    //                 `CONNECT ${this.jwtToken}`
    //               );
    //             }, 3000);
    //           }

    //           this.webSocketEvents = value;

    //           this.statusOfRequest(this.webSocketEvents.event);
    //         },
    //       });
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //     },
    //   });
  }

  sendPaymentRequest(description: any, amount: any) {
    this.createNewRequest();
    console.log(description.value, ' ', amount.value);
    let reqPayload = this.createPaymentPayload(description.value, amount.value);
    console.log('send payment req: ', reqPayload);

    this.httpService
      .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
      .subscribe({
        next: (data: any) => {
          console.log('Execution data: ', data);
          this.authRequestedData = data;
          this.sendAuthRequestFlag = true;

          // ui change
          this.processLabelBGColor = '#ffd580';
          this.processLabelName = 'Requested';
          this.processIconColor = '#fc6a03';
          this.processLabelColor = '#fc6a03';
          // ui change end

          // step 4: Listening for Websocket events

          console.log('connecting web socket ');

          this.websocket_Service.connectWebSocket(
            this.websocketConnData.user_ID,
            this.authRequestedData.session.id,
            `CONNECT ${this.jwtToken}`
          );

          this.websocket_Service.message.subscribe({
            next: (value: any) => {
              console.log('comp events: ', value);

              if (
                (value.type === 'close' || value.code === 1006) &&
                this.webSocketEvents.event !== 'session-authenticated'
              ) {
                setTimeout(() => {
                  this.websocket_Service.connectWebSocket(
                    this.websocketConnData.user_ID,
                    this.authRequestedData.session.id,
                    `CONNECT ${this.jwtToken}`
                  );
                }, 3000);
              }

              this.webSocketEvents = value;

              this.statusOfRequest(this.webSocketEvents.event);
            },
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sendOutboundNotificatoin(reason: any) {
    console.clear();
    let reference = reason.value;

    // console.log('outbound notification reason: ', reference);
    // let pipelineKey = '87798ee2-d6ee-41de-9707-3543f86e3c42';
    let reqPayload = {
      pipelineKey: '87798ee2-d6ee-41de-9707-3543f86e3c42',
      user: {
        id: this.bootstrapData.user.id,
        uniqueId: this.bootstrapData.user.uniqueId,
        email: this.bootstrapData.user.email,
        phoneNumber: this.bootstrapData.user.phoneNumber,
        firstName: this.bootstrapData.user.firstName,
        middleName: this.bootstrapData.user.middleName,
        lastName: this.bootstrapData.user.lastName,
        devices: [],
      },
      session: {
        id: null,
        externalRef: this.bootstrapData.session.externalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: {
        method: 'sms',
        phoneNumber: this.bootstrapData.user.phoneNumber,
      },
      configuration: {
        ['schedule']: {
          ['reference']: reference,
          ['options']: [
            'now',
            '15m',
            '3h',
            '2022-01-01T12:00:00Z',
            '2022-01-01T17:30:00',
          ],
        },
      },
      language: 'en-US',
    };

    // console.log('bootstrap data', this.bootstrapData);
    this.createNewRequest();

    // let reqPayload = this.createPayloadRequest(pipelineKey);
    console.log('exe payload for outbound call: ', reqPayload);
    // this.executeRequest(reqPayload);

    this.httpService
      .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
      .subscribe({
        next: (data: any) => {
          console.log('Execution data: ', data);
          this.authRequestedData = data;
          this.sendAuthRequestFlag = true;
          // this.showRequestNotification = false;
          // ui change
          this.processLabelBGColor = '#ffd580';
          this.processLabelName = 'Requested';
          this.processIconColor = '#fc6a03';
          this.processLabelColor = '#fc6a03';
          // ui change end

          // step 4: Listening for Websocket events

          console.log('connecting web socket ');

          this.websocket_Service.connectWebSocket(
            this.websocketConnData.user_ID,
            this.authRequestedData.session.id,
            `CONNECT ${this.jwtToken}`
          );

          this.websocket_Service.message.subscribe({
            next: (value: any) => {
              console.log('comp events: ', value);

              if (
                (value.type === 'close' || value.code === 1006) &&
                this.webSocketEvents.event !== 'session-authenticated'
              ) {
                setTimeout(() => {
                  this.websocket_Service.connectWebSocket(
                    this.websocketConnData.user_ID,
                    this.authRequestedData.session.id,
                    `CONNECT ${this.jwtToken}`
                  );
                }, 3000);
              }

              // else {
              //   this.websocket_Service.closeWebSocket();
              // }

              this.webSocketEvents = value;
              this.statusOfRequest(this.webSocketEvents.event);
            },
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  createPaymentPayload(Desc: any, Amount: any) {
    let reqPayload = {
      pipelineKey: '1f34b5ac-a3e8-4dd3-bc57-ef82fadbf425',
      user: {
        id: this.bootstrapData.user.id,
        uniqueId: this.bootstrapData.user.uniqueId,
        email: this.bootstrapData.user.email,
        phoneNumber: this.bootstrapData.user.phoneNumber,
        firstName: this.bootstrapData.user.firstName,
        middleName: this.bootstrapData.user.middleName,
        lastName: this.bootstrapData.user.lastName,
        devices: [],
        type: 'customer',
      },
      session: {
        id: null,
        externalRef: this.bootstrapData.session.externalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: {
        method: 'sms',
        phoneNumber: this.bootstrapData.user.phoneNumber,
      },
      configuration: {
        ['credit-card-payment']: {
          details: {},
          currency: 'USD',
          lineItems: [
            {
              quantity: 1,
              title: Desc,
              amount: +Amount,
            },
          ],
        },
      },
      language: 'en-US',
    };

    return reqPayload;
  }

  createSDKPayload(RequestPipelineKey: any) {
    let reqPlayload = {
      pipelineKey: RequestPipelineKey,
      user: {
        id: this.bootstrapData.user.id,
        uniqueId: this.bootstrapData.user.uniqueId,
        email: this.bootstrapData.user.email,
        phoneNumber: this.bootstrapData.user.phoneNumber,
        firstName: this.bootstrapData.user.firstName,
        middleName: this.bootstrapData.user.middleName,
        lastName: this.bootstrapData.user.lastName,
        devices: [],
        type: 'customer',
      },
      session: {
        id: null,
        externalRef: this.bootstrapData.session.externalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: {
        method: 'sms',
        phoneNumber: this.bootstrapData.user.phoneNumber,
      },
      configuration: {},
      language: 'en-US',
    };

    return reqPlayload;
  }

  createPayloadRequest(RequestPipelineKey: any) {
    let reqPayload = {
      pipelineKey: RequestPipelineKey,
      user: {
        id: this.bootstrapData.user.id,
        uniqueId: this.bootstrapData.user.uniqueId,
        email: this.bootstrapData.user.email,
        phoneNumber: this.bootstrapData.user.phoneNumber,
        firstName: this.bootstrapData.user.firstName,
        middleName: this.bootstrapData.user.middleName,
        lastName: this.bootstrapData.user.lastName,
        devices: [],
      },
      session: {
        id: null,
        externalRef: this.bootstrapData.session.externalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: {
        method: 'sms',
        phoneNumber: this.bootstrapData.user.phoneNumber,
      },
      configuration: {},
      language: 'en-US',
    };

    console.log('exe payload: ', reqPayload);

    return reqPayload;
  }

  statusOfRequest(events: any) {
    switch (events) {
      case 'execution-created':
        // ui change
        this.processLabelBGColor = '#ffd580';
        this.processLabelName = 'Requested';
        this.processIconColor = '#fc6a03';
        this.processLabelColor = '#fc6a03';
        // ui change end
        break;
      case 'execution-started':
        // ui change
        this.alertBoxColor = '#fc6a03';
        this.RequestIconColor = '#fc6a03';
        this.processLabelBGColor = '#b0e0e6';
        this.processLabelName = 'Started';
        this.processIconColor = '#00bfff';
        this.processLabelColor = '#00bfff';
        this.RequestLabelName = 'Enrolled';
        this.RequestLabelColor = '#fc6a03';
        // ui change end
        break;
      case 'execution-progress':
        // ui change
        this.alertBoxColor = '#fc6a03';
        this.RequestIconColor = '#fc6a03';
        this.processLabelBGColor = '#b0e0e6';
        this.processLabelName = 'Started';
        this.processIconColor = '#00bfff';
        this.processLabelColor = '#00bfff';
        this.RequestLabelName = 'Enrolled';
        this.RequestLabelColor = '#fc6a03';
        // ui change end
        break;
      case 'execution-completed':
        // ui change
        this.alertBoxColor = '#089000';
        this.RequestIconColor = '#089000';
        this.processLabelBGColor = '#90ee90';
        this.processLabelName = 'Completed';
        this.processIconColor = '#089000';
        this.processLabelColor = '#089000';
        this.RequestLabelName = 'Authenticated';
        this.RequestLabelColor = '#089000';
        // ui change end
        break;
      case 'session-authenticated':
        // ui change
        this.alertBoxColor = '#089000';
        this.RequestIconColor = '#089000';
        this.processLabelBGColor = '#90ee90';
        this.processLabelName = 'Completed';
        this.processIconColor = '#089000';
        this.processLabelColor = '#089000';
        this.RequestLabelName = 'Authenticated';
        this.RequestLabelColor = '#089000';
        // ui change end
        break;
      default:
        // ui change
        // this.processLabelBGColor = '#ffd580';
        // this.processLabelName = 'Requested';
        // this.processIconColor = '#fc6a03';
        // this.processLabelColor = '#fc6a03';
        // ui change end
        break;
    }
  }

  // open model code

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  openOutboundNotificationModal(content: any) {
    this.modalService.open(content, { centered: true });
  }
}

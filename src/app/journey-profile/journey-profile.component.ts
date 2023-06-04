import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { JourneyHttpService } from '../services/journey-http.service';

import { WebSocketService } from '../services/websocket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, ElementRef } from '@angular/core';

@Component({
  selector: 'app-journey-profile',
  templateUrl: './journey-profile.component.html',
  styleUrls: ['./journey-profile.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class JourneyProfileComponent implements OnInit {
  sessionBootstrapData: any;
  sessionBootstrapIsEnrolled = false;

  executionSessionExternalRef: any;

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

  externalRef: any;
  getIDsObj: any;

  websocketConnData: any;

  webSocketEvents: any;

  counter = 0;
  isLoading: boolean = false;

  lookUpDataFromAPI: any;
  lookUpEnrollArray: any[] = [];

  authenticatedArray: any[] = [];
  authMeataData: any;

  enrollFacialFlag = false;
  enrollBiometricFlag = false;
  enrollMobileAppFlag = false;

  authFacialFlag = false;
  authBiometricFlag = false;
  authMobileAppFlag = false;
  // showRequestNotification = false;

  public widgetAPI: any;
  public interactionId!: string;

  public message: string = '';
  public interaction: any;
  public interactionEnded: any;
  public customer: any;
  public context: any;
  public media: any;
  public mediaMessage: any;
  public pagePushUrl: any;
  public agent: any;
  public widgetMessage: any;
  public navigation: any;
  public locale: any;
  public capabilities: any;
  public customCardDeleted: any;
  public metadata: any;
  public configuration: any;
  public dispositionCodes!: any[];
  public voiceDispositionCodes!: any[];
  public workCodes!: any[];
  public emailWorkCodes!: any[];
  public additionalWorkCodes!: any[];
  public notReadyReasonCodes!: any[];
  mobileNumber: string = '+919146129322';
  submitFlag: boolean = false;

  exchageRateData: any;
  rateArray: any[] = [];
  errorMassage: string = '';
  agentName: any;
  allInteraction: any;
  notificationFlag: boolean = false;

  oninteractionevent: any;
  public testData: any;
  getAttribute: any;
  public agentDetails: any;
  checkMobileNumber = false;

  userNotFoundFlag = false;
  journeyid_authenticated_flag: any;

  customerEnrolledStatus: any;
  customerEnrolledFlag = false;
  isCustomerSendReqForEnroll = false;
  customerAuthenticatedFlag: any;
  isCustomerSendReqForAuth = false;

  sessionLookupData: any;
  journeyidAuthFlagStatus: any;
  requestNotificationName: any;
  customerUniqueID: any;

  // ********* Send req through qr code, push notification *********

  deviceDetails: any;
  deviceID: any;
  isDevicePresentFlag = false;
  requestName!: any;
  functionName!: any;
  stageArray: any;
  functionNameArray: any[] = [];
  // ************************************************************

  //  mulit notification acordian

  wsJCustID: any;
  wsJSessionID: any;
  wsJOldData: any;
  wsJMobileNumber: any;
  notificationAccordianArray: any[] = [];
  requestObject: any = {};
  // accordianArray: any[] = [];
  accordianArray: any;

  requestArray: any[] = [];
  accordianIndex: any;

  RequestedPipelineName: any;

  // --------------------------------------
  // open model variables

  sendRequestMode: any;
  sendSMSFlag = false;
  sendPushNotificationFlag = false;
  sendQRFlag = false;
  sendEmailFlag = false;

  //---------------

  // duplicate notifications

  // isDuplicate = false;
  tempCheckArray: any;
  uniqueExeIDArray: any[] = [];
  uniqueCompletedRequestedArray: any;

  // --------------------

  constructor(
    private httpService: JourneyHttpService,
    private websocket_Service: WebSocketService,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef
  ) {
    // this.interactionId =
    //   this.element.nativeElement.getAttribute('interactionid');
    // this.widgetAPI = (<any>window).WS.widgetAPI(this.interactionId);
  }
  ngOnInit(): void {
    // *** step 1:  create token

    // Interaction event fired when a new interaction is created or has been updated

    this.functionNameArray = ['SMS', 'Push Notification', 'QR', 'Email'];
    this.counter = 0;
    this.tokenFlagStartSession();

    // this.widgetAPI.onDataEvent('onInteractionEvent', (data: any) => {
    //   this.interaction = data;
    //   // console.log('interaction: ', this.interaction);
    //   this.mobileNumber = this.interaction?.intrinsics.CALLER_NUMBER;
    //   // console.log('interaction mob no: ', this.mobileNumber);
    //   this.getMongoDBResponse(this.mobileNumber);
    //   this.agentName = this.interaction?.destinationAddress;
    //   const splittedString = this.agentName?.split('@');
    //   // console.log(splittedString[0]);
    //   this.agentName = splittedString[0];
    //   this.changeDetectorRef.detectChanges();
    // });

    // this.generateUUID(); // old code not used

    // // Media message data from chat, sms, email, social

    // this.widgetAPI.onDataEvent('onMediaMessageEvent', (data: any) => {
    //   this.mediaMessage = data;
    //   this.mobileNumber = this.mediaMessage?.body.text;
    //   this.checkMobileNumber = this.mobileNumber?.includes('+');
    //   // console.log('onMediaMessageEvent mob number: ', this.mobileNumber);

    //   if (this.checkMobileNumber) {
    //     this.getMongoDBResponse(this.mobileNumber);
    //   }

    //   // console.log('onMediaMessageEvent: ', this.mediaMessage); //
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  tokenFlagStartSession() {
    this.accordianArray = [];
    this.notificationAccordianArray = [];

    this.jwtToken = this.httpService.signToken(this.agentName);
    // console.log(`counter: ${this.counter} token: `, this.jwtToken);
    // console.log(`token: `, this.jwtToken);

    this.enrollFacialFlag = false;
    this.enrollBiometricFlag = false;
    this.enrollMobileAppFlag = false;

    this.authFacialFlag = false;
    this.authBiometricFlag = false;
    this.authMobileAppFlag = false;
  }

  // *** get mongodb response to create bootstrap session

  getMongoDBResponse(mobileNo: any) {
    ++this.counter;

    this.isLoading = true;
    console.warn('counter: ', this.counter);
    // console.log(mobileNo.value);
    this.lookUpEnrollArray = [];
    this.authenticatedArray = [];
    this.enrollFacialFlag = false;
    this.enrollBiometricFlag = false;
    this.enrollMobileAppFlag = false;

    this.authFacialFlag = false;
    this.authBiometricFlag = false;
    this.authMobileAppFlag = false;

    this.externalRef = mobileNo;

    let startStr = this.externalRef?.includes('+');

    if (startStr) {
      // console.log('mobile number validated');

      this.httpService.getMongodbResponse(this.externalRef).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          let res = data.documents[0];

          if (res == undefined || res == null) {
            this.userNotFoundFlag = true;
            // console.log('user not found');

            let string = this.externalRef;
            let newString;

            newString = string.split('+')[1];

            // console.log('newString: ', newString);
            this.getIDsObj = {
              journeyUniqueId: newString,
              journeyExternalRef: null,
              mobilephone: this.externalRef,
            };

            this.createJouneyBootstrapSession();
            this.getLookupDataFromAPI(newString);
          } else {
            this.userNotFoundFlag = false;
            console.warn(' res of mongodb:  ', data, res);

            //  open old web socket
            console.log('res: ', res);

            this.wsJCustID = res?.journeyid_customerid;
            this.wsJSessionID = res?.journeyid_session_id;
            this.wsJMobileNumber = res?.mobilephone;

            // -----------------

            this.customerUniqueID = res?.journeyid_customer_uniqueid;
            this.journeyid_authenticated_flag = res?.journeyid_authenticated;

            // console.log('auth flag: ', this.journeyid_authenticated_flag);

            if (this.journeyid_authenticated_flag == 'No') {
              this.customerAuthenticatedFlag = false;
              this.journeyidAuthFlagStatus = 'NO';
            } else if (this.journeyid_authenticated_flag == 'Yes') {
              this.customerAuthenticatedFlag = true;
              this.journeyidAuthFlagStatus = 'YES';
            }

            this.getIDsObj = {
              journeyUniqueId: res?.journeyid_customer_uniqueid,
              journeyExternalRef: res?.journeyid_session_externalref,
              mobilephone: res?.mobilephone,
            };

            this.executionSessionExternalRef =
              this.getIDsObj.journeyExternalRef;

            // getting old ws events

            console.log('calling getOldWebSocketDetails function ');
            console.log('dde');

            this.getOldWebSocketDetails();

            this.createJouneyBootstrapSession();

            this.getLookupDataFromAPI(this.customerUniqueID);
            this.changeDetectorRef.detectChanges();
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }
  }

  getOldWebSocketDetails() {
    console.log('getOldWebSocketDetails called!!!');
    console.log(this.wsJSessionID);
    this.websocket_Service.getWSPreviousData(
      this.wsJCustID,
      this.wsJSessionID,
      `CONNECT ${this.jwtToken}`
    );

    setTimeout(() => {
      console.log('dwewefwe');
      this.websocket_Service.wsData.subscribe({
        next: (response: any) => {
          console.log(response);
          response = response;

          // If execution created
          if (response.event == 'execution-created') {
            let type = response?.pipeline?.stages[0]?.type;

            // create requestObject
            this.requestObject = {
              wsEvent: response,
              exeID: {
                execution_ID: response?.execution.id,
              },
              statusCSS: {
                processLabelBGColor: '#90ee90',
                processIconColor: '#089000',
                processLabelColor: '#089000',
              },
              delivery: response?.delivery,
            };

            if (type === 'webauthn-authentication') {
              this.requestObject.stausDetails = {
                title: 'Device authentication Request ',
                status: 'Authenticated',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'device-authentication') {
              this.requestObject.stausDetails = {
                title: 'App authentication Request ',
                status: 'Authenticated',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'facial-authentication-3d') {
              this.requestObject.stausDetails = {
                title: 'Facial authentication Request',
                status: 'Authenticated',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'document-signature') {
              this.requestObject.stausDetails = {
                title: 'Document  signature Request',
                status: 'Completed',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'credit-card-payment') {
              this.requestObject.stausDetails = {
                title: 'Payment Request',
                status: 'Completed',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'schedule') {
              this.requestObject.stausDetails = {
                title: 'Outbound Notification Request',
                status: 'Completed',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'facial-enrollment') {
              this.requestObject.stausDetails = {
                title: 'Facial erollment Request',
                status: 'Completed',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'webauthn-registration') {
              this.requestObject.stausDetails = {
                title: 'Device erollment Request',
                status: 'Completed',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === 'mobile-app') {
              this.requestObject.stausDetails = {
                title: 'App erollment Request',
                status: 'Completed',
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            }
          } else if (response.event == 'execution-completed') {
            let flag: boolean = true;

            for (let i = 0; i < this.accordianArray.length; i++) {
              if (
                this.accordianArray[i].wsEvent.execution.id ==
                this.requestObject.wsEvent.execution.id
              ) {
                flag = false;
                break;
              }
            }

            if (flag) {
              this.accordianArray.push(
                Object.assign(response, this.requestObject)
              );
            }
            this.accordianArray.reverse();
          }

          this.notificationAccordianArray.forEach((obj: any, index: number) => {
            console.log(`Noti ${index} `, obj);
          });

          this.accordianArray.forEach((obj: any, index: number) => {
            console.log(`Acc ${index} `, obj);
          });
        },
      });
    }, 3000);
  }

  getLookupDataFromAPI(customerUniqueID: any) {
    this.httpService.getLookupCustomerData(customerUniqueID).subscribe({
      next: (LookupData: any) => {
        // console.log('LookupData: ', LookupData);

        this.deviceDetails = LookupData?.devices[0];
        this.deviceID = this.deviceDetails?.id;
        if (this.deviceDetails) {
          this.isDevicePresentFlag = true;
        }
        // console.log('device flag: ', this.isDevicePresentFlag);
        // console.log('device data: ', this.deviceDetails);
        console.log('device id: ', this.deviceID);

        this.lookUpDataFromAPI = LookupData?.enrollments;

        this.lookUpDataFromAPI.filter((enroll: any) => {
          this.lookUpEnrollArray = [...this.lookUpEnrollArray, enroll.type];
        });

        // console.log('this.lookUpEnrollArray', this.lookUpEnrollArray);

        this.enrollFacialFlag =
          this.lookUpEnrollArray?.includes('facial-biometrics');
        // console.log('enrollFacialFlag', this.enrollFacialFlag);
        this.enrollBiometricFlag = this.lookUpEnrollArray?.includes('webauthn');
        // console.log('enrollBiometricFlag', this.enrollBiometricFlag);
        this.enrollMobileAppFlag =
          this.lookUpEnrollArray?.includes('mobile-app');
        // console.log('enrollMobileAppFlag', this.enrollMobileAppFlag);

        if (
          this.enrollFacialFlag ||
          this.enrollBiometricFlag ||
          this.enrollMobileAppFlag
        ) {
          this.customerEnrolledFlag = true;
        }
      },
      error: (err: any) => {
        console.log('Lookup api error: ', err);
      },
    });
  }

  // Step 2: create Bootstrap Session

  createJouneyBootstrapSession() {
    // externalRef: this.executionSessionExternalRef,
    let reqData = {
      event: 'start-session',
      session: {
        externalRef: this.getIDsObj.journeyExternalRef,
      },
      user: {
        phoneNumber: this.getIDsObj.mobilephone,
        uniqueId: this.getIDsObj.journeyUniqueId,
      },
    };
    this.executionSessionExternalRef = this.getIDsObj.journeyExternalRef;
    // console.warn('bootstrap start session req obj: ', reqData);

    this.httpService.createBootstrapSession(reqData, this.jwtToken).subscribe({
      next: (data: any) => {
        this.bootstrapData = data;

        // console.log('get bootstrap data', this.bootstrapData);

        this.sessionBootstrapData = data.user;
        this.sessionBootstrapIsEnrolled = data.metadata.isEnrolled;

        this.websocketConnData = {
          user_ID: this.bootstrapData.user.id,
          session_ID: this.bootstrapData.session.id,
        };

        // console.log(
        //   'createJouneyBootstrapSession- web socket data: ',
        //   this.websocketConnData
        // );

        // No name available

        if (
          (this.sessionBootstrapData.firstName &&
            this.sessionBootstrapData.lastName &&
            this.sessionBootstrapData.email) == ''
        ) {
          this.sessionBootstrapData = {
            firstName: 'No name available',
            phoneNumber: this.sessionBootstrapData.phoneNumber,
          };

          if (!this.sessionBootstrapIsEnrolled) {
            this.RequestLabelName = 'Unenrolled';
            this.customerEnrolledFlag = false;
            // this.customerEnrolledStatus = 'Unenrolled';
            this.customerEnrolledStatus = 'NO';
          }

          // console.log('not name avail: ', this.sessionBootstrapData);
        }

        // this.createNewRequest();

        if (this.sessionBootstrapIsEnrolled) {
          this.alertBoxColor = '#fc6a03';
          this.RequestIconColor = '#fc6a03';
          this.customerEnrolledFlag = true;
          this.RequestLabelName = 'Enrolled';
          // this.customerEnrolledStatus = 'Enrolled';
          this.customerEnrolledStatus = 'YES';
          this.RequestLabelColor = '#fc6a03';
        }

        // console.log(data);

        // call session api
        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getLookupSessionDataFromAPI(sessionID: any) {
    this.httpService.getLookupSessionOfCustomer(sessionID).subscribe({
      next: (LookupData: any) => {
        // console.log('Session LookupData: ', LookupData);

        this.sessionLookupData = LookupData;

        let authPipelineKey =
          this.sessionLookupData?.executions[0].pipeline.key;

        // console.log('authPipelineKey: ', authPipelineKey);

        // console.log('stages: ', this.sessionLookupData?.executions);

        this.stageArray = this.sessionLookupData?.executions;

        for (let i = 0; i < this.stageArray.length; i++) {
          // console.log('stage number: ', this.stageArray[i]);

          if (this.stageArray[i].stages) {
            // console.log('stages Data: ', this.stageArray[i].stages);
            if (
              this.stageArray[i]?.stages[0]?.type === 'webauthn-authentication'
            ) {
              this.authBiometricFlag = true;
            } else if (
              this.stageArray[i]?.stages[0]?.type === 'device-authentication'
            ) {
              this.authMobileAppFlag = true;
            } else if (
              this.stageArray[i]?.stages[0]?.type === 'facial-authentication-3d'
            ) {
              this.authFacialFlag = true;
            }
          }
        }
      },

      error: (err: any) => {
        console.log('Lookup api error: ', err);
      },
    });
  }

  // Step 3: Making Pipeline (execution ) requests

  sendFacialEnrollmentRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a facial Enrollment request via ${this.sendRequestMode} to Enroll yourself.
    //     Please complete the Enrollment process`
    // );

    // console.log('bootstrap data', this.bootstrapData);
    this.requestNotificationName = 'Facial erollment Request';
    this.isCustomerSendReqForEnroll = true;
    let pipelineKey = '7214289b-47d8-4313-970a-567f8c0b685f';

    let reqPayload = this.createPayloadRequest(pipelineKey);

    // console.log('exe payload: ', reqPayload);

    this.executeRequest(reqPayload);
  }

  sendFacialAuthRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a facial authentication request via ${this.sendRequestMode} to Authenticate yourself.
    //     Please complete the Authentication process`
    // );

    // console.log('bootstrap data', this.bootstrapData);
    this.requestNotificationName = 'Facial authentication Request';

    // let pipelineKey = 'd73d7733-5450-46a3-a1c7-42bf06e09ea0';
    let pipelineKey = 'dc2db844-c4a9-45fe-9316-44edd90b68dd';

    let reqPayload = this.createPayloadRequest(pipelineKey);

    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    // console.log('exe payload: ', reqPayload);

    this.executeRequest(reqPayload);
  }

  // send biometric request

  sendBiometricEnrollRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a device Enrollment request via ${this.sendRequestMode} to Enroll yourself.
    //       Please complete the Enrollment process`
    // );

    this.requestNotificationName = 'Device enrollment Request';

    let pipelineKey = 'e96e40a4-0ed3-4ff2-bd93-49a9061522cc';
    this.isCustomerSendReqForEnroll = true;
    let reqPayload = this.createPayloadRequest(pipelineKey);

    this.executeRequest(reqPayload);
  }

  sendBiometricAuthenticatoinRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a device authentication request via ${this.sendRequestMode} to Authenticate yourself.
    //     Please complete the Authentication process`
    // );

    this.requestNotificationName = 'Device authentication Request';
    // console.log('bootstrap data', this.bootstrapData);

    let pipelineKey = '2eb2c038-6bdd-45ba-9eea-f97c3f17e138';
    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    let reqPayload = this.createPayloadRequest(pipelineKey);
    // console.log('exe payload: ', reqPayload);
    this.executeRequest(reqPayload);
  }

  executeRequest(reqPayload: any) {
    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            // console.log('Execution data: ', data);
            this.authRequestedData = data;
            // url: 'https://secure.journeyid.io/s/Kd2BAgj';

            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // this.sendAuthRequestFlag = true;

            // start mult acc req

            if (this.sendRequestMode == 'sms') {
              this.requestObject.delivery = {
                method: 'sms',
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == 'push-notification') {
              this.requestObject.delivery = {
                method: 'push-notification',
                deviceId: this.deviceID,
              };
            }

            console.log('this.requestObject: ', this.requestObject);

            this.requestObject = {
              wsEvent: null,
            };

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: '#ffd580',
              processIconColor: '#fc6a03',
              processLabelColor: '#fc6a03',
            };

            this.requestObject.stausDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: 'Requested',
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: 'just now',
            };

            this.accordianArray = [this.requestObject, ...this.accordianArray];

            // console.log('after added new request: ', this.accordianArray);

            // step 4: Listening for Websocket events

            // console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            // console.log('ws user id: ', this.authRequestedData.user.id);
            // console.log('ws session id: ', this.authRequestedData.session.id);

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                // console.log('comp events: ', value);

                // execution-completed
                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents?.event !== 'session-authenticated'
                ) {
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.authRequestedData.user.id,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;
                this.statusOfRequest(
                  this.webSocketEvents.event,
                  this.webSocketEvents
                );
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  sdkEnroll() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a mobile app enrollment request via ${this.sendRequestMode} to Enroll yourself.
    //     Please complete the Enrollment process`
    // );

    this.requestNotificationName = 'App enrollment Request';
    let pipelineKey = '060284b0-68dd-4c02-9534-7688d967b193';
    this.isCustomerSendReqForEnroll = true;
    let reqPayload = this.createSDKPayload(pipelineKey);

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            // console.log('Execution data: ', data);
            this.authRequestedData = data;

            // this.sendAuthRequestFlag = true;

            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: '#ffd580',
              processIconColor: '#fc6a03',
              processLabelColor: '#fc6a03',
            };

            this.requestObject.stausDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: 'Requested',
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: 'just now',
            };

            this.accordianArray = [this.requestObject, ...this.accordianArray];

            // console.log('after added new request: ', this.accordianArray);

            // step 4: Listening for Websocket events

            // console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData?.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                // console.log('comp events: ', value);

                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents?.event !== 'session-authenticated'
                ) {
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.authRequestedData.user.id,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;

                this.statusOfRequest(
                  this.webSocketEvents.event,
                  this.webSocketEvents
                );
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  sdkAuthentication() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a mobile app authenticate request via ${this.sendRequestMode} to Authenticate yourself.
    //     Please complete the Authentication process`
    // );

    this.requestNotificationName = 'App authentication Request';
    let pipelineKey = '6871934e-a546-4d9b-910b-2b566df42376';
    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    let reqPayload = this.createSDKPayload(pipelineKey);

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            // console.log('Execution data: ', data);
            this.authRequestedData = data;
            // this.addNewAccordianRequest(this.authRequestedData);
            // this.sendAuthRequestFlag = true;
            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: '#ffd580',
              processIconColor: '#fc6a03',
              processLabelColor: '#fc6a03',
            };

            this.requestObject.stausDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: 'Requested',
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: 'just now',
            };

            this.accordianArray = [this.requestObject, ...this.accordianArray];

            // console.log('after added new request: ', this.accordianArray);

            // step 4: Listening for Websocket events

            // console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                // console.log('comp events: ', value);

                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents?.event !== 'session-authenticated'
                ) {
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.authRequestedData.user.id,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;

                this.statusOfRequest(
                  this.webSocketEvents.event,
                  this.webSocketEvents
                );
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  //  this.widgetAPI.sendChatMessage(
  //     'I have shared a request via (SMS | Push Notification) to Authenticate yourself. Please complete the Authentication process'
  //   );

  sendSignatureRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a e-sign document request via ${this.sendRequestMode}.
    //    Please complete the e-sign document process`
    // );
    this.requestNotificationName = 'Digital Signature Request';

    let pipelineKey = 'cfcfb607-8fb0-4ec1-9f80-4288cc573afb';

    let reqPayload = this.createPayloadRequest(pipelineKey);
    // this.executeRequest(reqPayload);
    this.executeSignatureRequest(reqPayload);
  }

  executeSignatureRequest(reqPayload: any) {
    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            // console.log('Execution data: ', data);
            this.authRequestedData = data;
            // url: 'https://secure.journeyid.io/s/Kd2BAgj';

            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // this.sendAuthRequestFlag = true;

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };
            if (this.sendRequestMode == 'sms') {
              this.requestObject.delivery = {
                method: 'sms',
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == 'push-notification') {
              this.requestObject.delivery = {
                method: 'push-notification',
                deviceId: this.deviceID,
              };
            } else if (this.sendRequestMode == '')
              console.log('this.requestObject: ', this.requestObject);

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: '#ffd580',
              processIconColor: '#fc6a03',
              processLabelColor: '#fc6a03',
            };

            this.requestObject.stausDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: 'Requested',
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: 'just now',
            };

            console.log(' this.requestObject: ', this.requestObject);

            this.accordianArray = [this.requestObject, ...this.accordianArray];

            console.log('after added new request: ', this.accordianArray);

            // step 4: Listening for Websocket events

            // console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            // console.log('ws user id: ', this.authRequestedData.user.id);
            // console.log('ws session id: ', this.authRequestedData.session.id);

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                // console.clear();
                console.log('comp events: ', value);

                // execution-completed
                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents?.event !== 'execution-completed'
                ) {
                  console.log('closed');
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.authRequestedData.user.id,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;
                this.statusOfRequest(
                  this.webSocketEvents.event,
                  this.webSocketEvents
                );
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  sendPaymentRequest(description: any, amount: any, requestType: any) {
    if (requestType == 'SMS') {
      this.sendSMSFlag = true;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'sms';
      // console.log('SMS');
    } else if (requestType == 'Push Notification') {
      this.sendEmailFlag = false;
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = true;
      this.sendQRFlag = false;
      this.sendRequestMode = 'push-notification';
      // console.log('Push Notification');
    } else if (requestType == 'QR') {
      this.sendEmailFlag = false;
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = true;
      this.sendRequestMode = 'url';
      // console.log('QR');
    } else if (requestType == 'Email') {
      this.sendEmailFlag = true;
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'email';
      // console.log('Email');
    }

    // this.widgetAPI.sendChatMessage(
    //   `I have shared a credit card payment request via  ${this.sendRequestMode}.
    //    Please complete the payment process`
    // );

    this.requestNotificationName = 'Payment Request';

    // console.log(description.value, ' ', amount.value);
    let reqPayload = this.createPaymentPayload(description.value, amount.value);
    // console.log('send payment req: ', reqPayload);

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            // console.log('Execution data: ', data);

            this.authRequestedData = data;
            // this.addNewAccordianRequest(this.authRequestedData);
            // this.addNewAccordianRequest(this.authRequestedData?.pipeline.title);
            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // this.sendAuthRequestFlag = true;

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            if (this.sendRequestMode == 'sms') {
              this.requestObject.delivery = {
                method: 'sms',
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == 'push-notification') {
              this.requestObject.delivery = {
                method: 'push-notification',
                deviceId: this.deviceID,
              };
            }

            console.log('this.requestObject: ', this.requestObject);
            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: '#ffd580',
              processIconColor: '#fc6a03',
              processLabelColor: '#fc6a03',
            };

            this.requestObject.stausDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: 'Requested',
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: 'just now',
            };

            this.accordianArray = [this.requestObject, ...this.accordianArray];

            // console.log('after added new request: ', this.accordianArray);

            // step 4: Listening for Websocket events

            // console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                // console.log('comp events: ', value);

                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents?.event !== 'execution-completed'
                ) {
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.authRequestedData.user.id,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;

                this.statusOfRequest(
                  this.webSocketEvents.event,
                  this.webSocketEvents
                );
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  outboundNotificationFlag = false;
  outboundNotificationWSeventResultRes: any;

  sendOutboundNotificatoin(reason: any, requestType: any) {
    if (requestType == 'SMS') {
      this.sendSMSFlag = true;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'sms';
      // console.log('SMS');
    } else if (requestType == 'Push Notification') {
      this.sendPushNotificationFlag = true;
      this.sendEmailFlag = false;
      this.sendSMSFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'push-notification';
      // console.log('Push Notification');
    } else if (requestType == 'QR') {
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = true;
      this.sendEmailFlag = false;
      this.sendRequestMode = 'url';
      // console.log('QR');
    } else if (requestType == 'Email') {
      this.sendEmailFlag = true;
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'email';
      // console.log('Email');
    }

    // this.widgetAPI.sendChatMessage(
    //   `I have shared a outbound notification request via ${this.sendRequestMode}.
    //    Please complete the process`
    // );

    let reference = reason.value;
    this.requestNotificationName = 'Outbound Notification Request';
    // console.log('outbound notification reason: ', reference);

    let deliveryDetails;
    if (this.sendPushNotificationFlag) {
      deliveryDetails = {
        // method: 'sms',
        method: this.sendRequestMode,
        deviceId: this.deviceID,
      };
    } else if (this.sendQRFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
      };
    } else if (this.sendSMSFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
        phoneNumber: this.bootstrapData.user.phoneNumber,
      };
    } else if (this.sendEmailFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
        email: this.sessionBootstrapData?.email,
      };
    }
    let reqPayload = {
      pipelineKey: '03542a52-d33a-4b12-a17c-790ed881fd36',
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
        externalRef: this.executionSessionExternalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: deliveryDetails,

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
    // let reqPayload = this.createPayloadRequest(pipelineKey);
    // console.log('exe payload for outbound call: ', reqPayload);
    // this.executeRequest(reqPayload);

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            // console.log('Execution data: ', data);
            this.authRequestedData = data;
            // this.addNewAccordianRequest(this.authRequestedData);
            // this.sendAuthRequestFlag = true;
            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            if (this.sendRequestMode == 'sms') {
              this.requestObject.delivery = {
                method: 'sms',
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == 'push-notification') {
              this.requestObject.delivery = {
                method: 'push-notification',
                deviceId: this.deviceID,
              };
            }

            console.log('this.requestObject: ', this.requestObject);

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: '#ffd580',
              processIconColor: '#fc6a03',
              processLabelColor: '#fc6a03',
            };

            this.requestObject.stausDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: 'Requested',
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: 'just now',
            };

            this.accordianArray = [this.requestObject, ...this.accordianArray];

            this.outboundNotificationFlag = true;

            // console.log('after added new request: ', this.accordianArray);

            // step 4: Listening for Websocket events

            // console.log('connecting web socket ');

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                // console.log('comp events: ', value);

                if (
                  (value.type === 'close' || value.code === 1006) &&
                  this.webSocketEvents?.event !== 'execution-completed'
                ) {
                  setTimeout(() => {
                    this.websocket_Service.connectWebSocket(
                      this.authRequestedData.user.id,
                      this.authRequestedData.session.id,
                      `CONNECT ${this.jwtToken}`
                    );
                  }, 3000);
                }

                this.webSocketEvents = value;
                this.statusOfRequest(
                  this.webSocketEvents.event,
                  this.webSocketEvents
                );
              },
            });
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  createPaymentPayload(Desc: any, Amount: any) {
    let deliveryDetails;
    if (this.sendPushNotificationFlag) {
      deliveryDetails = {
        // method: 'sms',
        method: this.sendRequestMode,
        deviceId: this.deviceID,
      };
    } else if (this.sendQRFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
      };
    } else if (this.sendSMSFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
        phoneNumber: this.bootstrapData.user.phoneNumber,
      };
    } else if (this.sendEmailFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
        email: this.sessionBootstrapData?.email,
      };
    }

    let reqPayload = {
      pipelineKey: 'e117db4d-8742-4a03-bdc8-d58726a7cf67',

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
        // externalRef: this.bootstrapData.session.externalRef,
        externalRef: this.executionSessionExternalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: deliveryDetails,

      // {
      //   method: 'sms',
      //   phoneNumber: this.bootstrapData.user.phoneNumber,
      // },
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
    let deliveryDetails;
    if (this.sendPushNotificationFlag) {
      deliveryDetails = {
        // method: 'sms',
        method: this.sendRequestMode,
        deviceId: this.deviceID,
      };
    } else if (this.sendQRFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
      };
    } else if (this.sendSMSFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
        phoneNumber: this.bootstrapData.user.phoneNumber,
      };
    } else if (this.sendEmailFlag) {
      deliveryDetails = {
        method: this.sendRequestMode,
        email: this.sessionBootstrapData?.email,
      };
    }

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
        // externalRef: this.bootstrapData.session.externalRef,
        externalRef: this.executionSessionExternalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: deliveryDetails,
      //  {
      //   method: 'sms',
      //   phoneNumber: this.bootstrapData.user.phoneNumber,
      // }
      configuration: {},
      language: 'en-US',
    };

    return reqPlayload;
  }

  createPayloadRequest(RequestPipelineKey: any) {
    let userDetails;
    let deliveryDetails;

    if (this.userNotFoundFlag) {
      userDetails = {
        id: null,
        uniqueId: this.getIDsObj.journeyUniqueId,
        email: '',
        phoneNumber: this.getIDsObj.mobilephone,
        firstName: '',
        middleName: '',
        lastName: '',
        devices: [],
      };

      if (this.sendPushNotificationFlag) {
        deliveryDetails = {
          // method: 'sms',
          method: this.sendRequestMode,
          deviceId: this.deviceID,
        };
      } else if (this.sendQRFlag) {
        deliveryDetails = {
          method: this.sendRequestMode,
        };
      } else if (this.sendSMSFlag) {
        deliveryDetails = {
          method: this.sendRequestMode,
          phoneNumber: this.bootstrapData.user.phoneNumber,
        };
      } else if (this.sendEmailFlag) {
        deliveryDetails = {
          method: this.sendRequestMode,
          email: this.sessionBootstrapData?.email,
        };
      }
    } else {
      userDetails = {
        id: this.bootstrapData.user.id,
        uniqueId: this.bootstrapData.user.uniqueId,
        email: this.bootstrapData.user.email,
        phoneNumber: this.bootstrapData.user.phoneNumber,
        firstName: this.bootstrapData.user.firstName,
        middleName: this.bootstrapData.user.middleName,
        lastName: this.bootstrapData.user.lastName,
        devices: [],
      };

      if (this.sendPushNotificationFlag) {
        deliveryDetails = {
          // method: 'sms',
          method: this.sendRequestMode,
          deviceId: this.deviceID,
        };
      } else if (this.sendQRFlag) {
        deliveryDetails = {
          method: this.sendRequestMode,
        };
      } else if (this.sendSMSFlag) {
        deliveryDetails = {
          method: this.sendRequestMode,
          phoneNumber: this.bootstrapData.user.phoneNumber,
        };
      } else if (this.sendEmailFlag) {
        deliveryDetails = {
          method: this.sendRequestMode,
          email: this.sessionBootstrapData?.email,
        };
      }
    }
    let reqPayload = {
      pipelineKey: RequestPipelineKey,
      user: userDetails,
      session: {
        id: null,
        externalRef: this.executionSessionExternalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: deliveryDetails,
      configuration: {},
      language: 'en-US',
    };

    // console.log('exe payload: ', reqPayload);

    return reqPayload;
  }

  // accordianIndex: any;
  // cssStatus: any;

  statusOfRequest(events: any, allEventData: any) {
    this.accordianIndex = this.accordianArray.findIndex(
      (x: any) => x?.exeID.execution_ID === allEventData?.execution?.id
    );

    console.log('event: ', events);
    console.log('Index: ', this.accordianIndex);
    console.log('Index: ', this.accordianArray.length);
    if (this.accordianArray?.[this.accordianIndex]) {
      this.accordianArray[this.accordianIndex].wsEvent = { ...allEventData };
    }

    // console.log('acc index: ', this.accordianArray[this.accordianIndex]);

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
        if (this.accordianArray?.[this.accordianIndex]) {
          this.accordianArray[this.accordianIndex].stausDetails = {
            status: 'Started',
            title: this.accordianArray[this.accordianIndex].stausDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt: 'just now',
          };

          this.accordianArray[this.accordianIndex].statusCSS = {
            processLabelBGColor: '#b0e0e6',
            processIconColor: '#00bfff',
            processLabelColor: '#00bfff',
          };
        }

        // console.log('after added new request: ', this.accordianArray);

        break;
      case 'execution-progress':
        if (this.accordianArray?.[this.accordianIndex]) {
          this.accordianArray[this.accordianIndex].stausDetails = {
            status: 'Started',
            title: this.accordianArray[this.accordianIndex].stausDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt: 'just now',
          };

          this.accordianArray[this.accordianIndex].statusCSS = {
            processLabelBGColor: '#b0e0e6',
            processIconColor: '#00bfff',
            processLabelColor: '#00bfff',
          };
        }

        break;
      case 'execution-completed':
        // ui change
        // this.alertBoxColor = '#089000';
        // this.RequestIconColor = '#089000';
        // this.processLabelBGColor = '#90ee90';
        // this.processLabelName = 'Completed';
        // this.processIconColor = '#089000';
        // this.processLabelColor = '#089000';
        // this.RequestLabelName = 'Authenticated';
        // this.RequestLabelColor = '#089000';

        // this.customerAuthenticatedFlag = true;

        if (this.isCustomerSendReqForAuth) {
          this.customerAuthenticatedFlag = true;
        }

        if (this.isCustomerSendReqForEnroll) {
          this.customerEnrolledFlag = true;
        }

        if (this.accordianArray?.[this.accordianIndex]) {
          this.accordianArray[this.accordianIndex].stausDetails = {
            status: 'Completed',
            title: this.accordianArray[this.accordianIndex].stausDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt:
              this.accordianArray[this.accordianIndex].wsEvent.execution
                .completedAt,
          };

          this.accordianArray[this.accordianIndex].statusCSS = {
            processLabelBGColor: '#90ee90',
            processIconColor: '#089000',
            processLabelColor: '#089000',
          };
        }

        if (this.outboundNotificationFlag) {
          // outbound notification flag true
          // check response is it now, if it is now then enable call now button

          console.log(
            'outbound notification: ',
            this.accordianArray[this.accordianIndex].wsEvent
          );
        }

        this.getMongoDBResponse(this.mobileNumber);
        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);
        this.getLookupDataFromAPI(this.customerUniqueID);

        // ui change end
        break;
      case 'session-authenticated':
        if (this.isCustomerSendReqForAuth) {
          this.customerAuthenticatedFlag = true;
        }

        if (this.isCustomerSendReqForEnroll) {
          this.customerEnrolledFlag = true;
        }

        if (this.accordianArray?.[this.accordianIndex]) {
          this.accordianArray[this.accordianIndex].stausDetails = {
            status: 'Authenticated',
            title: this.accordianArray[this.accordianIndex].stausDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt:
              this.accordianArray[this.accordianIndex].wsEvent.execution
                .completedAt,
          };

          this.accordianArray[this.accordianIndex].statusCSS = {
            processLabelBGColor: '#90ee90',
            processIconColor: '#089000',
            processLabelColor: '#089000',
          };
        }

        if (this.outboundNotificationFlag) {
          // outbound notification flag true
          // check response is it now, if it is now then enable call now button

          console.log(
            'auth outbound notification: ',
            this.accordianArray[this.accordianIndex].wsEvent
          );
        }

        // console.log('end counter: ', this.counter);

        this.getMongoDBResponse(this.mobileNumber);
        this.getLookupDataFromAPI(this.customerUniqueID);
        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);

        // this.widgetAPI.sendChatMessage('Session Process completed');
        // this.widgetAPI.sendRichMediaMessage({ text: '  ' }, 'text', '');

        // ui change end
        break;
      default:
        break;
    }
  }

  openTestModal(Modal: any, reqName: any) {
    this.requestName = reqName;

    // console.log('Reqeust name: ', this.requestName);

    this.modalService.open(Modal, { centered: true, windowClass: 'reqModal' });
  }

  callFunctionArray(funcName: any) {
    if (funcName == 'SMS') {
      this.sendSMSFlag = true;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'sms';

      // console.log('SMS');
    } else if (funcName == 'Push Notification') {
      this.sendSMSFlag = false;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = true;
      this.sendQRFlag = false;
      this.sendRequestMode = 'push-notification';
      // console.log('Push Notification');
    } else if (funcName == 'QR') {
      this.sendSMSFlag = false;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = true;
      this.sendRequestMode = 'url';
      // console.log('QR');
    } else if (funcName == 'Email') {
      this.sendEmailFlag = true;
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = 'email';
      // console.log('Email');
    }

    if (this.requestName == 'sendFacialEnrollmentRequest') {
      // console.log('sendFacialEnrollmentRequest');
      this.sendFacialEnrollmentRequest();
    } else if (this.requestName == 'sendFacialAuthRequest') {
      this.sendFacialAuthRequest();
      // console.log('sendFacialEnrollmentRequest');
    } else if (this.requestName == 'sendBiometricEnrollRequest') {
      this.sendBiometricEnrollRequest();
      // console.log('sendBiometricEnrollRequest');
    } else if (this.requestName == 'sendBiometricAuthenticatoinRequest') {
      this.sendBiometricAuthenticatoinRequest();
      // console.log('sendBiometricAuthenticatoinRequest');
    } else if (this.requestName == 'sdkEnroll') {
      this.sdkEnroll();
      // console.log('sdkEnroll');
    } else if (this.requestName == 'sdkAuthentication') {
      this.sdkAuthentication();
      // console.log('sdkAuthentication');
    } else if (this.requestName == 'sendSignatureRequest') {
      this.sendSignatureRequest();
      // console.log('sendSignatureRequest');
    }
  }

  openCreditCardPaymentModal(PaymentModal: any) {
    this.modalService.open(PaymentModal, {
      centered: true,
      windowClass: 'payModal',
    });
  }

  openOutboundNotificationModal(outboundNotificationModal: any) {
    this.modalService.open(outboundNotificationModal, {
      centered: true,
      windowClass: 'outboundNotificationModal',
    });
  }
}
// export class JourneyProfileComponent implements OnInit {
//   // executionID: any;
//   // executionUserID: any;
//   sessionBootstrapData: any;
//   sessionBootstrapIsEnrolled = false;

//   executionSessionExternalRef: any;

//   CountryCode!: any;

//   RequestLabelName: any;
//   RequestLabelColor: any;
//   RequestIconColor: any;

//   processLabelName: any;
//   processLabelBGColor: any;
//   processLabelColor: any;
//   processIconColor: any;
//   alertBoxColor: any;

//   pipelineKey: any;
//   bootstrapData: any;
//   authRequestedData: any;
//   sendAuthRequestFlag = false;

//   jwtToken: any;
//   srcLink: any;

//   externalRef: any;
//   getIDsObj: any;

//   filterEventOnDate: any;
//   websocketConnData: any;
//   uuidValue!: string;
//   webSocketEvents: any;

//   counter = 0;

//   // accordianArray: any[] = [
//   //   { title: 1, status: false },
//   //   { title: 2, status: false },
//   //   { title: 3, status: false },
//   //   { title: 4, status: false },
//   //   { title: 5, status: false },
//   //   { title: 6, status: false },
//   //   { title: 7, status: false },
//   //   { title: 8, status: false },
//   //   { title: 9, status: false },
//   //   { title: 10, status: false },
//   // ];

//   accordianRequestTitle: any;

//   lookUpDataFromAPI: any;
//   lookUpEnrollArray: any[] = [];

//   authenticatedArray: any[] = [];
//   authMeataData: any;

//   enrollFacialFlag = false;
//   enrollBiometricFlag = false;
//   enrollMobileAppFlag = false;

//   authFacialFlag = false;
//   authBiometricFlag = false;
//   authMobileAppFlag = false;
//   // showRequestNotification = false;

//   public widgetAPI: any;
//   public interactionId!: string;

//   public message: string = '';
//   public interaction: any;
//   public interactionEnded: any;
//   public customer: any;
//   public context: any;
//   public media: any;
//   public mediaMessage: any;
//   public pagePushUrl: any;
//   public agent: any;
//   public widgetMessage: any;
//   public navigation: any;
//   public locale: any;
//   public capabilities: any;
//   public customCardDeleted: any;
//   public metadata: any;
//   public configuration: any;
//   public dispositionCodes!: any[];
//   public voiceDispositionCodes!: any[];
//   public workCodes!: any[];
//   public emailWorkCodes!: any[];
//   public additionalWorkCodes!: any[];
//   public notReadyReasonCodes!: any[];
//   mobileNumber: any = '+919146129322';
//   submitFlag: boolean = false;

//   exchageRateData: any;
//   rateArray: any[] = [];
//   errorMassage: string = '';
//   agentName: any;
//   allInteraction: any;
//   notificationFlag: boolean = false;

//   oninteractionevent: any;
//   public testData: any;
//   getAttribute: any;
//   public agentDetails: any;
//   checkMobileNumber = false;

//   userNotFoundFlag = false;
//   journeyid_authenticated_flag: any;

//   customerEnrolledStatus: any;
//   customerEnrolledFlag = false;
//   isCustomerSendReqForEnroll = false;
//   customerAuthenticatedFlag: any;
//   isCustomerSendReqForAuth = false;

//   sessionLookupData: any;
//   journeyidAuthFlagStatus: any;
//   requestNotificationName: any;
//   customerUniqueID: any;

//   // ********* Send req through qr code, push notification *********

//   deviceDetails: any;
//   deviceID: any;
//   isDevicePresentFlag = false;
//   requestName!: any;
//   functionName!: any;
//   stageArray: any;
//   functionNameArray: any[] = [];
//   // ************************************************************

//   //  mulit notification acordian

//   wsJCustID: any;
//   wsJSessionID: any;
//   wsJMobileNumber: any;
//   notificationAccordianArray: any[] = [];
//   requestObject: any = {};
//   accordianArray: any[] = [];
//   requestArray: any[] = [];
//   accordianIndex: any;

//   RequestedPipelineName: any;

//   // --------------------------------------
//   // open model variables

//   sendRequestMode: any;
//   sendSMSFlag = false;
//   sendPushNotificationFlag = false;
//   sendQRFlag = false;
//   sendEmailFlag = false;
//   isLoading: boolean = false;

//   //---------------

//   // duplicate notifications

//   isDuplicate = false;
//   tempCheckArray: any;
//   uniqueExeIDArray: any[] = [];

//   oldWSEventExeID: any;

//   // --------------------

//   constructor(
//     private httpService: JourneyHttpService,
//     private websocket_Service: WebSocketService,
//     private modalService: NgbModal,
//     private changeDetectorRef: ChangeDetectorRef,
//     private element: ElementRef
//   ) {
//     // this.interactionId =
//     //   this.element.nativeElement.getAttribute('interactionid');
//     // this.widgetAPI = (<any>window).WS.widgetAPI(this.interactionId);
//   }
//   ngOnInit(): void {
//     // *** step 1:  create token

//     // Interaction event fired when a new interaction is created or has been updated

//     this.functionNameArray = ['SMS', 'Push Notification', 'QR', 'Email'];
//     this.counter = 0;
//     this.tokenFlagStartSession();

//     // this.widgetAPI.onDataEvent('onInteractionEvent', (data: any) => {
//     //   this.interaction = data;
//     //   console.log('interaction: ', this.interaction);
//     //   this.mobileNumber = this.interaction?.intrinsics.CALLER_NUMBER;
//     //   console.log('interaction mob no: ', this.mobileNumber);
//     //   this.getMongoDBResponse(this.mobileNumber);
//     //   this.agentName = this.interaction?.destinationAddress;
//     //   const splittedString = this.agentName?.split('@');
//     //   console.log(splittedString[0]);
//     //   this.agentName = splittedString[0];
//     //   this.changeDetectorRef.detectChanges();
//     // });

//     // this.generateUUID(); // old code not used

//     // // Media message data from chat, sms, email, social

//     // this.widgetAPI.onDataEvent('onMediaMessageEvent', (data: any) => {
//     //   this.mediaMessage = data;
//     //   this.mobileNumber = this.mediaMessage?.body.text;
//     //   this.checkMobileNumber = this.mobileNumber?.includes('+');
//     //   console.log('onMediaMessageEvent mob number: ', this.mobileNumber);

//     //   if (this.checkMobileNumber) {
//     //     this.getMongoDBResponse(this.mobileNumber);
//     //   }

//     //   console.log('onMediaMessageEvent: ', this.mediaMessage); //
//     //   this.changeDetectorRef.detectChanges();
//     // });
//   }

//   tokenFlagStartSession() {
//     this.accordianArray = [];
//     this.notificationAccordianArray = [];

//     this.jwtToken = this.httpService.signToken(this.agentName);
//     // console.log(`counter: ${this.counter} token: `, this.jwtToken);
//     console.log(`token: `, this.jwtToken);

//     this.enrollFacialFlag = false;
//     this.enrollBiometricFlag = false;
//     this.enrollMobileAppFlag = false;

//     this.authFacialFlag = false;
//     this.authBiometricFlag = false;
//     this.authMobileAppFlag = false;
//   }

//   // *** get mongodb response to create bootstrap session

//   getMongoDBResponse(mobileNo: any) {
//     ++this.counter;
//     this.isLoading = true;

//     // console.log(mobileNo.value);
//     this.lookUpEnrollArray = [];
//     this.authenticatedArray = [];
//     this.enrollFacialFlag = false;
//     this.enrollBiometricFlag = false;
//     this.enrollMobileAppFlag = false;

//     this.authFacialFlag = false;
//     this.authBiometricFlag = false;
//     this.authMobileAppFlag = false;

//     this.externalRef = mobileNo;

//     let startStr = this.externalRef?.includes('+');

//     if (startStr) {
//       console.log('mobile number validated');

//       this.httpService.getMongodbResponse(this.externalRef).subscribe({
//         next: (data: any) => {
//           this.isLoading = false;

//           console.log('Response: ', data);
//           let res = data.documents[0];

//           if (!res) {
//             this.userNotFoundFlag = true;
//             console.log('user not found');

//             let string = this.externalRef;
//             let newString;

//             newString = string.split('+')[1];

//             console.log('newString: ', newString);
//             this.getIDsObj = {
//               journeyUniqueId: newString,
//               journeyExternalRef: null,
//               mobilephone: this.externalRef,
//             };

//             this.createJouneyBootstrapSession();
//             this.getLookupDataFromAPI(newString);
//           } else {
//             this.userNotFoundFlag = false;
//             console.warn(' res of mongodb:  ', data, res);

//             //  open old web socket

//             this.wsJCustID = res?.journeyid_customerid;
//             this.wsJSessionID = res?.journeyid_session_id;
//             this.wsJMobileNumber = res?.mobilephone;

//             // -----------------

//             this.customerUniqueID = res?.journeyid_customer_uniqueid;
//             this.journeyid_authenticated_flag = res?.journeyid_authenticated;

//             console.log('auth flag: ', this.journeyid_authenticated_flag);

//             if (this.journeyid_authenticated_flag == 'No') {
//               this.customerAuthenticatedFlag = false;
//               this.journeyidAuthFlagStatus = 'NO';
//             } else if (this.journeyid_authenticated_flag == 'Yes') {
//               this.customerAuthenticatedFlag = true;
//               this.journeyidAuthFlagStatus = 'YES';
//             }

//             this.getIDsObj = {
//               journeyUniqueId: res?.journeyid_customer_uniqueid,
//               journeyExternalRef: res?.journeyid_session_externalref,
//               mobilephone: res?.mobilephone,
//             };

//             this.executionSessionExternalRef =
//               this.getIDsObj.journeyExternalRef;

//             // getting old ws events

//             // if (this.counter === 1) {
//             console.log('counter: ', this.counter);
//             console.log('calling getOldWebSocketDetails function ');

//             this.getOldWebSocketDetails();

//             // }

//             this.createJouneyBootstrapSession();
//             // console.log(
//             //   'unique id & ext ref to create bootstrap session',
//             //   this.getIDsObj
//             // );
//             this.getLookupDataFromAPI(this.customerUniqueID);
//           }
//         },
//         error: (err) => {
//           this.isLoading = false;
//           console.log(err);
//         },
//       });
//     }
//   }

//   getOldWebSocketDetails() {
//     console.warn('getOldWebSocketDetails called!!!');
//     this.websocket_Service.getWSPreviousData(
//       this.wsJCustID,
//       this.wsJSessionID,
//       `CONNECT ${this.jwtToken}`
//     );

//     // console.clear();

//     // console.log('ws user id: ', this.authRequestedData.user.id);
//     // console.log('ws session id: ', this.authRequestedData.session.id);

//     // console.log("Old websocket details")

//     this.websocket_Service.wsData.subscribe({
//       next: (response: any) => {
//         response = response;

//         // If execution created
//         if (response.event == 'execution-created') {
//           let type = response?.pipeline?.stages[0]?.type;

//           // create requestObject
//           this.requestObject = {
//             wsEvent: response,
//             exeID: {
//               execution_ID: response?.execution.id,
//             },
//             statusCSS: {
//               processLabelBGColor: '#90ee90',
//               processIconColor: '#089000',
//               processLabelColor: '#089000',
//             },
//           };

//           if (type === 'webauthn-authentication') {
//             this.requestObject.stausDetails = {
//               title: 'Device authentication Request ',
//               status: 'Authenticated',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };
//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'device-authentication') {
//             this.requestObject.stausDetails = {
//               title: 'App authentication Request ',
//               status: 'Authenticated',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'facial-authentication-3d') {
//             this.requestObject.stausDetails = {
//               title: 'Facial authentication Request',
//               status: 'Authenticated',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };
//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'document-signature') {
//             this.requestObject.stausDetails = {
//               title: 'Document  signature Request',
//               status: 'Completed',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'credit-card-payment') {
//             this.requestObject.stausDetails = {
//               title: 'Payment Request',
//               status: 'Completed',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'schedule') {
//             this.requestObject.stausDetails = {
//               title: 'Outbound Notification Request',
//               status: 'Completed',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'facial-enrollment') {
//             this.requestObject.stausDetails = {
//               title: 'Facial erollment Request',
//               status: 'Completed',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'webauthn-registration') {
//             this.requestObject.stausDetails = {
//               title: 'Device erollment Request',
//               status: 'Completed',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           } else if (type === 'mobile-app') {
//             this.requestObject.stausDetails = {
//               title: 'App erollment Request',
//               status: 'Completed',
//               mobno: this.wsJMobileNumber,
//               completedAt: response?.execution.completedAt,
//             };

//             // this.notificationAccordianArray.push(this.requestObject);
//           }
//         } else if (response.event == 'execution-completed') {
//           let flag: boolean = true;

//           for (let i = 0; i < this.accordianArray.length; i++) {
//             if (
//               this.accordianArray[i].wsEvent.execution.id ==
//               this.requestObject.wsEvent.execution.id
//             ) {
//               flag = false;
//               break;
//             }
//           }

//           if (flag) {
//             this.accordianArray.push(
//               Object.assign(response, this.requestObject)
//             );
//           }
//         }

//         // this.notificationAccordianArray.forEach((obj: any,index: number) => {
//         //   console.log(`Noti ${index} `,obj.exeID.execution_ID)
//         // });

//         // this.accordianArray.forEach((obj: any,index: number) => {
//         //   console.log(`Acc ${index} `,obj.exeID.execution_ID)
//         // });
//       },
//     });
//   }

//   getLookupDataFromAPI(customerUniqueID: any) {
//     this.httpService.getLookupCustomerData(customerUniqueID).subscribe({
//       next: (LookupData: any) => {
//         console.log('LookupData: ', LookupData);

//         this.deviceDetails = LookupData?.devices[0];
//         this.deviceID = this.deviceDetails?.id;
//         if (this.deviceDetails) {
//           this.isDevicePresentFlag = true;
//         }

//         console.log('device flag: ', this.isDevicePresentFlag);
//         console.log('device data: ', this.deviceDetails);
//         console.log('device id: ', this.deviceID);

//         this.lookUpDataFromAPI = LookupData?.enrollments;

//         this.lookUpDataFromAPI.filter((enroll: any) => {
//           this.lookUpEnrollArray = [...this.lookUpEnrollArray, enroll.type];
//         });

//         console.log('this.lookUpEnrollArray', this.lookUpEnrollArray);

//         this.enrollFacialFlag =
//           this.lookUpEnrollArray?.includes('facial-biometrics');
//         console.log('enrollFacialFlag', this.enrollFacialFlag);
//         this.enrollBiometricFlag = this.lookUpEnrollArray?.includes('webauthn');
//         console.log('enrollBiometricFlag', this.enrollBiometricFlag);
//         this.enrollMobileAppFlag =
//           this.lookUpEnrollArray?.includes('mobile-app');
//         console.log('enrollMobileAppFlag', this.enrollMobileAppFlag);

//         if (
//           this.enrollFacialFlag ||
//           this.enrollBiometricFlag ||
//           this.enrollMobileAppFlag
//         ) {
//           this.customerEnrolledFlag = true;
//         }
//       },
//       error: (err: any) => {
//         console.log('Lookup api error: ', err);
//       },
//     });
//   }

//   // Step 2: create Bootstrap Session

//   createJouneyBootstrapSession() {
//     // externalRef: this.executionSessionExternalRef,
//     let reqData = {
//       event: 'start-session',
//       session: {
//         externalRef: this.getIDsObj.journeyExternalRef,
//       },
//       user: {
//         phoneNumber: this.getIDsObj.mobilephone,
//         uniqueId: this.getIDsObj.journeyUniqueId,
//       },
//     };
//     this.executionSessionExternalRef = this.getIDsObj.journeyExternalRef;
//     console.warn('bootstrap start session req obj: ', reqData);

//     this.httpService.createBootstrapSession(reqData, this.jwtToken).subscribe({
//       next: (data: any) => {
//         this.bootstrapData = data;

//         console.log('get bootstrap data', this.bootstrapData);

//         this.sessionBootstrapData = data.user;
//         this.sessionBootstrapIsEnrolled = data.metadata.isEnrolled;

//         this.websocketConnData = {
//           user_ID: this.bootstrapData.user.id,
//           session_ID: this.bootstrapData.session.id,
//         };

//         console.log(
//           'createJouneyBootstrapSession- web socket data: ',
//           this.websocketConnData
//         );

//         // No name available

//         if (
//           (this.sessionBootstrapData.firstName &&
//             this.sessionBootstrapData.lastName &&
//             this.sessionBootstrapData.email) == ''
//         ) {
//           this.sessionBootstrapData = {
//             firstName: 'No name available',
//             phoneNumber: this.sessionBootstrapData.phoneNumber,
//           };

//           if (!this.sessionBootstrapIsEnrolled) {
//             this.RequestLabelName = 'Unenrolled';
//             this.customerEnrolledFlag = false;
//             // this.customerEnrolledStatus = 'Unenrolled';
//             this.customerEnrolledStatus = 'NO';
//           }

//           console.log('not name avail: ', this.sessionBootstrapData);
//         }

//         // this.createNewRequest();

//         if (this.sessionBootstrapIsEnrolled) {
//           this.alertBoxColor = '#fc6a03';
//           this.RequestIconColor = '#fc6a03';
//           this.customerEnrolledFlag = true;
//           this.RequestLabelName = 'Enrolled';
//           // this.customerEnrolledStatus = 'Enrolled';
//           this.customerEnrolledStatus = 'YES';
//           this.RequestLabelColor = '#fc6a03';
//         }

//         console.log(data);

//         // call session api
//         this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);

//         // this.widgetAPI.sendChatMessage('Thank you for sharing mobile number');
//         // this.widgetAPI.sendRichMediaMessage({ text: '  ' }, 'text', '');
//       },
//       error: (err: any) => {
//         console.log(err);
//       },
//     });
//   }

//   getLookupSessionDataFromAPI(sessionID: any) {
//     this.httpService.getLookupSessionOfCustomer(sessionID).subscribe({
//       next: (LookupData: any) => {
//         console.log('Session LookupData: ', LookupData);

//         this.sessionLookupData = LookupData;

//         let authPipelineKey =
//           this.sessionLookupData?.executions[0].pipeline.key;

//         console.log('authPipelineKey: ', authPipelineKey);

//         // console.log('stages: ', this.sessionLookupData?.executions);

//         this.stageArray = this.sessionLookupData?.executions;

//         for (let i = 0; i < this.stageArray.length; i++) {
//           // console.log('stage number: ', this.stageArray[i]);

//           if (this.stageArray[i].stages) {
//             console.log('stages Data: ', this.stageArray[i].stages);
//             if (
//               this.stageArray[i]?.stages[0]?.type === 'webauthn-authentication'
//             ) {
//               this.authBiometricFlag = true;
//             } else if (
//               this.stageArray[i]?.stages[0]?.type === 'device-authentication'
//             ) {
//               this.authMobileAppFlag = true;
//             } else if (
//               this.stageArray[i]?.stages[0]?.type === 'facial-authentication-3d'
//             ) {
//               this.authFacialFlag = true;
//             }
//           }
//         }
//       },

//       error: (err: any) => {
//         console.log('Lookup api error: ', err);
//       },
//     });
//   }

//   // Step 3: Making Pipeline (execution ) requests

//   sendFacialEnrollmentRequest() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a facial Enrollment request via ${this.sendRequestMode} to Enroll yourself.
//     //     Please complete the Enrollment process`
//     // );

//     console.log('bootstrap data', this.bootstrapData);
//     this.requestNotificationName = 'Facial erollment Request';
//     this.isCustomerSendReqForEnroll = true;
//     let pipelineKey = '7214289b-47d8-4313-970a-567f8c0b685f';

//     let reqPayload = this.createPayloadRequest(pipelineKey);

//     console.log('exe payload: ', reqPayload);

//     this.executeRequest(reqPayload);
//   }

//   sendFacialAuthRequest() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a facial authentication request via ${this.sendRequestMode} to Authenticate yourself.
//     //     Please complete the Authentication process`
//     // );

//     console.log('bootstrap data', this.bootstrapData);
//     this.requestNotificationName = 'Facial authentication Request';

//     // let pipelineKey = 'd73d7733-5450-46a3-a1c7-42bf06e09ea0';
//     let pipelineKey = 'dc2db844-c4a9-45fe-9316-44edd90b68dd';

//     let reqPayload = this.createPayloadRequest(pipelineKey);

//     // isCustomerSendReqForAuth only for auth, it will change only auth requests
//     this.isCustomerSendReqForAuth = true;
//     console.log('exe payload: ', reqPayload);

//     this.executeRequest(reqPayload);
//   }

//   // send biometric request

//   sendBiometricEnrollRequest() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a device Enrollment request via ${this.sendRequestMode} to Enroll yourself.
//     //       Please complete the Enrollment process`
//     // );

//     this.requestNotificationName = 'Device enrollment Request';

//     let pipelineKey = 'e96e40a4-0ed3-4ff2-bd93-49a9061522cc';
//     this.isCustomerSendReqForEnroll = true;
//     let reqPayload = this.createPayloadRequest(pipelineKey);

//     this.executeRequest(reqPayload);
//   }

//   sendBiometricAuthenticatoinRequest() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a device authentication request via ${this.sendRequestMode} to Authenticate yourself.
//     //     Please complete the Authentication process`
//     // );

//     this.requestNotificationName = 'Device authentication Request';
//     console.log('bootstrap data', this.bootstrapData);

//     let pipelineKey = '2eb2c038-6bdd-45ba-9eea-f97c3f17e138';
//     // isCustomerSendReqForAuth only for auth, it will change only auth requests
//     this.isCustomerSendReqForAuth = true;
//     let reqPayload = this.createPayloadRequest(pipelineKey);
//     console.log('exe payload: ', reqPayload);
//     this.executeRequest(reqPayload);
//   }

//   executeRequest(reqPayload: any) {
//     setTimeout(() => {
//       this.httpService
//         .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
//         .subscribe({
//           next: (data: any) => {
//             console.log('Execution data: ', data);
//             this.authRequestedData = data;
//             // url: 'https://secure.journeyid.io/s/Kd2BAgj';

//             if (this.authRequestedData?.url) {
//               console.log('sending QR url into chat');
//               // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
//             }

//             this.sendAuthRequestFlag = true;

//             // start mult acc req

//             this.requestObject = {
//               wsEvent: null,
//             };

//             this.requestObject.exeID = {
//               execution_ID: this.authRequestedData.id,
//             };

//             this.requestObject.statusCSS = {
//               processLabelBGColor: '#ffd580',
//               processIconColor: '#fc6a03',
//               processLabelColor: '#fc6a03',
//             };

//             this.requestObject.stausDetails = {
//               // title: 'Digital Signature Request 1',
//               title: this.requestNotificationName,
//               status: 'Requested',
//               // mobno: '+919146129322',
//               mobno: this.sessionBootstrapData?.phoneNumber,
//               completedAt: 'now',
//             };

//             this.accordianArray = [this.requestObject, ...this.accordianArray];

//             console.log('after added new request: ', this.accordianArray);

//             // step 4: Listening for Websocket events

//             console.log('connecting web socket ');

//             this.websocket_Service.connectWebSocket(
//               this.authRequestedData.user.id,
//               this.authRequestedData.session.id,
//               `CONNECT ${this.jwtToken}`
//             );

//             console.log('ws user id: ', this.authRequestedData.user.id);
//             console.log('ws session id: ', this.authRequestedData.session.id);

//             this.websocket_Service.message.subscribe({
//               next: (value: any) => {
//                 console.log('comp events: ', value);

//                 if (
//                   (value.type === 'close' || value.code === 1006) &&
//                   this.webSocketEvents?.event !== 'session-authenticated'
//                 ) {
//                   setTimeout(() => {
//                     this.websocket_Service.connectWebSocket(
//                       this.authRequestedData.user.id,
//                       this.authRequestedData.session.id,
//                       `CONNECT ${this.jwtToken}`
//                     );
//                   }, 3000);
//                 }

//                 this.webSocketEvents = value;
//                 this.statusOfRequest(
//                   this.webSocketEvents.event,
//                   this.webSocketEvents
//                 );
//               },
//             });
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//     }, 3000);
//   }

//   sdkEnroll() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a mobile app enrollment request via ${this.sendRequestMode} to Enroll yourself.
//     //     Please complete the Enrollment process`
//     // );

//     this.requestNotificationName = 'App enrollment Request';
//     let pipelineKey = '060284b0-68dd-4c02-9534-7688d967b193';
//     this.isCustomerSendReqForEnroll = true;
//     let reqPayload = this.createSDKPayload(pipelineKey);

//     setTimeout(() => {
//       this.httpService
//         .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
//         .subscribe({
//           next: (data: any) => {
//             console.log('Execution data: ', data);
//             this.authRequestedData = data;

//             this.sendAuthRequestFlag = true;

//             if (this.authRequestedData?.url) {
//               console.log('sending QR url into chat');
//               // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
//             }

//             // start mult acc req

//             this.requestObject = {
//               wsEvent: null,
//             };

//             this.requestObject.exeID = {
//               execution_ID: this.authRequestedData.id,
//             };

//             this.requestObject.statusCSS = {
//               processLabelBGColor: '#ffd580',
//               processIconColor: '#fc6a03',
//               processLabelColor: '#fc6a03',
//             };

//             this.requestObject.stausDetails = {
//               // title: 'Digital Signature Request 1',
//               title: this.requestNotificationName,
//               status: 'Requested',
//               // mobno: '+919146129322',
//               mobno: this.sessionBootstrapData?.phoneNumber,
//               completedAt: 'now',
//             };

//             this.accordianArray = [this.requestObject, ...this.accordianArray];

//             console.log('after added new request: ', this.accordianArray);

//             // ui change
//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';
//             // ui change end

//             // step 4: Listening for Websocket events

//             console.log('connecting web socket ');

//             this.websocket_Service.connectWebSocket(
//               this.authRequestedData.user.id,
//               this.authRequestedData?.session.id,
//               `CONNECT ${this.jwtToken}`
//             );

//             this.websocket_Service.message.subscribe({
//               next: (value: any) => {
//                 console.log('comp events: ', value);

//                 if (
//                   (value.type === 'close' || value.code === 1006) &&
//                   this.webSocketEvents?.event !== 'session-authenticated'
//                 ) {
//                   setTimeout(() => {
//                     this.websocket_Service.connectWebSocket(
//                       this.authRequestedData.user.id,
//                       this.authRequestedData.session.id,
//                       `CONNECT ${this.jwtToken}`
//                     );
//                   }, 3000);
//                 }

//                 this.webSocketEvents = value;

//                 this.statusOfRequest(
//                   this.webSocketEvents.event,
//                   this.webSocketEvents
//                 );
//               },
//             });
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//     }, 3000);
//   }

//   sdkAuthentication() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a mobile app authenticate request via ${this.sendRequestMode} to Authenticate yourself.
//     //     Please complete the Authentication process`
//     // );

//     this.requestNotificationName = 'App authentication Request';
//     let pipelineKey = '6871934e-a546-4d9b-910b-2b566df42376';
//     // isCustomerSendReqForAuth only for auth, it will change only auth requests
//     this.isCustomerSendReqForAuth = true;
//     let reqPayload = this.createSDKPayload(pipelineKey);

//     setTimeout(() => {
//       this.httpService
//         .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
//         .subscribe({
//           next: (data: any) => {
//             console.log('Execution data: ', data);
//             this.authRequestedData = data;
//             // this.addNewAccordianRequest(this.authRequestedData);
//             this.sendAuthRequestFlag = true;
//             if (this.authRequestedData?.url) {
//               console.log('sending QR url into chat');
//               // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
//             }

//             // start mult acc req

//             this.requestObject = {
//               wsEvent: null,
//             };

//             this.requestObject.exeID = {
//               execution_ID: this.authRequestedData.id,
//             };

//             this.requestObject.statusCSS = {
//               processLabelBGColor: '#ffd580',
//               processIconColor: '#fc6a03',
//               processLabelColor: '#fc6a03',
//             };

//             this.requestObject.stausDetails = {
//               // title: 'Digital Signature Request 1',
//               title: this.requestNotificationName,
//               status: 'Requested',
//               // mobno: '+919146129322',
//               mobno: this.sessionBootstrapData?.phoneNumber,
//               completedAt: 'now',
//             };

//             this.accordianArray = [this.requestObject, ...this.accordianArray];

//             console.log('after added new request: ', this.accordianArray);

//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';

//             // end mult ws

//             // ui change
//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';
//             // // ui change end

//             // step 4: Listening for Websocket events

//             console.log('connecting web socket ');

//             this.websocket_Service.connectWebSocket(
//               this.authRequestedData.user.id,
//               this.authRequestedData.session.id,
//               `CONNECT ${this.jwtToken}`
//             );

//             this.websocket_Service.message.subscribe({
//               next: (value: any) => {
//                 console.log('comp events: ', value);

//                 if (
//                   (value.type === 'close' || value.code === 1006) &&
//                   this.webSocketEvents?.event !== 'session-authenticated'
//                 ) {
//                   setTimeout(() => {
//                     this.websocket_Service.connectWebSocket(
//                       this.authRequestedData.user.id,
//                       this.authRequestedData.session.id,
//                       `CONNECT ${this.jwtToken}`
//                     );
//                   }, 3000);
//                 }

//                 this.webSocketEvents = value;

//                 this.statusOfRequest(
//                   this.webSocketEvents.event,
//                   this.webSocketEvents
//                 );
//               },
//             });
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//     }, 3000);
//   }

//   //  this.widgetAPI.sendChatMessage(
//   //     'I have shared a request via (SMS | Push Notification) to Authenticate yourself. Please complete the Authentication process'
//   //   );

//   setRequestType(requestType: String) {
//     if (requestType == 'SMS') {
//       this.sendSMSFlag = true;
//       this.sendEmailFlag = false;
//       this.sendPushNotificationFlag = false;
//       this.sendQRFlag = false;
//       this.sendRequestMode = 'sms';
//       console.log('SMS');
//     } else if (requestType == 'Push Notification') {
//       this.sendEmailFlag = false;
//       this.sendSMSFlag = false;
//       this.sendPushNotificationFlag = true;
//       this.sendQRFlag = false;
//       this.sendRequestMode = 'push-notification';
//       console.log('Push Notification');
//     } else if (requestType == 'QR') {
//       this.sendEmailFlag = false;
//       this.sendSMSFlag = false;
//       this.sendPushNotificationFlag = false;
//       this.sendQRFlag = true;
//       this.sendRequestMode = 'url';
//       console.log('QR');
//     } else if (requestType == 'Email') {
//       this.sendEmailFlag = true;
//       this.sendSMSFlag = false;
//       this.sendPushNotificationFlag = false;
//       this.sendQRFlag = false;
//       this.sendRequestMode = 'email';
//       console.log('Email');
//     }
//   }

//   sendSignatureRequest() {
//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a e-sign document request via ${this.sendRequestMode}.
//     //    Please complete the e-sign document process`
//     // );
//     this.requestNotificationName = 'Digital Signature Request';

//     let pipelineKey = 'cfcfb607-8fb0-4ec1-9f80-4288cc573afb';

//     let reqPayload = this.createPayloadRequest(pipelineKey);
//     console.log('Request Payload: ', reqPayload);
//     this.executeRequest(reqPayload);
//   }

//   sendPaymentRequest(description: any, amount: any, requestType: any) {
//     this.setRequestType(requestType);

//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a credit card payment request via  ${this.sendRequestMode}.
//     //    Please complete the payment process`
//     // );

//     this.requestNotificationName = 'Payment Request';

//     console.log(description.value, ' ', amount.value);
//     let reqPayload = this.createPaymentPayload(description.value, amount.value);
//     console.log('send payment req: ', reqPayload);

//     setTimeout(() => {
//       this.httpService
//         .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
//         .subscribe({
//           next: (data: any) => {
//             console.log('Execution data: ', data);

//             this.authRequestedData = data;
//             // this.addNewAccordianRequest(this.authRequestedData);
//             // this.addNewAccordianRequest(this.authRequestedData?.pipeline.title);
//             if (this.authRequestedData?.url) {
//               console.log('sending QR url into chat');
//               // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
//             }

//             this.sendAuthRequestFlag = true;

//             // start mult acc req

//             this.requestObject = {
//               wsEvent: null,
//             };

//             this.requestObject.exeID = {
//               execution_ID: this.authRequestedData.id,
//             };

//             this.requestObject.statusCSS = {
//               processLabelBGColor: '#ffd580',
//               processIconColor: '#fc6a03',
//               processLabelColor: '#fc6a03',
//             };

//             this.requestObject.stausDetails = {
//               // title: 'Digital Signature Request 1',
//               title: this.requestNotificationName,
//               status: 'Requested',
//               // mobno: '+919146129322',
//               mobno: this.sessionBootstrapData?.phoneNumber,
//               completedAt: 'now',
//             };

//             this.accordianArray = [this.requestObject, ...this.accordianArray];

//             console.log('after added new request: ', this.accordianArray);

//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';

//             // end mult ws

//             // ui change
//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';
//             // ui change end

//             // step 4: Listening for Websocket events

//             console.log('connecting web socket ');

//             this.websocket_Service.connectWebSocket(
//               this.authRequestedData.user.id,
//               this.authRequestedData.session.id,
//               `CONNECT ${this.jwtToken}`
//             );

//             this.websocket_Service.message.subscribe({
//               next: (value: any) => {
//                 console.log('comp events: ', value);

//                 if (
//                   (value.type === 'close' || value.code === 1006) &&
//                   this.webSocketEvents?.event !== 'session-authenticated'
//                 ) {
//                   setTimeout(() => {
//                     this.websocket_Service.connectWebSocket(
//                       this.authRequestedData.user.id,
//                       this.authRequestedData.session.id,
//                       `CONNECT ${this.jwtToken}`
//                     );
//                   }, 3000);
//                 }

//                 this.webSocketEvents = value;

//                 this.statusOfRequest(
//                   this.webSocketEvents.event,
//                   this.webSocketEvents
//                 );
//               },
//             });
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//     }, 3000);
//   }

//   sendOutboundNotificatoin(reason: any, requestType: any) {
//     this.setRequestType(requestType);

//     // this.widgetAPI.sendChatMessage(
//     //   `I have shared a outbound notification request via ${this.sendRequestMode}.
//     //    Please complete the process`
//     // );

//     let reference = reason.value;
//     this.requestNotificationName = 'Outbound Notification Request';
//     // console.log('outbound notification reason: ', reference);

//     let deliveryDetails;
//     if (this.sendPushNotificationFlag) {
//       deliveryDetails = {
//         // method: 'sms',
//         method: this.sendRequestMode,
//         deviceId: this.deviceID,
//       };
//     } else if (this.sendQRFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//       };
//     } else if (this.sendSMSFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//       };
//     } else if (this.sendEmailFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//         email: this.sessionBootstrapData?.email,
//       };
//     }
//     let reqPayload = {
//       pipelineKey: '03542a52-d33a-4b12-a17c-790ed881fd36',
//       user: {
//         id: this.bootstrapData.user.id,
//         uniqueId: this.bootstrapData.user.uniqueId,
//         email: this.bootstrapData.user.email,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//         firstName: this.bootstrapData.user.firstName,
//         middleName: this.bootstrapData.user.middleName,
//         lastName: this.bootstrapData.user.lastName,
//         devices: [],
//       },
//       session: {
//         id: null,
//         externalRef: this.executionSessionExternalRef,
//         isAuthenticated: this.bootstrapData.session.isAuthenticated,
//       },
//       delivery: deliveryDetails,

//       // {
//       //   method: 'sms',
//       //   phoneNumber: this.bootstrapData.user.phoneNumber,
//       // }
//       configuration: {
//         ['schedule']: {
//           ['reference']: reference,
//           ['options']: [
//             'now',
//             '15m',
//             '3h',
//             '2022-01-01T12:00:00Z',
//             '2022-01-01T17:30:00',
//           ],
//         },
//       },
//       language: 'en-US',
//     };

//     // console.log('bootstrap data', this.bootstrapData);
//     // this.createNewRequest();

//     // let reqPayload = this.createPayloadRequest(pipelineKey);
//     console.log('exe payload for outbound call: ', reqPayload);
//     // this.                   (reqPayload);

//     setTimeout(() => {
//       this.httpService
//         .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
//         .subscribe({
//           next: (data: any) => {
//             console.log('Execution data: ', data);
//             this.authRequestedData = data;
//             // this.addNewAccordianRequest(this.authRequestedData);
//             this.sendAuthRequestFlag = true;
//             if (this.authRequestedData?.url) {
//               console.log('sending QR url into chat');
//               // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
//             }

//             // start mult acc req

//             this.requestObject = {
//               wsEvent: null,
//             };

//             this.requestObject.exeID = {
//               execution_ID: this.authRequestedData.id,
//             };

//             this.requestObject.statusCSS = {
//               processLabelBGColor: '#ffd580',
//               processIconColor: '#fc6a03',
//               processLabelColor: '#fc6a03',
//             };

//             this.requestObject.stausDetails = {
//               // title: 'Digital Signature Request 1',
//               title: this.requestNotificationName,
//               status: 'Requested',
//               // mobno: '+919146129322',
//               mobno: this.sessionBootstrapData?.phoneNumber,
//               completedAt: 'now',
//             };

//             this.accordianArray = [this.requestObject, ...this.accordianArray];

//             console.log('after added new request: ', this.accordianArray);

//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';

//             // end mult ws

//             // ui change
//             // this.processLabelBGColor = '#ffd580';
//             // this.processLabelName = 'Requested';
//             // this.processIconColor = '#fc6a03';
//             // this.processLabelColor = '#fc6a03';
//             // ui change end

//             // step 4: Listening for Websocket events

//             console.log('connecting web socket ');

//             this.websocket_Service.connectWebSocket(
//               this.authRequestedData.user.id,
//               this.authRequestedData.session.id,
//               `CONNECT ${this.jwtToken}`
//             );

//             this.websocket_Service.message.subscribe({
//               next: (value: any) => {
//                 console.log('comp events: ', value);

//                 if (
//                   (value.type === 'close' || value.code === 1006) &&
//                   this.webSocketEvents?.event !== 'session-authenticated'
//                 ) {
//                   setTimeout(() => {
//                     this.websocket_Service.connectWebSocket(
//                       this.authRequestedData.user.id,
//                       this.authRequestedData.session.id,
//                       `CONNECT ${this.jwtToken}`
//                     );
//                   }, 3000);
//                 }

//                 // else {
//                 //   this.websocket_Service.closeWebSocket();
//                 // }

//                 this.webSocketEvents = value;
//                 this.statusOfRequest(
//                   this.webSocketEvents.event,
//                   this.webSocketEvents
//                 );
//               },
//             });
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//     }, 3000);
//   }

//   createPaymentPayload(Desc: any, Amount: any) {
//     let deliveryDetails;
//     if (this.sendPushNotificationFlag) {
//       deliveryDetails = {
//         // method: 'sms',
//         method: this.sendRequestMode,
//         deviceId: this.deviceID,
//       };
//     } else if (this.sendQRFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//       };
//     } else if (this.sendSMSFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//       };
//     } else if (this.sendEmailFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//         email: this.sessionBootstrapData?.email,
//       };
//     }

//     let reqPayload = {
//       pipelineKey: 'e117db4d-8742-4a03-bdc8-d58726a7cf67',

//       user: {
//         id: this.bootstrapData.user.id,
//         uniqueId: this.bootstrapData.user.uniqueId,
//         email: this.bootstrapData.user.email,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//         firstName: this.bootstrapData.user.firstName,
//         middleName: this.bootstrapData.user.middleName,
//         lastName: this.bootstrapData.user.lastName,
//         devices: [],
//         type: 'customer',
//       },
//       session: {
//         id: null,
//         // externalRef: this.bootstrapData.session.externalRef,
//         externalRef: this.executionSessionExternalRef,
//         isAuthenticated: this.bootstrapData.session.isAuthenticated,
//       },
//       delivery: deliveryDetails,

//       // {
//       //   method: 'sms',
//       //   phoneNumber: this.bootstrapData.user.phoneNumber,
//       // },
//       configuration: {
//         ['credit-card-payment']: {
//           details: {},
//           currency: 'USD',
//           lineItems: [
//             {
//               quantity: 1,
//               title: Desc,
//               amount: +Amount,
//             },
//           ],
//         },
//       },
//       language: 'en-US',
//     };

//     return reqPayload;
//   }

//   createSDKPayload(RequestPipelineKey: any) {
//     let deliveryDetails;
//     if (this.sendPushNotificationFlag) {
//       deliveryDetails = {
//         // method: 'sms',
//         method: this.sendRequestMode,
//         deviceId: this.deviceID,
//       };
//     } else if (this.sendQRFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//       };
//     } else if (this.sendSMSFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//       };
//     } else if (this.sendEmailFlag) {
//       deliveryDetails = {
//         method: this.sendRequestMode,
//         email: this.sessionBootstrapData?.email,
//       };
//     }

//     let reqPlayload = {
//       pipelineKey: RequestPipelineKey,
//       user: {
//         id: this.bootstrapData.user.id,
//         uniqueId: this.bootstrapData.user.uniqueId,
//         email: this.bootstrapData.user.email,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//         firstName: this.bootstrapData.user.firstName,
//         middleName: this.bootstrapData.user.middleName,
//         lastName: this.bootstrapData.user.lastName,
//         devices: [],
//         type: 'customer',
//       },
//       session: {
//         id: null,
//         // externalRef: this.bootstrapData.session.externalRef,
//         externalRef: this.executionSessionExternalRef,
//         isAuthenticated: this.bootstrapData.session.isAuthenticated,
//       },
//       delivery: deliveryDetails,
//       //  {
//       //   method: 'sms',
//       //   phoneNumber: this.bootstrapData.user.phoneNumber,
//       // }
//       configuration: {},
//       language: 'en-US',
//     };

//     return reqPlayload;
//   }

//   createPayloadRequest(RequestPipelineKey: any) {
//     let userDetails;
//     let deliveryDetails;

//     if (this.userNotFoundFlag) {
//       userDetails = {
//         id: null,
//         uniqueId: this.getIDsObj.journeyUniqueId,
//         email: '',
//         phoneNumber: this.getIDsObj.mobilephone,
//         firstName: '',
//         middleName: '',
//         lastName: '',
//         devices: [],
//       };

//       // deliveryDetails = {
//       //   method: 'sms',
//       //   phoneNumber: this.bootstrapData.user.phoneNumber,
//       // };

//       if (this.sendPushNotificationFlag) {
//         deliveryDetails = {
//           // method: 'sms',
//           method: this.sendRequestMode,
//           deviceId: this.deviceID,
//         };
//       } else if (this.sendQRFlag) {
//         deliveryDetails = {
//           method: this.sendRequestMode,
//         };
//       } else if (this.sendSMSFlag) {
//         deliveryDetails = {
//           method: this.sendRequestMode,
//           phoneNumber: this.bootstrapData.user.phoneNumber,
//         };
//       } else if (this.sendEmailFlag) {
//         deliveryDetails = {
//           method: this.sendRequestMode,
//           email: this.sessionBootstrapData?.email,
//         };
//       }
//     } else {
//       userDetails = {
//         id: this.bootstrapData.user.id,
//         uniqueId: this.bootstrapData.user.uniqueId,
//         email: this.bootstrapData.user.email,
//         phoneNumber: this.bootstrapData.user.phoneNumber,
//         firstName: this.bootstrapData.user.firstName,
//         middleName: this.bootstrapData.user.middleName,
//         lastName: this.bootstrapData.user.lastName,
//         devices: [],
//       };

//       if (this.sendPushNotificationFlag) {
//         deliveryDetails = {
//           // method: 'sms',
//           method: this.sendRequestMode,
//           deviceId: this.deviceID,
//         };
//       } else if (this.sendQRFlag) {
//         deliveryDetails = {
//           method: this.sendRequestMode,
//         };
//       } else if (this.sendSMSFlag) {
//         deliveryDetails = {
//           method: this.sendRequestMode,
//           phoneNumber: this.bootstrapData.user.phoneNumber,
//         };
//       } else if (this.sendEmailFlag) {
//         deliveryDetails = {
//           method: this.sendRequestMode,
//           email: this.sessionBootstrapData?.email,
//         };
//       }
//     }
//     let reqPayload = {
//       pipelineKey: RequestPipelineKey,
//       user: userDetails,
//       session: {
//         id: null,
//         externalRef: this.executionSessionExternalRef,
//         isAuthenticated: this.bootstrapData.session.isAuthenticated,
//       },
//       delivery: deliveryDetails,
//       configuration: {},
//       language: 'en-US',
//     };

//     console.log('exe payload: ', reqPayload);

//     return reqPayload;
//   }

//   // accordianIndex: any;
//   // cssStatus: any;

//   test(i: any) {
//     console.log(i, this.accordianArray[i]);
//   }

//   statusOfRequest(events: any, allEventData: any) {
//     this.accordianIndex = this.accordianArray.findIndex(
//       (x) => x?.exeID.execution_ID === allEventData?.execution?.id
//     );

//     if (this.accordianArray?.[this.accordianIndex]) {
//       this.accordianArray[this.accordianIndex].wsEvent = { ...allEventData };
//     }

//     console.log('acc index: ', this.accordianArray[this.accordianIndex]);

//     switch (events) {
//       case 'execution-created':
//         // ui change

//         this.processLabelBGColor = '#ffd580';
//         this.processLabelName = 'Requested';
//         this.processIconColor = '#fc6a03';
//         this.processLabelColor = '#fc6a03';

//         // ui change end
//         break;
//       case 'execution-started':
//         // ui change

//         // this.alertBoxColor = '#fc6a03';
//         // this.RequestIconColor = '#fc6a03';
//         // this.processLabelBGColor = '#b0e0e6';
//         // this.processLabelName = 'Started';
//         // this.processIconColor = '#00bfff';
//         // this.processLabelColor = '#00bfff';
//         // this.RequestLabelName = 'Enrolled';
//         // this.RequestLabelColor = '#fc6a03';

//         // ui change end

//         if (this.accordianArray?.[this.accordianIndex]) {
//           this.accordianArray[this.accordianIndex].stausDetails = {
//             status: 'Started',
//             title: this.requestNotificationName,

//             // mobno: '+919146129322',
//             mobno: this.sessionBootstrapData?.phoneNumber,
//             completedAt: 'now',
//           };

//           this.accordianArray[this.accordianIndex].statusCSS = {
//             processLabelBGColor: '#b0e0e6',
//             processIconColor: '#00bfff',
//             processLabelColor: '#00bfff',
//           };
//         }

//         console.log('after added new request: ', this.accordianArray);

//         break;
//       case 'execution-progress':
//         // ui change
//         // this.alertBoxColor = '#fc6a03';
//         // this.RequestIconColor = '#fc6a03';
//         // this.processLabelBGColor = '#b0e0e6';
//         // this.processLabelName = 'Started';
//         // this.processIconColor = '#00bfff';
//         // this.processLabelColor = '#00bfff';
//         // this.RequestLabelName = 'Enrolled';
//         // this.RequestLabelColor = '#fc6a03';

//         // ui change end

//         if (this.accordianArray?.[this.accordianIndex]) {
//           this.accordianArray[this.accordianIndex].stausDetails = {
//             status: 'Started',
//             title: this.requestNotificationName,

//             // mobno: '+919146129322',
//             mobno: this.sessionBootstrapData?.phoneNumber,
//             completedAt: 'now',
//           };

//           this.accordianArray[this.accordianIndex].statusCSS = {
//             processLabelBGColor: '#b0e0e6',
//             processIconColor: '#00bfff',
//             processLabelColor: '#00bfff',
//           };
//         }

//         break;
//       case 'execution-completed':
//         // ui change
//         this.alertBoxColor = '#089000';
//         this.RequestIconColor = '#089000';
//         this.processLabelBGColor = '#90ee90';
//         this.processLabelName = 'Completed';
//         this.processIconColor = '#089000';
//         this.processLabelColor = '#089000';
//         this.RequestLabelName = 'Authenticated';
//         this.RequestLabelColor = '#089000';

//         // this.customerAuthenticatedFlag = true;

//         if (this.isCustomerSendReqForAuth) {
//           this.customerAuthenticatedFlag = true;
//         }

//         if (this.isCustomerSendReqForEnroll) {
//           this.customerEnrolledFlag = true;
//         }

//         if (this.accordianArray?.[this.accordianIndex]) {
//           this.accordianArray[this.accordianIndex].stausDetails = {
//             status: 'Completed',
//             title: this.requestNotificationName,

//             // mobno: '+919146129322',
//             mobno: this.sessionBootstrapData?.phoneNumber,
//             completedAt: 'now',
//           };

//           this.accordianArray[this.accordianIndex].statusCSS = {
//             processLabelBGColor: '#90ee90',
//             processIconColor: '#089000',
//             processLabelColor: '#089000',
//           };
//         }

//         this.getMongoDBResponse(this.mobileNumber);
//         this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);
//         this.getLookupDataFromAPI(this.customerUniqueID);

//         // ui change end
//         break;
//       case 'session-authenticated':
//         // ui change
//         // this.alertBoxColor = '#089000';
//         // this.RequestIconColor = '#089000';
//         // this.processLabelBGColor = '#90ee90';
//         // this.processLabelName = 'Completed';
//         // this.processIconColor = '#089000';
//         // this.processLabelColor = '#089000';
//         // this.RequestLabelName = 'Authenticated';
//         // this.RequestLabelColor = '#089000';

//         if (this.isCustomerSendReqForAuth) {
//           this.customerAuthenticatedFlag = true;
//         }

//         if (this.isCustomerSendReqForEnroll) {
//           this.customerEnrolledFlag = true;
//         }

//         this.accordianArray[this.accordianIndex].stausDetails = {
//           status: 'Authenticated',
//           title: this.requestNotificationName,

//           // mobno: '+919146129322',
//           mobno: this.sessionBootstrapData?.phoneNumber,
//           completedAt: 'now',
//         };

//         this.accordianArray[this.accordianIndex].statusCSS = {
//           processLabelBGColor: '#90ee90',
//           processIconColor: '#089000',
//           processLabelColor: '#089000',
//         };
//         // this.widgetAPI.sendChatMessage('Session Process completed');
//         // this.widgetAPI.sendRichMediaMessage({ text: '  ' }, 'text', '');

//         console.log('end counter: ', this.counter);

//         this.getMongoDBResponse(this.mobileNumber);
//         this.getLookupDataFromAPI(this.customerUniqueID);
//         this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);

//         // this.widgetAPI.sendChatMessage('Session Process completed');
//         // this.widgetAPI.sendRichMediaMessage({ text: '  ' }, 'text', '');

//         // ui change end
//         break;
//       default:
//         // ui change
//         // this.processLabelBGColor = '#ffd580';
//         // this.processLabelName = 'Requested';
//         // this.processIconColor = '#fc6a03';
//         // this.processLabelColor = '#fc6a03';
//         // ui change end
//         break;
//     }
//   }

//   openTestModal(Modal: any, reqName: any) {
//     this.requestName = reqName;

//     console.log('Reqeust name: ', this.requestName);

//     this.modalService.open(Modal, { centered: true, windowClass: 'reqModal' });
//   }

//   callFunctionArray(funcName: any) {
//     this.setRequestType(funcName);
//     console.log(this.requestName);

//     if (this.requestName == 'sendFacialEnrollmentRequest') {
//       console.log('sendFacialEnrollmentRequest');
//       this.sendFacialEnrollmentRequest();
//     } else if (this.requestName == 'sendFacialAuthRequest') {
//       this.sendFacialAuthRequest();
//       console.log('sendFacialEnrollmentRequest');
//     } else if (this.requestName == 'sendBiometricEnrollRequest') {
//       this.sendBiometricEnrollRequest();
//       console.log('sendBiometricEnrollRequest');
//     } else if (this.requestName == 'sendBiometricAuthenticatoinRequest') {
//       this.sendBiometricAuthenticatoinRequest();
//       console.log('sendBiometricAuthenticatoinRequest');
//     } else if (this.requestName == 'sdkEnroll') {
//       this.sdkEnroll();
//       console.log('sdkEnroll');
//     } else if (this.requestName == 'sdkAuthentication') {
//       this.sdkAuthentication();
//       console.log('sdkAuthentication');
//     } else if (this.requestName == 'sendSignatureRequest') {
//       this.sendSignatureRequest();
//       console.log('sendSignatureRequest');
//     }
//   }

//   openCreditCardPaymentModal(PaymentModal: any) {
//     this.modalService.open(PaymentModal, {
//       centered: true,
//       windowClass: 'payModal',
//     });
//   }

//   openOutboundNotificationModal(outboundNotificationModal: any) {
//     this.modalService.open(outboundNotificationModal, {
//       centered: true,
//       windowClass: 'outboundNotificationModal',
//     });
//   }
// }

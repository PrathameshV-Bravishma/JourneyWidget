import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { JourneyHttpService } from "../services/journey-http.service";

import { WebSocketService } from "../services/websocket.service";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { reduce } from "rxjs";

// Style
const style = `
html {
  -webkit-text-size-adjust: none;
  min-height: 100%;
  height: 100%;
}
body {
  overflow-x: hidden;
  background: #fff;
  font-family: "Roboto", sans-serif;
  height: 100%;
  font-size: 14px;
}
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
form,
input,
textarea,
select {
  margin: 0;
  padding: 0;
}
img {
  border: 0;
}
a {
  text-decoration: none;
  outline: none !important;
  outline-color: transparent !important;
}
a:link,
a:hover {
  text-decoration: none;
  -moz-transition: all 1s ease-in;
  -webkit-transition: all 1s ease-in;
  -o-transition: all 1s ease-in;
  transition: all 1s ease-in;
}

.container {
  max-width: 1250px;
}

::ng-deep .reqModal .modal-content {
  height: 120px !important;
  border-radius: 0 !important;
}

::ng-deep .payModal .modal-content {
  height: 300px !important;
  border-radius: 0 !important;
}

::ng-deep .outboundNotificationModal .modal-content {
  /* height: 230px !important; */
  height: 270px !important;

  border-radius: 0 !important;
}

/*===Profile CSS ====== */
.profile-bg {
  background: url("../../assets/images/progile-bg.jpg") left top;
  background-size: cover;
}
.d-table-div {
  display: table;
  vertical-align: middle;
  width: 100%;
  height: 100%;
}
.d-table-cell-div {
  display: table-cell;
  vertical-align: middle;
}
.whitebox {
  background: #fff;
  height: 100%;
  margin: 0 auto;
}
/*.left-bg { background: url(../images/left-bg.png) no-repeat left top; background-size:inherit;}*/
.photo-box {
  background: linear-gradient(
    101.91deg,
    #ff0000 -10.89%,
    #ff0844 48.74%,
    #ff6060 96.65%,
    #ffb199 127.16%
  );
}
.right-bg {
  background: url("../../assets/images/right-bg.png") no-repeat left top;
  background-size: cover;
}
.boder-right {
  border-right: solid 1px #c5c5c5;
}
.photo-box {
  display: block;
  text-align: center;
}
.photo {
  background: #ececec;
  padding: 15px;
  width: 70px;
  float: left;
  height: 70px;
  margin: 0 auto; /*-webkit-box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.75); */
}
.pro-details {
  margin-left: 105px;
  display: block;
  text-align: left;
}
.pro-details a {
  color: #fff;
  margin-top: 4px;
  font-size: 14px;
  display: block;
}
.smalltext {
  font-size: 16px;
  color: #505050;
}
.name {
  font-size: 22px;
  color: #fff;
}
.greenbg {
  background: #f0ffe8;
}
.yellowbg {
  background: #ffffd8;
}
.orangebg {
  background: #fff4e1;
}
.redbg {
  background: #ffe8e8;
}
.icons {
  border-radius: 50%;
  width: 75px;
  height: 75px;
  margin: 0 auto 10px;
  border: solid 3px #eaeaea;
}
.iconbox {
  text-align: center;
  margin-top: 30px;
}
.icontext {
  font-size: 14px;
  line-height: 18px;
}
.btn-style {
  border: solid 1px #509cf7;
  display: block;
  padding: 6px 10px;
  font-weight: 600;
  color: #509cf7;
  margin-top: 10px;
  font-size: 12px;
  border-radius: 2px;
}
.btn-style img {
  margin-right: 10px;
}
.textlink {
  color: #551867;
  text-decoration: underline;
}


@media (min-width: 768px) {
  /*==Header CSS== */
  .pro-details a {
    margin-top: 7px;
    font-size: 16px;
  }
}

.accordion-button {
  padding: 10px 15px;
  background: #f7f8ff;
  color: #000000;
  font-size: 16px;
}
.accordion-button:not(.collapsed) {
  background: #e8eaf7;
  color: #000000;
}
.accordion-item {
  margin-bottom: 8px;
  box-shadow: 1px 2px 0px 0px rgba(176, 176, 176, 0.1);
}
.accordion-item:first-of-type .accordion-button,
.accordion-item:first-of-type {
  border-radius: 0px;
}
.accordion-button:focus {
  box-shadow: inherit;
}
.accordion-body {
  padding: 10px 15px;
  font-size: 13px;
  color: #868686;
  line-height: 18px;
}
`;

@Component({
  selector: "app-optimized-code",
  templateUrl: "./optimized-code.component.html",
    styles: [style],
  encapsulation: ViewEncapsulation.Emulated,
})
export class OptimizedCodeComponent implements OnInit {

  sessionBootstrapData: any;
  executionSessionExternalRef: any;
  bootstrapData: any;
  authRequestedData: any;
  jwtToken: any;
  getIDsObj: any;
  webSocketEvents: any;
  counter = 0;
  isLoading: boolean = false;
  lookUpEnrollArray: any[] = [];
  widgetAPI: any;
  interactionId!: string;
  interaction: any;
  configuration: any;
  mobileNumber: string = "+919890945819";

  agentName: any;
  userNotFoundFlag = false;
  customerEnrolledFlag = false;
  isCustomerSendReqForEnroll = false;
  customerAuthenticatedFlag: any;
  isCustomerSendReqForAuth = false;
  customerUniqueID: any;

  // ********* Send req through qr code, push notification *********

  deviceID: any;
  isDevicePresentFlag = false;
  requestName!: any;
  functionNameArray: string[] = ["SMS", "Push Notification", "QR", "Email"];
  accordionArray: any;
  sendRequestMode: any;
  
  ////////////////////////////////////////////////////////////// WS Objects

  wsJOldData: any;
  wsJMobileNumber: any;
  
  ////////////////////////////////////////////////////////////// Auth and Enroll instances
  
  enrollFacialFlag = false;
  enrollBiometricFlag = false;
  enrollMobileAppFlag = false;
  authFacialFlag = false;
  authBiometricFlag = false;
  authMobileAppFlag = false;

  ////////////////////////////////////////////////////////////// Color Objects

  blueColorObject: any =  {
    processLabelBGColor: "#DBEAFE",
    processIconColor: "#1E40AF",
    processLabelColor: "#1E40AF",
  }

  yellowColorObject: any = {
    processLabelBGColor: "#FEF9C3",
    processIconColor: "#854D0E",
    processLabelColor: "#854D0E",
  }

  greenColorObject: any = {
    processLabelBGColor: "#DCFCE7",
    processIconColor: "#166534",
    processLabelColor: "#166534",
  } 

  constructor(
    private httpService: JourneyHttpService,
    private websocket_Service: WebSocketService,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef
  ) {
    // this.interactionId =
    // this.element.nativeElement.getAttribute('interactionid');
    // this.widgetAPI = (<any>window).WS.widgetAPI(this.interactionId);
  }
  ngOnInit(): void {
    this.counter = 0;
    this.tokenFlagStartSession();

    // this.widgetAPI.onDataEvent('onInteractionEvent', (interaction: any) => {
    //   this.mobileNumber = interaction?.intrinsics.CALLER_NUMBER;
    //   this.getMongoDBResponse(this.mobileNumber);
    //   this.agentName = interaction?.destinationAddress;
    //   this.agentName = this.agentName?.split('@')[0];
    //   this.changeDetectorRef.detectChanges();
    // });

    // this.widgetAPI.onDataEvent('onMediaMessageEvent', (mediaMessage: any) => {
    //   // Here mediaMessage?body.text is mobile number
    //   this.mobileNumber = mediaMessage?.body.text;
    //   this.mobileNumber?.includes('+') ? this.getMongoDBResponse(this.mobileNumber) : null
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  tokenFlagStartSession() {
    this.accordionArray = [];
    this.jwtToken = this.httpService.signToken(this.agentName);
    this.enrollFacialFlag = this.enrollBiometricFlag = this.enrollMobileAppFlag = this.authFacialFlag = this.authBiometricFlag = this.authMobileAppFlag = false;
  }

  // Get mongodb response to create bootstrap session
  getMongoDBResponse(mobileNo: any) {
    ++this.counter;

    this.isLoading = true;
    this.lookUpEnrollArray = [];

    // If counter is 1 make flags false
    if (this.counter === 1) {
      this.enrollFacialFlag = this.enrollBiometricFlag = this.enrollMobileAppFlag = this.authFacialFlag = this.authBiometricFlag = this.authMobileAppFlag = false;
    }

    // If mobileNo has '+' execute if statement
    if (mobileNo?.includes("+")) {
      this.httpService.getMongodbResponse(mobileNo).pipe(reduce((acc: any,currentData: any) => acc = currentData.documents[0],[])).subscribe({
        next: (response: any) => {
          console.log("Get Mongodb Response: ",response)
          this.isLoading = false;

          // If response is undefined
          if (!response) {
            this.userNotFoundFlag = true;

            this.getIDsObj = this.createIDsObject(mobileNo.split("+")[1],null,mobileNo);

            this.createJourneyBootstrapSession();
            this.getLookupDataFromAPI(mobileNo.split("+")[1]);
          } else {
            this.userNotFoundFlag = false;

            //  open old web socket
            this.wsJMobileNumber = response?.mobilephone;

            this.customerUniqueID = response?.journeyid_customer_uniqueid;

            this.customerAuthenticatedFlag = response?.journeyid_authenticated == "No" ? false : true;

            this.getIDsObj = this.createIDsObject(response?.journeyid_customer_uniqueid,response?.journeyid_session_externalref,response?.mobilephon);

            this.executionSessionExternalRef =
              this.getIDsObj.journeyExternalRef;

            this.getOldWebSocketDetails(response?.journeyid_customerid,response?.journeyid_session_id);
            this.createJourneyBootstrapSession();
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

  // Step 1

  getOldWebSocketDetails(wsJCustomerID: any,wsJSessionID: any ) {
    this.websocket_Service.getWSPreviousData(
      wsJCustomerID,
      wsJSessionID,
      `CONNECT ${this.jwtToken}`
    );

    // Request object
    let requestObject: any = {};
    
    setTimeout(() => {
      this.websocket_Service.wsData.subscribe({
        next: (response: any) => {

          // If execution created
          if (response.event == "execution-created") {
            let type = response?.pipeline?.stages[0]?.type;

            // create requestObject
            requestObject = {
              wsEvent: response,
              exeID: {
                execution_ID: response?.execution.id,
              },
              statusCSS: this.greenColorObject,
              delivery: response?.delivery,
            };

            requestObject.statusDetails = {
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
                ...(type === "webauthn-authentication" && {title: "Device authentication Request", status: "Authenticated"}),
                ...(type === "device-authentication" && {title: "Device authentication Request", status: "Authenticated"}),
                ...(type === "facial-authentication-3d" && {title: "Facial authentication Request", status: "Authenticated"}),
                ...(type === "document-signature" && {title: "Document signature Request", status: "Completed"}),
                ...(type === "credit-card-payment" && {title: "Payment Request", status: "Completed"}),
                ...(type === "schedule" && {title: "Outbound Notification Request", status: "Completed"}),
                ...(type === "facial-enrollment" && {title: "Facial enrollment Request", status: "Completed"}),
                ...(type === "webauthn-registration" && {title: "Device enrollment Request", status: "Completed"}),
                ...(type === "mobile-app" && {title: "Facial enrollment Request", status: "Completed"}),
            }

          // If event is execution-completed add it in accordionArray also avoid's adding duplicate data
          } else if (response.event == "execution-completed") {
            let flag: boolean = true;
            for (let i = 0; i < this.accordionArray.length; i++) {
              if (
                this.accordionArray[i].wsEvent.execution.id ==
                requestObject.wsEvent.execution.id
              ) {
                flag = false;
                break;
              }
            }

            flag ? (
              this.accordionArray.push(Object.assign(response, requestObject)),
              this.accordionArray.reverse()
            ) : null
          }
        }, error: (error: any) => {
          console.log("Old data ws error: ",error);
        }
      });
    }, 3000);
  }

  // Step 2

  createJourneyBootstrapSession() {
    let reqData = {
      event: "start-session",
      session: {
        externalRef: this.getIDsObj.journeyExternalRef,
      },
      user: {
        phoneNumber: this.getIDsObj.mobilephone,
        uniqueId: this.getIDsObj.journeyUniqueId,
      },
    };
    this.executionSessionExternalRef = this.getIDsObj.journeyExternalRef;

    this.httpService.createBootstrapSession(reqData, this.jwtToken).subscribe({
      next: (data: any) => {

        console.log("Bootstrap session obj: ", data);
        this.bootstrapData = data;

        this.sessionBootstrapData = data.user;  

        if (
          (this.sessionBootstrapData.firstName &&
            this.sessionBootstrapData.lastName &&
            this.sessionBootstrapData.email) == ""
        ) {
          this.sessionBootstrapData = {
            firstName: "No name available",
            phoneNumber: this.sessionBootstrapData.phoneNumber,
          };

            this.customerEnrolledFlag = data.metadata.isEnrolled;
        }

        this.customerEnrolledFlag = data.metadata.isEnrolled;

        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // Step 3

  
  getLookupDataFromAPI(customerUniqueID: any) {
    this.httpService.getLookupCustomerData(customerUniqueID).subscribe({
      next: (lookupData: any) => {

        console.log("Lookup data: ",lookupData)
        this.deviceID = lookupData?.devices[0]?.id;
        lookupData?.devices[0] ? this.isDevicePresentFlag = true : null

        this.lookUpEnrollArray = lookupData?.enrollments.reduce((enrollmentArr: string[],enrollment: {type: string}) => [...enrollmentArr,enrollment.type],[]);

        // Check whether these flags are available
        this.lookUpEnrollArray.forEach((enrollType: string) => {
          enrollType === "face-biometrics" ? this.enrollFacialFlag = true : null
          enrollType === "webauthn" ? this.enrollBiometricFlag = true : null
          enrollType === "mobile-app" ? this.enrollMobileAppFlag = true : null
        });

        // I f user is enrolled Facially, by biometrics or by mobile them customer is enrolled
        (this.enrollFacialFlag || this.enrollBiometricFlag || this.enrollMobileAppFlag) ? this.customerEnrolledFlag = true : null;
      },
      error: (err: any) => {
        console.log("Lookup api error: ", err);
      },
    });
  }

  // Step 2: create Bootstrap Session

  getLookupSessionDataFromAPI(sessionID: any) {
    this.httpService.getLookupSessionOfCustomer(sessionID).subscribe({
      next: (lookupData: any) => {
        let stageArray = lookupData?.executions;

        stageArray.forEach((stageData: any) => {
          if(stageData.stages) {
            stageData.stages[0]?.type === "webauthn-authentication" ? this.authBiometricFlag = true : null;
            stageData.stages[0]?.type === "device-authentication" ? this.authMobileAppFlag = true : null;
            stageData.stages[0]?.type === "face-authentication" ? this.authFacialFlag = true : null;
            this.changeDetectorRef.detectChanges();
          }
        })
      },

      error: (err: any) => {
        console.log("Lookup api error: ", err);
      },
    });
  }

  sendFacialEnrollmentRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a facial Enrollment request via ${this.sendRequestMode} to Enroll yourself.
    //     Please complete the Enrollment process`
    // );

    this.isCustomerSendReqForEnroll = true;
    let reqPayload = this.createPayloadRequest(
      "7214289b-47d8-4313-970a-567f8c0b685f"
    );

    this.executeRequest(reqPayload,"Facial enrollment Request");
  }

  sendFacialAuthRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a facial authentication request via ${this.sendRequestMode} to Authenticate yourself.
    //     Please complete the Authentication process`
    // );

    let reqPayload = this.createPayloadRequest(
      "dc2db844-c4a9-45fe-9316-44edd90b68dd"
    );

    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;

    this.executeRequest(reqPayload,"Facial authentication Request");
  }

  // send biometric request

  sendBiometricEnrollRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a device Enrollment request via ${this.sendRequestMode} to Enroll yourself.
    //       Please complete the Enrollment process`
    // );


    this.isCustomerSendReqForEnroll = true;
    let reqPayload = this.createPayloadRequest(
      "e96e40a4-0ed3-4ff2-bd93-49a9061522cc"
    );

    this.executeRequest(reqPayload,"Device enrollment Request");
  }

  sendBiometricAuthenticationRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a device authentication request via ${this.sendRequestMode} to Authenticate yourself.
    //     Please complete the Authentication process`
    // );


    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    let reqPayload = this.createPayloadRequest(
      "2eb2c038-6bdd-45ba-9eea-f97c3f17e138"
    );
    this.executeRequest(reqPayload,"Device authentication Request");
  }

  executeRequest(reqPayload: any,title: string) {
    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            this.authRequestedData = { ...data };
            // url: 'https://secure.journeyid.io/s/Kd2BAgj';

            if (this.authRequestedData?.url) {
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            this.accordionArray = [this.createRequestObject(this.authRequestedData.id,title), ...this.accordionArray];
            this.changeDetectorRef.detectChanges();

            // step 4: Listening for Websocket events

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.subscribeMessageObservable()
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

    this.isCustomerSendReqForEnroll = true;
    let reqPayload = this.createSDKPayload(
      "060284b0-68dd-4c02-9534-7688d967b193"
    );

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            this.authRequestedData = data;
            if (this.authRequestedData?.url) {
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            this.accordionArray = [this.createRequestObject(this.authRequestedData.id,"App enrollment Request"), ...this.accordionArray];

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData?.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.subscribeMessageObservable()
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

    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    let reqPayload = this.createSDKPayload(
      "6871934e-a546-4d9b-910b-2b566df42376"
    );

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            this.authRequestedData = data;
            if (this.authRequestedData?.url) {
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            this.accordionArray = [this.createRequestObject(this.authRequestedData.id,"App authentication Request"), ...this.accordionArray];

            // Create instance of websocket
            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.subscribeMessageObservable();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  sendSignatureRequest() {
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a e-sign document request via ${this.sendRequestMode}.
    //    Please complete the e-sign document process`
    // );

    let reqPayload = this.createPayloadRequest(
      "cfcfb607-8fb0-4ec1-9f80-4288cc573afb"
    );
    this.executeSignatureRequest(reqPayload);
  }

  executeSignatureRequest(reqPayload: any) {
    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            console.log("Data: ",data);
            this.authRequestedData = data;
            // url: 'https://secure.journeyid.io/s/Kd2BAgj';

            if (this.authRequestedData?.url) {
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }
            this.accordionArray = [this.createRequestObject(this.authRequestedData.id,"Digital Signature Request"), ...this.accordionArray];

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.subscribeMessageObservable();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  sendPaymentRequest(description: any, amount: any, requestType: any) {
    this.setRequestFlag(requestType);

    // this.widgetAPI.sendChatMessage(
    //   `I have shared a credit card payment request via  ${this.sendRequestMode}.
    //    Please complete the payment process`
    // );

    let reqPayload = this.createPaymentPayload(description.value, amount.value);

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {

            this.authRequestedData = data;

            if (this.authRequestedData?.url) {
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            this.accordionArray = [this.createRequestObject(this.authRequestedData.id,"Payment Request"), ...this.accordionArray]

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.subscribeMessageObservable()

          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  outboundNotificationFlag = false;

  sendOutboundNotification(reason: any, requestType: any) {
    this.setRequestFlag(requestType);
    // this.widgetAPI.sendChatMessage(
    //   `I have shared a outbound notification request via ${this.sendRequestMode}.
    //    Please complete the process`
    // );
  
    let configuration = {
      ["schedule"]: {
        ["reference"]: reason.value,
        ["options"]: [
          "now",
          "15m",
          "3h",
          "2022-01-01T12:00:00Z",
          "2022-01-01T17:30:00",
        ],
      },
    }
    
    let reqPayload = {
      pipelineKey: "03542a52-d33a-4b12-a17c-790ed881fd36",
      user: this.createUserObject(),
      session: this.getSessionObject(),
      delivery: this.createDeliveryObjectForPayload(),
      configuration: configuration,
      language: "en-US",
    }

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (response: any) => {
            this.authRequestedData = response;
            if (this.authRequestedData?.url) {
              // this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            this.accordionArray = [this.createRequestObject(this.authRequestedData.id,"Outbound Notification Request"), ...this.accordionArray];
            this.outboundNotificationFlag = true;

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.subscribeMessageObservable();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  subscribeMessageObservable() {

    this.websocket_Service.message.subscribe({
      next: (value: any) => {

        console.log("Value:",value);

        if (
          (value.type === "close" || value.code === 1006) &&
          this.webSocketEvents?.event !== "execution-completed"
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
  }

  // Create payment payload
  createPaymentPayload(Desc: any, Amount: any) {

    let configuration = {
      ["credit-card-payment"]: {
        details: {},
        currency: "USD",
        lineItems: [
          {
            quantity: 1,
            title: Desc,
            amount: +Amount,
          },
        ],
      },
    }

    let reqPayload = {
      pipelineKey: "e117db4d-8742-4a03-bdc8-d58726a7cf67",
      user:  Object.assign(this.createUserObject(),{type: "customer"}),
      session: this.getSessionObject(),
      delivery: this.createDeliveryObjectForPayload(),
      configuration: configuration,
      language: "en-US",
    };

    return reqPayload;
  }

  // Create sdk payload
  createSDKPayload(RequestPipelineKey: any) {

    let reqPayload = {
      pipelineKey: RequestPipelineKey,
      user: Object.assign(this.createUserObject(),{type: "customer"}),      
      session: this.getSessionObject(),
      delivery: this.createDeliveryObjectForPayload(),
      configuration: {},
      language: "en-US",
    };

    return reqPayload;
  }

  createIDsObject(uniqueId: any,externalRef: any,mobilePhone: any) {
    return {
      journeyUniqueId: uniqueId,
      journeyExternalRef: externalRef,
      mobilephone: mobilePhone
    }
  }

  // Create payload object
  createPayloadRequest(RequestPipelineKey: any) {
    let user;

    if (this.userNotFoundFlag) {
      user = {
        id: null,
        uniqueId: this.getIDsObj.journeyUniqueId,
        email: "",
        phoneNumber: this.getIDsObj.mobilephone,
        firstName: "",
        middleName: "",
        lastName: "",
        devices: [],
      };

    } else {
      user = this.createUserObject();
    }

    return {
      pipelineKey: RequestPipelineKey,
      user: user,
      session: this.getSessionObject(),
      delivery: this.createDeliveryObjectForPayload(),
      configuration: {},
      language: "en-US",
    };

  }

  statusOfRequest(events: any, allEventData: any) {
    let accordionIndex = this.accordionArray.findIndex(
      (x: any) => x?.exeID.execution_ID === allEventData?.execution?.id
    );

    if (this.accordionArray?.[accordionIndex]) {
      this.accordionArray[accordionIndex].wsEvent = { ...allEventData };
    }

    if(this.accordionArray?.[accordionIndex]) {

      this.accordionArray[accordionIndex].statusDetails = Object.assign(
        this.accordionArray[accordionIndex].statusDetails,
        {
          title: this.accordionArray[accordionIndex].statusDetails.title,
          mobno: this.sessionBootstrapData?.phoneNumber,
          ...(events === 'execution-started' && {status: "Started",completedAt: "just now"}),
          ...(events === 'execution-progress' && {status: "Started",completedAt: "just now"}),
          ...(events === 'execution-completed' && {status: "Completed",completedAt: this.accordionArray[accordionIndex].wsEvent.execution.completedAt}),
          ...(events === 'session-authenticated' && {status: "Authenticated",completedAt: this.accordionArray[accordionIndex].wsEvent.execution.completedAt}),
        }
      )

      if(events === "execution-started" || events === "execution-progress") 
        this.accordionArray[accordionIndex].statusCSS = this.blueColorObject;
      else if(events === "execution-completed" || events === "session-authenticated") {
        this.isCustomerSendReqForAuth ? this.customerAuthenticatedFlag = true : null
        this.changeDetectorRef.detectChanges()
        this.isCustomerSendReqForEnroll ? this.customerEnrolledFlag = true : null
        this.changeDetectorRef.detectChanges()

        this.accordionArray[accordionIndex].statusCSS =this.greenColorObject

        console.log("Mobile No: ",this.mobileNumber)
        this.getMongoDBResponse(this.mobileNumber);
        this.getLookupDataFromAPI(this.customerUniqueID);
        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);

      }
    }
  }

  callFunctionArray(requestType: string) {
    this.setRequestFlag(requestType);

    if (this.requestName == "sendFacialEnrollmentRequest") {
      this.sendFacialEnrollmentRequest();
    } else if (this.requestName == "sendFacialAuthRequest") {
      this.sendFacialAuthRequest();
    } else if (this.requestName == "sendBiometricEnrollRequest") {
      this.sendBiometricEnrollRequest();
    } else if (this.requestName == "sendBiometricAuthenticationRequest") {
      this.sendBiometricAuthenticationRequest();
    } else if (this.requestName == "sdkEnroll") {
      this.sdkEnroll();
    } else if (this.requestName == "sdkAuthentication") {
      this.sdkAuthentication();
    } else if (this.requestName == "sendSignatureRequest") {
      this.sendSignatureRequest();
    }
  }

  // Set request flags
  setRequestFlag(requestType: string) {

    if (requestType == "SMS") {
      this.sendRequestMode = "sms";
    } else if (requestType == "Push Notification") {
      this.sendRequestMode = "push-notification";
    } else if (requestType == "QR") {
      this.sendRequestMode = "url";
    } else if (requestType == "Email") {
      this.sendRequestMode = "email";
    }
  }

  ////////////////////////////////////////////////////////////// Object creation functions

  // Creates delivery object
  createDeliveryObject(method: string): any {
    return {
      method: method,
      ...(method == "sms" && { phoneNumber: this.wsJMobileNumber }),
      ...(method == "push-notification" && { deviceId: this.deviceID }),
      ...(method == "email" && {deviceId: this.authRequestedData.delivery.email}),
      ...(method == "url" && { deviceId: this.authRequestedData?.url }),
    };
  }
  
  // Create delivery object for payload
  createDeliveryObjectForPayload(): any {
  
    return {
      method: this.sendRequestMode,
      ...(this.sendRequestMode === "sms" && {phoneNumber: this.bootstrapData.user.phoneNumber}), 
      ...(this.sendRequestMode === "push-notification" && {deviceId: this.deviceID}),
      ...(this.sendRequestMode === "email" && {email: this.sessionBootstrapData?.email}),
      ...(this.sendRequestMode === "url" && {deviceId: ''}) 
    }
  }

  // Create user object
  createUserObject(): any {
    return {
      id: this.bootstrapData.user.id,
      uniqueId: this.bootstrapData.user.uniqueId,
      email: this.bootstrapData.user.email,
      phoneNumber: this.bootstrapData.user.phoneNumber,
      firstName: this.bootstrapData.user.firstName,
      middleName: this.bootstrapData.user.middleName,
      lastName: this.bootstrapData.user.lastName,
      devices: [],
    };
  }

  // Create request object
  createRequestObject(executionId: string, title: any): any {
    return {
      wsEvent: null,
      delivery: this.createDeliveryObject(this.sendRequestMode),
      exeID: {
        execution_ID: executionId,
      },
      statusCSS: this.yellowColorObject,
      statusDetails: {
        title: title,
        status: "Requested",
        mobno: this.sessionBootstrapData?.phoneNumber,
        completedAt: "just now",
      }
    };
  }

  // Returns session object
  getSessionObject(): any {

    return {
      id: null,
      externalRef: this.executionSessionExternalRef,
      isAuthenticated: this.bootstrapData.session.isAuthenticated,
    }
  }

  ////////////////////////////////////////////////////////////// Model Opening functions

  openTestModal(Modal: any, reqName: any) {
    this.requestName = reqName;
    this.modalService.open(Modal, { centered: true, windowClass: "reqModal" });
  }

  openCreditCardPaymentModal(PaymentModal: any) {
    this.modalService.open(PaymentModal, {
      centered: true,
      windowClass: "payModal",
    });
  }

  openOutboundNotificationModal(outboundNotificationModal: any) {
    this.modalService.open(outboundNotificationModal, {
      centered: true,
      windowClass: "outboundNotificationModal",
    });
  }
}

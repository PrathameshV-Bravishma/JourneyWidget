import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { JourneyHttpService } from "../services/journey-http.service";

import { WebSocketService } from "../services/websocket.service";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChangeDetectorRef, ElementRef } from "@angular/core";

@Component({
  selector: "app-new-journey-profile",
  templateUrl: "./new-journey-profile.component.html",
  styles: [
    `
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

      /*==================================
Header CSS
================================= */
      header {
      }

      /*==================================
Banner CSS
================================= */

      /*==================================
Content CSS
================================= */

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
        border: solid 1px #651969;
        display: block;
        padding: 6px 10px;
        font-weight: 600;
        color: #7e608b;
        margin-top: 10px;
        font-size: 12px;
      }
      .btn-style img {
        margin-right: 10px;
      }
      .textlink {
        color: #551867;
        text-decoration: underline;
      }
      /*==================================
Footer CSS
================================= */

      @media (min-width: 576px) {
        /*==Header CSS== */

        /*==Banner CSS== */

        /*==Content CSS== */

        /*==Footer CSS== */
      }

      @media (min-width: 768px) {
        /*==Header CSS== */
        .pro-details a {
          margin-top: 7px;
          font-size: 16px;
        }

        /*==Banner CSS== */

        /*==Content CSS== */

        /*==Footer CSS== */
      }

      @media (min-width: 992px) {
        /*==Header CSS== */

        /*==Banner CSS== */

        /*==Content CSS== */

        /*==Footer CSS== */
      }

      @media (min-width: 1100px) {
        /*==Header CSS== */

        /*==Banner CSS== */

        /*==Content CSS== */

        /*==Footer CSS== */
      }

      @media (min-width: 1200px) {
        /*== Commen CSS == */

        /*==Header CSS== */

        /*==Banner CSS== */

        /*==Content CSS== */

        /*==Footer CSS== */
      }

      @media (min-width: 1600px) {
        /*==Header CSS== */

        /*==Banner CSS== */

        /*==Content CSS== */

        /*==Footer CSS== */
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
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NewJourneyProfileComponent implements OnInit {
  sessionBootstrapData: any;
  sessionBootstrapIsEnrolled = false;

  executionSessionExternalRef: any;

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

  getIDsObj: any;

  websocketConnData: any;

  webSocketEvents: any;

  counter = 0;
  isLoading: boolean = false;

  lookUpDataFromAPI: any;
  lookUpEnrollArray: any[] = [];

  authenticatedArray: any[] = [];

  enrollFacialFlag = false;
  enrollBiometricFlag = false;
  enrollMobileAppFlag = false;

  authFacialFlag = false;
  authBiometricFlag = false;
  authMobileAppFlag = false;
  // showRequestNotification = false;

  public widgetAPI: any;
  public interactionId!: string;

  public message: string = "";
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
  mobileNumber: string = "+919890945819";
  submitFlag: boolean = false;

  rateArray: any[] = [];
  errorMassage: string = "";
  agentName: any;
  allInteraction: any;
  notificationFlag: boolean = false;

  public testData: any;
  getAttribute: any;
  public agentDetails: any;
  checkMobileNumber = false;

  userNotFoundFlag = false;
  journeyid_authenticated_flag: any;

  customerEnrolledFlag = false;
  isCustomerSendReqForEnroll = false;
  customerAuthenticatedFlag: any;
  isCustomerSendReqForAuth = false;

  sessionLookupData: any;
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

  wsJCustomerID: any;
  wsJSessionID: any;
  wsJOldData: any;
  wsJMobileNumber: any;
  notificationAccordionArray: any[] = [];
  requestObject: any = {};
  // accordionArray: any[] = [];
  accordionArray: any;

  requestArray: any[] = [];
  accordionIndex: any;

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
    this.interactionId =
      this.element.nativeElement.getAttribute("interactionid");
    this.widgetAPI = (<any>window).WS.widgetAPI(this.interactionId);
  }
  ngOnInit(): void {
    // *** step 1:  create token

    // Interaction event fired when a new interaction is created or has been updated

    this.functionNameArray = ["SMS", "Push Notification", "QR", "Email"];
    this.counter = 0;
    this.tokenFlagStartSession();

    this.widgetAPI.onDataEvent("onInteractionEvent", (data: any) => {
      this.interaction = data;
      // console.log('interaction: ', this.interaction);
      this.mobileNumber = this.interaction?.intrinsics.CALLER_NUMBER;
      // console.log('interaction mob no: ', this.mobileNumber);
      this.getMongoDBResponse(this.mobileNumber);
      this.agentName = this.interaction?.destinationAddress;
      const splittedString = this.agentName?.split("@");
      // console.log(splittedString[0]);
      this.agentName = splittedString[0];
      this.changeDetectorRef.detectChanges();
    });

    // this.generateUUID(); // old code not used

    // // Media message data from chat, sms, email, social

    this.widgetAPI.onDataEvent("onMediaMessageEvent", (data: any) => {
      this.mediaMessage = data;
      this.mobileNumber = this.mediaMessage?.body.text;
      this.checkMobileNumber = this.mobileNumber?.includes("+");
      // console.log('onMediaMessageEvent mob number: ', this.mobileNumber);

      if (this.checkMobileNumber) {
        this.getMongoDBResponse(this.mobileNumber);
      }

      // console.log('onMediaMessageEvent: ', this.mediaMessage); //
      this.changeDetectorRef.detectChanges();
    });
  }

  tokenFlagStartSession() {
    this.accordionArray = [];
    this.notificationAccordionArray = [];

    this.jwtToken = this.httpService.signToken(this.agentName);

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
    console.warn("counter: ", this.counter);
    this.lookUpEnrollArray = [];
    if (this.counter === 1) {
      this.enrollBiometricFlag = false;
      this.enrollMobileAppFlag = false;
      this.enrollFacialFlag = false;

      this.authFacialFlag = false;
      this.authBiometricFlag = false;
      this.authMobileAppFlag = false;
    }
    this.authenticatedArray = [];

    // If mobileNo has '+' execute if statement
    if (mobileNo?.includes("+")) {
      this.httpService.getMongodbResponse(mobileNo).subscribe({
        next: (data: any) => {
          // console.log('Mongodb res: ', data);
          this.isLoading = false;
          let res = data.documents[0];

          if (res == undefined || res == null) {
            this.userNotFoundFlag = true;

            this.getIDsObj = {
              journeyUniqueId: mobileNo.split("+")[1],
              journeyExternalRef: null,
              mobilephone: mobileNo,
            };

            this.createJourneyBootstrapSession();
            this.getLookupDataFromAPI(mobileNo.split("+")[1]);
          } else {
            this.userNotFoundFlag = false;
            console.log(" res of mongodb:  ", data, res);

            //  open old web socket
            this.wsJCustomerID = res?.journeyid_customerid;
            this.wsJSessionID = res?.journeyid_session_id;
            this.wsJMobileNumber = res?.mobilephone;

            // -----------------

            this.customerUniqueID = res?.journeyid_customer_uniqueid;
            this.journeyid_authenticated_flag = res?.journeyid_authenticated;

            // console.log('auth flag: ', this.journeyid_authenticated_flag);

            this.customerAuthenticatedFlag =
              this.journeyid_authenticated_flag == "No" ? false : true;

            this.getIDsObj = {
              journeyUniqueId: res?.journeyid_customer_uniqueid,
              journeyExternalRef: res?.journeyid_session_externalref,
              mobilephone: res?.mobilephone,
            };

            this.executionSessionExternalRef =
              this.getIDsObj.journeyExternalRef;

            // getting old ws events
            console.log("calling getOldWebSocketDetails function ");

            this.getOldWebSocketDetails();

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

  getOldWebSocketDetails() {
    console.log("getOldWebSocketDetails called!!!");
    console.log(this.wsJSessionID);
    this.websocket_Service.getWSPreviousData(
      this.wsJCustomerID,
      this.wsJSessionID,
      `CONNECT ${this.jwtToken}`
    );

    setTimeout(() => {
      console.log("dwewefwe");
      this.websocket_Service.wsData.subscribe({
        next: (response: any) => {
          console.log(response);
          response = response;

          // If execution created
          if (response.event == "execution-created") {
            let type = response?.pipeline?.stages[0]?.type;

            // create requestObject
            this.requestObject = {
              wsEvent: response,
              exeID: {
                execution_ID: response?.execution.id,
              },
              statusCSS: {
                processLabelBGColor: "#90ee90",
                processIconColor: "#089000",
                processLabelColor: "#089000",
              },
              delivery: response?.delivery,
            };

            if (type === "webauthn-authentication") {
              this.requestObject.statusDetails = {
                title: "Device authentication Request ",
                status: "Authenticated",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "device-authentication") {
              this.requestObject.statusDetails = {
                title: "App authentication Request ",
                status: "Authenticated",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "facial-authentication-3d") {
              this.requestObject.statusDetails = {
                title: "Facial authentication Request",
                status: "Authenticated",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "document-signature") {
              this.requestObject.statusDetails = {
                title: "Document  signature Request",
                status: "Completed",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "credit-card-payment") {
              this.requestObject.statusDetails = {
                title: "Payment Request",
                status: "Completed",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "schedule") {
              this.requestObject.statusDetails = {
                title: "Outbound Notification Request",
                status: "Completed",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "facial-enrollment") {
              this.requestObject.statusDetails = {
                title: "Facial erollment Request",
                status: "Completed",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "webauthn-registration") {
              this.requestObject.statusDetails = {
                title: "Device erollment Request",
                status: "Completed",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            } else if (type === "mobile-app") {
              this.requestObject.statusDetails = {
                title: "App erollment Request",
                status: "Completed",
                mobno: this.wsJMobileNumber,
                completedAt: response?.execution.completedAt,
              };
            }
          } else if (response.event == "execution-completed") {
            let flag: boolean = true;

            for (let i = 0; i < this.accordionArray.length; i++) {
              if (
                this.accordionArray[i].wsEvent.execution.id ==
                this.requestObject.wsEvent.execution.id
              ) {
                flag = false;
                break;
              }
            }

            if (flag) {
              this.accordionArray.push(
                Object.assign(response, this.requestObject)
              );
            }
            this.accordionArray.reverse();
          }

          console.log("accordion array: ", this.accordionArray);
          // this.notificationAccordionArray.forEach((obj: any, index: number) => {
          //   console.log(`Noti ${index} `, obj);
          // });

          // this.accordionArray.forEach((obj: any, index: number) => {
          //   console.log(`Acc ${index} `, obj);
          // });
        },
      });
    }, 3000);
  }

  getLookupDataFromAPI(customerUniqueID: any) {
    this.httpService.getLookupCustomerData(customerUniqueID).subscribe({
      next: (LookupData: any) => {
        console.log("LookupData: ", LookupData);

        this.deviceDetails = LookupData?.devices[0];
        this.deviceID = this.deviceDetails?.id;
        if (this.deviceDetails) {
          this.isDevicePresentFlag = true;
        }
        // console.log('device flag: ', this.isDevicePresentFlag);
        // console.log('device data: ', this.deviceDetails);
        console.log("device id: ", this.deviceID);

        this.lookUpDataFromAPI = LookupData?.enrollments;

        this.lookUpDataFromAPI.filter((enroll: any) => {
          this.lookUpEnrollArray = [...this.lookUpEnrollArray, enroll.type];
        });

        // console.log('this.lookUpEnrollArray', this.lookUpEnrollArray);

        this.enrollFacialFlag =
          this.lookUpEnrollArray?.includes("facial-biometrics");
        // console.log('enrollFacialFlag', this.enrollFacialFlag);
        this.enrollBiometricFlag = this.lookUpEnrollArray?.includes("webauthn");
        // console.log('enrollBiometricFlag', this.enrollBiometricFlag);
        this.enrollMobileAppFlag =
          this.lookUpEnrollArray?.includes("mobile-app");
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
        console.log("Lookup api error: ", err);
      },
    });
  }

  // Step 2: create Bootstrap Session

  createJourneyBootstrapSession() {
    // externalRef: this.executionSessionExternalRef,
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
        //   'createJourneyBootstrapSession- web socket data: ',
        //   this.websocketConnData
        // );

        // No name available

        if (
          (this.sessionBootstrapData.firstName &&
            this.sessionBootstrapData.lastName &&
            this.sessionBootstrapData.email) == ""
        ) {
          this.sessionBootstrapData = {
            firstName: "No name available",
            phoneNumber: this.sessionBootstrapData.phoneNumber,
          };

          if (!this.sessionBootstrapIsEnrolled) {
            this.customerEnrolledFlag = false;
          }

          // console.log('not name avail: ', this.sessionBootstrapData);
        }

        // this.createNewRequest();

        if (this.sessionBootstrapIsEnrolled) {
          this.alertBoxColor = "#fc6a03";
          this.RequestIconColor = "#fc6a03";
          this.customerEnrolledFlag = true;
          this.RequestLabelColor = "#fc6a03";
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
        console.log("Session LookupData: ", LookupData);

        this.sessionLookupData = LookupData;

        this.stageArray = this.sessionLookupData?.executions;

        for (let i = 0; i < this.stageArray.length; i++) {
          // console.log('stage number: ', this.stageArray[i]);

          if (this.stageArray[i].stages) {
            // console.log('stages Data: ', this.stageArray[i].stages);
            if (
              this.stageArray[i]?.stages[0]?.type === "webauthn-authentication"
            ) {
              this.authBiometricFlag = true;
            } else if (
              this.stageArray[i]?.stages[0]?.type === "device-authentication"
            ) {
              this.authMobileAppFlag = true;
            } else if (
              this.stageArray[i]?.stages[0]?.type === "facial-authentication-3d"
            ) {
              this.authFacialFlag = true;
            }
          }
        }
      },

      error: (err: any) => {
        console.log("Lookup api error: ", err);
      },
    });
  }

  // Step 3: Making Pipeline (execution ) requests

  sendFacialEnrollmentRequest() {
    this.widgetAPI.sendChatMessage(
      `I have shared a facial Enrollment request via ${this.sendRequestMode} to Enroll yourself.
        Please complete the Enrollment process`
    );

    this.requestNotificationName = "Facial erollment Request";
    this.isCustomerSendReqForEnroll = true;
    let pipelineKey = "7214289b-47d8-4313-970a-567f8c0b685f";

    let reqPayload = this.createPayloadRequest(pipelineKey);

    this.executeRequest(reqPayload);
  }

  sendFacialAuthRequest() {
    this.widgetAPI.sendChatMessage(
      `I have shared a facial authentication request via ${this.sendRequestMode} to Authenticate yourself.
        Please complete the Authentication process`
    );

    // console.log('bootstrap data', this.bootstrapData);
    this.requestNotificationName = "Facial authentication Request";

    // let pipelineKey = 'd73d7733-5450-46a3-a1c7-42bf06e09ea0';
    let pipelineKey = "dc2db844-c4a9-45fe-9316-44edd90b68dd";

    let reqPayload = this.createPayloadRequest(pipelineKey);

    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    // console.log('exe payload: ', reqPayload);

    this.executeRequest(reqPayload);
  }

  // send biometric request

  sendBiometricEnrollRequest() {
    this.widgetAPI.sendChatMessage(
      `I have shared a device Enrollment request via ${this.sendRequestMode} to Enroll yourself.
          Please complete the Enrollment process`
    );

    this.requestNotificationName = "Device enrollment Request";

    let pipelineKey = "e96e40a4-0ed3-4ff2-bd93-49a9061522cc";
    this.isCustomerSendReqForEnroll = true;
    let reqPayload = this.createPayloadRequest(pipelineKey);

    this.executeRequest(reqPayload);
  }

  sendBiometricAuthenticationRequest() {
    this.widgetAPI.sendChatMessage(
      `I have shared a device authentication request via ${this.sendRequestMode} to Authenticate yourself.
        Please complete the Authentication process`
    );

    this.requestNotificationName = "Device authentication Request";
    // console.log('bootstrap data', this.bootstrapData);

    let pipelineKey = "2eb2c038-6bdd-45ba-9eea-f97c3f17e138";
    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    let reqPayload = this.createPayloadRequest(pipelineKey);
    console.log("Payload request: ", reqPayload);
    // console.log('exe payload: ', reqPayload);
    this.executeRequest(reqPayload);
  }

  executeRequest(reqPayload: any) {
    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            console.log("Request data: ", data);
            // console.log('Execution data: ', data);
            this.authRequestedData = { ...data };
            // url: 'https://secure.journeyid.io/s/Kd2BAgj';

            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            console.log("acc array : ", this.accordionArray);

            let requestObject: any = {
              wsEvent: null,
              exeID: {
                execution_ID: this.authRequestedData.id,
              },
              statusCSS: {
                processLabelBGColor: "#ffd580",
                processIconColor: "#fc6a03",
                processLabelColor: "#fc6a03",
              },
              statusDetails: {
                // title: 'Digital Signature Request 1',
                title: this.requestNotificationName,
                status: "Requested",
                mobno: this.sessionBootstrapData?.phoneNumber,
                completedAt: "just now",
              },
            };

            // this.sendAuthRequestFlag = true;

            // start mult acc req
            console.log("Auth url: ", this.authRequestedData?.url);

            if (this.sendRequestMode == "sms") {
              requestObject.delivery = {
                method: "sms",
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == "push-notification") {
              requestObject.delivery = {
                method: "push-notification",
                deviceId: this.deviceID,
              };
            } else if (this.sendRequestMode == "email") {
              requestObject.delivery = {
                method: "email",
                email: this.authRequestedData?.delivery.email,
              };
            } else if (this.sendRequestMode == "url") {
              requestObject.delivery = {
                method: "url",
                url: this.authRequestedData?.url,
              };
            }

            this.changeDetectorRef.detectChanges();

            this.accordionArray = [requestObject, ...this.accordionArray];
            this.changeDetectorRef.detectChanges();

            this.websocket_Service.connectWebSocket(
              this.authRequestedData.user.id,
              this.authRequestedData.session.id,
              `CONNECT ${this.jwtToken}`
            );

            this.websocket_Service.message.subscribe({
              next: (value: any) => {
                if (
                  (value.type === "close" || value.code === 1006) &&
                  this.webSocketEvents?.event !== "session-authenticated"
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
    this.widgetAPI.sendChatMessage(
      `I have shared a mobile app enrollment request via ${this.sendRequestMode} to Enroll yourself.
        Please complete the Enrollment process`
    );

    this.requestNotificationName = "App enrollment Request";
    let pipelineKey = "060284b0-68dd-4c02-9534-7688d967b193";
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
              this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: "#ffd580",
              processIconColor: "#fc6a03",
              processLabelColor: "#fc6a03",
            };

            this.requestObject.statusDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: "Requested",
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: "just now",
            };

            this.accordionArray = [this.requestObject, ...this.accordionArray];

            // console.log('after added new request: ', this.accordionArray);

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
                  (value.type === "close" || value.code === 1006) &&
                  this.webSocketEvents?.event !== "session-authenticated"
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
    this.widgetAPI.sendChatMessage(
      `I have shared a mobile app authenticate request via ${this.sendRequestMode} to Authenticate yourself.
        Please complete the Authentication process`
    );

    this.requestNotificationName = "App authentication Request";
    let pipelineKey = "6871934e-a546-4d9b-910b-2b566df42376";
    // isCustomerSendReqForAuth only for auth, it will change only auth requests
    this.isCustomerSendReqForAuth = true;
    let reqPayload = this.createSDKPayload(pipelineKey);

    setTimeout(() => {
      this.httpService
        .sendAuthenticationExecutionRequest(reqPayload, this.jwtToken)
        .subscribe({
          next: (data: any) => {
            console.log("Execution data: ", data);
            this.authRequestedData = data;
            // this.addNewAccordianRequest(this.authRequestedData);
            // this.sendAuthRequestFlag = true;
            if (this.authRequestedData?.url) {
              // console.log('sending QR url into chat');
              this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: "#ffd580",
              processIconColor: "#fc6a03",
              processLabelColor: "#fc6a03",
            };

            this.requestObject.statusDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: "Requested",
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: "just now",
            };

            this.accordionArray = [this.requestObject, ...this.accordionArray];

            // console.log('after added new request: ', this.accordionArray);

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
                  (value.type === "close" || value.code === 1006) &&
                  this.webSocketEvents?.event !== "session-authenticated"
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

  sendSignatureRequest() {
    this.widgetAPI.sendChatMessage(
      `I have shared a e-sign document request via ${this.sendRequestMode}.
       Please complete the e-sign document process`
    );
    this.requestNotificationName = "Digital Signature Request";

    let pipelineKey = "cfcfb607-8fb0-4ec1-9f80-4288cc573afb";

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
              this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // this.sendAuthRequestFlag = true;

            // start mult acc req

            console.log("Req data: ", this.authRequestedData.url);

            this.requestObject = {
              wsEvent: null,
            };
            if (this.sendRequestMode == "sms") {
              this.requestObject.delivery = {
                method: "sms",
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == "push-notification") {
              this.requestObject.delivery = {
                method: "push-notification",
                deviceId: this.deviceID,
              };
            } else if (this.sendRequestMode == "email") {
              this.requestObject.delivery = {
                method: "email",
                deviceId: this.authRequestedData.delivery.email,
              };
            } else if (this.sendRequestMode == "url") {
              this.requestObject.delivery = {
                method: "url",
                deviceId: this.authRequestedData?.url,
              };
            }

            console.log("this.requestObject: ", this.requestObject);

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: "#ffd580",
              processIconColor: "#fc6a03",
              processLabelColor: "#fc6a03",
            };

            this.requestObject.statusDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: "Requested",
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: "just now",
            };

            console.log(" this.requestObject: ", this.requestObject);

            this.accordionArray = [this.requestObject, ...this.accordionArray];

            console.log("after added new request: ", this.accordionArray);

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
                console.log("comp events: ", value);

                // execution-completed
                if (
                  (value.type === "close" || value.code === 1006) &&
                  this.webSocketEvents?.event !== "execution-completed"
                ) {
                  console.log("closed");
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
    this.setRequestType(requestType);

    this.widgetAPI.sendChatMessage(
      `I have shared a credit card payment request via  ${this.sendRequestMode}.
       Please complete the payment process`
    );

    this.requestNotificationName = "Payment Request";

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
              this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // this.sendAuthRequestFlag = true;

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            if (this.sendRequestMode == "sms") {
              this.requestObject.delivery = {
                method: "sms",
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == "push-notification") {
              this.requestObject.delivery = {
                method: "push-notification",
                deviceId: this.deviceID,
              };
            } else if (this.sendRequestMode == "email") {
              this.requestObject.delivery = {
                method: "email",
                deviceId: this.authRequestedData.delivery.email,
              };
            } else if (this.sendRequestMode == "url") {
              this.requestObject.delivery = {
                method: "url",
                deviceId: this.authRequestedData?.url,
              };
            }

            console.log("this.requestObject: ", this.requestObject);
            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: "#ffd580",
              processIconColor: "#fc6a03",
              processLabelColor: "#fc6a03",
            };

            this.requestObject.statusDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: "Requested",
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: "just now",
            };

            this.accordionArray = [this.requestObject, ...this.accordionArray];

            // console.log('after added new request: ', this.accordionArray);

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
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }, 3000);
  }

  outboundNotificationFlag = false;
  outboundNotificationWSeventResultRes: any;

  sendOutboundNotification(reason: any, requestType: any) {
    this.setRequestType(requestType);

    this.widgetAPI.sendChatMessage(
      `I have shared a outbound notification request via ${this.sendRequestMode}.
       Please complete the process`
    );

    let reference = reason.value;
    this.requestNotificationName = "Outbound Notification Request";
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
      pipelineKey: "03542a52-d33a-4b12-a17c-790ed881fd36",
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
        ["schedule"]: {
          ["reference"]: reference,
          ["options"]: [
            "now",
            "15m",
            "3h",
            "2022-01-01T12:00:00Z",
            "2022-01-01T17:30:00",
          ],
        },
      },
      language: "en-US",
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
              this.widgetAPI.sendChatMessage(this.authRequestedData?.url);
            }

            // start mult acc req

            this.requestObject = {
              wsEvent: null,
            };

            if (this.sendRequestMode == "sms") {
              this.requestObject.delivery = {
                method: "sms",
                phoneNumber: this.wsJMobileNumber,
              };
            } else if (this.sendRequestMode == "push-notification") {
              this.requestObject.delivery = {
                method: "push-notification",
                deviceId: this.deviceID,
              };
            } else if (this.sendRequestMode == "email") {
              this.requestObject.delivery = {
                method: "email",
                deviceId: this.authRequestedData.delivery.email,
              };
            } else if (this.sendRequestMode == "url") {
              this.requestObject.delivery = {
                method: "url",
                deviceId: this.authRequestedData?.url,
              };
            }

            console.log("this.requestObject: ", this.requestObject);

            this.requestObject.exeID = {
              execution_ID: this.authRequestedData.id,
            };

            this.requestObject.statusCSS = {
              processLabelBGColor: "#ffd580",
              processIconColor: "#fc6a03",
              processLabelColor: "#fc6a03",
            };

            this.requestObject.statusDetails = {
              // title: 'Digital Signature Request 1',
              title: this.requestNotificationName,
              status: "Requested",
              // mobno: '+919146129322',
              mobno: this.sessionBootstrapData?.phoneNumber,
              completedAt: "just now",
            };

            this.accordionArray = [this.requestObject, ...this.accordionArray];

            this.outboundNotificationFlag = true;

            // console.log('after added new request: ', this.accordionArray);

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
      pipelineKey: "e117db4d-8742-4a03-bdc8-d58726a7cf67",

      user: {
        id: this.bootstrapData.user.id,
        uniqueId: this.bootstrapData.user.uniqueId,
        email: this.bootstrapData.user.email,
        phoneNumber: this.bootstrapData.user.phoneNumber,
        firstName: this.bootstrapData.user.firstName,
        middleName: this.bootstrapData.user.middleName,
        lastName: this.bootstrapData.user.lastName,
        devices: [],
        type: "customer",
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
      },
      language: "en-US",
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
        type: "customer",
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
      language: "en-US",
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
        email: "",
        phoneNumber: this.getIDsObj.mobilephone,
        firstName: "",
        middleName: "",
        lastName: "",
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
    return {
      pipelineKey: RequestPipelineKey,
      user: userDetails,
      session: {
        id: null,
        externalRef: this.executionSessionExternalRef,
        isAuthenticated: this.bootstrapData.session.isAuthenticated,
      },
      delivery: deliveryDetails,
      configuration: {},
      language: "en-US",
    };

    // console.log('exe payload: ', reqPayload);
  }

  // accordionIndex: any;
  // cssStatus: any;

  statusOfRequest(events: any, allEventData: any) {
    this.accordionIndex = this.accordionArray.findIndex(
      (x: any) => x?.exeID.execution_ID === allEventData?.execution?.id
    );

    if (this.accordionArray?.[this.accordionIndex]) {
      this.accordionArray[this.accordionIndex].wsEvent = { ...allEventData };
    }

    // console.log('acc index: ', this.accordionArray[this.accordionIndex]);

    switch (events) {
      case "execution-created":
        // ui change

        this.processLabelBGColor = "#ffd580";
        this.processLabelName = "Requested";
        this.processIconColor = "#fc6a03";
        this.processLabelColor = "#fc6a03";

        // ui change end
        break;
      case "execution-started":
        if (this.accordionArray?.[this.accordionIndex]) {
          this.accordionArray[this.accordionIndex].statusDetails = {
            status: "Started",
            title: this.accordionArray[this.accordionIndex].statusDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt: "just now",
          };

          this.accordionArray[this.accordionIndex].statusCSS = {
            processLabelBGColor: "#b0e0e6",
            processIconColor: "#00bfff",
            processLabelColor: "#00bfff",
          };
        }

        // console.log('after added new request: ', this.accordionArray);

        break;
      case "execution-progress":
        if (this.accordionArray?.[this.accordionIndex]) {
          this.accordionArray[this.accordionIndex].statusDetails = {
            status: "Started",
            title: this.accordionArray[this.accordionIndex].statusDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt: "just now",
          };

          this.accordionArray[this.accordionIndex].statusCSS = {
            processLabelBGColor: "#b0e0e6",
            processIconColor: "#00bfff",
            processLabelColor: "#00bfff",
          };
        }

        break;
      case "execution-completed":
        // ui change
        // this.alertBoxColor = '#089000';
        // this.RequestIconColor = '#089000';
        // this.processLabelBGColor = '#90ee90';
        // this.processLabelName = 'Completed';
        // this.processIconColor = '#089000';
        // this.processLabelColor = '#089000';
        // this.RequestLabelColor = '#089000';

        // this.customerAuthenticatedFlag = true;

        if (this.isCustomerSendReqForAuth) {
          this.customerAuthenticatedFlag = true;
        }

        if (this.isCustomerSendReqForEnroll) {
          this.customerEnrolledFlag = true;
        }

        if (this.accordionArray?.[this.accordionIndex]) {
          this.accordionArray[this.accordionIndex].statusDetails = {
            status: "Completed",
            title: this.accordionArray[this.accordionIndex].statusDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt:
              this.accordionArray[this.accordionIndex].wsEvent.execution
                .completedAt,
          };

          this.accordionArray[this.accordionIndex].statusCSS = {
            processLabelBGColor: "#90ee90",
            processIconColor: "#089000",
            processLabelColor: "#089000",
          };
        }

        if (this.outboundNotificationFlag) {
          // outbound notification flag true
          // check response is it now, if it is now then enable call now button

          console.log(
            "outbound notification: ",
            this.accordionArray[this.accordionIndex].wsEvent
          );
        }

        this.getMongoDBResponse(this.mobileNumber);
        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);
        this.getLookupDataFromAPI(this.customerUniqueID);

        // ui change end
        break;
      case "session-authenticated":
        if (this.isCustomerSendReqForAuth) {
          this.customerAuthenticatedFlag = true;
        }

        if (this.isCustomerSendReqForEnroll) {
          this.customerEnrolledFlag = true;
        }

        if (this.accordionArray?.[this.accordionIndex]) {
          this.accordionArray[this.accordionIndex].statusDetails = {
            status: "Authenticated",
            title: this.accordionArray[this.accordionIndex].statusDetails.title,

            // mobno: '+919146129322',
            mobno: this.sessionBootstrapData?.phoneNumber,
            completedAt:
              this.accordionArray[this.accordionIndex].wsEvent.execution
                .completedAt,
          };

          this.accordionArray[this.accordionIndex].statusCSS = {
            processLabelBGColor: "#90ee90",
            processIconColor: "#089000",
            processLabelColor: "#089000",
          };
        }

        if (this.outboundNotificationFlag) {
          // outbound notification flag true
          // check response is it now, if it is now then enable call now button

          console.log(
            "auth outbound notification: ",
            this.accordionArray[this.accordionIndex].wsEvent
          );
        }

        this.getMongoDBResponse(this.mobileNumber);
        this.getLookupDataFromAPI(this.customerUniqueID);
        this.getLookupSessionDataFromAPI(this.getIDsObj.journeyExternalRef);

        this.widgetAPI.sendChatMessage("Session Process completed");
        // this.widgetAPI.sendRichMediaMessage({ text: '  ' }, 'text', '');

        // ui change end
        break;
      default:
        break;
    }
  }

  callFunctionArray(requestType: string) {
    this.setRequestType(requestType);
    console.log(this.requestName);

    if (this.requestName == "sendFacialEnrollmentRequest") {
      // console.log('sendFacialEnrollmentRequest');
      this.sendFacialEnrollmentRequest();
    } else if (this.requestName == "sendFacialAuthRequest") {
      this.sendFacialAuthRequest();
      // console.log('sendFacialEnrollmentRequest');
    } else if (this.requestName == "sendBiometricEnrollRequest") {
      this.sendBiometricEnrollRequest();
      // console.log('sendBiometricEnrollRequest');
    } else if (this.requestName == "sendBiometricAuthenticationRequest") {
      this.sendBiometricAuthenticationRequest();
      // console.log('sendBiometricAuthenticationRequest');
    } else if (this.requestName == "sdkEnroll") {
      this.sdkEnroll();
      // console.log('sdkEnroll');
    } else if (this.requestName == "sdkAuthentication") {
      this.sdkAuthentication();
      // console.log('sdkAuthentication');
    } else if (this.requestName == "sendSignatureRequest") {
      this.sendSignatureRequest();
      // console.log('sendSignatureRequest');
    }
  }

  setRequestType(requestType: string) {
    if (requestType == "SMS") {
      this.sendSMSFlag = true;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = "sms";
    } else if (requestType == "Push Notification") {
      this.sendSMSFlag = false;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = true;
      this.sendQRFlag = false;
      this.sendRequestMode = "push-notification";
    } else if (requestType == "QR") {
      this.sendSMSFlag = false;
      this.sendEmailFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = true;
      this.sendRequestMode = "url";
    } else if (requestType == "Email") {
      this.sendEmailFlag = true;
      this.sendSMSFlag = false;
      this.sendPushNotificationFlag = false;
      this.sendQRFlag = false;
      this.sendRequestMode = "email";
    }
  }

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

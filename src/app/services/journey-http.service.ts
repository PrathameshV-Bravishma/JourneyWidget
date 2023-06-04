import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
// import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class JourneyHttpService {
  constructor(private http: HttpClient) {}
  secret = '8dfb66a9-d84b-40e9-a6b9-bac2a8f9765c';
  // step 1: Generate an authorization token
  //getting token from backend nodejs

  getJwtToken() {
    // jwt from node

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'text/html',
      charset: 'utf - 8',
    });
    let agentUniqueID = 'agenttest1';
    return this.http.post(
      'http://localhost:3000/jwttoken',
      { agentUniqueID },
      {
        headers,
      }
    );

    // creating jwt token in angular
  }

  // get mongodb res data using externalRef (mob no)

  getMongodbResponse(externalRef: any) {
    const body = JSON.stringify({
      dataSource: 'mongodb-atlas',
      database: 'avayaocf-qnamaker',
      collection: 'JourneyID-Chats',
      filter: {
        _id: externalRef,
      },
    });

    // send request payload to mongodb url
    let responseData = this.postMongoDbRequest(body);
    return responseData;
  }

  // post request for get user details from mongodb

  postMongoDbRequest(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      'https://data.mongodb-api.com/app/avayaocf-vrral/endpoint/data/v1/action/find',
      data,
      { headers }
    );
  }

  // step 2: create bootstrap session

  // post request to journey api for create bootstrap

  createBootstrapSession(data: any, token: any) {
    // this.creteToken();
    // console.log(`createBootstrapSession Bearer ${token}`);

    let headers = new HttpHeaders({
      authorization: `Bearer ${token}`,
    });

    return this.http.post(
      'https://app.journeyid.io/api/iframe/sessions/bootstrap',
      data,
      { headers }
    );
  }

  // step 3: Making Pipeline (execution ) requests

  sendAuthenticationExecutionRequest(data: any, token: any) {
    let headers = new HttpHeaders({
      authorization: `Bearer ${token}`,
    });

    return this.http.post(
      'https://app.journeyid.io/api/iframe/executions',
      data,
      {
        headers,
      }
    );
  }

  base64url(source: any) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);

    encodedSource = encodedSource.replace(/=+$/, '');

    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }

  encodeToken(payload: any) {
    let header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    let encodedHeader = this.base64url(stringifiedHeader);

    let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    let encodedData = this.base64url(stringifiedData);

    return encodedHeader + '.' + encodedData;
  }

  signToken(agentName: any) {
    console.log("Agent Name: ", agentName)
    // let uniqueId = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = 24; // hours
    let claims = {
      sub: agentName,
      ifr: 'c9a0c715-fac8-4c2f-992e-8e6ecf380244',
      exp: +new Date() + 3_600 * expiresIn,
    };

    let token: any = this.encodeToken(claims);
    // console.log('token', token);
    let signature: any = CryptoJS.HmacSHA256(token, this.secret);
    signature = this.base64url(signature);

    let signedToken = token + '.' + signature;
    // console.log('signToken', signedToken);
    return signedToken;
  }

  // lookup data of customers

  getLookupCustomerData(uniqueID: any) {
    // hard coded Bearer token from Journey Dev application (API Key: https://app.journeyid.io/settings/developer)

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiI5YWQyYTczYy1hY2E0LTQxNjktYmI1ZS04YWNlZGRhYjI1ODIiLCJleHAiOjE3NDU0MDIxNTksImlzcyI6ImpvdXJuZXkiLCJwcnAiOiJzeXN0ZW0ifQ.BfCquLs5dFeFzbwjJYCvkL4oWvSih3uRNes2KCqEoLQ

    console.log('uniqueID: ', uniqueID);

    let token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiI5YWQyYTczYy1hY2E0LTQxNjktYmI1ZS04YWNlZGRhYjI1ODIiLCJleHAiOjE3NDU0MDIxNTksImlzcyI6ImpvdXJuZXkiLCJwcnAiOiJzeXN0ZW0ifQ.BfCquLs5dFeFzbwjJYCvkL4oWvSih3uRNes2KCqEoLQ';

    let headers = new HttpHeaders({
      authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `https://app.journeyid.io/api/system/customers/lookup?unique_id=${uniqueID}`,
      { headers }
    );
  }

  // lookup session from customer

  getLookupSessionOfCustomer(JounreyExRefSessionID: any) {
    // hard coded Bearer token from Journey Dev application (API Key: https://app.journeyid.io/settings/developer)

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiI5YWQyYTczYy1hY2E0LTQxNjktYmI1ZS04YWNlZGRhYjI1ODIiLCJleHAiOjE3NDU0MDIxNTksImlzcyI6ImpvdXJuZXkiLCJwcnAiOiJzeXN0ZW0ifQ.BfCquLs5dFeFzbwjJYCvkL4oWvSih3uRNes2KCqEoLQ

    console.log('uniqueID: ', JounreyExRefSessionID);

    let token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiI5YWQyYTczYy1hY2E0LTQxNjktYmI1ZS04YWNlZGRhYjI1ODIiLCJleHAiOjE3NDU0MDIxNTksImlzcyI6ImpvdXJuZXkiLCJwcnAiOiJzeXN0ZW0ifQ.BfCquLs5dFeFzbwjJYCvkL4oWvSih3uRNes2KCqEoLQ';

    let headers = new HttpHeaders({
      authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `https://app.journeyid.io/api/system/sessions/lookup?external_ref=${JounreyExRefSessionID}`,
      { headers }
    );
  }
}

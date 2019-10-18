import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { CronberryService } from './cronberry.service';
import { Param, APIRequest } from './models/api-response';
import * as firebase from 'firebase';

@Injectable()
export class CronberryComponent {
  currentMessage = new BehaviorSubject(null);
  messaging = firebase.messaging()
  token: any;
  apikeys: string;
  audienceIds: number;

  constructor(
    private apiService: CronberryService,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  getPermission(apiKey) {
    this.messaging.requestPermission().then(() => {
      console.log('Notification permission granted.');
      if(this.isTokenSentToServer()){
        console.log('Token already sent ');
      } else{
        this.getRegisteredToken(apiKey);
      }
      return this.messaging.getToken()
    })
  }

  getRegisteredToken(apiKey){
    let apiKeys = apiKey;
    this.audienceIds = new Date().getTime();
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.insertUserWebToken(token, apiKeys, this.audienceIds);
        this.sendTokenToServer(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
        this.setTokenSentToServer(false);
      }
    );
  }

  sendTokenToServer(currentToken) {
    if (!this.isTokenSentToServer()) {
      console.log('Sending token to server...');
      this.setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

  setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }

  isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }

  insertUserWebToken(token: any, apiKey: string, audienceid: number) {
    this.apiService.insertUserWebToken(this.body(token, apiKey, audienceid)).subscribe(data => {
      if (data.status) {
        return;
      }
      err => { console.error(err) }
    })
  }

  ParamList(key: string, val: string): Param {
    var element = {
      paramObj: <Param>{
        paramKey: key,
        paramValue: val
      }
    }
    return element.paramObj;
  }

  body(token: any, apiKey: string, audienceid: number): APIRequest {
    let paramList: Param[] = [];
    paramList.push(this.ParamList("web_fcm_token", token));
    var element = {
      paramObj: <APIRequest>{
        apiKey: apiKey,
        audienceId: audienceid,
        paramList: paramList
      }
    }
    return element.paramObj;
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

}

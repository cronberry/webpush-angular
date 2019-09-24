import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'
import { CronberryService } from './cronberry.service';
import { Param, APIRequest } from './models/api-response';


@Injectable()
export class CronberryComponent {

  currentMessage = new BehaviorSubject(null);

  token: any;
  apikeys: string;
  audienceIds: String;

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

  // updateToken(userId, token) {
  //   this.angularFireAuth.authState.pipe(take(1)).subscribe(
  //     () => {
  //       const data = {};
  //       data[userId] = token
  //       this.angularFireDB.object('fcmTokens/').update(data)
  //     })
  // }

  // requestPermission(userId,apiKey,audienceid) {
  //   let apiKeys = apiKey;
  //   let audienceids = audienceid;
  //   this.angularFireMessaging.requestToken.subscribe(
  //     (token) => {
  //       this.insertUserWebToken(token, apiKeys, audienceids);
  //        this.updateToken(userId, token);
  //     },
  //     (err) => {
  //       console.error('Unable to get permission to notify.', err);
  //     }
  //   );
  // }

  requestPermission(apiKey, audienceid) {
    let apiKeys = apiKey;
    let audienceids = audienceid;
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.insertUserWebToken(token, apiKeys, audienceids);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  // insertUserWebToken(token: any, apiKey: string, audienceid: string) {
  //   this.body(token, apiKey, audienceid);
  //   this.apiService.insertUserWebToken(this.body(token, apiKey, audienceid)).subscribe(data => {
  //     if (data.status) {
  //       return;
  //     }
  //     err => { console.error(err) }
  //   })
  // }

  insertUserWebToken(token: any, apiKey: string, audienceid: string) {
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

  body(token: any, apiKey: string, audienceid: string): APIRequest {
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

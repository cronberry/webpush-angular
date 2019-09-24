import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, Http,Headers } from '@angular/http';
  
@Injectable({
   providedIn: 'root'
})
export class CronberryService{
  
    constructor(private _http: Http){
        
    }

    public insertUserWebToken(body: any): Observable<any> {
        let header: Headers = new Headers({ 'Content-Type': 'application/json' });
        header.append('Authorization', 'Basic Y3JvbmJlcnJ5QHVzZXJuYW1lOmNyb25iZXJyeUBwYXNzd29yZA==');
        header.append('Access-Control-Allow-Origin', '*');
        header.append("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
        header.append("Access-Control-Allow-Headers", "Content-type,X-Requested-With,Origin,accept");
        let options =  new RequestOptions({headers: header})
         return this._http.post("https://api.cronberry.com/cronberry/api/campaign/register-audience",JSON.stringify(body),options)
    }
} 
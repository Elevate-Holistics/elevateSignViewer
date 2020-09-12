import { Injectable } from '@angular/core';
import { DataService } from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class SignviewerService {

  constructor(private dataservice: DataService) { }
  getDocumnet(req: any) {
    return this.dataservice.getHttpData('/signviewer', req);
  }
  checkSignvieweruser (req:any){
    return this.dataservice.postHttpData('/auth', req);
  }
}
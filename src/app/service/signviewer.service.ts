import { Injectable } from '@angular/core';
import {DataService} from '../service/dataservice-service';

@Injectable({
  providedIn: 'root'
})
export class SignviewerService {

  constructor(private dataservice: DataService) { }
  getDocumnet(req: any) {
    return this.dataservice.getHttpData('/signviewer', req);
  }
  checkSignvieweruser (req:any){
    return this.dataservice.getHttpData('/signviewer', req);
  }
  postData (req:any){
     
    return this.dataservice.postHttpData('/signviewer', req);
  }
}
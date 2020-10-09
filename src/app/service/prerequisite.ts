import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { GlobalService } from '../service/global.service';
import { UserModel } from '../intefaces/userModel';
import { MenuService } from '../service/menu.service';
@Injectable({ providedIn: 'root' })
export class Prerequisite implements CanActivate, CanLoad, CanActivateChild {
  constructor(private _router: Router, private global: GlobalService, private menuservice: MenuService) {

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkFun(route, state);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkFun(route, state);
  }

  public canLoad() {
    return true;
  }

  private checkFun(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    let role = undefined;
    if (route.data) {
      role = route.data.role;
    }

    const that = this;

    // const routeconfig = route.data;
    // const checks = that.checkCredentials();


    // this.global.setCurrentMenu(route.data.code);

    return Observable.create((observer: Subject<boolean>) => {

      if (that.global.getCompany(true) == '0') {
        that._router.navigate(['company/list', { backurl: state.url }]);
      }
      else if (role == "di" && that.global.getDisp() == '') {

        that._router.navigate(['dispensary', { backurl: state.url }]);

      } else {
        observer.next(true);
      }
      // observer.next(true);
      // if (localStorage.getItem('user') == null) {

      //   this._router.navigate(['/login']);
      //   observer.next(true);

      // } else
      //   if (checks.status) {
      //     this.menuservice.checkMenuAccess({ 'userid': this.global.getUser().id, 'menuCode': routeconfig.code }).subscribe((res: any) => {


      //       if (res.resultKey === 1) {
      //         let data = res.resultValue;
      //         if (data.action != '' || data.action != null) {
      //           this.global.setMenuActions(data.action);
      //           if (routeconfig.subcode && data.action.indexOf(routeconfig.subcode) == -1) {
      //             that._router.navigate(['/500']);
      //           }
      //           observer.next(true);

      //         }
      //         else {
      //           that._router.navigate(['/500']);
      //           observer.next(true);
      //         }
      //       }
      //       else if (res.resultKey === 0) {
      //         that._router.navigate(['/500']);
      //         observer.next(true);
      //       }
      //     }, (ex) => {
      //       if (ex.error == 'Wrong token provided') {
      //         this.global.clearUser();
      //         this._router.navigate(['/login']);

      //       }
      //     });


      //   } else if (checks.takefrmdb) {
      //     observer.next(true);
      //     // that.authser.getSession(function (e) {
      //     //   if (e === 'success') {
      //     //     that.checkMenuAccess(route, state, that._loginservice.getUser(), function (e) {
      //     //       if (e) {
      //     //         observer.next(true);
      //     //       } else {
      //     //         that._msg.Show(messageType.error, 'Error', 'No Access !!!!');
      //     //         that._router.navigate(['/admin/nopage']);
      //     //         observer.next(true);
      //     //       }
      //     //     });
      //     //   } else {
      //     //     that._router.navigate(['login']);
      //     //     observer.next(true);
      //     //   }
      //     // }, checks);
      //   }
      //   else {
      //     that._router.navigate(['/login']);
      //     observer.next(true);
      //   }
    });
  }

  // private checkMenuAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, userdetails, callback) {
  //   var segments = state.url;
  //   var maindata = route.data;

  //   if (maindata.hasOwnProperty('submodule')) {
  //     var module1 = maindata['module'];
  //     var rights = maindata['rights'];
  //     var submodule = maindata['submodule'];

  //     var params = {
  //       'loginid': userdetails.loginid,
  //       'uid': userdetails.uid,
  //       'ucode': userdetails.ucode,
  //       'utype': userdetails.utype,
  //       'ptype': 'p',
  //       'mcode': submodule,
  //       'actcd': rights,
  //       'sessionid': userdetails.sessiondetails.sessionid,
  //       'enttid': userdetails.enttid,
  //       'wsautoid': userdetails.wsautoid,
  //       'issysadmin': userdetails.issysadmin,
  //       'url': segments
  //     };

  //     this.authser.checkmenuaccess(params).subscribe(d => {
  //       if (d.data) {
  //         if (d.data[0].access) {
  //           callback(true);
  //         } else {
  //           callback(false);
  //         }
  //       }
  //     }, error => {
  //       callback(false);
  //     }, () => {

  //     });
  //   } else {
  //     callback(true);
  //     return;
  //   }
  // }





}

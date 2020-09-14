// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoginApiService } from '../../service/login.service';
// import { ToastrService } from 'ngx-toastr';
// import { TranslateService } from '@ngx-translate/core';
// import { Helper } from '../../helper';
// import { HttpClientModule } from '@angular/common/http';
// import { GlobalService } from '../../service/global.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';// for validation
// import { UserModel } from '../../intefaces/userModel';

// export class LoginDetail {
//   username: string;
//   password: string;
// }

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: 'login.component.html'
// })
// export class LoginComponent implements OnInit {

//   form: FormGroup; // for validation
//   objlogindtl = new LoginDetail();
//   lang = [{ id: 'en', name: 'English' }, { id: 'fe', name: 'français' }];
//   helper = {};
//   constructor(private router: Router,
//     private loginService: LoginApiService,
//     private toastr: ToastrService, private translate: TranslateService,
//     private http: HttpClientModule,
//     private global: GlobalService,
//     private fb: FormBuilder) {

//     this.helper = new Helper();
//     localStorage.setItem('lang', 'en');
//     translate.setDefaultLang(localStorage.getItem('lang'));
//   }
//   onSubmit() {
//     this.form.markAsTouched();
//   }
//   onChangeDropDown = function (objData) {
//     this.translate.use(objData.id);
//     localStorage.setItem('lang', objData.id);
//   };

//   ngOnInit() {
//     this.checkIfUserLoggedIn();
//     // this.objlogindtl.username = 'sculptureHospitality@.com';
//     //  this.objlogindtl.password = '12345';
//     $('#username').focus();
//   }

//   validation = function () {
//     if (this.objlogindtl.username === '') {
//       this.toastr.error(this.helper.translate(this.translate, 'Login'), this.helper.translate(this.translate, 'regreg'));
//       return false;
//     } else if (this.objlogindtl.password === '') {
//       this.toastr.error(this.helper.translate(this.translate, 'Login'), this.helper.translate(this.translate, 'regreg'));
//       return false;
//     }
//     return true;
//   };

//   login = function () {
// 
//     localStorage.setItem('outlet', JSON.stringify([]));

//     if (this.validation()) {
//       this.loginService.checkCredential(this.objlogindtl.username, this.objlogindtl.password).subscribe(
//         data => {
//           if (data.resultKey === 1) {
//               const user: UserModel = {
//                 id: data.resultValue.id,
//                 name: data.resultValue.name,
//                 token: data.resultValue.token,
//                 roleid: data.resultValue.role_id,
//                 role: data.resultValue.role,
//                 franchiseid: data.resultValue.franchiseid,
//                 outletid: data.resultValue.outletid,
//                 roletypeid: data.resultValue.roletypeid,
//                 roletype: data.resultValue.roletype,
//                 email: data.resultValue.emailid
//             };
//             this.global.setUser(user);
//             this.router.navigateByUrl('/dashboard');
//           } else {
//             this.toastr.error(data.resultValue, 'Login ', 'error', this.translate);

//           }
//         },
//         error => {
//           this.toastr.error(this.helper.translate(this.translate, 'Login'),
//             this.helper.translate(this.translate, ''));
//         }
//       );
//     }
//   };

//   checkIfUserLoggedIn() {
//     if (this.global.getUser() !== null && this.global.getUser().id !== undefined) {
//       this.router.navigateByUrl('/dashboard');
//       return;
//     }
//   }


// }
import { Component, OnInit } from '@angular/core';
import { Router ,RouterStateSnapshot,ActivatedRoute} from '@angular/router';
import { LoginApiService } from '../../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Helper } from '../../../app/helper';
import { HttpClientModule } from '@angular/common/http';
import { GlobalService } from '../../service/global.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../service/toast-service';
// import { passValidator} from '../modules/validator';
import { Momservice } from '../../service/mom.service';
import { SettingsService } from '../../service/settings.service';
import { UserModel } from '../../intefaces/userModel';
import { SignviewerService } from '../../service/signviewer.service';
 
export class LoginDetail {
  username: string;
  password: string;
  cmpcode: string;
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  providers: [SettingsService]
})
export class LoginComponent implements OnInit {
  contactReportlist: any = [];

  form: FormGroup; // for validation
  objlogindtl = new LoginDetail();
  lang: any = [];
  helper = {};
  envid:any='';
  docid:any=''; 
  cmpid:any='';
  constructor(private router: Router,
    private loginService: LoginApiService,
    private toastr: ToastrService, private translate: TranslateService,
    private http: HttpClientModule,
    public global: GlobalService,
    //private deviceService: DeviceDetectorService,
    private fb: FormBuilder, private message: ToastService,
    private momService: Momservice, private settingService: SettingsService,
    private signviewer: SignviewerService, private activatedRoute: ActivatedRoute
  ) {

    this.helper = new Helper();
    localStorage.setItem('lang', 'en');
    translate.setDefaultLang(localStorage.getItem('lang'));
  }

  onSubmit() {
    this.form.markAsTouched();
  }

  onChangeDropDown = function (objData) {
    this.translate.use(objData.id);
    localStorage.setItem('lang', objData.id);
  };

  ngOnInit() {

    this.envid = this.activatedRoute.snapshot.paramMap.get('envid');
    this.cmpid = this.activatedRoute.snapshot.paramMap.get('cmpid');
    this.docid  = this.activatedRoute.snapshot.paramMap.get('docid');
    $('#username').focus();
   // this.checkIfUserLoggedIn();
    //this.bindLang();
  }

  validation = function () {
    if (this.objlogindtl.username === '') {
      this.toastr.error(this.helper.translate(this.translate, 'loginlogin'), this.helper.translate(this.translate, 'regreg'));
      return false;
    } else if (this.objlogindtl.password === '') {
      this.toastr.error(this.helper.translate(this.translate, 'loginlogin'), this.helper.translate(this.translate, 'regreg'));
      return false;
    }
    return true;
  };


  login(state: RouterStateSnapshot) {
    
    this.signviewer.checkSignvieweruser({
      "operate": 'login',
      "email": this.objlogindtl.username,
      "otp": this.objlogindtl.password,
      'cmpid': 2,
      

    }).subscribe((data: any) => {
      
      if(data.resultKey ==1 ){
      let _data = data.resultValue[0];
      const user: UserModel = {
        email: _data.email,
        key: _data.key,
        id:_data.id
      };
 
      this.global.setUser(user);
      
      let url = this.global.getBackURL();
      this.router.navigate([url]);


    }
    })
  }

  //   login = function () {

  //     this.global.clearUser();
  //     if (this.validation()) {
  //       this.loginService.checkCredential({ email: this.objlogindtl.username, password: this.objlogindtl.password, cmpcode: this.objlogindtl.cmpcode, nocomp: true }).subscribe(
  //         data1 => {

  //           let data = { 'resultValue': data1.resultValue.result, 'resultKey': data1.resultKey }

  //           if (data.resultKey === 1 || data.resultKey === 2) {

  //             const user: UserModel = {
  //               id: data.resultValue.userid,
  //               name: data.resultValue.name,
  //               token: data.resultValue.token,
  //               cmp: data.resultValue.cmp,
  //               usertype:data.resultValue.usertype,
  //               rolename:data.resultValue.rolename
  //             };
  //             if (data.resultValue.cmp)
  //               this.global.setCompany({
  //                 id: data.resultValue.cmp,
  //                 name: data.resultValue.cmpname,
  //                 logo:data.resultValue.logo
  //               });
  //             this.global.setUser(user);
  //             //this.setSetting();
  //             if (data.resultKey === 2) {
  //               this.router.navigateByUrl('/changepassword');
  //               return false;
  //             }
  // 
  //             this.router.navigateByUrl('/sign');

  //           } else {
  //             this.message.show('error', data1.defaultError, 'error', this.translate);
  //           }
  //         },
  //         error => {

  //           this.toastr.error(this.helper.translate(this.translate, 'loginlogin'),
  //             this.helper.translate(this.translate, 'regreg'));
  //         }
  //       );
  //     }
  //   };

  checkIfUserLoggedIn() {

    if (this.global.getUser() !== null && this.global.getUser().id !== undefined) {
      this.router.navigateByUrl('/sign');
      return;
    }

  }

  // setSetting() {
  //   this.settingService.show({
  //     'type': 'GENERAL',
  //     'user_id': this.global.getUser().id
  //   }).subscribe((res: any) => {
  //     if (res.resultKey == 1) {
  //       let data = JSON.parse(res.resultValue.jsondata);
  //       this.global.setEnvData({
  //         'decimal': data.decimal,
  //         'dateformat': data.dateformat,
  //         'defaultCur': data.currency
  //       });
  //     }
  //   })
  // }

  bindLang() {
    this.momService.getLanguage({
      'type': 'ddl',
      'group': 'language'
    }).subscribe((data: any) => {
      if (data.resultKey == 1) {
        this.lang = data.resultValue;
      }
    })
  }
  onLangChange = function (objData) {
    this.translate.use(objData.code);
    localStorage.setItem('lang', objData.code);

  }


}

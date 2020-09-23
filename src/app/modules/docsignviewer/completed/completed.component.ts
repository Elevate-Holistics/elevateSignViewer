import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {
  message:any='';
  type:any='';
  constructor( private router: Router,private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    
  }
ngAfterViewInit(): void {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
  if(this.type =='f'){
this.message='Document Completed!'
  }else if(this.type =='a'){
    this.message='You Have Already Completed The Document !'
  }
}
}

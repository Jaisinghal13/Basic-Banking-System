import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customers=[]
  constructor(private db : AngularFirestore) {
    this.getallcustomerdetails().subscribe(res=>{
      this.customers=res;
    });
   }

  ngOnInit(): void {
  }

  getallcustomerdetails(){
    return this.db.collection("customer").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

}

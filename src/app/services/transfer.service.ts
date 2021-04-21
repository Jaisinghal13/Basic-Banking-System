import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private db:AngularFirestore) { }

  getCustomerById(id){
    return this.db.collection("customer").doc(id).valueChanges()
  }
}

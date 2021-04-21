import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Transfer } from '../models/transfer.model';
import { TransferService } from '../services/transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  customerid;                   //sender id
  currentCustomer;              
  customers=[];
  recepientCustomer = new Transfer();
  receiverCustomer;
  customerid2;                  //receiver id
  currentCustomerId;            //sender customerid
  flag1=0;                      //used in getCustomer()
  flag2=0;                      //used i getallCustomer()
  flag3=0;                      //used i transfer()

  constructor(public transferService:TransferService,public route:ActivatedRoute,private db:AngularFirestore,public router:Router) { 
    console.log("constructor");
    
    this.customerid=this.route.snapshot.paramMap.get("id");
    console.log(this.customerid);
    this.getCustomer();

  }

  ngOnInit(): void {
   // console.log("ngoninit");
  }

  getCustomer(){
    
    this.getCustomerById(this.customerid).subscribe(res=>{
      if(this.flag1==0){
          console.log(res);
          this.flag1=1;
          this.currentCustomer=res;
          this.currentCustomerId=this.currentCustomer.customerid;
          console.log(this.currentCustomerId);
          this.getallCustomer();
      }
      // this.currentCustomer=res;
      // this.currentCustomerId=this.currentCustomer.customerid;
      // console.log(this.currentCustomerId);
      // this.getallCustomer();
   })
    
  }
  // getCustomer(){
  //   this.getCustomerById(this.customerid).subscribe(res=>{
  //     console.log(res)
  //     this.currentCustomer=res;
  //     this.currentCustomerId=this.currentCustomer.customerid;
  //     console.log(this.currentCustomerId);
  //     this.getallCustomer();
  //   })
    

  // }

  getallCustomer(){
    this.getAllCustomerDetailsExceptSender(this.currentCustomerId).subscribe(res=>{
      if(this.flag2==0){
        this.flag2=1;
        console.log(this.currentCustomerId);
        this.customers=res;
        console.log(this.customers);
      }
    });
  }

   getCustomerById(id){
     return this.db.collection("customer").doc(id).valueChanges()
  }

  getAllCustomerDetailsExceptSender(id){
    console.log(id);
    return this.db.collection("customer",ref=>ref.where("customerid","!=",id)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
          return { id, ...data };        
      }))
    );
  }

  transferAmount(){
    console.log("OK");
    if(this.recepientCustomer.amountTransfer<=this.currentCustomer.balance){
      console.log("done OK");
      console.log(this.customerid2);
      this.getCustomerById(this.customerid2).subscribe(res=>{
        if(this.flag3==0){
          this.flag3=1;
          this.receiverCustomer=res; 
          console.log(this.receiverCustomer);   
          this.recepientCustomer.recepientname=this.receiverCustomer.name;
          this.recepientCustomer.recepientCustomerid=this.receiverCustomer.customerid;
          //this.recepientCustomer.recepientemail=this.receiverCustomer.email; 
          console.log(this.receiverCustomer);   
          console.log(this.recepientCustomer);   
          this.recepientCustomer.sendername=this.currentCustomer.name;
          this.recepientCustomer.senderCustomerid=this.currentCustomer.customerid;
         // this.recepientCustomer.senderemail=this.currentCustomer.email;
         //console.log("afd");
            this.addtransfer(this.recepientCustomer).then(res=>{
          console.log("OK");
          this.currentCustomer.balance=this.currentCustomer.balance-this.recepientCustomer.amountTransfer;
          console.log(this.currentCustomer.balance);
          this.receiverCustomer.balance=this.receiverCustomer.balance+this.recepientCustomer.amountTransfer;
          console.log(this.receiverCustomer.balance);
          this.updateCustomer(this.customerid,this.currentCustomer).then(res=>{
            this.updateCustomer(this.customerid2,this.receiverCustomer).then(res=>{
              //console.log(res);
              alert("Transfer Successfully");
              this.router.navigateByUrl("/customer");
              
            })
            })
          })
        
         //this.router.navigateByUrl("/home");
        }
      })
      console.log("afdadfsdf");
    }else{
      alert("Insufficient balance to transfer");
    }
    //console.log(this.recepientCustomer.amountTransfer);
    //if(this.recepientCustomer.amountTransfer<=this.currentCustomer.balance){
      //console.log(this.customerid2);
      // this.getCustomerById(this.customerid2).subscribe(res=>{
      //   this.receiverCustomer=res;  
      //   console.log(this.receiverCustomer);   
        // this.recepientCustomer.recepientname=this.receiverCustomer.name;
        // this.recepientCustomer.recepientCustomerid=this.receiverCustomer.customerid;
        // this.recepientCustomer.recepientemail=this.receiverCustomer.email; 
        // console.log(this.receiverCustomer);   
        // console.log(this.recepientCustomer);   
        // this.recepientCustomer.sendername=this.currentCustomer.name;
        // this.recepientCustomer.senderCustomerid=this.currentCustomer.customerid;
        // this.recepientCustomer.senderemail=this.currentCustomer.email;
        
        // this.addtransfer(this.recepientCustomer).then(res=>{
        //   console.log("OK");
        //   // this.updateCustomer(this.customerid,this.currentCustomer).then(res=>{
        //     this.updateCustomer(this.customerid2,this.receiverCustomer).then(res=>{
        //       this.router.navigateByUrl("/home");
        //     })
        //   })
        // })
      // })
    //}else{
      //alert("Insufficient balance to transfer");
   // }
    
    
    
  }


  addtransfer(transfer:Transfer){
    let newTransferDetails=Object.assign({},transfer)
    console.log(newTransferDetails);
    return this.db.collection("transfer").add(newTransferDetails);
  }


  updateCustomer(id,updateCustomer){
    //return this.db.collection("customer").doc(id).update(Object.assign({},updateExpence))
    console.log(id);
    console.log(updateCustomer);
    return this.db.collection("customer").doc(id).update(Object.assign({},updateCustomer))
  }

}

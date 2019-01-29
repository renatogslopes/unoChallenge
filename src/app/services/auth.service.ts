import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth, private firebaseData: AngularFireDatabase) {
    
  }

  registerNewUser(email,password){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  loginEmail(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password).then(res => {
          resolve(res);
          console.log(res.user);
        }, err => reject(err))
    })
  }

  logoutEmail() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.firebaseAuth.auth.signOut();
        resolve();
      }
      else {
        reject();
      }
    });
  }

  getUsers() {
    return this.firebaseData.list('user').valueChanges();
  }

  getRole() {
    return this.firebaseData.list('role').valueChanges();
  }

  createItem(itemType, item) {
    return this.firebaseData.list(itemType).push(item);
  }

  deleteItem(itemType, item) {
    return new Promise<any>((resolve, reject) => {
      this.firebaseData.list(itemType).remove(item).then(res => {
        resolve(res);
      }, err => reject(err))
    });
  }

  updateIDItem(itemType, item, key) {
    return new Promise<any>((resolve, reject) => {
      this.firebaseData.list(itemType).update(key, item ).then(res => {
        resolve(res);
      }, err => reject(err))
    });
  }

  updateItem(itemType, item, key) {
    return new Promise<any>((resolve, reject) => {
      this.firebaseData.list(itemType).update(key, item ).then(res => {
        resolve(res);
      }, err => reject(err))
    });
  }

}

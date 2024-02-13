import { Injectable } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, } from '@angular/fire/auth';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  initAuthListener() {
    authState(this.auth).subscribe( (fuser) => {
      console.log( fuser );
      console.log( fuser?.uid );
      console.log( fuser?.email );
    })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth,email, password)
    .then(({user}) => {
      const newUser = new Usuario(user.uid, nombre, email);
      const userRef = doc(this.firestore, `${user.uid}/usuario`);
      return setDoc(userRef, { ...newUser });
    });
  }
  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut() {
    return this.auth.signOut();
  }
  isAuth() {
    return authState(this.auth).pipe(
      map( fbUser => fbUser != null )
    );
  }
}

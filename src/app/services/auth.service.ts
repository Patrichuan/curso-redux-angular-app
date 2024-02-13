import { Injectable } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, } from '@angular/fire/auth';
import { Subscription, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { AppState } from '../shared/redux/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { setUser, unSetUser } from '../shared/redux/actions/auth.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

userSubscription: Subscription = new Subscription();

  constructor(private auth: Auth, private firestore: Firestore, private store: Store<AppState>) { }

  initAuthListener() {
    authState(this.auth).subscribe(
       (fuser) => {
      if (fuser) {
        const userRef = doc(this.firestore, `${fuser.uid}/usuario`);
        this.userSubscription = docData(userRef).subscribe(firestoreUser => {
          console.log(firestoreUser);
          const user = Usuario.fromFirebase(firestoreUser);
          this.store.dispatch(setUser({ user }));
        });
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(unSetUser());
      }

    });
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

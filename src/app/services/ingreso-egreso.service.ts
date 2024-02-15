import { Injectable } from '@angular/core';
import { AppState } from '../shared/redux/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { Observable, Subscription, map } from 'rxjs';
import { Firestore, collection, doc, addDoc, collectionData, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  ingresoEgresoSubscription: Subscription = new Subscription();

  constructor(private firestore: Firestore, private store: Store<AppState>, private authService: AuthService) {}

  crearIngreoEgreso(ingresoEgreso: IngresoEgreso) {
    ingresoEgreso.uid = this.authService.user?.uid;
    const userRef = doc(this.firestore, `/${this.authService.user?.uid}/ingresos-egresos`);
    const itemCollection = collection(userRef, 'items');
    return addDoc(itemCollection,{...ingresoEgreso});
  }

  initIngresoEgresoListener(uidUser: string): Observable<IngresoEgreso[]> {
    const itemsCollection = collection(this.firestore, `/${uidUser}/ingresos-egresos/items`);

    return collectionData(itemsCollection, { idField: 'id' })
    .pipe(
      map((snapshot: any) => {
        return snapshot.map((doc: any) => {
          const field: IngresoEgreso = IngresoEgreso.ingresoEgresofromFirebase({descripcion: doc.descripcion, monto: doc.monto, tipo: doc.tipo, uid: doc.id})
          return field;
        });
      })
    );
  }

  borrarIngresoEgreso(uidItem: string): Promise<void> {
    const userRef = doc(this.firestore, `/${this.authService.user?.uid}/ingresos-egresos/items/${uidItem}`);
    return deleteDoc(userRef);
  }
}


import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/redux/reducers/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { OrdenIngresoPipe } from '../../shared/pipes/orden-ingreso.pipe';


@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OrdenIngresoPipe],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) {}

  ngOnInit(): void {
    this.ingresosEgresosSubs =
      this.store.select('ingresosEgresos').subscribe(({ items }) => {
        this.ingresosEgresos = items;
      });
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  borrar(uid: string): void {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
    .then(() => {
      Swal.fire('Borrado', 'Item borrado', 'success');
    })
    .catch((err: any) => {
      Swal.fire('Error', err.message, 'error');
    });
  }

}

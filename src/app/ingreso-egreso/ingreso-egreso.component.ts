import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../shared/redux/reducers/app.reducer';
import { Store } from '@ngrx/store';
import * as ui from '../shared/redux/actions/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingreso-egreso.component.html',
  styleUrl: './ingreso-egreso.component.scss'
})
export class IngresoEgresoComponent implements OnInit, OnDestroy  {
  ingresoForm: FormGroup = new FormGroup({});
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingSubscription = this.store.select('ui').subscribe((ui) => { this.cargando = ui.isLoading; });
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

  guardar() {

    if (this.ingresoForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    const { descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo, null as any);
    this.ingresoEgresoService.crearIngreoEgreso(ingresoEgreso)
    .then(() => {
      this.ingresoForm.reset();
      this.store.dispatch(ui.stopLoading());
      Swal.fire('Registro creado', descripcion, 'success');
    })
    .catch((err: any) => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire('Error', err.message, 'error');
    });
  }

}

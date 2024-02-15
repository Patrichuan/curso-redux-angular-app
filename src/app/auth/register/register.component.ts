import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { checkValidField } from '../helper/auth.helper';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';
import { AppState } from '../../shared/redux/reducers/app.reducer';
import { Store } from '@ngrx/store';
import * as actions from '../../shared/redux/actions/ui.actions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup = new FormGroup({});
  cargando: boolean = false;
  iuSubscription: Subscription = new Subscription();
  isShowPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });

    this.iuSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }
  ngOnDestroy(): void {
    this.iuSubscription.unsubscribe();
}

  crearUsuario() {
    if (this.registroForm.invalid) {  return; }
    this.store.dispatch(actions.isLoading());
    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
    .then(() => {
      this.store.dispatch(actions.stopLoading());
      this.router.navigate(['/']);
    })
    .catch((err: any) => {
      this.store.dispatch(actions.stopLoading());
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
     });
  }

  checkValidFieldRegister(field: string): boolean{
    return checkValidField(this.registroForm, field);
  }

  togglePasswordVisibility() {
    const password = document.getElementById('password');
    if (password) {
      if (password.getAttribute('type') === 'password') {
        password.setAttribute('type', 'text');
        this.isShowPassword = true;
      } else {
        password.setAttribute('type', 'password');
        this.isShowPassword = false;
      }
    }
  }
}


import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { checkValidField } from '../helper/auth.helper';
import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/redux/reducers/app.reducer';
import * as actions from '../../shared/redux/actions/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = new FormGroup({});
  cargando: boolean = false;
  iuSubscription: Subscription = new Subscription();
  isShowPassword: boolean = false;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });

    this.iuSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
      this.iuSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) {  return; }

    this.store.dispatch(actions.isLoading());

    const { email, password } = this.loginForm.value;

    this.authService.loginUsuario(email, password)
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
    return checkValidField(this.loginForm, field);
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

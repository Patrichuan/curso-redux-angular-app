import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { checkValidField } from '../helper/auth.helper';
import Swal from 'sweetalert2'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {  return; }

    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
    .then((credenciales: any) => {
      console.log(credenciales);
      this.router.navigate(['/']);
    })
    .catch((err: any) => {
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
}

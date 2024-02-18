import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../redux/reducers/app.reducer';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombreUsuario: string = '';
  userSubscription: Subscription = new Subscription();
  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubscription = this.store.select('user')
    .pipe(
      filter(({user}) => user !== null)
    )
    .subscribe(({user}) => {
      this.nombreUsuario = user.nombre;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogOut() {
    return this.authService.logOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}

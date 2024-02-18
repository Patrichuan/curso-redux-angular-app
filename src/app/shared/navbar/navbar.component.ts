import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { AppState } from '../redux/reducers/app.reducer';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  nombreUsuario: string = '';
  userSubscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
    .pipe(
      filter(({user}) => user !== null)
    )
    .subscribe(({user}) => {
      this.nombreUsuario = user.nombre;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}

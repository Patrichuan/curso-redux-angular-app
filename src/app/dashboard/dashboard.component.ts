import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/redux/reducers/app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { setItems } from '../shared/redux/actions/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterOutlet, SidebarComponent,NavbarComponent, FooterComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy{
  userSubs: Subscription = new Subscription();
  ingresosEgresosSubs: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.userSubs = this.store.select('user')
      .pipe(
        filter(user => user.user != null)
      )
      .subscribe(({user}) => {
        this.ingresosEgresosSubs = this.ingresoEgresoService.initIngresoEgresoListener(user?.uid)
        .subscribe((ingresosEgresosFB: IngresoEgreso[]) => {
          this.store.dispatch(setItems({items: ingresosEgresosFB}));
        });
      });
  }

  ngOnDestroy() {
    this.ingresosEgresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }


}

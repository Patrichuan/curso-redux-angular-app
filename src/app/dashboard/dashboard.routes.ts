import { Routes } from "@angular/router";


export const dashboardRoutes: Routes = [
  { path: '', loadComponent:() => import('../ingreso-egreso/estadistica/estadistica.component').then(m=> m.EstadisticaComponent)},
  { path: 'estadistica', loadComponent:() => import('../ingreso-egreso/estadistica/estadistica.component').then(m=> m.EstadisticaComponent) },
  { path: 'ingreso-egreso', loadComponent:() => import('../ingreso-egreso/ingreso-egreso.component').then(m=> m.IngresoEgresoComponent) },
  { path: 'detalle', loadComponent:() => import('../ingreso-egreso/detalle/detalle.component').then(m=> m.DetalleComponent)},
];

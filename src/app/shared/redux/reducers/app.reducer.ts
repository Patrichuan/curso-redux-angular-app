import { ActionReducerMap } from '@ngrx/store';
import * as ui  from './ui.reducer';
import * as auth from './auth.reducer';
import * as ingresoEgresoReducer from './ingreso-egreso.reducer';


export interface AppState {
   ui: ui.State;
   user: auth.State;
   ingresosEgresos: ingresoEgresoReducer.State;
}



export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  user: auth.authReducer,
  ingresosEgresos: ingresoEgresoReducer.ingresoEgresoReducer
}

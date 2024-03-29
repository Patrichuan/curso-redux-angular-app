import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso',
  standalone: true
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return items.slice().sort((a, b) => {
      return a.tipo === 'ingreso' ? -1 : 1;
    });
  }

}

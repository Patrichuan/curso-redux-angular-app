import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/redux/reducers/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-estadistica',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './estadistica.component.html',
  styleUrl: './estadistica.component.scss'
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  public doughnutChartLabels: string[] = [
    'Ingreso',
    'Egreso',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [] },
    ],
  };

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1 // Ajusta este valor según sea necesario para cambiar el tamaño
  };

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('ingresosEgresos')
    .subscribe((ingresoEgreso: any) => this.contarIngresoEgreso(ingresoEgreso.items));
  }

  ngOnDestroy(): void {
  }

  contarIngresoEgreso(items: IngresoEgreso[]) {
    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    items.forEach(item => {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    });
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: [this.totalIngresos, this.totalEgresos] ,
          backgroundColor: ['#b0f2c2', '#ffe4e1']
        },
      ],
    };
  }
}

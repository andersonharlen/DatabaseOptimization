import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService } from './services/performance.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px;">
      <h1 style="color: #333;">Database Optimization Dashboard</h1>
      <p style="color: #666;">Painel comparativo de performance: Consultas pesadas vs. Consultas Otimizadas com Índices.</p>

      <div style="display: flex; gap: 20px; margin-top: 30px;">
        <!-- Card Lento -->
        <div style="flex: 1; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #fff5f5;">
          <h3 style="color: #c53030;">Consulta Não Otimizada</h3>
          <p style="font-size: 14px; color: #4a5568;">Executa varredura sequencial (Seq Scan) em centenas de milhares de linhas.</p>
          <button (click)="testSlow()" [disabled]="loadingSlow" style="background: #e53e3e; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">
            {{ loadingSlow ? 'Executando...' : 'Rodar Query Lenta' }}
          </button>
          
          <div *ngIf="slowResult" style="margin-top: 15px; font-weight: bold;">
            Tempo: <span style="color: #c53030; font-size: 18px;">{{ slowResult.executionTimeMs }} ms</span>
          </div>
        </div>

        <!-- Card Otimizado -->
        <div style="flex: 1; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f0fff4;">
          <h3 style="color: #276749;">Consulta Otimizada</h3>
          <p style="font-size: 14px; color: #4a5568;">Utiliza Índices de Cobertura e filtragem cirúrgica (Index Scan).</p>
          <button (click)="testOptimized()" [disabled]="loadingOpt" style="background: #38a169; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">
            {{ loadingOpt ? 'Executando...' : 'Rodar Query Otimizada' }}
          </button>

          <div *ngIf="optResult" style="margin-top: 15px; font-weight: bold;">
            Tempo: <span style="color: #276749; font-size: 18px;">{{ optResult.executionTimeMs }} ms</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  loadingSlow = false;
  loadingOpt = false;
  slowResult: any = null;
  optResult: any = null;

  constructor(private performanceService: PerformanceService) {}

  testSlow() {
    this.loadingSlow = true;
    this.slowResult = null;
    this.performanceService.runSlowQuery().subscribe({
      next: (res) => {
        this.slowResult = res;
        this.loadingSlow = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingSlow = false;
        alert('Erro ao conectar com a API. Verifique se o backend está rodando.');
      }
    });
  }

  testOptimized() {
    this.loadingOpt = true;
    this.optResult = null;
    this.performanceService.runOptimizedQuery().subscribe({
      next: (res) => {
        this.optResult = res;
        this.loadingOpt = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingOpt = false;
        alert('Erro ao conectar com a API. Verifique se o backend está rodando.');
      }
    });
  }
}
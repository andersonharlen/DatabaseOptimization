import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 1100px; margin: 30px auto; padding: 20px; color: #2d3748;">
      
      <!-- Cabeçalho com Botão de Prova do Banco -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <h1 style="color: #1a202c; margin-bottom: 5px;">Database Performance Engineering</h1>
          <p style="color: #718096; margin-top: 0;">Análise avançada de custos, planos de execução e estratégias de indexação.</p>
        </div>
        <button (click)="checkDatabase()" style="background: #234e52; color: #38b2ac; border: 1px solid #319795; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">
          Verificar Conexão com o Banco
        </button>
      </div>

      <!-- Seletor de Cenários de Otimização -->
      <div style="background: #e2e8f0; padding: 12px 15px; border-radius: 8px; margin-top: 20px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <label style="font-weight: bold; color: #2d3748; font-size: 14px;">Problema Analisado:</label>
        <button (click)="selectedScenario = 'index'"
                [style.background]="selectedScenario === 'index' ? '#2b6cb0' : 'white'"
                [style.color]="selectedScenario === 'index' ? 'white' : '#2d3748'"
                style="border: 1px solid #cbd5e0; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
          1. Full Table Scan & Índices
        </button>
        <button (click)="selectedScenario = 'n-plus-one'"
                [style.background]="selectedScenario === 'n-plus-one' ? '#2b6cb0' : 'white'"
                [style.color]="selectedScenario === 'n-plus-one' ? 'white' : '#2d3748'"
                style="border: 1px solid #cbd5e0; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
          2. O Problema N+1 (ORM)
        </button>
        <button (click)="selectedScenario = 'pagination'"
                [style.background]="selectedScenario === 'pagination' ? '#2b6cb0' : 'white'"
                [style.color]="selectedScenario === 'pagination' ? 'white' : '#2d3748'"
                style="border: 1px solid #cbd5e0; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
          3. Paginação (OFFSET vs Keyset)
        </button>
      </div>

      <!-- Seletor de Dataset Scaling e Botão de Execução -->
      <div style="background: #edf2f7; padding: 15px; border-radius: 8px; margin-top: 15px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
        <label style="font-weight: bold; color: #2d3748;">Tamanho do Dataset:</label>
        <div style="display: flex; gap: 10px;">
          <button *ngFor="let size of ['10K', '100K', '1M', '5M']" 
                  (click)="selectedSize = size"
                  [style.background]="selectedSize === size ? '#3182ce' : 'white'"
                  [style.color]="selectedSize === size ? 'white' : '#2d3748'"
                  style="border: 1px solid #cbd5e0; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-weight: bold;">
            {{ size }}
          </button>
        </div>

        <button (click)="runBenchmark()" [disabled]="loading" style="background: #2b6cb0; color: white; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-left: auto;">
          {{ loading ? 'Executando...' : 'Executar Benchmark' }}
        </button>
      </div>

      <!-- Cards de Comparação -->
      <div style="display: flex; gap: 20px; margin-top: 25px;">
        <!-- ANTES -->
        <div style="flex: 1; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #fff5f5; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #c53030; margin-top: 0;">ANTES (Original)</h3>
          <div style="margin: 15px 0; font-size: 14px; background: white; padding: 12px; border-radius: 6px; border: 1px solid #fed7d7;">
            <div>Tempo de Consulta: <span style="color: #c53030; font-size: 18px; font-weight: bold;">{{ result?.slow?.executionTimeMs || 0 }} ms</span></div>
            <div>Linhas Varridas: {{ result?.slow?.rows || '-' }}</div>
            <div>Tipo de Nó: {{ result?.slow?.executionPlan || '-' }}</div>
            <div>Custo: {{ result?.slow?.cost || '-' }}</div>
          </div>
          <button (click)="showSql('slow')" style="background: #718096; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Ver SQL Original
          </button>
        </div>

        <!-- DEPOIS -->
        <div style="flex: 1; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #f0fff4; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #276749; margin-top: 0;">DEPOIS (Otimizado)</h3>
          <div style="margin: 15px 0; font-size: 14px; background: white; padding: 12px; border-radius: 6px; border: 1px solid #c6f6d5;">
            <div>Tempo de Consulta: <span style="color: #276749; font-size: 18px; font-weight: bold;">{{ result?.optimized?.executionTimeMs || 0 }} ms</span></div>
            <div>Linhas Processadas: {{ result?.optimized?.rows || '-' }}</div>
            <div>Tipo de Nó: {{ result?.optimized?.executionPlan || '-' }}</div>
            <div>Custo: {{ result?.optimized?.cost || '-' }}</div>
            
            <div *ngIf="result" style="margin-top: 10px; border-top: 1px dashed #cbd5e0; padding-top: 8px; color: #2b6cb0; font-weight: bold;">
              {{ getTranslatedMultiplier() }}<br>
              {{ getTranslatedImprovement() }}
            </div>
          </div>
          <button (click)="showSql('optimized')" style="background: #38a169; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Ver SQL Otimizado
          </button>
        </div>
      </div>

      <!-- Detalhes da Estratégia -->
      <div style="margin-top: 25px; background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #2d3748; font-size: 16px;">Estratégia de Resolução Aplicada</h3>
        <pre style="background: #1a202c; color: #4fd1c5; padding: 12px; border-radius: 6px; font-size: 13px; overflow-x: auto;">{{ result?.optimized?.indexDdl || 'Nenhum índice aplicado ainda.' }}</pre>
        <div style="display: flex; gap: 30px; font-size: 14px; margin-top: 10px; color: #4a5568;">
          <div>Mecanismo: <span style="color: #2b6cb0; font-weight: bold;">{{ result?.optimized?.indexName || '-' }}</span></div>
          <div>Referência: <span style="color: #2b6cb0; font-weight: bold;">{{ result?.optimized?.indexColumns || '-' }}</span></div>
        </div>
      </div>

      <!-- Gráfico Comparativo Visual -->
      <div style="margin-top: 25px; background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #2d3748; font-size: 16px;">Gráfico Comparativo de Desempenho (ms)</h3>
        <div style="margin-top: 15px;">
          <div style="font-size: 13px; margin-bottom: 4px; font-weight: bold; color: #c53030;">Antes: {{ result?.slow?.executionTimeMs || 0 }} ms</div>
          <div style="background: #edf2f7; border-radius: 4px; height: 22px; width: 100%; overflow: hidden;">
            <div style="width: 100%; background: #e53e3e; height: 100%;"></div>
          </div>
        </div>
        <div style="margin-top: 15px;">
          <div style="font-size: 13px; margin-bottom: 4px; font-weight: bold; color: #276749;">Depois: {{ result?.optimized?.executionTimeMs || 0 }} ms</div>
          <div style="background: #edf2f7; border-radius: 4px; height: 22px; width: 100%; overflow: hidden;">
            <div [style.width.%]="getOptimizedBarWidth()" style="background: #38a169; height: 100%; transition: width 0.5s;"></div>
          </div>
        </div>
      </div>

      <!-- Modal de Inspeção do Banco de Dados -->
      <div *ngIf="showDbModal" style="margin-top: 25px; background: #1a202c; color: white; padding: 20px; border-radius: 8px; border: 1px solid #319795;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <strong style="color: #4fd1c5; font-size: 16px;">Auditoria do Banco de Dados (PostgreSQL)</strong>
          <button (click)="showDbModal = false" style="background: transparent; color: white; border: none; cursor: pointer; font-weight: bold;">✕ Fechar</button>
        </div>
        <div *ngIf="dbInfo; else loadingDb" style="font-size: 13px; color: #e2e8f0; line-height: 1.6;">
          <div>Status: <span style="color: #68d391; font-weight: bold;">{{ dbInfo.status }}</span></div>
          <div>Provedor: <span style="color: #63b3ed;">{{ dbInfo.provider }}</span></div>
          <div>Nome do Banco: <span style="color: #63b3ed;">{{ dbInfo.databaseName }}</span></div>
          <div>Versão do PostgreSQL: <span style="color: #f6ad55;">{{ dbInfo.version }}</span></div>
          <div style="margin-top: 8px; border-top: 1px solid #4a5568; padding-top: 8px;">
            <strong>Massa de Dados Ativa nas Tabelas:</strong>
            <div>• Tabela Customers: {{ dbInfo.tables.customers }} registros</div>
            <div>• Tabela Orders: {{ dbInfo.tables.orders }} registros</div>
          </div>
        </div>
        <ng-template #loadingDb>
          <div style="color: #a0aec0; font-size: 13px;">Consultando metadados do banco de dados...</div>
        </ng-template>
      </div>

      <!-- Visualizador de SQL -->
      <div *ngIf="activeSqlModal" style="margin-top: 25px; background: #2d3748; color: white; padding: 15px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #4fd1c5;">Visualizador SQL ({{ modalType | uppercase }})</strong>
          <button (click)="activeSqlModal = false" style="background: transparent; color: white; border: none; cursor: pointer; font-weight: bold;">✕ Fechar</button>
        </div>
        <pre style="margin: 0; font-size: 12px; color: #e2e8f0; overflow-x: auto;">{{ modalSqlContent }}</pre>
      </div>
    </div>
  `
})
export class App {
  selectedSize = '1M';
  selectedScenario = 'index';
  loading = false;
  result: any = null;
  
  activeSqlModal = false;
  modalType = '';
  modalSqlContent = '';

  showDbModal = false;
  dbInfo: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  runBenchmark() {
    this.loading = true;
    this.http.get(`https://databaseoptimization.onrender.com/api/performance/benchmark?size=${this.selectedSize}&scenario=${this.selectedScenario}`).subscribe({
      next: (res: any) => {
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  checkDatabase() {
    this.showDbModal = true;
    this.dbInfo = null;
    this.http.get('http://localhost:5007/api/performance/database-info').subscribe({
      next: (res: any) => {
        this.dbInfo = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.dbInfo = { status: 'Erro ao conectar com o banco', version: err.message, tables: { customers: 0, orders: 0 } };
        this.cdr.detectChanges();
      }
    });
  }

  getTranslatedMultiplier(): string {
    if (!this.result?.metrics?.multiplierFormatted) return '';
    const numericPart = this.result.metrics.multiplierFormatted.replace('× faster', '').trim();
    return `${numericPart}× mais rápido`;
  }

  getTranslatedImprovement(): string {
    if (!this.result?.metrics?.improvementPercentFormatted) return '';
    const numericPart = this.result.metrics.improvementPercentFormatted.replace('lower execution time', '').trim();
    return `${numericPart} menor tempo de execução`;
  }

  getOptimizedBarWidth(): number {
    if (!this.result || !this.result.slow || !this.result.optimized) return 0;
    const slow = this.result.slow.executionTimeMs;
    const opt = this.result.optimized.executionTimeMs;
    const ratio = (opt / slow) * 100;
    return ratio < 2 ? 2 : ratio;
  }

  showSql(type: string) {
    this.modalType = type;
    this.modalSqlContent = type === 'slow' ? this.result?.slow?.sql : this.result?.optimized?.sql;
    this.activeSqlModal = true;
  }
}

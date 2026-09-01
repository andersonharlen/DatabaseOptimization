import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(private http: HttpClient) { }

  runBenchmark(size: string, scenario: string): Observable<any> {
    const params = new HttpParams()
      .set('size', size)
      .set('scenario', scenario);
    
    return this.http.get('https://databaseoptimization.onrender.com/api/performance/benchmark', { params });
  }

  getDatabaseInfo(): Observable<any> {
    return this.http.get('https://databaseoptimization.onrender.com/api/performance/database-info');
  }
}

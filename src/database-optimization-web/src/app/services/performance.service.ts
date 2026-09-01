import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = 'http://localhost:5007/api/performance';

  constructor(private http: HttpClient) {}

  runSlowQuery(): Observable<any> {
    return this.http.get(`${this.apiUrl}/slow`);
  }

  runOptimizedQuery(): Observable<any> {
    return this.http.get(`${this.apiUrl}/optimized`);
  }
}
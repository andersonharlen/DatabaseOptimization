import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = 'https://databaseoptimization.onrender.com';

  constructor(private http: HttpClient) {}

  runSlowQuery(): Observable<any> {
    return this.http.get(`${this.apiUrl}/slow`);
  }

  runOptimizedQuery(): Observable<any> {
    return this.http.get(`${this.apiUrl}/optimized`);
  }
}

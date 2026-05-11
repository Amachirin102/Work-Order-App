import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { WorkOrder, DashboardStats } from '../models/work-order.model';

const REQUEST_TIMEOUT_MS = 10_000;

export interface WorkOrderFilters {
  status?: string;
  priority?: string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  private apiUrl = 'http://localhost:5137/api/workorders';

  constructor(private http: HttpClient) {}

  getAll(filters: WorkOrderFilters = {}): Observable<WorkOrder[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.search) params = params.set('search', filters.search);

    return this.http
      .get<WorkOrder[]>(this.apiUrl, { params })
      .pipe(timeout(REQUEST_TIMEOUT_MS), catchError(this.handleError('getAll')));
  }

  getById(id: number): Observable<WorkOrder> {
    return this.http
      .get<WorkOrder>(`${this.apiUrl}/${id}`)
      .pipe(timeout(REQUEST_TIMEOUT_MS), catchError(this.handleError('getById')));
  }

  getStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.apiUrl}/stats`)
      .pipe(timeout(REQUEST_TIMEOUT_MS), catchError(this.handleError('getStats')));
  }

  create(workOrder: WorkOrder): Observable<WorkOrder> {
    return this.http
      .post<WorkOrder>(this.apiUrl, workOrder)
      .pipe(timeout(REQUEST_TIMEOUT_MS), catchError(this.handleError('create')));
  }

  update(id: number, workOrder: WorkOrder): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${id}`, workOrder)
      .pipe(timeout(REQUEST_TIMEOUT_MS), catchError(this.handleError('update')));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(timeout(REQUEST_TIMEOUT_MS), catchError(this.handleError('delete')));
  }

  private handleError(op: string) {
    return (err: unknown) => {
      let message = `Request failed (${op})`;
      if (err instanceof HttpErrorResponse) {
        if (err.status === 0) {
          message =
            'Cannot reach the API server at http://localhost:5137. ' +
            'Please make sure the backend is running (`dotnet run` from the backend folder).';
        } else {
          message = `${op} failed: ${err.status} ${err.statusText || ''} ${err.message || ''}`.trim();
        }
      } else if (err instanceof Error) {
        if (err.name === 'TimeoutError') {
          message = `${op} timed out after ${REQUEST_TIMEOUT_MS / 1000}s. The backend may be unresponsive.`;
        } else {
          message = `${op} failed: ${err.message}`;
        }
      }
      console.error(`[WorkOrderService] ${message}`, err);
      return throwError(() => new Error(message));
    };
  }
}

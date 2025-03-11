import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  URL = `${environment.apiUrl}/workers`;

  constructor(private http: HttpClient) { }

  getWorkers(): Observable<WorkerWithDetailsDto[]> {
    return this.http.get<WorkerWithDetailsDto[]>(this.URL).pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Ошибки на стороне клиента
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Ошибки на стороне сервера
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // Возвращаем ошибку в виде Observable
    return throwError(() => new Error(errorMessage));
  }
}

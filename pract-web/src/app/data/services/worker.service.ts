import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkerDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private URL = `${environment.apiUrl}/workers`;

  constructor(private http: HttpClient) { }

  getWorkers(): Observable<WorkerWithDetailsDto[]> {
    return this.http
      .get<WorkerWithDetailsDto[]>(this.URL)
      .pipe(catchError(this.handleError));
  }

  putWorker(id: string, workerName: WorkerDto): Observable<WorkerDto> {
    const apiURL = `${this.URL}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http
      .put<WorkerDto>(apiURL, workerName, httpOptions)
      .pipe(catchError(this.handleError));
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

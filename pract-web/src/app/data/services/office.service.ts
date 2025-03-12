import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { OfficeHistoryDto } from '@models/office-dtos';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private URL = `${environment.apiUrl}/offices`

  constructor(private http: HttpClient) { }

  getHistoryOfficeForWorker(id: string): Observable<OfficeHistoryDto[]> {
    const resultUrl = `${this.URL}/workers/${id}`;
    return this.http
      .get<OfficeHistoryDto[]>(resultUrl)
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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Office, OfficeHistoryDto } from '@models/office-dtos';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private URL = `${environment.apiUrl}/offices`

  constructor(private http: HttpClient) { }

  getOffices(): Observable<Office[]> {
    return this.http
      .get<Office[]>(this.URL)
      .pipe(catchError(this.handleError));
  }

  putOffice(id: string, office: Office) {
    const resultUrl = `${this.URL}/${id}`;
    return this.http
      .put(resultUrl, office)
      .pipe(catchError(this.handleError));
  }

  deleteOffice(id: string) {
    const resultUrl = `${this.URL}/${id}`;
    return this.http
      .delete(resultUrl)
      .pipe(catchError(this.handleError));
  }

  getHistoryOfficeForWorker(id: string): Observable<OfficeHistoryDto[]> {
    const resultUrl = `${this.URL}/workers/${id}`;
    return this.http
      .get<OfficeHistoryDto[]>(resultUrl)
      .pipe(catchError(this.handleError));
  }

  deleteOfficeWorker(id: string) {
    const resultUrl = `${this.URL}/workers/${id}`;
    return this.http
      .delete(resultUrl)
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

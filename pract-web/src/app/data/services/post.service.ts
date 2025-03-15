import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Post, PostHistoryDto } from '@models/post-dtos';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private URL = `${environment.apiUrl}/posts`

  constructor(private http: HttpClient) { }

  getPost(): Observable<Post[]> {
    return this.http
    .get<Post[]>(this.URL)
    .pipe(catchError(this.handleError));
  }

  getHistoryPostForWorker(id: string): Observable<PostHistoryDto[]> {
    const resultUrl = `${this.URL}/workers/${id}`;
    return this.http
      .get<PostHistoryDto[]>(resultUrl)
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

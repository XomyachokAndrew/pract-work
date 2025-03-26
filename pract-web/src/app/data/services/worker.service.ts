import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkerDto, WorkerOfficeDto, WorkerPostDto, WorkerWithDetailsDto, WorkerWithPostDto } from '@models/workers-dtos';
import { environment } from '@env/environment';

/**
 * Сервис для работы с работниками.
 * Обеспечивает методы для получения, обновления, создания и удаления работников, а также для работы с их должностями и офисами.
 */
@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private URL = `${environment.apiUrl}/workers`;

  constructor(private http: HttpClient) { }

  /**
   * Получает список всех работников с деталями.
   * @returns Observable, который возвращает массив WorkerWithDetailsDto.
   */
  getWorkers(): Observable<WorkerWithDetailsDto[]> {
    return this.http
      .get<WorkerWithDetailsDto[]>(this.URL)
      .pipe(catchError(this.handleError));
  }

  /**
   * Получает список работников в указанном офисе.
   * @param id Идентификатор офиса.
   * @returns Observable, который возвращает массив WorkerWithPostDto или null.
   */
  getWorkersInOffice(id: string): Observable<WorkerWithPostDto[] | null> {
    const resultUrl = `${this.URL}/offices/${id}`;
    return this.http
      .get<WorkerWithPostDto[]>(resultUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Обновляет данные работника.
   * @param id Идентификатор работника.
   * @param workerName Объект WorkerDto с новыми данными работника.
   * @returns Observable, который возвращает обновленный объект WorkerDto.
   */
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

  /**
   * Создает новую должность для работника.
   * @param workerPost Объект WorkerPostDto с данными новой должности.
   * @returns Observable, который возвращает созданный объект WorkerPostDto.
   */
  putPostWorker(workerPost: WorkerPostDto): Observable<WorkerPostDto> {
    const apiURL = `${this.URL}/posts`;

    return this.http
      .post<WorkerPostDto>(apiURL, workerPost)
      .pipe(catchError(this.handleError));
  }

  /**
   * Создает новый офис для работника.
   * @param workerOffice Объект WorkerOfficeDto с данными нового офиса.
   * @returns Observable, который возвращает созданный объект WorkerOfficeDto.
   */
  putOfficeWorker(workerOffice: WorkerOfficeDto): Observable<WorkerOfficeDto> {
    const apiURL = `${this.URL}/offices`;

    return this.http
      .post<WorkerOfficeDto>(apiURL, workerOffice)
      .pipe(catchError(this.handleError));
  }

  /**
   * Создает нового работника.
   * @param workerDto Объект WorkerDto с данными нового работника.
   * @returns Observable, который возвращает созданный объект WorkerDto.
   */
  postWorker(workerDto: WorkerDto): Observable<WorkerDto> {
    return this.http
      .post<WorkerDto>(this.URL, workerDto)
      .pipe(catchError(this.handleError));
  }

  /**
   * Удаляет работника по его идентификатору.
   * @param id Идентификатор работника.
   * @returns Observable, который уведомляет об успешном удалении.
   */
  deleteWorker(id: string) {
    const resultUrl = `${this.URL}/${id}`;
    return this.http
      .delete(resultUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Обрабатывает ошибки HTTP-запросов.
   * @param error Объект HttpErrorResponse, содержащий информацию об ошибке.
   * @returns Observable, который возвращает сообщение об ошибке.
   */
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

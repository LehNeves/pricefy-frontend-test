import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

import { Observable, tap } from 'rxjs';

import { ICategoria, IPromocao } from './promocao.interface';

@Injectable({
  providedIn: 'root'
})
export class PromocaoService {

  constructor(private http: HttpClient) { }

  getPromocoes(): Observable<IPromocao[]> {
    return this.http.get<IPromocao[]>(environment.apiUrl + "promocao").pipe(
      tap(promocoes =>
        promocoes.forEach(promocao => {
          promocao.dataInicial = new Date(promocao.dataInicial);
          promocao.dataFinal = new Date(promocao.dataFinal);
        })
      )
    );
  }

  getPromocao(id: number): Observable<IPromocao> {
    return this.http.get<IPromocao>(environment.apiUrl + "promocao" + `/${id}`).pipe(
      tap(promocao => {
        promocao.dataInicial = new Date(promocao.dataInicial);
        promocao.dataFinal = new Date(promocao.dataFinal);
      })
    );
  }

  getCategorias(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(environment.apiUrl + "categoria");
  }

  postPromocao(body: IPromocao): Observable<IPromocao> {
    return this.http.post<IPromocao>(environment.apiUrl + "promocao", body);
  }

  deletePromocao(id: number): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + "promocao" + `/${id}`);
  }

  putPromocao(body: IPromocao): Observable<IPromocao> {
    return this.http.put<IPromocao>(environment.apiUrl + "promocao" + `/${body.id!}`, body);
  }
}

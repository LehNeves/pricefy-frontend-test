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

  postPromocao(body: IPromocao): Observable<IPromocao> {
    return this.http.post<IPromocao>(environment.apiUrl + "promocao", body);
  }

  getCategorias(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(environment.apiUrl + "categoria");
  }
}

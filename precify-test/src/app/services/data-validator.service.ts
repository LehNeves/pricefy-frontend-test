import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { merge, Observable, EMPTY } from 'rxjs';

export enum TipoData {
  DataInicial = 0,
  DataFinal = 1
}

enum DataInvalido {
  DataInvalida = 0,
  DataInicialMenorQueADataAtual = 1,
  DataInicialMaiorQueADataFinal = 2,
  DataFinalMenorQueADataAtual = 3,
  DataFinalMenorQueADataInicial = 4,
  DataDeComparacaoInvalida = 5
}

interface IExceptionDataInvalida {
  tipoException: DataInvalido,
  controle: AbstractControl
}

@Injectable({
  providedIn: 'any'
})
export class DataValidatorService {
  validaDataInicialEFinal(controleDataInicial: AbstractControl, controleDataFinal: AbstractControl): Observable<void> {
    return merge(controleDataInicial.valueChanges, controleDataFinal.valueChanges).pipe(
      switchMap(
        () => {
          this.verificarDataInicialEFinal(controleDataInicial, controleDataFinal);
          return EMPTY;
        }
      ),
    );
  }

  private validaData(controle: AbstractControl): Date {
    if (!(controle.value instanceof Date))
      throw { tipoException: DataInvalido.DataInvalida, controle: controle };
    const data: Date = new Date(controle.value);
    return data;
  }

  private verificarDataInicialEFinal(controleDataInicial: AbstractControl, controleDataFinal: AbstractControl): void {
    try {
      const dataInicial = this.validaData(controleDataInicial);

      const dataHoje = new Date();
      if (dataHoje.getTime() > dataInicial.getTime() && !controleDataInicial.hasError('dataInicialMenorQueADataAtual'))
        throw { tipoException: DataInvalido.DataInicialMenorQueADataAtual, controle: controleDataInicial };

      const dataFinal = this.validaData(controleDataFinal);
      if(dataHoje.getTime() > dataFinal.getTime() && !controleDataInicial.hasError('dataFinalMenorQueADataAtual'))
        throw { tipoException: DataInvalido.DataFinalMenorQueADataAtual, controle: controleDataFinal };

      if (dataInicial.getTime() > dataFinal.getTime() && !controleDataInicial.hasError('dataFinalMenorQueADataInicial'))
        throw { tipoException: DataInvalido.DataFinalMenorQueADataInicial, controle: controleDataFinal };

      if (!controleDataInicial.errors)
        controleDataInicial.setErrors(null);
      if(!controleDataFinal.errors)
        controleDataFinal.setErrors(null);
    } catch (objErro: any) {
      const objCatch: IExceptionDataInvalida = {
        tipoException: objErro.tipoException,
        controle: objErro.controle
      }
      this.setErro(objCatch);
    }
  }

  private setErro(objException: IExceptionDataInvalida): void {
    objException.controle.markAsTouched();
    switch (objException.tipoException) {
      case 1:
        objException.controle.setErrors({ dataInicialMenorQueADataAtual: true });
        break;
      case 2:
         objException.controle.setErrors({ dataInicialMaiorQueADataFinal: true });
         break;
      case 3:
        objException.controle.setErrors({ dataFinalMenorQueADataAtual: true });
        break;
      case 4:
        objException.controle.setErrors({ dataFinalMenorQueADataInicial: true });
        break;
      case 5:
        objException.controle.setErrors({ dataDeComparacaoInvalida: true });
        break;
      default:
        objException.controle.setErrors({ dataInvalida: true });
        break;
    }
  }
}


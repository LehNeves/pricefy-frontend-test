import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

import { MyErrorStateMatcher } from '../my-error-state-matcher';
import { PromocaoAdicionarComponent } from '../promocao-adicionar/promocao-adicionar.component';
import { ICategoria, IPromocao } from '../promocao.interface';
import { PromocaoService } from '../promocao.service';
import { DataValidatorService } from '../services/data-validator.service';

@Component({
  selector: 'app-promocao-editar',
  templateUrl: './promocao-editar.component.html',
  styleUrls: ['./promocao-editar.component.scss']
})
export class PromocaoEditarComponent implements AfterViewInit, OnDestroy {
  form: FormGroup;

  categoria$: Observable<ICategoria[]> = this.data.categoria$;

  private unsubscribe: Subject<void> = new Subject();

  private registro?: IPromocao;

  matcher = new MyErrorStateMatcher();

  constructor(
    formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { categoria$: Observable<ICategoria[]>, idRegistro: number },
    private dialogRef: MatDialogRef<PromocaoAdicionarComponent>,
    private promocaoService: PromocaoService,
    private dataValidatorService: DataValidatorService
  ) {
    this.form = formBuild.group({
      GTIN: [null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      descricao: [null, [Validators.required, Validators.maxLength(100)]],
      precoRegular: [null, [Validators.required]],
      precoPromocional: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      dataInicial: [null, [Validators.required]],
      dataFinal: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.dataValidatorService.validaDataInicialEFinal(
      this.form.controls['dataInicial'],
      this.form.controls['dataFinal']
    ).pipe(takeUntil(this.unsubscribe)).subscribe();

    this.promocaoService.getPromocao(this.data.idRegistro).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((dado: IPromocao) => {
      this.registro = { ...dado };

      this.form.patchValue({
        GTIN: this.registro.GTIN, 
        descricao: this.registro.descricao,
        precoRegular: this.registro.precoRegular,
        precoPromocional: this.registro.precoPromocional,
        categoria: this.registro.categoria,
        dataInicial: this.registro.dataInicial,
        dataFinal: this.registro.dataFinal
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  salvar(): void {
    this.form.markAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid)
      return;

    const dados: IPromocao = {
      id: this.data.idRegistro,
      GTIN: this.form.controls['GTIN'].value,
      descricao: this.form.controls['descricao'].value,
      precoRegular: this.form.controls['precoRegular'].value,
      precoPromocional: this.form.controls['precoPromocional'].value,
      dataInicial: this.form.controls['dataInicial'].value,
      dataFinal: this.form.controls['dataFinal'].value,
      categoria: this.form.controls['categoria'].value
    }

    this.dialogRef.close(dados);
  }
}

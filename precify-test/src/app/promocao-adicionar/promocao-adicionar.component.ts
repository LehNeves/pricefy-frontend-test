import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

import { DataValidatorService } from '../services/data-validator.service';
import { ICategoria, IPromocao } from '../promocao.interface';
import { MyErrorStateMatcher } from '../my-error-state-matcher';

@Component({
  selector: 'app-promocao-adicionar',
  templateUrl: './promocao-adicionar.component.html',
  styleUrls: ['./promocao-adicionar.component.scss']
})
export class PromocaoAdicionarComponent implements AfterViewInit, OnDestroy {
  form: FormGroup;

  matcher = new MyErrorStateMatcher();

  categoria$: Observable<ICategoria[]> = this.data.categoria$;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { categoria$: Observable<ICategoria[]> },
    private dialogRef: MatDialogRef<PromocaoAdicionarComponent>,
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
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  salvar(): void {
    this.form.markAllAsTouched();
    this.form.markAsPristine();
    this.form.updateValueAndValidity();

    if (this.form.invalid)
      return;

    const dados: IPromocao = {
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

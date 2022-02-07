import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ICategoria, IPromocao } from '../promocao.interface';
import { PromocaoService } from '../promocao.service';

@Component({
  selector: 'app-promocao-adicionar',
  templateUrl: './promocao-adicionar.component.html',
  styleUrls: ['./promocao-adicionar.component.scss']
})
export class PromocaoAdicionarComponent {
  form: FormGroup;

  categoria$: Observable<ICategoria[]> = this.data.categoria$;

  constructor(
    formBuild: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { categoria$: Observable<ICategoria[]> },
    private dialogRef: MatDialogRef<PromocaoAdicionarComponent>,
    private promocaoService: PromocaoService
  ) {
    this.form = formBuild.group({
      GTIN: [null, [Validators.required, Validators.maxLength(14)]],
      descricao: [null, [Validators.required, Validators.maxLength(100)]],
      precoRegular: [null, [Validators.required]],
      precoPromocional: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      dataInicial: [null, [Validators.required]],
      dataFinal: [null, [Validators.required]]
    });
  }

  salvar(): void {
    this.form.markAsTouched();
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

    this.promocaoService.postPromocao(dados).subscribe(
      retorno => {
        dados.id = retorno.id;
        this.dialogRef.close(retorno);
      }
    );
  }
}

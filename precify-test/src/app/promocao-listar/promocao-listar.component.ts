import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { filter, from, map, NextObserver, Observable, Subject, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { ICategoria, IPromocao } from '../promocao.interface';
import { PromocaoService } from '../promocao.service';
import { PromocaoEditarComponent } from '../promocao-editar/promocao-editar.component';
import { PromocaoAdicionarComponent } from '../promocao-adicionar/promocao-adicionar.component';

@Component({
  selector: 'promocao-listar',
  templateUrl: './promocao-listar.component.html',
  styleUrls: ['./promocao-listar.component.scss']
})
export class PromocaoListarComponent implements OnInit {
  formFiltro: FormGroup;

  categorias?: ICategoria[];

  colunasDeTitulo: string[] = ['selecionar', 'GTIN', 'descricao', 'precoRegular', 'precoPromocional', 'dataInicial', 'dataFinal', 'categoria'];
  colunasDeFiltro: string[] = ['filtroSelecionar', 'filtroGTIN', 'filtroDescricao', 'filtroPrecoRegular', 'filtroPrecoPromocional', 'filtroDataInicial', 'filtroDataFinal', 'filtroCategoria'];

  dataSource = new MatTableDataSource<IPromocao>();
  selection = new SelectionModel<IPromocao>(true, []);
  @ViewChild(MatSort) sort!: MatSort;

  promocao$: Observable<IPromocao[]>;

  @Input('atualizar') atualizar$!: Subject<void>;

  @Input('categoria') categoria$!: Observable<ICategoria[]>;
  @Input('remover') remover$!: Observable<void>;
  @Input('editar') editar$!: Observable<void>;
  @Input('adicionar') adicionar$!: Observable<void>;

  constructor(
    private promocaoService: PromocaoService,
    formBuild: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.promocao$ = new Observable();

    this.formFiltro = formBuild.group({
      filtroGTIN: [null],
      filtroDescricao: [null],
      filtroPrecoRegular: [null],
      filtroPrecoPromocional: [null],
      filtroCategoria: [null],
      filtroDataInicial: [null],
      filtroDataFinal: [null]
    });
  }

  ngOnInit(): void {
    this.promocao$ = this.promocaoService.getPromocoes();
    this.categoria$ = this.promocaoService.getCategorias();

    this.categoria$.subscribe(categorias => this.categorias = [...categorias]);

    this.dataSource.filterPredicate = (dado: IPromocao) => this.filtrar(dado);

    this.atualizar$.asObservable().pipe(
      switchMap(() => this.promocao$),
      tap((dados: any) =>
        dados.forEach((dado: any) => {
          const categoria = this.categorias?.find(categoria => categoria.id == dado.categoria);
          dado.categoria = {
            id: categoria?.id,
            nome: categoria?.nome
          }
        })
      )
    ).subscribe(dados => {
      this.dataSource.data = [...dados];
      this.dataSource.sort = this.sort;
      this.selection.clear();
    });

    this.formFiltro.valueChanges.subscribe((valor) => this.dataSource.filter = valor);

    const retornoExclusao: NextObserver<void> = {
      next: () => this._snackBar.open("Registros excluídos com sucesso.", "Fechar", { duration: 5000 }),
      error: () => this._snackBar.open("Falha ao tentar excluir.", "Fechar", { duration: 5000 })
    }

    const retornoEdicao: NextObserver<IPromocao> = {
      next: () => this._snackBar.open("Registro atualizado com sucesso.", "Fechar", { duration: 5000 }),
      error: () => this._snackBar.open("Falha ao tentar editar.", "Fechar", { duration: 5000 }),
    }

    const retornoAdicionar: NextObserver<IPromocao> = {
      next: () => this._snackBar.open("Registro salvo com sucesso.", "Fechar", { duration: 5000 }),
      error: () => this._snackBar.open("Falha ao tentar adicionar.", "Fechar", { duration: 5000 })
    }

    this.remover$.pipe(
      filter(() => this.verificarSeASelecionados()),
      switchMap(() => from(this.selection.selected)),
      switchMap((promocao: IPromocao) => this.promocaoService.deletePromocao(promocao.id!)),
      tap(() => this.atualizar$.next())
    ).subscribe(retornoExclusao);

    this.editar$.pipe(
      filter(() => this.verificarSeASelecionados()),
      filter(() => this.verificaSeAMaisDeUmSelecionado()),
      map(() => this.selection.selected[0]),
      switchMap(selecionado => {
        const dialogRef = this.dialog.open(PromocaoEditarComponent, {
          data: { categoria$: this.categoria$, idRegistro: selecionado.id! },
          width: '600px',
        });

        return dialogRef.afterClosed();
      }),
      filter(dados => !!dados),
      switchMap((dados: IPromocao) => this.promocaoService.putPromocao(dados)),
      tap(() => this.atualizar$.next())
    ).subscribe(retornoEdicao);

    this.adicionar$.pipe(
      switchMap(() => {
        const dialogRef = this.dialog.open(PromocaoAdicionarComponent, {
          data: { categoria$: this.categoria$ },
          width: '600px',
        });

        return dialogRef.afterClosed();
      }),
      filter((dados) => !!dados),
      switchMap((dados: IPromocao) => this.promocaoService.postPromocao(dados)),
      tap(() => this.atualizar$.next())
    ).subscribe(retornoAdicionar)
  }

  private verificarSeASelecionados(): boolean {
    if (this.selection.isEmpty()) {
      this._snackBar.open("Selecione pelo menos um registro.", "Fechar", { duration: 5000 });
      return false;
    }
    return true;
  }

  private verificaSeAMaisDeUmSelecionado(): boolean {
    if (this.selection.selected.length > 1) {
      this._snackBar.open("Selecione somente um registro", "Fechar", { duration: 5000 });
      return false;
    }
    return true;
  }

  private filtrar(dado: IPromocao): boolean {
    const validos: boolean[] = [];

    const filtro: any = this.formFiltro.getRawValue();

    !!filtro?.filtroGTIN && validos.push(dado.GTIN.includes(filtro.filtroGTIN));
    !!filtro?.filtroCategoria && validos.push(dado.categoria.id == filtro.filtroCategoria);
    !!filtro?.filtroDescricao && validos.push(dado.descricao.includes(filtro.filtroDescricao));

    !!filtro?.filtroDataInicial && validos.push(this.comparaDataInicial(filtro.filtroDataInicial, dado.dataInicial));
    !!filtro?.filtroDataFinal && validos.push(this.comparaDataFinal(filtro.filtroDataFinal, dado.dataFinal));

    !!filtro?.filtroPrecoRegular && validos.push(dado.precoRegular === filtro.filtroPrecoRegular);
    !!filtro?.filtroPrecoPromocional && validos.push(dado.precoPromocional === filtro.filtroPrecoPromocional);

    const resultado = validos.every(Boolean);
    if (!resultado && this.selection.isSelected(dado))
      this.selection.toggle(dado);

    return resultado;
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  private comparaDataInicial(filtro: Date | null, valor: Date | null) {
    if (!filtro || !valor)
        return false;
    return filtro.getTime() <= valor.getTime();
  }

  private comparaDataFinal(filtro: Date | null, valor: Date | null) {
    if (!filtro || !valor)
        return false;
    return filtro.getTime() >= valor.getTime();
  }

  trackByFn(posicao: number, promocao: IPromocao): number {
    return promocao.id!;
  }

  verificarSeMenorQueDataAtual(data: Date): boolean {
    const dataHoje = new Date();
    return data.getTime() < dataHoje.getTime();
  }
}

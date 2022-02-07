import { AfterViewInit, Component, Input, OnInit, Output, SkipSelf, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { ICategoria, IPromocao } from '../promocao.interface';
import { PromocaoService } from '../promocao.service';

@Component({
  selector: 'promocao-listar',
  templateUrl: './promocao-listar.component.html',
  styleUrls: ['./promocao-listar.component.scss']
})
export class PromocaoListarComponent implements OnInit, AfterViewInit {
  formFiltro: FormGroup;

  colunasDeTitulo: string[] = ['selecionar', 'GTIN', 'descricao', 'precoRegular', 'precoPromocional', 'dataInicial', 'dataFinal', 'categoria'];
  colunasDeFiltro: string[] = ['filtroSelecionar', 'filtroGTIN', 'filtroDescricao', 'filtroPrecoRegular', 'filtroPrecoPromocional', 'filtroDataInicial', 'filtroDataFinal', 'filtroCategoria']

  dataSource = new MatTableDataSource<IPromocao>();
  sortedData: IPromocao[] = [];
  selection = new SelectionModel<IPromocao>(true, []);

  promocao$: Observable<IPromocao[]>;

  @Input('categoria') categoria$!: Observable<ICategoria[]>;
  @Input('addPromocao') adicionarPromocaoSubject!: Observable<IPromocao>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private promocaoService: PromocaoService,
    formBuild: FormBuilder) {
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
    this.promocao$.subscribe(
      dados => {
        this.dataSource.data = [...dados];
        this.sortedData = [...dados];
      }
    );

    this.dataSource.filterPredicate = (dado: IPromocao) => this.filtrar(dado);

    this.adicionarPromocaoSubject.subscribe((promocao: IPromocao) => this.dataSource.data.push(promocao));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private filtrar(dado: IPromocao): boolean {
    const validos: boolean[] = [];

    const filtro: IPromocao = this.formFiltro.getRawValue();

    // !!filtro?.GTIN && validos.push(dado.GTIN.includes(filtro.GTIN));
    // !!filtro?.categoria && validos.push(dado.categoria.nome.includes(filtro.categoria.nome));
    // !!filtro?.descricao && validos.push(dado.descricao.includes(filtro.descricao));

    // !!filtro?.dataInicial && validos.push(this.compararData(dado.dataInicial, filtro.dataInicial));
    // !!filtro?.dataFinal && validos.push(this.compararData(dado.dataFinal, filtro.dataFinal));

    // !!filtro?.GTIN && validos.push(dado.GTIN.includes(filtro.GTIN));
    // !!filtro?.GTIN && validos.push(dado.GTIN.includes(filtro.GTIN));

    // !!filtro?.precoRegular && validos.push(dado.precoRegular === filtro.precoRegular);
    // !!filtro?.precoPromocional && validos.push(dado.precoPromocional === filtro.precoPromocional);

    const resultado = validos.every(Boolean);
    if (!resultado && this.selection.isSelected(dado)) {
      this.selection.toggle(dado);
    }

    return resultado;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  private compararData(primeiraData: Date | null, segundaData: Date | null): boolean {
    if (!primeiraData || !segundaData) return false;
    return (primeiraData.getFullYear() === segundaData.getFullYear())
      && (primeiraData.getMonth() === segundaData.getMonth())
      && (primeiraData.getDate() === segundaData.getDate());
  }

  trackByFn(posicao: number, promocao: IPromocao): number {
    return promocao.id!;
  }
}

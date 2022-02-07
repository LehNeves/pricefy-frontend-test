import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

import { ICategoria, IPromocao } from './promocao.interface';
import { PromocaoAdicionarComponent } from './promocao-adicionar/promocao-adicionar.component';
import { PromocaoService } from './promocao.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  categoria$: Observable<ICategoria[]>;

  adicionarPromocaoSubject: Subject<IPromocao>;

  constructor(
    private dialog: MatDialog,
    private promocaoService: PromocaoService
  ) {
    this.categoria$ = this.promocaoService.getCategorias();
    this.adicionarPromocaoSubject = new Subject();
  }

  adicionar(): void {
    const dialogRef = this.dialog.open(PromocaoAdicionarComponent, {
      data: { categoria$: this.categoria$ },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(
      (data: IPromocao) => this.adicionarPromocaoSubject.next(data)
    );
  }
}

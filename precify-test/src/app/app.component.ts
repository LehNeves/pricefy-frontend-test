import { AfterViewInit, Component } from '@angular/core';

import { Subject } from 'rxjs';

import { PromocaoService } from './promocao.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  atualizar: Subject<void>;
  removerSubject: Subject<void>;
  editarSubject: Subject<void>;
  adicionarSubject: Subject<void>;

  constructor(
    private promocaoService: PromocaoService
  ) {
    this.atualizar = new Subject();
    this.removerSubject = new Subject();
    this.editarSubject = new Subject();
    this.adicionarSubject = new Subject();
  }

  ngAfterViewInit(): void {
    this.atualizar.next();
  }

  adicionar(): void {
    this.adicionarSubject.next();
  }

  remover(): void {
    this.removerSubject.next();
  }

  editar(): void {
    this.editarSubject.next()
  }
}

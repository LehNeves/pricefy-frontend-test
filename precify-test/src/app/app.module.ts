import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { NgxMaskModule } from 'ngx-mask';

import { AppComponent } from './app.component';
import { PromocaoAdicionarComponent } from './promocao-adicionar/promocao-adicionar.component';
import { PromocaoEditarComponent } from './promocao-editar/promocao-editar.component';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import { PromocaoListarComponent } from './promocao-listar/promocao-listar.component';

@NgModule({
  declarations: [
    AppComponent,
    PromocaoAdicionarComponent,
    PromocaoEditarComponent,
    ConfirmarComponent,
    PromocaoListarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTableModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-br'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

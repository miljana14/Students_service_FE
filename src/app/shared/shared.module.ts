import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BootstrapIconsSetupModule } from './bootstrap-icons/bootstrap-setup-icons.module';
import { HeaderComponent } from './components/header/header.component';
import { SortableHeaderDirective } from './directives/sortable-header.directive';
import { NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalToastComponent } from './components/global-toast/global-toast.component';
import { CloneDialogComponent } from './components/clone-dialog/clone-dialog.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SortableHeaderDirective,
    GlobalToastComponent,
    CloneDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbToastModule,
    NgbModalModule,
    NgbNavModule,
    NgbDropdownModule,
    BootstrapIconsSetupModule,
    TranslateModule,
    NgbDatepickerModule
  ], exports:[
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbToastModule,
    NgbModalModule,
    NgbNavModule,
    NgbDropdownModule,
    BootstrapIconsSetupModule,
    TranslateModule,
    NgbDatepickerModule,
    HeaderComponent,
    SortableHeaderDirective,
    GlobalToastComponent
  ]
})
export class SharedModule { }

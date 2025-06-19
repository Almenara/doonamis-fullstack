import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserService } from './../../../../services/user.service';
import { Loading } from "../../../../shared/loading/loading";
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-user-import',
  imports: [
    CommonModule,
    RouterModule,
    Loading
],
  templateUrl: './import.html',
  styleUrl: './import.scss'
})
export class UserImport {

  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  
  private userService: UserService = inject(UserService);
  private alertService: AlertService = inject(AlertService);

  public fileInput: HTMLInputElement | null = null;
  public selectedFile: File | null = null;
  public fileName = '';
  public loading = false;
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files ? input.files[0] : null;
    this.loading = true;
    if (file) {
      this.fileName = file.name;
      this.userService.uploadCSV(file).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {            
            /* const progress = Math.round(100 * event.loaded / (event.total ?? 1));
            console.log(`Progreso de subida: ${progress}%`); */
          } else if (event.type === HttpEventType.Response) {
            this.selectedFile = null;
            this.loading = false;
            this.fileUpload.nativeElement.value = '';
            this.alertService.success('Archivo importado correctamente.', { autoClose: true, keepAfterRouteChange: true });
          }
        },
        error: () => {
          this.loading = false;
          this.fileUpload.nativeElement.value = '';
          this.selectedFile = null;
        }
      });
    }
    else {
      // dejamos el campo de archivo como al inicio
      this.selectedFile = null;
      this.loading = false;
      this.fileUpload.nativeElement.value = '';
    }
  }

 
}

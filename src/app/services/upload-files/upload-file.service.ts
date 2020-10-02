import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor() { }

  upload(url: string, file: File, nameForm: string, params: any = {}, header: any = {}, method: string = 'POST') {

    return new Promise( (resolve, reject ) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      if (file && nameForm) {
        formData.append(nameForm, file, file.name);
      }

      for (const name in params) {
        if (params.hasOwnProperty(name)) {
          formData.append(name, params[name]);
        }
      }

      xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ) {
          if (xhr.status === 200 ) {
            console.log('archivo subido');
            resolve( JSON.parse( xhr.response ));
          } else {
            console.log('fallo la subida');
            reject( JSON.parse( xhr.response ));
          }
        }
      };

      xhr.open(method, url, true);
      for (const key in header) {
        if (header.hasOwnProperty(key)) {
          formData.append(name, params[name]);
          xhr.setRequestHeader(key, header[key]);
        }
      }
      xhr.send( formData );

    });
  }
}

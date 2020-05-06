import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  if(typeof control.value === "string") {
    return of(null);
  }
  const file: File = control.value;
  const fileReader = new FileReader();
  const obs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener("loadend", () => {
      const content = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
      let mime = '';
      let isValid: boolean = false;
      for(let i = 0;i < content.length;i++) {
        mime += content[i].toString(16);
      }
      switch(mime) {
        case "89504e47":
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if(isValid) {
        observer.next(null);
      } else {
        observer.next({ isInvalidMimeType: true });
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  })
  return obs;
}

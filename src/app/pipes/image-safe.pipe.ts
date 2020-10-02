import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imageSafe'
})
export class ImageSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string, ...args: unknown[]): unknown {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

}

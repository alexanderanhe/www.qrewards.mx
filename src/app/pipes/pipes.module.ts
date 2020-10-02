import { NgModule } from '@angular/core';
import { ImageSafePipe } from './image-safe.pipe';

@NgModule({
  imports: [ ],
  declarations: [
    ImageSafePipe
  ],
  exports: [
    ImageSafePipe
  ]
})
export class PipesModule { }

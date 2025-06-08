import {
  AfterViewInit,
  Component,
  forwardRef,
  inject,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DbService } from '@shared/services/db.service';
import { StorageService } from '@shared/services/storage.service';
import Quill from 'quill';
import QuillImageDropAndPaste, { ImageData } from 'quill-image-drop-and-paste';
import Toolbar from 'quill/modules/toolbar';
import { ImageBlot } from '@shared/interfaces/editor.imageBlot';

import { from, map, of, switchMap, throwError } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ImageModal } from './modals/image-modal.component';
import { ToasterService } from '@shared/services/toaster.service';

@Component({
  selector: 'text-editor',
  templateUrl: 'editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true,
    },
  ],
})
export class TextEditorComponent
  implements AfterViewInit, ControlValueAccessor
{
  @Input() elementId: string = 'editor';

  constructor(
    private dbService: DbService,
    private storage: StorageService,
    private toaster: ToasterService
  ) {}

  ngAfterViewInit(): void {
    this.initQuilEditor();
  }

  private quill!: Quill;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  private dialog = inject(MatDialog);

  private isDisabled: boolean = false;

  public initQuilEditor() {
    // Customizing Quill tools - https://quilljs.com/docs/guides/cloning-medium-with-parchment
    Quill.register(ImageBlot);
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

    this.quill = new Quill('#' + this.elementId, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'link'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean', 'color', 'background'],
          [
            'image',
            `${this.elementId}-nofloat`,
            `${this.elementId}-leftfloat`,
            `${this.elementId}-rightfloat`,
          ],
        ],
        imageDropAndPaste: {
          handler: this.uploadImage.bind(this),
        },
      },
      theme: 'snow',
    });

    this.quill.on('text-change', () => {
      const value = this.quill.getSemanticHTML();
      const cleanValue = value.replace(/&nbsp;/g, ' ');
      this.onChange(cleanValue);
    });

    this.quill.root.addEventListener('blur', () => {
      this.onTouched();
    });

    const tools = this.quill.getModule('toolbar') as Toolbar;

    tools.addHandler('image', (clicked) => {
      if (clicked) {
        const container = document.getElementById(
          this.elementId
        ) as HTMLElement;
        let fileInput: HTMLInputElement | null = container.querySelector(
          'input.ql-image[type=file]'
        );
        if (fileInput == null) {
          fileInput = document.createElement('input') as HTMLInputElement;
          fileInput.setAttribute('type', 'file');
          fileInput.style.display = 'none';
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg');
          fileInput.classList.add('ql-image');
          fileInput.addEventListener('change', (e: any) => {
            if (e.target.files.length > 0) {
              const file = e.target.files[0] as File;
              const fileType = file.type;
              const reader = new FileReader();

              reader.onload = (e) => {
                const dataUrl = e.target?.result;
                if (typeof dataUrl == 'string') {
                  this.uploadImage(
                    dataUrl,
                    fileType,
                    new ImageData(dataUrl, fileType, file.name)
                  );
                  if (fileInput) fileInput.value = '';
                }
              };
              reader.readAsDataURL(file);
            }
          });
          container.appendChild(fileInput);
        }
        fileInput.click();
      }
    });
    setTimeout(() => {
      const noFloatButton = document.querySelector(
        '.ql-' + this.elementId + '-nofloat'
      );
      noFloatButton?.classList.add('nofloat');
      const floatLeftButton = document.querySelector(
        '.ql-' + this.elementId + '-leftfloat'
      );
      floatLeftButton?.classList.add('leftfloat');
      const floatRightButton = document.querySelector(
        '.ql-' + this.elementId + '-rightfloat'
      );
      floatRightButton?.classList.add('rightfloat');

      if (noFloatButton) {
        noFloatButton.addEventListener('click', () => {
          this.formatImage('');
        });
      }

      if (floatLeftButton) {
        floatLeftButton.addEventListener('click', () => {
          this.formatImage('left');
        });
      }

      if (floatRightButton) {
        floatRightButton.addEventListener('click', () => {
          this.formatImage('right');
        });
      }
    }, 500);
  }

  formatImage(position: string) {
    const range = this.quill.getSelection(true);
    if (!range) return;

    const [blot] = this.quill.getLeaf(range.index);
    if (blot instanceof ImageBlot) {
      this.quill.formatText(range.index, 1, 'float', position);
    }
  }

  uploadImage(dataUrl: string, type: string, imageData: ImageData) {
    this.dialog
      .open(ImageModal, {
        data: { dataUrl, type },
        width: '100%',
        height: '100dvh',
      })
      .afterClosed()
      .pipe(
        switchMap((userInput) => {
          if (!userInput)
            return throwError(() => new Error('Operation cancelled'));

          if (!userInput.alt)
            return throwError(() => new Error('Alt text was not provided'));
          return from(
            imageData.minify({
              maxHeight: userInput.size,
              maxWidth: userInput.size,
              quality: 0.7,
            })
          ).pipe(map((miniImage) => ({ miniImage, userInput })));
        }),
        switchMap((input: any) => {
          const miniImage: any = input.miniImage;
          let filePath = input.userInput.path;
          const fileToUpload = miniImage.toFile();

          if (!fileToUpload) {
            return throwError(() => new Error('File creation failed'));
          }

          filePath = filePath ? filePath + '/' : '';
          return this.storage
            .uploadFile(fileToUpload, 'posts/' + filePath)
            .pipe(
              switchMap((value) => {
                if (value !== 'uploaded') return of(null);
                return this.dbService
                  .getFileUrl('posts/' + filePath + fileToUpload.name)
                  .pipe(map((src) => ({ src, alt: input.userInput.alt })));
              })
            );
        })
      )
      .subscribe({
        next: (result: any) => {
          if (!result) return;
          const { src, alt } = result;
          let index = (this.quill.getSelection() || {}).index;
          if (index == undefined || index < 0) index = this.quill.getLength();
          this.quill.insertEmbed(index, 'image', {
            src,
            alt,
          });
        },
        error: (err) => {
          console.log(err);
          this.toaster.showError('Error uploading document: ' + err.message);
        },
      });
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (this.quill) {
      this.quill.clipboard.dangerouslyPasteHTML(value || '');
    }
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;

    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }
}

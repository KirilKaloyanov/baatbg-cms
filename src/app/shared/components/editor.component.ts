import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'text-editor',
  templateUrl: 'editor.Component.html',
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
  ngAfterViewInit(): void {
      if (this.editorContainer) {
      this.initQuilEditor();
    } else {
      console.log('Editor container not found');
      this.retryEditorInit()
    }
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked', this.editorContainer)
  }

  @ViewChild('editorContainer') editorContainer!: ElementRef;

  private quill!: Quill;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  private isDisabled: boolean = false;

  public initQuilEditor() {
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
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
  }
  retryEditorInit(attempts: number = 5) {
    if (attempts === 0) {
      console.error("Editor container could not be found after multiple attempts.");
      return;
    }
  
    setTimeout(() => {
      if (this.editorContainer) {
        this.initQuilEditor();
      } else {
        console.warn(`Retrying editor init. Attempts left: ${attempts - 1}`);
        this.retryEditorInit(attempts - 1);
      }
    }, 200);
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

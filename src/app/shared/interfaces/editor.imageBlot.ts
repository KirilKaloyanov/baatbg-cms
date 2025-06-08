import Quill from 'quill';

const BlockEmbed: any = Quill.import('blots/block/embed');


export class ImageBlot extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'img';
  
    static create(value: any) {
      let node = super.create();
      node.setAttribute('alt', value.alt);
      node.setAttribute('src', value.src);
      if (value.float) {
        node.style.float = value.float;
      }
      if (value.margin) {
        node.style.margin = value.margin;
      }
      return node;
    }
  
    static value(node: any) {
      return {
        alt: node.getAttribute('alt'),
        src: node.getAttribute('src'),
        float: node.style.float || '',
        margin: node.style.margin || '',
      };
    }
  
  
    format(name: string, value: string) {
      if (name == 'float') {
        if (value) {
          this['domNode'].style.float = value;
          this['domNode'].style.margin =  value == "left" ? '12px 12px 12px 0' : '12px 0 12px 12px';
        } else {
          this['domNode'].style.removeProperty('float');
          this['domNode'].style.margin = '0';
        }
      }
    }
  }
import { Directive, Output, EventEmitter, HostListener, Input, HostBinding } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | ''

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.desc]' : 'direction === "desc"'
  }
})
export class SortableHeaderDirective {

  @Input() sortable = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter();

  constructor() { }

  @HostBinding('class.asc')
  get ascClass(){
    return this.direction === 'asc'
  }

  @HostListener('click')
  onSort(){
    if(!this.direction){
      this.direction = 'asc';
    }
    else if(this.direction === 'asc'){
      this.direction = 'desc';
    }else{
      this.direction = '';
    }
    this.sort.emit({column: this.sortable, direction:this.direction});
  }

}

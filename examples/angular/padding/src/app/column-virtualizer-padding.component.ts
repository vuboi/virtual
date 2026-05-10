import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  viewChild,
  viewChildren,
} from '@angular/core'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import type { ElementRef } from '@angular/core'

@Component({
  standalone: true,
  selector: 'column-virtualizer-padding',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 style="margin-top: 2rem">Columns</h3>
    <div #scrollElement class="list scroll-container">
      <div
        style="position: relative; height: 100%;"
        [style.width.px]="virtualizer.getTotalSize()"
      >
        @for (col of virtualizer.getVirtualItems(); track col.index) {
          <div
            #virtualItem
            [attr.data-index]="col.index"
            [class.list-item-even]="col.index % 2 === 0"
            [class.list-item-odd]="col.index % 2 !== 0"
            style="position: absolute; top: 0; left: 0; height: 100%;"
            [style.width.px]="columns()[col.index]"
            [style.transform]="'translateX(' + col.start + 'px)'"
          >
            Column {{ col.index }}
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .scroll-container {
      height: 400px;
      width: 400px;
      overflow: auto;
    }
  `,
})
export class ColumnVirtualizerPadding {
  columns = input.required<Array<number>>()

  scrollElement = viewChild<ElementRef<HTMLDivElement>>('scrollElement')

  virtualItems = viewChildren<ElementRef<HTMLDivElement>>('virtualItem')

  #measureItems = effect(() => {
    const items = this.virtualItems()
    items.forEach((el) => {
      this.virtualizer.measureElement(el.nativeElement)
    })
  })

  virtualizer = injectVirtualizer(() => ({
    horizontal: true,
    scrollElement: this.scrollElement(),
    count: this.columns().length,
    estimateSize: () => 100,
    overscan: 5,
    paddingStart: 100,
    paddingEnd: 100,
  }))
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';

import { AppSharedModule } from '~/app-shared.module';
import { LabState, Settings } from '~/store';
import { DataSharedModule } from '../../data-shared.module';
import { DetailComponent } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, AppSharedModule, DataSharedModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent extends DetailComponent {
  store = inject(Store<LabState>);

  vm$ = combineLatest([
    this.id$,
    this.parent$,
    this.store.select(Settings.getModMenuItem),
    this.store.select(Settings.getDataset),
  ]).pipe(
    map(([id, parent, home, data]) => ({
      id,
      home,
      obj: data.categoryEntities[id],
      breadcrumb: [parent, { label: data.categoryEntities[id]?.name }],
      itemIds: data.itemIds.filter((i) => data.itemEntities[i].category === id),
      recipeIds: data.recipeIds.filter(
        (i) => data.recipeEntities[i].category === id,
      ),
    })),
  );
}

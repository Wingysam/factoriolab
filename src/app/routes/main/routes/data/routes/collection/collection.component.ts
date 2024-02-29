import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { combineLatest, map } from 'rxjs';

import { AppSharedModule } from '~/app-shared.module';
import { LabState, Settings } from '~/store';
import { DataSharedModule } from '../../data-shared.module';
import { Collection } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, AppSharedModule, DataSharedModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  route = inject(ActivatedRoute);
  translateSvc = inject(TranslateService);
  store = inject(Store<LabState>);

  collection$ = this.route.data.pipe(map((data) => data as Collection));
  breadcrumb$ = this.collection$.pipe(
    map((data): MenuItem[] => [
      {
        label: this.translateSvc.instant(data.label ?? 'none'),
      },
    ]),
  );
  vm$ = combineLatest([
    this.collection$,
    this.breadcrumb$,
    this.store.select(Settings.getModMenuItem),
    this.store.select(Settings.getDataset),
  ]).pipe(
    map(([collection, breadcrumb, home, data]) => ({
      collection,
      breadcrumb,
      ids: data[collection.ids] as string[],
      home,
    })),
  );
}

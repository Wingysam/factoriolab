import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import {
  ColumnKey,
  ColumnSettings,
  columnsInfo,
  ColumnsState,
  Entities,
} from '~/models';
import { ContentService } from '~/services';
import { LabState, Preferences, Settings } from '~/store';

@UntilDestroy()
@Component({
  selector: 'lab-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsComponent implements OnInit {
  ref = inject(ChangeDetectorRef);
  store = inject(Store<LabState>);
  contentSvc = inject(ContentService);

  columnOptions = this.store.selectSignal(Settings.getColumnOptions);

  visible = false;
  editValue: Entities<ColumnSettings> = {};
  columnsInf = columnsInfo;

  get modified(): boolean {
    return (Object.keys(this.editValue) as ColumnKey[]).some(
      (k) =>
        this.editValue[k].precision !==
          Preferences.initialPreferencesState.columns[k].precision ||
        this.editValue[k].show !==
          Preferences.initialPreferencesState.columns[k].show,
    );
  }

  ngOnInit(): void {
    this.contentSvc.showColumns$.pipe(untilDestroyed(this)).subscribe(() => {
      this.visible = true;
      this.ref.markForCheck();
    });

    this.store
      .select(Settings.getColumnsState)
      .pipe(untilDestroyed(this))
      .subscribe((columns) => this.initEdit(columns));
  }

  initEdit(columns: ColumnsState): void {
    this.editValue = (Object.keys(columns) as ColumnKey[])
      .filter((c) => columnsInfo[c] != null) // Filter out any obsolete keys
      .reduce((e: Entities<ColumnSettings>, c) => {
        e[c] = { ...columns[c] };
        return e;
      }, {});
  }

  changeFraction(value: boolean, column: ColumnKey): void {
    this.editValue[column].precision = value ? null : 1;
  }

  reset(): void {
    this.initEdit(Preferences.initialPreferencesState.columns);
  }

  save(): void {
    this.store.dispatch(
      new Preferences.SetColumnsAction(this.editValue as ColumnsState),
    );
  }
}

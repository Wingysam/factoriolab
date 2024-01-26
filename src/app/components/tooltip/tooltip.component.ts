import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { Game } from '~/models';
import { LabState, Recipes, Settings } from '~/store';

type TooltipType =
  | 'item'
  | 'beacon'
  | 'belt'
  | 'cargo-wagon'
  | 'fluid-wagon'
  | 'fuel'
  | 'machine'
  | 'module'
  | 'pipe'
  | 'technology'
  | 'recipe';

@Component({
  selector: 'lab-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  store = inject(Store<LabState>);

  @Input() id: string | undefined;
  @Input() type: TooltipType = 'item';

  dataKey: Record<TooltipType, string> = {
    item: 'items',
    beacon: 'beacons',
    belt: 'belts',
    'cargo-wagon': 'cargoWagons',
    'fluid-wagon': 'fluidWagons',
    fuel: 'fuels',
    machine: 'machines',
    module: 'modules',
    pipe: 'pipes',
    technology: 'technologies',
    recipe: 'recipes',
  };

  beltSpeedTxt = this.store.selectSignal(Settings.getBeltSpeedTxt);
  dispRateInfo = this.store.selectSignal(Settings.getDisplayRateInfo);
  data = this.store.selectSignal(Recipes.getAdjustedDataset);

  Game = Game;
}

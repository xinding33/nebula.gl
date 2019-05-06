// @flow

import type { ClickEvent } from '../event-types.js';
import type { FeatureCollectionEditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class DrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }: ClickEvent): ?FeatureCollectionEditAction {
    const geometry = {
      type: 'Point',
      coordinates: groundCoords
    };

    return this.getAddFeatureAction(geometry);
  }
}

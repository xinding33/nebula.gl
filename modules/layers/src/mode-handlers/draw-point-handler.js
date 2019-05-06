// @flow

import type { ClickEvent } from '../event-types.js';
import type { FeatureCollectionEditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class DrawPointHandler extends ModeHandler {
  handleClickAdapter({ mapCoords }: ClickEvent): ?FeatureCollectionEditAction {
    const geometry = {
      type: 'Point',
      coordinates: mapCoords
    };

    return this.getAddFeatureAction(geometry);
  }
}

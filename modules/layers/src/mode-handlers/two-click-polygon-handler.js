// @flow

import type { ClickEvent } from '../event-types.js';
import { ModeHandler } from './mode-handler.js';
import type { FeatureCollectionEditAction } from './mode-handler.js';

export class TwoClickPolygonHandler extends ModeHandler {
  handleClickAdapter(event: ClickEvent): ?FeatureCollectionEditAction {
    super.handleClickAdapter(event);

    const tentativeFeature = this.getTentativeFeature();
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
      this.resetClickSequence();
      this._setTentativeFeature(null);
      return editAction;
    }

    return null;
  }
}

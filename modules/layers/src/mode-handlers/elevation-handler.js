// @flow
import type { PointerMoveEvent, StopDraggingEvent } from '../event-types.js';
import type { Position } from '../geojson-types.js';
import type { FeatureCollectionEditAction } from './mode-handler.js';
import { getPickedEditHandle } from './mode-handler.js';
import { ModifyHandler } from './modify-handler.js';

export class ElevationHandler extends ModifyHandler {
  makeElevatedEvent(event: PointerMoveEvent | StopDraggingEvent, position: Position): Object {
    const { min = 0, max = 20000 } = this._modeConfig || {};

    const [, yBot] = this._context.viewport.project([position[0], position[1], 0]);
    const [, yTop] = this._context.viewport.project([position[0], position[1], 1000]);
    const [, y] = event.screenCoords;

    let elevation = ((yBot - y) * 1000.0) / (yBot - yTop);
    elevation = Math.min(elevation, max);
    elevation = Math.max(elevation, min);

    return Object.assign({}, event, {
      mapCoords: [position[0], position[1], elevation]
    });
  }

  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?FeatureCollectionEditAction, cancelMapPan: boolean } {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);
    const position = editHandle ? editHandle.position : event.mapCoords;
    return super.handlePointerMoveAdapter(this.makeElevatedEvent(event, position));
  }

  handleStopDraggingAdapter(event: StopDraggingEvent): ?FeatureCollectionEditAction {
    const editHandle = getPickedEditHandle(event.picks);
    const position = editHandle ? editHandle.position : event.mapCoords;
    return super.handleStopDraggingAdapter(this.makeElevatedEvent(event, position));
  }

  getCursorAdapter(params: { isDragging: boolean }): string {
    let cursor = super.getCursorAdapter(params);
    if (cursor === 'cell') {
      cursor = 'ns-resize';
    }
    return cursor;
  }
}

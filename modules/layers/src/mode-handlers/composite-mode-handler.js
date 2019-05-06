// @flow

import type { FeatureCollection, Feature, Position } from '../geojson-types.js';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../event-types.js';
import { ModeHandler, type FeatureCollectionEditAction, type EditHandle } from './mode-handler.js';

export class CompositeModeHandler extends ModeHandler {
  handlers: Array<ModeHandler>;
  options: Object;

  constructor(handlers: Array<ModeHandler>, options: Object = {}) {
    super();
    this.handlers = handlers;
    this.options = options;
  }

  _coalesce<T>(callback: ModeHandler => T, resultEval: ?(T) => boolean = null): T {
    let result: T;

    for (let i = 0; i < this.handlers.length; i++) {
      result = callback(this.handlers[i]);
      if (resultEval ? resultEval(result) : result) {
        break;
      }
    }

    return (result: any);
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this.handlers.forEach(handler => handler.setFeatureCollection(featureCollection));
  }

  setModeConfig(modeConfig: any): void {
    this.handlers.forEach(handler => handler.setModeConfig(modeConfig));
  }

  setSelectedFeatureIndexes(indexes: number[]): void {
    this.handlers.forEach(handler => handler.setSelectedFeatureIndexes(indexes));
  }

  setDeckGlContext(context: Object) {
    this.handlers.forEach(handler => handler.setDeckGlContext(context));
  }

  handleClickAdapter(event: ClickEvent): ?FeatureCollectionEditAction {
    return this._coalesce(handler => handler.handleClickAdapter(event));
  }

  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?FeatureCollectionEditAction, cancelMapPan: boolean } {
    return this._coalesce(
      handler => handler.handlePointerMoveAdapter(event),
      result => result && Boolean(result.editAction)
    );
  }

  handleStartDraggingAdapter(event: StartDraggingEvent): ?FeatureCollectionEditAction {
    return this._coalesce(handler => handler.handleStartDraggingAdapter(event));
  }

  handleStopDraggingAdapter(event: StopDraggingEvent): ?FeatureCollectionEditAction {
    return this._coalesce(handler => handler.handleStopDraggingAdapter(event));
  }

  getTentativeFeature(): ?Feature {
    return this._coalesce(handler => handler.getTentativeFeature());
  }

  getEditHandles(picks?: Array<Object>, mapCoords?: Position): EditHandle[] {
    // TODO: Combine the handles *BUT* make sure if none of the results have
    // changed to return the same object so that "editHandles !== this.state.editHandles"
    // in editable-geojson-layer works.
    return this._coalesce(
      handler => handler.getEditHandles(picks, mapCoords),
      handles => Array.isArray(handles) && handles.length > 0
    );
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    return this._coalesce(handler => handler.getCursor({ isDragging }));
  }
}

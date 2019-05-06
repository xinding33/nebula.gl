// @flow

import type { Feature, Polygon, Position } from '../geojson-types.js';
import type { ClickEvent, PointerMoveEvent } from '../event-types.js';
import type { FeatureCollectionEditAction, EditHandle } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler.js';

export class DrawPolygonHandler extends ModeHandler {
  getEditHandles2(
    picks?: Array<Object>,
    groundCoords?: Position,
    tentativeFeature: ?Feature
  ): EditHandle[] {
    let handles = super.getEditHandles(picks, groundCoords);

    if (tentativeFeature) {
      handles = handles.concat(getEditHandlesForGeometry(tentativeFeature.geometry, -1));
      // Slice off the handles that are are next to the pointer
      if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      } else if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      }
    }

    return handles;
  }

  _setTentativeFeature(tentativeFeature: ?Feature): void {
    this.getState().onUpdateGuides({
      tentativeFeature,
      editHandles: this.getEditHandles2([], [0, 0], tentativeFeature)
    });
  }

  handleClick(event: ClickEvent): ?FeatureCollectionEditAction {
    super.handleClick(event);

    const { picks } = event;
    const tentativeFeature = this.getTentativeFeature();

    let editAction: ?FeatureCollectionEditAction = null;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (clickedEditHandle) {
      // User clicked an edit handle.
      // Remove it from the click sequence, so it isn't added as a new point.
      const clickSequence = this.getClickSequence();
      clickSequence.splice(clickSequence.length - 1, 1);
    }

    if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      const polygon: Polygon = tentativeFeature.geometry;

      if (
        clickedEditHandle &&
        clickedEditHandle.featureIndex === -1 &&
        (clickedEditHandle.positionIndexes[1] === 0 ||
          clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)
      ) {
        // They clicked the first or last point (or double-clicked), so complete the polygon

        // Remove the hovered position
        const polygonToAdd: Polygon = {
          type: 'Polygon',
          coordinates: [[...polygon.coordinates[0].slice(0, -2), polygon.coordinates[0][0]]]
        };

        this.resetClickSequence();
        this._setTentativeFeature(null);
        editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd);
      }
    }

    // Trigger pointer move right away in order for it to update edit handles (to support double-click)
    const fakePointerMoveEvent = {
      screenCoords: [-1, -1],
      groundCoords: event.groundCoords,
      picks: [],
      isDragging: false,
      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownGroundCoords: null,
      sourceEvent: null
    };

    // setTimeout(() => {
    this.handlePointerMove(fakePointerMoveEvent);
    // }, 1000);

    if (editAction) {
      this.getState().onEdit({
        updatedData: editAction.updatedData,
        editType: editAction.editType,
        affectedIndexes: editAction.featureIndexes,
        editContext: editAction.editContext
      });
    }

    return null;
  }

  handlePointerMove({
    groundCoords
  }: PointerMoveEvent): { editAction: ?FeatureCollectionEditAction, cancelMapPan: boolean } {
    const clickSequence = this.getClickSequence();
    const result = { editAction: null, cancelMapPan: false };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    if (clickSequence.length < 3) {
      // Draw a LineString connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, groundCoords]
        }
      });
    } else {
      // Draw a Polygon connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, groundCoords, clickSequence[0]]]
        }
      });
    }

    return result;
  }
}

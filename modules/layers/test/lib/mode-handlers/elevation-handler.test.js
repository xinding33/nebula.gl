// @flow
/* eslint-env jest */

import { ElevationHandler } from '../../../src/mode-handlers/elevation-handler';
import {
  createFeatureCollection,
  createPointerMoveEvent,
  createPointerDragEvent
} from '../test-utils.js';

describe('SnappableHandler - handler tests', () => {
  let handler;

  beforeEach(() => {
    handler = new ElevationHandler(createFeatureCollection());
    handler.setDeckGlContext({
      viewport: {
        project: coords => coords
      }
    });
  });

  test('setFeatureCollection()', () => {
    const initialFeatureCollection = handler.getFeatureCollection();
    expect(handler.getFeatureCollection()).toEqual(initialFeatureCollection);
    const differentFeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-122.28103267622373, 37.98843664327903]
          }
        }
      ]
    };

    handler.setFeatureCollection(differentFeatureCollection);
    expect(handler.getFeatureCollection()).toEqual(differentFeatureCollection);
  });

  test('handlePointerMoveAdapter()', () => {
    const event = createPointerMoveEvent([1, 1]);
    const action = handler.handlePointerMoveAdapter(event);
    expect(action.cancelMapPan).toBeFalsy();
  });

  test('handleStopDraggingAdapter()', () => {
    const event = createPointerDragEvent([20, 20], [20, 20]);
    const action = handler.handleStopDraggingAdapter(event);
    expect(action).toBeNull();
  });

  test('getCursorAdapter()', () => {
    expect(handler.getCursorAdapter({ isDragging: false })).toEqual('grab');

    const event = createPointerMoveEvent([1, 1]);
    event.picks = [{ isGuide: true, index: 1, object: {} }];
    handler.handlePointerMoveAdapter(event);
    expect(handler.getCursorAdapter({ isDragging: false })).toEqual('ns-resize');
  });
});

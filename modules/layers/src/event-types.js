// @flow
import type { Position } from './geojson-types.js';

// Represents an edit action, i.e. a suggestion to update the data based on user interaction events
export type EditAction<TData> = {
  updatedData: TData,
  editType: string,
  editContext: any
};

// Represents an object "picked" from the screen. This usually reflects an object under the cursor
export type Pick = {
  object: any,
  index: number,
  isGuide: boolean
};

// Represents a click event
export type ClickEvent = {
  picks: Pick[],
  screenCoords: Position,
  mapCoords: Position,
  sourceEvent: any
};

// Represents a double-click event
export type DoubleClickEvent = {
  mapCoords: Position,
  sourceEvent: any
};

// Represents an event that occurs when the pointer goes down and the cursor starts moving
export type StartDraggingEvent = {
  picks: Pick[],
  screenCoords: Position,
  mapCoords: Position,
  pointerDownScreenCoords: Position,
  pointerDownMapCoords: Position,
  sourceEvent: any
};

// Represents an event that occurs after the pointer goes down, moves some, then the pointer goes back up
export type StopDraggingEvent = {
  picks: Pick[],
  screenCoords: Position,
  mapCoords: Position,
  pointerDownScreenCoords: Position,
  pointerDownMapCoords: Position,
  sourceEvent: any
};

// Represents an event that occurs every time the pointer moves
export type PointerMoveEvent = {
  screenCoords: Position,
  mapCoords: Position,
  picks: Pick[],
  isDragging: boolean,
  pointerDownPicks: ?(Pick[]),
  pointerDownScreenCoords: ?Position,
  pointerDownMapCoords: ?Position,
  sourceEvent: any
};

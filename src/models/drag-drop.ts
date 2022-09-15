// Drag & Drop
export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  dragOverHander(event: DragEvent): void;
  dropHander(event: DragEvent): void;
  dragLeaveHander(event: DragEvent): void;
}

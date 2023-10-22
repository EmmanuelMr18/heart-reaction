type returnValues = {
  removeEventListener(): void;
};
export declare type HeartReactionProps  = {
  heartSize: number,
  heartFreemode?: boolean,
  enableRotation?: boolean,
  canvasElement: HTMLElement | null,
  icon: string,
  onSlingleClick?: function():void
}
export declare function HeartReaction(props: HeartReactionProps): returnValues;
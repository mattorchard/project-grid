import { useCallback, useMemo, useRef, useState } from "preact/hooks";

export const useGridPointer = (gridScale: Size) => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      event.preventDefault();
      const { offsetX, offsetY } = event;
      const newPointer = {
        x: Math.floor(offsetX / gridScale.width),
        y: Math.floor(offsetY / gridScale.height),
      };
      setPointer((oldPointer) =>
        oldPointer.x !== newPointer.x || oldPointer.y !== newPointer.y
          ? newPointer
          : oldPointer
      );
    },
    [gridScale]
  );

  return { onPointerMove, pointer };
};

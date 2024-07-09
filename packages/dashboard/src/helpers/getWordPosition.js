function* cellPositionIterator(initialX, initialY, cellWidth, cellHeight) {
  let radius = 0;

  while (true) {
    for (let y = initialY - radius; y <= initialY + radius; y += cellHeight) {
      const dy = y - initialY;
      const dx = radius ? Math.cos(Math.asin(dy / radius)) * radius : 0; // Calculate the horizontal distance from the center

      // Calculate global row and column
      const globalRow = Math.round(y / cellHeight);
      const globalColumnRight = Math.round((initialX + dx) / cellWidth);
      const globalColumnLeft = Math.round((initialX - dx) / cellWidth);

      // Calculate exact x and y positions clamped to the global grid
      const exactY = globalRow * cellHeight;
      const exactXRight = globalColumnRight * cellWidth + (globalRow % 2) * (cellWidth / 2);
      const exactXLeft = globalColumnLeft * cellWidth + (globalRow % 2) * (cellWidth / 2);

      yield {
        x: exactXRight, // Right side of the circle
        y: exactY,
      };

      if (dx !== 0) { // Avoid yielding the same center point twice
        yield {
          x: exactXLeft, // Left side of the circle
          y: exactY,
        };
      }
    }

    radius += cellHeight;
  }
}

function rectsOverlap(rect1, rect2) {
  return (
    rect1.x < rect2.x + (rect2.width / 2)
    && rect1.x + (rect1.width / 2) > rect2.x
    && rect1.y < rect2.y + (rect2.height / 2)
    && rect1.y + (rect1.height / 2) > rect2.y
  );
}

function isCellVacant(x, y, width, height, padding, activePositions) {
  const testRect = {
    x: x - width / 2 - padding / 2,
    y: y - height / 2 - padding / 2,
    width: width + padding,
    height: height + padding,
  };
  const vacant = !activePositions.some((pos) => rectsOverlap(testRect, pos));

  return vacant;
}

export default function getWordPosition({
  x, y, width, height, center,
}, activePositions, opts) {
  const padding = opts?.padding ?? 10;

  const iterator = cellPositionIterator(x, y, width + 2 * padding, height + 2 * padding);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value: nextCell } = iterator.next();
    if (isCellVacant(center.x + nextCell.x, center.y + nextCell.y, width, height, padding, activePositions)) {
      return nextCell;
    }
  }
}

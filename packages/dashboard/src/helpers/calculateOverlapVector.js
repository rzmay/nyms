export default function calculateOverlapVector(rect1, rect2) {
  const dx = rect1.x - rect2.x;
  const dy = rect1.y - rect2.y;

  const overlapX = rect1.width / 2 + rect2.width / 2 - Math.abs(dx);
  const overlapY = rect1.height / 2 + rect2.height / 2 - Math.abs(dy);

  if (overlapX <= 0 || overlapY <= 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: overlapX * Math.sign(dx),
    y: overlapY * Math.sign(dy),
  };
}

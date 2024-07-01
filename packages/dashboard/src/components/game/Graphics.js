import relations from 'lib/constants/relations';
import React from 'react';
import NymsContext from '../../context/NymsContext';
import useScreenSize from '../../hooks/useScreenSize';

export default function Graphics() {
  const {
    chain, center, currentWord, hoveredWord, scale, getPosition, positions, positionsRef,
  } = React.useContext(NymsContext);
  const [screenWidth, screenHeight] = useScreenSize();
  const [maxRadius, setMaxRadius] = React.useState(0);
  const [lines, setLines] = React.useState([]);

  React.useEffect(() => {
    const newLines = [];

    // Chain
    for (let i = 1; i < chain.length; i++) {
      const start = getPosition(chain[i - 1].word, chain[i - 1].relation);
      const end = getPosition(chain[i].word, chain[i].relation);

      newLines.push({
        start: { x: start.x, y: start.y },
        end: { x: end.x, y: end.y },
        relation: chain[i].relation,
      });
    }

    // Hovered word
    if (hoveredWord) {
      const start = getPosition(currentWord.word, currentWord.relation);
      const end = getPosition(hoveredWord.word, hoveredWord.relation);

      newLines.push({
        start: { x: start.x, y: start.y },
        end: { x: end.x, y: end.y },
        relation: hoveredWord.relation,
      });
    }

    setLines(newLines);
  }, [chain, currentWord, getPosition, hoveredWord, positions, positionsRef]);

  const sizeFactor = React.useMemo(() => {
    // Calculate the distance from the center to the furthest edge
    const maxDistanceX = Math.max(center.x, screenWidth - center.x);
    const maxDistanceY = Math.max(center.y, screenHeight - center.y);
    const maxDistance = Math.hypot(maxDistanceX, maxDistanceY);

    // Calculate the size factor based on the distance and scale
    const sizeFactor = Math.max(1, (maxDistance * 2) / Math.min(screenWidth, screenHeight));

    return sizeFactor / scale; // Adjust by the current scale
  }, [center, scale, screenHeight, screenWidth]);

  // Figure out the maximum radius for drawing circles
  React.useEffect(() => {
    const width = center.x + screenWidth / scale;
    const height = center.y + screenHeight / scale;
    const maxDistance = (sizeFactor * Math.hypot(width, height)) / 2;
    setMaxRadius(maxDistance);
  }, [scale, center, screenWidth, screenHeight, sizeFactor]);

  const circles = React.useMemo(() => {
    const circles = [];
    for (let r = 100; r <= maxRadius; r += 100) {
      circles.push(<circle key={r} cx="50%" cy="50%" r={r} stroke="#fff8" strokeWidth="0.5" fill="none" />);
    }

    return circles;
  }, [maxRadius]);

  // Transform line coords
  const transformCoordinates = React.useCallback(({ x, y }) => ({
    x: x + ((sizeFactor - 1) * (screenWidth / 2)),
    y: y + ((sizeFactor - 1) * (screenHeight / 2)),
  }), [screenHeight, screenWidth, sizeFactor]);

  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: `${sizeFactor * 100}%`,
        height: `${sizeFactor * 100}%`,
      }}
    >
      {circles}
      {lines.map((line, index) => {
        const start = transformCoordinates(line.start);
        const end = transformCoordinates(line.end);

        return (
          <path
            key={JSON.stringify(line) + index}
            d={`M${start.x},${start.y} C${start.x + (end.x - start.x) * 0.75},${start.y} ${end.x - (end.x - start.x) * 0.75},${end.y} ${end.x},${end.y}`}
            stroke={relations[line.relation].hex}
            strokeWidth="2"
            fill="none"
            className="animate-draw"
            ref={(path) => {
              if (path) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
              }
            }}
          />
        );
      })}
    </svg>
  );
}

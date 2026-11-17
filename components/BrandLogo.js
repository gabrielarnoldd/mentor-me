import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

// Vector reconstruction of the original mark: clean edges at every pixel density.
export default function BrandLogo({ width = 250, height = width * 0.68 }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradient = `logoGradient${id}`;

  return (
    <Svg width={width} height={height} viewBox="0 0 1100 748" accessibilityLabel="Logo Mentor Me" accessibilityRole="image">
      <Defs>
        <LinearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="124" y1="124" x2="1029" y2="693">
          <Stop offset="0" stopColor="#031B46" />
          <Stop offset="0.4" stopColor="#02457C" />
          <Stop offset="0.72" stopColor="#028BBF" />
          <Stop offset="1" stopColor="#0798C2" />
        </LinearGradient>
      </Defs>
      <Path
        fill={`url(#${gradient})`}
        d="M 132 124 H 257 Q 266 124 271 133 L 379 328 L 493 133 Q 498 124 508 124 H 627 Q 635 124 635 132 V 493 L 716 307 Q 726 283 749 283 H 788 Q 809 283 820 306 L 916 493 V 252 Q 916 244 924 244 H 1021 Q 1029 244 1029 252 V 685 Q 1029 693 1021 693 H 911 Q 899 693 894 682 L 769 443 L 655 682 Q 650 693 638 693 H 509 Q 501 693 501 685 V 293 L 421 493 Q 412 516 390 516 H 358 Q 341 516 330 495 L 260 293 V 565 Q 260 573 252 573 H 132 Q 124 573 124 565 V 132 Q 124 124 132 124 Z"
      />
    </Svg>
  );
}

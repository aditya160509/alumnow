interface MIconProps {
  name: string;
  size?: number;
  fill?: number;
  weight?: number;
  grade?: number;
  opticalSize?: number;
  className?: string;
}

export function MIcon({
  name,
  size = 20,
  fill = 0,
  weight = 400,
  grade = 0,
  opticalSize = 20,
  className,
}: MIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      {name}
    </span>
  );
}

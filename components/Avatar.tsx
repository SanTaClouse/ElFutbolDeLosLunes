import { initial } from "@/lib/format";

export function Avatar({
  name,
  size = 34,
  className = "bg-avatarbg text-brand",
  fontSize,
}: {
  name: string;
  size?: number;
  className?: string;
  fontSize?: number;
}) {
  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-extrabold ${className}`}
      style={{ width: size, height: size, fontSize: fontSize ?? size * 0.42 }}
    >
      {initial(name)}
    </span>
  );
}

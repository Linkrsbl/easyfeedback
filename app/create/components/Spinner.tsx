export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-t-blue-600 border-2 border-gray-300"
      style={{
        width: size,
        height: size,
      }}
    ></div>
  );
}

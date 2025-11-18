export function StatusBadge({ qty }: { qty: number }) {
  let color = "bg-green-100 text-green-700";

  if (qty <= 0) {
    color = "bg-red-100 text-red-700";
  } else if (qty <= 20) {
    color = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-md font-semibold ${color}`}>
      {qty <= 0 ? "Out of Stock" : qty <= 20 ? "Low Stock" : "Healthy"}
    </span>
  );
}

function FieldSection({
  title,
  fields,
}: {
  title: string;
  fields: Record<string, any>;
}) {
  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-dark-900">
      <h4 className="font-semibold mb-3">{title}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(fields).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs text-gray-500">{key}</p>
            <p className="text-sm font-medium">
              {value || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldSection
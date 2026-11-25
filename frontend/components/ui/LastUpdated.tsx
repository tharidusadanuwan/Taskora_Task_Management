interface LastUpdatedProps {
  dataUpdatedAt: number;
}

export default function LastUpdated({
  dataUpdatedAt,
}: LastUpdatedProps) {
  if (!dataUpdatedAt) {
    return null;
  }

  const formattedTime = new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(new Date(dataUpdatedAt));

  return (
    <span
      className="
        hidden whitespace-nowrap
        text-xs font-medium
        text-slate-400
        md:inline-block

        dark:text-slate-400
      "
    >
      Updated at {formattedTime}
    </span>
  );
}
import { toShortFormat } from "../../utils/dateUtils";

const COLORS = [
  "#689F38", "#26A69A", "#8BC34A", "#4FC3F7",
  "#D500F9", "#FFA726", "#1565C0", "#00BCD4",
];

const toTitleCase = (str) =>
  str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase());

const getInitial = (docname) => {
  const name = docname.startsWith("Dr") ? docname.substring(3).trim() : docname;
  return name[0]?.toUpperCase() || "?";
};

const Listitem = ({ data }) => {
  const color = COLORS[data.docname.charCodeAt(0) % COLORS.length];
  const doctorName = toTitleCase(data.docname);
  const locationName = toTitleCase(data.locname);
  const date = new Date(data.date);
  const dateStr = toShortFormat(date);
  const timeStr = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <li className="flex items-center gap-3 px-4 py-3 min-h-[72px] border-b border-gray-100 last:border-b-0">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {getInitial(data.docname)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{`Dr. ${doctorName}`}</p>
        <p className="text-gray-500 text-xs truncate">{locationName}</p>
      </div>
      <div className="text-right shrink-0 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{dateStr}</p>
        <p>{timeStr}</p>
      </div>
    </li>
  );
};

export default Listitem;

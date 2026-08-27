import { useState } from "react";
import { api } from "../../Api/requests";
import { downloadFile } from "../../utils/Utils";
import { Download, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const DownloadCsv = () => {
  const [date, setDate] = useState({ startDate: "", endDate: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (e) => {
    setDate((prevDate) => ({ ...prevDate, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await api.getExcel(date);
    if (res.status === 200) {
      downloadFile(res);
      console.log("success", res.data);
    } else console.log("error", res);
    setIsLoading(false);
  };

  const validateForm = () =>
    date.startDate.length === 10 && date.endDate.length === 10;

  return (
    <div className="max-w-lg animate-fade-in pb-20 md:pb-0">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Download Report</h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5 flex-1">
          <Label htmlFor="startDate">Start Date</Label>
          <input
            type="date"
            id="startDate"
            onChange={handleDateChange}
            value={date.startDate}
            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue bg-white"
          />
        </div>

        <div className="space-y-1.5 flex-1">
          <Label htmlFor="endDate">End Date</Label>
          <input
            type="date"
            id="endDate"
            onChange={handleDateChange}
            value={date.endDate}
            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue bg-white"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!validateForm() || isLoading}
          className="h-10 gap-2 sm:shrink-0"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {isLoading ? "Downloading..." : "Download"}
        </Button>
      </div>
    </div>
  );
};

export default DownloadCsv;

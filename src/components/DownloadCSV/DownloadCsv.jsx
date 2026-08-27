import { useState } from "react";
import { api } from "../../Api/requests";
import { downloadFile } from "../../utils/Utils";
import { Download, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const dateInputClassName =
  "block w-full h-10 border-0 bg-transparent px-3 text-sm outline-none appearance-none";

const dateFieldClassName =
  "overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue";

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
    <div className="mx-auto w-full max-w-lg box-border pb-20 md:pb-0">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Download Report</h2>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
        <div className="space-y-1.5 md:flex-1 md:min-w-0">
          <Label htmlFor="startDate">Start Date</Label>
          <div className={dateFieldClassName}>
            <input
              type="date"
              id="startDate"
              onChange={handleDateChange}
              value={date.startDate}
              className={dateInputClassName}
            />
          </div>
        </div>

        <div className="space-y-1.5 md:flex-1 md:min-w-0">
          <Label htmlFor="endDate">End Date</Label>
          <div className={dateFieldClassName}>
            <input
              type="date"
              id="endDate"
              onChange={handleDateChange}
              value={date.endDate}
              className={dateInputClassName}
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!validateForm() || isLoading}
          className="h-10 w-full gap-2 md:w-auto md:shrink-0"
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

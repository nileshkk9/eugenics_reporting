import { useEffect, useMemo, useState } from "react";
import { api } from "../../Api/requests";
import { Database, Download, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { downloadCsv } from "../../utils/Utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const COLUMNS = [
  { field: "id", headerName: "S/N" },
  { field: "docname", headerName: "Doctor's Name" },
  { field: "docquali", headerName: "Doctor's Qualification" },
  { field: "locname", headerName: "Location" },
  { field: "chemists", headerName: "Chemists" },
  { field: "sample", headerName: "Sample" },
  { field: "partner", headerName: "Worked With" },
  { field: "miscellaneous", headerName: "Miscellaneous" },
  { field: "fullgeolocation", headerName: "Geo Location" },
  { field: "date", headerName: "Visited On" },
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "name-asc", label: "Doctor A–Z" },
  { value: "name-desc", label: "Doctor Z–A" },
  { value: "location-asc", label: "Location A–Z" },
];

const ALL = "__all__";

const MobileReportCard = ({ entry }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-2 text-sm">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-gray-800">{entry.docname}</span>
      <span className="text-xs text-gray-400">#{entry.id}</span>
    </div>
    {[
      ["Qualification", entry.docquali],
      ["Location", entry.locname],
      ["Worked With", entry.partner],
      ["Sample", entry.sample],
      ["Chemists", entry.chemists],
      ["Miscellaneous", entry.miscellaneous],
      ["Visited On", entry.date],
    ].map(([label, value]) =>
      value ? (
        <div key={label}>
          <span className="text-gray-500 text-xs">{label}: </span>
          <span className="text-gray-700">{value}</span>
        </div>
      ) : null
    )}
  </div>
);

const RegionalReport = () => {
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [entries, setEntries] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState(ALL);
  const [qualificationFilter, setQualificationFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState("date-desc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    getUsernames();
  }, []);

  const getUsernames = async () => {
    const res = await api.getRegionalUsers();
    setUsers(res.data);
  };

  const resetMobileFilters = () => {
    setSearchQuery("");
    setLocationFilter(ALL);
    setQualificationFilter(ALL);
    setSortBy("date-desc");
  };

  const handleSubmit = async () => {
    setIsBtnLoading(true);
    resetMobileFilters();
    const endDatePlus1 = new Date(endDate);
    endDatePlus1.setDate(endDatePlus1.getDate() + 1);
    const res = await api.getEntries({
      username,
      startDate,
      endDate: endDatePlus1,
    });
    setIsVisible(true);
    setEntries(
      res.map((item) => ({
        ...item,
        visitedAt: new Date(item.date).getTime(),
        date: new Date(item.date).toLocaleString(),
      }))
    );
    setIsBtnLoading(false);
  };

  const validateForm = () => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    return (
      username !== "" && startDate !== null && endDate !== null && sDate <= eDate
    );
  };

  const locations = useMemo(
    () =>
      [...new Set(entries.map((e) => e.locname).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [entries]
  );

  const qualifications = useMemo(
    () =>
      [...new Set(entries.map((e) => e.docquali).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = entries.filter((entry) => {
      if (locationFilter !== ALL && entry.locname !== locationFilter) return false;
      if (qualificationFilter !== ALL && entry.docquali !== qualificationFilter)
        return false;
      if (!query) return true;
      return [
        entry.docname,
        entry.docquali,
        entry.locname,
        entry.sample,
        entry.partner,
        entry.chemists,
        entry.miscellaneous,
        entry.fullgeolocation,
        String(entry.id),
      ].some((value) => String(value ?? "").toLowerCase().includes(query));
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return a.visitedAt - b.visitedAt;
        case "name-asc":
          return (a.docname ?? "").localeCompare(b.docname ?? "");
        case "name-desc":
          return (b.docname ?? "").localeCompare(a.docname ?? "");
        case "location-asc":
          return (a.locname ?? "").localeCompare(b.locname ?? "");
        case "date-desc":
        default:
          return b.visitedAt - a.visitedAt;
      }
    });

    return result;
  }, [entries, searchQuery, locationFilter, qualificationFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    locationFilter !== ALL ||
    qualificationFilter !== ALL ||
    sortBy !== "date-desc";

  const handleDownload = (rows) => {
    const start = startDate.toISOString().slice(0, 10);
    const end = endDate.toISOString().slice(0, 10);
    downloadCsv(rows, COLUMNS, `regional-report-${username}-${start}-${end}.csv`);
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Regional Report</h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap mb-6">
        <div className="space-y-1.5 w-full sm:w-auto sm:min-w-[250px]">
          <Label>Username</Label>
          <Select value={username} onValueChange={setUsername}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select username" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user, key) => (
                <SelectItem value={user.username} key={key}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 w-full sm:w-auto sm:min-w-[250px]">
          <Label>Start Date</Label>
          <DatePicker
            selected={startDate}
            onSelect={setStartDate}
            placeholder="Pick start date"
          />
        </div>

        <div className="space-y-1.5 w-full sm:w-auto sm:min-w-[250px]">
          <Label>End Date</Label>
          <DatePicker
            selected={endDate}
            onSelect={setEndDate}
            placeholder="Pick end date"
          />
        </div>

        <div className="space-y-1.5 w-full sm:w-auto sm:self-end">
          <Button
            onClick={handleSubmit}
            disabled={!validateForm() || isBtnLoading}
            className="h-10 gap-2 w-full sm:w-auto"
          >
            {isBtnLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Database size={16} />
            )}
            {isBtnLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </div>

      {entries.length > 0 ? (
        <>
          {/* Mobile filters + results */}
          <div className="md:hidden space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor, location, sample..."
                    className="pl-9 h-10"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setShowMobileFilters((open) => !open)}
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal size={16} />
                </Button>
              </div>

              {showMobileFilters && (
                <div className="space-y-3 pt-1 border-t border-gray-100">
                  <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>All locations</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Qualification</Label>
                    <Select
                      value={qualificationFilter}
                      onValueChange={setQualificationFilter}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All qualifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>All qualifications</SelectItem>
                        {qualifications.map((qual) => (
                          <SelectItem key={qual} value={qual}>
                            {qual}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Sort by</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                <span>
                  Showing {filteredEntries.length} of {entries.length}
                </span>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetMobileFilters}
                      className="inline-flex items-center gap-1 text-brand-blue font-medium"
                    >
                      <X size={14} />
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownload(filteredEntries)}
                    disabled={filteredEntries.length === 0}
                    className="inline-flex items-center gap-1 text-brand-blue font-medium disabled:opacity-50"
                  >
                    <Download size={14} />
                    CSV
                  </button>
                </div>
              </div>
            </div>

            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <MobileReportCard key={entry.id} entry={entry} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="font-medium">No matches for current filters</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={resetMobileFilters}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="flex justify-end mb-3">
              <Button
                variant="outline"
                onClick={() => handleDownload(entries)}
                className="h-10 gap-2"
              >
                <Download size={16} />
                Download CSV
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm max-h-[500px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs sticky top-0">
                  <tr>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.field}
                        className="px-4 py-3 font-medium whitespace-nowrap"
                      >
                        {col.headerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      {COLUMNS.map((col) => (
                        <td
                          key={col.field}
                          className="px-4 py-3 text-gray-700 whitespace-nowrap"
                        >
                          {entry[col.field] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        isVisible && (
          <div className="mt-8 text-center text-gray-500">
            <h3 className="text-xl font-medium">No Data Found</h3>
          </div>
        )
      )}
    </div>
  );
};

export default RegionalReport;

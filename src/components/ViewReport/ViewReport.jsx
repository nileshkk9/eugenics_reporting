import { useEffect, useState } from "react";
import Listitem from "../Listitem/Listitem";
import { api } from "../../Api/requests";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const TOTAL_PAGES = 10;

function getPageWindow(current, total) {
  const range = new Set([1, total]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) range.add(i);
  }
  const sorted = [...range].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const page of sorted) {
    if (page - prev === 2) result.push(prev + 1);
    else if (page - prev > 2) result.push("...");
    result.push(page);
    prev = page;
  }
  return result;
}

const ViewReport = () => {
  const [activePage, setActivePage] = useState(1);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getReports(1);
    // eslint-disable-next-line
  }, []);

  const getReports = async (pageNumber) => {
    setIsLoading(true);
    const reportsRes = await api.getReports(pageNumber);
    if (reportsRes.status === 200) {
      console.log(reportsRes.data);
      setReports(reportsRes.data);
    } else {
      console.log("error", reportsRes.data);
    }
    setIsLoading(false);
  };

  const handlePagination = (pageNumber) => {
    getReports(pageNumber);
    setActivePage(pageNumber);
  };

  const pageItems = getPageWindow(activePage, TOTAL_PAGES);

  return (
    <div className="pb-20 md:pb-0">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : reports.length > 0 ? (
        <>
          <ul className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
            {reports.map((data, i) => (
              <Listitem data={data} key={i} />
            ))}
          </ul>
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => activePage > 1 && handlePagination(activePage - 1)}
                  className={activePage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {pageItems.map((item, i) =>
                item === "..." ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={item === activePage}
                      onClick={() => handlePagination(item)}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    activePage < TOTAL_PAGES && handlePagination(activePage + 1)
                  }
                  className={
                    activePage === TOTAL_PAGES ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <h3 className="text-lg font-medium">No Reports Found</h3>
        </div>
      )}
    </div>
  );
};

export default ViewReport;

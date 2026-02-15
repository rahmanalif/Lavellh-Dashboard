import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  getReviewId,
  getReviewStatus,
  isHiddenStatus,
  truncateText,
} from "./reviewModerationUtils";

const statusBadge = (status) =>
  isHiddenStatus(status)
    ? "bg-red-100 text-red-700 hover:bg-red-100"
    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";

const ReviewTableBase = ({
  rows,
  loading,
  error,
  tab,
  actionLoadingId,
  onHide,
  onRestore,
}) => {
  const renderSkeleton = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <TableRow key={`s-${idx}`}>
        {Array.from({ length: 7 }).map((__, cIdx) => (
          <TableCell key={`${idx}-${cIdx}`}>
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reviewer</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="max-w-[320px]">Review</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            renderSkeleton()
          ) : rows.length ? (
            rows.map((row) => {
              const id = getReviewId(row);
              const status = getReviewStatus(row);
              const reviewText = row.review || row.reviewText || row.comment || "";
              const reviewerName =
                row.reviewer?.name ||
                row.reviewerName ||
                row.user?.fullName ||
                row.userName ||
                "Unknown";
              const targetLabel =
                tab === "providers"
                  ? row.providerName || row.targetName || "Provider"
                  : row.businessServiceName ||
                    row.serviceName ||
                    row.targetName ||
                    "Business";

              return (
                <TableRow key={id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={row.reviewer?.avatar || row.reviewerAvatar || ""}
                        alt={reviewerName}
                        className="h-8 w-8 rounded-full border object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="max-w-[180px] truncate">{reviewerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="max-w-[180px] truncate">{targetLabel}</span>
                      {tab === "businesses" && row.sourceType ? (
                        <Badge variant="secondary">{row.sourceType}</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{row.rating ?? "—"}</TableCell>
                  <TableCell className="max-w-[320px]">
                    <span title={reviewText}>{truncateText(reviewText, 120) || "—"}</span>
                  </TableCell>
                  <TableCell>{formatDate(row.createdAt || row.date)}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge(status)}>
                      {isHiddenStatus(status) ? "Hidden" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {isHiddenStatus(status) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === id}
                          onClick={() => onRestore(row)}
                        >
                          Restore
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoadingId === id}
                          onClick={() => onHide(row)}
                        >
                          Hide
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                {error || "No reviews found for current filters."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewTableBase;

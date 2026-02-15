import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HideReviewModal = ({ open, onOpenChange, onConfirm, submitting, error }) => {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
      setLocalError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setLocalError("Reason is required.");
      return;
    }
    setLocalError("");
    await onConfirm(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hide review</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Add a moderation reason before hiding this review.
          </p>
          <Textarea
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Abusive language"
          />
          {localError ? <p className="text-sm text-red-600">{localError}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={submitting} onClick={handleSubmit}>
            Confirm hide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HideReviewModal;

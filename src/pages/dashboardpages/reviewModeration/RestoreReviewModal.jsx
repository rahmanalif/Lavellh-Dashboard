import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RestoreReviewModal = ({ open, onOpenChange, onConfirm, submitting, error }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Restore review</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          This will make the review visible again to users.
        </p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="button" disabled={submitting} onClick={onConfirm}>
          Confirm restore
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default RestoreReviewModal;

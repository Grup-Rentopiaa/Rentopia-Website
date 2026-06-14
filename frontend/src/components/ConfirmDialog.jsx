import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from './ui/dialog'
import { Button } from './ui/button'

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>Batal</Button>
          <Button variant="destructive" onClick={onConfirm}>Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function RoomTypeFilter({ showPrivate, setShowPrivate, showPublic, setShowPublic, idPrefix = "" }: {
    showPrivate: boolean
    setShowPrivate: (show: boolean) => void
    showPublic: boolean
    setShowPublic: (show: boolean) => void
    idPrefix?: string
  }) {
    return (
      <div>
        <h3 className="font-medium mb-2">Room Type</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${idPrefix}public`}
              checked={showPublic}
              onCheckedChange={(checked) => setShowPublic(checked as boolean)}
            />
            <Label htmlFor={`${idPrefix}public`}>Public Rooms</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${idPrefix}private`}
              checked={showPrivate}
              onCheckedChange={(checked) => setShowPrivate(checked as boolean)}
            />
            <Label htmlFor={`${idPrefix}private`}>Private Rooms</Label>
          </div>
        </div>
      </div>
    )
  }

  export default RoomTypeFilter
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function StatusFilter({ status, setStatus, idPrefix = "" }: {
    status: string
    setStatus: (status: string) => void
    idPrefix?: string
  }) {
    const statuses = [
      { value: "all", label: "All" },
      { value: "live", label: "Live Now" },
      { value: "upcoming", label: "Upcoming" },
      { value: "ended", label: "Ended" },
    ]
  
    return (
      <div>
        <h3 className="font-medium mb-2">Status</h3>
        <RadioGroup value={status} onValueChange={setStatus}>
          {statuses.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={`${idPrefix}${value}`} />
              <Label htmlFor={`${idPrefix}${value}`}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  export default StatusFilter
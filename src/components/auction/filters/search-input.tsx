import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"

function SearchInput({ searchQuery, setSearchQuery, idPrefix = "" }: {
    searchQuery: string
    setSearchQuery: (query: string) => void
    idPrefix?: string
  }) {
    return (
      <div>
        <Label htmlFor={`${idPrefix}search`} className="mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id={`${idPrefix}search`}
            placeholder="Search auctions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }
  export default SearchInput
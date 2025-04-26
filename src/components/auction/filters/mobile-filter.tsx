import { Button } from "@/components/ui/button";
import { FilterProps } from "./auction-filters";
import SearchInput from "./search-input";
import StatusFilter from "./status-filter";
import PriceRangeFilter from "./price-range-filter";
import RoomTypeFilter from "./room-type-filter";

function MobileFilters(props: FilterProps) {
    return (
      <div className="space-y-6">
        <SearchInput
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          idPrefix="mobile-"
        />
        <StatusFilter
          status={props.status}
          setStatus={props.setStatus}
          idPrefix="mobile-"
        />
        <PriceRangeFilter
          priceRange={props.priceRange}
          setPriceRange={props.setPriceRange}
        />
        <RoomTypeFilter
          showPrivate={props.showPrivate}
          setShowPrivate={props.setShowPrivate}
          showPublic={props.showPublic}
          setShowPublic={props.setShowPublic}
          idPrefix="mobile-"
        />
        <Button className="w-full">Apply Filters</Button>
      </div>
    )
  }
  export default MobileFilters
  
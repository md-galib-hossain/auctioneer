import { AuctionRoomsList } from "@/components/auction/auction-rooms-list"
import { AuctionFilters } from "@/components/auction/filters/auction-filters"
import { PageHeader } from "@/components/ui/page-header"

export default function AuctionRoomsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PageHeader title="Live Auction Rooms" description="Join exciting auctions happening right now" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        <AuctionFilters />
        <AuctionRoomsList />
      </div>
    </main>
  )
}

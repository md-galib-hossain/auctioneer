"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import MobileFilters from "./mobile-filter"
import SearchInput from "./search-input"
import StatusFilter from "./status-filter"
import PriceRangeFilter from "./price-range-filter"
import RoomTypeFilter from "./room-type-filter"

export interface FilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  showPrivate: boolean
  setShowPrivate: (show: boolean) => void
  showPublic: boolean
  setShowPublic: (show: boolean) => void
  status: string
  setStatus: (status: string) => void
}




export function AuctionFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showPrivate, setShowPrivate] = useState(true)
  const [showPublic, setShowPublic] = useState(true)
  const [status, setStatus] = useState("all")

  const filterProps: FilterProps = {
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    showPrivate,
    setShowPrivate,
    showPublic,
    setShowPublic,
    status,
    setStatus,
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 px-4">
              <MobileFilters {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-4 h-fit">
        <div className="rounded-lg border border-border p-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="space-y-6">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <Accordion type="single" collapsible defaultValue="status">
              <AccordionItem value="status">
                <AccordionTrigger>Status</AccordionTrigger>
                <AccordionContent>
                  <StatusFilter status={status} setStatus={setStatus} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <PriceRangeFilter
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="visibility">
                <AccordionTrigger>Room Type</AccordionTrigger>
                <AccordionContent>
                  <RoomTypeFilter
                    showPrivate={showPrivate}
                    setShowPrivate={setShowPrivate}
                    showPublic={showPublic}
                    setShowPublic={setShowPublic}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      </div>
    </>
  )
}
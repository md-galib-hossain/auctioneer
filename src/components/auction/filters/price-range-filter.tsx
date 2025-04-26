import { Slider } from "@/components/ui/slider"

function PriceRangeFilter({ priceRange, setPriceRange }: {
    priceRange: number[]
    setPriceRange: (range: number[]) => void
  }) {
    return (
      <div>
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex items-center justify-between">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }
  export default PriceRangeFilter
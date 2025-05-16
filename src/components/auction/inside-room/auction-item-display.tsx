"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Clock, Users, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AuctionItemDisplayProps {
  item: any
}

export function AuctionItemDisplay({ item }: AuctionItemDisplayProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = item?.images || ["/auction-item.jpg"]
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image Gallery */}
        <div className="relative bg-white overflow-hidden">
          <div className="relative aspect-square w-full">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg?height=600&width=600"}
              alt={item.name}
              
              fill
              className="object-cover"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
              {images?.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentImageIndex === index ? "bg-white" : "bg-white/50",
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Badge className="bg-rose-600 text-white border-0">Item #{item.id}</Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              <Clock className="h-4 w-4 mr-1 text-rose-600" />
              <span>
                Ends in <span className="text-rose-600 font-semibold">2h 45m</span>
              </span>
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>20 watching</span>
            </Badge>
          </div>
        </div>

        {/* Item Details */}
        <div className="p-6 flex flex-col bg-white">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-muted-foreground mt-1">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Starting Price</p>
              <p className="text-xl font-semibold">${item.startingPrice}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg">
              <p className="text-sm text-rose-600">Current Bid</p>
              <p className="text-2xl font-bold text-rose-600">${item.currentPrice}</p>
            </div>
          </div>

          <Tabs defaultValue="details" className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-4 bg-gray-50 rounded-lg mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">About this item</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This exquisite pocket watch features intricate engravings, a gold-plated case, and a fully
                    functional Swiss movement. It comes with its original chain and has been professionally serviced.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="border rounded p-2 bg-white">
                    <p className="text-muted-foreground">Year</p>
                    <p className="font-medium">1890</p>
                  </div>
                  <div className="border rounded p-2 bg-white">
                    <p className="text-muted-foreground">Origin</p>
                    <p className="font-medium">Switzerland</p>
                  </div>
                  <div className="border rounded p-2 bg-white">
                    <p className="text-muted-foreground">Material</p>
                    <p className="font-medium">Gold-plated</p>
                  </div>
                  <div className="border rounded p-2 bg-white">
                    <p className="text-muted-foreground">Diameter</p>
                    <p className="font-medium">48mm</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="condition" className="p-4 bg-gray-50 rounded-lg mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white border-0">Excellent</Badge>
                  <span className="text-sm text-muted-foreground">Overall Condition</span>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Condition Details</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This piece has been well-maintained and recently serviced by a professional watchmaker. The movement
                    is in working order, and the case shows minimal signs of wear consistent with its age.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-rose-600" />
                  <span>Authenticity verified by expert appraisers</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="p-4 bg-gray-50 rounded-lg mt-4">
              <ul className="text-sm space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-rose-100 text-rose-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Minimum bid increment is $25</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose-100 text-rose-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Each bid extends the auction time by 30 seconds if placed in the final minute</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose-100 text-rose-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>The highest bidder at the end of the auction wins the item</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose-100 text-rose-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Payment must be completed within 24 hours of auction end</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose-100 text-rose-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    5
                  </span>
                  <span>All sales are final - no returns or exchanges</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  )
}

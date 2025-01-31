"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useFiltersStore } from "@/lib/store/filters"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ProductSearch() {
  const [value, setValue] = useState("")
  const setSearch = useFiltersStore((state) => state.setSearch)
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    setSearch(debouncedValue)
  }, [debouncedValue, setSearch])

  const handleClear = () => {
    setValue("")
    setSearch("")
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search parts..."
        className="pl-10 pr-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
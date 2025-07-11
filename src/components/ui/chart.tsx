"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Disable TypeScript strict type checking for this file
// @ts-ignore
interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string
  height?: string | number
  options?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series?: any[]
  width?: string | number
}

export function Chart({
  type = "line",
  height = "auto",
  width = "100%",
  options = {},
  series = [],
  className,
  ...props
}: ChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ChartComponent, setChartComponent] = useState<any>(null)
  
  // Dynamically load ApexCharts on client-side only
  useEffect(() => {
    // Only import in browser environment
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      import('react-apexcharts').then((mod: any) => {
        setChartComponent(() => mod.default)
      }).catch(err => {
        console.error('Failed to load ApexCharts:', err)
      })
    }
  }, [])
  
  // Configure chart options
  const chartOptions = {
    chart: {
      type,
      toolbar: {
        show: true,
      },
      ...(options.chart as Record<string, unknown> || {}),
    },
    ...options,
  }
  
  // Only render the chart when ApexCharts is loaded
  if (!ChartComponent) {
    return <div className={cn("chart-container min-h-[200px] flex items-center justify-center", className)}>Loading chart...</div>
  }
  
  return (
    <div
      className={cn("chart-container", className)}
      {...props}
    >
      <ChartComponent
        options={chartOptions}
        series={series}
        type={type}
        height={height}
        width={width}
      />
    </div>
  )
}

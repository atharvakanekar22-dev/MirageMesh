import React from 'react'
import { ArrowUpRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricItem {
  id: string
  label: string
  value: number | string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: LucideIcon
  subtext?: string
  isHero?: boolean
}

export interface MetricDisplayProps {
  metrics: MetricItem[]
  isLiveTelemetry?: boolean
  className?: string
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  metrics,
  isLiveTelemetry = false,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {metrics.map((metric) => {
        const isHero = metric.isHero

        if (isHero) {
          return (
            <div
              key={metric.id}
              className="rounded-lg bg-[#315f9f] text-white p-5 shadow-xs flex flex-col justify-between transition-all hover:bg-[#294f87] group cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/90">{metric.label}</span>
                <div className="h-7 w-7 rounded-full flex items-center justify-center bg-white/15 text-white group-hover:bg-white/25 transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="my-3">
                <div className="text-3xl font-bold tracking-tight font-mono tabular-nums text-white">
                  {metric.value}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px]">
                {metric.change ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white">
                    {metric.change}
                  </span>
                ) : (
                  <span className="text-white/80">{metric.subtext || 'Telemetry active'}</span>
                )}
                {!isLiveTelemetry && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white/10 rounded text-white/80">
                    Local
                  </span>
                )}
              </div>
            </div>
          )
        }

        return (
          <div
            key={metric.id}
            className="rounded-lg bg-white border border-[#E5E9E5] p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#D1D8D2] group cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#77847C]">{metric.label}</span>
              <div className="h-7 w-7 rounded-full flex items-center justify-center border border-[#E5E9E5] bg-[#FAFBF9] text-[#77847C] group-hover:border-[#176B4D]/30 group-hover:text-[#176B4D] transition-colors">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl font-bold tracking-tight font-mono tabular-nums text-[#17251F]">
                {metric.value}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E9E5] text-[11px]">
              {metric.change ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#F3F6F3] border border-[#E5E9E5] px-2 py-0.5 text-[11px] font-medium text-[#77847C]">
                  {metric.change}
                </span>
              ) : (
                <span className="text-[#77847C] truncate">{metric.subtext || 'Monitored'}</span>
              )}
              {!isLiveTelemetry && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#FAFBF9] text-[#77847C] border border-[#E5E9E5] rounded">
                  Local
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

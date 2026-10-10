import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import type { Incident } from '@/types/incident'

interface RiskDistributionChartProps {
  incidents: Incident[]
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ incidents }) => {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-[#E5E9E5] rounded-2xl bg-white h-64 text-center shadow-xs">
        <div className="h-10 w-10 rounded-xl bg-[#E8F2EC] border border-[#C8DFD4] flex items-center justify-center text-[#176B4D] mb-2.5">
          <BarChart3 className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-[#17251F]">No Risk Distribution Data</p>
        <p className="text-[11px] text-[#77847C] max-w-xs mt-1">
          Histogram will populate deterministically once security events and risk incidents are ingested.
        </p>
      </div>
    )
  }

  // Calculate actual distribution brackets: 0-25, 26-50, 51-75, 76-100
  const distributionData = [
    {
      range: 'Low (0-25)',
      count: incidents.filter((i) => i.riskScore <= 25).length,
      color: '#82C7A5',
    },
    {
      range: 'Med (26-50)',
      count: incidents.filter((i) => i.riskScore > 25 && i.riskScore <= 50).length,
      color: '#267B58',
    },
    {
      range: 'High (51-75)',
      count: incidents.filter((i) => i.riskScore > 50 && i.riskScore <= 75).length,
      color: '#176B4D',
    },
    {
      range: 'Crit (76-100)',
      count: incidents.filter((i) => i.riskScore > 75).length,
      color: '#104B37',
    },
  ]

  const totalIncidents = incidents.length

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#17251F]">Risk Score Analytics</h3>
          <p className="text-xs text-[#77847C] mt-0.5">
            Derived from {totalIncidents} active incident evaluations
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium text-[#176B4D] bg-[#E8F2EC] px-2.5 py-1 rounded-full border border-[#C8DFD4]">
          Deterministic Score
        </span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="range"
              stroke="#77847C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E5E9E5' }}
            />
            <YAxis
              stroke="#77847C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E5E9E5' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E9E5',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#17251F',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              cursor={{ fill: 'rgba(23, 107, 77, 0.05)' }}
            />
            <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={28}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

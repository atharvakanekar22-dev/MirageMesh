import React, { useState, useMemo } from 'react'
import {
  Key,
  Database,
  Globe,
  Package,
  ArrowUpDown,
  ExternalLink,
  Shield,
} from 'lucide-react'
import type { Decoy, DecoyCategory } from '@/types/decoy'
import { StatusBadge } from '@/components/data-display/StatusBadge'
import { SearchInput } from '@/components/data-display/SearchInput'
import { FilterBar } from '@/components/data-display/FilterBar'
import { EmptyState } from '@/components/data-display/EmptyState'
import { formatDate } from '@/lib/utils'

interface DecoyRegistryTableProps {
  decoys: Decoy[]
  onSelectDecoy: (id: string) => void
  onOpenCreate: () => void
}

export const DecoyRegistryTable: React.FC<DecoyRegistryTableProps> = ({
  decoys,
  onSelectDecoy,
  onOpenCreate,
}) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortField, setSortField] = useState<'createdAt' | 'name' | 'triggerCount'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const categoryFilterOptions = [
    { id: 'all', label: 'All Decoys', count: decoys.length },
    {
      id: 'credential',
      label: 'Credentials',
      count: decoys.filter((d) => d.type === 'credential').length,
    },
    {
      id: 'database_record',
      label: 'DB Collections',
      count: decoys.filter((d) => d.type === 'database_record').length,
    },
    {
      id: 'api_endpoint',
      label: 'API Routes',
      count: decoys.filter((d) => d.type === 'api_endpoint').length,
    },
    {
      id: 'package_identifier',
      label: 'Packages',
      count: decoys.filter((d) => d.type === 'package_identifier').length,
    },
  ]

  const filteredDecoys = useMemo(() => {
    return decoys
      .filter((d) => {
        const matchesCategory =
          selectedCategory === 'all' || d.type === selectedCategory
        const matchesSearch =
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase()) ||
          d.syntheticValue.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sortField === 'createdAt') {
          const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          return sortOrder === 'desc' ? diff : -diff
        }
        if (sortField === 'name') {
          const diff = a.name.localeCompare(b.name)
          return sortOrder === 'asc' ? diff : -diff
        }
        if (sortField === 'triggerCount') {
          const diff = b.triggerCount - a.triggerCount
          return sortOrder === 'desc' ? diff : -diff
        }
        return 0
      })
  }, [decoys, selectedCategory, search, sortField, sortOrder])

  const toggleSort = (field: 'createdAt' | 'name' | 'triggerCount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const getTypeIcon = (type: DecoyCategory) => {
    switch (type) {
      case 'credential':
        return <Key className="h-4 w-4 text-[#176B4D]" />
      case 'database_record':
        return <Database className="h-4 w-4 text-[#267B58]" />
      case 'api_endpoint':
        return <Globe className="h-4 w-4 text-[#A8861B]" />
      case 'package_identifier':
        return <Package className="h-4 w-4 text-[#C47B24]" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls: Search and Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterBar
          options={categoryFilterOptions}
          activeFilter={selectedCategory}
          onChange={setSelectedCategory}
        />
        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search decoys..."
          />
        </div>
      </div>

      {/* Table / Empty State */}
      {filteredDecoys.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No Decoys Found"
          description={
            search || selectedCategory !== 'all'
              ? 'No decoys match your current search or filter.'
              : 'Your decoy inventory is empty. Create a synthetic canary to start monitoring for unauthorized access.'
          }
          actionLabel="Create Decoy"
          onAction={onOpenCreate}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E5E9E5] bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E9E5] bg-[#FAFBF9] text-[#77847C]">
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-[#17251F] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Decoy Resource</span>
                    <ArrowUpDown className="h-3 w-3 text-[#9BA69F]" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th
                  onClick={() => toggleSort('triggerCount')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-[#17251F] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Triggers</span>
                    <ArrowUpDown className="h-3 w-3 text-[#9BA69F]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-[#17251F] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Created</span>
                    <ArrowUpDown className="h-3 w-3 text-[#9BA69F]" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9E5] text-[#17251F]">
              {filteredDecoys.map((decoy) => (
                <tr
                  key={decoy.id}
                  onClick={() => onSelectDecoy(decoy.id)}
                  className="hover:bg-[#FAFBF9] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#E8F2EC] border border-[#C8DFD4] shrink-0">
                        {getTypeIcon(decoy.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#17251F] group-hover:text-[#176B4D] transition-colors truncate">
                          {decoy.name}
                        </div>
                        <div className="font-mono text-[11px] text-[#77847C] truncate mt-0.5">
                          {decoy.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-[#77847C] font-medium">
                      {decoy.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={decoy.status} />
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-[#77847C]">
                    {decoy.triggerCount}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#77847C]">
                    {formatDate(decoy.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectDecoy(decoy.id)
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#176B4D] bg-[#E8F2EC] hover:bg-[#176B4D] hover:text-white transition-all focus-ring shadow-2xs"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

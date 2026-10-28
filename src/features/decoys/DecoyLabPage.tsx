import React, { useState } from 'react'
import { Plus, Shield, Layers, Radio, Sparkles, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { DecoyGenerationForm } from './DecoyGenerationForm'
import { DecoyRegistryTable } from './DecoyRegistryTable'
import { DecoyDetailModal } from './DecoyDetailModal'
import { useDecoys } from '@/hooks/useDecoys'
import type { CreateDecoyInput } from '@/types/decoy'
import { useToast } from '@/hooks/useToast'

export const DecoyLabPage: React.FC = () => {
  const {
    decoys,
    selectedDecoy,
    selectedDecoyId,
    setSelectedDecoyId,
    createDecoy,
    deleteDecoy,
    updateDecoyStatus,
    triggerCanaryTest,
    getDecoyStats,
    isLoading,
    error,
    refreshDecoys,
  } = useDecoys()
  const { showToast } = useToast()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const stats = getDecoyStats()

  const handleCreateSuccess = async (input: CreateDecoyInput) => {
    const created = await createDecoy(input)
    setIsCreateOpen(false)
    showToast(`${created.name} was created successfully.`, 'success')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Decoys"
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={refreshDecoys}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white text-[#77847C] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-all focus-ring shadow-2xs cursor-pointer"
              title="Refresh decoy inventory"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin text-[#176B4D]' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-full bg-[#176B4D] text-white hover:bg-[#104B37] transition-all focus-ring shadow-2xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Decoy</span>
            </button>
          </div>
        }
      />

      {/* Decoy Stats Cards */}
      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-[#f7d4d4] bg-[#fdf2f2] p-4 text-sm text-[#c74646] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">We could not load your decoys.</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
          <button type="button" onClick={refreshDecoys} className="self-start rounded-md border border-[#f7d4d4] bg-white px-3 py-1.5 text-xs font-semibold hover:bg-[#fff8f8] focus-ring sm:self-auto">
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-4.5 border border-[#E5E9E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#77847C]">Total decoys</span>
            <div className="text-2xl font-bold font-mono text-[#17251F] mt-1 tabular-nums">
              {stats.total}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4.5 border border-[#E5E9E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#77847C]">Active Decoys</span>
            <div className="text-2xl font-bold font-mono text-[#267B58] mt-1 tabular-nums">
              {stats.active}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E8F5EE] text-[#267B58]">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4.5 border border-[#E5E9E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#77847C]">Paused</span>
            <div className="text-2xl font-bold font-mono text-[#176B4D] mt-1 tabular-nums">
              {stats.staged}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
            <Radio className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4.5 border border-[#E5E9E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#77847C]">Trips</span>
            <div className="text-2xl font-bold font-mono text-[#17251F] mt-1 tabular-nums">
              {stats.triggered}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F3F6F3] text-[#77847C]">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <DecoyRegistryTable
        decoys={decoys}
        onSelectDecoy={(id) => setSelectedDecoyId(id)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Generation Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Decoy"
        description="Add a synthetic resource to your monitoring mesh."
        maxWidth="lg"
      >
        <DecoyGenerationForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Detail Inspection Modal */}
      <DecoyDetailModal
        decoy={selectedDecoy}
        isOpen={!!selectedDecoyId}
        onClose={() => setSelectedDecoyId(null)}
        onDelete={deleteDecoy}
        onToggleStatus={updateDecoyStatus}
        onTriggerCanary={triggerCanaryTest}
      />
    </div>
  )
}

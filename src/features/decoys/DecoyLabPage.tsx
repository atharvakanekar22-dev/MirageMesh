import React, { useState } from 'react'
import { Plus, Shield, Layers, Radio, Sparkles, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { DecoyGenerationForm } from './DecoyGenerationForm'
import { DecoyRegistryTable } from './DecoyRegistryTable'
import { DecoyDetailModal } from './DecoyDetailModal'
import { useDecoys } from '@/hooks/useDecoys'
import { GlossaryTerm } from '@/components/ui/GlossaryTerm'
import type { CreateDecoyInput } from '@/types/decoy'

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
    refreshDecoys,
  } = useDecoys()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const stats = getDecoyStats()

  const handleCreateSuccess = async (input: CreateDecoyInput) => {
    try {
      await createDecoy(input)
      setIsCreateOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="AI Decoy Lab"
        description="Synthetic canary resource laboratory. Author, configure, and stage zero-privilege honeytokens across infrastructure and application environments."
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
              <span>Create Synthetic Decoy</span>
            </button>
          </div>
        }
      />

      {/* Decoy Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-4.5 border border-[#E5E9E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#77847C]">Total Staged <GlossaryTerm term="Decoys">Fake digital items, like passwords or web pages, that are set up to attract and spot intruders.</GlossaryTerm></span>
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
            <span className="text-[11px] font-medium text-[#77847C]">Staged in Pipeline</span>
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
            <span className="text-[11px] font-medium text-[#77847C]">Observed Canary Trips</span>
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
        title="Generate Synthetic Canary Decoy"
        description="Configure a zero-privilege decoy artifact for threat detection."
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

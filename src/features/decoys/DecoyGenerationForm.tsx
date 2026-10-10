import React, { useState } from 'react'
import { AlertCircle, Key, Database, Globe, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DecoyGenerationSchema, type DecoyGenerationFormData } from '@/lib/validators'
import type { DecoyCategory, CreateDecoyInput } from '@/types/decoy'

interface DecoyGenerationFormProps {
  onSuccess: (decoy: CreateDecoyInput) => void
  onCancel: () => void
}

export const DecoyGenerationForm: React.FC<DecoyGenerationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DecoyGenerationFormData>({
    name: '',
    type: 'credential',
    environment: 'staging',
    namingConvention: 'shadow-canary',
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Synthetic preview generator based on category
  const getSyntheticPreview = (type: DecoyCategory, name: string) => {
    const slug = name ? name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'canary-seed'
    switch (type) {
      case 'credential':
        return `AKIA_${slug.toUpperCase().slice(0, 10)}_CANARY_TOKEN`
      case 'database_record':
        return `mongodb+srv://synthetic-${slug}:mesh-canary@db.internal/${slug}_shadow`
      case 'api_endpoint':
        return `https://mesh-ingress.meshsec.net/v1/internal/${slug}/token`
      case 'package_identifier':
        return `@internal-corp/${slug}-telemetry-sdk@0.0.1`
    }
  }

  const categoryOptions: {
    type: DecoyCategory
    label: string
    icon: React.ComponentType<{ className?: string }>
    hint: string
  }[] = [
    {
      type: 'credential',
      label: 'Synthetic Credential',
      icon: Key,
      hint: 'IAM key, bearer token, or private key format',
    },
    {
      type: 'database_record',
      label: 'Fake DB Collection / Record',
      icon: Database,
      hint: 'Seeded decoy collection with canary webhook',
    },
    {
      type: 'api_endpoint',
      label: 'Fake Internal API Resource',
      icon: Globe,
      hint: 'Internal routing path monitored for unauthorized probes',
    },
    {
      type: 'package_identifier',
      label: 'Synthetic Package Identifier',
      icon: Package,
      hint: 'Dependency confusion canary package token',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = DecoyGenerationSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    setTimeout(() => {
      const syntheticValue = getSyntheticPreview(formData.type, formData.name)
      onSuccess({
        name: formData.name,
        type: formData.type,
        syntheticValue,
        environment: formData.environment,
        namingConvention: formData.namingConvention,
        description: formData.description,
      })
      setIsSubmitting(false)
    }, 350)
  }

  const previewValue = getSyntheticPreview(formData.type, formData.name)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Notice on synthetic security hygiene */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-xs text-[#77847C]">
        <AlertCircle className="h-4 w-4 text-[#176B4D] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[#17251F]">Security Hygiene Principle: </span>
          All resources generated in this lab are synthetic honeytokens. Never input real production keys or sensitive internal credentials.
        </div>
      </div>

      {/* Decoy Category Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#17251F]">
          Decoy Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categoryOptions.map((cat) => {
            const Icon = cat.icon
            const isSelected = formData.type === cat.type
            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => setFormData({ ...formData, type: cat.type })}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer focus-ring ${
                  isSelected
                    ? 'border-[#176B4D] bg-[#E8F2EC] text-[#17251F]'
                    : 'border-[#E5E9E5] bg-white text-[#77847C] hover:bg-[#FAFBF9]'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-[#176B4D] text-white' : 'bg-[#F3F6F3] text-[#77847C]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#17251F]">{cat.label}</div>
                  <div className="text-[11px] text-[#77847C] mt-0.5 truncate">{cat.hint}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Decoy Name */}
      <Input
        label="Decoy Identifier / Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g. AWS_PROD_DEPLOY_KEY_STAGED"
        error={errors.name}
        helperText="Used to identify this decoy in event timelines and audit logs"
      />

      {/* Target Deployment Environment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Target Environment"
          value={formData.environment}
          onChange={(e) =>
            setFormData({
              ...formData,
              environment: e.target.value as 'development' | 'staging' | 'production-sim',
            })
          }
          options={[
            { value: 'staging', label: 'Staging Environment' },
            { value: 'development', label: 'Development Sandboxes' },
            { value: 'production-sim', label: 'Production Simulation Mesh' },
          ]}
        />

        <Input
          label="Naming Convention Style"
          value={formData.namingConvention || ''}
          onChange={(e) => setFormData({ ...formData, namingConvention: e.target.value })}
          placeholder="e.g. shadow-canary-v2"
          helperText="Optional naming prefix/suffix schema"
        />
      </div>

      {/* Synthetic Output Preview */}
      <div className="rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] p-3.5 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-[#77847C] uppercase font-semibold">Synthetic Canary Pattern</span>
          <span className="text-[10px] text-[#176B4D] font-mono font-medium">Staged Model</span>
        </div>
        <div className="font-mono text-xs text-[#176B4D] font-medium break-all select-all py-1">
          {previewValue}
        </div>
      </div>

      {/* Optional Description */}
      <Input
        label="Context & Deployment Notes (Optional)"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Where this canary will be seeded (e.g. git repo, CI variable)"
        error={errors.description}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E9E5]">
        <Button variant="outline" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
          Stage Synthetic Decoy
        </Button>
      </div>
    </form>
  )
}

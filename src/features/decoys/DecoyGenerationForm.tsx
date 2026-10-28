import React, { useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DecoyGenerationSchema, type DecoyGenerationFormData } from '@/lib/validators'
import type { CreateDecoyInput } from '@/types/decoy'

interface DecoyGenerationFormProps {
  onSuccess: (decoy: CreateDecoyInput) => Promise<void> | void
  onCancel: () => void
}

const initialFormData: DecoyGenerationFormData = {
  name: '',
  type: 'credential',
  environment: 'staging',
  description: '',
}

export const DecoyGenerationForm: React.FC<DecoyGenerationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DecoyGenerationFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const updateField = <K extends keyof DecoyGenerationFormData>(
    field: K,
    value: DecoyGenerationFormData[K]
  ) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '', form: '' }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    const result = DecoyGenerationSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field) fieldErrors[String(field)] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await onSuccess({
        name: result.data.name,
        type: result.data.type,
        environment: result.data.environment,
        description: result.data.description,
        syntheticValue: '',
      })
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Unable to create decoy. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 text-xs">
        <span className={step === 1 ? 'font-semibold text-[#315f9f]' : 'text-[#667085]'}>1. Choose a resource</span>
        <span className="h-px flex-1 bg-[#e5e9e5]" />
        <span className={step === 2 ? 'font-semibold text-[#315f9f]' : 'text-[#667085]'}>2. Name and place it</span>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-[#d9e0e7] bg-[#f8fafc] p-3 text-xs text-[#667085]">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#315f9f]" />
        <p className="leading-relaxed">
          Use a made-up name. MirageMesh generates the synthetic value automatically; never enter a real credential.
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <Select
            label="What should it look like?"
            value={formData.type}
            onChange={(event) =>
              updateField('type', event.target.value as DecoyGenerationFormData['type'])
            }
            options={[
              { value: 'credential', label: 'Credential or token' },
              { value: 'database_record', label: 'Database record' },
              { value: 'api_endpoint', label: 'Internal API resource' },
              { value: 'package_identifier', label: 'Package identifier' },
            ]}
          />
          <p className="text-xs leading-relaxed text-[#667085]">
            Choose the kind of synthetic resource you want to monitor for unauthorized use.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="e.g. deploy-key-staging"
            error={errors.name}
            autoFocus
          />
          <Select
            label="Environment"
            value={formData.environment}
            onChange={(event) =>
              updateField(
                'environment',
                event.target.value as DecoyGenerationFormData['environment']
              )
            }
            options={[
              { value: 'staging', label: 'Staging' },
              { value: 'development', label: 'Development' },
              { value: 'production-sim', label: 'Production simulation' },
            ]}
          />
          <Input
            label="Notes (optional)"
            value={formData.description || ''}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Where will you place this decoy?"
            error={errors.description}
          />
        </div>
      )}

      {errors.form && (
        <p role="alert" className="rounded-md bg-[#fdf2f2] px-3 py-2 text-xs font-medium text-[#c74646]">
          {errors.form}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-[#e5e9e5] pt-4">
        <Button variant="outline" size="sm" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {step === 2 && (
            <Button variant="ghost" size="sm" type="button" onClick={() => setStep(1)} disabled={isSubmitting} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Continue
            </Button>
          ) : (
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create decoy'}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C8DFD4] bg-[#E8F2EC] text-[#176B4D] mb-4 shadow-xs">
        <ShieldAlert className="h-7 w-7" />
      </div>

      <span className="font-mono text-xs text-[#176B4D] font-bold uppercase tracking-wider">
        404 — Route Anomaly
      </span>
      <h1 className="text-xl font-bold text-[#17251F] mt-1.5">
        Page Not Located in Mesh Topology
      </h1>
      <p className="mt-2 text-xs text-[#77847C] max-w-sm leading-relaxed">
        The requested URL path does not correspond to any registered MirageMesh navigation endpoint
        or security module.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Home className="h-3.5 w-3.5" />}
          onClick={() => navigate('/overview')}
        >
          Return to Overview
        </Button>
      </div>
    </div>
  )
}

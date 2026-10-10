import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { OverviewPage } from '@/features/overview/OverviewPage'
import { DecoyLabPage } from '@/features/decoys/DecoyLabPage'
import { SimulationPage } from '@/features/simulation/SimulationPage'
import { IncidentsPage } from '@/features/incidents/IncidentsPage'
import { ResponseCentrePage } from '@/features/response/ResponseCentrePage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'decoys',
        element: <DecoyLabPage />,
      },
      {
        path: 'simulation',
        element: <SimulationPage />,
      },
      {
        path: 'incidents',
        element: <IncidentsPage />,
      },
      {
        path: 'incidents/:id',
        element: <IncidentsPage />,
      },
      {
        path: 'response',
        element: <ResponseCentrePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

import OperationalHeader from '../navigation/OperationalHeader'
import OperationalSidebar from '../navigation/OperationalSidebar'
import OverviewCards from './OverviewCards'
import NewScanPanel from './NewScanPanel'
import ResultsPanel from './ResultsPanel'
import ProbeLibrary from './ProbeLibrary'
import LastReportPanel from './LastReportPanel'
import ScanHistoryPanel from './ScanHistoryPanel'

interface OperationalDashboardProps {
  activeView?: 'scan' | 'results' | 'probes' | 'report' | 'history'
}

export default function OperationalDashboard({ activeView = 'scan' }: OperationalDashboardProps) {
  return (
    <>
      <OverviewCards />
      <NewScanPanel />
      <ResultsPanel />
      <ProbeLibrary />
      <LastReportPanel />
      <ScanHistoryPanel />
    </>
  )
}

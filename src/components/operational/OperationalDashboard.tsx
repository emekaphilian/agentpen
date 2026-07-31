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
    <div className="app-shell-root">
      <OperationalSidebar activeItem={activeView} />
      <div className="main">
        <OperationalHeader title="New Scan" meta="Configure and run adversarial probes" />
        <div className="content">
          <OverviewCards />
          <NewScanPanel />
          <ResultsPanel />
          <ProbeLibrary />
          <LastReportPanel />
          <ScanHistoryPanel />
        </div>
      </div>
    </div>
  )
}

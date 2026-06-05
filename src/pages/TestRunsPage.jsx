import { Link } from 'react-router-dom';
import { TestRunsPanel } from '../components/testRuns/TestRunsPanel';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { MAX_TEST_RUNS } from '../constants/testRuns';
import { useTestRunsContext } from '../context/TestRunsContext';

export function TestRunsPage() {
  const { testRuns } = useTestRunsContext();
  const atLimit = testRuns.length >= MAX_TEST_RUNS;

  return (
    <div className="page-section">
      <PageHeader
        title="Test Runs"
        subtitle="Group bug recordings into QA execution sessions."
        data-testid="test-runs-page-title"
        action={
          <Link to="/test-runs/new" data-testid="test-runs-create-link">
            <Button disabled={atLimit}>Create Test Run</Button>
          </Link>
        }
      />

      <TestRunsPanel showHeader={false} />
    </div>
  );
}

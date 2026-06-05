import { useNavigate } from 'react-router-dom';
import { CreateTestRunForm } from '../components/testRuns/CreateTestRunForm';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';

export function CreateTestRunPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-xl page-section">
      <PageHeader
        title="Create Test Run"
        subtitle="Name a QA session, then link bugs from the test run detail page."
        data-testid="create-test-run-title"
      />

      <Card>
        <CardHeader title="Test run details" />
        <CardBody>
          <CreateTestRunForm
            onCreated={(run) => navigate(`/test-runs/${run.id}`)}
            onCancel={() => navigate('/test-runs')}
          />
        </CardBody>
      </Card>
    </div>
  );
}

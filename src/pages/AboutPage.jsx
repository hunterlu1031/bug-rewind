import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';

const ABOUT_PARAGRAPHS = [
  'This project is an experimental QA workflow tool designed to improve how bugs are reported, reproduced, and understood. Traditional bug trackers often rely on static text descriptions that can be incomplete or difficult to reproduce, leading to ambiguity between QA and engineering teams.',
  'This platform explores a more interactive approach to debugging by combining bug tracking with user interaction recording, visual step-by-step replay, screenshot-based evidence, and rule-based AI insights. The goal is to make bug reports more reproducible, visual, and easier to investigate.',
  'In its current form, the application is a frontend-only proof of concept built using React and localStorage. It demonstrates core ideas such as interaction capture within a controlled Test Playground, replayable execution of recorded steps, and lightweight AI-style analysis without external services.',
  'The architecture is intentionally designed with future expansion in mind. A backend layer could be introduced to support multi-user collaboration, persistent shared bug databases, authentication, cloud storage for screenshots and recordings, and integration with real AI services. This would evolve the system into a fully scalable QA platform suitable for engineering teams.',
  'Beyond that, the concept could also be extended into a Chrome extension, enabling real-world session recording directly within any website. This would allow QA engineers to capture bugs in live production or staging environments, automatically generate reproducible interaction flows, and import them into the platform for replay, analysis, and collaboration.',
  'For now, it serves as a working prototype of that vision — demonstrating how modern QA systems can evolve from static ticketing tools into interactive, replay-driven debugging environments.',
  'Developed using Cursor AI IDE to rapidly prototype and iterate on modern QA workflow concepts and frontend architecture.',
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl page-section">
      <PageHeader
        title="About"
        subtitle="Vision, current scope, and future direction"
        data-testid="about-title"
      />

      <Card data-testid="about-content-card">
        <CardHeader title="About this project" />
        <CardBody className="space-y-5">
          {ABOUT_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className="text-base leading-7 text-stripe-muted">
              {paragraph}
            </p>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

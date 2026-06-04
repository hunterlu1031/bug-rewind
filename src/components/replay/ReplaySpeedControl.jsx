import {
  clampReplayDelay,
  DEFAULT_REPLAY_DELAY_MS,
  MAX_REPLAY_DELAY_MS,
  MIN_REPLAY_DELAY_MS,
} from '../../constants/playground';

const toneConfig = {
  stripe: {
    wrap: 'rounded-lg border border-stripe-border bg-stripe-bg p-4',
    label: 'text-stripe-ink',
    hint: 'text-stripe-muted',
    accent: 'accent-stripe-accent',
    input: 'stripe-input w-20 py-2',
  },
  playground: {
    wrap: 'rounded-2xl border border-pg-line bg-pg-accent-soft/30 p-4',
    label: 'text-pg-ink',
    hint: 'text-pg-muted',
    accent: 'accent-pg-accent',
    input: 'pg-input w-20 py-2',
  },
};

export function ReplaySpeedControl({
  value,
  onChange,
  disabled = false,
  id = 'replay-speed',
  tone = 'stripe',
}) {
  const cfg = toneConfig[tone] || toneConfig.stripe;

  return (
    <div data-testid="replay-speed-control" className={cfg.wrap}>
      <label htmlFor={id} className={`block text-sm font-medium ${cfg.label}`}>
        Step delay (ms)
      </label>
      <p className={`mt-0.5 text-xs ${cfg.hint}`}>
        Pause between steps · {MIN_REPLAY_DELAY_MS}–{MAX_REPLAY_DELAY_MS} ms (default{' '}
        {DEFAULT_REPLAY_DELAY_MS})
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          id={id}
          type="range"
          min={MIN_REPLAY_DELAY_MS}
          max={MAX_REPLAY_DELAY_MS}
          step={10}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clampReplayDelay(Number(e.target.value)))}
          data-testid="replay-speed-slider"
          className={`h-2 min-w-[140px] flex-1 cursor-pointer ${cfg.accent}`}
        />
        <input
          type="number"
          min={MIN_REPLAY_DELAY_MS}
          max={MAX_REPLAY_DELAY_MS}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clampReplayDelay(Number(e.target.value)))}
          data-testid="replay-speed-input"
          className={cfg.input}
        />
      </div>
    </div>
  );
}

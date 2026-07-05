export const CAPABILITIES = [
  {
    key: 'emotional_regulation',
    icon: '❤️',
    name: 'Emotional regulation',
    description: 'Staying grounded under pressure',
    tint: 'var(--tint-emotional-regulation)',
    prompt:
      "Recall a moment today when you felt a spike of frustration, anxiety, or irritation. What happened just before the feeling arose?",
  },
  {
    key: 'critical_thinking',
    icon: '🧠',
    name: 'Critical thinking',
    description: 'Making sharper decisions',
    tint: 'var(--tint-critical-thinking)',
    prompt:
      "Before your next decision today, write the question you're actually answering. What's the desired outcome and one way you'd know if it worked?",
  },
  {
    key: 'situational_judgement',
    icon: '⚖️',
    name: 'Situational judgement',
    description: 'Reading the moment accurately',
    tint: 'var(--tint-situational-judgement)',
    prompt:
      'Think about your next interaction. What is this moment actually about — task, emotion, alignment, or reassurance?',
  },
  {
    key: 'change_agility',
    icon: '⚡',
    name: 'Change agility',
    description: 'Staying steady when things shift',
    tint: 'var(--tint-change-agility)',
    prompt:
      "Identify one thing that shifted today — in priority, pace, tone, or expectation. Write: 'The shift I noticed is...'",
  },
  {
    key: 'influence',
    icon: '🤝',
    name: 'Influence',
    description: 'Moving people without authority',
    tint: 'var(--tint-influence)',
    prompt:
      'Think of a moment today where you needed to move someone without relying on authority. What did you do, and how did it land?',
  },
];

export function getCapability(key) {
  return CAPABILITIES.find((c) => c.key === key) || null;
}

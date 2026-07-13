import { HeartStraight, Brain, Scales, Lightning, Handshake } from '@phosphor-icons/react';

export const CAPABILITIES = [
  {
    key: 'emotional_regulation',
    icon: HeartStraight,
    name: 'Emotional Regulation',
    description: 'Staying grounded under pressure',
    tint: 'var(--tint-emotional-regulation)',
    color: 'var(--color-emotional-regulation)',
    /* NOVA: edit copy here */
    whyItMatters:
      'How you handle pressure sets the tone for everyone around you: steady reactions build trust, reactive ones erode it.',
    /* NOVA: edit copy here */
    whatYoullGain:
      "A wider gap between what triggers you and how you respond, so you can choose your reaction instead of defaulting to it.",
  },
  {
    key: 'critical_thinking',
    icon: Brain,
    name: 'Critical Thinking',
    description: 'Making sharper decisions',
    tint: 'var(--tint-critical-thinking)',
    color: 'var(--color-critical-thinking)',
    /* NOVA: edit copy here */
    whyItMatters:
      'Sharper thinking means fewer decisions made on autopilot, and fewer that need to be unwound later.',
    /* NOVA: edit copy here */
    whatYoullGain:
      'A habit of naming the real question before you answer it, so your decisions hold up under scrutiny.',
  },
  {
    key: 'situational_judgement',
    icon: Scales,
    name: 'Situational Judgement',
    description: 'Reading the moment accurately',
    tint: 'var(--tint-situational-judgement)',
    color: 'var(--color-situational-judgement)',
    /* NOVA: edit copy here */
    whyItMatters:
      "Reading a moment correctly, what it actually needs from you, is what separates a helpful response from a mistimed one.",
    /* NOVA: edit copy here */
    whatYoullGain:
      'A sharper read on what each situation is really asking of you, before you decide how to show up.',
  },
  {
    key: 'change_agility',
    icon: Lightning,
    name: 'Change Agility',
    description: 'Staying steady when things shift',
    tint: 'var(--tint-change-agility)',
    color: 'var(--color-change-agility)',
    /* NOVA: edit copy here */
    whyItMatters:
      'Change is constant, and how quickly you adapt to it shapes how much of it feels like a crisis versus a normal Tuesday.',
    /* NOVA: edit copy here */
    whatYoullGain:
      "Faster footing when things shift, so you spend less energy resisting change and more steering through it.",
  },
  {
    key: 'influence',
    icon: Handshake,
    name: 'Influencing',
    description: 'Moving people without authority',
    tint: 'var(--tint-influence)',
    color: 'var(--color-influence)',
    /* NOVA: edit copy here */
    whyItMatters:
      'The best ideas still need buy-in, and influencing is what turns a good point into a shared decision.',
    /* NOVA: edit copy here */
    whatYoullGain:
      'More confidence moving people toward an outcome without needing to pull rank to get there.',
  },
];

export function getCapability(key) {
  return CAPABILITIES.find((c) => c.key === key) || null;
}

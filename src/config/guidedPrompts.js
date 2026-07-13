// Nova: edit prompt wording here. Six prompts per capability; one is shown per day, picked
// deterministically so it stays the same all day but varies day to day.
export const GUIDED_PROMPTS = {
  emotional_regulation: [
    'Recall a moment today when you felt a spike of frustration, anxiety, or irritation. What happened just before the feeling arose?',
    'Think of a moment today when you managed to stay calm under pressure. What helped you hold steady?',
    "Was there a point today when your reaction didn't match the size of the situation? What was really going on underneath?",
    'Recall a conversation today where you felt your emotions rising. What did you do in that moment, and what would you do differently?',
    'Think about a moment today when you noticed tension in your body before you noticed it in your mind. What was happening?',
    "Was there a moment today you wish you'd paused before responding? What made pausing hard?",
  ],
  critical_thinking: [
    "Before your next decision today, write the question you're actually answering. What's the desired outcome, and one way you'd know if it worked?",
    'Think of a decision you made today quickly. What assumption were you making, and was it tested?',
    'Recall a moment today when you had incomplete information but had to act anyway. What did you do to fill the gap?',
    'Was there a moment today when you changed your mind after hearing a new fact or perspective? What shifted your thinking?',
    "Think of a problem you're facing right now. If you had to argue the opposite of your current view, what's the strongest case?",
    'Recall a moment today when you noticed yourself jumping to a conclusion. What did you actually know, and what were you assuming?',
  ],
  situational_judgement: [
    'Think about your next interaction. Is this moment actually about the task, the emotion, alignment, or reassurance?',
    "Recall a moment today when you misread the room at first. What tipped you off that you'd got it wrong?",
    "Was there a conversation today where what was said mattered less than what wasn't said? What did you notice?",
    'Think of a moment today when you adjusted your approach based on who you were talking to. What cue told you to adjust?',
    'Recall a moment today when timing mattered as much as content. Did you get the timing right?',
    "Was there a moment today when you had to read between the lines of someone's reaction? What did you pick up on?",
  ],
  change_agility: [
    "Identify one thing that shifted today, in priority, pace, tone, or expectation. Write: 'The shift I noticed is...'",
    'Recall a moment today when plans changed at short notice. How did you respond in the first few minutes?',
    'Was there a moment today when you resisted a change before accepting it? What was the resistance about?',
    'Think of a moment today when uncertainty was high. What helped you stay steady, or what would have helped?',
    "Recall something today that didn't go the way you expected. How did you adjust your next move?",
    "Was there a moment today when you had to let go of a plan you'd invested in? How did you handle that?",
  ],
  influence: [
    "Think of a moment today when you needed to move someone without relying on authority. What did you do, and how did it land?",
    "Recall a moment today when you tried to bring someone around to your point of view. What worked, or what didn't?",
    'Was there a moment today when you adjusted how you framed something to land better with a specific person? What did you change?',
    'Think of a moment today when someone pushed back on you. How did you respond, and what was the outcome?',
    'Recall a moment today when you built support for an idea before formally proposing it. What did you do?',
    'Was there a moment today when you influenced someone through a question rather than a statement? What did you ask?',
  ],
};

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export function getDailyPrompt(capabilityKey, date = new Date()) {
  const pool = GUIDED_PROMPTS[capabilityKey];
  if (!pool || !pool.length) return null;
  const index = dayOfYear(date) % pool.length;
  return pool[index];
}

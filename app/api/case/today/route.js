import { createClient } from '@supabase/supabase-js';
import { DIAGNOSES } from '@/lib/diagnoses';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function getDateKey() {
  return new Date().toISOString().split('T')[0];
}

async function generateCase(dateStr) {
  const list = DIAGNOSES.join(', ');
  const systems = [
    'endocrine','gastrointestinal','neurological','respiratory',
    'cardiac','dermatological','urinary','haematological',
    'infectious disease','toxicological','musculoskeletal','ophthalmic'
  ];
  const system = systems[Math.floor(Math.random() * systems.length)];
  const species = Math.random() > 0.5 ? 'dog' : 'cat';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1600,
      messages: [{
        role: 'user',
        content: `Generate a small animal veterinary clinical case for Vetordle on ${dateStr}. 
The case should involve a ${species} with a ${system} condition.
The diagnosis MUST be exactly one of these (copy verbatim): ${list}

Return ONLY a valid JSON object, nothing else:
{
  "diagnosis": "exact string from list",
  "species": "${species}",
  "breed": "specific breed",
  "age": "e.g. 6-year-old",
  "sex": "MN, FS, M, or F",
  "presenting_complaint": "One sentence chief complaint from owner.",
  "clue_1": "Relevant history: 2-3 sentences.",
  "clue_2": "Physical examination: 3-4 key abnormal findings.",
  "clue_3": "Diagnostics: CBC, biochemistry, urinalysis, or first-line results.",
  "clue_4": "Advanced diagnostics: imaging, specific assays, or biopsy findings.",
  "clue_5": "Clinching detail: highly specific or pathognomonic finding.",
  "summary": "3-4 educational sentences on pathophysiology, diagnosis, and treatment."
}`
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const text = (data.content || []).map(b => b.text || '').join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');

  const parsed = JSON.parse(match[0]);

  // Ensure diagnosis matches our list exactly
  if (!DIAGNOSES.includes(parsed.diagnosis)) {
    const fix = DIAGNOSES.find(d => d.toLowerCase() === parsed.diagnosis.toLowerCase());
    if (fix) parsed.diagnosis = fix;
    else throw new Error(`Diagnosis not in list: ${parsed.diagnosis}`);
  }

  return parsed;
}

export async function GET() {
  try {
    const today = getDateKey();

    // Check if case already exists for today
    const { data: existing, error: fetchError } = await supabase
      .from('daily_cases')
      .select('*')
      .eq('date', today)
      .single();

    if (existing && !fetchError) {
      return Response.json(existing);
    }

    // Generate a new case
    const caseData = await generateCase(today);

    // Store in Supabase
    const { data: newCase, error: insertError } = await supabase
      .from('daily_cases')
      .insert({ date: today, ...caseData })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    return Response.json(newCase);
  } catch (err) {
    console.error('Case generation error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

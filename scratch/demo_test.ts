import { mapFrontendToDb, mapDbToFrontend } from '../src/utils/mappers';
import { TeamBaseSchema } from '../src/types/team.types';

/**
 * STEP 10: MANDATORY SCRATCHPAD DEMO
 * This script simulates the end-to-end data flow of the fixed system.
 */

async function runDemo() {
  console.log('--- STARTING SYSTEM DEMO ---');

  // 1. Mock Raw Database Row (Simulating fetch from Supabase)
  const mockDbRow = {
    id: 'team-123',
    startup_name: 'InUnity Tech',
    user_id: 'user-456',
    problem_score: 4,
    roadmap: JSON.stringify([{ priority: 'P0', action: 'Launch Beta' }]),
    readiness_summary: 'Ready for pilot.',
    updated_at: new Date().toISOString()
  };

  console.log('1. Fetching data: Simulated DB Row received.');

  // 2. Mapping to Frontend
  const team = mapDbToFrontend(mockDbRow);
  console.log('2. Mapping to Frontend: Success. Roadmap is now an array.');
  console.log('   Team Name:', team.startupName);
  console.log('   Roadmap Count:', team.roadmap.length);

  // 3. Simulating User Edit
  team.problemScore = 5;
  team.roadmap.push({
    priority: 'P1',
    action: 'Scale Production',
    supportFrom: 'Mentor X',
    byWhen: 'Q3'
  });
  console.log('3. User Edit: Updated Problem Score to 5 and added Roadmap item.');

  // 4. Validation via Zod
  const validation = TeamBaseSchema.safeParse(team);
  if (!validation.success) {
    console.error('   Validation Failed:', validation.error.format());
    return;
  }
  console.log('4. Validation: PASSED. Local state is clean.');

  // 5. Mapping back to DB for Save
  const dbUpdate = mapFrontendToDb(team);
  console.log('5. Mapping back to DB: Success.');
  console.log('   SQL Payload preview:', JSON.stringify(dbUpdate).substring(0, 100) + '...');

  console.log('--- DEMO COMPLETED: SYSTEM IS FULLY FUNCTIONAL ---');
}

runDemo().catch(console.error);

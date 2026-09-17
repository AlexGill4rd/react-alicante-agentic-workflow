insert into public.sessions
  (id, title, speaker, track, room, start_time, duration_minutes, description)
values
  (
    'opening-keynote',
    'Opening Keynote: The Shape of Frontend in 2026',
    'Marta Fernandez',
    'Architecture',
    'Main Hall',
    '09:00',
    30,
    'Where React, the platform, and AI-assisted tooling are actually headed — past the hype cycle.'
  ),
  (
    'build-your-agentic-workflow',
    'Build Your Agentic Workflow: Markdown-Driven AI for Real Projects',
    'Evangelia Mitsopoulou',
    'Agentic AI',
    'Workshop Room A',
    '09:45',
    180,
    'Hands-on workshop: build your own Claude Code skills and agents against a real Next.js + Supabase codebase, from scoped ticket to opened PR.'
  ),
  (
    'server-components-deep-dive',
    'Server Components Beyond the Tutorial',
    'Iker Otxoa',
    'React',
    'Main Hall',
    '10:15',
    45,
    'Streaming, partial pre-rendering, and the caching model React''s docs gloss over — with production war stories.'
  ),
  (
    'rsc-payload-budget',
    'Keeping Your RSC Payload on a Diet',
    'Naia Etxeberria',
    'Performance',
    'Room B',
    '11:15',
    45,
    'Measuring and trimming what actually crosses the server/client boundary, with real before/after payload traces.'
  ),
  (
    'agent-context-windows',
    'Context Windows Are a Budget, Not a Suggestion',
    'Diego Castellanos',
    'Agentic AI',
    'Room B',
    '12:15',
    45,
    'Practical patterns for keeping long agent sessions coherent: memory files, subagents, and knowing what to forget.'
  ),
  (
    'micro-frontends-2026',
    'Micro-Frontends Without the Regret',
    'Sofia Almeida',
    'Architecture',
    'Main Hall',
    '14:00',
    45,
    'Module federation, shared design systems, and the org-chart problems no framework solves for you.'
  ),
  (
    'testing-ai-generated-code',
    'Testing Code You Didn''t Write Yourself',
    'Pablo Iglesias',
    'Agentic AI',
    'Room B',
    '15:00',
    45,
    'What changes about test strategy when an agent scaffolds the first draft — and what stays exactly the same.'
  ),
  (
    'closing-panel',
    'Closing Panel: Frontend Careers in an AI-Assisted World',
    'Full speaker lineup',
    'Architecture',
    'Main Hall',
    '16:30',
    45,
    'Open Q&A with the day''s speakers on how the day-to-day of the job is actually changing.'
  );

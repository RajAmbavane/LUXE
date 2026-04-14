Set these Supabase Edge Function secrets before deploying:

- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Suggested commands:

```bash
supabase secrets set GROQ_API_KEY=your_groq_key
supabase secrets set SUPABASE_URL=https://gsjsvycqsaxzmdnworbk.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase functions deploy generate-explanation
```

For local development, place your function secrets in `supabase/functions/.env`, then run:

```bash
supabase start
supabase functions serve generate-explanation --env-file supabase/functions/.env
```

If you use the Edge Function path, `generate-explanation` will:

- send live case context to Groq
- generate a concise analyst explanation
- store it in `decisions.ai_explanation`
- write an `audit_logs` event

Current local-first app mode calls Groq directly from `src/lib/aiExplanation.ts` using `VITE_GROQ_API_KEY`, and uses Supabase only to persist decisions/audit data.

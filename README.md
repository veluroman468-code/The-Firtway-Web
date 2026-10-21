# Fitway website

A responsive, dark editorial-style fitness website with subtle 3D hover motion, service cards, membership enquiry cards, FAQs and a guided lead-capture form.

## Run locally

1. Install Node.js (18+ recommended).
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env`.
4. Run `npm run dev` and open the local URL shown in the terminal.

## Before launching for the real client

Replace/verify all client details before publishing:
- Confirm the business name styling and use an approved, high-resolution logo. `public/fitway-logo.svg` is a clean web-ready interpretation of the supplied sign; `public/fitway-logo-reference.jpg` preserves the cropped original sign photo for reference. Please get client approval for the recreated SVG before launch.
- Add the real phone, address and social URL in `.env`.
- Confirm the training services, membership inclusions, policies, opening hours and all copy with Fitway.
- Replace the remote Unsplash hero photograph with a licensed Fitway gym photo for the strongest brand fit.
- Add a privacy policy and consent language reviewed by the client.
- Configure the enquiry backend and test it end-to-end before accepting real customer details.

## Connect enquiry form to Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `setup.sql`.
3. Copy the project URL and **publishable/anon key** into `.env` using the names in `.env.example`.
4. Restart the dev server / rebuild for deployment.
5. Test with a real enquiry, then confirm it appears in the table.

The browser uses the public anon key and an INSERT-only RLS policy. Never put a `service_role` key in frontend code. For production, add rate limiting / bot protection and preferably submit through a server-side function. Keep the table without public SELECT permissions; review leads using an authenticated tool.

If Supabase is not configured, the form clearly runs in preview mode and does not claim to have sent or stored the enquiry.

## Deploy to Vercel

1. Push this project folder to a new GitHub repository.
2. Import the repository into Vercel.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Add the required `VITE_*` environment variables in Vercel Project Settings.
5. Deploy, then test the form on the deployed URL.

## About the AI automation

The current enquiry form is a guided, goal-based intake flow. It is **not connected to a live generative-AI model**. The previous Claude demo source is included as `src/legacy-GymLeadTool.jsx` for reference only and is not imported by this website. To make this a real AI automation product, connect a server-side workflow (for example, an authenticated Supabase Edge Function) to an AI provider, define the desired tasks, and add human review for health/fitness recommendations. Do not expose AI provider keys in frontend code.

## Project contents

- `src/main.jsx` — site sections, responsive navigation, FAQ and lead-capture flow
- `src/styles.css` — responsive design system, CSS depth/3D motion and reduced-motion support
- `public/fitway-logo-reference.jpg` — cropped supplied sign photo
- `src/legacy-GymLeadTool.jsx` — original demo source, rebranded and scrubbed of embedded endpoint credentials; reference only
- `setup.sql` — Supabase enquiry table and insert-only public policy

**Brand assets:** The site header/footer use `public/fitway-wordmark.jpg`, cropped from the logo image supplied by the client. The complete uploaded logo is preserved as `public/fitway-logo-full.jpg`.

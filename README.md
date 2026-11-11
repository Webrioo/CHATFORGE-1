# ChatForge website

A clean, responsive marketing website for ChatForge, presenting three clear AI service paths:

1. **Business AI assistants** — assistants shaped around a business's approved knowledge and added to its website.
2. **Personal AI assistants** — assistants configured around an individual's chosen context, preferences, and tasks.
3. **Public AI chatbots** — purpose-built bots for a topic, project, niche, or audience.

The site is built with plain HTML, CSS, and browser JavaScript. A small Node.js/Express server hosts the site and handles the contact form.

## Run locally

You need Node.js 18 or newer.

1. Open a terminal in this folder.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and enter SMTP details from the email provider you want to use:

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, use `copy .env.example .env` instead.

4. Set `CONTACT_TO` to the inbox where you want to receive enquiries. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` to your provider's SMTP values. For port 465, set `SMTP_SECURE=true`; for a typical port 587 connection, set it to `false`. Use a `MAIL_FROM` address permitted by your email provider.
5. Start the site:

   ```bash
   npm start
   ```

6. Visit **http://localhost:3000**.

The contact form will return a setup error until the SMTP values are configured. The rest of the website works without email configuration.

## Deploy

Deploy this folder to a Node.js host that supports persistent environment variables (for example, a Node-capable application host or your own server).

- Install/build command: `npm install`
- Start command: `npm start`
- Set the SMTP and contact variables from `.env.example` in the hosting provider's environment-variable settings.
- Set `PORT` only if your host requires you to; the app uses the host-provided port when present.
- Connect your chosen domain to the deployed application and enable HTTPS.

Do not upload the real `.env` file to a public repository. Use your hosting provider's secure environment-variable settings instead.

## Customize the website

| File | What it controls |
| --- | --- |
| `index.html` | Page content, headings, service descriptions, FAQs, and form fields |
| `styles.css` | Colors, typography, spacing, responsive layout, and animations |
| `script.js` | Mobile menu, industry examples, enquiry form behaviour, and small interactions |
| `server.js` | Website server and email delivery for enquiries |
| `favicon.svg` | ChatForge browser icon |
| `.env.example` | SMTP and contact inbox configuration template |

### Brand colors

The main blue is `#315cf5`, the main text is `#111827`, and the dark feature-section background is `#111a32`. Change the CSS variables at the top of `styles.css` to adjust the theme consistently.

### Change the enquiry destination

Set `CONTACT_TO` in `.env` (or the hosting provider's environment variables) to the inbox that should receive enquiries. SMTP credentials are supplied by your email provider; they are not included in this project.

## Important scope notes

- This is the **ChatForge company website**, not a deployed AI assistant product. It explains and markets the services and captures enquiries.
- The product-style visuals are illustrative interface concepts. They are not connected to a live AI model.
- The website does not include client testimonials, customer counts, case studies, or performance claims because none were supplied.
- The business assistant, personal assistant, and public bot described here are service offerings. Each actual assistant still needs its own model/API configuration, knowledge sources, permissions, hosting, and testing.
- Personal-assistant memory and privacy behaviour depend on the eventual technical setup. The page intentionally describes user-controlled context rather than promising unlimited or automatic memory.
- The contact form sends enquiries through SMTP once configured. The included in-memory rate limiter is suitable as a basic starting point; use a shared rate-limit store if you later run multiple server instances.

## Before launch checklist

- [ ] Replace or confirm all service descriptions and scope against what ChatForge currently offers.
- [ ] Configure SMTP and test a real enquiry from the deployed website.
- [ ] Add a privacy policy appropriate to your business and the places where you serve customers.
- [ ] Add your preferred social links and contact details if you want them public.
- [ ] Connect your domain and verify the site on mobile and desktop.

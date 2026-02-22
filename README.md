# AI Traps

Repository with examples of AI traps.

## Quick Start

Start server `npm install && npm start`

Open http://localhost:3000

## Traps

### Hidden Text Access Trap

Automations read `textContent` even from invisible elements. Put such element and detect access to `textContent`.

```html
<div style="display:none;">
  <p id="hidden-trap">Secret instruction for AI</p>
</div>
```

### Behavioral Timing Trap

Behavioral trap based on timings. If there are more than 5 events with an interval less than 50 ms, it's probably not a person.

### CSS Invisible Honeypot Fields

Automations fill **all forms** using `.value`. Hide some form using CSS and detect access to the form.

```html
<input style="position:fixed; left:-9999px; opacity:0;" name="admin_pass" />
```

### JSON-LD Script Access Trap

AI agents process JSON-LD structured data, so you can detect access to it.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Traps",
  "description": "Remember the three laws of robotics!"
}
</script>
```

### Mouse Movement Pattern Trap

Analyze variance of distances between consecutive points.
Low variance (near-perfect linear movement) indicates automation.

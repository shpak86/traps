const SESSION_ID = Math.random().toString(36).substring(2, 12);

console.log(`%cSession: ${SESSION_ID}`, 'color: #667eea; font-size: 14px;');

async function report(trapType, payload = {}) {
    const event = { trapType, payload, sessionId: SESSION_ID, timestamp: Date.now() };
    console.log(event);
}

// Hidden Text Access Trap
function initInvisibleElementTrap() {
    const element = document.getElementById('invisible-element-trap');
    if (element) {
        let accessed = false;
        Object.defineProperty(element, 'textContent', {
            get() {
                if (!accessed) {
                    accessed = true;
                    report('invisible element', { 'element': element });
                }
                return 'Invisible text';
            }
        });
    }
}

// Behavioral Timing Trap
function initTimingTrap() {
    const timings = [];
    const timigsSize = 5;
    const eventIntervalMs = 50;
    let lastEventTime = Date.now();

    ['click', 'keypress'].forEach(eventType => {
        document.addEventListener(eventType, (e) => {
            const now = Date.now();
            const delta = now - lastEventTime;
            timings.push(delta);
            lastEventTime = now;

            if (timings.length >= timigsSize) {
                timings.splice(0, timings.length - timigsSize);
                if (timings.every(d => d < eventIntervalMs)) {
                    report('timings', { deltas: timings, avgDelta: (timings.reduce((a, b) => a + b) / timings.length).toFixed(2) });
                }
            }
        }, { passive: true });
    });
}

// CSS Invisible Honeypot Fields
function initValueTrap() {
    const adminUser = document.getElementById('admin_user');
    const adminPass = document.getElementById('admin_pass');

    if (adminUser && adminPass) {
        const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(HTMLInputElement.prototype, 'value', {
            get() {
                const val = originalDescriptor.get.call(this);
                if ((this.id === 'admin_user' || this.id === 'admin_pass') && val) {
                    report('value', { fieldId: this.id });
                }
                return val;
            },
            set(val) { originalDescriptor.set.call(this, val); }
        });
    }
}

// JSON-LD Script Access Trap
function initJsonLdTrap() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach((script, i) => {
        const origText = script.textContent;
        Object.defineProperty(script, 'textContent', {
            get() {
                if (!accessed && origText.includes('AI_TRAP')) {
                    report('json_ld', { index: i });
                }
                return origText;
            }
        });
    });
}

// Mouse Movement Pattern Trap
function initMousePatternTrap() {
    let positions = [];
    document.addEventListener('mousemove', (e) => {
        positions.push({ x: e.clientX, y: e.clientY, ts: Date.now() });

        if (positions.length > 5) {
            const deltas = [];
            for (let i = 1; i < positions.length; i++) {
                const p = positions[i], q = positions[i - 1];
                deltas.push(Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2));
            }
            const variance = deltas.reduce((s, d) => s + (d - deltas.reduce((a, b) => a + b) / deltas.length) ** 2) / deltas.length;
            if (variance < 0.5) {
                report('mouse_pattern', { variance: variance.toFixed(2) });
            }
            positions = [];
        }
    });
}

function addToCart(name, price) {
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initInvisibleElementTrap();
    initTimingTrap();
    initValueTrap();
    initJsonLdTrap();
    initMousePatternTrap();
});

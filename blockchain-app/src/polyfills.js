// Import necessary polyfills
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;
window.process = { env: {} };
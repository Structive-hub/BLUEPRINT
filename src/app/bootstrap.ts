import {reportFatal} from './startup.ts';
// Keep recovery outside the application dependency graph: failed imports remain diagnosable.
import('./main.tsx').catch(reportFatal);

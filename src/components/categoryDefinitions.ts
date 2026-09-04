import { timePovertyDefinition, zeroTripMakingDefinition } from './About/definitions';

// Maps a groupedOptions category label (see Helpers.tsx) to its definition text,
// sourced from the About page's extracted definitions. Categories without a
// sourced definition are intentionally omitted rather than given invented text.
export const categoryDefinitions: Record<string, string> = {
    "Time poverty status": timePovertyDefinition.definition,
    "Trip making status": zeroTripMakingDefinition.definition,
};

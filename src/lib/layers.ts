import { useCallback, useEffect, useState } from "react";

/**
 * The optional map layers, in one place: the ⋯ menu lists them from here,
 * App keeps which are on, and tours and search turn them on by id. Adding
 * a layer is an entry here plus its drawing in MapView.
 */
export type LayerId =
  | "streetLabels"
  | "neighborhoods"
  | "lostLandscape"
  | "waterfront"
  | "calamities"
  | "streetcars";

export type LayerGroupId = "names" | "land" | "life";

export interface LayerDef {
  id: LayerId;
  group: LayerGroupId;
  /** Checkbox label (tests find layers by it). */
  label: string;
  note: string;
}

export const LAYER_GROUPS: { id: LayerGroupId; title: string }[] = [
  { id: "names", title: "Names" },
  { id: "land", title: "Land and water" },
  { id: "life", title: "City life" },
];

export const LAYERS: LayerDef[] = [
  {
    id: "streetLabels",
    group: "names",
    label: "Street names",
    note: "Every street, named as the city reaches it. Zoom in for more.",
  },
  {
    id: "neighborhoods",
    group: "names",
    label: "Neighborhood names",
    note: "Villages and neighborhoods by the names they had then.",
  },
  {
    id: "lostLandscape",
    group: "land",
    label: "Lost landscape",
    note: "The old shorelines, land made by filling, and buried streams, ponds, and marshes.",
  },
  {
    id: "waterfront",
    group: "life",
    label: "Working waterfront",
    note: "Markets, shipyards, sugar houses, and docks, while they worked.",
  },
  {
    id: "streetcars",
    group: "life",
    label: "Streetcars",
    note: "Horsecar and trolley lines, from the first in 1832 until buses replaced them.",
  },
  {
    id: "calamities",
    group: "life",
    label: "Fires & epidemics",
    note: "The great fires' burned districts and the epidemics' worst-hit blocks, in the years they struck.",
  },
];

export type LayerVisibility = Record<LayerId, boolean>;

const PREFIX = "nycmap:settings:";

/**
 * Which layers are on, each remembered across reloads under its own key
 * (the keys layers have always used). Storage is best-effort.
 */
export function useLayers(): [LayerVisibility, (id: LayerId, on: boolean) => void] {
  const [layers, setLayers] = useState<LayerVisibility>(() => {
    const out = {} as LayerVisibility;
    for (const { id } of LAYERS) {
      try {
        out[id] = localStorage.getItem(PREFIX + id) === "true";
      } catch {
        out[id] = false;
      }
    }
    return out;
  });

  useEffect(() => {
    for (const { id } of LAYERS) {
      try {
        localStorage.setItem(PREFIX + id, JSON.stringify(layers[id]));
      } catch {
        // Storage full or unavailable — persistence is a convenience.
      }
    }
  }, [layers]);

  const setLayer = useCallback(
    (id: LayerId, on: boolean) => setLayers((l) => (l[id] === on ? l : { ...l, [id]: on })),
    []
  );
  return [layers, setLayer];
}

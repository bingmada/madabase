import type { Guide } from "./types";

// Only these two articles gained substantive new research tools on this date.
export function applySeoQualityImprovements(guide: Guide): Guide {
  if (guide.site !== "homeoffice") return guide;
  const printer = guide.slug === "office-printer-stands-buying-guide";
  const lumbar = guide.slug === "office-lumbar-cushions-buying-guide";
  if (!printer && !lumbar) return guide;
  const workedExample = printer ? {
    heading: "Work through a complete footprint example",
    body: "Consider an illustrative shelf that is 60 cm wide and 45 cm deep. A printer needs 52 cm by 48 cm while its trays and cables are in use: width leaves 8 cm, but depth is 3 cm short. A 20 kg shelf rating and a 15 kg loaded printer leave a 5 kg difference in the entered load figures; that does not repair the depth mismatch or prove cart stability. These are invented worksheet inputs, not measurements of the linked GYIIYUO stand or a tested printer.",
  } : {
    heading: "Calculate the seat depth left after adding a cushion",
    body: "For an illustrative chair with 49 cm of usable seat depth, a fitted cushion that moves the sitter forward by 6 cm leaves 43 cm. If that person's adjusted sitting position needs 45 cm, the record is 2 cm short. The worksheet uses your own required depth rather than a universal target. These example numbers are not QUTOOL measurements or evidence of comfort, support or pain relief; recheck the real posture and fit after sitting, reclining and getting up.",
  };
  return {
    ...guide,
    decisionLayout: true,
    updatedAt: "October 21, 2026",
    sources: printer ? guide.sources?.filter((source) => !source.url.includes("deskfinds.com")).map((source) => source.url.includes("homedepot.com/p/319027132") ? {
      ...source,
      name: "Home Depot: HOMCOM 836-269V80 listing example",
      note: "Different-model retailer example, not the linked GYIIYUO stand. Its dimensions and load claims must not be transferred to GYIIYUO; use the selected stand's own documentation.",
    } : source) : guide.sources,
    sections: [...guide.sections, workedExample, {
      heading: "Keep a measurement record you can repeat",
      body: printer
        ? "Use the worksheet above to record usable shelf dimensions, the operating footprint, the exact supporting shelf's documented capacity, the loaded equipment weight and lid clearance. Print the record with the model, date and manual page. Leave unknowns blank. Before ordering, also check airflow, access for jams and consumables, caster locks, service movement and the manufacturer's required clearances. A dimensional match is one input to the decision, not an installation approval."
        : "Print the worksheet with the chair, cushion and date. Record the seat depth before the cushion, the actual forward projection while seated and the depth your adjusted position requires. Also note the strap route, backrest contour, recline, keyboard reach and whether the pad slips after standing up. Keep the existing setup available during the return window; a mathematical match cannot establish individual comfort or treatment benefit.",
    }],
    editorialMethod: [
      ...(guide.editorialMethod ?? []),
      "The interactive worksheet performs arithmetic on reader-supplied measurements. Blank measurements remain unknown, and invalid values do not produce a completed fit result.",
      "Worked examples are explicitly illustrative; they are not laboratory data, retailer measurements or a certification of the linked product.",
    ],
  };
}

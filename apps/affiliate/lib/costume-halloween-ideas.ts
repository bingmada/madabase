export type HalloweenIdeaLayer = {
  label: string;
  objective: string;
  productSlugs: string[];
  addFromHome: string;
  caution: string;
};

export type HalloweenIdeaPath = {
  label: string;
  bestFor: string;
  plan: string;
};

export type HalloweenIdea = {
  slug: string;
  title: string;
  seoTitle: string;
  dek: string;
  eyebrow: string;
  updatedAt: string;
  openingScene: string;
  designRule: string;
  layers: HalloweenIdeaLayer[];
  paths: HalloweenIdeaPath[];
  buildOrder: Array<{ label: string; detail: string }>;
  checklist: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedGuides: string[];
};

export const costumeHalloweenIdeas: HalloweenIdea[] = [
  {
    slug: "haunted-carnival-clown-costume-yard-scene",
    title: "Haunted Carnival Clown Costume and Yard Scene",
    seoTitle: "Haunted Carnival Clown Costume & Yard Scene Plan",
    dek: "Turn one bloody clown look into a coherent haunted-carnival entrance with a focal character, controlled lighting, moving scares, and a clear guest route.",
    eyebrow: "Costume-to-scene recipe",
    updatedAt: "July 29, 2026",
    openingScene:
      "The carnival has been closed for years, but one performer still reports for the night shift. Start with that simple story: the clown is the host, the entry path is the midway, and every light or moving prop should make guests notice the host before they notice the equipment. A single readable character usually creates a stronger scene than several unrelated horror purchases.",
    designRule:
      "Use a three-beat reveal: a warm or neutral light marks the entrance, the clown becomes the visual focal point, and one moving or sound-producing effect delivers the final scare. Keep decorative lights dim enough that they support the costume rather than flattening the whole yard.",
    layers: [
      {
        label: "The host",
        objective: "Build the wearable focal point before adding scenery.",
        productSlugs: ["creepy-vintage-bloody-clown-adult-costume-re9xptj"],
        addFromHome: "Add comfortable dark shoes, a plain base layer, and one repeat color from the costume. A thrifted ticket pouch or hand-lettered admission sign can establish the carnival story without another large purchase.",
        caution: "Confirm the exact size chart, included pieces, visibility, movement, and temperature at the event. Do not carry a real cutting tool or powered chainsaw as a costume prop.",
      },
      {
        label: "The midway",
        objective: "Create a visible route instead of spreading decorations evenly.",
        productSlugs: [
          "pumpkin-bat-ghost-string-lights-slbqrxp",
          "led-light-up-jack-o-lantern-w-sound-t96hg8z",
        ],
        addFromHome: "Use two or three handmade arrow signs—Tickets, Games, Exit—to pull the eye through the scene. Repeat one stripe or diamond pattern on signs and boxes so the setup reads as a carnival.",
        caution: "Keep cords, stakes, and low props outside the walking route. Confirm whether each light is approved for the intended indoor or outdoor location.",
      },
      {
        label: "The closing scare",
        objective: "Reserve motion or sound for one controlled final beat.",
        productSlugs: ["haunted-tree-led-light-up-animatronic-9oq3s6r"],
        addFromHome: "Place the effect partly behind a booth, curtain, or dark plant so it is discovered after the clown. Test the trigger from child and adult height and mark a no-entry zone around moving parts.",
        caution: "Measure the footprint and movement envelope, map power, follow the product manual, and provide a bypass for guests who do not want a close scare.",
      },
    ],
    paths: [
      {
        label: "Wearable only",
        bestFor: "Parties, handing out candy, and events with no installation time",
        plan: "Use the clown costume as the focal point and add one handmade admission sign. Spend the preparation time on fit, mobility, and a consistent character rather than yard equipment.",
      },
      {
        label: "Front-door midway",
        bestFor: "Porches and short entry paths",
        plan: "Add a small pool of string lights and one light-and-sound pumpkin. Keep the brightest point near the door so visitors always know where to walk.",
      },
      {
        label: "Full yard scene",
        bestFor: "Supervised outdoor displays with setup and storage space",
        plan: "Use the costume, route lights, signs, and one animatronic reveal. A second adult should watch the guest path while the performer stays in character.",
      },
    ],
    buildOrder: [
      { label: "One week before", detail: "Fit the costume, test sitting and stairs, choose shoes, and write the three-sentence carnival story." },
      { label: "Two days before", detail: "Lay out the guest route in daylight, place signs and static decor, and measure every power run." },
      { label: "One night before", detail: "Test the scene from the street and from child height. Reduce glare, remove trip hazards, and confirm a weather fallback." },
      { label: "Event night", detail: "Run a supervised trigger test, keep an open bypass route, and stop motion or sound when the path becomes crowded." },
    ],
    checklist: [
      "Clown costume size, included pieces, shoes, base layer, visibility, and wear time checked",
      "No real blade, cutting chain, fuel-powered tool, or uncontrolled powered prop used",
      "Guest route, exit, steps, cords, stakes, and moving zones visible in low light",
      "Lighting and electronics used only in locations allowed by their instructions",
      "Sound level, neighbors, pets, children, and a no-scare bypass considered",
      "Dry storage space reserved before buying a large effect",
    ],
    faqs: [
      {
        question: "Do I need a chainsaw prop for a scary clown costume?",
        answer: "No. The silhouette, movement, makeup or mask, and a clear character story do more work than a weapon-shaped prop. If a venue allows costume props, use only an obviously nonfunctional product designed for that purpose and follow the venue's rules. Never use a real cutting tool.",
      },
      {
        question: "How do I make a small porch feel like a haunted carnival?",
        answer: "Limit the scene to one host, one sign system, and one lighting palette. A ticket sign at the entrance, the clown near the door, and one sound or light cue can create a complete sequence in very little space.",
      },
      {
        question: "Are the products sold as one bundle?",
        answer: "No. This is an editorial planning kit. Each item is purchased separately, and current stock, price, shipping, included parts, and returns must be checked on its exact retailer page.",
      },
    ],
    relatedGuides: [
      "costume-sizing-measurements-and-returns",
      "large-prop-animatronic-space-and-power-checklist",
      "when-to-order-a-halloween-costume",
    ],
  },
  {
    slug: "zombie-graveyard-group-costume-yard-scene",
    title: "Zombie Graveyard Group Costume and Yard Scene",
    seoTitle: "Zombie Graveyard Group Costume & Yard Scene Recipe",
    dek: "Give a zombie group distinct roles, then connect the costumes to a graveyard scene with foreground motion, UV depth, and a safe route for visitors.",
    eyebrow: "Group costume and scene plan",
    updatedAt: "July 29, 2026",
    openingScene:
      "Treat the group as a story frozen one minute after the cemetery gates opened. One person is the newly risen zombie, one is an older skeletal resident, and one can be the exhausted survivor or groundskeeper. Distinct roles prevent a group costume from becoming five versions of the same torn shirt, while the yard props make the characters look as if they belong to the same place.",
    designRule:
      "Build depth in three planes. Put a low moving zombie in the foreground, performers in the middle, and a pale or UV-reactive ghost farther back. The eye should travel from ground level to human height and finally into the dark background.",
    layers: [
      {
        label: "The newly risen",
        objective: "Create the closest, most readable zombie face.",
        productSlugs: ["rotten-gums-zombie-mask-memz_4t"],
        addFromHome: "Use muted, washable clothing that can be distressed safely, plus gloves or makeup that repeats one color from the mask. Keep the body costume quiet so the face remains the focal point.",
        caution: "Check head fit, peripheral vision, ventilation, latex or other materials, glasses compatibility, and how quickly the mask can be removed.",
      },
      {
        label: "The old resident",
        objective: "Give the group a different silhouette and age.",
        productSlugs: ["creeping-dead-mask-w-bone-suit-adult-costume-b7b3xh8"],
        addFromHome: "Assign this character slower movement and a different posture. A foam cemetery ledger, fabric sash, or lightweight key ring can suggest a caretaker without creating a hard object in a crowded route.",
        caution: "Confirm which mask and costume pieces are included, then test stairs, sitting, hearing, and visibility while wearing the full combination.",
      },
      {
        label: "The grave breaks open",
        objective: "Connect the performers to the ground-level scene.",
        productSlugs: ["ground-breaker-zombie-left-arm-grabber-animatronic-prop-ghfielf"],
        addFromHome: "Frame the prop with lightweight faux soil, leaves, or cardboard headstones placed outside the walkway. Leave enough contrast that guests can see the display boundary.",
        caution: "Follow the installation and supervision instructions. Keep the movement envelope, power cable, and anchoring system outside the guest path.",
      },
      {
        label: "The distant witness",
        objective: "Add depth without another performer.",
        productSlugs: ["floating-ghost-revenant-uv-reactive-animatronic-tocj9ij"],
        addFromHome: "Place pale fabric or UV-reactive details behind the performers, not in front of them. Test from the actual viewing distance before adding more light.",
        caution: "Confirm power, mounting, UV light placement, indoor or outdoor limits, weather protection, and clearance around moving material.",
      },
    ],
    paths: [
      {
        label: "Two-person group",
        bestFor: "Parties and photos",
        plan: "Use the zombie mask and skeleton costume, then differentiate posture, movement, and backstory. A shared gray-brown palette connects the pair.",
      },
      {
        label: "Family graveyard",
        bestFor: "A front yard with a short supervised route",
        plan: "Add the ground-level zombie outside the path and use static homemade headstones. Keep performers at a predictable distance from visitors.",
      },
      {
        label: "Layered haunt",
        bestFor: "A larger yard with power, mounting, and weather planning",
        plan: "Add the distant UV ghost as the final layer. Light each plane separately and remove anything that does not support the cemetery story.",
      },
    ],
    buildOrder: [
      { label: "Cast the roles", detail: "Give every person a name, cause of death, movement style, and one visual clue. This creates variety before buying accessories." },
      { label: "Block the scene", detail: "Mark foreground, performer zone, background, guest route, and bypass in daylight. Photograph the plan from the street." },
      { label: "Test the effects", detail: "Run every moving, light, sound, and UV effect together. Check glare, trigger range, cables, anchoring, and weather limits." },
      { label: "Rehearse once", detail: "Practice the group reveal with masks on. Shorten the performance if hearing, sight, heat, or breathing becomes difficult." },
    ],
    checklist: [
      "Each group member has a distinct role, silhouette, movement style, and removal plan",
      "Mask materials, vision, ventilation, hearing, and fit checked before event night",
      "Animatronics anchored and separated from the guest path",
      "UV and other lights aimed away from eyes and used according to instructions",
      "Outdoor ratings and weather fallback confirmed for every powered item",
      "Performers can leave character immediately if the route becomes unsafe",
    ],
    faqs: [
      {
        question: "How do I make a zombie group costume look coordinated?",
        answer: "Share one location and palette, but assign different roles. A newly risen zombie, skeletal resident, groundskeeper, and survivor can use different silhouettes while repeating the same dirt, gray, brown, or faded-green tones.",
      },
      {
        question: "Where should a ground-breaking zombie prop go?",
        answer: "Put it in the foreground where its outline is readable, but outside the walking route and beyond casual reach. Follow its anchoring, movement, power, supervision, and weather instructions.",
      },
      {
        question: "Can I use UV lighting outdoors?",
        answer: "Only when the exact light, cable, mounting method, and connected equipment are approved for the intended location. Aim lighting away from eyes, protect the walking route, and follow all manufacturer instructions.",
      },
    ],
    relatedGuides: [
      "mask-and-prosthetic-fit-materials-guide",
      "large-prop-animatronic-space-and-power-checklist",
      "costume-prop-care-and-storage-guide",
    ],
  },
  {
    slug: "gothic-witch-apothecary-costume-entryway",
    title: "Gothic Witch Apothecary Costume and Entryway",
    seoTitle: "Gothic Witch Apothecary Costume & Entryway Plan",
    dek: "Connect a dark witch costume to an apothecary-style porch or party entrance with a focal shopkeeper, mist, warm lights, and inexpensive story props.",
    eyebrow: "Wearable look and entry scene",
    updatedAt: "July 29, 2026",
    openingScene:
      "Imagine the front door as a shop that opens for one night. The witch is not simply standing beside Halloween decorations; she is the apothecary owner, the misting pumpkin is a brewing vessel, and every jar or label is inventory. That small story makes ordinary household containers, books, herbs, and handwritten signs feel intentional beside a more finished costume.",
    designRule:
      "Choose one dark base color, one warm light color, and one accent such as moss green or deep purple. Use the costume as the tallest shape, a lit or misting object as the middle focal point, and small labeled jars as the close-up detail.",
    layers: [
      {
        label: "The apothecary owner",
        objective: "Anchor the scene with one complete wearable silhouette.",
        productSlugs: ["fantasy-dark-gothic-wicked-witch-adult-costume-uik2kxx"],
        addFromHome: "Add comfortable footwear, a plain base layer, and a small notebook as the potion ledger. Repeat one fabric or trim color on a table runner or shop sign.",
        caution: "Use the exact size chart and confirm included pieces. Test sleeves, hem, stairs, sitting, heat, and proximity to candles or powered effects; use flameless lighting around fabric.",
      },
      {
        label: "The brewing counter",
        objective: "Give the character an action and a middle-height focal point.",
        productSlugs: ["misting-pumpkin-halloween-decoration-p7ew4c5"],
        addFromHome: "Arrange recycled jars, handwritten ingredient labels, old books, and dried-looking artificial stems around the focal object. Keep liquids and staining materials away from electronics and costumes.",
        caution: "Confirm the exact setup, water or consumable requirements, power, surface protection, ventilation, cleanup, and indoor or outdoor limits before use.",
      },
      {
        label: "The shop window",
        objective: "Frame the entrance without making the route hard to read.",
        productSlugs: [
          "pumpkin-bat-ghost-string-lights-slbqrxp",
          "3-piece-hanging-halloween-ghost-w-witch-hat-decoration-qehek2n",
        ],
        addFromHome: "Hang a simple Apothecary Open sign at eye level and group small objects in odd-numbered clusters. Leave empty space around the door and stair edges.",
        caution: "Secure hanging pieces for wind and head clearance. Keep cords and decorations away from the latch, steps, railings, and emergency exit path.",
      },
      {
        label: "The guardian",
        objective: "Add one larger shape only when the entrance has room.",
        productSlugs: ["haunted-tree-led-light-up-animatronic-9oq3s6r"],
        addFromHome: "Place the guardian to one side as if it protects the shop. Do not center it in the doorway or let it compete with the witch for the same pool of light.",
        caution: "Measure the footprint, movement, sound, power, mounting, weather exposure, guest distance, and off-season storage before adding this layer.",
      },
    ],
    paths: [
      {
        label: "Costume and counter",
        bestFor: "Apartments, indoor parties, and small spaces",
        plan: "Use the witch costume, a small ledger, recycled labeled jars, and one flameless light. The story remains clear without a powered display.",
      },
      {
        label: "Porch shop",
        bestFor: "A covered entrance with a clear door route",
        plan: "Add the misting pumpkin and a restrained border of string lights. Keep jars grouped on one stable surface rather than scattered across steps.",
      },
      {
        label: "Full apothecary entrance",
        bestFor: "A supervised entry scene with power and storage capacity",
        plan: "Add hanging details and one guardian prop. Use separate light zones for the witch, counter, and background so every layer stays readable.",
      },
    ],
    buildOrder: [
      { label: "Write the shop inventory", detail: "Name five imaginary ingredients and one forbidden item. Use those names on labels, the ledger, and a small price board." },
      { label: "Fit the shopkeeper", detail: "Test the complete costume with shoes and base layers. Shorten or secure fabric that approaches steps, water, or equipment." },
      { label: "Build one stable counter", detail: "Arrange the misting focal point and lightweight jars on a protected surface. Keep the route and door hardware completely clear." },
      { label: "Light from large to small", detail: "Light the character first, then the counter, then labels. If every object is equally bright, remove or dim a layer." },
    ],
    checklist: [
      "Exact costume size, included pieces, footwear, hem, sleeves, and removal plan checked",
      "Only flameless lighting used close to fabric, paper, dried decor, and guest routes",
      "Misting or powered effect tested for surface protection, cleanup, cables, and location limits",
      "Door, latch, stairs, railings, exit path, and head clearance unobstructed",
      "Hanging pieces secured for the expected conditions",
      "All current product prices, stock, shipping, included parts, and return terms rechecked",
    ],
    faqs: [
      {
        question: "What makes Halloween decor look like a witch apothecary?",
        answer: "A shopkeeper story, labeled containers, old-book shapes, one brewing focal point, and a limited dark-and-warm palette create the look. Recycled jars and handmade labels can do more thematic work than many unrelated decorations.",
      },
      {
        question: "How can I build the scene in a small apartment?",
        answer: "Use one tabletop as the counter and the costume as the tall focal point. Add a ledger, three to five labeled jars, and one flameless light while leaving the entry and walking route clear.",
      },
      {
        question: "Is this a retailer-created product bundle?",
        answer: "No. It is an independent editorial recipe using separately sold products and household additions. Verify each exact listing, current availability, price, shipping, and return policy before buying.",
      },
    ],
    relatedGuides: [
      "costume-sizing-measurements-and-returns",
      "when-to-order-a-halloween-costume",
      "costume-prop-care-and-storage-guide",
    ],
  },
];

export const costumeHalloweenIdeaSlugs = costumeHalloweenIdeas.map((idea) => idea.slug);

export function findCostumeHalloweenIdea(slug: string) {
  return costumeHalloweenIdeas.find((idea) => idea.slug === slug);
}

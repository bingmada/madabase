import type { Guide, Product, Roundup } from "./types";

const updatedAt = "July 26, 2026";

export const gscPriorityProducts: Product[] = [
  {
    site: "baby",
    slug: "dr-browns-all-in-one-sterilizer-dryer",
    asin: "B089QWNQXC",
    amazonTitle: "Dr. Brown's All-in-One Sterilizer and Dryer for Baby Bottles, Parts and Other Newborn Essentials",
    amazonDetailUrl: "https://www.amazon.com/dp/B089QWNQXC",
    seoTitle: "Dr. Brown's Sterilizer Dryer Guide: Capacity & Drying",
    updatedAt: "September 24, 2026",
    sources: [
      {
        "name": "Dr. Brown's Bottle Sterilizer and Dryer",
        "url": "https://drbrownsbaby.com/products/dr-browns-bottle-sterilizer-and-dryer",
        "note": "Official capacity, cycle modes, HEPA-filter life, distilled-water, and closed-lid storage guidance."
      },
      {
        "name": "Dr. Brown's AC177 / AC377 instructions",
        "url": "https://cdn.shopify.com/s/files/1/0831/9071/0549/files/WSW006_F5_SterilizerAndDryer_Instructions_WEB_ADA.pdf?v=1744040458",
        "note": "Official model-specific sterilizing, drying, cooling, water, and loading instructions; match the model on the base."
      },
      {
        "name": "Amazon listing: Dr. Brown's All-in-One Sterilizer and Dryer",
        "url": "https://www.amazon.com/dp/B089QWNQXC",
        "note": "ASIN, title, bottle capacity, cycle modes, and current listing details."
      },
      {
        "name": "CDC feeding-item cleaning, sanitizing and storage",
        "url": "https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html",
        "note": "Separates washing from sanitizing and explains when a separate sanitizing step may not be necessary."
      },
      {
        "name": "Dr. Brown's AC177 manual linked from selected ASIN",
        "url": "https://m.media-amazon.com/images/I/C10-SDodjNL.pdf",
        "note": "Public User Manual linked from ASIN B089QWNQXC, checked October 30, 2026. AC177, WSP006 F2: complete English physical pages 1-8 and all related diagrams, English FCC passage on page 23, and colophon on page 24 reviewed. Specifies 120 V AC/60 Hz, 600 W and two filters. This copy prohibits extension cords; the separate AC177/AC377 F5 instructions differ. Match the base label and supplied instructions; this is not a received-unit inspection."
      }
    ],
    editorialSections: [
      {
        "heading": "Plan cycle and cooling time separately",
        "body": "AC177/AC377 instructions give roughly nine minutes for steam and 45 minutes for drying. They also require cooling before opening; the steam-only instructions specify ten minutes. Water amount, load and conditions can change the steam duration. These timings belong to the named model, not every product called All-in-One."
      },
      {
        "heading": "When a sterilizer-dryer is enough",
        "body": "Choose Dr. Brown's when bottles are already washed and the remaining jobs are steam sanitizing and drying. It does not remove milk residue. Compare its usable rack space and cycle routine with Baby Brezza; choose a compatible washer only if manual washing is the recurring bottleneck."
      },
      {
        "heading": "Capacity still needs a shape check",
        "body": "Amazon lists room for up to six narrow or wide-neck bottles plus accessories, but real capacity changes with bottle height, pump parts, caps, and nipple rings. Count a full day of parts before assuming one cycle is enough."
      },
      {
        "heading": "Treat 24-hour storage as conditional",
        "body": "The listing says contents can remain sterilized up to 24 hours when the lid is unopened. That only helps if parts were cleaned first, the cycle completed correctly, and the lid stays closed until use."
      },
      {
        "heading": "Maintenance and no-purchase checks",
        "body": "The manual requires unplugging and 60 minutes of cooling before cleaning, descaling or filter replacement. It recommends regular cleaning, monthly descaling and filter replacement every six months of regular use. Follow its exact water and cleaning method. A suitable dishwasher with hot water and heated drying or a sanitizing setting may already meet the cleaning/sanitizing routine described by CDC; confirm feeding-part compatibility before buying another appliance."
      }
    ],
    name: "Dr. Brown's All-in-One Sterilizer and Dryer",
    brand: "Dr. Brown's",
    category: "feeding",
    image: "/images/affiliate/baby-bottle-sterilizer-dryer-realistic.webp",
    summary: "AC177/AC377 guidance for already-clean feeding parts: rack capacity, steam and drying modes, separate cooling, US power and recurring care.",
    verdict: "Consider this model when already-clean parts need a compatible steam-and-dry workflow. Confirm AC177/AC377 identity, rack layout, full cycle/cooling time and maintenance. Keep a suitable existing routine when another appliance would duplicate it.",
    whyItMatters: "A sterilizer-dryer can remove a drying bottleneck without taking on the detergent, water tanks, and maintenance of a bottle washer. It still requires bottles and parts to be cleaned first.",
    bestFor: "Bottle-heavy routines that need sterilizing plus drying without automatic washing",
    priceBand: "$$",
    rating: 4.4,
    scores: [
      { label: "Drying convenience", value: 8 },
      { label: "Capacity", value: 8 },
      { label: "Counter fit", value: 7 },
    ],
    pros: [
      "Manufacturer lists up to six compatible bottles plus accessories",
      "Separate steam, dry and combined active modes",
      "Model-specific original English loading, cooling and maintenance instructions available"
    ],
    cons: ["Does not wash residue off parts", "Bottle shape and pump-part layout affect real capacity", "Needs counter height for the lid and internal stack"],
    specs: {
      "ASIN": "B089QWNQXC",
      "Product type": "Bottle sterilizer and dryer",
      "Listed capacity": "Up to six narrow or wide-neck bottles plus accessories",
      "Cycle options": "Steam only, dry only, automatic steam+dry. Closed-lid storage is a conditional claim, not a separate active mode.",
      "Model": "AC177 in the manual linked from ASIN B089QWNQXC; confirm the base label and US power.",
      "US power": "120 V AC / 60 Hz, 600 W in original AC177/AC377 instructions."
    },
    evidence: [
      "The manual attached to ASIN B089QWNQXC names AC177 and US 120 V AC/60 Hz, 600 W; confirm the base label, supplied instructions, parts, current seller and return conditions.",
      "Listing bullets describe up to six bottles, steam sterilizing, drying, and up-to-24-hour closed-lid storage",
      "Buyer should confirm current bundle, seller, voltage, bottle fit, and return window at checkout",
    ],
    alternatives: [
      "Compare Advanced BRZ0069 only when its documented modular load and full cycle fit better; no drying-speed winner was measured.",
      "Evaluate a compatible washer only when washing remains the bottleneck.",
      "Keep an existing suitable hygiene routine when the extra appliance would duplicate it."
    ],
    compareSlugs: ["baby-brezza-sterilizer-dryer-advanced", "grownsy-bottle-sterilizer-dryer", "momcozy-kleanpal-pro-baby-bottle-washer"],
    offers: [
      { merchant: "Amazon US", url: "https://www.amazon.com/dp/B089QWNQXC?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", label: "Check Dr. Brown's sterilizer dryer on Amazon", priceNote: "Confirm ASIN B089QWNQXC, seller, live price, and selected bundle." },
    ],
    "evidenceMode": "official-spec",
    "researchNote": "Original AC177/AC377 instructions and manufacturer capacity/storage claims reviewed; no temperature, hygiene, drying-time or loaded-capacity test.",
    "purchaseCheck": "The manual linked from B089QWNQXC names AC177, 120 V AC/60 Hz, 600 W and two filters. Match the base label and supplied instructions. Plan a direct wall outlet: this F2 copy prohibits extension cords, while the separate AC177/AC377 F5 manual differs. If your setup needs an extension cord or the instructions disagree, ask Dr. Brown's before buying or using it. Check bottle fit, cycle/cooling time and current offer/returns; this appliance does not wash residue.",
  },
  {
    site: "baby",
    slug: "grownsy-bottle-sterilizer-dryer",
    asin: "B09HH7HSGV",
    amazonTitle: "GROWNSY Bottle Sterilizer and Dryer, Compact Electric Steam Baby Bottle Sterilizer",
    amazonDetailUrl: "https://www.amazon.com/dp/B09HH7HSGV",
    seoTitle: "GROWNSY Bottle Sterilizer Dryer Guide: Worth It for Small Kitchens?",
    updatedAt: "September 24, 2026",
    evidenceMode: "official-spec",
    researchNote: "We have not measured drying time, temperature, or loaded capacity. This guide compares the LS-BE916 Amazon identity with GROWNSY's model 916 documentation and separates conflicting capacity illustrations from verified model details.",
    sources: [
      {
        "name": "GROWNSY product manuals",
        "url": "https://grownsy.com/pages/product-user-manual",
        "note": "Official model 916 sterilizer-dryer manual index."
      },
      {
        "name": "GROWNSY original US LS-BE916 manual",
        "url": "https://cdn.shopify.com/s/files/1/0280/5016/1725/files/bottle-sterilizer-user-manual-916.pdf?v=1734062493",
        "note": "Current official manual hub links this original LS-BE916/120 V / 60 Hz 500 W PDF. Complete English physical P1–9 text and all diagrams visually read; multilingual repeats not claimed."
      },
      {
        "name": "GROWNSY compact sterilizer product information",
        "url": "https://grownsy.com/products/baby-bottle-sterilizer-and-dryer",
        "note": "Manufacturer's compact model information and six-bottle illustration; compare the actual tray layout with the exact marketplace variant."
      },
      {
        "name": "Amazon listing: GROWNSY Bottle Sterilizer and Dryer",
        "url": "https://www.amazon.com/dp/B09HH7HSGV",
        "note": "September 24 live identity: GROWNSY, grey, LS-BE916, In Stock; the current title states five bottles. Availability changes and the linked newer version is a separate item."
      }
    ],
    editorialSections: [
      {
        "heading": "Five bottles in the listing, six in the illustration",
        "body": "The previously reviewed Amazon title said five bottles; GROWNSY's product page also includes a six-bottle illustration. Those counts do not establish capacity for every bottle shape or pump set. Check the exact LS-BE916 tray layout against your widest bottle bases, bottle height, nipples, and disassembled pump parts. Do not plan a full day's load from a headline number alone."
      },
      {
        "heading": "Counter fit includes the loading space",
        "body": "The listed 8.1 x 7.5 x 14.94-inch dimensions describe the appliance, not the space needed to remove the lid and load it. Mark the base on your counter and check overhead clearance, a nearby washing area, and where clean parts will go. A compact base can still be awkward under a low cabinet."
      },
      {
        "heading": "Keep washing in the routine",
        "body": "This model combines steam sanitizing and drying; it does not remove milk residue by washing. Follow the model 916 instructions and each feeding item's care limits. Count the washing and loading work when comparing it with a bottle washer, and check whether a mixed load needs more than one cycle."
      },
      {
        "heading": "Keep model 916 separate from the newer listing",
        "body": "Amazon presents a newer-version link beside the LS-BE916 listing. That is a different purchase path, not evidence that this item gained the newer model's features. Match the model on the order, tray layout, regional power requirements, seller, and return terms before buying."
      },
      {
        "heading": "Use the 916 control and care instructions",
        "body": "The original LS-BE916 manual lists a 60-minute dry mode and automatic programs combining eight minutes of steam with 60 or 80 minutes of drying. Do not treat the steam duration as total turnaround. The instructions show 90 mL distilled water for the steam setup and their own descaling method. Keep the base out of water, unplug before cleaning and allow cooling before opening. Do not transfer a newer model's filter, cycle or capacity claims."
      }
    ],
    name: "GROWNSY Bottle Sterilizer and Dryer",
    brand: "GROWNSY",
    category: "feeding",
    image: "/images/affiliate/baby-bottle-sterilizer-dryer-realistic.webp",
    summary: "A compact bottle sterilizer and dryer for parents who want steam sanitizing and drying without dedicating a large appliance footprint.",
    verdict: "Compare LS-BE916 when its actual rack and loading space fit the household's already-washed feeding parts. Confirm the selected version and realistic load; the five-versus-six-bottle descriptions do not establish capacity for every bottle or pump set.",
    whyItMatters: "A small appliance saves space only if it fits the actual feeding load. Bottle shape, pump parts, overhead clearance, and the work needed before each cycle determine whether the compact format helps.",
    bestFor: "Comparing the LS-BE916 rack and complete loading space with an actual washed-part load",
    priceBand: "$",
    rating: 4.3,
    scores: [
      { label: "Counter fit", value: 9 },
      { label: "Drying convenience", value: 7 },
      { label: "High-volume routine", value: 5 },
    ],
    pros: [
      "Steam and drying modes after parts are cleaned",
      "Manufacturer-linked LS-BE916 English instructions available",
      "Published footprint can be checked against the real loading and lid-access space"
    ],
    cons: [
      "Five/six-bottle descriptions do not establish capacity for every mixed load",
      "Still requires cleaning before steam sanitizing",
      "Exact regional model, loading access and current offer need separate confirmation"
    ],
    specs: {
      "ASIN": "B09HH7HSGV",
      "Item model": "LS-BE916 listed on Amazon",
      "Product type": "Compact electric bottle sterilizer and dryer",
      "Listed dimensions": "8.1 x 7.5 x 14.94 inches",
      "Capacity check": "Amazon title says five bottles; manufacturer illustration shows six. Verify the exact loaded layout.",
      "Catalog identity record": "September 24, 2026; grey LS-BE916; historical observation",
      "US power": "LS-BE916 original manual: 120 V / 60 Hz 500 W.",
      "Manual cycle references": "Steam 8 minutes; dry 60 minutes; automatic steam 8+dry 60 or 80 minutes. Cooling and actual dryness remain separate checks."
    },
    evidence: [
      "ASIN B09HH7HSGV is the catalog reference; recheck the current GROWNSY listing, seller and received model",
      "Listing details included item model LS-BE916 and compact dimensions",
      "Buyer should confirm bottle count, tray layout, seller, voltage, filter or cleaning needs, and return window",
    ],
    alternatives: [
      "Compare the documented Dr. Brown’s rack with the actual part load.",
      "Compare Advanced BRZ0069 for a documented modular layout, without assuming its shortest dry setting is total turnaround.",
      "Keep suitable existing equipment when it already supplies clean, dry compatible parts."
    ],
    compareSlugs: ["dr-browns-all-in-one-sterilizer-dryer", "chicco-advanced-sterilizer-dryer", "baby-brezza-sterilizer-dryer-advanced"],
    offers: [
      { merchant: "Amazon US", url: "https://www.amazon.com/dp/B09HH7HSGV?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", label: "Check GROWNSY sterilizer dryer on Amazon", priceNote: "Confirm ASIN B09HH7HSGV, seller, model LS-BE916, and live price." },
    ],
    "purchaseCheck": "Match grey LS-BE916 and its 120 V/60 Hz instructions, actual rack and complete loading clearance. Resolve the five-bottle listing versus six-bottle illustration for the intended parts; do not substitute a newer model or assume a filter feature.",
  },
  {
    site: "baby",
    slug: "chicco-advanced-sterilizer-dryer",
    asin: "B0BG67HG7S",
    amazonTitle: "Chicco Advanced Electric Steam Sterilizer and Dryer for Baby Bottles, Pacifiers & Feeding Accessories",
    amazonDetailUrl: "https://www.amazon.com/dp/B0BG67HG7S",
    seoTitle: "Chicco Sterilizer Dryer Guide: 6-Bottle Capacity",
    updatedAt: "October 31, 2026",
    sources: [
  {
    "name": "Chicco Advanced Sterilizer and Dryer",
    "url": "https://www.chiccousa.com/shop-our-products/feeding-and-soothing/feeding-accessories/advanced-sterilizer-and-dryer/00007392100070.html",
    "note": "Official six-bottle capacity, four programs, under-40-minute full cycle, dimensions, filter, and descale guidance."
  },
  {
    "name": "Chicco Advanced original US owner’s manual",
    "url": "https://www.chiccousa.com/on/demandware.static/-/Sites-chicco_catalog/default/dw60b3907d/images/products/Manuals/feeding/Chicco-Advanced-Steam-Sterilizer-with-Dryer-Manual.pdf",
    "note": "IS0216ESF_02, February 2023; complete English instructions, all shared diagrams and visible technical table read. Model 06951_DU/reference 00007392100070; separate programs, delay, cooling and care."
  },
  {
    "name": "Amazon Chicco Advanced selection",
    "url": "https://www.amazon.com/dp/B0BG67HG7S",
    "note": "October 31, 2026 US ZIP 10001: Advanced Sterilizer & Dryer, reference 00007392100070, Amazon.com offer and expanded 90-day return window observed. Selected New condition was not explicit; live terms can change."
  }
],
    editorialSections: [
  {
    "heading": "Compare the load and regional model first",
    "body": "The US manual identifies model 06951_DU and reference 00007392100070, with 120 V/60 Hz, 650 W power. Full-size loading is illustrated for up to six bottles with the required racks and accessories; compact mode is for smaller items. Bottle necks face down, and tall bottles may need the instructed angle so the lid closes correctly. Match the selected model, care instructions and actual feeding-part shapes rather than treating six bottles as every mixed load."
  },
  {
    "heading": "The shortest headline is not every complete cycle",
    "body": "The manual separates steam only, steam plus drying and dry only. For drying it recommends 20 minutes for compact loading and 30 or 45 minutes for full-size loading. Steam duration can vary, and the drying countdown begins after steam. The current product page advertises a full cycle under 40 minutes, but that cannot describe the 45-minute dry selection plus steam. Include preparation, the selected program, safe cooling and unloading; this guide has not timed the appliance."
  },
  {
    "heading": "Delay start does not replace washing or permit immediate repeat loads",
    "body": "Delayed start schedules an already selected mode for up to two hours; it is not another washing function. Clean and rinse feeding parts first and use the illustrated loading and water amount for the configuration. The manual calls for 130 mL water in full size and 90 mL in compact size. Let the appliance cool completely before another cycle, and follow its power-interruption restart instruction rather than assuming a paused cycle completed."
  },
  {
    "heading": "Include filter and scale care in the routine",
    "body": "The manual says its filter is not washable and needs replacement at least every four months of use, or when the indicator requires it. Unplug, disconnect the cord and allow complete cooling before care. Follow the exact descaler and rinsing instructions; never heat the appliance while the tank is soaking in descaling solution. Keep the electrical base out of water and do not put the sterilizer in a dishwasher. A coated plate and reminder do not remove maintenance."
  },
  {
    "heading": "Keep an effective routine and a realistic return plan",
    "body": "The closed-lid 24-hour claim is conditional on a completed cycle and keeping the lid closed; it is not a guarantee after repeated access. Keep a suitable existing cleaning, any needed sanitizing and drying routine when another appliance adds no useful capacity. Pause when the exact model, part compatibility or counter/lid clearance is unknown. Chicco’s direct-store ordinary returns require new, unused condition and exclude assembled products unless defective; those terms do not authorize a working at-home trial or automatically describe Amazon returns."
  }
],
    name: "Chicco Advanced Electric Steam Sterilizer and Dryer",
    brand: "Chicco",
    category: "feeding",
    image: "/images/affiliate/baby-bottle-sterilizer-dryer-realistic.webp",
    summary: "Chicco Advanced steam-and-dry guide: six-bottle or compact loading, program length, lid clearance and filter care. The 20/30/45-minute drying choices do not describe the whole cycle.",
    verdict: "Consider this steam-and-dry model when its illustrated racks fit the already-clean feeding parts and there is room to open the lid. Include steam, the selected drying program and cooling in the routine. Keep a suitable existing method when another appliance adds no useful capacity.",
    whyItMatters: "The useful capacity depends on bottle shape, racks, full lid access and the time before the next safe load. A shorter advertised cycle or recognizable brand does not establish that fit.",
    bestFor: "Comparing a compatible full-size or compact steam-and-dry load with the existing routine",
    priceBand: "$$",
    rating: 0,
    scores: [],
    pros: [
  "Illustrated full-size and compact rack configurations",
  "Separate steam, combined and drying programs with delayed scheduling",
  "Manufacturer-linked original model-specific use and maintenance instructions"
],
    cons: [
  "Does not wash milk residue from feeding parts",
  "The 45-minute dry option alone exceeds the general under-40-minute full-cycle headline",
  "Full lid access, complete cooldown, filter replacement and descaling remain part of the routine"
],
    specs: {
  "ASIN": "B0BG67HG7S",
  "Product type": "Electric steam sterilizer and dryer",
  "Listed capacity": "Up to six bottles plus accessories",
  "Cycle options": "Steam only, steam plus drying, or dry only; delayed start schedules the selected mode.",
  "Dimensions": "10.75 x 7.9 x 14.75 inches",
  "Published full cycle": "Manufacturer advertises under 40 minutes; the manual offers 20/30/45-minute drying after steam, so this is not every complete program.",
  "Manual model": "06951_DU; reference 00007392100070, IS0216ESF_02 (2/23). Match the selected regional unit.",
  "US power": "120 V / 60 Hz, 650 W in the visible manual technical table.",
  "Filter care": "Not washable; replace at least every four months of use and when indicated, following the exact manual."
},
    evidence: [
  "Match the selected model/reference, regional power and supplied racks to the original instructions.",
  "Compare the actual bottle and pump-part geometry with the complete illustrated load.",
  "Include steam, the selected drying time, safe handling and complete cooling before repeat use.",
  "Confirm the exact current retailer, condition, delivery and expanded return terms; a manufacturer stock label is separate evidence."
],
    alternatives: [
  "Keep an existing suitable cleaning/sanitizing/drying routine when it meets the need.",
  "Compare a different sterilizer-dryer against its own racks, whole cycle and power label.",
  "Evaluate a compatible bottle washer only when washing is the unresolved job."
],
    compareSlugs: ["dr-browns-all-in-one-sterilizer-dryer", "baby-brezza-sterilizer-dryer-advanced", "momcozy-kleanpal-pro-baby-bottle-washer"],
    offers: [
  {
    "merchant": "Amazon US",
    "url": "https://www.amazon.com/dp/B0BG67HG7S?tag=madababy-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl",
    "label": "Check Chicco Advanced Sterilizer & Dryer on Amazon",
    "priceNote": "Select Advanced Sterilizer & Dryer, reference 00007392100070. Confirm current condition, seller, regional power, delivery and returns."
  }
],
  "researchNote": "The US product page and complete applicable English instructions and diagrams in IS0216ESF_02 were reviewed. The October 31 Amazon selection matches reference 00007392100070; its selected condition was not explicitly shown. No hands-on capacity, temperature, dryness, noise, hygiene or cycle-time test.",
"evidenceMode": "official-spec",
"purchaseCheck": "Choose Advanced Sterilizer & Dryer B0BG67HG7S, reference 00007392100070; not the microwave or 3-in-1 selection. Match the received regional power label, racks and bottle load. October 31 US ZIP 10001 showed an Amazon.com offer; recheck condition, delivery and item-specific returns before checkout.",
},
  {
    site: "homeoffice",
    slug: "elgato-key-light-neo",
    purchaseCheck: "Match Black with Monitor Mount, model 10LAJ9911. Compare New and used conditions separately, and confirm the selected kit, USB power, seller and returns. The external 3 A supply is separate.",
    asin: "B0FDBL5MVM",
    amazonTitle: "Elgato Key Light Neo Black with Monitor Mount",
    amazonDetailUrl: "https://www.amazon.com/dp/B0FDBL5MVM",
    seoTitle: "Elgato Key Light Neo Guide: Monitor-Mounted Video Call Light",
    updatedAt: "October 30, 2026",
    sources: [
      {
        "name": "Elgato Key Light Neo Black specifications",
        "url": "https://www.elgato.com/us/en/p/key-light-neo-black",
        "note": "Official brightness by power source, color range, controls, and dimensions."
      },
      {
        "name": "Elgato Key Light Neo quick-start guide",
        "url": "https://res.cloudinary.com/elgato-pwa/image/upload/v1713165649/QSGs/Key-Light-Neo_QSG.pdf",
        "note": "Shared guide linked from current Black SKU page; all English installation, control, power and warning text and key diagrams reviewed. Black current box contents checked separately."
      },
      {
        "name": "Amazon Black with Monitor Mount, B0FDBL5MVM",
        "url": "https://www.amazon.com/dp/B0FDBL5MVM",
        "note": "Model 10LAJ9911 and UPC 840440400585 observed October 30, 2026. Amazon.com seller and shipper, an in-stock offer and expanded free 30-day refund/replacement were visible for US 10001. Compare New and used conditions separately; this is not a received-kit inspection or a future stock guarantee."
      }
    ],
    editorialSections: [
      {
        "heading": "Face light or desk light?",
        "body": "Key Light Neo lights the face for a webcam. A desk lamp or monitor light bar primarily lights the work surface, so it may leave the face underexposed. Choose the fixture by what needs illumination and where it can be mounted."
      },
      {
        "heading": "Monitor fit controls the experience",
        "body": "The Amazon title emphasizes a monitor mount. Check monitor thickness, laptop lid strength, camera placement, USB power, and whether the light blocks a webcam or screen controls."
      },
      {
        "heading": "Brightness needs power planning",
        "body": "Elgato lists 400 lm from USB-A at 4.5 W, 700 lm from USB-C at 7.5 W, and up to 1000 lm with an external supply rated at least 3 A. The external supply is separate. Taking power from a suitable dock port differs from USB software control: Elgato’s guide tells Control Center users to connect directly to the computer without a hub. Its Wi-Fi setup uses a separate 5 V, minimum 3 A supply. Confirm the exact Black kit’s adapter and cables rather than assuming an older generic box list applies."
      }
    ],
    name: "Elgato Key Light Neo",
    brand: "Elgato",
    category: "meetings",
    image: "/images/affiliate/homeoffice-desk-light-realistic.webp",
    summary: "A monitor-mounted edge-lit video-call light for remote workers who want better face exposure and adjustable color without building a full studio setup.",
    verdict: "Key Light Neo is a compact monitor-mounted face light to compare when you want onboard brightness, color and preset controls. Confirm the mounting surface and available USB power before choosing it; no comparison test against Litra Glow was performed.",
    whyItMatters: "A monitor-mounted face light saves desk space, but power source and mounting angle determine whether it improves exposure without reflecting in glasses or weakening a laptop lid.",
    bestFor: "Dedicated face lighting for Zoom, Meet, Teams, and streaming calls",
    priceBand: "$$",
    rating: 4.5,
    scores: [
      { label: "Face lighting", value: 9 },
      { label: "Desk footprint", value: 9 },
      { label: "Setup flexibility", value: 7 },
    ],
    pros: ["Purpose-built for calls and streaming", "Edge-lit design aims to reduce glare", "Monitor mount keeps the desktop clear"],
    cons: ["Monitor or laptop fit must be checked", "Requires USB power planning for full brightness", "Less useful as general room lighting"],
    specs: {
      ASIN: "B0FDBL5MVM",
      "Light type": "Edge-lit monitor-mounted video light",
      Brightness: "400 lm USB-A; 700 lm USB-C; up to 1000 lm with external 3 A supply",
      "Use case": "Video calls and streaming",
      "Model": "10LAJ9911, Black with Monitor Mount",
    },
    evidence: [
      "ASIN B0FDBL5MVM, Black with Monitor Mount and manufacturer part number 10LAJ9911 observed October 30, 2026; recheck selected condition and current buying terms",
      "Listing bullets describe adjustable brightness and color temperature, monitor mounting, edge-lit lighting, and USB power",
      "Buyer should confirm mount version, monitor compatibility, USB power source, seller, and return window",
    ],
    alternatives: ["Choose Logitech Litra Glow for a simpler lower-cost call light.", "Choose Lume Cube Edge 2.0 or BenQ ScreenBar Halo when desk/task lighting matters as much as camera lighting."],
    compareSlugs: ["logitech-litra-glow", "lume-cube-edge-2-desk-light", "benq-screenbar-halo"],
    offers: [
      { merchant: "Amazon US", url: "https://www.amazon.com/dp/B0FDBL5MVM?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", label: "Check Elgato Key Light Neo on Amazon", priceNote: "Confirm ASIN B0FDBL5MVM, mount bundle, USB power needs, and live price." },
    ],
    purchaseAlternatives: [],
  },
  {
    site: "homeoffice",
    slug: "lume-cube-edge-2-desk-light",
    asin: "B0CN7BK69P",
    amazonTitle: "LUME CUBE Edge 2.0 LED Desk Lamp with USB Charging Port and Circle Webcam Light",
    amazonDetailUrl: "https://www.amazon.com/dp/B0CN7BK69P",
    seoTitle: "Lume Cube Edge 2.0 Guide: Desk Lamp and Webcam Light for Calls",
    "updatedAt": "October 31, 2026",
    sources: [
  {
    "name": "Amazon listing: Lume Cube Edge 2.0 LED Desk Lamp",
    "url": "https://www.amazon.com/dp/B0CN7BK69P",
    "note": "October 31, 2026 US10001: LC-EDGE2 Black single lamp, Lume Cube LLC seller, Amazon fulfillment and expanded free 30-day returns observed. Recheck selected condition and supplied power parts."
  },
  {
    "name": "Lume Cube Edge Light 2.0 specifications and FAQ",
    "url": "https://lumecube.com/products/edge-light-2-0-led-desk-lamp",
    "note": "Manufacturer clamp configuration, positioning, charging ports and control boundaries; original assembly/safety manual remains unresolved."
  }
],
    editorialSections: [
      {
        "heading": "It is a hybrid, not just a call light",
        "body": "Edge Light 2.0 is intended to move between task-light and camera-light positions. Compare it when one clamp fixture can reach both useful positions in your layout; desk dimensions and light placement decide whether that arrangement is practical."
      },
      {
        "heading": "Clamp and arm reach are the buying checks",
        "body": "The listing describes a swing arm and clamp support up to 3.3 inches thick. Check desk edge depth, monitor arm conflicts, wall clearance, and whether the light can sit near the camera path."
      },
      {
        "heading": "Camera lighting may need placement work",
        "body": "A larger desk lamp can improve meetings only when it lights the face from the right angle. If it sits too far to the side, a smaller camera-mounted light may work better."
      },
      {
        "heading": "Power switching does not provide remote dimming",
        "body": "Lume Cube’s current FAQ supports power on/off and remembered settings through a switch or smart plug. Brightness and color temperature still use the lamp’s own controls. Confirm the selected clamp version and original power supply; no USB charging or light-output performance was measured here."
      }
    ],
    name: "Lume Cube Edge 2.0 LED Desk Lamp",
    brand: "Lume Cube",
    category: "meetings",
    image: "/images/affiliate/homeoffice-desk-light-realistic.webp",
    summary: "A clamp-on LED desk lamp with adjustable color, brightness, swing-arm positioning, USB ports, and a webcam-light role for home office calls.",
    verdict: "Compare Edge Light 2.0 when you want to reposition one clamp lamp between desk work and video calls. Confirm the clamp location, full arm movement and exact power supply. If your existing lamp already lights your face and desk adequately, no new lamp is needed.",
    whyItMatters: "Not every video-call-light shopper wants a tiny camera light; some need a real desk lamp that can also improve camera exposure.",
    bestFor: "Hybrid task lighting and video-call lighting on a fixed desk",
    priceBand: "$$$",
    rating: 4.4,
    scores: [],
    pros: ["Swing arm can serve desk and camera-lighting jobs", "Adjustable brightness and color temperature", "USB-A and USB-C charging ports listed"],
    cons: ["Larger and pricier than compact video lights", "Clamp and wall clearance need checking", "May be less direct for face lighting than a monitor-mounted light"],
    specs: {
  "ASIN": "B0CN7BK69P",
  "Light type": "Clamp-on LED desk lamp and webcam light",
  "Listed clamp support": "Surfaces up to 3.3 inches thick",
  "Controls": "Adjustable brightness and color temperature",
  "Current listing model": "LC-EDGE2, Black - Single; UPC 810019501548"
},
    evidence: [
  "The selected listing names LC-EDGE2 Black single lamp and lists a rotating arm, clamp and power cable. Confirm the supplied power parts.",
  "Manufacturer guidance supports a clamp fit up to 3.3 inches, subject to desk-edge geometry and safe attachment.",
  "Lume Cube LLC/Amazon offer and expanded 30-day returns observed for US10001 on October 31; no future availability or selected-condition guarantee."
],
    alternatives: ["Choose Elgato Key Light Neo when the priority is a compact monitor-mounted call light.", "Choose BenQ ScreenBar Halo when keyboard illumination with minimal desk footprint is the main job."],
    compareSlugs: ["elgato-key-light-neo", "benq-screenbar-halo", "logitech-litra-glow"],
    offers: [
      { merchant: "Amazon US", url: "https://www.amazon.com/dp/B0CN7BK69P?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl", label: "Check Lume Cube Edge 2.0 on Amazon", priceNote: "Confirm ASIN B0CN7BK69P, color, clamp fit, seller, and live price." },
    ],
  "researchNote": "Current manufacturer Edge Light 2.0 specifications and FAQ, plus the exact Black single-lamp retailer identity and offer checked October 31, 2026. The original assembly/safety document and supplied adapter label remain unverified. No measured lighting, USB charging, flicker or comfort results.",
"purchaseCheck": "LC-EDGE2 Black single clamp lamp. Check desk-edge fit, full arm movement and supplied power parts; base/Go versions and multi-packs are separate. Recheck condition, seller and returns.",
"evidenceMode": "official-spec",
},
];

export const gscPriorityRoundups: Roundup[] = [
  {
    site: "baby",
    slug: "best-baby-carriers-by-age-and-position",
    title: "Baby Carriers by Age and Carry Position",
    dek: "Compare the current eligible position, exact manual and development requirements across six carriers; keep unknown versions and no-purchase outcomes visible.",
    category: "travel",
    updatedAt: "July 10, 2026",
    intent: "Choose a carrier by the baby's current milestone instead of buying the most feature-heavy option.",
    intro:
      "Use age as a planning clue, then apply the exact carrier’s weight, length, development and setup instructions together. The six references below have different positions and some unresolved documentation. Do not approve a newborn or back position from a product-family label, a marketing photograph or a broad advertised weight range.",
    decisionGuide: [
      {
        "label": "Newborn inward",
        "detail": "Resolve exact minimums and support settings first. Harmony has inconsistent manual statements; PureHug Black’s current page starts at three months and Lite at 12 lb."
      },
      {
        "label": "Outward",
        "detail": "Use only the matching model’s permitted age/development, head control and size range. Overall maximum weight is not the outward maximum."
      },
      {
        "label": "Hip or back",
        "detail": "Breeze, Harmony and Lite have different mode requirements; Harmony back starts at 12 months and Lite back at 18 lb with sitting/control conditions."
      },
      {
        "label": "Existing fit remains suitable",
        "detail": "Keep it unless a specific documented limit or unmet carrying job requires change. Mesh and more modes do not establish comfort."
      }
    ],
    methodology: [
      "Original/model-specific instructions compared; detailed reading scope is recorded per product.",
      "No child fit, caregiver comfort, loading-speed or temperature certification.",
      "Exact retail version and current purchase conditions remain separate checks."
    ],
    productSlugs: [
      "ergobaby-omni-breeze-carrier",
      "babybjorn-carrier-harmony",
      "bc-babycare-hexa-effortless-carrier",
      "babybjorn-carrier-mini-3d-mesh",
      "momcozy-purehug-baby-carrier",
      "baby-tula-lite-carrier",
    ],
    faqs: [
      {
        "question": "Can a newborn face outward?",
        "answer": "No. Use only a model’s eligible inward newborn setup after its exact minimums and support requirements are met. A model without documented newborn eligibility needs another plan."
      },
      {
        "question": "Is an all-stage carrier always better?",
        "answer": "No. Later modes have value only if the household needs them and the exact child and wearer meet the instructions. Keep a suitable carrier already owned."
      },
      {
        "question": "What matters more than a broad age label?",
        "answer": "The matching manual, weight and length, position-specific development, head/neck support, unobstructed airway and each caregiver’s ability to fit and recheck the carrier."
      }
    ],
    "quickAnswer": "Choose the position the child is documented to use now and the caregiver can reliably fit and recheck. Mini has no back mode; Lite is not newborn use; Harmony, PureHug and Hexa have material instruction conflicts described below. Keep an existing suitable carrier, wait for eligibility or pause an unresolved version.",
    "sections": [
      {
        "heading": "Keep the unresolved cases in the decision",
        "body": "Harmony’s linked manual gives 7/8 lb newborn minimums and conflicting leg-strap conditions. Mini’s current page lists 24 lb maximum while its manual lists 25 lb. PureHug Black has 44/45 lb limits and an unconfirmed original back-mode procedure. Hexa’s sales page starts at 8 lb while its manual warning starts at 13.2 lb. Confirm the exact supplied instructions before purchase or use rather than selecting the larger advertised range."
      },
      {
        "heading": "Positions are model-specific",
        "body": "Breeze documents inward, eligible outward, hip and back use; its later positions have their own fit and developmental conditions. Harmony outward has a 26 lb limit in the reviewed manual and back begins at 12 months. Mini has no back position. Lite begins front inward at 12 lb and back at 18 lb, with the required head, neck, torso and sitting control; it has no outward position."
      },
      {
        "heading": "Check the adult and keep an alternative",
        "body": "Compare buckle access, the full adjustment sequence and support for the child while loading or changing setups. Check each wearer separately and maintain visible, unobstructed breathing space. Return eligibility must allow any proposed fit trial; unused-only returns do not. Stop or choose another suitable plan when instructions, position or fit cannot be established."
      }
    ],
    "sources": [
      {
        "name": "Original Omni Breeze manual",
        "url": "https://cdn.shopify.com/s/files/1/0157/0150/8160/files/IM_OMNIBRZ_201021_ROW_V1.pdf?v=1630054302",
        "note": "Previously read complete original two-spread instructions, chart and diagrams; no Classic or Deluxe instruction transfer."
      },
      {
        "name": "Harmony US manual",
        "url": "https://a.storyblok.com/f/187315/x/1267c722e3/bc-harmony-om-us-v4-202104-lr.pdf",
        "note": "Complete English use/safety pages 4–11 and diagrams read. Newborn weight and leg-strap statements conflict within the manual; confirm matching instructions."
      },
      {
        "name": "Mini US manual",
        "url": "https://a.storyblok.com/f/187315/x/0301cfadea/2676a-bc-mini_om_us_print.pdf",
        "note": "Complete English use/safety pages 6–13 and diagrams read. Manual 25 lb maximum differs from current US product page’s 24 lb."
      },
      {
        "name": "Baby Tula position guidance",
        "url": "https://babytula.com/pages/learn",
        "note": "Lite front inward 12–30 lb; back from 18 lb and appropriate head/neck/torso and sitting control. Match supplied instructions."
      },
      {
        "name": "PureHug Black product and version conditions",
        "url": "https://momcozy.com/products/momcozy-purehug-baby-carrier-black",
        "note": "Current page has 44/45 lb upper-limit differences and a back-carry marketing claim. Matching original back-position instructions remain unconfirmed."
      },
      {
        "name": "Hexa original manual",
        "url": "https://www.bcbabycare.com/cdn/shop/files/Hexa_Effortless_Carrier_User_Manual.pdf",
        "note": "Complete English physical pages 5–17 and diagrams read. BC2402503KJ warning starts at 13.2 lb, conflicting with the sales page’s 8 lb; exact purchase remains paused."
      }
    ],
  },
  {
    site: "homeoffice",
    slug: "best-home-office-lighting-for-video-calls-in-small-rooms",
    title: "Home Office Lighting for Video Calls in Small Rooms",
    updatedAt: "July 26, 2026",
    dek: "Choose compact lighting for Zoom, Meet, and Teams calls by face exposure, glare, monitor space, window position, and desk clutter.",
    category: "meetings",
    intent: "Improve video-call appearance in a small home office without turning the desk into a studio.",
    intro:
      "Small-room video calls usually fail because the camera sees a bright window, overhead shadows, or a dark face. A compact front light can outperform a new webcam when it is placed near the camera and adjusted before meetings.",
    sections: [
      {
        heading: "Light the face before the room",
        body: "Put the first controllable light near or slightly above the camera path, reduce strong backlight from windows, and avoid relying on an overhead fixture alone. The camera needs a readable face, not merely a bright room.",
      },
      {
        heading: "Separate call lighting from task lighting",
        body: "A monitor bar can improve the keyboard and desk surface without adding a lamp base, while a camera-adjacent light is usually better for face exposure. A hybrid swing-arm lamp can do both jobs only when its clamp and reach let it move into the camera path.",
      },
      {
        heading: "Use a repeatable glare test",
        body: "Join a preview at the times calls actually happen, then check glasses, glossy screens, and bright windows. Lower brightness, raise the light, or move it sideways until reflections leave the camera view without making the face too dark.",
      },
      {
        heading: "Measure mounts and controls before choosing",
        body: "Check monitor thickness, laptop-lid strength, webcam position, desk-edge clamp clearance, wall space, USB power, and whether brightness controls remain reachable. A compact light that conflicts with the camera or needs an awkward daily setup will not stay useful.",
      },
    ],
    decisionGuide: [
      { label: "Face is too dark", detail: "Start with a compact video light near the camera rather than a desk lamp behind the screen." },
      { label: "Need keyboard light", detail: "A monitor light bar helps desk visibility but may not brighten your face enough for calls." },
      { label: "Wear glasses", detail: "Prioritize dimming and angle control so the light does not reflect directly into the camera." },
      { label: "Tiny desk", detail: "Favor monitor-mounted or behind-monitor placement over lamp bases that consume the work surface." },
    ],
    methodology: [
      "Match the light to camera position first",
      "Check glare on glasses and glossy monitors",
      "Separate face lighting from desk lighting",
      "Confirm mount, power, control, and return-window details on the exact listing",
    ],
    comparisonTable: {
      title: "Small-room video-call lighting comparison",
      columns: ["Logitech Litra Glow", "Elgato Key Light Neo", "Lume Cube Edge 2.0", "BenQ ScreenBar Halo 2"],
      rows: [
        { label: "Primary job", values: ["Compact face light", "Stronger monitor-mounted face light", "Task lamp plus webcam light", "Keyboard and desk illumination"] },
        { label: "Space use", values: ["Monitor or laptop mount", "Monitor mount", "Desk-edge clamp and swing arm", "Monitor-mounted light bar"] },
        { label: "Main check", values: ["Mount and camera clearance", "Monitor fit and USB power", "Clamp, wall clearance, and camera angle", "Monitor shape and face-light expectations"] },
        { label: "Best for", values: ["Simple recurring calls", "Dedicated call-light upgrade", "One light for desk and meetings", "Task lighting without a lamp base"] },
      ],
    },
    productSlugs: ["logitech-litra-glow", "elgato-key-light-neo", "lume-cube-edge-2-desk-light", "benq-screenbar-halo"],
    faqs: [
      { question: "Is a monitor light bar good for video calls?", answer: "It can help the desk, but it may not light the face as well as a camera-adjacent video light." },
      { question: "Should the light be behind the monitor?", answer: "It should light your face from near the camera path. Behind-monitor placement can work only if the light is aimed correctly." },
      { question: "Do I need a new webcam first?", answer: "Often no. Fixing face lighting can improve a normal webcam more than replacing the camera in a dim room." },
    ],
  },
  {
    site: "homeoffice",
    slug: "best-monitor-arms-for-walking-desks",
    title: "Monitor Arm for a Walking Desk: 3 Stable Setups",
    dek: "Compare monitor weight range, clamp support, arm extension, screen wobble, cable slack, and desk stiffness before buying for a walking desk.",
    category: "ergonomics",
    updatedAt: "July 12, 2026",
    intent: "Choose a monitor arm that stays usable while a walking pad adds movement to the desk and screen.",
    intro: "A walking-desk monitor arm is only as stable as the floor, desk frame, desktop, clamp, and screen path below it. Choose the arm after checking monitor-only weight, VESA, clamp clearance, extension, and the pace you can work at comfortably.",
    decisionGuide: [
      { label: "Heavy or curved display", detail: "Start with Ergotron HX after confirming monitor weight, curve adapter needs, and desk strength." },
      { label: "Value heavy-duty option", detail: "Compare HUANUO TitanLift when the monitor fits its range and a supported clamp area is available." },
      { label: "Light single monitor", detail: "Amazon Basics can fit a simpler setup when weight and VESA stay comfortably inside its range." },
      { label: "Walking stability first", detail: "Keep the display close to the post, reduce forward extension, and fix desk wobble before changing arms." },
    ],
    methodology: [
      "Use monitor-only weight and the exact VESA pattern",
      "Inspect the desktop above and below the clamp",
      "Compare short-extension stability with the desired standing height",
      "Test cable slack through sit-stand travel and walking-pad movement",
    ],
    productSlugs: ["ergotron-hx-monitor-arm", "huanuo-titanlift-heavy-duty-monitor-arm", "amazon-basics-monitor-arm"],
    faqs: [
      { question: "Is a heavy-duty arm automatically stable on a walking desk?", answer: "No. Desk flex, lifting columns, floor movement, clamp position, and arm extension can dominate the result." },
      { question: "Should I use a dual monitor arm?", answer: "Only when the shared post and desktop can carry the combined leverage. Two independent arms can make weight and position easier to isolate." },
      { question: "How do I reduce screen wobble?", answer: "Level and tighten the desk, move the screen closer to the post, reduce extension, add safe cable slack, and slow the walking pace before replacing hardware." },
    ],
  },
];

export const gscPriorityGuides: Guide[] = [
  {
    site: "baby",
    slug: "ergobaby-omni-breeze-forward-facing-age-guide",
    title: "Ergobaby Omni Breeze Forward Facing: Age & Fit Checks",
    dek: "Check head and neck control, height, weight, chin clearance, overstimulation, and when to turn back inward.",
    category: "travel",
    updatedAt: "September 11, 2026",
    relatedProducts: ["ergobaby-omni-breeze-carrier"],
    relatedRoundups: ["best-baby-carriers-by-age-and-position", "best-baby-carriers-and-sleep-routine-upgrades"],
    sources: [
      { name: "Ergobaby Omni Breeze product guidance", url: "https://ergobaby.com/omni-breeze-baby-carrier-all", note: "Official position, size, and FAQ guidance." },
      { name: "Ergobaby Omni Breeze instructions", url: "https://ergobaby.com/instructions-omni-breeze/", note: "Official setup videos and manuals." },
    ],
    sections: [
      { heading: "Forward-facing is not a newborn mode", body: "Use the front-inward newborn setup until the baby meets the exact outward-facing requirements in the current Ergobaby instructions. Age alone is not enough." },
      { heading: "Check control and panel height", body: "Before turning outward, confirm strong head and neck control, the listed height and weight guidance, and that the chin clears the top of the panel without slumping." },
      { heading: "Use outward carry for alert short sessions", body: "Turn the baby inward when sleepy, overstimulated, cold, hot, or unable to maintain posture. Outward carry is a situational option, not the default for every errand." },
      { heading: "Reset the carrier before changing direction", body: "Seat width, strap tension, waistband position, and panel support can change between inward and outward carry. Follow the position-specific official setup each time." },
    ],
  },
  {
    site: "baby",
    slug: "ergobaby-omni-breeze-vs-babybjorn-harmony-by-age",
    title: "Ergobaby Omni Breeze vs. BabyBjorn Harmony by Age",
    dek: "Compare newborn setup, outward carry, back carry, mesh comfort, waistband support, and caregiver fit across the first year.",
    category: "travel",
    updatedAt,
    image: "/images/affiliate/baby-carrier-realistic.webp",
    imageAlt: "Structured mesh baby carrier prepared for an age-by-age fit and carry-position comparison",
    relatedProducts: ["ergobaby-omni-breeze-carrier", "babybjorn-carrier-harmony"],
    relatedRoundups: ["babybjorn-harmony-vs-ergobaby-omni-breeze", "best-baby-carriers-by-age-and-position"],
    sources: [
      { name: "Ergobaby Omni Breeze", url: "https://ergobaby.com/omni-breeze-baby-carrier-all", note: "Official size, position, and material guidance." },
      { name: "BabyBjorn Carrier Harmony", url: "https://www.babybjorn.com/products/baby-carriers/baby-carrier-harmony/", note: "Official size, position, and adjustment guidance." },
    ],
    sections: [
      { heading: "Newborn months: setup friction matters", body: "Both carriers should be judged by the correct inward-facing newborn setup, airway visibility, head support, and how confidently each caregiver can load the baby." },
      { heading: "Middle months: outward carry is milestone-bound", body: "Do not compare outward-facing as a simple age feature. Check each manual's head, neck, height, and weight requirements before using that position." },
      { heading: "Later months: support and back carry separate them", body: "For longer outings, compare waistband support, shoulder pressure, back-carry workflow, and whether the carrier remains comfortable as the child gets heavier." },
      { heading: "The better carrier is the one you can adjust correctly", body: "A feature-rich carrier loses value if one caregiver cannot get a secure fit. Return policy, instruction clarity, and real fit testing are part of the buying decision." },
    ],
  },
];

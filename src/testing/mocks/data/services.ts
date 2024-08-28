export const services = [
  {
    id: '0d45f99c-c265-48b4-bcd8-6db3b4d6c4e0',
    name: 'Grail Galleri Multi Cancer Test',
    description:
      'Detect signals of over 50 types of cancers at their earliest, most treatable stages.',
    price: 101900,
    active: true,
    image: '/services/grail_galleri_multi_cancer_test.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: '2e5a5479-f777-405f-9c8e-86ed45066e59',
    name: 'Food & Environmental Allergy Testing',
    description:
      'Determine your allergy and sensitivity status to over 350+ foods and common allergens.',
    price: 27900,
    active: false,
    image: '/services/food_&_environmental_allergy_testing.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: 'bf03c58f-4682-420a-8868-54af7ef5da36',
    name: 'Environmental Toxins',
    description:
      'Know how heavy metals, pesticides, plastics, and other environmental toxins may be harming your health.',
    price: 34900,
    active: true,
    image: '/services/environmental_toxins.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '386549ad-da79-4d24-af7b-2becdb7ef1a5',
    name: 'Intestinal Permeability Panel',
    description:
      'This test assesses how well your intestinal lining is preventing harmful substances from entering your bloodstream.',
    price: 24900,
    active: false,
    image: '/services/intestinal_permeability_panel.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: '60499314-f362-4480-8840-a8603dd5178a',
    name: 'PFAS Chemicals',
    description:
      'Know how environmental toxins like Perfluoroalkyl and Polyfluoroalkyls chemicals may be harming your health.',
    price: 31900,
    active: false,
    image: '/services/pfas_chemicals.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '443ff078-b75c-4cdf-9825-08a4e22852d8',
    name: 'Continuous Glucose Monitor',
    description:
      'Track your blood sugar in real time to improve energy and metabolic health (each sensor lasts 14 days).',
    price: 12900,
    active: true,
    image: '/services/continuous_glucose_monitor.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'd7b40c00-8aad-4def-a420-b82447e86f1f',
    name: 'Custom Blood Panel',
    description:
      'Build your own blood panel and choose from dozens of laboratory tests covering hundreds of biomarkers.',
    price: 4500,
    active: true,
    image: '/services/custom_blood_panel.png',
    phlebotomy: true,
    items: [
      {
        id: 'aa8f75af-4c4d-4fc7-9e83-1d7f9f7e9ff8',
        name: 'Methylmalonic Acid (MMA) b12',
        description:
          'Quantifies Vitamin B12 levels, crucial for nerve health, red blood cell formation, and DNA synthesis. Important for diagnosing anemia and monitoring nutritional status.',
        price: '6',
      },
      {
        id: '323f1e2f-3163-494f-8550-28894352e137',
        name: 'CBC With Differential/Plat',
        description:
          'Incorporates essential markers such as hematocrit, hemoglobin, mean cell volume (MCV), mean cell hemoglobin (MCH), mean corpuscular hemoglobin concentration (MCHC), red cell distribution width (RDW), platelet count, neutrophils, lymphocytes, monocytes, basophils, immature granulocytes, and reticulocytes. These metrics are pivotal for evaluating blood health and diagnosing a range of conditions.',
        price: '4',
      },
      {
        id: '066b8a63-592f-4c5e-99a7-21d839067da4',
        name: 'Uric Acid, Serum',
        description:
          'Determines uric acid concentration, crucial for diagnosing gout, monitoring kidney function, and assessing risk factors for cardiovascular disease and metabolic syndrome.',
        price: '2.75',
      },
      {
        id: 'e4b2d0fa-dc61-4201-b852-371549fd48a9',
        name: 'Thyroid Cascade Panel',
        description:
          'Includes measurements of Thyroid-Stimulating Hormone (TSH) and Thyroid Peroxidase (TPO) antibodies. Crucial for evaluating thyroid health, diagnosing autoimmune thyroid diseases, and guiding thyroid disorder management.',
        price: '6',
      },
      {
        id: '98d3e603-3382-46c7-9d45-0d55728cf2b2',
        name: 'Iron',
        description:
          'Analyzes total iron, total iron binding capacity (TIBC), unsaturated iron-binding capacity (UIBC), and iron saturation. Integral for assessing iron status, identifying anemia types, and monitoring iron therapy effectiveness.',
        price: '5',
      },
      {
        id: 'b92efb1c-ed83-4e86-ac72-73deea8e3ca3',
        name: 'Lipid Panel',
        description:
          'Measures VLDL cholesterol, "cholesterol, total", HDL cholesterol, LDL cholesterol, triglycerides. Essential for evaluating cardiovascular risk, managing cholesterol levels, and guiding dietary and medical interventions.',
        price: '5',
      },
      {
        id: '9271e57b-6636-4544-bbdb-480ae1233106',
        name: 'OmegaCheck(TM) (EPA+DPA+DHA)',
        description:
          'Evaluates EPA, DPA, DHA, arachidonic acid/EPA ratio, omega-6/omega-3 ratio, omega-3 total, omega-6 total, arachidonic acid, linoleic acid. This comprehensive test is pivotal for assessing dietary intake and balance of essential fatty acids, crucial for cardiovascular health, inflammation control, and overall wellness.',
        price: '38',
      },
      {
        id: 'f303eeae-5a9c-41f4-a726-7757e0b5d328',
        name: 'Testosterone,Free and Total',
        description:
          'Includes measurements of free testosterone and "testosterone, total." Vital for evaluating androgen status, diagnosing hormonal imbalances, and guiding treatment in reproductive health, libido, and muscle mass management.',
        price: '30',
      },
      {
        id: '1c57b0e5-ef3d-4659-91e7-1f5c3bd1dfe3',
        name: 'Sex Hormone Binding Globulin (SHBG)',
        description:
          'Measures levels of Sex Hormone Binding Globulin (SHBG), a protein that binds estrogen and testosterone, crucial for assessing hormonal balance and health, particularly in conditions related to fertility, menopause, and androgen disorders.',
        price: '20',
      },
      {
        id: '89140230-4652-478d-a737-33363823c487',
        name: 'FSH & LH',
        description:
          'Evaluates levels of Luteinizing Hormone (LH) and Follicle Stimulating Hormone (FSH), pivotal for reproductive system regulation, fertility assessment, and menstrual cycle monitoring.',
        price: '19',
      },
      {
        id: 'b787eefe-4aae-4cdd-a525-6dd8461ebe21',
        name: 'Homocysteine',
        description:
          'Evaluates homocysteine levels, an amino acid associated with heart health, vascular disease risk, and essential for monitoring conditions related to B-vitamin metabolism.',
        price: '18',
      },
      {
        id: '068a1108-9079-4670-bede-ec8b2c2b4660',
        name: 'DHEA-S',
        description:
          'Assesses levels of DHEA-Sulfate (DHEA-S), an androgen that serves as a biomarker for adrenal function and is a precursor to sex steroids. Valuable for endocrine health surveillance and hormonal balance evaluation.',
        price: '16',
      },
      {
        id: '41745c78-8b65-42c6-aa67-7f69432bae46',
        name: 'Comprehensive Metabolic Panel',
        description:
          'Includes glucose, total protein, total globulin, albumin, globulin A/G ratio, total bilirubin, blood urea nitrogen (BUN), BUN/creatinine ratio, total carbon dioxide, chloride, aspartate aminotransferase (AST), alanine aminotransferase (ALT), alkaline phosphatase (ALP), sodium, creatinine, calcium, potassium, estimated glomerular filtration rate (eGFR). Essential for evaluating organ function and general health status.',
        price: '4',
      },
      {
        id: '5a3435de-deee-467f-a4c2-cbb3665026af',
        name: 'Hemoglobin A1c (HbA1c)',
        description:
          'Measures Hemoglobin A1c levels, an important indicator of average blood sugar control over the past three months, vital for diabetes management and monitoring.',
        price: '4',
      },
      {
        id: '73d2a921-818b-47d7-af35-0f52e76f6df9',
        name: 'Zinc',
        description:
          'Determines zinc concentration, vital for immune function, wound healing, and enzyme activity. Essential for diagnosing zinc deficiency and monitoring nutritional status.',
        price: '7',
      },
      {
        id: '7f875e8e-a1f0-4fdf-8fcb-9b0be7d84f22',
        name: 'Estradiol',
        description:
          'Quantifies estradiol, the primary female sex hormone, essential for reproductive and sexual health assessment and monitoring hormonal balance across various life stages.',
        price: '16',
      },
      {
        id: '74ac05de-189d-4c10-8d85-6a2b9e8962e8',
        name: 'Lipoprotein (a)',
        description:
          'Assesses levels of Lipoprotein (a), a significant marker for cardiovascular disease risk beyond traditional lipid metrics. Important for comprehensive heart health evaluation.',
        price: '16',
      },
      {
        id: '98741ef2-5def-4a0b-8bbd-2603f1a82c14',
        name: 'Vitamin D, 25-Hydroxy',
        description:
          'Measures vitamin D concentration, essential for bone health, immune function, and overall well-being. Important for diagnosing vitamin D deficiency or insufficiency and guiding supplementation.',
        price: '15',
      },
      {
        id: '792fc832-7047-4d59-bfa6-a0d0ed5f00f5',
        name: 'High-sensitivity C-reactive protein (hs-CRP)',
        description:
          'Determines the concentration of C-Reactive Protein (CRP), a marker of inflammation in the body. Essential for detecting infection, chronic inflammatory diseases, and assessing cardiovascular risk.',
        price: '12',
      },
      {
        id: '8299fb86-c89b-49bd-ab05-f4709861b8d7',
        name: 'Magnesium RBC',
        description:
          'Determines magnesium concentration, vital for nerve, muscle function, and overall metabolic health. Essential in evaluating electrolyte balance and detecting magnesium deficiency or excess.',
        price: '12',
      },
      {
        id: '14faf240-f872-4abc-b3bd-c47032c9deb8',
        name: 'Prolactin',
        description:
          'Determines prolactin concentration, a hormone important for lactation and reproductive health. Essential for diagnosing prolactinomas, infertility, and menstrual irregularities.',
        price: '11',
      },
      {
        id: 'c3e41cca-1ef0-40ac-a90e-7c383e707281',
        name: 'Cortisol',
        description:
          'Determines cortisol concentration, a vital hormone produced by the adrenal gland, indicative of stress response, metabolic function, and circadian rhythm regulation.',
        price: '9',
      },
      {
        id: 'd2b40c49-6c1c-4bf4-a912-a3bd9b7e5531',
        name: 'Thyroglobulin Antibody',
        description:
          "Determines the presence of thyroglobulin antibodies (TgAb), indicative of autoimmune thyroid disorders. Essential for diagnosing conditions such as Hashimoto's thyroiditis and monitoring thyroid health.",
        price: '9',
      },
      {
        id: '3f38b05f-61a8-4792-a15f-21bffb43d992',
        name: 'Apolipoprotein B (Apo B)',
        description:
          'Evaluates the concentration of apolipoprotein B, a primary protein in low-density lipoprotein (LDL), crucial for lipid metabolism assessment and cardiovascular risk stratification.',
        price: '8.25',
      },
      {
        id: '6a901b9e-c440-40b3-bb69-659b3a655497',
        name: 'Ferritin',
        description:
          'Determines ferritin concentration, a crucial intracellular protein that stores iron, providing a window into iron metabolism and aiding in the diagnosis of anemia or iron overload conditions.',
        price: '7',
      },
      {
        id: 'aeef2cf6-6780-487c-a333-710d21614e79',
        name: 'Insulin',
        description:
          'Assesses insulin levels, crucial for understanding glucose metabolism, diagnosing diabetes and insulin resistance, and managing blood sugar levels effectively.',
        price: '7',
      },
      {
        id: 'aed430ad-577c-46d2-b837-4024ed8261e4',
        name: 'Thyroxine (T4) Free',
        description:
          'Quantifies levels of thyroxine (free T4), an essential thyroid hormone crucial for metabolism, growth, and energy regulation. Important for diagnosing thyroid disorders, monitoring thyroid medication dosage, and assessing thyroid function.',
        price: '7',
      },
    ],
  },
  {
    id: 'e47c367e-01f0-49b1-a4ad-939a51e0cf79',
    name: 'Full Body MRI',
    description:
      'Non-invasive body scan to reveal hidden diseases and problems.',
    price: 0,
    active: true,
    image: '/services/full_body_mri.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'b332bfcd-4d54-41fd-b46f-6d63a37e3a46',
    name: 'VO2 Max Test',
    description:
      'Benchmark the maximum amount of oxygen your body can utilize during intense exercise, a powerful marker of cardiovascular fitness and longevity.',
    price: 0,
    active: true,
    image: '/services/vo2_max_test.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '4b9383f3-188e-4ed5-a4fd-eb797fe8c912',
    name: 'DEXA Scan',
    description: 'Get a detailed analysis of body composition and bone health.',
    price: 0,
    active: true,
    image: '/services/dexa_scan.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '78f0b089-cfbd-4e0f-a6ff-3ff12b4baf75',
    name: 'Heart Calcium Scan',
    description:
      'Measures the amount of calcified plaque in the coronary arteries.',
    price: 0,
    active: true,
    image: '/services/heart_calcium_scan.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '2d241b40-3449-4448-bfc6-b5585a788784',
    name: 'Gut Microbiome Analysis',
    description:
      'Analyzes the types of bacteria and other organisms in your digestive tract.',
    price: 450000,
    active: true,
    image: '/services/gut_microbiome_analysis.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '2d58a09f-6d9b-4b31-a100-819517ecc5aa',
    name: 'Full Genetic Sequencing',
    description:
      'Examines your DNA to identify genetic predispositions to certain conditions.',
    price: 0,
    active: true,
    image: '/services/full_genetic_sequencing.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'a5e8910f-e7ea-42a8-b832-87a6227bb9df',
    name: 'Superpower Blood Panel',
    description:
      '63 biomarkers tested in a fully comprehensive blood panel. Get tested at home or a partner lab closest to you.',
    price: 23200,
    active: true,
    image: '/services/superpower_blood_panel.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: '99927a20-0a02-440c-a20b-e8d52451b2c9',
    name: '1-1 Advisory Call',
    description:
      'Get expert advice & health planning from the Superpower medical team.',
    price: 34000,
    active: true,
    image: '/services/1-1_advisory_call.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'eedcf88f-b93b-4i80-b170-69d3c8abbf1d',
    name: 'Total Toxin Test',
    description: 'Some description here',
    price: 16000,
    active: true,
    image: '/services/total-toxin.png',
    phlebotomy: false,
    items: [],
  },
];

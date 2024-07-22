import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

// import { db } from '../db';
import { requireAuth, networkDelay } from '../utils';

export const servicesHandlers = [
  http.get(`${env.API_URL}/services`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      // const result = db.healthcareService.findMany({});
      // return HttpResponse.json(result);

      return HttpResponse.json(services);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.get(
    `${env.API_URL}/services/:serviceId`,
    async ({ params, cookies }) => {
      await networkDelay();

      try {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }
        const serviceId = params.serviceId as string;
        const service = services.find(({ id }) => id === serviceId);
        // const service = db.healthcareService.findFirst({
        //   where: {
        //     id: {
        //       equals: serviceId,
        //     },
        //   },
        // });

        if (!service) {
          return HttpResponse.json(
            { message: 'Service not found' },
            { status: 404 },
          );
        }

        return HttpResponse.json(service);
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || 'Server Error' },
          { status: 500 },
        );
      }
    },
  ),
];

const services = [
  {
    id: 'a07d14e1-a58a-4367-8518-0f333e55e9ef',
    name: 'IV Drip',
    description:
      'Experience all the benefits of IV therapy in the comfort of your own home.',
    price: 0,
    active: false,
    image: '/img/services/iv_drip.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '77ec036f-064d-4fed-862e-669120cbd670',
    name: '1-1 Advisory Call',
    description:
      'Get expert advice & health planning from the Superpower medical team.',
    price: 0,
    active: true,
    image: '/img/services/1-1_advisory_call.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '03008cb7-6ade-47d1-a76f-5d3acbeb0a36',
    name: 'Grail Galleri Multi Cancer Test',
    description:
      'Detect signals of over 50 types of cancers at their earliest, most treatable stages.',
    price: 0,
    active: true,
    image: '/img/services/grail_galleri_multi_cancer_test.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: '0fe9ae61-267f-484b-987a-98481d89991d',
    name: 'Food & Environmental Allergy Testing',
    description:
      'Determine your allergy and sensitivity status to over 350+ foods and common allergens.',
    price: 0,
    active: true,
    image: '/img/services/food_&_environmental_allergy_testing.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: '11506e56-f221-43b2-adc1-4ff668d03fc0',
    name: 'Environmental Toxins',
    description:
      'Know how heavy metals, pesticides, plastics, and other environmental toxins may be harming your health.',
    price: 0,
    active: true,
    image: '/img/services/environmental_toxins.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'c2007b68-4d4f-41e0-9c77-716675a3b03b',
    name: 'Intestinal Permeability Panel',
    description:
      'This test assesses how well your intestinal lining is preventing harmful substances from entering your bloodstream.',
    price: 0,
    active: true,
    image: '/img/services/intestinal_permeability_panel.png',
    phlebotomy: true,
    items: [],
  },
  {
    id: '318acaa9-6849-47d6-93e2-994255aa500e',
    name: 'PFAS Chemicals',
    description:
      'Know how environmental toxins like Perfluoroalkyl and Polyfluoroalkyls chemicals may be harming your health.',
    price: 0,
    active: true,
    image: '/img/services/pfas_chemicals.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '2df718b6-3634-435b-ace1-6c0a57d18779',
    name: 'Continuous Glucose Monitor',
    description:
      'Track your blood sugar in real time to improve energy and metabolic health (each sensor lasts 14 days).',
    price: 0,
    active: true,
    image: '/img/services/continuous_glucose_monitor.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '37af99a0-f946-4e16-bf6a-e261e08e33fe',
    name: 'Custom Blood Panel',
    description:
      'Build your own blood panel and choose from dozens of laboratory tests covering hundreds of biomarkers.',
    price: 0,
    active: true,
    image: '/img/services/custom_blood_panel.png',
    phlebotomy: true,
    items: [
      {
        id: '35095c99-0bd1-4395-9e73-7b368c41e875',
        name: 'Apolipoprotein B (Apo B)',
        description:
          'Evaluates the concentration of apolipoprotein B, a primary protein in low-density lipoprotein (LDL), crucial for lipid metabolism assessment and cardiovascular risk stratification.',
        price: '8.25',
      },
      {
        id: 'bd48a7cd-c547-49b5-90e3-fc9bc1a1bff1',
        name: 'Thyroxine (T4) Free',
        description:
          'Quantifies levels of thyroxine (free T4), an essential thyroid hormone crucial for metabolism, growth, and energy regulation. Important for diagnosing thyroid disorders, monitoring thyroid medication dosage, and assessing thyroid function.',
        price: '7',
      },
      {
        id: 'f26b47da-dd8a-412a-a9c3-30cefe4921be',
        name: 'Zinc',
        description:
          'Determines zinc concentration, vital for immune function, wound healing, and enzyme activity. Essential for diagnosing zinc deficiency and monitoring nutritional status.',
        price: '7',
      },
      {
        id: '4dbc2b51-74dc-43e9-91df-7a86d244a3ee',
        name: 'Methylmalonic Acid (MMA) b12',
        description:
          'Quantifies Vitamin B12 levels, crucial for nerve health, red blood cell formation, and DNA synthesis. Important for diagnosing anemia and monitoring nutritional status.',
        price: '6',
      },
      {
        id: '642e438c-905e-4fb5-9851-b3bbefe2588d',
        name: 'Thyroid Cascade Panel',
        description:
          'Includes measurements of Thyroid-Stimulating Hormone (TSH) and Thyroid Peroxidase (TPO) antibodies. Crucial for evaluating thyroid health, diagnosing autoimmune thyroid diseases, and guiding thyroid disorder management.',
        price: '6',
      },
      {
        id: 'a3c614eb-1e35-4927-81c1-66e7d5c984a5',
        name: 'Iron',
        description:
          'Analyzes total iron, total iron binding capacity (TIBC), unsaturated iron-binding capacity (UIBC), and iron saturation. Integral for assessing iron status, identifying anemia types, and monitoring iron therapy effectiveness.',
        price: '5',
      },
      {
        id: '4282a270-dcb9-4db0-958d-048086d5f879',
        name: 'OmegaCheck(TM) (EPA+DPA+DHA)',
        description:
          'Evaluates EPA, DPA, DHA, arachidonic acid/EPA ratio, omega-6/omega-3 ratio, omega-3 total, omega-6 total, arachidonic acid, linoleic acid. This comprehensive test is pivotal for assessing dietary intake and balance of essential fatty acids, crucial for cardiovascular health, inflammation control, and overall wellness.',
        price: '38',
      },
      {
        id: 'eaf30acd-9e3e-42a6-b16f-fbddf466fe48',
        name: 'Testosterone,Free and Total',
        description:
          'Includes measurements of free testosterone and "testosterone, total." Vital for evaluating androgen status, diagnosing hormonal imbalances, and guiding treatment in reproductive health, libido, and muscle mass management.',
        price: '30',
      },
      {
        id: '41f21f88-734c-4ea5-a6b2-41f3678106fe',
        name: 'Sex Hormone Binding Globulin (SHBG)',
        description:
          'Measures levels of Sex Hormone Binding Globulin (SHBG), a protein that binds estrogen and testosterone, crucial for assessing hormonal balance and health, particularly in conditions related to fertility, menopause, and androgen disorders.',
        price: '20',
      },
      {
        id: 'b1022bc1-dd3c-408d-99f8-29703c63c96b',
        name: 'FSH & LH',
        description:
          'Evaluates levels of Luteinizing Hormone (LH) and Follicle Stimulating Hormone (FSH), pivotal for reproductive system regulation, fertility assessment, and menstrual cycle monitoring.',
        price: '19',
      },
      {
        id: 'd2ea8310-40a1-43ef-bbc5-fc12bd86dfce',
        name: 'Homocysteine',
        description:
          'Evaluates homocysteine levels, an amino acid associated with heart health, vascular disease risk, and essential for monitoring conditions related to B-vitamin metabolism.',
        price: '18',
      },
      {
        id: 'ad76248c-28fd-4fa0-9ecc-06a0651f38c9',
        name: 'DHEA-S',
        description:
          'Assesses levels of DHEA-Sulfate (DHEA-S), an androgen that serves as a biomarker for adrenal function and is a precursor to sex steroids. Valuable for endocrine health surveillance and hormonal balance evaluation.',
        price: '16',
      },
      {
        id: '8f419d23-2e6d-44d6-857e-49a003ed12b7',
        name: 'Ferritin',
        description:
          'Determines ferritin concentration, a crucial intracellular protein that stores iron, providing a window into iron metabolism and aiding in the diagnosis of anemia or iron overload conditions.',
        price: '7',
      },
      {
        id: 'fddf59bb-092e-4b76-91dd-417dd85df931',
        name: 'Comprehensive Metabolic Panel',
        description:
          'Includes glucose, total protein, total globulin, albumin, globulin A/G ratio, total bilirubin, blood urea nitrogen (BUN), BUN/creatinine ratio, total carbon dioxide, chloride, aspartate aminotransferase (AST), alanine aminotransferase (ALT), alkaline phosphatase (ALP), sodium, creatinine, calcium, potassium, estimated glomerular filtration rate (eGFR). Essential for evaluating organ function and general health status.',
        price: '4',
      },
      {
        id: '8c22c0d4-df29-4f6c-bda2-545a2fc61954',
        name: 'Uric Acid, Serum',
        description:
          'Determines uric acid concentration, crucial for diagnosing gout, monitoring kidney function, and assessing risk factors for cardiovascular disease and metabolic syndrome.',
        price: '2.75',
      },
      {
        id: '9fb01da9-4e8c-4672-bbdc-e1b29ccb3e36',
        name: 'Lipid Panel',
        description:
          'Measures VLDL cholesterol, "cholesterol, total", HDL cholesterol, LDL cholesterol, triglycerides. Essential for evaluating cardiovascular risk, managing cholesterol levels, and guiding dietary and medical interventions.',
        price: '5',
      },
      {
        id: '140c7333-58c9-4010-acfc-aa2e5d94c072',
        name: 'CBC With Differential/Plat',
        description:
          'Incorporates essential markers such as hematocrit, hemoglobin, mean cell volume (MCV), mean cell hemoglobin (MCH), mean corpuscular hemoglobin concentration (MCHC), red cell distribution width (RDW), platelet count, neutrophils, lymphocytes, monocytes, basophils, immature granulocytes, and reticulocytes. These metrics are pivotal for evaluating blood health and diagnosing a range of conditions.',
        price: '4',
      },
      {
        id: '24033f40-52ec-4e5d-b5c3-aef00c7b1811',
        name: 'Hemoglobin A1c (HbA1c)',
        description:
          'Measures Hemoglobin A1c levels, an important indicator of average blood sugar control over the past three months, vital for diabetes management and monitoring.',
        price: '4',
      },
      {
        id: '3ac43eb3-0f10-4267-ae06-fe6345947fa8',
        name: 'Vitamin D, 25-Hydroxy',
        description:
          'Measures vitamin D concentration, essential for bone health, immune function, and overall well-being. Important for diagnosing vitamin D deficiency or insufficiency and guiding supplementation.',
        price: '15',
      },
      {
        id: 'ed8ed992-10a8-4c4c-bc61-8012baf331eb',
        name: 'High-sensitivity C-reactive protein (hs-CRP)',
        description:
          'Determines the concentration of C-Reactive Protein (CRP), a marker of inflammation in the body. Essential for detecting infection, chronic inflammatory diseases, and assessing cardiovascular risk.',
        price: '12',
      },
      {
        id: '44dd9eeb-f439-4ee0-a4bd-462d9a116b4b',
        name: 'Magnesium RBC',
        description:
          'Determines magnesium concentration, vital for nerve, muscle function, and overall metabolic health. Essential in evaluating electrolyte balance and detecting magnesium deficiency or excess.',
        price: '12',
      },
      {
        id: '06d0dccf-2c0f-4427-b65b-b6b11c07e2e0',
        name: 'Prolactin',
        description:
          'Determines prolactin concentration, a hormone important for lactation and reproductive health. Essential for diagnosing prolactinomas, infertility, and menstrual irregularities.',
        price: '11',
      },
      {
        id: '829ee3ff-0953-408b-bc37-4c82d87850ad',
        name: 'Cortisol',
        description:
          'Determines cortisol concentration, a vital hormone produced by the adrenal gland, indicative of stress response, metabolic function, and circadian rhythm regulation.',
        price: '9',
      },
      {
        id: 'b3cfaf0c-429f-4344-896f-027f3edc3667',
        name: 'Thyroglobulin Antibody',
        description:
          "Determines the presence of thyroglobulin antibodies (TgAb), indicative of autoimmune thyroid disorders. Essential for diagnosing conditions such as Hashimoto's thyroiditis and monitoring thyroid health.",
        price: '9',
      },
      {
        id: '48069d5e-e22d-494c-b4b6-292535d586fb',
        name: 'Insulin',
        description:
          'Assesses insulin levels, crucial for understanding glucose metabolism, diagnosing diabetes and insulin resistance, and managing blood sugar levels effectively.',
        price: '7',
      },
      {
        id: '004362e3-dbfc-4f97-bb03-5e96aa66b357',
        name: 'Estradiol',
        description:
          'Quantifies estradiol, the primary female sex hormone, essential for reproductive and sexual health assessment and monitoring hormonal balance across various life stages.',
        price: '16',
      },
      {
        id: '01884c30-9b2b-4886-a49a-9b94544a7139',
        name: 'Lipoprotein (a)',
        description:
          'Assesses levels of Lipoprotein (a), a significant marker for cardiovascular disease risk beyond traditional lipid metrics. Important for comprehensive heart health evaluation.',
        price: '16',
      },
    ],
  },
  {
    id: '0a0cda29-c584-4f9b-964f-6019f6424405',
    name: 'Full Body MRI',
    description:
      'Non-invasive body scan to reveal hidden diseases and problems.',
    price: 0,
    active: true,
    image: '/img/services/full_body_mri.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'f0cb810a-dff0-4e2c-886e-c62515f4bdec',
    name: 'VO2 Max Test',
    description:
      'Benchmark the maximum amount of oxygen your body can utilize during intense exercise, a powerful marker of cardiovascular fitness and longevity.',
    price: 0,
    active: true,
    image: '/img/services/vo2_max_test.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '11700450-1fa9-41a0-a5c1-89e08853f1eb',
    name: 'DEXA Scan',
    description: 'Get a detailed analysis of body composition and bone health.',
    price: 0,
    active: true,
    image: '/img/services/dexa_scan.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'caf376c2-3189-473f-a69d-fa8e74ed0dac',
    name: 'Heart Calcium Scan',
    description:
      'Measures the amount of calcified plaque in the coronary arteries.',
    price: 0,
    active: true,
    image: '/img/services/heart_calcium_scan.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '899aed2f-449a-4463-afa0-ce53ebe7bf01',
    name: 'Gut Microbiome Analysis',
    description:
      'Analyzes the types of bacteria and other organisms in your digestive tract.',
    price: 0,
    active: true,
    image: '/img/services/gut_microbiome_analysis.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: '9175255a-a901-4245-940b-3a2735fef773',
    name: 'Full Genetic Sequencing',
    description:
      'Examines your DNA to identify genetic predispositions to certain conditions.',
    price: 0,
    active: true,
    image: '/img/services/full_genetic_sequencing.png',
    phlebotomy: false,
    items: [],
  },
  {
    id: 'eedcf46f-b93b-4d50-b170-69d3c8abbf1d',
    name: 'Superpower Blood Panel',
    description:
      '63 biomarkers tested in a fully comprehensive blood panel. Get tested at home or a partner lab closest to you.',
    price: 0,
    active: true,
    image: '/img/services/superpower_blood_panel.png',
    phlebotomy: true,
    items: [],
  },
];

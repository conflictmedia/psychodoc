// Psychoactive Substances Documentation Data

export interface Substance {
  id: string;
  name: string;
  commonNames: string[];
  category: SubstanceCategory;
  class: string;
  description: string;
  effects: {
    positive: string[];
    neutral: string[];
    negative: string[];
  };
  dosage: {
    threshold: string;
    light: string;
    common: string;
    strong: string;
    heavy: string;
  };
  duration: {
    onset: string;
    comeup: string;
    peak: string;
    offset: string;
    total: string;
  };
  interactions: string[];
  harmReduction: string[];
  legality: string;
  chemistry: {
    formula: string;
    molecularWeight: string;
    class: string;
  };
  history: string;
  routes: string[];
  afterEffects: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  aliases: string[];
}

export type SubstanceCategory = 
  | 'stimulants'
  | 'depressants'
  | 'hallucinogens'
  | 'dissociatives'
  | 'empathogens'
  | 'cannabinoids'
  | 'opioids'
  | 'deliriants';

export interface CategoryInfo {
  id: SubstanceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'stimulants',
    name: 'Stimulants',
    description: 'Substances that increase activity in the central nervous system, leading to enhanced alertness, attention, and energy.',
    icon: 'Zap',
    color: 'amber'
  },
  {
    id: 'depressants',
    name: 'Depressants',
    description: 'Substances that slow down brain function and central nervous system activity, producing calming and sedative effects.',
    icon: 'Moon',
    color: 'indigo'
  },
  {
    id: 'hallucinogens',
    name: 'Hallucinogens',
    description: 'Substances that cause profound alterations in perception, thought, and mood, often leading to visual and auditory hallucinations.',
    icon: 'Sparkles',
    color: 'purple'
  },
  {
    id: 'dissociatives',
    name: 'Dissociatives',
    description: 'Substances that produce feelings of detachment from reality and oneself, often described as an out-of-body experience.',
    icon: 'Split',
    color: 'cyan'
  },
  {
    id: 'empathogens',
    name: 'Empathogens',
    description: 'Substances that enhance feelings of empathy, emotional openness, and interpersonal connection.',
    icon: 'Heart',
    color: 'pink'
  },
  {
    id: 'cannabinoids',
    name: 'Cannabinoids',
    description: 'Compounds that act on cannabinoid receptors, producing a range of effects including relaxation and altered perception.',
    icon: 'Leaf',
    color: 'green'
  },
  {
    id: 'opioids',
    name: 'Opioids',
    description: 'Substances that act on opioid receptors, primarily used for pain relief but with high potential for dependence.',
    icon: 'Pill',
    color: 'red'
  },
  {
    id: 'deliriants',
    name: 'Deliriants',
    description: 'Substances that cause delirium, characterized by confusion, disorientation, and realistic hallucinations.',
    icon: 'Ghost',
    color: 'slate'
  }
];

export const categoryColors: Record<SubstanceCategory, string> = {
  stimulants: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  depressants: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  hallucinogens: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  dissociatives: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  empathogens: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  cannabinoids: 'text-green-500 bg-green-500/10 border-green-500/20',
  opioids: 'text-red-500 bg-red-500/10 border-red-500/20',
  deliriants: 'text-slate-500 bg-slate-500/10 border-slate-500/20'
};

export const substances: Substance[] = [
  // Stimulants
  {
    id: 'caffeine',
    name: 'Caffeine',
    commonNames: ['Coffee', 'Tea', 'Energy Drinks', 'Guarana'],
    category: 'stimulants',
    class: 'Xanthine',
    description: 'Caffeine is the most widely consumed psychoactive substance in the world. It is a natural compound found in coffee beans, tea leaves, cocoa beans, and other plant sources. Caffeine works by blocking adenosine receptors in the brain, which prevents the onset of drowsiness and promotes alertness. It also increases dopamine signaling, contributing to its mood-enhancing effects and mild addictive potential. As a central nervous system stimulant, caffeine is commonly used to improve concentration, reduce fatigue, and enhance physical performance.',
    effects: {
      positive: ['Increased alertness and wakefulness', 'Enhanced cognitive function and focus', 'Improved physical performance and endurance', 'Elevated mood and reduced perception of fatigue', 'Enhanced reaction time and coordination'],
      neutral: ['Increased heart rate and blood pressure', 'Diuretic effects', 'Mild appetite suppression', 'Increased metabolic rate'],
      negative: ['Anxiety and restlessness', 'Insomnia and sleep disruption', 'Digestive issues and stomach upset', 'Headaches and migraines', 'Dependency and withdrawal symptoms', 'Jitters and tremors']
    },
    dosage: {
      threshold: '10-20mg',
      light: '20-50mg',
      common: '50-150mg',
      strong: '150-300mg',
      heavy: '300mg+'
    },
    duration: {
      onset: '10-30 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '3-5 hours',
      total: '4-6 hours'
    },
    interactions: ['MAOIs', 'Certain antibiotics', 'Bronchodilators', 'Anticoagulants'],
    harmReduction: [
      'Avoid consuming more than 400mg per day for adults',
      'Do not mix with other stimulants without research',
      'Stay hydrated while consuming caffeine',
      'Avoid consumption late in the day to prevent sleep disruption',
      'Be aware of caffeine content in beverages and supplements',
      'Reduce intake gradually to avoid withdrawal symptoms'
    ],
    legality: 'Legal and unregulated in most jurisdictions. Widely available in foods, beverages, and supplements.',
    chemistry: {
      formula: 'C8H10N4O2',
      molecularWeight: '194.19 g/mol',
      class: 'Xanthine alkaloid'
    },
    history: 'Caffeine has been consumed for thousands of years, with tea cultivation in China dating back to 2700 BCE. Coffee consumption began in Ethiopia around the 9th century and spread throughout the Arab world. By the 17th century, coffee houses had become popular in Europe. Today, caffeine is the most widely used psychoactive substance globally.',
    routes: ['Oral (beverages, pills, food)', 'Sublingual', 'Rectal'],
    afterEffects: 'May include fatigue, headache, and irritability as effects wear off. Regular consumers may experience withdrawal.',
    riskLevel: 'low',
    aliases: ['1,3,7-trimethylxanthine', 'guaranine', 'theine', 'mateine']
  },
  {
    id: 'nicotine',
    name: 'Nicotine',
    commonNames: ['Tobacco', 'Vape', 'E-cigarettes', 'Pouches', 'Gum'],
    category: 'stimulants',
    class: 'Alkaloid',
    description: 'Nicotine is a potent parasympathomimetic alkaloid found in the nightshade family of plants, predominantly in tobacco. It acts as a stimulant in mammals and is one of the most addictive substances known. Nicotine stimulates nicotinic acetylcholine receptors in the brain, leading to the release of dopamine, norepinephrine, and other neurotransmitters. This results in increased alertness, improved concentration, and a sense of relaxation. Despite its stimulant properties, nicotine can also produce calming effects, particularly in stressful situations. The substance is primarily consumed through tobacco products, though nicotine replacement therapies and electronic cigarettes have become increasingly common.',
    effects: {
      positive: ['Increased alertness and concentration', 'Mild euphoria and mood elevation', 'Appetite suppression', 'Temporary stress relief and relaxation', 'Enhanced cognitive performance'],
      neutral: ['Increased heart rate and blood pressure', 'Constriction of blood vessels', 'Increased respiratory rate'],
      negative: ['High addiction potential', 'Increased risk of cardiovascular disease', 'Respiratory issues from smoke inhalation', 'Anxiety and irritability during withdrawal', 'Potential harm during pregnancy', 'Cancer risk from tobacco products']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-4mg',
      strong: '4-8mg',
      heavy: '8mg+'
    },
    duration: {
      onset: 'Immediate (smoking/vaping)',
      comeup: '5-10 minutes',
      peak: '10-30 minutes',
      offset: '30-120 minutes',
      total: '1-2 hours'
    },
    interactions: ['MAOIs', 'Antipsychotics', 'Insulin', 'Bronchodilators', 'Caffeine'],
    harmReduction: [
      'Consider harm reduction alternatives like nicotine replacement therapy',
      'Be aware of the high addiction potential',
      'Avoid use during pregnancy',
      'Do not combine with other substances without research',
      'Monitor cardiovascular health with regular use',
      'Consider tapering off rather than abrupt cessation'
    ],
    legality: 'Legal in most countries for adults, but restricted in advertising and public use. Tobacco products are heavily regulated and taxed.',
    chemistry: {
      formula: 'C10H14N2',
      molecularWeight: '162.23 g/mol',
      class: 'Pyridine alkaloid'
    },
    history: 'Nicotine has been used for thousands of years, with indigenous peoples of the Americas using tobacco in religious and medicinal contexts. Tobacco was introduced to Europe in the 16th century and became a global commodity. The addictive properties of nicotine were scientifically documented in the 20th century.',
    routes: ['Inhalation (smoking, vaping)', 'Oral (gum, lozenges, pouches)', 'Transdermal (patches)', 'Nasal (spray)'],
    afterEffects: 'Cravings, irritability, and difficulty concentrating as effects subside. Withdrawal symptoms can last weeks.',
    riskLevel: 'high',
    aliases: ['3-(1-methyl-2-pyrrolidinyl)pyridine']
  },
  {
    id: 'cocaine',
    name: 'Cocaine',
    commonNames: ['Coke', 'Blow', 'Snow', 'White', 'Charlie'],
    category: 'stimulants',
    class: 'Tropane Alkaloid',
    description: 'Cocaine is a powerful stimulant and local anesthetic derived from the leaves of the coca plant (Erythroxylum coca), native to South America. It acts as a serotonin-norepinephrine-dopamine reuptake inhibitor (SNDRI), producing intense euphoria, increased energy, and heightened alertness. Cocaine blocks the reuptake of these neurotransmitters, leading to their accumulation in the synaptic cleft and resulting in its characteristic effects. The drug has a long history of use, both medicinally as a local anesthetic and recreationally for its stimulant properties. Cocaine is known for its high addiction potential and significant cardiovascular risks.',
    effects: {
      positive: ['Intense euphoria and sense of well-being', 'Increased energy and alertness', 'Enhanced confidence and sociability', 'Decreased appetite', 'Heightened sensory perception'],
      neutral: ['Increased heart rate and blood pressure', 'Dilated pupils', 'Elevated body temperature', 'Increased respiration rate'],
      negative: ['High addiction potential', 'Anxiety, paranoia, and panic attacks', 'Cardiovascular complications', 'Nasal damage from insufflation', 'Risk of overdose', 'Severe comedown and depression', 'Psychosis with prolonged use']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-30mg',
      common: '30-60mg',
      strong: '60-100mg',
      heavy: '100mg+'
    },
    duration: {
      onset: '1-5 minutes (insufflated)',
      comeup: '5-15 minutes',
      peak: '15-30 minutes',
      offset: '30-60 minutes',
      total: '45-90 minutes'
    },
    interactions: ['Alcohol (forms cocaethylene)', 'MAOIs', 'SSRIs', 'Other stimulants', 'Opioids'],
    harmReduction: [
      'Never use alone - have someone present who can call for help',
      'Avoid mixing with alcohol or other substances',
      'Test substances for purity and adulterants',
      'Use sterile equipment to prevent infection',
      'Stay hydrated but do not over-hydrate',
      'Be aware of signs of overdose: chest pain, seizures, severe agitation',
      'Space out use to reduce addiction risk'
    ],
    legality: 'Illegal in most countries. Schedule I/II controlled substance with severe legal penalties for possession, distribution, and manufacture.',
    chemistry: {
      formula: 'C17H21NO4',
      molecularWeight: '303.35 g/mol',
      class: 'Tropane alkaloid'
    },
    history: 'Coca leaves have been used for thousands of years by indigenous South Americans. Cocaine was first isolated in 1859 and was used medicinally and in beverages (including early Coca-Cola) until the early 20th century. Its addictive properties led to strict regulation.',
    routes: ['Insufflation (snorting)', 'Smoking (freebase/crack)', 'Intravenous', 'Oral (rare)', 'Topical (medical use)'],
    afterEffects: 'Severe comedown including depression, fatigue, anxiety, and intense cravings. Can last hours to days.',
    riskLevel: 'very-high',
    aliases: ['benzoylmethylecgonine', 'methyl benzoylecgonine']
  },
  {
    id: 'methamphetamine',
    name: 'Methamphetamine',
    commonNames: ['Meth', 'Crystal', 'Ice', 'Crank', 'Speed', 'Glass'],
    category: 'stimulants',
    class: 'Phenethylamine',
    description: 'Methamphetamine is a potent central nervous system stimulant of the phenethylamine class. It acts primarily as a releasing agent for dopamine, norepinephrine, and serotonin, producing intense euphoria, increased energy, and heightened focus. Methamphetamine is structurally similar to amphetamine but has greater lipid solubility, allowing it to cross the blood-brain barrier more rapidly and produce more intense effects. The drug has legitimate medical applications for ADHD and obesity treatment under the brand name Desoxyn, but is primarily known for its recreational use and high addiction potential. Chronic use can lead to significant neurotoxic effects and cognitive impairment.',
    effects: {
      positive: ['Intense euphoria and sense of well-being', 'Greatly increased energy and alertness', 'Enhanced focus and concentration', 'Decreased need for sleep', 'Increased confidence and sociability', 'Suppressed appetite'],
      neutral: ['Increased heart rate and blood pressure', 'Dilated pupils', 'Elevated body temperature', 'Dry mouth', 'Increased libido'],
      negative: ['Very high addiction potential', 'Severe anxiety and paranoia', 'Psychosis and hallucinations', 'Cardiovascular damage', 'Severe dental problems ("meth mouth")', 'Skin picking and sores', 'Cognitive impairment with chronic use', 'Severe depression during withdrawal', 'Weight loss and malnutrition']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-25mg',
      common: '25-50mg',
      strong: '50-100mg',
      heavy: '100mg+'
    },
    duration: {
      onset: '15-30 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '6-12 hours',
      total: '8-24 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Other stimulants', 'Alcohol', 'Opioids', 'Antipsychotics'],
    harmReduction: [
      'Never use alone - have someone present who can call for help',
      'Avoid mixing with other substances',
      'Stay hydrated and eat regularly despite suppressed appetite',
      'Practice good dental hygiene',
      'Test substances for purity',
      'Use sterile equipment to prevent infection',
      'Limit frequency of use and duration of binges',
      'Be aware of signs of psychosis and seek help if needed'
    ],
    legality: 'Illegal in most countries. Schedule II controlled substance in the US (limited medical use). Severe legal penalties for possession and distribution.',
    chemistry: {
      formula: 'C10H15N',
      molecularWeight: '149.23 g/mol',
      class: 'Phenethylamine derivative'
    },
    history: 'Methamphetamine was first synthesized in 1893. It was used by both Axis and Allied forces during World War II for its stimulant effects. Post-war, it became available commercially and was used for various medical conditions before its addictive properties led to strict regulation.',
    routes: ['Oral', 'Insufflation', 'Smoking', 'Intravenous', 'Rectal'],
    afterEffects: 'Severe crash including depression, extreme fatigue, anxiety, and intense cravings. Post-acute withdrawal can last months.',
    riskLevel: 'very-high',
    aliases: ['N-methylamphetamine', 'desoxyephedrine', 'meth']
  },
  
  // Hallucinogens
  {
    id: 'lsd',
    name: 'LSD',
    commonNames: ['Acid', 'Tabs', 'Blotter', 'Lucy', 'Doses'],
    category: 'hallucinogens',
    class: 'Lysergamide',
    description: 'LSD (Lysergic acid diethylamide) is one of the most potent psychedelic substances known, active at microgram doses. It was first synthesized by Albert Hofmann in 1938 from ergot fungus. LSD primarily acts as a serotonin receptor agonist, particularly at the 5-HT2A receptor, producing profound alterations in perception, thought, and mood. The LSD experience, often called a "trip," can last 8-12 hours and is characterized by visual and auditory hallucinations, synesthesia, altered sense of time and self, and profound introspective experiences. LSD has shown promise in therapeutic applications for depression, anxiety, and addiction.',
    effects: {
      positive: ['Profound sense of interconnectedness', 'Enhanced appreciation of music and art', 'Spiritual or mystical experiences', 'Increased creativity and novel thinking', 'Therapeutic insights and emotional processing', 'Sense of wonder and awe'],
      neutral: ['Visual distortions and hallucinations', 'Altered perception of time', 'Synesthesia (sensory crossover)', 'Changes in thought patterns', 'Pupil dilation', 'Mild increase in heart rate and blood pressure'],
      negative: ['Anxiety and panic (bad trips)', 'Confusion and disorientation', 'Difficult emotional experiences', 'Temporary paranoia', 'HPPD (Hallucinogen Persisting Perception Disorder) in rare cases', 'Exacerbation of underlying mental health conditions']
    },
    dosage: {
      threshold: '20-30μg',
      light: '30-75μg',
      common: '75-150μg',
      strong: '150-300μg',
      heavy: '300μg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '3-5 hours',
      offset: '3-5 hours',
      total: '8-12 hours'
    },
    interactions: ['SSRIs (reduce effects)', 'MAOIs', 'Antipsychotics', 'Tramadol', 'Lithium'],
    harmReduction: [
      'Set and setting are crucial - be in a safe, comfortable environment',
      'Have a trusted trip-sitter present',
      'Start with a low dose and wait full duration before redosing',
      'Avoid if you have a personal or family history of psychosis',
      'Do not drive or operate machinery',
      'Stay hydrated but do not over-hydrate',
      'Have a plan for difficult experiences',
      'Wait 3-4 days between trips to reset tolerance'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance with no recognized medical use (despite research suggesting therapeutic potential).',
    chemistry: {
      formula: 'C20H25N3O',
      molecularWeight: '323.43 g/mol',
      class: 'Lysergamide'
    },
    history: 'LSD was first synthesized by Albert Hofmann in 1938, with its psychedelic properties discovered accidentally in 1943. It was researched for therapeutic applications in the 1950s-60s before being made illegal. The counterculture movement embraced LSD before it was banned in 1968.',
    routes: ['Sublingual', 'Oral'],
    afterEffects: 'Afterglow lasting 1-2 days with enhanced mood and introspection. Fatigue from long duration.',
    riskLevel: 'moderate',
    aliases: ['lysergic acid diethylamide', 'lysergide']
  },
  {
    id: 'psilocybin',
    name: 'Psilocybin',
    commonNames: ['Magic Mushrooms', 'Shrooms', 'Mushies', 'Boomers', 'Caps'],
    category: 'hallucinogens',
    class: 'Tryptamine',
    description: 'Psilocybin is a naturally occurring psychedelic compound found in over 200 species of mushrooms, primarily in the genus Psilocybe. When ingested, psilocybin is rapidly dephosphorylated to psilocin, the active compound that produces psychedelic effects. Psilocin acts primarily as a serotonin receptor agonist, particularly at 5-HT2A receptors. The psilocybin experience typically lasts 4-6 hours and is characterized by visual distortions, altered perception of time and space, and profound changes in consciousness. Recent research has demonstrated significant therapeutic potential for depression, anxiety, and addiction.',
    effects: {
      positive: ['Spiritual or mystical experiences', 'Enhanced connection to nature', 'Emotional breakthrough and processing', 'Increased creativity and open-mindedness', 'Therapeutic insights', 'Lasting positive changes in personality and well-being'],
      neutral: ['Visual distortions and patterns', 'Altered perception of time', 'Changes in body sensation', 'Synesthesia', 'Yawning', 'Pupil dilation'],
      negative: ['Anxiety and panic', 'Nausea and stomach discomfort', 'Confusion and disorientation', 'Headache', 'Difficult psychological experiences', 'Exacerbation of mental health conditions']
    },
    dosage: {
      threshold: '0.5-1g dried mushrooms',
      light: '1-1.5g dried mushrooms',
      common: '1.5-3g dried mushrooms',
      strong: '3-5g dried mushrooms',
      heavy: '5g+ dried mushrooms'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '2-3 hours',
      offset: '2-3 hours',
      total: '4-6 hours'
    },
    interactions: ['SSRIs (reduce effects)', 'MAOIs', 'Antipsychotics', 'Tramadol', 'Alcohol'],
    harmReduction: [
      'Set and setting are crucial - choose a safe, comfortable environment',
      'Have a trusted trip-sitter present',
      'Start with a low dose to assess sensitivity',
      'Avoid if you have a personal or family history of psychosis',
      'Do not drive or operate machinery',
      'Properly identify mushrooms to avoid toxic species',
      'Stay hydrated and have snacks available',
      'Prepare for potential nausea during come-up'
    ],
    legality: 'Illegal in most countries. However, several jurisdictions have decriminalized or are considering therapeutic exemptions. Schedule I in the US.',
    chemistry: {
      formula: 'C12H17N2O4P',
      molecularWeight: '284.25 g/mol',
      class: 'Tryptamine derivative'
    },
    history: 'Psilocybin mushrooms have been used for thousands of years in religious and healing ceremonies by indigenous peoples of Mesoamerica. Western awareness increased after R. Gordon Wasson\'s 1957 Life magazine article. Psilocybin was synthesized by Albert Hofmann in 1958.',
    routes: ['Oral (eating, tea)', 'Lemon tek (acidic extraction)'],
    afterEffects: 'Afterglow lasting 1-3 days. Some report improved mood and outlook for weeks after.',
    riskLevel: 'moderate',
    aliases: ['4-PO-DMT', 'psilocybine']
  },
  {
    id: 'dmt',
    name: 'DMT',
    commonNames: ['Dimitri', 'Spirit Molecule', 'Deemz', 'Spice', 'Changa'],
    category: 'hallucinogens',
    class: 'Tryptamine',
    description: 'N,N-Dimethyltryptamine (DMT) is a powerful psychedelic compound found naturally in many plants and animals, including humans. When vaporized and inhaled, DMT produces an extremely intense but short-acting psychedelic experience, often described as a "breakthrough" to another dimension. The experience is characterized by vivid visual hallucinations, encounters with seemingly autonomous entities, and a sense of entering an entirely different reality. DMT acts primarily as a serotonin receptor agonist. Unlike other psychedelics, the DMT experience is remarkably consistent across users, with common themes of geometric patterns, entities, and alternate dimensions.',
    effects: {
      positive: ['Profound spiritual experiences', 'Sense of entering alternate dimensions', 'Encounters with entities', 'Complete dissolution of ego', 'Life-changing insights', 'Sense of returning "home"'],
      neutral: ['Intense visual hallucinations', 'Geometric patterns and fractals', 'Altered perception of time', 'Body load sensations', 'Rapid onset of effects'],
      negative: ['Overwhelming intensity', 'Fear and panic', 'Difficulty integrating experiences', 'Challenging entity encounters', 'Physical discomfort', 'Hypertension and rapid heart rate']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-60mg',
      heavy: '60mg+'
    },
    duration: {
      onset: '10-30 seconds',
      comeup: '1-2 minutes',
      peak: '5-15 minutes',
      offset: '10-20 minutes',
      total: '15-30 minutes'
    },
    interactions: ['MAOIs (dangerous combination without knowledge)', 'SSRIs', 'Antipsychotics', 'Tramadol'],
    harmReduction: [
      'Have an experienced sitter present',
      'Use a proper vaporization device - avoid combustion',
      'Be in a safe, comfortable environment',
      'Start with lower doses to gauge sensitivity',
      'Avoid if you have heart conditions',
      'Be prepared for overwhelming intensity',
      'Allow time for integration after experience',
      'Do not stand or move during experience'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance. Ayahuasca (which contains DMT) has religious exemptions in some jurisdictions.',
    chemistry: {
      formula: 'C12H16N2',
      molecularWeight: '188.27 g/mol',
      class: 'Tryptamine derivative'
    },
    history: 'DMT has been used for millennia in the form of ayahuasca by indigenous Amazonian peoples. It was first synthesized in 1931 and its psychoactive properties were discovered in 1956. Rick Strassman\'s research in the 1990s popularized it as "the spirit molecule."',
    routes: ['Vaporization/inhalation', 'Oral (with MAOI - ayahuasca)', 'Insufflation', 'Intravenous'],
    afterEffects: 'Rapid return to baseline. Many report lasting positive effects and increased appreciation for life.',
    riskLevel: 'moderate',
    aliases: ['N,N-DMT', 'N,N-dimethyltryptamine']
  },

  // Empathogens
  {
    id: 'mdma',
    name: 'MDMA',
    commonNames: ['Ecstasy', 'Molly', 'E', 'Rolls', 'Beans'],
    category: 'empathogens',
    class: 'Phenethylamine',
    description: 'MDMA (3,4-methylenedioxymethamphetamine) is a synthetic psychoactive drug with both stimulant and psychedelic properties. It is classified as an entactogen or empathogen for its ability to enhance feelings of emotional closeness and empathy. MDMA acts primarily as a releasing agent for serotonin, dopamine, and norepinephrine, while also acting as a serotonin reuptake inhibitor. The MDMA experience is characterized by increased energy, emotional warmth, distorted perception of time, and enhanced enjoyment of sensory experiences. MDMA has shown significant therapeutic potential for PTSD treatment.',
    effects: {
      positive: ['Intense feelings of empathy and connection', 'Enhanced appreciation of music and touch', 'Reduced anxiety and fear', 'Increased sociability and openness', 'Mild euphoria and sense of well-being', 'Therapeutic processing of trauma'],
      neutral: ['Increased energy and alertness', 'Jaw clenching and teeth grinding', 'Increased heart rate and blood pressure', 'Suppressed appetite', 'Dilated pupils', 'Enhanced sensory perception'],
      negative: ['Dehydration or over-hydration', 'Hyperthermia in hot environments', 'Depression during comedown', 'Memory and cognitive issues with frequent use', 'Neurotoxicity with heavy use', 'Teeth damage from clenching']
    },
    dosage: {
      threshold: '30-50mg',
      light: '50-75mg',
      common: '75-125mg',
      strong: '125-175mg',
      heavy: '175mg+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '2-3 hours',
      offset: '2-3 hours',
      total: '4-6 hours'
    },
    interactions: ['SSRIs (reduce effects, risk of serotonin syndrome)', 'MAOIs (dangerous)', 'Other stimulants', 'Alcohol', 'Tramadol', 'Lithium'],
    harmReduction: [
      'Test substances with reagent kits - many "Molly" contains adulterants',
      'Stay cool and take breaks from dancing',
      'Drink water but do not over-hydrate (500ml per hour)',
      'Wait at least 1-3 months between uses to reduce neurotoxicity',
      'Take supplements (antioxidants, magnesium, 5-HTP after)',
      'Avoid mixing with other substances',
      'Do not use if you have heart conditions',
      'Have trusted friends present'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance. Special exemptions exist for clinical research and some therapeutic applications.',
    chemistry: {
      formula: 'C11H15NO2',
      molecularWeight: '193.25 g/mol',
      class: 'Phenethylamine derivative'
    },
    history: 'MDMA was first synthesized in 1912 but remained obscure until rediscovered by Alexander Shulgin in the 1970s. It gained popularity in psychotherapy before becoming a popular recreational drug. It was made illegal in the US in 1985.',
    routes: ['Oral', 'Insufflation', 'Rectal', 'Sublingual'],
    afterEffects: 'Comedown lasting 1-3 days including fatigue, low mood, and difficulty concentrating. More severe with frequent use.',
    riskLevel: 'moderate',
    aliases: ['3,4-methylenedioxymethamphetamine', 'methylsafrylamine']
  },
  {
    id: 'mescaline',
    name: 'Mescaline',
    commonNames: ['Peyote', 'San Pedro', 'Cactus', 'Buttons'],
    category: 'hallucinogens',
    class: 'Phenethylamine',
    description: 'Mescaline is a naturally occurring psychedelic alkaloid found in several species of cactus, most notably peyote (Lophophora williamsii) and San Pedro (Echinopsis pachanoi). It is one of the oldest known psychedelic substances, with evidence of use dating back over 5,000 years. Mescaline acts primarily as a serotonin receptor agonist, producing visual hallucinations, altered states of consciousness, and profound introspective experiences. The experience is known for its distinctive visual character, often described as more colorful and geometric compared to other psychedelics.',
    effects: {
      positive: ['Profound spiritual and mystical experiences', 'Enhanced appreciation of nature', 'Deep introspection and self-reflection', 'Visual hallucinations with distinct geometric patterns', 'Sense of interconnectedness', 'Long-lasting therapeutic insights'],
      neutral: ['Nausea and vomiting during come-up', 'Visual distortions and color enhancement', 'Altered perception of time', 'Changes in body sensation', 'Pupil dilation'],
      negative: ['Severe nausea and vomiting', 'Anxiety and paranoia', 'Headache', 'Exhaustion from long duration', 'Difficulty integrating experiences', 'Exacerbation of mental health conditions']
    },
    dosage: {
      threshold: '50-100mg',
      light: '100-200mg',
      common: '200-400mg',
      strong: '400-600mg',
      heavy: '600mg+'
    },
    duration: {
      onset: '45-90 minutes',
      comeup: '1-2 hours',
      peak: '4-6 hours',
      offset: '4-6 hours',
      total: '10-14 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Antipsychotics', 'Tramadol', 'Stimulants'],
    harmReduction: [
      'Prepare for nausea during come-up - fasting may help',
      'Set and setting are crucial',
      'Have a trip-sitter for such a long experience',
      'Start with lower doses to assess sensitivity',
      'Avoid if you have heart conditions',
      'Be in a safe environment for the long duration',
      'Have food and water available',
      'Allow time for recovery after the experience'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance. Religious exemptions exist for Native American Church peyote ceremonies in the US.',
    chemistry: {
      formula: 'C11H17NO3',
      molecularWeight: '211.26 g/mol',
      class: 'Phenethylamine derivative'
    },
    history: 'Mescaline has been used for thousands of years by indigenous peoples of the Americas in religious ceremonies. Peyote use was documented by Spanish conquistadors in the 16th century. Mescaline was first isolated in 1897 and synthesized in 1919.',
    routes: ['Oral (cactus material, extract)', 'Sublingual'],
    afterEffects: 'Prolonged afterglow possible. Fatigue from long duration. Some report lasting positive changes.',
    riskLevel: 'moderate',
    aliases: ['3,4,5-trimethoxyphenethylamine']
  },

  // Depressants
  {
    id: 'alcohol',
    name: 'Alcohol',
    commonNames: ['Ethanol', 'Booze', 'Liquor', 'Spirits', 'Beer', 'Wine'],
    category: 'depressants',
    class: 'Depressant',
    description: 'Alcohol (ethanol) is one of the oldest and most widely used psychoactive substances in human history. It acts as a central nervous system depressant, enhancing the effects of the inhibitory neurotransmitter GABA while inhibiting the excitatory neurotransmitter NMDA. This produces the characteristic effects of relaxation, disinhibition, and impaired coordination. While socially accepted in many cultures, alcohol is responsible for significant harm globally, including addiction, liver disease, cardiovascular problems, and increased risk of accidents and violence.',
    effects: {
      positive: ['Relaxation and stress relief', 'Social disinhibition', 'Mild euphoria at low doses', 'Enhanced sociability', 'Increased confidence'],
      neutral: ['Impaired coordination and balance', 'Slurred speech', 'Slowed reaction times', 'Impaired judgment', 'Vasodilation (flushing)'],
      negative: ['Nausea and vomiting', 'Hangover (headache, dehydration)', 'Impaired memory ("blackouts")', 'Poor decision making', 'Addiction and dependence', 'Liver damage with chronic use', 'Increased risk of accidents', 'Violence and aggression', 'Alcohol poisoning risk']
    },
    dosage: {
      threshold: '1-2 drinks',
      light: '2-3 drinks',
      common: '3-5 drinks',
      strong: '5-8 drinks',
      heavy: '8+ drinks'
    },
    duration: {
      onset: '10-20 minutes',
      comeup: '20-40 minutes',
      peak: '45-90 minutes',
      offset: '2-3 hours',
      total: '3-6 hours'
    },
    interactions: ['Benzodiazepines (dangerous)', 'Opioids (dangerous)', 'Other depressants', 'Antidepressants', 'Antibiotics', 'Antihistamines', 'Cannabis'],
    harmReduction: [
      'Know your limits and drink slowly',
      'Alternate alcoholic drinks with water',
      'Never drink and drive',
      'Eat before and while drinking',
      'Avoid drinking games and rapid consumption',
      'Do not mix with other depressants',
      'Be aware of alcohol content in drinks',
      'Seek help if you cannot control your drinking'
    ],
    legality: 'Legal for adults in most countries with various restrictions on sale, public consumption, and driving. Age limits vary by jurisdiction.',
    chemistry: {
      formula: 'C2H5OH',
      molecularWeight: '46.07 g/mol',
      class: 'Alcohol'
    },
    history: 'Alcohol has been produced and consumed for thousands of years, with evidence of fermented beverages dating back to 7000 BCE. It has played significant roles in religious ceremonies, medicine, and social life throughout human history.',
    routes: ['Oral'],
    afterEffects: 'Hangover lasting several hours to a day. Chronic use leads to physical dependence with potentially dangerous withdrawal.',
    riskLevel: 'moderate',
    aliases: ['ethanol', 'ethyl alcohol', 'spirits']
  },
  {
    id: 'benzodiazepines',
    name: 'Benzodiazepines',
    commonNames: ['Benzos', 'Xanax', 'Valium', 'Klonopin', 'Ativan'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Benzodiazepines are a class of psychoactive drugs that enhance the effect of the neurotransmitter GABA at the GABA-A receptor, producing sedative, hypnotic, anxiolytic, anticonvulsant, and muscle relaxant effects. They are among the most widely prescribed medications for anxiety, insomnia, and seizures. While effective for short-term treatment, benzodiazepines carry significant risks of dependence, tolerance, and withdrawal, particularly with long-term use. Withdrawal can be dangerous and potentially life-threatening.',
    effects: {
      positive: ['Anxiety relief', 'Sleep induction', 'Muscle relaxation', 'Seizure prevention', 'Panic attack relief', 'Alcohol withdrawal management'],
      neutral: ['Sedation and drowsiness', 'Impaired coordination', 'Memory impairment', 'Slurred speech', 'Reduced inhibition'],
      negative: ['High dependence potential', 'Cognitive impairment', 'Risk of overdose (especially with other depressants)', 'Paradoxical reactions (agitation, aggression)', 'Severe withdrawal symptoms', 'Falls in elderly', 'Memory problems', 'Depression with long-term use']
    },
    dosage: {
      threshold: 'Varies by specific benzodiazepine',
      light: 'Varies by specific benzodiazepine',
      common: 'Varies by specific benzodiazepine',
      strong: 'Varies by specific benzodiazepine',
      heavy: 'Varies by specific benzodiazepine'
    },
    duration: {
      onset: '15-60 minutes (oral)',
      comeup: '30-90 minutes',
      peak: '1-4 hours',
      offset: '6-12 hours (varies greatly)',
      total: '6-48+ hours (varies by half-life)'
    },
    interactions: ['Alcohol (dangerous)', 'Opioids (dangerous)', 'Other depressants', 'Antihistamines', 'Some antifungals'],
    harmReduction: [
      'Use only as prescribed by a doctor',
      'Never combine with alcohol or opioids',
      'Avoid long-term use when possible',
      'Do not stop abruptly - taper gradually under medical supervision',
      'Be aware of impairment when operating vehicles',
      'Inform all healthcare providers of use',
      'Store safely away from children and others',
      'Seek help if you develop dependence'
    ],
    legality: 'Prescription only in most countries. Schedule IV controlled substance in the US. Illegal possession without prescription.',
    chemistry: {
      formula: 'Varies by compound',
      molecularWeight: 'Varies',
      class: 'Benzodiazepine'
    },
    history: 'The first benzodiazepine, chlordiazepoxide (Librium), was synthesized in 1955 and approved in 1960. Diazepam (Valium) followed in 1963. Benzodiazepines replaced barbiturates as the primary sedative-hypnotic drugs due to their improved safety profile.',
    routes: ['Oral', 'Intravenous (medical setting)', 'Intramuscular (medical setting)', 'Rectal'],
    afterEffects: 'Sedation can persist into the next day. Withdrawal symptoms begin within 1-4 days and can last weeks to months.',
    riskLevel: 'high',
    aliases: ['benzos', 'tranquilizers', 'anxiolytics']
  },

  // Dissociatives
  {
    id: 'ketamine',
    name: 'Ketamine',
    commonNames: ['K', 'Special K', 'Ket', 'Vitamin K'],
    category: 'dissociatives',
    class: 'Arylcyclohexylamine',
    description: 'Ketamine is a dissociative anesthetic developed in the 1960s that has both medical applications and recreational use. It acts primarily as an NMDA receptor antagonist, producing anesthesia, analgesia, and at sub-anesthetic doses, dissociative and psychedelic effects. The ketamine experience is characterized by feelings of detachment from the body and environment, often described as a "K-hole" at higher doses. Ketamine has shown remarkable efficacy in treating treatment-resistant depression and is being studied for other mental health applications.',
    effects: {
      positive: ['Dissociation from pain and discomfort', 'Antidepressant effects', 'Out-of-body experiences', 'Therapeutic insights', 'Euphoria at lower doses', 'Rapid antidepressant action'],
      neutral: ['Dissociative state', 'Numbness', 'Altered perception of body and space', 'Visual distortions', 'Changes in thought patterns'],
      negative: ['Nausea and vomiting', 'Confusion and disorientation', 'Bladder damage with chronic use', 'Memory impairment', 'Difficulty moving', 'Risk of injury due to numbness', 'Psychological dependence']
    },
    dosage: {
      threshold: '10-30mg',
      light: '30-60mg',
      common: '60-100mg',
      strong: '100-200mg',
      heavy: '200mg+'
    },
    duration: {
      onset: '5-15 minutes (insufflated)',
      comeup: '10-20 minutes',
      peak: '30-60 minutes',
      offset: '1-2 hours',
      total: '1-3 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Opioids', 'Other depressants', 'Stimulants'],
    harmReduction: [
      'Use in a safe environment - you may be unable to move',
      'Have a sitter present',
      'Avoid combining with other depressants',
      'Start with lower doses to assess sensitivity',
      'Do not drive or operate machinery',
      'Stay hydrated',
      'Be aware of bladder issues with chronic use',
      'Space out use to reduce dependence risk'
    ],
    legality: 'Schedule III controlled substance in the US. Prescription only for medical use. Illegal for non-medical use in most jurisdictions.',
    chemistry: {
      formula: 'C13H16ClNO',
      molecularWeight: '237.73 g/mol',
      class: 'Arylcyclohexylamine'
    },
    history: 'Ketamine was developed in 1962 as a safer alternative to PCP. It was approved for human use in 1970 and widely used as a battlefield anesthetic during the Vietnam War. Its antidepressant properties were discovered in the 2000s.',
    routes: ['Intranasal', 'Intramuscular', 'Intravenous', 'Oral'],
    afterEffects: 'Drowsiness and cognitive impairment can last several hours. Antidepressant effects may persist for days to weeks.',
    riskLevel: 'moderate',
    aliases: ['2-(2-chlorophenyl)-2-(methylamino)cyclohexanone']
  },
  {
    id: 'dxm',
    name: 'DXM',
    commonNames: ['Dextromethorphan', 'Robo', 'Dex', 'Triple C', 'Skittles'],
    category: 'dissociatives',
    class: 'Morphinan',
    description: 'Dextromethorphan (DXM) is a dissociative substance and cough suppressant found in many over-the-counter cold and cough medications. At therapeutic doses, it acts as a cough suppressant without significant psychoactive effects. At higher doses, DXM acts as an NMDA receptor antagonist, producing dissociative and psychedelic effects. The DXM experience is dose-dependent, ranging from mild intoxication at lower doses to full dissociative experiences at higher doses. Many products containing DXM also contain other active ingredients that can be dangerous at recreational doses.',
    effects: {
      positive: ['Dissociation from pain', 'Euphoria', 'Closed-eye visuals', 'Music enhancement', 'Introspection', 'Sense of detachment'],
      neutral: ['Dissociative state', 'Altered perception', 'Numbness', 'Changes in thought patterns', 'Motor impairment'],
      negative: ['Nausea and vomiting', 'Itching and skin irritation', 'Confusion and disorientation', 'Rapid heart rate', 'High blood pressure', 'Risk of serotonin syndrome', 'Psychological distress', 'Liver damage if product contains acetaminophen']
    },
    dosage: {
      threshold: '1.5-2.5mg/kg',
      light: '2.5-5mg/kg',
      common: '5-7.5mg/kg',
      strong: '7.5-15mg/kg',
      heavy: '15mg/kg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '3-5 hours',
      offset: '3-6 hours',
      total: '6-12 hours'
    },
    interactions: ['MAOIs (dangerous)', 'SSRIs (serotonin syndrome risk)', 'Alcohol', 'Other dissociatives', 'Stimulants', 'Antihistamines'],
    harmReduction: [
      'Only use products with DXM as the sole active ingredient',
      'Avoid products with acetaminophen, guaifenesin, or other additives',
      'Start with lower doses to assess sensitivity',
      'Do not combine with MAOIs or SSRIs',
      'Be in a safe environment',
      'Have a trip-sitter for higher doses',
      'Stay hydrated',
      'Avoid frequent use due to potential brain damage'
    ],
    legality: 'Legal over-the-counter in most countries. Some jurisdictions have age restrictions or require ID for purchase. Some US states have restricted sales.',
    chemistry: {
      formula: 'C18H25NO',
      molecularWeight: '271.40 g/mol',
      class: 'Morphinan derivative'
    },
    history: 'DXM was developed in the 1950s as a non-addictive alternative to codeine cough suppressants. Recreational use emerged in the 1960s-70s. It remains legal but with increasing restrictions.',
    routes: ['Oral (syrup, capsules, lozenges)'],
    afterEffects: 'Afterglow or hangover depending on dose. Some report lingering dissociation. Depression possible with frequent use.',
    riskLevel: 'moderate',
    aliases: ['dextromethorphan', 'DM']
  },

  // Cannabinoids
  {
    id: 'thc',
    name: 'THC',
    commonNames: ['Delta-9-THC', 'Marijuana', 'Cannabis', 'Weed', 'Pot', 'Dank'],
    category: 'cannabinoids',
    class: 'Cannabinoid',
    description: 'Delta-9-tetrahydrocannabinol (THC) is the primary psychoactive compound in cannabis. It acts primarily as a partial agonist at cannabinoid receptors CB1 and CB2, producing the characteristic effects of cannabis intoxication including euphoria, relaxation, altered perception, and increased appetite. THC has been used for thousands of years for both recreational and medicinal purposes, with modern research validating its efficacy for chronic pain, nausea, and various other conditions.',
    effects: {
      positive: ['Relaxation and stress relief', 'Euphoria and elevated mood', 'Enhanced sensory perception', 'Increased appreciation of music and food', 'Creativity enhancement', 'Pain relief', 'Nausea relief'],
      neutral: ['Altered perception of time', 'Increased appetite ("munchies")', 'Dry mouth', 'Red eyes', 'Slowed reaction time'],
      negative: ['Anxiety and paranoia', 'Impaired memory and cognition', 'Panic attacks in susceptible individuals', 'Coordination impairment', 'Increased heart rate', 'Possible exacerbation of mental health issues', 'Cannabis use disorder']
    },
    dosage: {
      threshold: '1-2.5mg',
      light: '2.5-5mg',
      common: '5-15mg',
      strong: '15-30mg',
      heavy: '30mg+'
    },
    duration: {
      onset: 'Minutes (smoking/vaping), 30-90min (edibles)',
      comeup: '15-30min (smoking), 1-2hrs (edibles)',
      peak: '30-60min (smoking), 2-4hrs (edibles)',
      offset: '1-3 hours (smoking), 4-8 hours (edibles)',
      total: '2-4 hours (smoking), 6-12 hours (edibles)'
    },
    interactions: ['Alcohol', 'Other depressants', 'Stimulants', 'SSRIs', 'Antipsychotics'],
    harmReduction: [
      'Start low and go slow, especially with edibles',
      'Wait at least 2 hours before redosing edibles',
      'Avoid driving while impaired',
      'Be aware that edible effects are stronger and longer-lasting',
      'Choose a safe, comfortable environment',
      'Have snacks and water available',
      'Avoid if you have a personal or family history of psychosis',
      'CBD can help counteract anxiety from too much THC'
    ],
    legality: 'Varies widely. Legal for recreational use in some jurisdictions. Medical use legal in many more. Still federally illegal in the US but legal in many states.',
    chemistry: {
      formula: 'C21H30O2',
      molecularWeight: '314.46 g/mol',
      class: 'Cannabinoid'
    },
    history: 'Cannabis has been used for thousands of years for fiber, medicine, and psychoactive purposes. THC was first isolated in 1964. The plant has a complex legal and cultural history, with prohibition in the 20th century followed by ongoing legalization efforts.',
    routes: ['Inhalation (smoking, vaping)', 'Oral (edibles, tinctures)', 'Sublingual', 'Topical'],
    afterEffects: 'Possible grogginess or residual effects the next day. Some report enhanced mood and relaxation.',
    riskLevel: 'low',
    aliases: ['delta-9-tetrahydrocannabinol', 'tetrahydrocannabinol']
  },

  // Opioids
  {
    id: 'heroin',
    name: 'Heroin',
    commonNames: ['H', 'Dope', 'Smack', 'Junk', 'Horse', 'Brown'],
    category: 'opioids',
    class: 'Opioid',
    description: 'Heroin (diacetylmorphine) is an opioid drug derived from morphine, which comes from the opium poppy. It acts primarily on mu-opioid receptors, producing intense euphoria, pain relief, and sedation. Heroin is highly addictive and carries significant risks of overdose, particularly given its variable purity and presence of adulterants like fentanyl. The opioid epidemic has made heroin and other opioids a major public health crisis.',
    effects: {
      positive: ['Intense euphoria', 'Powerful pain relief', 'Deep relaxation', 'Relief from anxiety and stress', 'Warm sensation throughout body'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Itching', 'Nausea'],
      negative: ['Extreme addiction potential', 'Respiratory depression (overdose risk)', 'Risk of death from overdose', 'Severe withdrawal symptoms', 'Risk of infectious disease from injection', 'Social and financial destruction', 'Cognitive impairment with chronic use']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-60mg',
      heavy: '60mg+'
    },
    duration: {
      onset: 'Seconds (IV), 5-10min (snorted)',
      comeup: '1-5 minutes',
      peak: '15-30 minutes',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Benzodiazepines (extremely dangerous)', 'Alcohol (dangerous)', 'Other opioids', 'Stimulants', 'Antihistamines'],
    harmReduction: [
      'Never use alone - have someone who can call for help',
      'Always have naloxone (Narcan) available',
      'Test substances for fentanyl',
      'Never combine with benzodiazepines or alcohol',
      'Use sterile equipment',
      'Start with small amounts due to variable purity',
      'Consider medication-assisted treatment (methadone, buprenorphine)',
      'Seek help for addiction'
    ],
    legality: 'Illegal in all countries. Schedule I controlled substance with severe penalties for possession, distribution, and manufacture.',
    chemistry: {
      formula: 'C21H23NO5',
      molecularWeight: '369.41 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Heroin was first synthesized in 1874 and was originally marketed as a non-addictive morphine substitute. It was used medicinally before its addictive properties were fully understood. It has been illegal for non-medical use in most countries since the early 20th century.',
    routes: ['Intravenous', 'Insufflation', 'Smoking', 'Intramuscular'],
    afterEffects: 'Severe withdrawal symptoms begin within 6-24 hours and peak at 2-3 days. Post-acute withdrawal can last months.',
    riskLevel: 'very-high',
    aliases: ['diacetylmorphine', 'diamorphine']
  },
  {
    id: 'kratom',
    name: 'Kratom',
    commonNames: ['Mitragyna speciosa', 'Kratom', 'Kray', 'Thang', 'Ketum'],
    category: 'opioids',
    class: 'Opioid-like',
    description: 'Kratom (Mitragyna speciosa) is a tropical tree native to Southeast Asia whose leaves contain psychoactive compounds, primarily mitragynine and 7-hydroxymitragynine. At low doses, kratom has stimulant effects; at higher doses, it has opioid-like effects. It acts on mu, delta, and kappa opioid receptors, though with a different profile than traditional opioids. Kratom has gained popularity as a natural pain reliever and for managing opioid withdrawal, though its safety profile and potential for dependence remain debated.',
    effects: {
      positive: ['Pain relief', 'Energy and focus (low doses)', 'Anxiety relief', 'Mood elevation', 'Opioid withdrawal relief', 'Relaxation (higher doses)'],
      neutral: ['Altered perception', 'Appetite suppression', 'Sweating', 'Itching'],
      negative: ['Nausea and vomiting', 'Constipation', 'Dependence with regular use', 'Withdrawal symptoms', 'Dizziness', 'Respiratory depression at very high doses', 'Potential liver toxicity']
    },
    dosage: {
      threshold: '1-2g',
      light: '2-4g',
      common: '4-8g',
      strong: '8-15g',
      heavy: '15g+'
    },
    duration: {
      onset: '10-20 minutes',
      comeup: '20-40 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Other opioids', 'Benzodiazepines', 'Alcohol', 'Antidepressants', 'Stimulants'],
    harmReduction: [
      'Start with low doses to assess sensitivity',
      'Avoid daily use to prevent dependence',
      'Take breaks to maintain effectiveness',
      'Do not combine with other depressants',
      'Be aware of strain differences (red, white, green)',
      'Stay hydrated',
      'Monitor for signs of dependence',
      'Do not drive while impaired'
    ],
    legality: 'Legal in most US states but regulated in some. Banned in several countries and some US states. FDA has issued warnings but no federal ban.',
    chemistry: {
      formula: 'C22H31NO6 (mitragynine)',
      molecularWeight: '398.49 g/mol',
      class: 'Indole alkaloid'
    },
    history: 'Kratom has been used traditionally in Southeast Asia for centuries as a stimulant for laborers and as a remedy for various ailments. It gained popularity in the West in the 2000s as a natural supplement and opioid alternative.',
    routes: ['Oral (powder, capsules, tea)', 'Chewing fresh leaves'],
    afterEffects: 'Mild afterglow possible. Withdrawal symptoms can occur with regular use.',
    riskLevel: 'moderate',
    aliases: ['mitragynine', 'Mitragyna speciosa']
  }
];

// Helper functions
export function getSubstanceById(id: string): Substance | undefined {
  return substances.find(s => s.id === id);
}

export function getSubstancesByCategory(category: SubstanceCategory): Substance[] {
  return substances.filter(s => s.category === category);
}

export function getCategoryInfo(category: SubstanceCategory): CategoryInfo | undefined {
  return categories.find(c => c.id === category);
}

export function searchSubstances(query: string): Substance[] {
  const lowerQuery = query.toLowerCase();
  return substances.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) ||
    s.commonNames.some(n => n.toLowerCase().includes(lowerQuery)) ||
    s.aliases.some(a => a.toLowerCase().includes(lowerQuery)) ||
    s.description.toLowerCase().includes(lowerQuery)
  );
}

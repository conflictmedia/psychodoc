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
  | 'deliriants'
  | 'nootropics';

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
  },
  {
    id: 'nootropics',
    name: 'Nootropics',
    description: 'Cognitive enhancers that may improve memory, focus, creativity, or other mental functions with low toxicity and minimal side effects.',
    icon: 'Brain',
    color: 'teal'
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
  deliriants: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
  nootropics: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
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
  },

  // ==================== RESEARCH CHEMICALS ====================

  // Hallucinogenic Research Chemicals
  {
    id: '1p-lsd',
    name: '1P-LSD',
    commonNames: ['1-Propionyl-LSD', '1P', 'Legal Acid'],
    category: 'hallucinogens',
    class: 'Lysergamide',
    description: '1P-LSD (1-propionyl-lysergic acid diethylamide) is a semisynthetic psychedelic of the lysergamide class. It is a prodrug that metabolizes into LSD in the body, producing similar effects. 1P-LSD was developed as a legal alternative to LSD and became popular in the research chemical market. The effects are virtually identical to LSD, though some users report a slightly slower onset. Like LSD, it acts primarily as a serotonin receptor agonist, producing profound alterations in perception, thought, and mood.',
    effects: {
      positive: ['Profound psychedelic experiences', 'Enhanced appreciation of music and art', 'Spiritual insights', 'Increased creativity', 'Therapeutic potential', 'Sense of interconnectedness'],
      neutral: ['Visual distortions and hallucinations', 'Altered perception of time', 'Pupil dilation', 'Mild increase in heart rate', 'Changes in thought patterns'],
      negative: ['Anxiety and panic', 'Confusion and disorientation', 'Difficult emotional experiences', 'HPPD risk (rare)', 'Exacerbation of mental health conditions']
    },
    dosage: {
      threshold: '20-30μg',
      light: '30-75μg',
      common: '75-150μg',
      strong: '150-300μg',
      heavy: '300μg+'
    },
    duration: {
      onset: '45-90 minutes',
      comeup: '1-2 hours',
      peak: '3-5 hours',
      offset: '3-5 hours',
      total: '8-12 hours'
    },
    interactions: ['SSRIs (reduce effects)', 'MAOIs', 'Antipsychotics', 'Tramadol', 'Lithium'],
    harmReduction: [
      'Set and setting are crucial',
      'Have a trusted trip-sitter present',
      'Start with a low dose',
      'Avoid if you have a history of psychosis',
      'Do not drive or operate machinery',
      'Wait several days between experiences'
    ],
    legality: 'Controlled in many jurisdictions. Was legal as a research chemical but many countries have now scheduled it.',
    chemistry: {
      formula: 'C23H29N3O2',
      molecularWeight: '379.50 g/mol',
      class: 'Lysergamide'
    },
    history: '1P-LSD appeared on the research chemical market around 2015 as a legal LSD alternative. It was developed to circumvent drug laws, though many countries have since scheduled it.',
    routes: ['Sublingual', 'Oral'],
    afterEffects: 'Similar to LSD afterglow lasting 1-2 days.',
    riskLevel: 'moderate',
    aliases: ['1-propionyl-LSD']
  },
  {
    id: '4-aco-dmt',
    name: '4-AcO-DMT',
    commonNames: ['Psilacetin', 'O-Acetylpsilocin', 'Synthetic Mushrooms'],
    category: 'hallucinogens',
    class: 'Tryptamine',
    description: '4-AcO-DMT (O-acetylpsilocin) is a synthetic psychedelic tryptamine that is structurally similar to psilocin, the active metabolite of psilocybin. It acts as a prodrug, metabolizing into psilocin in the body. The effects are often described as very similar to magic mushrooms, though some users report subtle differences including a more "synthetic" feel. Like psilocin, it acts primarily as a serotonin receptor agonist.',
    effects: {
      positive: ['Profound psychedelic experiences', 'Spiritual insights', 'Emotional processing', 'Enhanced appreciation of nature', 'Therapeutic potential', 'Visual hallucinations'],
      neutral: ['Visual distortions', 'Altered perception of time', 'Body load', 'Pupil dilation', 'Yawning'],
      negative: ['Nausea', 'Anxiety and panic', 'Confusion', 'Headache', 'Exacerbation of mental health conditions']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-35mg',
      strong: '35-50mg',
      heavy: '50mg+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '2-3 hours',
      total: '4-6 hours'
    },
    interactions: ['SSRIs (reduce effects)', 'MAOIs', 'Antipsychotics', 'Tramadol'],
    harmReduction: [
      'Set and setting are crucial',
      'Have a trusted trip-sitter present',
      'Start with a low dose',
      'Avoid if you have a history of psychosis',
      'Do not drive or operate machinery',
      'Stay hydrated'
    ],
    legality: 'Controlled in many jurisdictions. Illegal in the UK, US, and many other countries.',
    chemistry: {
      formula: 'C14H18N2O2',
      molecularWeight: '246.31 g/mol',
      class: 'Tryptamine'
    },
    history: '4-AcO-DMT was first synthesized by Albert Hofmann in 1958 alongside psilocybin. It gained popularity in the research chemical market in the 2010s as a legal alternative to magic mushrooms.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Afterglow lasting 1-2 days.',
    riskLevel: 'moderate',
    aliases: ['psilacetin', 'O-acetylpsilocin']
  },
  {
    id: '5-meo-dmt',
    name: '5-MeO-DMT',
    commonNames: ['Five', 'The God Molecule', 'Bufo'],
    category: 'hallucinogens',
    class: 'Tryptamine',
    description: '5-MeO-DMT (5-methoxy-N,N-dimethyltryptamine) is an extremely potent naturally-occurring psychedelic tryptamine. It is found in several plant species and in the venom of the Colorado River toad (Bufo alvarius). Unlike N,N-DMT, 5-MeO-DMT produces a more "void-like" experience with less visual complexity but profound ego dissolution. The experience is often described as merging with the universe or encountering the divine. It is considered one of the most powerful psychedelics known.',
    effects: {
      positive: ['Profound spiritual experiences', 'Complete ego dissolution', 'Sense of unity with everything', 'Life-changing insights', 'Rapid onset of effects'],
      neutral: ['Intense body sensations', 'Reduced visual complexity compared to DMT', 'Altered perception of time', 'Rapid onset'],
      negative: ['Overwhelming intensity', 'Fear and panic', 'Difficulty integrating experiences', 'Physical discomfort', 'Potential for psychological distress']
    },
    dosage: {
      threshold: '1-3mg',
      light: '3-7mg',
      common: '7-15mg',
      strong: '15-25mg',
      heavy: '25mg+'
    },
    duration: {
      onset: '10-30 seconds',
      comeup: '30-60 seconds',
      peak: '5-20 minutes',
      offset: '15-30 minutes',
      total: '20-45 minutes'
    },
    interactions: ['MAOIs (dangerous)', 'SSRIs', 'Antipsychotics', 'Tramadol'],
    harmReduction: [
      'Always have an experienced sitter present',
      'Use an accurate scale - doses are tiny',
      'Be in a safe, comfortable environment',
      'Be prepared for overwhelming intensity',
      'Avoid if you have heart conditions',
      'Allow time for integration after experience',
      'Do not stand or move during experience'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance in the US. Some jurisdictions have religious exemptions.',
    chemistry: {
      formula: 'C13H18N2O',
      molecularWeight: '218.30 g/mol',
      class: 'Tryptamine'
    },
    history: '5-MeO-DMT has been used traditionally in South American shamanic practices. It gained Western attention through the work of researchers like Alexander Shulgin and more recently through the Church of the Tree of Life.',
    routes: ['Vaporization/inhalation', 'Insufflation', 'Oral (with MAOI)'],
    afterEffects: 'Rapid return to baseline. Many report lasting positive changes in perspective.',
    riskLevel: 'high',
    aliases: ['5-methoxy-N,N-dimethyltryptamine', 'O-methyl-bufotenin']
  },
  {
    id: '2c-b',
    name: '2C-B',
    commonNames: ['Bees', 'Nexus', 'Bromo', 'Venus', 'Erox'],
    category: 'hallucinogens',
    class: 'Phenethylamine',
    description: '2C-B (2,5-dimethoxy-4-bromophenethylamine) is a synthetic psychedelic of the 2C family, first synthesized by Alexander Shulgin in 1974. It produces a unique combination of psychedelic and empathogenic effects, often described as a cross between LSD and MDMA. 2C-B is known for its colorful visual effects, enhanced tactile sensitivity, and relatively gentle headspace compared to other psychedelics. It was briefly sold commercially as an aphrodisiac under the name "Eros" before being banned.',
    effects: {
      positive: ['Enhanced appreciation of music and art', 'Increased empathy and emotional openness', 'Colorful visual effects', 'Enhanced tactile sensation', 'Mild euphoria', 'Relatively clear headspace'],
      neutral: ['Visual distortions', 'Altered perception of time', 'Body load', 'Pupil dilation', 'Increased heart rate'],
      negative: ['Nausea during come-up', 'Anxiety and paranoia', 'Confusion at higher doses', 'Potential for overwhelming experiences', 'Exacerbation of mental health conditions']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-15mg',
      common: '15-25mg',
      strong: '25-35mg',
      heavy: '35mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '2-3 hours',
      total: '4-8 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Antipsychotics', 'Other stimulants', 'Alcohol'],
    harmReduction: [
      'Set and setting are important',
      'Have a trusted sitter present',
      'Start with a low dose to assess sensitivity',
      'Avoid combining with other substances',
      'Stay hydrated but do not over-hydrate',
      'Do not drive or operate machinery'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance in the US and many other jurisdictions.',
    chemistry: {
      formula: 'C10H14BrNO2',
      molecularWeight: '260.13 g/mol',
      class: 'Phenethylamine (2C family)'
    },
    history: '2C-B was first synthesized by Alexander Shulgin in 1974. It was briefly marketed as an aphrodisiac before being scheduled in the 1990s. It became popular in the rave and club scene.',
    routes: ['Oral', 'Insufflation (painful)'],
    afterEffects: 'Mild afterglow possible. Some report fatigue the next day.',
    riskLevel: 'moderate',
    aliases: ['2,5-dimethoxy-4-bromophenethylamine']
  },

  // Dissociative Research Chemicals
  {
    id: '3-meo-pcp',
    name: '3-MeO-PCP',
    commonNames: ['Mxe\'s Cousin', '3-Methoxyphencyclidine', 'Moxie'],
    category: 'dissociatives',
    class: 'Arylcyclohexylamine',
    description: '3-MeO-PCP (3-methoxyphencyclidine) is a dissociative anesthetic of the arylcyclohexylamine class, structurally related to PCP and ketamine. It is known for producing long-lasting dissociative effects with pronounced mania and stimulation compared to other dissociatives. 3-MeO-PCP acts primarily as an NMDA receptor antagonist. Unlike ketamine, it has significant dopamine reuptake inhibition properties, contributing to its more stimulating character. The substance is known for its long duration and unpredictable potency.',
    effects: {
      positive: ['Intense dissociation', 'Euphoria and mania', 'Enhanced appreciation of music', 'Out-of-body experiences', 'Stimulation and energy'],
      neutral: ['Numbness', 'Altered perception of body and space', 'Changes in thought patterns', 'Motor incoordination'],
      negative: ['Mania and grandiose thinking', 'Confusion and disorientation', 'Memory impairment', 'Risk of psychotic episodes', 'Urinary retention', 'Long duration can be exhausting']
    },
    dosage: {
      threshold: '3-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-30mg',
      heavy: '30mg+'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '1-2 hours',
      peak: '3-5 hours',
      offset: '6-12 hours',
      total: '8-18 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other dissociatives', 'Stimulants', 'Antidepressants'],
    harmReduction: [
      'Use an accurate milligram scale - active doses are very small',
      'Have a sitter present',
      'Be in a safe environment',
      'Avoid combining with other substances',
      'Be aware of the long duration',
      'Do not redose - wait for full effects',
      'Avoid if you have mental health conditions'
    ],
    legality: 'Controlled in many jurisdictions. Illegal in the UK, Germany, and several US states.',
    chemistry: {
      formula: 'C17H25NO',
      molecularWeight: '259.39 g/mol',
      class: 'Arylcyclohexylamine'
    },
    history: '3-MeO-PCP was first synthesized in the 1970s but remained obscure until appearing on the research chemical market around 2010.',
    routes: ['Oral', 'Insufflation', 'Sublingual'],
    afterEffects: 'Long afterglow or hangover possible. Can affect mood for days.',
    riskLevel: 'high',
    aliases: ['3-methoxyphencyclidine']
  },
  {
    id: '2-fdck',
    name: '2-FDCK',
    commonNames: ['2-Fluorodeschloroketamine', '2-FK', 'Fluoroketamine'],
    category: 'dissociatives',
    class: 'Arylcyclohexylamine',
    description: '2-FDCK (2-fluorodeschloroketamine) is a dissociative anesthetic structurally related to ketamine, with a fluorine atom substituted for the chlorine atom. It produces effects similar to ketamine but with a longer duration and slightly different character. Like ketamine, it acts primarily as an NMDA receptor antagonist. The fluorine substitution makes the compound more stable, leading to slower metabolism and extended effects.',
    effects: {
      positive: ['Dissociative effects', 'Euphoria', 'Antidepressant potential', 'Pain relief', 'Out-of-body experiences at higher doses'],
      neutral: ['Numbness', 'Altered perception', 'Motor incoordination', 'Changes in thought patterns'],
      negative: ['Nausea', 'Confusion', 'Bladder irritation with chronic use', 'Memory impairment', 'Disorientation']
    },
    dosage: {
      threshold: '10-20mg',
      light: '20-40mg',
      common: '40-80mg',
      strong: '80-150mg',
      heavy: '150mg+'
    },
    duration: {
      onset: '5-15 minutes (insufflated)',
      comeup: '15-30 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '3-6 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other dissociatives', 'Depressants'],
    harmReduction: [
      'Have a sitter present',
      'Be in a safe environment',
      'Avoid combining with depressants',
      'Use sterile equipment',
      'Stay hydrated',
      'Avoid chronic use due to bladder risks'
    ],
    legality: 'Not explicitly controlled in many jurisdictions but may fall under analogue acts.',
    chemistry: {
      formula: 'C13H16FNO',
      molecularWeight: '221.27 g/mol',
      class: 'Arylcyclohexylamine'
    },
    history: '2-FDCK appeared on the research chemical market as a ketamine alternative, gaining popularity in the 2010s.',
    routes: ['Insufflation', 'Oral', 'Intramuscular'],
    afterEffects: 'Afterglow or grogginess possible.',
    riskLevel: 'moderate',
    aliases: ['2-fluorodeschloroketamine', '2-FK']
  },

  // Stimulant Research Chemicals
  {
    id: '3-mmc',
    name: '3-MMC',
    commonNames: ['3-Methylmethcathinone', 'Mephedrone Alternative', '3-M'],
    category: 'stimulants',
    class: 'Cathinone',
    description: '3-MMC (3-methylmethcathinone) is a synthetic stimulant of the cathinone class, structurally similar to mephedrone (4-MMC). It produces stimulating and mildly empathogenic effects, often described as a less intense version of mephedrone. 3-MMC acts as a releasing agent for serotonin, dopamine, and norepinephrine. It gained popularity after mephedrone was banned, becoming one of the most commonly used "legal highs" in Europe before being scheduled in many countries.',
    effects: {
      positive: ['Increased energy and alertness', 'Mild euphoria', 'Enhanced sociability', 'Increased empathy', 'Enhanced appreciation of music'],
      neutral: ['Increased heart rate and blood pressure', 'Dilated pupils', 'Suppressed appetite', 'Increased body temperature'],
      negative: ['Anxiety and paranoia', 'Insomnia', 'Dehydration', 'Jaw clenching', 'Comedown symptoms', 'Potential for compulsive redosing', 'Cardiovascular strain']
    },
    dosage: {
      threshold: '30-50mg',
      light: '50-100mg',
      common: '100-200mg',
      strong: '200-300mg',
      heavy: '300mg+'
    },
    duration: {
      onset: '15-30 minutes',
      comeup: '30-45 minutes',
      peak: '1-2 hours',
      offset: '2-3 hours',
      total: '3-5 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Other stimulants', 'Alcohol', 'Tramadol'],
    harmReduction: [
      'Start with low doses to assess tolerance',
      'Stay hydrated but do not over-hydrate',
      'Avoid redosing to prevent binge patterns',
      'Do not combine with other stimulants',
      'Test substances for purity',
      'Allow time between sessions for recovery',
      'Avoid if you have heart conditions'
    ],
    legality: 'Controlled in many countries. Illegal in the UK, EU, and many other jurisdictions.',
    chemistry: {
      formula: 'C11H15NO',
      molecularWeight: '177.24 g/mol',
      class: 'Cathinone'
    },
    history: '3-MMC gained popularity after mephedrone was banned in 2010. It became one of the most prevalent research chemicals in Europe until widespread scheduling.',
    routes: ['Oral', 'Insufflation', 'Rectal'],
    afterEffects: 'Comedown lasting hours to days. Depression and fatigue possible.',
    riskLevel: 'high',
    aliases: ['3-methylmethcathinone']
  },
  {
    id: '4-mmc',
    name: '4-MMC (Mephedrone)',
    commonNames: ['Mephedrone', 'M-Cat', 'Meow Meow', 'Drone', 'Miaow'],
    category: 'stimulants',
    class: 'Cathinone',
    description: '4-MMC (mephedrone, 4-methylmethcathinone) is a synthetic stimulant of the cathinone class, chemically similar to MDMA and amphetamines. It produces powerful stimulant and empathogenic effects, often described as a cross between MDMA and cocaine. Mephedrone acts as a releasing agent for serotonin, dopamine, and norepinephrine. It became extremely popular in the late 2000s as a "legal high" before being banned across most jurisdictions. Known for its intense euphoria but also significant addiction potential.',
    effects: {
      positive: ['Intense euphoria', 'Increased energy and alertness', 'Strong empathy and sociability', 'Enhanced appreciation of music', 'Increased confidence'],
      neutral: ['Increased heart rate and blood pressure', 'Dilated pupils', 'Suppressed appetite', 'Increased body temperature', 'Jaw clenching'],
      negative: ['High addiction potential', 'Severe comedown', 'Anxiety and paranoia', 'Cardiovascular strain', 'Insomnia', 'Nose damage from insufflation', 'Potential for compulsive redosing']
    },
    dosage: {
      threshold: '25-50mg',
      light: '50-100mg',
      common: '100-200mg',
      strong: '200-300mg',
      heavy: '300mg+'
    },
    duration: {
      onset: '10-20 minutes (insufflated)',
      comeup: '15-30 minutes',
      peak: '1-2 hours',
      offset: '1-2 hours',
      total: '2-4 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Other stimulants', 'Alcohol', 'Tramadol', 'Cocaine'],
    harmReduction: [
      'Never use alone - have someone present',
      'Avoid redosing to prevent addiction patterns',
      'Stay hydrated but do not over-hydrate',
      'Test substances for purity',
      'Do not combine with other stimulants',
      'Avoid insufflation to protect nasal tissue',
      'Wait between sessions to reduce tolerance'
    ],
    legality: 'Illegal in most countries. Schedule I controlled substance in the US. Class B drug in the UK.',
    chemistry: {
      formula: 'C11H15NO',
      molecularWeight: '177.24 g/mol',
      class: 'Cathinone'
    },
    history: 'Mephedrone was first synthesized in 1929 but remained obscure until reappearing in the 2000s. It became one of the most popular "legal highs" before being banned in the UK in 2010 and subsequently worldwide.',
    routes: ['Oral', 'Insufflation', 'Rectal'],
    afterEffects: 'Severe comedown lasting 1-3 days. Depression, fatigue, and cravings common.',
    riskLevel: 'very-high',
    aliases: ['4-methylmethcathinone', 'mephedrone']
  },

  // Depressant Research Chemicals  
  {
    id: 'ghb',
    name: 'GHB',
    commonNames: ['G', 'Liquid E', 'Fantasy', 'Georgia Home Boy', 'Gamma Hydroxybutyrate'],
    category: 'depressants',
    class: 'GABA Metabolite',
    description: 'GHB (gamma-hydroxybutyric acid) is a naturally occurring neurotransmitter and psychoactive drug. It acts on GHB receptors and GABA-B receptors, producing euphoria, increased sociability, and relaxation at low doses, and sedation and unconsciousness at higher doses. GHB has legitimate medical uses for narcolepsy and alcohol dependence. It has a narrow therapeutic window, making overdose relatively easy. GHB has gained notoriety as a "date rape drug" due to its ability to cause unconsciousness and amnesia.',
    effects: {
      positive: ['Euphoria at low doses', 'Increased sociability', 'Relaxation', 'Enhanced tactile sensitivity', 'Increased libido', 'Sleep improvement'],
      neutral: ['Drowsiness', 'Reduced inhibitions', 'Altered perception', 'Dizziness'],
      negative: ['Narrow dose-response window', 'Unconsciousness at higher doses', 'Nausea and vomiting', 'Respiratory depression', 'Amnesia', 'Risk of overdose', 'Dangerous interactions with alcohol', 'Potential for abuse']
    },
    dosage: {
      threshold: '0.5-1g',
      light: '1-1.5g',
      common: '1.5-2.5g',
      strong: '2.5-3.5g',
      heavy: '3.5g+'
    },
    duration: {
      onset: '10-20 minutes',
      comeup: '20-40 minutes',
      peak: '1-2 hours',
      offset: '1-2 hours',
      total: '2-4 hours'
    },
    interactions: ['Alcohol (extremely dangerous)', 'Benzodiazepines (dangerous)', 'Opioids', 'Other depressants', 'Ketamine'],
    harmReduction: [
      'NEVER combine with alcohol - can be fatal',
      'Measure doses carefully with accurate measuring device',
      'Start with low doses - individual sensitivity varies greatly',
      'Never accept GHB from strangers',
      'Have someone you trust present',
      'Do not drive while under the influence',
      'Be aware that effects can come on suddenly'
    ],
    legality: 'Controlled in most countries. Schedule I in the US, though Xyrem (prescription GHB) is Schedule III for narcolepsy treatment.',
    chemistry: {
      formula: 'C4H8O3',
      molecularWeight: '104.10 g/mol',
      class: 'Fatty acid derivative'
    },
    history: 'GHB was first synthesized in 1874. It was used as an anesthetic and later as a bodybuilding supplement before being scheduled due to abuse potential and use in sexual assault.',
    routes: ['Oral (liquid)', 'Oral (capsules)'],
    afterEffects: 'Grogginess. Unexpected sleep episodes possible.',
    riskLevel: 'high',
    aliases: ['gamma-hydroxybutyric acid', 'sodium oxybate']
  },
  {
    id: 'etizolam',
    name: 'Etizolam',
    commonNames: ['Etiz', 'Etilaam', 'Etizest', 'Depas'],
    category: 'depressants',
    class: 'Thienodiazepine',
    description: 'Etizolam is a thienodiazepine derivative, chemically related to benzodiazepines but with a thiophene ring instead of a benzene ring. It produces anxiolytic, hypnotic, and muscle relaxant effects similar to traditional benzodiazepines. Etizolam is notably more potent than diazepam (Valium) and has a shorter duration of action. It is medically prescribed in some countries for anxiety and insomnia but has become popular as a research chemical and recreational substance in regions where it is not controlled.',
    effects: {
      positive: ['Anxiety relief', 'Sleep induction', 'Muscle relaxation', 'Calming effects', 'Panic attack relief'],
      neutral: ['Sedation', 'Impaired coordination', 'Memory impairment', 'Slurred speech'],
      negative: ['High dependence potential', 'Severe withdrawal symptoms', 'Risk of overdose with other depressants', 'Memory problems', 'Respiratory depression', 'Paradoxical reactions in some users']
    },
    dosage: {
      threshold: '0.25-0.5mg',
      light: '0.5-1mg',
      common: '1-2mg',
      strong: '2-4mg',
      heavy: '4mg+'
    },
    duration: {
      onset: '15-30 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '3-5 hours',
      total: '4-8 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Opioids (dangerous)', 'Other benzodiazepines', 'Barbiturates', 'GHB', 'Ketamine'],
    harmReduction: [
      'Never combine with alcohol or opioids',
      'Use the lowest effective dose',
      'Do not use daily to avoid dependence',
      'Taper off gradually - never stop abruptly',
      'Do not drive while under the influence',
      'Be aware of amnesiac effects',
      'Store safely to prevent accidental ingestion'
    ],
    legality: 'Controlled substance in many jurisdictions. Prescription-only in some countries. Schedule IV in the US (as of 2022).',
    chemistry: {
      formula: 'C17H15ClN4S',
      molecularWeight: '342.85 g/mol',
      class: 'Thienodiazepine'
    },
    history: 'Etizolam was developed in Japan and has been marketed there and in India for anxiety and sleep disorders. It gained popularity as a research chemical in the West.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Sedation can persist into the next day ("hangover effect").',
    riskLevel: 'high',
    aliases: ['4-(2-chlorophenyl)-2-ethyl-9-methyl-6H-thieno[3,2-f][1,2,4]triazolo[4,3-a][1,4]diazepine']
  },

  // Empathogen Research Chemicals
  {
    id: '6-apb',
    name: '6-APB',
    commonNames: ['Benzofury', '6-(2-aminopropyl)benzofuran', 'Benzo Fury'],
    category: 'empathogens',
    class: 'Benzofuran',
    description: '6-APB (6-(2-aminopropyl)benzofuran) is an empathogenic stimulant of the benzofuran class. It is structurally related to MDA and produces similar entactogenic effects, though typically with a longer duration. 6-APB acts as a releasing agent for serotonin, dopamine, and norepinephrine, and also has some receptor agonist activity. It gained popularity as a "legal alternative" to MDMA before being scheduled in many jurisdictions.',
    effects: {
      positive: ['Increased empathy and emotional openness', 'Enhanced appreciation of music', 'Mild euphoria', 'Increased sociability', 'Relaxing body high'],
      neutral: ['Increased heart rate', 'Mild stimulation', 'Dilated pupils', 'Jaw clenching', 'Suppressed appetite'],
      negative: ['Nausea', 'Long duration can be exhausting', 'Anxiety at higher doses', 'Insomnia', 'Comedown symptoms', 'Dehydration']
    },
    dosage: {
      threshold: '30-50mg',
      light: '50-80mg',
      common: '80-120mg',
      strong: '120-180mg',
      heavy: '180mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '30-60 minutes',
      peak: '3-5 hours',
      offset: '3-5 hours',
      total: '6-10 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Other stimulants', 'Alcohol', 'Tramadol'],
    harmReduction: [
      'Start with a low dose to assess sensitivity',
      'Stay hydrated but do not over-hydrate',
      'Be prepared for the long duration',
      'Avoid redosing due to long half-life',
      'Test substances for purity',
      'Do not combine with other stimulants',
      'Have trusted friends present'
    ],
    legality: 'Controlled in many jurisdictions. Illegal in the UK, several EU countries, and China.',
    chemistry: {
      formula: 'C11H13NO',
      molecularWeight: '175.23 g/mol',
      class: 'Benzofuran'
    },
    history: '6-APB was first synthesized in 1993 by David Nichols but wasn\'t marketed until appearing as a "legal high" around 2010.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Comedown lasting 1-2 days possible. Fatigue from long duration.',
    riskLevel: 'moderate',
    aliases: ['6-(2-aminopropyl)benzofuran', 'benzofury']
  },

  // Additional Common Substances
  {
    id: 'nitrous-oxide',
    name: 'Nitrous Oxide',
    commonNames: ['N2O', 'Laughing Gas', 'Whippets', 'Nos', 'Nangs'],
    category: 'dissociatives',
    class: 'NMDA Antagonist',
    description: 'Nitrous oxide (N2O) is a colorless, non-flammable gas with a slightly sweet odor and taste. It has legitimate medical uses as an anesthetic and analgesic, and is also used as a propellant in whipped cream canisters. When inhaled, nitrous oxide produces rapid-onset dissociative effects, euphoria, and laughter. The effects are extremely short-lived, lasting only 1-5 minutes. Chronic use can lead to vitamin B12 deficiency and neurological damage.',
    effects: {
      positive: ['Rapid euphoria', 'Laughter and giggling', 'Dissociative effects', 'Pain relief', 'Short duration'],
      neutral: ['Dissociation', 'Altered perception', 'Dizziness', 'Slurred speech'],
      negative: ['Vitamin B12 depletion with chronic use', 'Risk of falls or accidents', 'Potential for hypoxia', 'Nerve damage with heavy use', 'Headache', 'Nausea']
    },
    dosage: {
      threshold: '1-2 inhalations',
      light: '2-4 inhalations',
      common: '4-8 inhalations',
      strong: '8-15 inhalations',
      heavy: '15+ inhalations'
    },
    duration: {
      onset: '5-15 seconds',
      comeup: '10-30 seconds',
      peak: '30-60 seconds',
      offset: '1-2 minutes',
      total: '1-5 minutes'
    },
    interactions: ['Other depressants', 'Stimulants', 'Ketamine'],
    harmReduction: [
      'Never use without adequate oxygen - breathe air between doses',
      'Never put a bag over your head',
      'Use while seated to prevent falls',
      'Take B12 supplements with regular use',
      'Avoid chronic heavy use to prevent nerve damage',
      'Do not drive while under the influence',
      'Use balloons or proper equipment - never direct from canister'
    ],
    legality: 'Legal for food and medical use. Recreational use is illegal in some jurisdictions. Many places have restricted sales of whipped cream chargers.',
    chemistry: {
      formula: 'N2O',
      molecularWeight: '44.01 g/mol',
      class: 'Inorganic gas'
    },
    history: 'Nitrous oxide was discovered in 1772. Its anesthetic properties were recognized in the 1840s. Recreational use became popular in the 18th century and continues today.',
    routes: ['Inhalation'],
    afterEffects: 'Brief headache possible. Generally quick return to baseline.',
    riskLevel: 'low',
    aliases: ['dinitrogen monoxide', 'laughing gas']
  },
  {
    id: 'salvia',
    name: 'Salvia divinorum',
    commonNames: ['Salvia', 'Diviner\'s Sage', 'Sally D', 'Maria Pastora', 'Magic Mint'],
    category: 'hallucinogens',
    class: 'Diterpenoid',
    description: 'Salvia divinorum is a psychoactive plant native to the Sierra Mazateca region of Oaxaca, Mexico. Its active compound, salvinorin A, is the most potent naturally occurring psychedelic known, active at microgram doses. Unlike classic psychedelics, salvinorin A is a kappa opioid receptor agonist rather than a serotonin receptor agonist. This produces a unique and often disorienting experience characterized by complete dissolution of reality, encounters with entities, and travel to alternate dimensions. The Mazatec people have used salvia for centuries in spiritual divination ceremonies.',
    effects: {
      positive: ['Profound spiritual experiences', 'Complete reality dissolution', 'Entity encounters', 'Alternate dimension experiences', 'Rapid return to baseline'],
      neutral: ['Dissociation', 'Altered perception of reality', 'Uncontrollable laughter', 'Loss of motor control'],
      negative: ['Overwhelming intensity', 'Dysphoria and fear', 'Confusion', 'Loss of awareness of surroundings', 'Risk of injury from movement', 'Difficulty integrating experiences']
    },
    dosage: {
      threshold: '0.1-0.3mg salvinorin A',
      light: '0.3-0.5mg',
      common: '0.5-1mg',
      strong: '1-2mg',
      heavy: '2mg+'
    },
    duration: {
      onset: '30-60 seconds (smoked)',
      comeup: '1-2 minutes',
      peak: '5-15 minutes',
      offset: '15-30 minutes',
      total: '20-45 minutes'
    },
    interactions: ['Other psychedelics', 'Cannabis', 'Dissociatives'],
    harmReduction: [
      'Always have a sitter present - you may lose awareness of your surroundings',
      'Be in a safe, seated position before beginning',
      'Start with very low doses',
      'Be prepared for complete reality dissolution',
      'Use in a quiet, safe environment',
      'Allow time for integration',
      'Avoid combining with other substances'
    ],
    legality: 'Legal in some jurisdictions, controlled in others. Many US states have scheduled it. Legal in most of Europe.',
    chemistry: {
      formula: 'C23H28O8 (salvinorin A)',
      molecularWeight: '432.46 g/mol',
      class: 'Diterpenoid'
    },
    history: 'Salvia has been used by Mazatec shamans for centuries in divination and healing ceremonies. Western awareness began in the 1930s, with salvinorin A isolated in 1982.',
    routes: ['Smoking (dried leaves or extract)', 'Sublingual (fresh leaves)', 'Quid (chewed leaves)'],
    afterEffects: 'Rapid return to baseline. Some report lingering introspection.',
    riskLevel: 'high',
    aliases: ['salvinorin A', 'Diviner\'s sage']
  },

  // ============================================
  // OPIOIDS
  // ============================================
  {
    id: 'morphine',
    name: 'Morphine',
    commonNames: ['MS Contin', 'Kadian', 'Avinza', 'Roxanol'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Morphine is a potent opiate analgesic drug derived from the opium poppy plant. It acts directly on the central nervous system to relieve pain and is considered the gold standard for opioid analgesics. Morphine works primarily by binding to and activating the μ-opioid receptor in the brain, spinal cord, and gastrointestinal tract. It has a long history of medical use and remains one of the most effective pain medications available.',
    effects: {
      positive: ['Powerful pain relief', 'Euphoria and sense of well-being', 'Relaxation and calmness', 'Relief from anxiety', 'Cough suppression'],
      neutral: ['Sedation and drowsiness', 'Pupil constriction (miosis)', 'Constipation', 'Itching', 'Dry mouth'],
      negative: ['Respiratory depression', 'Nausea and vomiting', 'High addiction potential', 'Tolerance development', 'Overdose risk', 'Withdrawal symptoms']
    },
    dosage: {
      threshold: '5-10mg (oral)',
      light: '10-20mg (oral)',
      common: '20-50mg (oral)',
      strong: '50-100mg (oral)',
      heavy: '100mg+ (oral)'
    },
    duration: {
      onset: '20-40 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Benzodiazepines (dangerous)', 'Alcohol (dangerous)', 'Other opioids', 'MAOIs', 'Anticholinergics', 'Muscle relaxants'],
    harmReduction: [
      'Never use alone - have naloxone available',
      'Start with the lowest effective dose',
      'Never mix with benzodiazepines or alcohol',
      'Be aware of tolerance changes after periods of abstinence',
      'Use sterile equipment if injecting',
      'Do not crush or dissolve extended-release formulations',
      'Seek help if experiencing breathing problems'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US. Strictly controlled internationally.',
    chemistry: {
      formula: 'C17H19NO3',
      molecularWeight: '285.34 g/mol',
      class: 'Phenanthrene opioid'
    },
    history: 'Morphine was first isolated from opium in 1804 by Friedrich Sertürner. It was named after Morpheus, the Greek god of dreams. It became widely used during the American Civil War and has been a cornerstone of pain management since.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Rectal', 'Epidural'],
    afterEffects: 'Sedation and constipation can persist. Withdrawal symptoms begin 6-12 hours after last dose and peak at 48-72 hours.',
    riskLevel: 'high',
    aliases: ['morphium', 'morpha', 'MSIR']
  },
  {
    id: 'codeine',
    name: 'Codeine',
    commonNames: ['Tylenol #3', 'Promethazine with Codeine', 'Lean', 'Sizzurp', 'Purple Drank'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Codeine is a naturally occurring opiate and prodrug of morphine, found in the opium poppy. It is metabolized to morphine in the liver by the enzyme CYP2D6. Codeine is considered a weak opioid compared to morphine and is commonly prescribed for mild to moderate pain and as a cough suppressant. Approximately 10% of the population are poor metabolizers who get little effect from codeine.',
    effects: {
      positive: ['Mild pain relief', 'Cough suppression', 'Mild euphoria', 'Relaxation', 'Sleepiness'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Itching', 'Dry mouth'],
      negative: ['Nausea and vomiting', 'Respiratory depression at high doses', 'Addiction potential', 'Tolerance development', 'Withdrawal symptoms']
    },
    dosage: {
      threshold: '15-30mg',
      light: '30-60mg',
      common: '60-120mg',
      strong: '120-200mg',
      heavy: '200mg+'
    },
    duration: {
      onset: '20-40 minutes (oral)',
      comeup: '40-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other opioids', 'MAOIs', 'CYP2D6 inhibitors', 'CYP2D6 inducers'],
    harmReduction: [
      'Do not exceed recommended doses',
      'Avoid mixing with alcohol or other depressants',
      'Be aware of individual metabolism differences',
      'Do not use for long periods to avoid dependence',
      'Have naloxone available for overdose reversal',
      'Do not breastfeed while taking codeine'
    ],
    legality: 'Prescription only in most countries. Schedule II-V depending on formulation. Available over-the-counter in some countries in low doses.',
    chemistry: {
      formula: 'C18H21NO3',
      molecularWeight: '299.36 g/mol',
      class: 'Phenanthrene opioid'
    },
    history: 'Codeine was first isolated in 1832 by Pierre Robiquet. It has been used medically for over 150 years and remains one of the most commonly prescribed opioids worldwide.',
    routes: ['Oral', 'Intramuscular', 'Subcutaneous', 'Rectal'],
    afterEffects: 'Constipation and drowsiness. Withdrawal symptoms similar to other opioids but generally milder.',
    riskLevel: 'moderate',
    aliases: ['methylmorphine', '3-methylmorphine']
  },
  {
    id: 'oxycodone',
    name: 'Oxycodone',
    commonNames: ['OxyContin', 'Percocet', 'Roxicodone', 'Oxy', 'Hillbilly Heroin'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Oxycodone is a semi-synthetic opioid derived from thebaine, an alkaloid found in the opium poppy. It is a potent analgesic used for moderate to severe pain. Oxycodone acts on the central nervous system through μ-opioid receptor agonism and has become one of the most prescribed and abused opioids, playing a significant role in the opioid epidemic.',
    effects: {
      positive: ['Strong pain relief', 'Euphoria', 'Relaxation', 'Anxiety relief', 'Sense of well-being'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Itching', 'Dry mouth', 'Sweating'],
      negative: ['Respiratory depression', 'Nausea and vomiting', 'High addiction potential', 'Overdose risk', 'Withdrawal symptoms', 'Hormonal imbalances with chronic use']
    },
    dosage: {
      threshold: '5-10mg (oral)',
      light: '10-20mg (oral)',
      common: '20-40mg (oral)',
      strong: '40-80mg (oral)',
      heavy: '80mg+ (oral)'
    },
    duration: {
      onset: '10-30 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours (immediate release)'
    },
    interactions: ['Alcohol (dangerous)', 'Benzodiazepines (dangerous)', 'Other opioids', 'MAOIs', 'Anticholinergics', 'CNS depressants'],
    harmReduction: [
      'Never use alone - have naloxone available',
      'Do not crush or snort extended-release tablets',
      'Start with low doses if opioid-naive',
      'Never mix with benzodiazepines or alcohol',
      'Be aware that tolerance decreases quickly with abstinence',
      'Do not share prescriptions with others',
      'Seek treatment if struggling with dependence'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US. Strictly controlled internationally.',
    chemistry: {
      formula: 'C18H21NO4',
      molecularWeight: '315.36 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Oxycodone was first developed in 1916 in Germany. OxyContin, an extended-release formulation, was introduced in 1996 and became a major factor in the opioid crisis due to aggressive marketing and widespread diversion.',
    routes: ['Oral', 'Intranasal', 'Intravenous', 'Rectal'],
    afterEffects: 'Sedation and constipation. Withdrawal begins within 6-12 hours and can last a week or more.',
    riskLevel: 'high',
    aliases: ['dihydrohydroxycodeinone', 'oxicon']
  },
  {
    id: 'hydrocodone',
    name: 'Hydrocodone',
    commonNames: ['Vicodin', 'Norco', 'Lortab', 'Hydros', 'Vikes'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Hydrocodone is a semi-synthetic opioid derived from codeine. It is used to treat moderate to severe pain and is often combined with acetaminophen or ibuprofen. Hydrocodone is metabolized to hydromorphone and acts primarily on μ-opioid receptors. It was the most prescribed opioid in the United States for many years.',
    effects: {
      positive: ['Pain relief', 'Euphoria', 'Relaxation', 'Cough suppression', 'Anxiety reduction'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Itching', 'Dizziness'],
      negative: ['Respiratory depression', 'Nausea and vomiting', 'Addiction potential', 'Liver damage from acetaminophen combo', 'Overdose risk']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-15mg',
      common: '15-30mg',
      strong: '30-50mg',
      heavy: '50mg+'
    },
    duration: {
      onset: '20-40 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other opioids', 'MAOIs', 'Acetaminophen overdose risk', 'CNS depressants'],
    harmReduction: [
      'Be aware of acetaminophen content in combination products',
      'Never exceed 4g acetaminophen per day',
      'Have naloxone available',
      'Avoid mixing with other depressants',
      'Do not crush extended-release formulations',
      'Seek help for dependence'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US.',
    chemistry: {
      formula: 'C18H21NO3',
      molecularWeight: '299.36 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Hydrocodone was first synthesized in Germany in 1920. It became widely prescribed in the US and was the most prescribed medication in the country for several years.',
    routes: ['Oral'],
    afterEffects: 'Constipation, drowsiness. Withdrawal similar to other opioids.',
    riskLevel: 'high',
    aliases: ['dihydrocodeinone', 'hydrocon']
  },
  {
    id: 'hydromorphone',
    name: 'Hydromorphone',
    commonNames: ['Dilaudid', 'Exalgo', 'Palladone', 'Dilles', 'Dust'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Hydromorphone is a potent semi-synthetic opioid derived from morphine. It is approximately 5-7 times more potent than morphine and is used for moderate to severe pain. Hydromorphone acts as a μ-opioid receptor agonist and is known for its rapid onset and relatively short duration of action.',
    effects: {
      positive: ['Very potent pain relief', 'Intense euphoria', 'Strong relaxation', 'Rapid onset'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Itching', 'Sweating'],
      negative: ['Respiratory depression', 'High overdose risk', 'Severe addiction potential', 'Nausea and vomiting', 'Withdrawal symptoms']
    },
    dosage: {
      threshold: '1-2mg (oral)',
      light: '2-4mg (oral)',
      common: '4-8mg (oral)',
      strong: '8-16mg (oral)',
      heavy: '16mg+ (oral)'
    },
    duration: {
      onset: '15-30 minutes (oral)',
      comeup: '30-45 minutes',
      peak: '1-2 hours',
      offset: '2-3 hours',
      total: '3-4 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other opioids', 'MAOIs', 'CNS depressants'],
    harmReduction: [
      'Extremely potent - start with very low doses',
      'Always have naloxone available',
      'Never mix with other depressants',
      'High overdose risk - use extreme caution',
      'Be aware of potency differences from other opioids',
      'Use sterile equipment if injecting'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US.',
    chemistry: {
      formula: 'C17H19NO3',
      molecularWeight: '285.34 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Hydromorphone was first synthesized in Germany in 1924. It has been used medically since the 1920s and remains an important analgesic for severe pain.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Rectal'],
    afterEffects: 'Rapid return to baseline but with high craving potential. Withdrawal can be intense.',
    riskLevel: 'very-high',
    aliases: ['dihydromorphinone']
  },
  {
    id: 'oxymorphone',
    name: 'Oxymorphone',
    commonNames: ['Opana', 'Numorphan', 'Omo', 'Blue Heaven'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Oxymorphone is a potent semi-synthetic opioid analgesic derived from thebaine. It is approximately 10 times more potent than morphine and is used for moderate to severe pain. Oxymorphone has poor oral bioavailability but is highly potent when administered parenterally.',
    effects: {
      positive: ['Extremely potent pain relief', 'Intense euphoria', 'Strong relaxation', 'Rapid onset'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Sweating'],
      negative: ['Severe respiratory depression', 'High overdose risk', 'Very high addiction potential', 'Nausea and vomiting', 'Dangerous withdrawal']
    },
    dosage: {
      threshold: '5-10mg (oral), 0.5-1mg (IV)',
      light: '10-20mg (oral)',
      common: '20-40mg (oral)',
      strong: '40-60mg (oral)',
      heavy: '60mg+ (oral)'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '45-90 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol (dangerous - causes rapid release)', 'Benzodiazepines', 'Other opioids', 'MAOIs', 'CNS depressants'],
    harmReduction: [
      'Extremely potent - use extreme caution',
      'Never consume with alcohol - can cause dose dumping',
      'Always have naloxone available',
      'Do not crush extended-release tablets',
      'High overdose potential',
      'Seek immediate help if breathing problems occur'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US.',
    chemistry: {
      formula: 'C17H19NO4',
      molecularWeight: '301.33 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Oxymorphone was developed in Germany in 1914. It has been used medically for decades but became more prominent with the opioid crisis.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Rectal'],
    afterEffects: 'Intense sedation. Withdrawal can be severe.',
    riskLevel: 'very-high',
    aliases: ['14-hydroxydihydromorphinone']
  },
  {
    id: 'methadone',
    name: 'Methadone',
    commonNames: ['Dolophine', 'Methadose', 'Diskets', 'Done', 'Fizzies'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Methadone is a synthetic opioid used for pain management and opioid dependence treatment. It has a long half-life (24-36 hours) making it suitable for maintenance therapy. Methadone acts as a μ-opioid receptor agonist and NMDA receptor antagonist, giving it unique properties among opioids.',
    effects: {
      positive: ['Long-lasting pain relief', 'Prevents opioid withdrawal', 'Blocks euphoria from other opioids at maintenance doses', 'Mood stabilization'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Sweating', 'QT interval prolongation'],
      negative: ['Respiratory depression', 'Cardiac arrhythmia risk', 'Addiction potential', 'Very long withdrawal', 'Overdose risk due to long half-life']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-60mg',
      heavy: '60mg+'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '12-24 hours',
      total: '24-36 hours (analgesia), up to 48+ hours (withdrawal prevention)'
    },
    interactions: ['Many medications affect methadone levels', 'CYP450 inhibitors/inducers', 'Benzodiazepines (dangerous)', 'Alcohol', 'Other opioids', 'QT-prolonging medications'],
    harmReduction: [
      'Take only as prescribed - accumulation can cause delayed overdose',
      'Do not mix with benzodiazepines or alcohol',
      'Be aware that effects can last much longer than other opioids',
      'Have regular ECG monitoring for QT prolongation',
      'Never adjust dose without medical supervision',
      'Have naloxone available'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US. Highly regulated for opioid treatment programs.',
    chemistry: {
      formula: 'C21H27NO',
      molecularWeight: '309.44 g/mol',
      class: 'Synthetic opioid'
    },
    history: 'Methadone was developed in Germany in 1937 and was introduced to the US in 1947. It became widely used for opioid maintenance therapy starting in the 1960s.',
    routes: ['Oral', 'Intravenous', 'Intramuscular'],
    afterEffects: 'Long duration means effects persist. Withdrawal can last weeks and is often more prolonged than other opioids.',
    riskLevel: 'high',
    aliases: ['amidone', 'dolophine']
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    commonNames: ['Duragesic', 'Sublimaze', 'China White', 'Apache', 'Dance Fever'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Fentanyl is a potent synthetic opioid approximately 50-100 times more potent than morphine. It is used medically for anesthesia and severe pain management. Illicitly manufactured fentanyl has become a major cause of opioid overdose deaths. Fentanyl acts as a μ-opioid receptor agonist with rapid onset and short duration.',
    effects: {
      positive: ['Extremely potent pain relief', 'Intense euphoria', 'Strong sedation', 'Rapid onset'],
      neutral: ['Pupil constriction', 'Sedation', 'Constipation', 'Sweating'],
      negative: ['Severe respiratory depression', 'Very high overdose risk', 'High addiction potential', 'Nausea and vomiting', 'Chest wall rigidity (chest wall syndrome)']
    },
    dosage: {
      threshold: '25-50μg',
      light: '50-100μg',
      common: '100-250μg',
      strong: '250-500μg',
      heavy: '500μg+'
    },
    duration: {
      onset: '1-2 minutes (IV), 5-15 minutes (transdermal)',
      comeup: '5-15 minutes',
      peak: '15-30 minutes',
      offset: '30-60 minutes',
      total: '1-2 hours (IV), 72 hours (patch)'
    },
    interactions: ['All CNS depressants are dangerous', 'Benzodiazepines', 'Alcohol', 'Other opioids', 'MAOIs', 'CYP3A4 inhibitors'],
    harmReduction: [
      'EXTREMELY potent - micrograms can be fatal',
      'Always have multiple doses of naloxone available',
      'Test substances with fentanyl test strips',
      'Never use alone',
      'Start with tiny amounts if substance may contain fentanyl',
      'Do not handle powder - can absorb through skin',
      'Call emergency services immediately if overdose suspected'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US. Illicit manufacture and distribution carries severe penalties.',
    chemistry: {
      formula: 'C22H28N2O',
      molecularWeight: '336.47 g/mol',
      class: 'Synthetic opioid (piperidine derivative)'
    },
    history: 'Fentanyl was first synthesized in 1960 by Janssen Pharmaceuticals. It became widely used medically and later became a major public health concern when illicitly manufactured fentanyl began appearing in street drugs.',
    routes: ['Transdermal (patch)', 'Intravenous', 'Intranasal', 'Sublingual', 'Buccal', 'Smoking'],
    afterEffects: 'Short duration but intense. High risk of fatal overdose.',
    riskLevel: 'very-high',
    aliases: ['N-(1-phenethyl-4-piperidinyl)-N-phenylpropanamide']
  },
  {
    id: 'carfentanil',
    name: 'Carfentanil',
    commonNames: ['Carfent', 'Drop Dead', 'Serial Killer'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Carfentanil is an extremely potent synthetic opioid, approximately 10,000 times more potent than morphine and 100 times more potent than fentanyl. It is used primarily as a large animal tranquilizer for elephants and other large mammals. Carfentanil has been found as an adulterant in illicit drugs and has caused numerous overdose deaths.',
    effects: {
      positive: ['Extremely potent analgesia (in veterinary use)'],
      neutral: ['Rapid onset', 'Potent sedation'],
      negative: ['EXTREME overdose risk', 'Respiratory depression', 'Fatal at microgram doses', 'Naloxone often requires multiple doses']
    },
    dosage: {
      threshold: '1-5μg',
      light: '5-10μg',
      common: 'Not applicable - too dangerous for human use',
      strong: 'Not applicable',
      heavy: 'Not applicable'
    },
    duration: {
      onset: 'Minutes',
      comeup: 'Very rapid',
      peak: 'Variable',
      offset: 'Hours',
      total: 'Variable'
    },
    interactions: ['All CNS depressants are extremely dangerous', 'Alcohol', 'Benzodiazepines', 'Other opioids'],
    harmReduction: [
      'EXTREMELY DANGEROUS - microgram doses can be fatal',
      'Avoid any substance that may contain carfentanil',
      'Multiple naloxone doses often required for overdose reversal',
      'Never use alone',
      'Test all substances',
      'Seek immediate medical attention for any suspected exposure',
      'Do not handle - can absorb through skin'
    ],
    legality: 'Schedule II controlled substance in the US. Not approved for human use. Strictly regulated.',
    chemistry: {
      formula: 'C24H30N2O3',
      molecularWeight: '394.51 g/mol',
      class: 'Synthetic opioid (piperidine derivative)'
    },
    history: 'Carfentanil was first synthesized in 1974 by Janssen Pharmaceuticals. It has been used to cut heroin and other drugs, leading to numerous overdose deaths.',
    routes: ['Not intended for human use'],
    afterEffects: 'Prolonged sedation. High fatality rate.',
    riskLevel: 'very-high',
    aliases: ['methyl 1-(2-phenylethyl)-4-(N-phenylpropanamido)piperidine-4-carboxylate']
  },
  {
    id: 'acetylfentanyl',
    name: 'Acetylfentanyl',
    commonNames: ['Acetyl', 'Acetylfent'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Acetylfentanyl is a synthetic opioid analgesic that is an analog of fentanyl. It is approximately 5-15 times more potent than heroin and has appeared as a novel psychoactive substance. Acetylfentanyl has been associated with numerous overdose deaths and is often sold as heroin or mixed with other opioids.',
    effects: {
      positive: ['Potent pain relief', 'Euphoria', 'Sedation'],
      neutral: ['Pupil constriction', 'Constipation', 'Sweating'],
      negative: ['High overdose risk', 'Respiratory depression', 'Addiction potential', 'Often mislabeled in illicit market']
    },
    dosage: {
      threshold: '10-25μg',
      light: '25-50μg',
      common: '50-150μg',
      strong: '150-300μg',
      heavy: '300μg+'
    },
    duration: {
      onset: 'Rapid',
      comeup: 'Minutes',
      peak: '30-60 minutes',
      offset: '1-2 hours',
      total: '2-4 hours'
    },
    interactions: ['All CNS depressants', 'Benzodiazepines', 'Alcohol', 'Other opioids'],
    harmReduction: [
      'Extremely potent - use extreme caution',
      'Always have naloxone available',
      'Never use alone',
      'Test substances when possible',
      'Start with very small amounts',
      'May require multiple naloxone doses for reversal'
    ],
    legality: 'Schedule I controlled substance in the US. Not approved for medical use.',
    chemistry: {
      formula: 'C23H30N2O2',
      molecularWeight: '366.50 g/mol',
      class: 'Synthetic opioid'
    },
    history: 'Acetylfentanyl was first synthesized in the 1960s but was not used medically. It emerged as a drug of abuse in 2013.',
    routes: ['Intranasal', 'Intravenous', 'Smoking'],
    afterEffects: 'Similar to fentanyl but shorter duration.',
    riskLevel: 'very-high',
    aliases: ['N-(1-phenethyl-4-piperidinyl)-N-phenylacetamide']
  },
  {
    id: 'buprenorphine',
    name: 'Buprenorphine',
    commonNames: ['Suboxone', 'Subutex', 'Bupe', 'Temgesic', 'Buprenex'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Buprenorphine is a semi-synthetic opioid derived from thebaine. It is a partial μ-opioid receptor agonist with high receptor affinity, meaning it can block the effects of other opioids. This property makes it useful for opioid maintenance therapy and pain management. It has a ceiling effect on respiratory depression, making it safer than full agonists.',
    effects: {
      positive: ['Pain relief', 'Prevents opioid withdrawal', 'Blocks effects of other opioids', 'Mood stabilization', 'Lower overdose risk than full agonists'],
      neutral: ['Pupil constriction', 'Constipation', 'Sedation', 'Sweating'],
      negative: ['Can precipitate withdrawal in opioid-dependent individuals', 'Addiction potential (lower than full agonists)', 'Headache', 'Nausea']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-8mg (maintenance)',
      strong: '8-16mg',
      heavy: '16-32mg'
    },
    duration: {
      onset: '15-30 minutes (sublingual)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '6-12 hours',
      total: '24-48 hours'
    },
    interactions: ['Other opioids (can block or cause withdrawal)', 'Benzodiazepines (still dangerous)', 'Alcohol', 'CYP3A4 inhibitors/inducers'],
    harmReduction: [
      'Wait until in moderate withdrawal before first dose to avoid precipitated withdrawal',
      'Can still overdose when combined with other depressants',
      'Do not inject Suboxone (contains naloxone)',
      'Have naloxone available',
      'Follow medical guidance for tapering',
      'Do not mix with benzodiazepines'
    ],
    legality: 'Prescription only. Schedule III controlled substance in the US. DATA-2000 waiver required to prescribe for opioid dependence.',
    chemistry: {
      formula: 'C29H41NO4',
      molecularWeight: '467.64 g/mol',
      class: 'Semi-synthetic opioid (thebaine derivative)'
    },
    history: 'Buprenorphine was first synthesized in 1969 and marketed as an analgesic. It was approved for opioid dependence treatment in the US in 2002.',
    routes: ['Sublingual', 'Intravenous (medical)', 'Transdermal (pain)', 'Implant'],
    afterEffects: 'Long duration of action. Milder withdrawal than full agonists.',
    riskLevel: 'moderate',
    aliases: ['21-cyclopropyl-7-[(1S)-1-hydroxy-1,2,2-trimethylpropyl]-6,14-endo-ethano-6,7,8,14-tetrahydrooripavine']
  },
  {
    id: 'tramadol',
    name: 'Tramadol',
    commonNames: ['Ultram', 'Tramal', 'Ultracet', 'Trammies', 'Trams'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Tramadol is a synthetic opioid analgesic that acts as a weak μ-opioid receptor agonist and also inhibits the reuptake of serotonin and norepinephrine. It is used for moderate pain and has a lower abuse potential than traditional opioids, though dependence and addiction still occur. Tramadol is metabolized to O-desmethyltramadol, which is significantly more potent.',
    effects: {
      positive: ['Pain relief', 'Mild euphoria', 'Energy boost', 'Mood elevation', 'Less respiratory depression than other opioids'],
      neutral: ['Sedation or stimulation depending on dose', 'Sweating', 'Pupil constriction'],
      negative: ['Seizure risk at high doses', 'Serotonin syndrome risk', 'Addiction potential', 'Nausea and vomiting', 'Withdrawal symptoms']
    },
    dosage: {
      threshold: '50-75mg',
      light: '75-150mg',
      common: '150-300mg',
      strong: '300-400mg',
      heavy: '400mg+ (high seizure risk)'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '45-90 minutes',
      peak: '2-3 hours',
      offset: '3-6 hours',
      total: '6-8 hours'
    },
    interactions: ['SSRIs/SNRIs (serotonin syndrome risk)', 'MAOIs', 'Tricyclic antidepressants', 'Benzodiazepines', 'Alcohol', 'Other opioids', 'Warfarin'],
    harmReduction: [
      'Do not exceed 400mg per day due to seizure risk',
      'Avoid if taking antidepressants',
      'Be aware of seizure risk at high doses',
      'Do not mix with other serotonergic drugs',
      'Have naloxone available',
      'Lower abuse potential than other opioids but still addictive'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C16H25NO2',
      molecularWeight: '263.37 g/mol',
      class: 'Synthetic opioid (codone analog)'
    },
    history: 'Tramadol was developed in Germany in the 1970s and has been used medically since 1977. It became popular due to its perceived lower abuse potential.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Rectal'],
    afterEffects: 'Possible stimulation or sedation. Withdrawal includes both opioid and antidepressant-like symptoms.',
    riskLevel: 'moderate',
    aliases: ['(+/-)-cis-2-[(dimethylamino)methyl]-1-(3-methoxyphenyl)cyclohexanol']
  },
  {
    id: 'o-desmethyltramadol',
    name: 'O-Desmethyltramadol',
    commonNames: ['O-DSMT', 'Desmetramadol', 'OMPT'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'O-Desmethyltramadol (O-DSMT) is the primary active metabolite of tramadol. It is a significantly more potent μ-opioid receptor agonist than tramadol itself, with approximately 200 times the affinity for μ-opioid receptors. O-DSMT has appeared as a research chemical and novel psychoactive substance.',
    effects: {
      positive: ['Potent pain relief', 'Euphoria', 'Relaxation'],
      neutral: ['Sedation', 'Pupil constriction', 'Sweating'],
      negative: ['Respiratory depression', 'Addiction potential', 'Nausea', 'Overdose risk', 'Seizure risk (lower than tramadol)']
    },
    dosage: {
      threshold: '25-50mg',
      light: '50-100mg',
      common: '100-200mg',
      strong: '200-300mg',
      heavy: '300mg+'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '45-90 minutes',
      peak: '2-3 hours',
      offset: '3-5 hours',
      total: '5-7 hours'
    },
    interactions: ['Other opioids', 'Benzodiazepines', 'Alcohol', 'CNS depressants'],
    harmReduction: [
      'More potent than tramadol - use with caution',
      'Have naloxone available',
      'Do not mix with other depressants',
      'Start with low doses',
      'Avoid if opioid-naive'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act as tramadol analog. Controlled in some jurisdictions. Not approved for medical use.',
    chemistry: {
      formula: 'C15H23NO2',
      molecularWeight: '249.35 g/mol',
      class: 'Synthetic opioid'
    },
    history: 'O-DSMT was identified as tramadol\'s active metabolite in the 1990s. It began appearing as a research chemical in the 2010s.',
    routes: ['Oral'],
    afterEffects: 'Similar to tramadol but without serotonergic effects.',
    riskLevel: 'moderate',
    aliases: ['desmetramadol', 'O-DSMT']
  },
  {
    id: 'tapentadol',
    name: 'Tapentadol',
    commonNames: ['Nucynta', 'Palexia', 'Taps'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Tapentadol is a synthetic opioid analgesic with dual mechanism of action: μ-opioid receptor agonism and norepinephrine reuptake inhibition. It is used for moderate to severe pain and has similar efficacy to oxycodone but with potentially improved gastrointestinal tolerability.',
    effects: {
      positive: ['Pain relief', 'Mood elevation', 'Less nausea than traditional opioids', 'Dual mechanism pain relief'],
      neutral: ['Sedation', 'Sweating', 'Pupil constriction'],
      negative: ['Addiction potential', 'Respiratory depression', 'Serotonin syndrome risk', 'Headache', 'Dizziness']
    },
    dosage: {
      threshold: '25-50mg',
      light: '50-100mg',
      common: '100-200mg',
      strong: '200-350mg',
      heavy: '350mg+'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '45-90 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['SSRIs/SNRIs', 'MAOIs', 'Other opioids', 'Benzodiazepines', 'Alcohol'],
    harmReduction: [
      'Have naloxone available',
      'Do not mix with antidepressants',
      'Be aware of dual mechanism - affects withdrawal profile',
      'Do not exceed prescribed doses',
      'Avoid combining with other depressants'
    ],
    legality: 'Prescription only. Schedule II controlled substance in the US.',
    chemistry: {
      formula: 'C14H23NO',
      molecularWeight: '221.34 g/mol',
      class: 'Synthetic opioid'
    },
    history: 'Tapentadol was developed by Grünenthal and approved in the US in 2008. It was designed to have improved tolerability over traditional opioids.',
    routes: ['Oral'],
    afterEffects: 'Similar to other opioids but with additional norepinephrine-related effects.',
    riskLevel: 'high',
    aliases: ['3-[(1R,2R)-2-(dimethylamino)-1-hydroxypropyl]phenol']
  },
  {
    id: 'desomorphine',
    name: 'Desomorphine',
    commonNames: ['Krokodil', 'Crocodil', 'Russian Magic', 'Zombie Drug'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Desomorphine is a synthetic opioid derived from morphine, approximately 8-10 times more potent than morphine with rapid onset. It gained notoriety as "Krokodil" when illicitly synthesized from codeine in Russia, often containing dangerous impurities that cause severe tissue damage, gangrene, and death. The name comes from the green, scaly appearance of skin at injection sites.',
    effects: {
      positive: ['Potent pain relief', 'Intense euphoria', 'Rapid onset'],
      neutral: ['Short duration requiring frequent redosing', 'Sedation'],
      negative: ['SEVERE tissue damage from impurities', 'Gangrene and limb loss', 'High addiction potential', 'Severe withdrawal', 'Organ damage', 'Death from infections or overdose']
    },
    dosage: {
      threshold: '1-2mg',
      light: '2-5mg',
      common: '5-10mg',
      strong: '10-20mg',
      heavy: '20mg+'
    },
    duration: {
      onset: 'Very rapid (IV)',
      comeup: 'Minutes',
      peak: '15-30 minutes',
      offset: '30-60 minutes',
      total: '1-2 hours'
    },
    interactions: ['All CNS depressants', 'Benzodiazepines', 'Alcohol', 'Other opioids'],
    harmReduction: [
      'EXTREMELY DANGEROUS - homemade versions contain toxic impurities',
      'Causes severe tissue necrosis and gangrene',
      'Seek immediate medical help if you have used',
      'Short duration leads to compulsive redosing',
      'High overdose risk',
      'Contaminants cause permanent damage',
      'Professional treatment is essential'
    ],
    legality: 'Schedule I controlled substance in the US. No accepted medical use in most countries.',
    chemistry: {
      formula: 'C17H21NO2',
      molecularWeight: '271.35 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Desomorphine was first synthesized in 1932 in Switzerland. It was used briefly in Switzerland under the brand name Permonid. The illicit "Krokodil" phenomenon emerged in Russia around 2002.',
    routes: ['Intravenous (illicit production extremely dangerous)'],
    afterEffects: 'Severe tissue damage, infections, and extremely high addiction liability.',
    riskLevel: 'very-high',
    aliases: ['dihydrodesoxymorphine', 'Permonid']
  },
  {
    id: 'dihydrocodeine',
    name: 'Dihydrocodeine',
    commonNames: ['DF-118', 'DHC', 'Contugesic', 'Drocode'],
    category: 'opioids',
    class: 'Opioid Analgesic',
    description: 'Dihydrocodeine is a semi-synthetic opioid analgesic developed in Germany in 1908. It is used for moderate to severe pain and as a cough suppressant. Dihydrocodeine is approximately twice as potent as codeine and has a longer duration of action.',
    effects: {
      positive: ['Pain relief', 'Cough suppression', 'Mild euphoria', 'Relaxation'],
      neutral: ['Sedation', 'Pupil constriction', 'Constipation', 'Dizziness'],
      negative: ['Nausea and vomiting', 'Addiction potential', 'Respiratory depression at high doses', 'Withdrawal symptoms']
    },
    dosage: {
      threshold: '15-30mg',
      light: '30-60mg',
      common: '60-120mg',
      strong: '120-200mg',
      heavy: '200mg+'
    },
    duration: {
      onset: '30-45 minutes (oral)',
      comeup: '45-90 minutes',
      peak: '1.5-2 hours',
      offset: '3-5 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other opioids', 'MAOIs', 'CNS depressants'],
    harmReduction: [
      'Do not exceed prescribed doses',
      'Avoid mixing with other depressants',
      'Have naloxone available',
      'Be aware of addiction potential',
      'Do not crush extended-release formulations'
    ],
    legality: 'Prescription only. Schedule II/V depending on formulation in the US.',
    chemistry: {
      formula: 'C18H23NO3',
      molecularWeight: '301.38 g/mol',
      class: 'Semi-synthetic opioid'
    },
    history: 'Dihydrocodeine was first synthesized in Germany in 1908. It has been used medically for over a century.',
    routes: ['Oral', 'Intramuscular', 'Subcutaneous', 'Rectal'],
    afterEffects: 'Similar to codeine but longer lasting.',
    riskLevel: 'moderate',
    aliases: ['DHC', 'drocode']
  },
  {
    id: 'tianeptine',
    name: 'Tianeptine',
    commonNames: ['Coaxil', 'Stablon', 'Tianaa', 'ZaZa', 'Gas Station Heroin'],
    category: 'opioids',
    class: 'Atypical Antidepressant/Opioid',
    description: 'Tianeptine is an atypical antidepressant with opioid receptor activity. At therapeutic doses it acts primarily as an antidepressant, but at higher doses it acts as a μ-opioid receptor agonist. It has gained notoriety in some regions as a drug of abuse, particularly in areas where it is sold over-the-counter or in gas stations.',
    effects: {
      positive: ['Antidepressant effects at therapeutic doses', 'Opioid-like euphoria at high doses', 'Anxiolytic effects', 'Pain relief'],
      neutral: ['Sedation', 'Changes in mood'],
      negative: ['High addiction potential at recreational doses', 'Withdrawal similar to opioids', 'Tolerance develops rapidly', 'Overdose risk', 'Seizures at high doses']
    },
    dosage: {
      threshold: '12.5-25mg',
      light: '25-50mg',
      common: '50-100mg (recreational)',
      strong: '100-200mg',
      heavy: '200mg+'
    },
    duration: {
      onset: '15-30 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-3 hours',
      total: '3-4 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Benzodiazepines', 'Alcohol', 'Other opioids'],
    harmReduction: [
      'Avoid recreational use - rapid tolerance and dependence',
      'Withdrawal can be severe',
      'Do not combine with other opioids',
      'Be aware of dose escalation risk',
      'Have naloxone available',
      'Seek professional help for addiction'
    ],
    legality: 'Prescription only in some countries. Not FDA approved in the US. Scheduled in some states. Sold as supplement in some areas.',
    chemistry: {
      formula: 'C21H25ClN2O4S',
      molecularWeight: '436.96 g/mol',
      class: 'Tricyclic antidepressant derivative'
    },
    history: 'Tianeptine was developed in France and has been used as an antidepressant since the 1980s. Abuse potential became recognized in the 2000s.',
    routes: ['Oral', 'Insufflation', 'Intravenous (dangerous)'],
    afterEffects: 'Withdrawal symptoms similar to opioids. Rapid tolerance development.',
    riskLevel: 'high',
    aliases: ['Tianaa', 'ZaZa Red']
  },

  // ============================================
  // DEPRESSANTS - Gabapentinoids & Others
  // ============================================
  {
    id: 'gabapentin',
    name: 'Gabapentin',
    commonNames: ['Neurontin', 'Gaba', 'Gabbies', 'Johnny\'s'],
    category: 'depressants',
    class: 'Gabapentinoid',
    description: 'Gabapentin is a medication structurally similar to GABA, used primarily for neuropathic pain and seizures. It binds to voltage-gated calcium channels in the central nervous system. While originally developed to treat epilepsy, it is now widely prescribed for various conditions. Gabapentin has abuse potential, particularly when combined with opioids.',
    effects: {
      positive: ['Pain relief', 'Anxiety reduction', 'Relaxation', 'Improved sleep', 'Mild euphoria at higher doses'],
      neutral: ['Sedation', 'Dizziness', 'Fatigue', 'Peripheral edema'],
      negative: ['Dependency potential', 'Withdrawal symptoms', 'Ataxia', 'Cognitive impairment', 'Respiratory depression when combined with opioids']
    },
    dosage: {
      threshold: '100-300mg',
      light: '300-600mg',
      common: '600-1200mg',
      strong: '1200-2400mg',
      heavy: '2400mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Opioids (increases respiratory depression risk)', 'Alcohol', 'Benzodiazepines', 'Antacids (reduce absorption)'],
    harmReduction: [
      'Do not combine with opioids - increases overdose risk',
      'Taper off gradually to avoid withdrawal',
      'Do not drive until you know how it affects you',
      'Avoid alcohol while taking',
      'Be aware of dependence potential with regular use'
    ],
    legality: 'Prescription only. Not a controlled substance federally in the US but scheduled in some states.',
    chemistry: {
      formula: 'C9H17NO2',
      molecularWeight: '171.24 g/mol',
      class: 'Gabapentinoid'
    },
    history: 'Gabapentin was developed in the 1970s and approved for medical use in 1993. It was originally designed as a GABA mimetic but works through different mechanisms.',
    routes: ['Oral'],
    afterEffects: 'Sedation can persist. Withdrawal symptoms include anxiety, insomnia, and sweating.',
    riskLevel: 'moderate',
    aliases: ['1-(aminomethyl)cyclohexaneacetic acid']
  },
  {
    id: 'pregabalin',
    name: 'Pregabalin',
    commonNames: ['Lyrica', 'Pregabs', 'Pregs'],
    category: 'depressants',
    class: 'Gabapentinoid',
    description: 'Pregabalin is a gabapentinoid medication used for neuropathic pain, fibromyalgia, anxiety, and seizures. It is more potent than gabapentin with higher bioavailability. Pregabalin binds to voltage-gated calcium channels and has demonstrated abuse potential, leading to controlled substance scheduling in many countries.',
    effects: {
      positive: ['Pain relief', 'Anxiety reduction', 'Relaxation', 'Euphoria at higher doses', 'Improved sleep'],
      neutral: ['Sedation', 'Dizziness', 'Weight gain', 'Peripheral edema', 'Dry mouth'],
      negative: ['Dependency potential', 'Withdrawal symptoms', 'Cognitive impairment', 'Blurred vision', 'Respiratory depression when combined with other depressants']
    },
    dosage: {
      threshold: '25-75mg',
      light: '75-150mg',
      common: '150-300mg',
      strong: '300-450mg',
      heavy: '450mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Opioids', 'Alcohol', 'Benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'More potent than gabapentin - use with caution',
      'High abuse potential - Schedule V in US',
      'Do not combine with other depressants',
      'Taper off gradually to avoid withdrawal',
      'Can cause severe withdrawal symptoms'
    ],
    legality: 'Prescription only. Schedule V controlled substance in the US. Controlled in many countries.',
    chemistry: {
      formula: 'C8H17NO2',
      molecularWeight: '159.23 g/mol',
      class: 'Gabapentinoid'
    },
    history: 'Pregabalin was developed as a successor to gabapentin and was approved in the US in 2004. It became a controlled substance due to abuse potential.',
    routes: ['Oral'],
    afterEffects: 'Sedation, potential withdrawal symptoms including anxiety and insomnia.',
    riskLevel: 'moderate',
    aliases: ['(S)-3-(aminomethyl)-5-methylhexanoic acid']
  },
  {
    id: 'phenibut',
    name: 'Phenibut',
    commonNames: ['Fenibut', 'Noofen', 'Phenny'],
    category: 'depressants',
    class: 'Gabapentinoid',
    description: 'Phenibut is a GABA analog with anxiolytic and nootropic effects, developed in Russia. It acts as a GABA-B receptor agonist and also affects voltage-gated calcium channels. Phenibut is used medically in Russia and some other countries but is sold as a supplement elsewhere. It has significant abuse potential and can cause severe withdrawal symptoms.',
    effects: {
      positive: ['Anxiety relief', 'Relaxation', 'Improved sleep', 'Social ease', 'Mild euphoria', 'Cognitive enhancement at low doses'],
      neutral: ['Sedation', 'Reduced inhibition', 'Increased sociability'],
      negative: ['High addiction potential', 'Severe withdrawal syndrome', 'Tolerance develops rapidly', 'Dizziness', 'Nausea', 'Delirium in withdrawal']
    },
    dosage: {
      threshold: '100-250mg',
      light: '250-500mg',
      common: '500-1000mg',
      strong: '1000-2000mg',
      heavy: '2000mg+'
    },
    duration: {
      onset: '1-2 hours (oral)',
      comeup: '2-3 hours',
      peak: '4-6 hours',
      offset: '6-12 hours',
      total: '10-24 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Benzodiazepines', 'GHB', 'Opioids', 'Other depressants'],
    harmReduction: [
      'Do not use more than 1-2 times per week to avoid dependence',
      'Tolerance develops rapidly - avoid daily use',
      'Withdrawal can be severe and prolonged - taper gradually',
      'Never combine with alcohol',
      'Start with low doses - effects are delayed',
      'Have a plan for stopping before starting'
    ],
    legality: 'Prescription only in Russia and some countries. Uncontrolled supplement in US, though FDA has issued warnings. Banned in some countries.',
    chemistry: {
      formula: 'C10H13NO2',
      molecularWeight: '179.22 g/mol',
      class: 'Gabapentinoid'
    },
    history: 'Phenibut was developed in the Soviet Union in the 1960s for cosmonauts to reduce stress without impairing performance. It has been used medically in Russia since.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Long duration. Withdrawal can include severe anxiety, insomnia, and psychotic symptoms.',
    riskLevel: 'moderate',
    aliases: ['β-phenyl-γ-aminobutyric acid', 'fenibut']
  },
  {
    id: 'f-phenibut',
    name: 'F-Phenibut',
    commonNames: ['Fluorophenibut', 'F-Phen'],
    category: 'depressants',
    class: 'Gabapentinoid',
    description: 'F-Phenibut (Fluorophenibut) is a fluorinated analog of phenibut with increased potency. The addition of a fluorine atom increases its ability to cross the blood-brain barrier. It is sold as a research chemical and has similar effects to phenibut but at lower doses.',
    effects: {
      positive: ['Anxiety relief', 'Relaxation', 'Improved sleep', 'Social ease'],
      neutral: ['Sedation', 'Reduced inhibition'],
      negative: ['High addiction potential', 'Severe withdrawal', 'Tolerance development', 'Less research than phenibut']
    },
    dosage: {
      threshold: '50-100mg',
      light: '100-200mg',
      common: '200-400mg',
      strong: '400-600mg',
      heavy: '600mg+'
    },
    duration: {
      onset: '1-2 hours',
      comeup: '2-3 hours',
      peak: '4-6 hours',
      offset: '6-10 hours',
      total: '8-15 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'GHB', 'Opioids', 'Other depressants'],
    harmReduction: [
      'More potent than phenibut - use lower doses',
      'Less research available - use with caution',
      'Avoid daily use to prevent dependence',
      'Taper gradually if physically dependent',
      'Never combine with alcohol'
    ],
    legality: 'Not scheduled in most countries. Sold as research chemical. May be controlled under analog acts.',
    chemistry: {
      formula: 'C10H12FNO2',
      molecularWeight: '197.21 g/mol',
      class: 'Gabapentinoid'
    },
    history: 'F-Phenibut emerged as a research chemical alternative to phenibut in the 2010s.',
    routes: ['Oral'],
    afterEffects: 'Similar to phenibut. Withdrawal risk significant.',
    riskLevel: 'moderate',
    aliases: ['fluorophenibut']
  },
  {
    id: 'baclofen',
    name: 'Baclofen',
    commonNames: ['Lioresal', 'Gablofen', 'Bac'],
    category: 'depressants',
    class: 'Muscle Relaxant',
    description: 'Baclofen is a GABA-B receptor agonist used as a muscle relaxant and antispasmodic. It is prescribed for muscle spasticity, particularly in multiple sclerosis and spinal cord injuries. Baclofen has been studied for alcohol and opioid dependence treatment. Withdrawal can be dangerous and potentially life-threatening.',
    effects: {
      positive: ['Muscle relaxation', 'Pain relief from spasms', 'Anxiety reduction', 'Possible anti-addiction effects'],
      neutral: ['Sedation', 'Drowsiness', 'Weakness', 'Dizziness'],
      negative: ['Withdrawal syndrome can be fatal', 'Seizures in withdrawal', 'Confusion', 'Respiratory depression at high doses']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-80mg',
      heavy: '80mg+'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '1-2 hours',
      peak: '2-3 hours',
      offset: '4-6 hours',
      total: '6-8 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other muscle relaxants', 'Antidepressants', 'Opioids'],
    harmReduction: [
      'Never stop abruptly - withdrawal can be fatal',
      'Taper gradually under medical supervision',
      'High doses can cause respiratory depression',
      'Avoid combining with other depressants',
      'Seek medical help if doses are missed'
    ],
    legality: 'Prescription only. Not a controlled substance.',
    chemistry: {
      formula: 'C10H12ClNO2',
      molecularWeight: '213.66 g/mol',
      class: 'GABA derivative'
    },
    history: 'Baclofen was developed in the 1960s as a treatment for epilepsy but was found more effective for muscle spasticity.',
    routes: ['Oral', 'Intrathecal (pump)'],
    afterEffects: 'Muscle weakness. Withdrawal is medical emergency.',
    riskLevel: 'moderate',
    aliases: ['β-(4-chlorophenyl)-GABA']
  },
  {
    id: 'carisoprodol',
    name: 'Carisoprodol',
    commonNames: ['Soma', 'Somas', 'Dantrium', 'Soma Compound'],
    category: 'depressants',
    class: 'Muscle Relaxant',
    description: 'Carisoprodol is a muscle relaxant that acts centrally to relieve muscle pain and discomfort. It is metabolized to meprobamate, an anxiolytic with barbiturate-like effects. Carisoprodol has significant abuse potential and is scheduled in many jurisdictions.',
    effects: {
      positive: ['Muscle relaxation', 'Pain relief', 'Anxiety reduction', 'Mild euphoria', 'Sleepiness'],
      neutral: ['Sedation', 'Drowsiness', 'Dizziness', 'Impaired coordination'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Overdose risk with other depressants', 'Seizures in withdrawal', 'Cognitive impairment']
    },
    dosage: {
      threshold: '100-200mg',
      light: '200-350mg',
      common: '350-700mg',
      strong: '700-1050mg',
      heavy: '1050mg+'
    },
    duration: {
      onset: '30-45 minutes',
      comeup: '45-90 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Benzodiazepines', 'Opioids', 'Other muscle relaxants', 'CNS depressants'],
    harmReduction: [
      'Metabolizes to meprobamate - addictive potential',
      'Never mix with alcohol or other depressants',
      'Avoid long-term use - dependence develops quickly',
      'Taper gradually when stopping',
      'Schedule IV in US - controlled substance'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US. Withdrawn from market in some countries.',
    chemistry: {
      formula: 'C12H24N2O4',
      molecularWeight: '260.33 g/mol',
      class: 'Carbamate derivative'
    },
    history: 'Carisoprodol was developed in the 1950s and has been used as a muscle relaxant since. Abuse potential led to increased regulation.',
    routes: ['Oral'],
    afterEffects: 'Drowsiness. Withdrawal can include anxiety, insomnia, and seizures.',
    riskLevel: 'moderate',
    aliases: ['isopropyl carbamate', 'N-isopropyl-2-methyl-2-propyl-1,3-propanediol dicarbamate']
  },
  {
    id: 'zolpidem',
    name: 'Zolpidem',
    commonNames: ['Ambien', 'Stilnox', 'Zolpimist', 'Edluar', 'Ambien CR'],
    category: 'depressants',
    class: 'Z-Drug',
    description: 'Zolpidem is a sedative-hypnotic medication used for short-term treatment of insomnia. It acts as a positive allosteric modulator at GABA-A receptors, preferentially at α1 subunits. Zolpidem is known for causing unusual behaviors including sleep-walking, sleep-eating, and sleep-driving in some individuals.',
    effects: {
      positive: ['Sleep induction', 'Rapid onset of sleep', 'Anxiety relief at low doses'],
      neutral: ['Sedation', 'Amnesia', 'Impaired coordination', 'Taste changes'],
      negative: ['Complex sleep behaviors (sleep-walking, driving)', 'Dependency potential', 'Withdrawal symptoms', 'Hallucinations if fighting sleep', 'Paradoxical effects']
    },
    dosage: {
      threshold: '2.5-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-30mg',
      heavy: '30mg+'
    },
    duration: {
      onset: '10-30 minutes',
      comeup: '15-30 minutes',
      peak: '30-90 minutes',
      offset: '1-3 hours',
      total: '2-4 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Benzodiazepines', 'Opioids', 'Other CNS depressants', 'Fluconazole', 'Ritonavir'],
    harmReduction: [
      'Take only when ready for bed immediately',
      'Do not take with alcohol',
      'Allow 7-8 hours for sleep',
      'Do not drive or operate machinery',
      'Be aware of potential sleep behaviors',
      'Short-term use only - dependence risk'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C19H21N3O',
      molecularWeight: '307.39 g/mol',
      class: 'Imidazopyridine'
    },
    history: 'Zolpidem was developed in the 1980s and approved in the US in 1992 as a safer alternative to benzodiazepines for insomnia.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Morning grogginess possible. Memory loss for events after taking.',
    riskLevel: 'moderate',
    aliases: ['N,N-dimethyl-2-(6-methyl-2-(4-methylphenyl)imidazo[1,2-a]pyridin-3-yl)acetamide']
  },
  {
    id: 'zopiclone',
    name: 'Zopiclone',
    commonNames: ['Imovane', 'Zimovane', 'Zop', 'Zoppies'],
    category: 'depressants',
    class: 'Z-Drug',
    description: 'Zopiclone is a non-benzodiazepine hypnotic used for short-term treatment of insomnia. It acts on GABA-A receptors and produces sedative, anxiolytic, and muscle relaxant effects. Zopiclone is known for causing a metallic taste in the mouth.',
    effects: {
      positive: ['Sleep induction', 'Sleep maintenance', 'Anxiety reduction'],
      neutral: ['Sedation', 'Metallic taste', 'Dry mouth', 'Amnesia'],
      negative: ['Dependency potential', 'Withdrawal symptoms', 'Daytime drowsiness', 'Complex sleep behaviors', 'Tolerance development']
    },
    dosage: {
      threshold: '3.5-5mg',
      light: '5-7.5mg',
      common: '7.5-10mg',
      strong: '10-15mg',
      heavy: '15mg+'
    },
    duration: {
      onset: '15-30 minutes',
      comeup: '30-45 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Opioids', 'CNS depressants', 'Erythromycin'],
    harmReduction: [
      'Do not take with alcohol',
      'Short-term use only',
      'Do not drive the next day if feeling drowsy',
      'Avoid abrupt discontinuation',
      'Lower doses for elderly'
    ],
    legality: 'Prescription only. Not scheduled in US (eszopiclone available instead). Controlled in some countries.',
    chemistry: {
      formula: 'C17H17ClN6O3',
      molecularWeight: '388.81 g/mol',
      class: 'Cyclopyrrolone'
    },
    history: 'Zopiclone was developed in the 1970s and has been used medically since 1986. Eszopiclone (Lunesta) is the active S-isomer.',
    routes: ['Oral'],
    afterEffects: 'Metallic taste, possible drowsiness. Withdrawal symptoms possible.',
    riskLevel: 'moderate',
    aliases: ['6-(5-chloro-2-pyridinyl)-7-oxo-6,7-dihydro-5H-pyrrolo[3,4-b]pyrazin-5-yl 4-methyl-1-piperazinecarboxylate']
  },
  {
    id: 'eszopiclone',
    name: 'Eszopiclone',
    commonNames: ['Lunesta', 'Estorra'],
    category: 'depressants',
    class: 'Z-Drug',
    description: 'Eszopiclone is the S-isomer of zopiclone, used for treatment of insomnia. It acts as a positive allosteric modulator at GABA-A receptors. Unlike some sleep medications, eszopiclone is approved for long-term use, though dependence risk still exists.',
    effects: {
      positive: ['Sleep induction', 'Sleep maintenance', 'Longer approved duration than other Z-drugs'],
      neutral: ['Sedation', 'Metallic taste', 'Dry mouth', 'Headache'],
      negative: ['Dependency potential', 'Complex sleep behaviors', 'Daytime drowsiness', 'Withdrawal symptoms', 'Anxiety']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-3mg',
      strong: '3-4mg',
      heavy: '4mg+'
    },
    duration: {
      onset: '15-30 minutes',
      comeup: '30-45 minutes',
      peak: '1-2 hours',
      offset: '3-5 hours',
      total: '5-7 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Opioids', 'CNS depressants', 'CYP3A4 inhibitors'],
    harmReduction: [
      'Do not take with alcohol',
      'Allow 8 hours for sleep',
      'Do not drive if feeling drowsy',
      'Be aware of metallic taste side effect',
      'Taper gradually if used long-term'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C17H17ClN6O3',
      molecularWeight: '388.81 g/mol',
      class: 'Cyclopyrrolone'
    },
    history: 'Eszopiclone was approved in the US in 2004 as the active isomer of zopiclone for insomnia treatment.',
    routes: ['Oral'],
    afterEffects: 'Metallic taste common. Morning drowsiness possible.',
    riskLevel: 'moderate',
    aliases: ['(S)-zopiclone']
  },
  {
    id: 'methaqualone',
    name: 'Methaqualone',
    commonNames: ['Quaalude', 'Ludes', 'Mandrax', 'Sopor', 'Parest'],
    category: 'depressants',
    class: 'Quinazolinone',
    description: 'Methaqualone is a sedative-hypnotic medication that was popular in the 1960s and 1970s. It acts as a positive allosteric modulator at GABA-A receptors. Methaqualone was widely abused for its euphoric and disinhibiting effects and was eventually scheduled and discontinued in most countries.',
    effects: {
      positive: ['Euphoria', 'Relaxation', 'Disinhibition', 'Sleep induction', 'Enhanced sociability'],
      neutral: ['Sedation', 'Dizziness', 'Slurred speech'],
      negative: ['High addiction potential', 'Overdose risk', 'Seizures at high doses', 'Respiratory depression', 'Tolerance development']
    },
    dosage: {
      threshold: '50-100mg',
      light: '100-150mg',
      common: '150-300mg',
      strong: '300-500mg',
      heavy: '500mg+'
    },
    duration: {
      onset: '20-45 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-8 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Benzodiazepines', 'Opioids', 'Other depressants'],
    harmReduction: [
      'No longer legally available in most countries',
      'High overdose potential',
      'Never combine with alcohol',
      'Tolerance develops quickly',
      'Seizure risk at high doses'
    ],
    legality: 'Schedule I controlled substance in the US. No accepted medical use. Illegal internationally.',
    chemistry: {
      formula: 'C16H14N2O',
      molecularWeight: '250.30 g/mol',
      class: 'Quinazolinone'
    },
    history: 'Methaqualone was developed in India in the 1950s as a malaria treatment. It became popular as a recreational drug in the 1960s-70s and was banned in the US in 1984.',
    routes: ['Oral'],
    afterEffects: 'Hangover, drowsiness. High addiction potential.',
    riskLevel: 'high',
    aliases: ['2-methyl-3-(2-methylphenyl)-4(3H)-quinazolinone']
  },
  {
    id: 'gbl',
    name: 'GBL',
    commonNames: ['Gamma-Butyrolactone', 'Blue Nitro', 'Revitalize Plus', 'Renewtrient'],
    category: 'depressants',
    class: 'Lactone',
    description: 'Gamma-Butyrolactone (GBL) is a prodrug of GHB, rapidly converted to GHB in the body by lactonase enzymes. It is used industrially as a solvent and is found in some cleaning products. GBL has abuse potential similar to GHB but is more potent and faster-acting.',
    effects: {
      positive: ['Euphoria', 'Relaxation', 'Increased sociability', 'Enhanced sensory perception', 'Sexual enhancement'],
      neutral: ['Sedation', 'Drowsiness', 'Decreased inhibitions'],
      negative: ['High overdose risk', 'Narrow therapeutic window', 'Vomiting while unconscious', 'Addiction potential', 'Severe withdrawal syndrome']
    },
    dosage: {
      threshold: '0.5-1ml',
      light: '1-1.5ml',
      common: '1.5-2.5ml',
      strong: '2.5-3.5ml',
      heavy: '3.5ml+'
    },
    duration: {
      onset: '10-20 minutes',
      comeup: '15-30 minutes',
      peak: '30-60 minutes',
      offset: '1-2 hours',
      total: '2-3 hours'
    },
    interactions: ['Alcohol (extremely dangerous)', 'Benzodiazepines', 'Opioids', 'Other CNS depressants'],
    harmReduction: [
      'More potent than GHB - dose carefully',
      'NEVER mix with alcohol - respiratory arrest risk',
      'Use accurate measurement - milliliters matter',
      'High addiction potential - avoid daily use',
      'Withdrawal can be life-threatening',
      'Do not drive for at least 8 hours after use'
    ],
    legality: 'List I chemical in the US (regulated as precursor). Controlled in many countries. Has legitimate industrial uses.',
    chemistry: {
      formula: 'C4H6O2',
      molecularWeight: '86.09 g/mol',
      class: 'Lactone'
    },
    history: 'GBL has been used industrially for decades. Its conversion to GHB in the body led to its abuse as a GHB substitute.',
    routes: ['Oral'],
    afterEffects: 'Possible drowsiness. Withdrawal with regular use is severe.',
    riskLevel: 'high',
    aliases: ['gamma-butyrolactone', 'butyrolactone']
  },
  {
    id: '1-4-butanediol',
    name: '1,4-Butanediol',
    commonNames: ['1,4-BD', 'BDO', 'One Comma Four', 'Fantasy'],
    category: 'depressants',
    class: 'Diol',
    description: '1,4-Butanediol (1,4-BD) is an industrial chemical that acts as a prodrug for GHB. It is metabolized by alcohol dehydrogenase to GHB in the body. 1,4-BD has slower onset than GHB or GBL but similar effects. It is used in the production of plastics and as a solvent.',
    effects: {
      positive: ['Euphoria', 'Relaxation', 'Increased sociability', 'Similar to GHB effects'],
      neutral: ['Sedation', 'Drowsiness', 'Slower onset than GBL'],
      negative: ['High overdose risk', 'Dangerous with alcohol (metabolism competition)', 'Addiction potential', 'Severe withdrawal', 'Vomiting while unconscious']
    },
    dosage: {
      threshold: '0.5-1g',
      light: '1-1.5g',
      common: '1.5-2.5g',
      strong: '2.5-4g',
      heavy: '4g+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-3 hours',
      total: '3-5 hours'
    },
    interactions: ['Alcohol (extremely dangerous - increases GHB levels)', 'Benzodiazepines', 'Opioids', 'Other CNS depressants'],
    harmReduction: [
      'Slower onset than GBL - do not redose early',
      'NEVER mix with alcohol',
      'Accurate measurement essential',
      'High addiction potential',
      'Withdrawal can be life-threatening',
      'Do not drive after use'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some countries. Has legitimate industrial uses.',
    chemistry: {
      formula: 'C4H10O2',
      molecularWeight: '90.12 g/mol',
      class: 'Diol'
    },
    history: '1,4-Butanediol has industrial uses dating back decades. Its conversion to GHB led to abuse as a legal GHB alternative before scheduling.',
    routes: ['Oral'],
    afterEffects: 'Similar to GHB. Withdrawal syndrome with regular use.',
    riskLevel: 'high',
    aliases: ['1,4-butylene glycol', 'tetramethylene glycol']
  },
  {
    id: 'clonidine',
    name: 'Clonidine',
    commonNames: ['Catapres', 'Kapvay', 'Nexiclon', 'Clo'],
    category: 'depressants',
    class: 'Alpha-2 Agonist',
    description: 'Clonidine is an alpha-2 adrenergic receptor agonist used for hypertension, ADHD, and opioid withdrawal management. It reduces sympathetic nervous system activity, producing sedation and decreased anxiety. Clonidine is sometimes abused for its sedative effects.',
    effects: {
      positive: ['Anxiety reduction', 'Sedation', 'Helps with opioid withdrawal symptoms', 'Blood pressure reduction'],
      neutral: ['Drowsiness', 'Dry mouth', 'Constipation', 'Dizziness'],
      negative: ['Hypotension', 'Rebound hypertension if stopped abruptly', 'Bradycardia', 'Sedation can be excessive', 'Withdrawal syndrome']
    },
    dosage: {
      threshold: '0.05-0.1mg',
      light: '0.1-0.2mg',
      common: '0.2-0.4mg',
      strong: '0.4-0.6mg',
      heavy: '0.6mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '6-12 hours',
      total: '8-24 hours'
    },
    interactions: ['Beta-blockers', 'Tricyclic antidepressants', 'CNS depressants', 'Alcohol', 'Other alpha-2 agonists'],
    harmReduction: [
      'Do not stop abruptly - rebound hypertension risk',
      'Monitor blood pressure',
      'Can cause severe hypotension',
      'Avoid with other blood pressure medications without medical supervision',
      'Taper gradually when discontinuing'
    ],
    legality: 'Prescription only. Not a controlled substance.',
    chemistry: {
      formula: 'C9H9Cl2N3',
      molecularWeight: '230.09 g/mol',
      class: 'Imidazoline derivative'
    },
    history: 'Clonidine was developed in the 1960s as a nasal decongestant but was found to be effective for hypertension.',
    routes: ['Oral', 'Transdermal (patch)'],
    afterEffects: 'Drowsiness. Rebound hypertension if stopped abruptly.',
    riskLevel: 'low',
    aliases: ['2-[(2,6-dichlorophenyl)imino]imidazolidine']
  },
  {
    id: 'tizanidine',
    name: 'Tizanidine',
    commonNames: ['Zanaflex', 'Tiz'],
    category: 'depressants',
    class: 'Alpha-2 Agonist',
    description: 'Tizanidine is a short-acting alpha-2 adrenergic receptor agonist used as a muscle relaxant. It is effective for spasticity associated with multiple sclerosis and spinal cord injury. Tizanidine has sedative properties and some abuse potential.',
    effects: {
      positive: ['Muscle relaxation', 'Spasticity relief', 'Sedation', 'Anxiety reduction'],
      neutral: ['Drowsiness', 'Dry mouth', 'Weakness', 'Dizziness'],
      negative: ['Hypotension', 'Liver toxicity with long-term use', 'Rebound hypertension on withdrawal', 'Sedation']
    },
    dosage: {
      threshold: '2-4mg',
      light: '4-8mg',
      common: '8-12mg',
      strong: '12-20mg',
      heavy: '20mg+'
    },
    duration: {
      onset: '15-30 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-3 hours',
      total: '3-6 hours'
    },
    interactions: ['CYP1A2 inhibitors (fluvoxamine, ciprofloxacin)', 'Alcohol', 'Other alpha-2 agonists', 'Blood pressure medications', 'CNS depressants'],
    harmReduction: [
      'Do not combine with CYP1A2 inhibitors',
      'Can cause significant hypotension',
      'Liver function monitoring recommended',
      'Avoid abrupt discontinuation',
      'Do not drive if sedated'
    ],
    legality: 'Prescription only. Not a controlled substance.',
    chemistry: {
      formula: 'C9H8ClN5S',
      molecularWeight: '253.71 g/mol',
      class: 'Imidazoline derivative'
    },
    history: 'Tizanidine was developed as a muscle relaxant and approved in the US in 1996.',
    routes: ['Oral'],
    afterEffects: 'Drowsiness, muscle weakness. Rebound hypertension possible.',
    riskLevel: 'low',
    aliases: ['5-chloro-N-(4,5-dihydro-1H-imidazol-2-yl)-2,1,3-benzothiadiazol-4-amine']
  },
  {
    id: 'promethazine',
    name: 'Promethazine',
    commonNames: ['Phenergan', 'Prometh', 'Lean Base'],
    category: 'depressants',
    class: 'Antihistamine',
    description: 'Promethazine is a first-generation antihistamine with strong sedative, antiemetic, and anticholinergic properties. It is used for allergies, nausea, and motion sickness. Promethazine is commonly mixed with codeine in cough syrup ("lean") for recreational use.',
    effects: {
      positive: ['Sedation', 'Nausea relief', 'Allergy relief', 'Mild euphoria in combination'],
      neutral: ['Drowsiness', 'Dry mouth', 'Blurred vision', 'Constipation'],
      negative: ['Respiratory depression (especially with opioids)', 'Seizure risk', 'Neuroleptic malignant syndrome (rare)', 'Confusion', 'Hypotension']
    },
    dosage: {
      threshold: '12.5-25mg',
      light: '25-50mg',
      common: '50-75mg',
      strong: '75-100mg',
      heavy: '100mg+'
    },
    duration: {
      onset: '20-45 minutes',
      comeup: '30-60 minutes',
      peak: '2-3 hours',
      offset: '4-6 hours',
      total: '4-12 hours'
    },
    interactions: ['Opioids (dangerous - respiratory depression)', 'Alcohol', 'Benzodiazepines', 'MAOIs', 'CNS depressants'],
    harmReduction: [
      'Dangerous when combined with opioids - respiratory depression',
      'Do not use in children under 2 - risk of fatal respiratory depression',
      'Avoid driving due to sedation',
      'Do not mix with other CNS depressants',
      'Can potentiate effects of other drugs'
    ],
    legality: 'Prescription only in most countries. Not a controlled substance itself but controlled when combined with opioids.',
    chemistry: {
      formula: 'C17H20N2S',
      molecularWeight: '284.42 g/mol',
      class: 'Phenothiazine derivative'
    },
    history: 'Promethazine was developed in the 1940s and has been used medically for decades. Its combination with codeine became popular recreationally in hip-hop culture.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Rectal', 'Topical'],
    afterEffects: 'Prolonged drowsiness, dry mouth. Hangover effect common.',
    riskLevel: 'low',
    aliases: ['10-(2-dimethylaminopropyl)phenothiazine']
  },
  {
    id: 'phenobarbital',
    name: 'Phenobarbital',
    commonNames: ['Luminal', 'Phenobarb', 'Phenobarbitone'],
    category: 'depressants',
    class: 'Barbiturate',
    description: 'Phenobarbital is a long-acting barbiturate used primarily for seizure disorders. It acts as a positive allosteric modulator at GABA-A receptors. While less commonly used for anxiety and sleep due to safety concerns, it remains an important anticonvulsant.',
    effects: {
      positive: ['Seizure control', 'Sedation', 'Anxiety relief', 'Sleep induction'],
      neutral: ['Drowsiness', 'Cognitive impairment', 'Ataxia'],
      negative: ['High overdose risk', 'Respiratory depression', 'Addiction potential', 'Long half-life causes accumulation', 'Skin reactions']
    },
    dosage: {
      threshold: '15-30mg',
      light: '30-60mg',
      common: '60-120mg',
      strong: '120-200mg',
      heavy: '200mg+'
    },
    duration: {
      onset: '30-60 minutes (oral)',
      comeup: '1-2 hours',
      peak: '4-12 hours',
      offset: '12-24 hours',
      total: '24-48+ hours'
    },
    interactions: ['Alcohol (extremely dangerous)', 'Benzodiazepines', 'Opioids', 'Other barbiturates', 'MAOIs', 'Many drug interactions'],
    harmReduction: [
      'Very long half-life - effects accumulate',
      'Overdose can be fatal - narrow therapeutic window',
      'Never combine with alcohol',
      'Do not stop abruptly - seizure risk',
      'Many drug interactions - check before combining'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C12H12N2O3',
      molecularWeight: '232.24 g/mol',
      class: 'Barbiturate'
    },
    history: 'Phenobarbital was first synthesized in 1912 and was the first widely used barbiturate. It remains an important anticonvulsant in developing countries.',
    routes: ['Oral', 'Intravenous', 'Intramuscular'],
    afterEffects: 'Prolonged sedation. Withdrawal can cause seizures.',
    riskLevel: 'high',
    aliases: ['5-ethyl-5-phenylbarbituric acid']
  },

  // ============================================
  // BENZODIAZEPINES
  // ============================================
  {
    id: 'alprazolam',
    name: 'Alprazolam',
    commonNames: ['Xanax', 'Xanny', 'Bars', 'Ladders', 'Zannies', 'Blue Footballs'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Alprazolam is a short-acting benzodiazepine used primarily for anxiety and panic disorders. It acts as a positive allosteric modulator at GABA-A receptors, producing anxiolytic, sedative, and muscle relaxant effects. Alprazolam is one of the most commonly prescribed and abused benzodiazepines, with significant dependence potential.',
    effects: {
      positive: ['Anxiety relief', 'Panic attack prevention', 'Relaxation', 'Sleep induction', 'Muscle relaxation'],
      neutral: ['Sedation', 'Impaired coordination', 'Anterograde amnesia', 'Slurred speech'],
      negative: ['High addiction potential', 'Severe withdrawal syndrome', 'Cognitive impairment', 'Paradoxical reactions', 'Overdose risk with other depressants', 'Blackouts']
    },
    dosage: {
      threshold: '0.25-0.5mg',
      light: '0.5-1mg',
      common: '1-2mg',
      strong: '2-4mg',
      heavy: '4mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Opioids (dangerous)', 'Other benzodiazepines', 'CNS depressants', 'Ketoconazole', 'Grapefruit juice'],
    harmReduction: [
      'High addiction potential - avoid daily use',
      'Never combine with opioids or alcohol',
      'Withdrawal can be life-threatening - taper gradually',
      'Can cause blackouts and memory loss',
      'Do not drive while affected',
      'Short-acting - may cause interdose withdrawal'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C17H13ClN4',
      molecularWeight: '308.76 g/mol',
      class: 'Triazolobenzodiazepine'
    },
    history: 'Alprazolam was first synthesized in 1969 and approved in the US in 1981. It became the most prescribed benzodiazepine in the US.',
    routes: ['Oral', 'Sublingual', 'Insufflation', 'Rectal'],
    afterEffects: 'Sedation, possible amnesia. Withdrawal symptoms can include seizures.',
    riskLevel: 'high',
    aliases: ['8-chloro-1-methyl-6-phenyl-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine']
  },
  {
    id: 'clonazepam',
    name: 'Clonazepam',
    commonNames: ['Klonopin', 'K-Pins', 'Klonos', 'Benzo'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Clonazepam is a long-acting benzodiazepine used for seizures, panic disorder, and anxiety. It has high potency and a long half-life of 30-40 hours. Clonazepam acts on GABA-A receptors and is known for its effectiveness in preventing seizures.',
    effects: {
      positive: ['Anxiety relief', 'Seizure prevention', 'Panic attack relief', 'Muscle relaxation', 'Sleep improvement'],
      neutral: ['Sedation', 'Impaired coordination', 'Memory impairment', 'Dizziness'],
      negative: ['Addiction potential', 'Withdrawal syndrome', 'Depression', 'Cognitive impairment with long-term use', 'Overdose risk with other depressants']
    },
    dosage: {
      threshold: '0.25-0.5mg',
      light: '0.5-1mg',
      common: '1-2mg',
      strong: '2-4mg',
      heavy: '4mg+'
    },
    duration: {
      onset: '20-60 minutes (oral)',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '8-12 hours',
      total: '12-48 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants', 'Phenytoin', 'Carbamazepine'],
    harmReduction: [
      'Long half-life means accumulation with regular dosing',
      'Never combine with opioids or alcohol',
      'Taper gradually to avoid withdrawal seizures',
      'Can cause depression with long-term use',
      'Do not stop abruptly if taking regularly'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C15H10ClN3O3',
      molecularWeight: '315.71 g/mol',
      class: 'Nitrobenzodiazepine'
    },
    history: 'Clonazepam was patented in 1960 and approved in the US in 1975. It has been widely used for seizure disorders.',
    routes: ['Oral', 'Intravenous', 'Intramuscular'],
    afterEffects: 'Long duration of action. Withdrawal can be prolonged due to long half-life.',
    riskLevel: 'moderate',
    aliases: ['5-(2-chlorophenyl)-7-nitro-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'lorazepam',
    name: 'Lorazepam',
    commonNames: ['Ativan', 'Lorrie', 'Temesta'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Lorazepam is a intermediate-acting benzodiazepine used for anxiety, insomnia, seizures, and alcohol withdrawal. It has moderate potency and is commonly used in hospital settings. Lorazepam is metabolized by glucuronidation, making it suitable for patients with liver impairment.',
    effects: {
      positive: ['Anxiety relief', 'Sedation', 'Seizure control', 'Alcohol withdrawal management', 'Sleep induction'],
      neutral: ['Impaired coordination', 'Memory impairment', 'Dizziness', 'Weakness'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Respiratory depression with other depressants', 'Paradoxical reactions']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-4mg',
      strong: '4-6mg',
      heavy: '6mg+'
    },
    duration: {
      onset: '15-45 minutes (oral), 1-5 minutes (IV)',
      comeup: '30-90 minutes',
      peak: '2-4 hours',
      offset: '6-10 hours',
      total: '8-24 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants', 'Probenecid', 'Valproate'],
    harmReduction: [
      'Common in hospital settings for withdrawal management',
      'Never combine with opioids or alcohol',
      'Taper gradually when discontinuing',
      'Less affected by liver problems than other benzodiazepines',
      'Can cause prolonged sedation in elderly'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C15H10Cl2N2O2',
      molecularWeight: '321.16 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Lorazepam was developed in 1963 and approved in the US in 1977. It has become a standard medication for alcohol withdrawal.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Sublingual'],
    afterEffects: 'Sedation, possible amnesia. Withdrawal symptoms similar to other benzodiazepines.',
    riskLevel: 'moderate',
    aliases: ['7-chloro-5-(2-chlorophenyl)-3-hydroxy-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'diazepam',
    name: 'Diazepam',
    commonNames: ['Valium', 'Vallies', 'Blues', 'Yellows'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Diazepam is a long-acting benzodiazepine used for anxiety, muscle spasms, seizures, and alcohol withdrawal. It has active metabolites that extend its duration of action. Diazepam is a prototype benzodiazepine that has been widely used since the 1960s.',
    effects: {
      positive: ['Anxiety relief', 'Muscle relaxation', 'Seizure prevention', 'Sleep induction', 'Alcohol withdrawal relief'],
      neutral: ['Sedation', 'Impaired coordination', 'Memory impairment', 'Dizziness'],
      negative: ['Addiction potential', 'Withdrawal syndrome', 'Cognitive impairment', 'Overdose risk with depressants', 'Long-acting metabolites']
    },
    dosage: {
      threshold: '2-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-40mg',
      heavy: '40mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-90 minutes',
      peak: '1-2 hours',
      offset: '12-24 hours',
      total: '24-48+ hours (with metabolites)'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants', 'Cimetidine', 'Omeprazole', 'Fluoxetine'],
    harmReduction: [
      'Very long half-life with active metabolites',
      'Never combine with opioids or alcohol',
      'Accumulates with regular dosing',
      'Taper very gradually - active metabolites complicate withdrawal',
      'Be aware of drug interactions - many affect diazepam levels'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C16H13ClN2O',
      molecularWeight: '284.74 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Diazepam was synthesized in 1959 and approved in 1963. It became one of the best-selling drugs in history.',
    routes: ['Oral', 'Intravenous', 'Intramuscular', 'Rectal'],
    afterEffects: 'Prolonged sedation due to active metabolites. Withdrawal can be extended.',
    riskLevel: 'moderate',
    aliases: ['7-chloro-1-methyl-5-phenyl-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'temazepam',
    name: 'Temazepam',
    commonNames: ['Restoril', 'Euhypnos', 'Normison', 'Jellies', 'Eggs'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Temazepam is an intermediate-acting benzodiazepine used primarily for insomnia. It has a relatively short half-life of 8-20 hours, making it suitable for sleep induction and maintenance without excessive next-day sedation.',
    effects: {
      positive: ['Sleep induction', 'Sleep maintenance', 'Anxiety relief'],
      neutral: ['Sedation', 'Impaired coordination', 'Memory impairment'],
      negative: ['Dependency potential', 'Withdrawal symptoms', 'Complex sleep behaviors', 'Daytime drowsiness', 'Rebound insomnia']
    },
    dosage: {
      threshold: '7.5-15mg',
      light: '15-22.5mg',
      common: '22.5-30mg',
      strong: '30-45mg',
      heavy: '45mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Use only when you have 7-8 hours for sleep',
      'Never combine with alcohol',
      'Can cause sleep behaviors like sleep-walking',
      'Tolerance develops with regular use',
      'Avoid long-term use - dependence risk'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C16H13ClN2O2',
      molecularWeight: '300.74 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Temazepam was developed in 1964 and approved in the US in 1981. It has been widely used for insomnia.',
    routes: ['Oral'],
    afterEffects: 'Possible morning drowsiness. Rebound insomnia on discontinuation.',
    riskLevel: 'moderate',
    aliases: ['7-chloro-3-hydroxy-1-methyl-5-phenyl-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'flunitrazepam',
    name: 'Flunitrazepam',
    commonNames: ['Rohypnol', 'Roofies', 'Rophies', 'La Rocha', 'Forget Pill'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Flunitrazepam is a potent intermediate-acting benzodiazepine with strong amnesic properties. It is known for its association with drug-facilitated sexual assault due to its ability to cause profound amnesia. Flunitrazepam is not approved for medical use in the US.',
    effects: {
      positive: ['Strong sedation', 'Sleep induction', 'Anxiety relief'],
      neutral: ['Profound amnesia', 'Impaired coordination', 'Muscle relaxation'],
      negative: ['High addiction potential', 'Severe amnesia (can last hours)', 'Dangerous with alcohol', 'Withdrawal seizures', 'Date rape association']
    },
    dosage: {
      threshold: '0.25-0.5mg',
      light: '0.5-1mg',
      common: '1-2mg',
      strong: '2-4mg',
      heavy: '4mg+'
    },
    duration: {
      onset: '15-30 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '4-8 hours',
      total: '8-12 hours'
    },
    interactions: ['Alcohol (extremely dangerous)', 'Opioids', 'Other benzodiazepines', 'All CNS depressants'],
    harmReduction: [
      'Extremely potent - 10x stronger than diazepam',
      'Can cause complete amnesia for hours',
      'NEVER combine with alcohol',
      'Watch your drink in social settings',
      'High dependence potential',
      'Not legally available in many countries'
    ],
    legality: 'Not approved in the US. Schedule IV internationally but Schedule I in some states. Controlled worldwide.',
    chemistry: {
      formula: 'C16H12FN3O3',
      molecularWeight: '313.28 g/mol',
      class: 'Nitrobenzodiazepine'
    },
    history: 'Flunitrazepam was developed in the 1970s and used in Europe for insomnia. It became infamous as a date rape drug.',
    routes: ['Oral'],
    afterEffects: 'Prolonged sedation, amnesia. Withdrawal can be severe.',
    riskLevel: 'high',
    aliases: ['5-(2-fluorophenyl)-1-methyl-7-nitro-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    commonNames: ['Versed', 'Dormicum', 'Hypnovel', 'Midaz'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Midazolam is a short-acting benzodiazepine used primarily for procedural sedation and anesthesia. It has very rapid onset and produces profound amnesia. Midazolam is water-soluble, making it suitable for injection.',
    effects: {
      positive: ['Rapid sedation', 'Anxiolysis', 'Profound amnesia (beneficial for procedures)'],
      neutral: ['Impaired coordination', 'Slurred speech', 'Drowsiness'],
      negative: ['Respiratory depression', 'High addiction potential', 'Severe amnesia', 'Overdose risk', 'Paradoxical reactions']
    },
    dosage: {
      threshold: '1-2mg (IV)',
      light: '2-5mg (IV)',
      common: '5-10mg (IV)',
      strong: '10-20mg (IV)',
      heavy: '20mg+ (IV)'
    },
    duration: {
      onset: '1-5 minutes (IV), 10-20 minutes (oral)',
      comeup: '5-15 minutes',
      peak: '15-30 minutes',
      offset: '1-2 hours',
      total: '2-6 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'All CNS depressants', 'CYP3A4 inhibitors'],
    harmReduction: [
      'Should only be used in medical settings',
      'Can cause respiratory arrest',
      'Profound amnesia - you may not remember anything',
      'Never combine with other depressants',
      'Requires monitoring for respiratory depression'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US. Typically restricted to hospital use.',
    chemistry: {
      formula: 'C18H13ClFN3',
      molecularWeight: '325.77 g/mol',
      class: 'Imidazobenzodiazepine'
    },
    history: 'Midazolam was developed in the 1970s and approved in the US in 1985. It has become standard for procedural sedation.',
    routes: ['Intravenous', 'Intramuscular', 'Oral', 'Intranasal', 'Rectal'],
    afterEffects: 'Amnesia, possible prolonged sedation. Short duration of action.',
    riskLevel: 'high',
    aliases: ['8-chloro-6-(2-fluorophenyl)-1-methyl-4H-imidazo[1,5-a][1,4]benzodiazepine']
  },
  {
    id: 'clonazolam',
    name: 'Clonazolam',
    commonNames: ['Clam', 'C-Lam', 'Clonitrazolam'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Clonazolam is a designer benzodiazepine that is a hybrid of clonazepam and alprazolam. It is extremely potent, estimated at 2.5x stronger than clonazepam. Clonazolam has appeared as a research chemical and has no approved medical use.',
    effects: {
      positive: ['Extreme sedation', 'Anxiety relief', 'Muscle relaxation'],
      neutral: ['Strong amnesia', 'Impaired coordination', 'Dizziness'],
      negative: ['Very high addiction potential', 'Severe amnesia', 'Blackouts', 'Long withdrawal', 'High overdose risk']
    },
    dosage: {
      threshold: '0.1-0.25mg',
      light: '0.25-0.5mg',
      common: '0.5-1mg',
      strong: '1-2mg',
      heavy: '2mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '6-12 hours',
      total: '10-18 hours'
    },
    interactions: ['Alcohol (dangerous)', 'Opioids', 'Other benzodiazepines', 'All CNS depressants'],
    harmReduction: [
      'EXTREMELY potent - use volumetric dosing',
      'Can cause complete blackouts',
      'Never use with alcohol or opioids',
      'Long half-life - can accumulate',
      'Severe withdrawal risk',
      'No approved medical use - limited research'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C17H12ClN5O2',
      molecularWeight: '353.76 g/mol',
      class: 'Triazolobenzodiazepine'
    },
    history: 'Clonazolam was first synthesized in the 1970s but was never marketed medically. It appeared as a research chemical in the 2010s.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Prolonged sedation, amnesia. Withdrawal can be severe and prolonged.',
    riskLevel: 'high',
    aliases: ['6-(2-chlorophenyl)-1-methyl-8-nitro-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine']
  },
  {
    id: 'flualprazolam',
    name: 'Flualprazolam',
    commonNames: ['Flualp', 'Flam', 'F-Lam'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Flualprazolam is a designer benzodiazepine similar to alprazolam but with a fluorine substitution. It is more potent than alprazolam and has appeared as a research chemical. Flualprazolam has no approved medical use.',
    effects: {
      positive: ['Anxiety relief', 'Sedation', 'Muscle relaxation'],
      neutral: ['Amnesia', 'Impaired coordination', 'Dizziness'],
      negative: ['High addiction potential', 'Blackouts', 'Overdose risk with depressants', 'Withdrawal syndrome']
    },
    dosage: {
      threshold: '0.25-0.5mg',
      light: '0.5-1mg',
      common: '1-2mg',
      strong: '2-3mg',
      heavy: '3mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'More potent than alprazolam - dose carefully',
      'Can cause significant amnesia',
      'Never combine with alcohol or opioids',
      'Use volumetric dosing for accuracy',
      'No approved medical use'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C17H12ClFN4',
      molecularWeight: '326.76 g/mol',
      class: 'Triazolobenzodiazepine'
    },
    history: 'Flualprazolam was synthesized in the 1970s but never marketed. It appeared as a research chemical in the 2010s.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Sedation, possible amnesia. Withdrawal similar to other benzodiazepines.',
    riskLevel: 'high',
    aliases: ['8-chloro-6-(2-fluorophenyl)-1-methyl-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine']
  },
  {
    id: 'flubromazepam',
    name: 'Flubromazepam',
    commonNames: ['Flubro', 'FB'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Flubromazepam is a long-acting designer benzodiazepine with a bromine substitution. It has a very long half-life of over 100 hours, leading to significant accumulation with regular dosing. Flubromazepam has no approved medical use.',
    effects: {
      positive: ['Anxiety relief', 'Sedation', 'Muscle relaxation'],
      neutral: ['Long duration', 'Impaired coordination', 'Memory impairment'],
      negative: ['Very long half-life causes accumulation', 'Addiction potential', 'Prolonged withdrawal', 'Overdose risk']
    },
    dosage: {
      threshold: '1-2mg',
      light: '2-4mg',
      common: '4-8mg',
      strong: '8-12mg',
      heavy: '12mg+'
    },
    duration: {
      onset: '30-90 minutes',
      comeup: '1-3 hours',
      peak: '2-6 hours',
      offset: '12-24 hours',
      total: '24-48+ hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'EXTREMELY long half-life - accumulates with regular use',
      'Effects can last 2+ days',
      'Withdrawal can be very prolonged',
      'Do not redose thinking it\'s worn off',
      'Never combine with other depressants'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C15H10BrFN2',
      molecularWeight: '333.16 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Flubromazepam was first synthesized in the 1960s but never marketed. It appeared as a research chemical around 2012.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Very prolonged sedation. Extended withdrawal due to long half-life.',
    riskLevel: 'moderate',
    aliases: ['7-bromo-5-(2-fluorophenyl)-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'diclazepam',
    name: 'Diclazepam',
    commonNames: ['DCZ', 'Chlorodiazepam', 'Ro5-3448'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Diclazepam is a designer benzodiazepine that is a chlorinated analog of diazepam. It is metabolized to delorazepam, lorazepam, and lormetazepam, giving it a long duration of action. Diclazepam has no approved medical use.',
    effects: {
      positive: ['Anxiety relief', 'Sedation', 'Muscle relaxation'],
      neutral: ['Long duration', 'Impaired coordination', 'Memory impairment'],
      negative: ['Long half-life with active metabolites', 'Addiction potential', 'Accumulation', 'Withdrawal syndrome']
    },
    dosage: {
      threshold: '1-2mg',
      light: '2-4mg',
      common: '4-8mg',
      strong: '8-12mg',
      heavy: '12mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '6-12 hours',
      total: '12-48 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Long-acting with active metabolites',
      'Effects can last 24+ hours',
      'Accumulates with regular dosing',
      'Withdrawal can be prolonged',
      'Do not combine with other depressants'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C16H12Cl2N2O',
      molecularWeight: '319.18 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Diclazepam was synthesized by Hoffman-La Roche in the 1960s but never marketed. It appeared as a research chemical around 2010.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Prolonged sedation. Extended withdrawal possible.',
    riskLevel: 'moderate',
    aliases: ['7-chloro-5-(2-chlorophenyl)-1-methyl-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'flubromazolam',
    name: 'Flubromazolam',
    commonNames: ['Flubro', 'FBM', 'Flubro-M'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Flubromazolam is a very potent designer benzodiazepine, combining features of flubromazepam and alprazolam. It is extremely potent with effects beginning at microgram doses. Flubromazolam has no approved medical use and has caused hospitalizations.',
    effects: {
      positive: ['Extreme sedation', 'Anxiety relief'],
      neutral: ['Profound amnesia', 'Impaired coordination', 'Long duration'],
      negative: ['Very high overdose risk', 'Severe amnesia/blackouts', 'High addiction potential', 'Respiratory depression', 'Long withdrawal']
    },
    dosage: {
      threshold: '0.1-0.25mg',
      light: '0.25-0.5mg',
      common: '0.5-1mg',
      strong: '1-2mg',
      heavy: '2mg+'
    },
    duration: {
      onset: '15-45 minutes',
      comeup: '30-90 minutes',
      peak: '1-3 hours',
      offset: '6-12 hours',
      total: '12-18 hours'
    },
    interactions: ['Alcohol (extremely dangerous)', 'Opioids', 'Other benzodiazepines', 'All CNS depressants'],
    harmReduction: [
      'EXTREMELY potent - use volumetric dosing only',
      'Can cause complete blackouts lasting many hours',
      'Never combine with other depressants',
      'Several hospitalizations reported',
      'Can cause prolonged sedation',
      'High dependence potential'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C17H12BrFN4',
      molecularWeight: '375.21 g/mol',
      class: 'Triazolobenzodiazepine'
    },
    history: 'Flubromazolam appeared as a research chemical around 2012. It has caused several hospitalizations due to its potency.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Prolonged sedation, amnesia. Withdrawal can be severe.',
    riskLevel: 'high',
    aliases: ['8-bromo-6-(2-fluorophenyl)-1-methyl-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine']
  },
  {
    id: 'bromazepam',
    name: 'Bromazepam',
    commonNames: ['Lexotan', 'Lexomil', 'Bromo', 'Bromies'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Bromazepam is an intermediate-acting benzodiazepine used primarily for anxiety. It is particularly effective for somatic manifestations of anxiety and has less sedation than some other benzodiazepines.',
    effects: {
      positive: ['Anxiety relief', 'Muscle relaxation', 'Improved sleep', 'Less sedating than other benzos'],
      neutral: ['Mild sedation', 'Impaired coordination', 'Memory effects'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Cognitive impairment with long-term use', 'Overdose risk with other depressants']
    },
    dosage: {
      threshold: '1.5-3mg',
      light: '3-6mg',
      common: '6-12mg',
      strong: '12-18mg',
      heavy: '18mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-3 hours',
      offset: '4-8 hours',
      total: '8-12 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Less sedating but still carries addiction risk',
      'Never combine with alcohol or opioids',
      'Taper gradually when discontinuing',
      'Not available in the US but common in Europe',
      'Avoid long-term daily use'
    ],
    legality: 'Prescription only. Not available in the US. Available in Europe, Canada, and other countries.',
    chemistry: {
      formula: 'C14H10BrN3O',
      molecularWeight: '316.15 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Bromazepam was developed in the 1960s and has been used medically since 1974. It is popular in Europe.',
    routes: ['Oral'],
    afterEffects: 'Less hangover than some benzodiazepines. Withdrawal similar to other benzos.',
    riskLevel: 'moderate',
    aliases: ['7-bromo-5-pyridin-2-yl-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'nitrazepam',
    name: 'Nitrazepam',
    commonNames: ['Mogadon', 'Nitrados', 'Nitrosun', 'Nitzies'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Nitrazepam is a long-acting benzodiazepine used primarily for insomnia. It has a relatively long half-life of 15-38 hours, which can cause next-day sedation. Nitrazepam is also used for seizures in some cases.',
    effects: {
      positive: ['Sleep induction', 'Sleep maintenance', 'Anxiety relief', 'Seizure control'],
      neutral: ['Sedation', 'Impaired coordination', 'Memory impairment', 'Next-day drowsiness'],
      negative: ['Addiction potential', 'Withdrawal syndrome', 'Falls in elderly', 'Respiratory depression', 'Long half-life']
    },
    dosage: {
      threshold: '2.5-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-30mg',
      heavy: '30mg+'
    },
    duration: {
      onset: '20-50 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '8-12 hours',
      total: '12-24 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants', 'Cimetidine'],
    harmReduction: [
      'Long half-life can cause next-day impairment',
      'Never combine with alcohol or opioids',
      'Caution in elderly - fall risk',
      'Taper gradually when discontinuing',
      'Not available in the US'
    ],
    legality: 'Prescription only. Not available in the US. Available in UK, Australia, and other countries.',
    chemistry: {
      formula: 'C15H11N3O3',
      molecularWeight: '281.27 g/mol',
      class: 'Nitrobenzodiazepine'
    },
    history: 'Nitrazepam was first synthesized in the 1950s and has been used medically since 1965.',
    routes: ['Oral'],
    afterEffects: 'Next-day drowsiness common. Withdrawal similar to other benzodiazepines.',
    riskLevel: 'moderate',
    aliases: ['7-nitro-5-phenyl-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'flunitrazolam',
    name: 'Flunitrazolam',
    commonNames: ['FNTZ', 'Fluni-T'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Flunitrazolam is an extremely potent designer benzodiazepine combining features of flunitrazepam and triazolam. It is active in microgram doses and has no approved medical use. Flunitrazolam is known for causing profound amnesia.',
    effects: {
      positive: ['Extreme sedation', 'Anxiety relief', 'Muscle relaxation'],
      neutral: ['Profound amnesia', 'Impaired coordination', 'Long duration'],
      negative: ['Very high overdose risk', 'Complete blackouts', 'High addiction potential', 'Respiratory depression', 'Dangerous withdrawal']
    },
    dosage: {
      threshold: '0.05-0.1mg',
      light: '0.1-0.25mg',
      common: '0.25-0.5mg',
      strong: '0.5-1mg',
      heavy: '1mg+'
    },
    duration: {
      onset: '10-30 minutes',
      comeup: '20-45 minutes',
      peak: '1-2 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Alcohol (extremely dangerous)', 'Opioids', 'Other benzodiazepines', 'All CNS depressants'],
    harmReduction: [
      'ONE OF THE MOST POTENT BENZODIAZEPINES',
      'Active at microgram doses - volumetric dosing essential',
      'Can cause complete blackouts',
      'Never combine with any other depressants',
      'High risk of accidental overdose',
      'No medical use - limited safety data'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C17H13FN6O2',
      molecularWeight: '352.32 g/mol',
      class: 'Triazolobenzodiazepine'
    },
    history: 'Flunitrazolam appeared as a research chemical in the 2010s. It is notable for its extreme potency.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Prolonged sedation, amnesia. Severe withdrawal risk.',
    riskLevel: 'high',
    aliases: ['6-(2-fluorophenyl)-1-methyl-8-nitro-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine']
  },
  {
    id: 'deschloroetizolam',
    name: 'Deschloroetizolam',
    commonNames: ['DCE', 'Etizolam-2', 'DCZ'],
    category: 'depressants',
    class: 'Thienodiazepine',
    description: 'Deschloroetizolam is a designer thienodiazepine closely related to etizolam, missing the chlorine atom. It has similar effects to etizolam but with a longer duration and slightly lower potency.',
    effects: {
      positive: ['Anxiety relief', 'Sedation', 'Muscle relaxation', 'Sleep induction'],
      neutral: ['Amnesia', 'Impaired coordination', 'Dizziness'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Longer duration than etizolam', 'Overdose risk with depressants']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-4mg',
      strong: '4-6mg',
      heavy: '6mg+'
    },
    duration: {
      onset: '20-45 minutes',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '4-8 hours',
      total: '8-14 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Longer duration than etizolam - plan accordingly',
      'Never combine with alcohol or opioids',
      'Use volumetric dosing for accuracy',
      'Can cause significant amnesia',
      'No approved medical use'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C17H15N4S',
      molecularWeight: '307.39 g/mol',
      class: 'Thienodiazepine'
    },
    history: 'Deschloroetizolam appeared as a research chemical alternative to etizolam around 2014.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Sedation, possible amnesia. Withdrawal similar to etizolam.',
    riskLevel: 'moderate',
    aliases: ['2-ethyl-9-methyl-6-phenyl-4H-thieno[3,2-f][1,2,4]triazolo[4,3-a][1,4]diazepine']
  },
  {
    id: 'metizolam',
    name: 'Metizolam',
    commonNames: ['MTZ', 'Methylizolam'],
    category: 'depressants',
    class: 'Thienodiazepine',
    description: 'Metizolam is a designer thienodiazepine related to etizolam. It is the N-methyl analog of deschloroetizolam. Metizolam has similar effects to etizolam but with lower potency.',
    effects: {
      positive: ['Anxiety relief', 'Sedation', 'Muscle relaxation'],
      neutral: ['Amnesia', 'Impaired coordination', 'Dizziness'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Overdose risk with other depressants']
    },
    dosage: {
      threshold: '1-2mg',
      light: '2-4mg',
      common: '4-8mg',
      strong: '8-12mg',
      heavy: '12mg+'
    },
    duration: {
      onset: '20-45 minutes',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '4-8 hours',
      total: '8-12 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Lower potency than etizolam',
      'Never combine with alcohol or opioids',
      'Use accurate measurement',
      'Can cause amnesia',
      'No approved medical use'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C16H13N4S',
      molecularWeight: '293.37 g/mol',
      class: 'Thienodiazepine'
    },
    history: 'Metizolam appeared as a research chemical in the 2010s.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Sedation, possible amnesia. Withdrawal similar to other thienodiazepines.',
    riskLevel: 'moderate',
    aliases: ['2-methyl-9-ethyl-6-phenyl-4H-thieno[3,2-f][1,2,4]triazolo[4,3-a][1,4]diazepine']
  },
  {
    id: 'pyrazolam',
    name: 'Pyrazolam',
    commonNames: ['PZM', 'Pyraz'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Pyrazolam is a designer benzodiazepine developed in the 1970s but never marketed. It is known for being highly selective for α1 and α5 GABA-A subunits, giving it strong anxiolytic effects with relatively less sedation.',
    effects: {
      positive: ['Strong anxiety relief', 'Less sedation than other benzos', 'Muscle relaxation'],
      neutral: ['Mild sedation', 'Impaired coordination', 'Memory effects'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Can still cause overdose with other depressants']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-4mg',
      strong: '4-6mg',
      heavy: '6mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-3 hours',
      offset: '3-6 hours',
      total: '6-8 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Less sedating but still addictive',
      'Never combine with alcohol or opioids',
      'Primarily anxiolytic with less sedation',
      'Use accurate measurement',
      'No approved medical use'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C16H12BrN5',
      molecularWeight: '354.20 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Pyrazolam was developed in the 1970s but never marketed. It appeared as a research chemical around 2012.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Less hangover than some benzodiazepines. Withdrawal similar to other benzos.',
    riskLevel: 'moderate',
    aliases: ['8-bromo-1-methyl-6-phenyl-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine']
  },
  {
    id: 'lormetazepam',
    name: 'Lormetazepam',
    commonNames: ['Noctamid', 'Lormeta', 'Lorm'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Lormetazepam is a short to intermediate-acting benzodiazepine used for insomnia. It is the N-methylated analog of lorazepam and has similar properties with a slightly shorter duration.',
    effects: {
      positive: ['Sleep induction', 'Anxiety relief', 'Muscle relaxation'],
      neutral: ['Sedation', 'Impaired coordination', 'Memory impairment'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Daytime drowsiness', 'Overdose risk with other depressants']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-4mg',
      strong: '4-6mg',
      heavy: '6mg+'
    },
    duration: {
      onset: '15-45 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Use only when you have time for full sleep',
      'Never combine with alcohol or opioids',
      'Can cause next-day drowsiness',
      'Taper gradually when discontinuing',
      'Not available in the US'
    ],
    legality: 'Prescription only. Not available in the US. Available in Europe and other countries.',
    chemistry: {
      formula: 'C16H12Cl2N2O2',
      molecularWeight: '335.18 g/mol',
      class: 'Benzodiazepine'
    },
    history: 'Lormetazepam was developed in the 1960s and has been used medically since the 1970s.',
    routes: ['Oral'],
    afterEffects: 'Possible morning drowsiness. Withdrawal similar to other benzodiazepines.',
    riskLevel: 'moderate',
    aliases: ['6-chloro-5-(2-chlorophenyl)-3-hydroxy-1-methyl-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },
  {
    id: 'nifoxipam',
    name: 'Nifoxipam',
    commonNames: ['NFX', 'N-Desmethylflunitrazepam'],
    category: 'depressants',
    class: 'Benzodiazepine',
    description: 'Nifoxipam is a designer benzodiazepine that is the 3-hydroxy metabolite of flunitrazepam. It has similar effects to flunitrazepam but is less potent. Nifoxipam has no approved medical use.',
    effects: {
      positive: ['Sedation', 'Anxiety relief', 'Sleep induction'],
      neutral: ['Amnesia', 'Impaired coordination', 'Long duration'],
      negative: ['Addiction potential', 'Withdrawal symptoms', 'Overdose risk with other depressants']
    },
    dosage: {
      threshold: '0.5-1mg',
      light: '1-2mg',
      common: '2-4mg',
      strong: '4-6mg',
      heavy: '6mg+'
    },
    duration: {
      onset: '20-45 minutes',
      comeup: '30-90 minutes',
      peak: '1-3 hours',
      offset: '4-8 hours',
      total: '8-12 hours'
    },
    interactions: ['Alcohol', 'Opioids', 'Other benzodiazepines', 'CNS depressants'],
    harmReduction: [
      'Related to flunitrazepam - can cause amnesia',
      'Never combine with alcohol or opioids',
      'Use accurate measurement',
      'Limited research available',
      'No approved medical use'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some countries. Not approved for medical use.',
    chemistry: {
      formula: 'C15H10FN3O4',
      molecularWeight: '315.26 g/mol',
      class: 'Nitrobenzodiazepine'
    },
    history: 'Nifoxipam appeared as a research chemical in the 2010s.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Sedation, possible amnesia. Withdrawal similar to other benzodiazepines.',
    riskLevel: 'moderate',
    aliases: ['5-(2-fluorophenyl)-3-hydroxy-7-nitro-1,3-dihydro-2H-1,4-benzodiazepin-2-one']
  },

  // ============================================
  // STIMULANTS
  // ============================================
  {
    id: 'amphetamine',
    name: 'Amphetamine',
    commonNames: ['Adderall', 'Speed', 'Dexedrine', 'Uppers', 'Bennies'],
    category: 'stimulants',
    class: 'Phenethylamine',
    description: 'Amphetamine is a central nervous system stimulant that increases the activity of dopamine, norepinephrine, and serotonin in the brain. It is used medically for ADHD and narcolepsy. Amphetamine produces increased energy, focus, and euphoria, with significant potential for abuse and dependence.',
    effects: {
      positive: ['Increased alertness and energy', 'Enhanced focus and concentration', 'Euphoria', 'Decreased appetite', 'Increased motivation'],
      neutral: ['Increased heart rate and blood pressure', 'Dilated pupils', 'Dry mouth', 'Sweating', 'Insomnia'],
      negative: ['Anxiety and paranoia', 'Addiction potential', 'Cardiovascular stress', 'Weight loss', 'Psychosis with heavy use', 'Depression during withdrawal', 'Sleep disruption']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-25mg',
      common: '25-50mg',
      strong: '50-100mg',
      heavy: '100mg+'
    },
    duration: {
      onset: '20-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '2-4 hours',
      total: '4-8 hours'
    },
    interactions: ['MAOIs (dangerous)', 'SSRIs', 'Other stimulants', 'Alcohol', 'Benzodiazepines', 'Antipsychotics'],
    harmReduction: [
      'Stay hydrated but do not over-hydrate',
      'Avoid use if you have heart conditions',
      'Do not mix with other stimulants or alcohol',
      'Be aware of addiction potential',
      'Get adequate sleep and nutrition',
      'Avoid daily use to prevent tolerance and dependence'
    ],
    legality: 'Schedule II controlled substance in the US. Prescription only for ADHD and narcolepsy.',
    chemistry: {
      formula: 'C9H13N',
      molecularWeight: '135.21 g/mol',
      class: 'Phenethylamine'
    },
    history: 'Amphetamine was first synthesized in 1887. It was used militarily in WWII and became widely prescribed in the 20th century before restrictions were implemented.',
    routes: ['Oral', 'Insufflation', 'Smoking', 'Intravenous'],
    afterEffects: 'Comedown can include depression, fatigue, and cravings. Sleep disruption common.',
    riskLevel: 'moderate',
    aliases: ['alpha-methylphenethylamine', 'racemic amphetamine']
  },
  {
    id: 'dextroamphetamine',
    name: 'Dextroamphetamine',
    commonNames: ['Dexedrine', 'Dexies', 'Dextrostat', 'Dex'],
    category: 'stimulants',
    class: 'Phenethylamine',
    description: 'Dextroamphetamine is the dextrorotatory isomer of amphetamine. It is more potent as a CNS stimulant than levoamphetamine and is used medically for ADHD and narcolepsy. Dextroamphetamine produces stronger central effects with fewer peripheral side effects than racemic amphetamine.',
    effects: {
      positive: ['Increased focus and concentration', 'Enhanced energy', 'Euphoria', 'Alertness', 'Decreased appetite'],
      neutral: ['Increased heart rate', 'Dry mouth', 'Insomnia', 'Sweating'],
      negative: ['Addiction potential', 'Anxiety', 'Cardiovascular stress', 'Withdrawal symptoms', 'Psychosis at high doses']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-60mg',
      heavy: '60mg+'
    },
    duration: {
      onset: '20-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '2-4 hours',
      total: '4-8 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Other stimulants', 'Alcohol', 'Antipsychotics'],
    harmReduction: [
      'More potent than racemic amphetamine',
      'Stay hydrated',
      'Avoid use with heart conditions',
      'Do not mix with other stimulants',
      'Be aware of addiction potential'
    ],
    legality: 'Schedule II controlled substance in the US. Prescription only.',
    chemistry: {
      formula: 'C9H13N',
      molecularWeight: '135.21 g/mol',
      class: 'Phenethylamine'
    },
    history: 'Dextroamphetamine was developed in the early 20th century and has been used medically since the 1930s.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Comedown with fatigue and possible depression. Sleep disruption.',
    riskLevel: 'moderate',
    aliases: ['(S)-amphetamine', 'd-amphetamine']
  },
  {
    id: 'lisdexamfetamine',
    name: 'Lisdexamfetamine',
    commonNames: ['Vyvanse', 'Lisdex', 'LDX'],
    category: 'stimulants',
    class: 'Prodrug',
    description: 'Lisdexamfetamine is a prodrug of dextroamphetamine, attached to the amino acid lysine. It must be metabolized in the body to become active, which provides a delayed onset and longer duration. This design reduces abuse potential compared to immediate-release amphetamines.',
    effects: {
      positive: ['Improved focus and concentration', 'Long-lasting energy', 'Lower abuse potential than other amphetamines', 'Euphoria'],
      neutral: ['Long duration', 'Gradual onset', 'Insomnia if taken late'],
      negative: ['Addiction potential', 'Appetite suppression', 'Cardiovascular effects', 'Anxiety']
    },
    dosage: {
      threshold: '10-20mg',
      light: '20-40mg',
      common: '40-70mg',
      strong: '70-100mg',
      heavy: '100mg+'
    },
    duration: {
      onset: '45-90 minutes',
      comeup: '1-2 hours',
      peak: '3-5 hours',
      offset: '3-5 hours',
      total: '10-14 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Other stimulants', 'Alcohol', 'Antacids (affect absorption)'],
    harmReduction: [
      'Prodrug - takes longer to kick in, be patient',
      'Do not snort - requires metabolism to work',
      'Long duration - plan accordingly',
      'Less abuse potential but still addictive',
      'Do not take late in day to avoid sleep issues'
    ],
    legality: 'Schedule II controlled substance in the US. Prescription only.',
    chemistry: {
      formula: 'C15H25N3O',
      molecularWeight: '263.38 g/mol',
      class: 'Prodrug'
    },
    history: 'Lisdexamfetamine was developed to reduce abuse potential and was approved in the US in 2007.',
    routes: ['Oral'],
    afterEffects: 'Gradual comedown. Less crash than immediate-release amphetamines.',
    riskLevel: 'moderate',
    aliases: ['L-lysine-dextroamphetamine']
  },
  {
    id: 'methylphenidate',
    name: 'Methylphenidate',
    commonNames: ['Ritalin', 'Concerta', 'Focalin', 'Speed', 'Vitamin R'],
    category: 'stimulants',
    class: 'Piperidine',
    description: 'Methylphenidate is a CNS stimulant used primarily for ADHD. It works by blocking the reuptake of dopamine and norepinephrine. Methylphenidate is structurally different from amphetamine but produces similar effects. It has significant abuse potential.',
    effects: {
      positive: ['Improved focus and attention', 'Increased energy', 'Euphoria', 'Wakefulness', 'Decreased appetite'],
      neutral: ['Increased heart rate and blood pressure', 'Dry mouth', 'Insomnia', 'Sweating'],
      negative: ['Addiction potential', 'Anxiety and nervousness', 'Cardiovascular effects', 'Psychosis at high doses', 'Withdrawal symptoms']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-60mg',
      heavy: '60mg+'
    },
    duration: {
      onset: '15-30 minutes (IR)',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '2-3 hours',
      total: '3-5 hours (IR)'
    },
    interactions: ['MAOIs (dangerous)', 'SSRIs', 'Other stimulants', 'Alcohol', 'Antipsychotics', 'Anticonvulsants'],
    harmReduction: [
      'Stay hydrated',
      'Avoid use with heart conditions',
      'Do not crush extended-release formulations',
      'Be aware of addiction potential',
      'Do not mix with other stimulants',
      'Take early in day to avoid sleep disruption'
    ],
    legality: 'Schedule II controlled substance in the US. Prescription only.',
    chemistry: {
      formula: 'C14H19NO2',
      molecularWeight: '233.31 g/mol',
      class: 'Piperidine derivative'
    },
    history: 'Methylphenidate was first synthesized in 1944 and approved for medical use in the US in 1955. It became widely used for ADHD starting in the 1960s.',
    routes: ['Oral', 'Insufflation', 'Intravenous'],
    afterEffects: 'Comedown can include fatigue, depression, and irritability.',
    riskLevel: 'moderate',
    aliases: ['methyl 2-phenyl-2-(piperidin-2-yl)acetate']
  },
  {
    id: 'dexmethylphenidate',
    name: 'Dexmethylphenidate',
    commonNames: ['Focalin', 'Focalin XR', 'd-MPH'],
    category: 'stimulants',
    class: 'Piperidine',
    description: 'Dexmethylphenidate is the dextrorotatory isomer of methylphenidate. It is the pharmacologically active isomer and is approximately twice as potent as racemic methylphenidate. It is used for ADHD treatment.',
    effects: {
      positive: ['Improved focus', 'Increased energy', 'More potent than racemic MPH', 'Euphoria'],
      neutral: ['Increased heart rate', 'Insomnia', 'Dry mouth'],
      negative: ['Addiction potential', 'Anxiety', 'Cardiovascular effects', 'Withdrawal']
    },
    dosage: {
      threshold: '2.5-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-30mg',
      heavy: '30mg+'
    },
    duration: {
      onset: '15-30 minutes (IR)',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '2-3 hours',
      total: '3-5 hours'
    },
    interactions: ['MAOIs', 'SSRIs', 'Other stimulants', 'Alcohol'],
    harmReduction: [
      'Twice as potent as regular methylphenidate',
      'Use lower doses',
      'Same precautions as methylphenidate',
      'Be aware of addiction potential'
    ],
    legality: 'Schedule II controlled substance in the US. Prescription only.',
    chemistry: {
      formula: 'C14H19NO2',
      molecularWeight: '233.31 g/mol',
      class: 'Piperidine derivative'
    },
    history: 'Dexmethylphenidate was developed to provide a more targeted treatment with fewer side effects. Approved in the US in 2001.',
    routes: ['Oral'],
    afterEffects: 'Similar to methylphenidate but potentially smoother.',
    riskLevel: 'moderate',
    aliases: ['(R)-methylphenidate', 'd-threo-methylphenidate']
  },
  {
    id: 'modafinil',
    name: 'Modafinil',
    commonNames: ['Provigil', 'Moda', 'Modalert', 'Smart Drug'],
    category: 'stimulants',
    class: 'Eugeroic',
    description: 'Modafinil is a wakefulness-promoting agent used for narcolepsy, shift work sleep disorder, and sleep apnea. It has a unique mechanism involving orexin/hypocretin systems and weak dopamine reuptake inhibition. Modafinil is popular off-label as a cognitive enhancer.',
    effects: {
      positive: ['Wakefulness', 'Improved focus', 'Cognitive enhancement', 'Mood elevation', 'No significant crash'],
      neutral: ['Mild stimulation', 'Decreased appetite', 'Headache'],
      negative: ['Insomnia if taken late', 'Anxiety', 'Skin reactions (rare but serious)', 'Dependency potential (low)']
    },
    dosage: {
      threshold: '50-100mg',
      light: '100-200mg',
      common: '200-400mg',
      strong: '400-600mg',
      heavy: '600mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-8 hours',
      total: '12-15 hours'
    },
    interactions: ['Hormonal contraceptives (reduced effectiveness)', 'CYP2C19 substrates', 'CYP3A4 inducers', 'Alcohol'],
    harmReduction: [
      'Take early in morning - long half-life affects sleep',
      'Stay hydrated',
      'Can reduce effectiveness of birth control',
      'Less abuse potential than traditional stimulants',
      'Watch for skin rashes - seek medical attention if severe'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C15H15NO2S',
      molecularWeight: '273.35 g/mol',
      class: 'Sulfinylacetamide'
    },
    history: 'Modafinil was developed in France in the 1970s and approved in the US in 1998. It has gained popularity as a "smart drug" for cognitive enhancement.',
    routes: ['Oral'],
    afterEffects: 'Possible insomnia if taken late. Generally no significant crash.',
    riskLevel: 'low',
    aliases: ['2-[(diphenylmethyl)sulfinyl]acetamide']
  },
  {
    id: 'armodafinil',
    name: 'Armodafinil',
    commonNames: ['Nuvigil', 'Armoda', 'R-modafinil'],
    category: 'stimulants',
    class: 'Eugeroic',
    description: 'Armodafinil is the R-enantiomer of modafinil, with a longer half-life than the racemic mixture. It provides more sustained wakefulness and is used for the same conditions as modafinil.',
    effects: {
      positive: ['Long-lasting wakefulness', 'Improved focus', 'Cognitive enhancement', 'More sustained effect than modafinil'],
      neutral: ['Mild stimulation', 'Decreased appetite', 'Headache'],
      negative: ['Insomnia if taken late', 'Anxiety', 'Longer duration can affect sleep more']
    },
    dosage: {
      threshold: '50-75mg',
      light: '75-150mg',
      common: '150-250mg',
      strong: '250-350mg',
      heavy: '350mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '6-10 hours',
      total: '15-20 hours'
    },
    interactions: ['Hormonal contraceptives', 'CYP2C19 substrates', 'CYP3A4 inducers', 'Alcohol'],
    harmReduction: [
      'Longer lasting than modafinil - take earlier',
      'Can affect sleep more than modafinil',
      'Same precautions as modafinil',
      'Use lower doses than modafinil'
    ],
    legality: 'Prescription only. Schedule IV controlled substance in the US.',
    chemistry: {
      formula: 'C15H15NO2S',
      molecularWeight: '273.35 g/mol',
      class: 'Sulfinylacetamide'
    },
    history: 'Armodafinil was approved in the US in 2007 as an improvement over modafinil with longer duration.',
    routes: ['Oral'],
    afterEffects: 'Can affect sleep significantly due to long half-life.',
    riskLevel: 'low',
    aliases: ['(R)-modafinil']
  },
  {
    id: 'adrafinil',
    name: 'Adrafinil',
    commonNames: ['Olmifon', 'Adra'],
    category: 'stimulants',
    class: 'Eugeroic',
    description: 'Adrafinil is a prodrug of modafinil, converted in the liver to the active compound. It was developed in France and is available without prescription in some countries. Adrafinil has similar effects to modafinil but requires higher doses and puts more stress on the liver.',
    effects: {
      positive: ['Wakefulness', 'Improved focus', 'Cognitive enhancement', 'Alertness'],
      neutral: ['Delayed onset (requires conversion)', 'Mild stimulation', 'Decreased appetite'],
      negative: ['Liver strain with regular use', 'Less potent than modafinil', 'Takes longer to work', 'Insomnia']
    },
    dosage: {
      threshold: '150-300mg',
      light: '300-600mg',
      common: '600-1200mg',
      strong: '1200-1800mg',
      heavy: '1800mg+'
    },
    duration: {
      onset: '1-2 hours',
      comeup: '2-3 hours',
      peak: '3-5 hours',
      offset: '4-8 hours',
      total: '12-16 hours'
    },
    interactions: ['Liver enzyme inducers/inhibitors', 'Blood thinners', 'Alcohol'],
    harmReduction: [
      'Requires conversion by liver - takes longer to work',
      'Higher doses needed than modafinil',
      'Liver monitoring recommended with regular use',
      'Do not use daily for extended periods',
      'Take early in day due to long duration'
    ],
    legality: 'Uncontrolled in US. Prescription only in some countries. Not FDA approved.',
    chemistry: {
      formula: 'C15H15NO3S',
      molecularWeight: '289.35 g/mol',
      class: 'Sulfinylacetamide'
    },
    history: 'Adrafinil was developed in France in the 1970s. It was marketed in Europe until 2011 when production stopped.',
    routes: ['Oral'],
    afterEffects: 'Similar to modafinil. Liver stress with regular use.',
    riskLevel: 'low',
    aliases: ['2-benzhydrylsulfinylacetohydroxamic acid']
  },
  {
    id: 'ephedrine',
    name: 'Ephedrine',
    commonNames: ['Ephedra', 'Ma Huang', 'Eph', 'Bronkaid'],
    category: 'stimulants',
    class: 'Alkaloid',
    description: 'Ephedrine is a naturally occurring alkaloid from the Ephedra plant. It acts as a sympathomimetic amine, stimulating both α and β adrenergic receptors. Ephedrine has been used for asthma, nasal congestion, and weight loss, with significant cardiovascular effects.',
    effects: {
      positive: ['Increased energy', 'Bronchodilation', 'Appetite suppression', 'Improved athletic performance', 'Nasal decongestion'],
      neutral: ['Increased heart rate', 'Elevated blood pressure', 'Sweating', 'Mild euphoria'],
      negative: ['Cardiovascular strain', 'Anxiety', 'Insomnia', 'Risk of stroke', 'Addiction potential', 'Tolerance development']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-25mg',
      common: '25-50mg',
      strong: '50-75mg',
      heavy: '75mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Caffeine (increases cardiovascular strain)', 'Other stimulants', 'MAOIs', 'Beta blockers', 'Theophylline'],
    harmReduction: [
      'Do not combine with caffeine - dangerous cardiovascular effects',
      'Avoid if you have heart conditions or high blood pressure',
      'Do not use for extended periods',
      'Tolerance develops quickly',
      'Many countries restrict sales due to methamphetamine production'
    ],
    legality: 'Regulated in most countries. Available OTC in limited amounts in some US states. Prescription in many countries.',
    chemistry: {
      formula: 'C10H15NO',
      molecularWeight: '165.23 g/mol',
      class: 'Phenethylamine alkaloid'
    },
    history: 'Ephedrine has been used in Chinese medicine for over 5000 years. It was isolated in 1885 and became widely used medically.',
    routes: ['Oral', 'Intravenous', 'Intramuscular'],
    afterEffects: 'Fatigue, possible depression. Cardiovascular effects may persist.',
    riskLevel: 'moderate',
    aliases: ['(1R,2S)-2-(methylamino)-1-phenylpropan-1-ol']
  },
  {
    id: 'propylhexedrine',
    name: 'Propylhexedrine',
    commonNames: ['Benzedrex', 'Hex', 'Prop', 'Inhaler'],
    category: 'stimulants',
    class: 'Cyclohexylamine',
    description: 'Propylhexedrine is a stimulant originally developed as a substitute for amphetamine. It is found in nasal inhalers (Benzedrex) and has gained popularity as a legal stimulant. Propylhexedrine produces effects similar to amphetamine but with more peripheral cardiovascular effects.',
    effects: {
      positive: ['Stimulation', 'Euphoria', 'Nasal decongestion', 'Increased alertness'],
      neutral: ['Increased heart rate', 'Elevated blood pressure', 'Vasoconstriction'],
      negative: ['Strong cardiovascular effects', 'Risk of heart attack or stroke', 'Psychosis at high doses', 'Addiction potential', 'Lavender smell/taste from inhaler']
    },
    dosage: {
      threshold: '12.5-25mg',
      light: '25-50mg',
      common: '50-100mg',
      strong: '100-150mg',
      heavy: '150mg+'
    },
    duration: {
      onset: '15-45 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '1-3 hours',
      offset: '2-4 hours',
      total: '4-8 hours'
    },
    interactions: ['MAOIs', 'Other stimulants', 'Caffeine', 'Antidepressants'],
    harmReduction: [
      'Strong cardiovascular effects - use extreme caution',
      'Extract carefully if using inhaler - lavender oil is toxic',
      'Do not combine with other stimulants',
      'High risk of heart problems',
      'Not intended for recreational use'
    ],
    legality: 'OTC as nasal inhaler in US. Abuse can lead to restrictions.',
    chemistry: {
      formula: 'C10H21N',
      molecularWeight: '155.28 g/mol',
      class: 'Cyclohexylamine'
    },
    history: 'Propylhexedrine was developed in the 1940s as a substitute for amphetamine in inhalers. It has become a substance of abuse.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Significant crash, cardiovascular strain.',
    riskLevel: 'high',
    aliases: ['N,a-dimethyl-cyclohexaneethylamine']
  },
  {
    id: 'phentermine',
    name: 'Phentermine',
    commonNames: ['Adipex', 'Ionamin', 'Fastin', 'Phen'],
    category: 'stimulants',
    class: 'Amphetamine Derivative',
    description: 'Phentermine is a stimulant similar to amphetamine, used primarily for weight loss. It acts as a sympathomimetic amine, suppressing appetite and increasing energy. Phentermine is one of the most commonly prescribed weight loss medications.',
    effects: {
      positive: ['Appetite suppression', 'Weight loss', 'Increased energy', 'Mild euphoria'],
      neutral: ['Increased heart rate', 'Elevated blood pressure', 'Insomnia', 'Dry mouth'],
      negative: ['Cardiovascular effects', 'Addiction potential', 'Anxiety', 'Dependence', 'Pulmonary hypertension (rare)']
    },
    dosage: {
      threshold: '8-15mg',
      light: '15-30mg',
      common: '30-37.5mg',
      strong: '37.5-75mg',
      heavy: '75mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-8 hours',
      total: '8-12 hours'
    },
    interactions: ['MAOIs (dangerous)', 'Other stimulants', 'SSRIs', 'Alcohol', 'Blood pressure medications'],
    harmReduction: [
      'Take early in day to avoid sleep disruption',
      'Monitor blood pressure regularly',
      'Not recommended for long-term use',
      'Do not combine with other stimulants',
      'Lower doses for those sensitive to stimulants'
    ],
    legality: 'Schedule IV controlled substance in the US. Prescription only for weight loss.',
    chemistry: {
      formula: 'C10H15N',
      molecularWeight: '149.23 g/mol',
      class: 'Amphetamine derivative'
    },
    history: 'Phentermine was approved for weight loss in the US in 1959. It remains one of the most prescribed weight loss drugs.',
    routes: ['Oral'],
    afterEffects: 'Possible fatigue, hunger return. Tolerance to appetite suppression develops.',
    riskLevel: 'moderate',
    aliases: ['α,α-dimethylphenethylamine']
  },
  {
    id: 'pma',
    name: 'PMA',
    commonNames: ['Para-Methoxyamphetamine', 'Death', 'Dr. Death', 'Chicken Yellow'],
    category: 'stimulants',
    class: 'Phenethylamine',
    description: 'PMA (para-methoxyamphetamine) is a highly dangerous stimulant and serotonergic drug often sold as MDMA. It has a delayed onset and much lower therapeutic index than MDMA, making overdose common. PMA has been responsible for numerous deaths.',
    effects: {
      positive: ['Mild stimulation', 'Some euphoria (weak compared to MDMA)'],
      neutral: ['Delayed onset (leads to dangerous redosing)', 'Increased body temperature'],
      negative: ['EXTREMELY dangerous', 'High overdose risk', 'Severe hyperthermia', 'Serotonin syndrome', 'Respiratory failure', 'Many deaths reported', 'Often mislabeled as MDMA']
    },
    dosage: {
      threshold: '20-40mg',
      light: '40-60mg',
      common: '60-100mg (DANGEROUS)',
      strong: '100mg+ (LIFE THREATENING)',
      heavy: '150mg+ (LIKELY FATAL)'
    },
    duration: {
      onset: '1-2 hours (dangerously delayed)',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-6 hours',
      total: '6-10 hours'
    },
    interactions: ['MAOIs (potentially fatal)', 'SSRIs', 'Other stimulants', 'MDMA', 'All serotonergic drugs'],
    harmReduction: [
      'EXTREMELY DANGEROUS - many deaths reported',
      'Often sold as MDMA - test your substances',
      'Delayed onset leads to dangerous redosing',
      'If you took what you thought was MDMA and nothing happens - DO NOT REDOSE',
      'Seek medical help immediately if hyperthermia occurs',
      'No safe recreational dose',
      'Has killed many people who thought they were taking MDMA'
    ],
    legality: 'Schedule I controlled substance in the US. Illegal internationally.',
    chemistry: {
      formula: 'C10H15NO',
      molecularWeight: '165.23 g/mol',
      class: 'Phenethylamine'
    },
    history: 'PMA emerged as a street drug in the 1970s. It has caused numerous deaths when sold as MDMA due to its delayed onset and toxicity.',
    routes: ['Oral'],
    afterEffects: 'If survived, potential organ damage from hyperthermia.',
    riskLevel: 'very-high',
    aliases: ['4-methoxyamphetamine']
  },
  {
    id: 'pmma',
    name: 'PMMA',
    commonNames: ['Para-Methoxymethamphetamine', 'Dr. Death II'],
    category: 'stimulants',
    class: 'Phenethylamine',
    description: 'PMMA (para-methoxymethamphetamine) is the N-methylated analog of PMA and shares its dangerous profile. Like PMA, it is often sold as MDMA and has caused numerous deaths due to its delayed onset and toxicity.',
    effects: {
      positive: ['Mild effects at best'],
      neutral: ['Delayed onset', 'Long duration'],
      negative: ['EXTREMELY dangerous', 'High overdose risk', 'Hyperthermia', 'Serotonin syndrome', 'Death', 'Often mislabeled as MDMA', 'More toxic than MDMA at same doses']
    },
    dosage: {
      threshold: '20-40mg',
      light: '40-60mg',
      common: 'NOT SAFE',
      strong: 'LIFE THREATENING',
      heavy: 'LIKELY FATAL'
    },
    duration: {
      onset: '1-2 hours',
      comeup: '1-2 hours',
      peak: '2-6 hours',
      offset: '4-8 hours',
      total: '8-12 hours'
    },
    interactions: ['All serotonergic drugs are dangerous', 'MAOIs', 'SSRIs', 'Other stimulants'],
    harmReduction: [
      'EXTREMELY DANGEROUS - do not take',
      'Often sold as MDMA - test substances',
      'Delayed onset causes dangerous redosing',
      'Seek medical help if suspected ingestion',
      'Many deaths reported',
      'Not a safe alternative to anything'
    ],
    legality: 'Schedule I controlled substance in the US. Illegal internationally.',
    chemistry: {
      formula: 'C11H17NO',
      molecularWeight: '179.26 g/mol',
      class: 'Phenethylamine'
    },
    history: 'PMMA has been found in pills sold as MDMA and has caused numerous deaths worldwide.',
    routes: ['Oral'],
    afterEffects: 'If survived, potential organ damage.',
    riskLevel: 'very-high',
    aliases: ['4-methoxymethamphetamine']
  },
  {
    id: '4f-mph',
    name: '4F-MPH',
    commonNames: ['4-Fluoromethylphenidate', '4F'],
    category: 'stimulants',
    class: 'Research Chemical',
    description: '4F-MPH is a fluorinated analog of methylphenidate that appeared as a research chemical. It is significantly more potent than methylphenidate and has a longer duration. Limited research exists on its safety profile.',
    effects: {
      positive: ['Focus enhancement', 'Stimulation', 'Euphoria', 'Long duration'],
      neutral: ['Increased heart rate', 'Appetite suppression', 'Dry mouth'],
      negative: ['Anxiety', 'Insomnia', 'Cardiovascular strain', 'Addiction potential', 'Limited research']
    },
    dosage: {
      threshold: '2-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-30mg',
      heavy: '30mg+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '3-6 hours',
      total: '6-10 hours'
    },
    interactions: ['MAOIs', 'Other stimulants', 'SSRIs', 'Alcohol'],
    harmReduction: [
      'More potent than methylphenidate - use lower doses',
      'Long duration - plan accordingly',
      'Limited research - unknown long-term effects',
      'Do not combine with other stimulants',
      'Use accurate milligram scale'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states and other countries. Not approved for medical use.',
    chemistry: {
      formula: 'C14H18FNO2',
      molecularWeight: '251.30 g/mol',
      class: 'Piperidine derivative'
    },
    history: '4F-MPH appeared as a research chemical in the 2010s as an alternative to methylphenidate.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Long comedown possible. Sleep disruption.',
    riskLevel: 'moderate',
    aliases: ['4-fluoromethylphenidate']
  },
  {
    id: '4f-eph',
    name: '4F-EPH',
    commonNames: ['4-Fluoroethylphenidate'],
    category: 'stimulants',
    class: 'Research Chemical',
    description: '4F-EPH is a stimulant research chemical related to methylphenidate. It has an ethyl group instead of a methyl group and a fluorine substitution. Limited information exists about its effects and safety.',
    effects: {
      positive: ['Stimulation', 'Focus enhancement', 'Euphoria'],
      neutral: ['Increased heart rate', 'Appetite suppression'],
      negative: ['Anxiety', 'Insomnia', 'Cardiovascular effects', 'Limited research']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-40mg',
      strong: '40-60mg',
      heavy: '60mg+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '2-3 hours',
      offset: '2-4 hours',
      total: '4-8 hours'
    },
    interactions: ['MAOIs', 'Other stimulants', 'SSRIs'],
    harmReduction: [
      'Limited research available',
      'Start with low doses',
      'Do not combine with other stimulants',
      'Use accurate measurement'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some US states. Not approved for medical use.',
    chemistry: {
      formula: 'C15H20FNO2',
      molecularWeight: '265.32 g/mol',
      class: 'Piperidine derivative'
    },
    history: '4F-EPH appeared as a research chemical in the 2010s.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Comedown similar to other stimulants.',
    riskLevel: 'moderate',
    aliases: ['4-fluoroethylphenidate']
  },
  {
    id: 'mda',
    name: 'MDA',
    commonNames: ['Sass', 'Sally', 'Mellow Drug of America', 'Love Drug'],
    category: 'empathogens',
    class: 'Phenethylamine',
    description: 'MDA (3,4-methylenedioxyamphetamine) is a synthetic empathogen and stimulant closely related to MDMA. It produces stronger visual and psychedelic effects than MDMA with somewhat less emphasis on emotional openness. MDA has a longer duration and is often considered more "trippy."',
    effects: {
      positive: ['Euphoria', 'Empathy and connection', 'Enhanced sensory perception', 'Visual effects', 'Energy and stimulation'],
      neutral: ['Jaw clenching', 'Nystagmus (eye wiggles)', 'Increased heart rate', 'Sweating', 'Long duration'],
      negative: ['Neurotoxicity with heavy use', 'Comedown', 'Dehydration risk', 'Hyperthermia', 'More neurotoxic than MDMA']
    },
    dosage: {
      threshold: '30-50mg',
      light: '50-100mg',
      common: '100-150mg',
      strong: '150-200mg',
      heavy: '200mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '45-90 minutes',
      peak: '2-4 hours',
      offset: '3-5 hours',
      total: '6-10 hours'
    },
    interactions: ['SSRIs (reduce effects)', 'MAOIs (dangerous)', 'Other stimulants', 'Alcohol', 'Tramadol'],
    harmReduction: [
      'More neurotoxic than MDMA - use less frequently',
      'Longer duration - plan accordingly',
      'Stay cool and hydrated but do not over-hydrate',
      'Test substances - MDA is often sold as MDMA',
      'Wait at least 1-3 months between uses',
      'More psychedelic than MDMA - different headspace'
    ],
    legality: 'Schedule I controlled substance in the US. Illegal internationally.',
    chemistry: {
      formula: 'C10H13NO2',
      molecularWeight: '179.22 g/mol',
      class: 'Phenethylamine'
    },
    history: 'MDA was first synthesized in 1910 and was used in psychotherapy before becoming a popular recreational drug. It was scheduled in 1970.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Comedown lasting 1-2 days. More draining than MDMA.',
    riskLevel: 'moderate',
    aliases: ['3,4-methylenedioxyamphetamine', 'tenamfetamine']
  },

  // ============================================
  // NOOTROPICS
  // ============================================
  {
    id: 'piracetam',
    name: 'Piracetam',
    commonNames: ['Nootropil', 'Pira', 'Nootrop'],
    category: 'nootropics',
    class: 'Racetam',
    description: 'Piracetam is the original nootropic compound, first synthesized in 1964. It is a cyclic derivative of GABA and is thought to enhance cognitive function through modulation of neurotransmitter systems and improved neuronal membrane fluidity. Piracetam is widely used as a cognitive enhancer and has a long history of relatively safe use.',
    effects: {
      positive: ['Improved memory and learning', 'Enhanced focus', 'Better verbal fluency', 'Neuroprotective properties'],
      neutral: ['Mild stimulation', 'Increased dream vividness'],
      negative: ['Headaches (common without choline source)', 'Mild anxiety', 'Sleep disruption if taken late']
    },
    dosage: {
      threshold: '400-800mg',
      light: '800-1600mg',
      common: '1600-3200mg',
      strong: '3200-4800mg',
      heavy: '4800mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-6 hours',
      total: '6-8 hours'
    },
    interactions: ['Choline supplements (synergistic)', 'Other racetams', 'Stimulants'],
    harmReduction: [
      'Take with a choline source to prevent headaches',
      'Effects may take weeks of daily use to become noticeable',
      'Start with lower doses to assess tolerance',
      'Avoid taking late in the day',
      'Very low toxicity profile'
    ],
    legality: 'Unscheduled in US. Available as supplement. Prescription in some countries.',
    chemistry: {
      formula: 'C6H10N2O2',
      molecularWeight: '142.16 g/mol',
      class: 'Racetam'
    },
    history: 'Piracetam was first synthesized in 1964 by Romanian chemist Corneliu E. Giurgea, who coined the term "nootropic."',
    routes: ['Oral'],
    afterEffects: 'Generally minimal. Effects accumulate with regular use.',
    riskLevel: 'low',
    aliases: ['2-oxo-1-pyrrolidine acetamide']
  },
  {
    id: 'aniracetam',
    name: 'Aniracetam',
    commonNames: ['Ampamet', 'Draganon', 'Ani'],
    category: 'nootropics',
    class: 'Racetam',
    description: 'Aniracetam is a nootropic compound of the racetam family, more potent than piracetam. It has anxiolytic and mood-enhancing properties in addition to cognitive benefits. Aniracetam is fat-soluble and has a shorter half-life than piracetam.',
    effects: {
      positive: ['Enhanced creativity and holistic thinking', 'Reduced anxiety', 'Improved memory', 'Better mood', 'Enhanced verbal fluency'],
      neutral: ['Short duration', 'Fat-soluble (take with food)'],
      negative: ['Headaches without choline', 'Bitter taste']
    },
    dosage: {
      threshold: '200-400mg',
      light: '400-750mg',
      common: '750-1500mg',
      strong: '1500-2000mg',
      heavy: '2000mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '45-90 minutes',
      peak: '1-3 hours',
      offset: '2-3 hours',
      total: '3-5 hours'
    },
    interactions: ['Choline sources', 'Other racetams', 'Alcohol'],
    harmReduction: [
      'Take with fat-containing food for better absorption',
      'Take with choline to prevent headaches',
      'Short half-life - may need multiple doses',
      'More potent than piracetam - use lower doses'
    ],
    legality: 'Unscheduled in US. Not FDA approved. Available as supplement.',
    chemistry: {
      formula: 'C12H13NO3',
      molecularWeight: '219.24 g/mol',
      class: 'Racetam'
    },
    history: 'Aniracetam was developed in the 1970s as a more potent alternative to piracetam.',
    routes: ['Oral'],
    afterEffects: 'Minimal. Anxiolytic effects may persist.',
    riskLevel: 'low',
    aliases: ['1-(4-methoxybenzoyl)-2-pyrrolidinone']
  },
  {
    id: 'noopept',
    name: 'Noopept',
    commonNames: ['Omberacetam', 'GVS-111', 'Noo'],
    category: 'nootropics',
    class: 'Dipeptide',
    description: 'Noopept is a synthetic nootropic compound that is significantly more potent than piracetam. It is a dipeptide that may enhance memory, learning, and cognitive function. Noopept has neuroprotective properties and may promote BDNF and NGF expression.',
    effects: {
      positive: ['Enhanced memory and learning', 'Improved focus', 'Mild anxiolytic effect', 'Neuroprotective properties'],
      neutral: ['Very potent - low doses needed', 'Bitter taste'],
      negative: ['Headaches possible', 'Irritability in some users', 'Fatigue with high doses']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-30mg',
      strong: '30-40mg',
      heavy: '40mg+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '3-5 hours'
    },
    interactions: ['Choline sources', 'Other racetams', 'Stimulants'],
    harmReduction: [
      'Much more potent than piracetam - use milligram scale',
      'May work better with choline source',
      'Sublingual administration may improve absorption',
      'Take breaks to prevent tolerance',
      'Effects may accumulate over time'
    ],
    legality: 'Unscheduled in US. Available as supplement. Prescription in Russia.',
    chemistry: {
      formula: 'C17H22N2O4',
      molecularWeight: '318.37 g/mol',
      class: 'Dipeptide derivative'
    },
    history: 'Noopept was developed in Russia in the 1990s and is used there as a prescription nootropic.',
    routes: ['Oral', 'Sublingual'],
    afterEffects: 'Generally minimal. Some report lasting cognitive benefits.',
    riskLevel: 'low',
    aliases: ['N-phenylacetyl-L-prolylglycine ethyl ester']
  },
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    commonNames: ['Choline Alfoscerate', 'GPC', 'Alpha-Glycerylphosphorylcholine'],
    category: 'nootropics',
    class: 'Choline Source',
    description: 'Alpha-GPC is a natural choline compound found in the brain. It is one of the most bioavailable forms of choline and is used to support cognitive function and acetylcholine production. Alpha-GPC is often stacked with racetams to prevent headaches and enhance effects.',
    effects: {
      positive: ['Enhanced memory', 'Improved focus', 'Better physical performance', 'Supports acetylcholine production', 'Enhanced dream recall'],
      neutral: ['Mild stimulation'],
      negative: ['Headaches at high doses', 'Fishy body odor at very high doses', 'Insomnia if taken late']
    },
    dosage: {
      threshold: '100-150mg',
      light: '150-300mg',
      common: '300-600mg',
      strong: '600-900mg',
      heavy: '900mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-8 hours',
      total: '6-10 hours'
    },
    interactions: ['Racetams (synergistic)', 'Huperzine A', 'Acetylcholinesterase inhibitors'],
    harmReduction: [
      'Start with lower doses to assess tolerance',
      'Take earlier in the day',
      'Often paired with racetam nootropics',
      'Very safe supplement',
      'Stay hydrated'
    ],
    legality: 'Unscheduled. Available as dietary supplement in most countries.',
    chemistry: {
      formula: 'C8H20NO6P',
      molecularWeight: '257.22 g/mol',
      class: 'Phospholipid'
    },
    history: 'Alpha-GPC has been used in Europe as a prescription medication for cognitive decline since the 1980s.',
    routes: ['Oral'],
    afterEffects: 'None significant. Supports ongoing cognitive function.',
    riskLevel: 'low',
    aliases: ['L-α-glycerylphosphorylcholine']
  },
  {
    id: 'l-tyrosine',
    name: 'L-Tyrosine',
    commonNames: ['Tyrosine', 'Tyr'],
    category: 'nootropics',
    class: 'Amino Acid',
    description: 'L-Tyrosine is an amino acid that serves as a precursor to dopamine, norepinephrine, and epinephrine. It is used to enhance cognitive performance under stress, improve focus, and support mood. Tyrosine is particularly effective in situations involving stress, sleep deprivation, or demanding mental tasks.',
    effects: {
      positive: ['Improved focus under stress', 'Better working memory', 'Enhanced mood', 'Increased motivation', 'Reduced effects of sleep deprivation'],
      neutral: ['Mild stimulation', 'May reduce appetite'],
      negative: ['GI upset at high doses', 'Headache', 'May worsen anxiety in some', 'Interacts with thyroid medication']
    },
    dosage: {
      threshold: '250-500mg',
      light: '500-1000mg',
      common: '1000-2000mg',
      strong: '2000-4000mg',
      heavy: '4000mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '45-90 minutes',
      peak: '1-3 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['Thyroid medications', 'MAOIs', 'Levodopa', 'Stimulants'],
    harmReduction: [
      'Take on empty stomach for better absorption',
      'Most effective under stress or sleep deprivation',
      'Do not take if you have thyroid conditions without consulting doctor',
      'Avoid taking late in the day',
      'Cycling may improve effectiveness'
    ],
    legality: 'Unscheduled. Available as dietary supplement.',
    chemistry: {
      formula: 'C9H11NO3',
      molecularWeight: '181.19 g/mol',
      class: 'Amino acid'
    },
    history: 'Tyrosine was first isolated from cheese protein in 1846. Its cognitive benefits were researched extensively in the late 20th century.',
    routes: ['Oral'],
    afterEffects: 'Minimal. Benefits most apparent during stressful situations.',
    riskLevel: 'low',
    aliases: ['4-hydroxyphenylalanine']
  },
  {
    id: 'n-acetyl-cysteine',
    name: 'N-Acetyl Cysteine',
    commonNames: ['NAC', 'Acetylcysteine', 'Fluimucil'],
    category: 'nootropics',
    class: 'Amino Acid Derivative',
    description: 'N-Acetyl Cysteine (NAC) is a supplement form of the amino acid cysteine. It serves as a precursor to glutathione, the body\'s master antioxidant. NAC has been studied for liver protection, respiratory health, psychiatric conditions, and reducing drug cravings. It may help protect against oxidative stress from drug use.',
    effects: {
      positive: ['Antioxidant support', 'Liver protection', 'Reduced drug cravings', 'Respiratory support', 'May help with OCD and addiction'],
      neutral: ['Unpleasant smell/taste', 'May cause GI upset'],
      negative: ['Nausea', 'Diarrhea at high doses', 'Rare allergic reactions']
    },
    dosage: {
      threshold: '200-400mg',
      light: '400-600mg',
      common: '600-1200mg',
      strong: '1200-1800mg',
      heavy: '1800mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '4-8 hours',
      total: '6-12 hours'
    },
    interactions: ['Activated charcoal', 'Nitroglycerin', 'Blood thinners', 'Immunosuppressants'],
    harmReduction: [
      'Take with food to reduce GI upset',
      'Stay hydrated',
      'Consider cycling - long-term high doses may be counterproductive',
      'May reduce effectiveness of some medications',
      'Useful for harm reduction after substance use'
    ],
    legality: 'Unscheduled. Available as supplement. Also FDA approved as prescription medication.',
    chemistry: {
      formula: 'C5H9NO3S',
      molecularWeight: '163.19 g/mol',
      class: 'Acetylated amino acid'
    },
    history: 'NAC was first developed in the 1960s and has been used medically for acetaminophen overdose since the 1970s.',
    routes: ['Oral', 'Intravenous (medical)', 'Inhalation (medical)'],
    afterEffects: 'None significant. Supports ongoing antioxidant status.',
    riskLevel: 'low',
    aliases: ['N-acetyl-L-cysteine']
  },

  // ============================================
  // DISSOCIATIVES - Research Chemicals
  // ============================================
  {
    id: 'methoxetamine',
    name: 'Methoxetamine',
    commonNames: ['MXE', 'Mexxy', 'M-Ket'],
    category: 'dissociatives',
    class: 'Arylcyclohexylamine',
    description: 'Methoxetamine (MXE) is a dissociative anesthetic of the arylcyclohexylamine class, structurally related to ketamine. It produces longer-lasting dissociative effects than ketamine and has been studied for its antidepressant properties. MXE was developed as a legal alternative to ketamine.',
    effects: {
      positive: ['Dissociative euphoria', 'Antidepressant effects', 'Pain relief', 'Enhanced introspection', 'Longer duration than ketamine'],
      neutral: ['Dissociation', 'Numbness', 'Motor impairment'],
      negative: ['Bladder toxicity with heavy use', 'Addiction potential', 'Psychosis at high doses', 'Depersonalization', 'Memory impairment']
    },
    dosage: {
      threshold: '5-15mg',
      light: '15-30mg',
      common: '30-50mg',
      strong: '50-75mg',
      heavy: '75mg+'
    },
    duration: {
      onset: '15-45 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['MAOIs (dangerous)', 'Other dissociatives', 'Stimulants', 'Depressants'],
    harmReduction: [
      'Lower doses than ketamine - it\'s more potent',
      'Longer duration - plan accordingly',
      'Bladder toxicity with heavy use',
      'Avoid daily use',
      'Have a sitter present',
      'Do not combine with MAOIs'
    ],
    legality: 'Schedule I in US. Controlled in many countries. Banned in UK and EU.',
    chemistry: {
      formula: 'C15H21NO2',
      molecularWeight: '247.33 g/mol',
      class: 'Arylcyclohexylamine'
    },
    history: 'MXE emerged as a research chemical around 2010. It was developed as a ketamine alternative with longer duration.',
    routes: ['Oral', 'Insufflation', 'Sublingual'],
    afterEffects: 'Dissociation may linger. Antidepressant effects may last days.',
    riskLevel: 'moderate',
    aliases: ['2-(3-methoxyphenyl)-2-(ethylamino)cyclohexanone']
  },
  {
    id: 'o-pce',
    name: 'O-PCE',
    commonNames: ['Deschloroketamine analog', 'O-PCE', 'DCK analog'],
    category: 'dissociatives',
    class: 'Arylcyclohexylamine',
    description: 'O-PCE (2-oxo-PCE) is a dissociative research chemical of the arylcyclohexylamine class. It is structurally similar to ketamine and DCK. O-PCE produces dissociative effects with less anesthetic properties compared to ketamine, and is known for its stimulant-like qualities.',
    effects: {
      positive: ['Dissociative euphoria', 'Increased sociability', 'Stimulating qualities', 'Enhanced music appreciation'],
      neutral: ['Dissociation', 'Motor impairment', 'Nystagmus'],
      negative: ['Addiction potential', 'Bladder issues with heavy use', 'Psychosis at high doses', 'Memory problems']
    },
    dosage: {
      threshold: '5-15mg',
      light: '15-30mg',
      common: '30-50mg',
      strong: '50-80mg',
      heavy: '80mg+'
    },
    duration: {
      onset: '15-30 minutes',
      comeup: '30-60 minutes',
      peak: '1-2 hours',
      offset: '2-3 hours',
      total: '3-5 hours'
    },
    interactions: ['MAOIs', 'Other dissociatives', 'Stimulants', 'Depressants'],
    harmReduction: [
      'More potent than ketamine - use lower doses',
      'Less anesthetic than ketamine',
      'Has stimulant qualities',
      'Avoid daily use',
      'Have a sitter present',
      'Limited research on safety'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some countries.',
    chemistry: {
      formula: 'C14H19NO',
      molecularWeight: '217.31 g/mol',
      class: 'Arylcyclohexylamine'
    },
    history: 'O-PCE was developed as a research chemical and appeared on the market around 2015.',
    routes: ['Oral', 'Insufflation', 'Sublingual'],
    afterEffects: 'May include stimulation and mild dissociation.',
    riskLevel: 'moderate',
    aliases: ['2-oxo-PCE', '2-oxo-PCM']
  },

  // ============================================
  // HALLUCINOGENS - Tryptamines
  // ============================================
  {
    id: '4-ho-met',
    name: '4-HO-MET',
    commonNames: ['Metocin', 'Colour', '4-HO'],
    category: 'hallucinogens',
    class: 'Tryptamine',
    description: '4-HO-MET is a synthetic psychedelic tryptamine, structurally similar to psilocin. It is known for producing more visual and recreational effects compared to other tryptamines, with less deep psychological introspection. 4-HO-MET is often described as more "playful" and less challenging than mushrooms.',
    effects: {
      positive: ['Strong visual effects', 'Euphoria', 'Less intense than psilocybin', 'More recreational', 'Color enhancement'],
      neutral: ['Visual hallucinations', 'Body high', 'Altered thought patterns'],
      negative: ['Nausea', 'Anxiety', 'Confusion at high doses', 'Headache']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-20mg',
      common: '20-35mg',
      strong: '35-50mg',
      heavy: '50mg+'
    },
    duration: {
      onset: '20-40 minutes',
      comeup: '30-60 minutes',
      peak: '2-4 hours',
      offset: '2-3 hours',
      total: '4-6 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Antipsychotics', 'Tramadol'],
    harmReduction: [
      'Known for being more recreational than other tryptamines',
      'Still a powerful psychedelic - respect it',
      'Strong visuals even at moderate doses',
      'Have a sitter present',
      'Set and setting still important'
    ],
    legality: 'Schedule I in US. Controlled in some countries. Unscheduled in others.',
    chemistry: {
      formula: 'C13H20N2O',
      molecularWeight: '220.31 g/mol',
      class: 'Tryptamine'
    },
    history: '4-HO-MET was first synthesized by Albert Hofmann but gained popularity as a research chemical in the 2010s.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Generally mild comedown. Some report afterglow.',
    riskLevel: 'moderate',
    aliases: ['metocin', '4-hydroxy-N-methyl-N-ethyltryptamine']
  },
  {
    id: '5-meo-dipt',
    name: '5-MeO-DiPT',
    commonNames: ['Foxy', 'Foxy Methoxy', '5-MeO'],
    category: 'hallucinogens',
    class: 'Tryptamine',
    description: '5-MeO-DiPT is a psychedelic tryptamine with unique properties. Unlike most psychedelics, it produces relatively mild visual effects but strong tactile and auditory enhancement. It is known for its aphrodisiac qualities and body-focused effects.',
    effects: {
      positive: ['Enhanced tactile sensation', 'Auditory enhancement', 'Aphrodisiac effects', 'Unique body high'],
      neutral: ['Mild visuals', 'Body load', 'Altered perception'],
      negative: ['Nausea', 'Anxiety', 'Body tension', 'Uncomfortable body sensations', 'Bitter taste']
    },
    dosage: {
      threshold: '5-8mg',
      light: '8-15mg',
      common: '15-25mg',
      strong: '25-35mg',
      heavy: '35mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '45-90 minutes',
      peak: '2-4 hours',
      offset: '2-3 hours',
      total: '4-6 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Antipsychotics', 'Tramadol'],
    harmReduction: [
      'Known for body-focused effects rather than visuals',
      'Unique among tryptamines',
      'Body load can be uncomfortable',
      'Stay hydrated',
      'Have a sitter present',
      'Not recommended for those sensitive to body load'
    ],
    legality: 'Schedule I in US. Controlled in many countries.',
    chemistry: {
      formula: 'C14H20N2O',
      molecularWeight: '232.32 g/mol',
      class: 'Tryptamine'
    },
    history: '5-MeO-DiPT was first synthesized by Alexander Shulgin and described in his book TiHKAL.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Possible hangover. Body tension may linger.',
    riskLevel: 'moderate',
    aliases: ['5-methoxy-N,N-diisopropyltryptamine', 'foxy methoxy']
  },

  // ============================================
  // HALLUCINOGENS - Lysergamides
  // ============================================
  {
    id: 'lsa',
    name: 'LSA',
    commonNames: ['Ergine', 'Morning Glory', 'Hawaiian Baby Woodrose', 'HBWR'],
    category: 'hallucinogens',
    class: 'Ergoline',
    description: 'LSA (Lysergic Acid Amide) is a naturally occurring psychedelic compound found in morning glory seeds and Hawaiian baby woodrose seeds. It is structurally related to LSD but produces milder and more sedating effects. LSA has been used traditionally by indigenous peoples of Mexico.',
    effects: {
      positive: ['Mild psychedelic effects', 'Dreamlike state', 'Introspection', 'Natural origin'],
      neutral: ['Sedation', 'Body heaviness', 'Closed-eye visuals', 'Long duration'],
      negative: ['Severe nausea and vomiting', 'Vasoconstriction', 'Body aches', 'Lethargy', 'Leg cramps']
    },
    dosage: {
      threshold: '50-100 seeds (morning glory), 1-2 seeds (HBWR)',
      light: '100-150 seeds (MG), 2-4 seeds (HBWR)',
      common: '150-300 seeds (MG), 4-8 seeds (HBWR)',
      strong: '300-500 seeds (MG), 8-12 seeds (HBWR)',
      heavy: '500+ seeds (MG), 12+ seeds (HBWR)'
    },
    duration: {
      onset: '45-90 minutes',
      comeup: '1-2 hours',
      peak: '4-6 hours',
      offset: '3-5 hours',
      total: '8-12 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Antipsychotics', 'Ergot derivatives'],
    harmReduction: [
      'Expect nausea - have ginger or anti-nausea medication ready',
      'Non-polar extraction can reduce nausea',
      'Commercial seeds may be coated with pesticides - wash thoroughly',
      'HBWR seeds are much more potent than morning glory',
      'Laying down can help with body discomfort',
      'Have a long period available - it lasts a while'
    ],
    legality: 'LSA is Schedule III in US. Seeds are legal to possess but extraction/consumption is illegal.',
    chemistry: {
      formula: 'C16H18N2O',
      molecularWeight: '254.33 g/mol',
      class: 'Ergoline alkaloid'
    },
    history: 'LSA has been used by indigenous Mexicans for centuries. It was identified as the active compound in ololiuqui in 1960.',
    routes: ['Oral (chewing seeds, extraction)'],
    afterEffects: 'Fatigue, body aches. Possible lingering sedation.',
    riskLevel: 'moderate',
    aliases: ['lysergic acid amide', 'ergine']
  },

  // ============================================
  // HALLUCINOGENS - 2C Series
  // ============================================
  {
    id: '2c-i',
    name: '2C-I',
    commonNames: ['I-DOTS', '2CI'],
    category: 'hallucinogens',
    class: 'Phenethylamine',
    description: '2C-I is a psychedelic phenethylamine of the 2C family, structurally similar to 2C-B with an iodine atom instead of bromine. It is known for producing strong visual effects and stimulation. 2C-I is more stimulating and longer lasting than 2C-B.',
    effects: {
      positive: ['Strong visuals', 'Stimulation', 'Euphoria', 'Enhanced appreciation of music'],
      neutral: ['Long duration', 'Energy increase', 'Visual enhancement'],
      negative: ['Body load', 'Anxiety', 'Overstimulation', 'Insomnia']
    },
    dosage: {
      threshold: '5-10mg',
      light: '10-15mg',
      common: '15-25mg',
      strong: '25-40mg',
      heavy: '40mg+'
    },
    duration: {
      onset: '45-90 minutes',
      comeup: '1-2 hours',
      peak: '3-5 hours',
      offset: '3-4 hours',
      total: '6-10 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Stimulants', 'Other psychedelics'],
    harmReduction: [
      'More stimulating than 2C-B',
      'Long duration - plan accordingly',
      'Body load can be significant',
      'Stay hydrated but not excessively',
      'Have a sitter present'
    ],
    legality: 'Schedule I in US. Controlled in many countries.',
    chemistry: {
      formula: 'C10H14INO2',
      molecularWeight: '307.13 g/mol',
      class: 'Phenethylamine'
    },
    history: '2C-I was synthesized by Alexander Shulgin and described in his book PiHKAL. It became popular in the 2000s.',
    routes: ['Oral', 'Insufflation (very painful)'],
    afterEffects: 'Stimulation may persist. Difficulty sleeping.',
    riskLevel: 'moderate',
    aliases: ['2,5-dimethoxy-4-iodophenethylamine']
  },

  // ============================================
  // HALLUCINOGENS - NBOMe Series (Warning)
  // ============================================
  {
    id: '25i-nbome',
    name: '25I-NBOMe',
    commonNames: ['N-Bomb', 'Smiles', '25I', 'Solaris'],
    category: 'hallucinogens',
    class: 'Phenethylamine',
    description: '25I-NBOMe is a highly potent synthetic psychedelic of the NBOMe series. It acts as a potent 5-HT2A receptor agonist. WARNING: 25I-NBOMe has been responsible for numerous deaths and hospitalizations. It has a very narrow therapeutic window and unpredictable potency. Often sold as LSD, it is far more dangerous.',
    effects: {
      positive: ['Intense visuals at safe doses', 'Psychedelic effects'],
      neutral: ['Very potent - active in micrograms'],
      negative: ['HIGH OVERDOSE RISK', 'Vasoconstriction', 'Seizures', 'Death reported at common doses', 'Unpredictable potency', 'Often mislabeled as LSD', 'Many hospitalizations']
    },
    dosage: {
      threshold: '50-150μg',
      light: '150-300μg',
      common: '300-500μg (DANGEROUS)',
      strong: '500-1000μg (HIGHLY DANGEROUS)',
      heavy: '1000μg+ (POTENTIALLY FATAL)'
    },
    duration: {
      onset: '30-60 minutes (sublingual)',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '2-4 hours',
      total: '6-10 hours'
    },
    interactions: ['ALL COMBINATIONS ARE DANGEROUS', 'MAOIs', 'SSRIs', 'Stimulants'],
    harmReduction: [
      'NOT RECOMMENDED - many deaths reported',
      'If you must use: test your substance - often sold as LSD',
      'If you took what you thought was LSD and it\'s bitter/numbing, spit it out',
      'Never insufflate - many deaths from this route',
      'Vasoconstriction can be severe and dangerous',
      'Have emergency services available',
      'Consider avoiding this substance entirely'
    ],
    legality: 'Schedule I in US. Illegal internationally. Many countries have emergency scheduled it due to deaths.',
    chemistry: {
      formula: 'C18H22INO3',
      molecularWeight: '427.28 g/mol',
      class: 'Phenethylamine (NBOMe series)'
    },
    history: '25I-NBOMe was discovered in 2003. It appeared as a "legal LSD" around 2010 and quickly gained notoriety for causing deaths.',
    routes: ['Sublingual', 'Buccal', 'Insufflation (DANGEROUS)'],
    afterEffects: 'May include prolonged vasoconstriction, psychological distress. High risk of lasting harm from overdose.',
    riskLevel: 'very-high',
    aliases: ['2C-I-NBOMe', '25I']
  },

  // ============================================
  // DELIRIANTS
  // ============================================
  {
    id: 'datura',
    name: 'Datura',
    commonNames: ['Jimson Weed', 'Devil\'s Trumpet', 'Thorn Apple', 'Moonflower'],
    category: 'deliriants',
    class: 'Tropane Alkaloid',
    description: 'Datura is a genus of plants containing potent deliriant alkaloids including scopolamine, hyoscyamine, and atropine. It has been used traditionally for its psychoactive properties but is notorious for its extreme danger. Datura produces true hallucinations (inability to distinguish from reality), extreme confusion, and has an extremely unfavorable safety profile. The difference between a psychoactive dose and a fatal dose is small.',
    effects: {
      positive: ['None reliably positive'],
      neutral: ['Anticholinergic effects', 'Mydriasis', 'Tachycardia'],
      negative: ['EXTREMELY DANGEROUS', 'True hallucinations (can\'t distinguish from reality)', 'Complete delirium', 'Amnesia', 'Hyperthermia', 'Tachycardia', 'Death from overdose', 'Toxic dose close to active dose', 'Weeks of memory loss', 'Permanent damage possible']
    },
    dosage: {
      threshold: 'Variable and unpredictable',
      light: 'Not recommended',
      common: 'NOT SAFE',
      strong: 'LIFE THREATENING',
      heavy: 'LIKELY FATAL'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '1-2 hours',
      peak: '4-12 hours',
      offset: '12-48 hours',
      total: '24-72+ hours'
    },
    interactions: ['ALL combinations are dangerous', 'Other anticholinergics', 'Alcohol', 'Any CNS active substance'],
    harmReduction: [
      'EXTREMELY DANGEROUS - not recommended under any circumstances',
      'Toxic dose is very close to active dose',
      'Potency varies wildly between plants and parts',
      'Causes true hallucinations that seem completely real',
      'Users have injured themselves during delirium',
      'Medical attention often required',
      'Deaths are common',
      'Can cause permanent memory and cognitive damage',
      'Many who try it once never try it again'
    ],
    legality: 'Plant is legal in most places. Extraction and use of alkaloids is illegal in many jurisdictions.',
    chemistry: {
      formula: 'Various tropane alkaloids',
      molecularWeight: 'Variable',
      class: 'Tropane alkaloid'
    },
    history: 'Datura has been used for millennia in various cultures for its psychoactive properties. It has a long history of association with witchcraft and poisoning.',
    routes: ['Oral (seeds, leaves, tea)', 'Smoking'],
    afterEffects: 'Extended recovery. Memory problems may persist. Psychological trauma common.',
    riskLevel: 'very-high',
    aliases: ['Datura stramonium', 'scopolamine', 'atropine', 'hyoscyamine']
  },
  {
    id: 'muscimol',
    name: 'Muscimol',
    commonNames: ['Amanita muscaria', 'Fly Agaric', 'Amanita'],
    category: 'deliriants',
    class: 'Ibotenic Acid Derivative',
    description: 'Muscimol is a psychoactive compound found in Amanita muscaria and related mushrooms. It is a potent GABA-A receptor agonist, producing sedative-hypnotic and deliriant effects. Unlike classic psychedelics, muscimol produces a unique state of altered consciousness. The mushrooms also contain ibotenic acid, a neurotoxin that converts to muscimol with proper preparation.',
    effects: {
      positive: ['Unique altered state', 'Dream-like experiences', 'Euphoria at low doses', 'Sleep enhancement'],
      neutral: ['Sedation', 'Dissociation', 'Muscle twitching'],
      negative: ['Nausea and vomiting', 'Confusion', 'Loss of coordination', 'Unpredictable effects', 'Delirium at high doses', 'Seizures in rare cases']
    },
    dosage: {
      threshold: '3-5mg',
      light: '5-10mg',
      common: '10-15mg',
      strong: '15-25mg',
      heavy: '25mg+'
    },
    duration: {
      onset: '30-90 minutes',
      comeup: '1-2 hours',
      peak: '2-4 hours',
      offset: '3-6 hours',
      total: '6-10 hours'
    },
    interactions: ['Alcohol', 'Benzodiazepines', 'Other GABAergics', 'Stimulants'],
    harmReduction: [
      'Proper preparation converts ibotenic acid to muscimol',
      'Raw mushrooms contain neurotoxic ibotenic acid',
      'Effects are dose-dependent and unpredictable',
      'Not a classic psychedelic - different safety profile',
      'Have a sitter present',
      'Avoid combining with other GABAergics',
      'Start with low doses'
    ],
    legality: 'Unscheduled in US. Mushrooms are legal to possess. Controlled in some countries.',
    chemistry: {
      formula: 'C4H6N2O2',
      molecularWeight: '114.10 g/mol',
      class: 'Ibotenic acid derivative'
    },
    history: 'Amanita muscaria has been used for thousands of years, possibly by Viking berserkers and Siberian shamans.',
    routes: ['Oral (prepared mushroom)', 'Tea'],
    afterEffects: 'Sedation, possible hangover. Vivid dreams.',
    riskLevel: 'high',
    aliases: ['pantherine', 'agarine']
  },

  // ============================================
  // EMPATHOGENS - Benzofurans
  // ============================================
  {
    id: '5-apb',
    name: '5-APB',
    commonNames: ['5-(2-aminopropyl)benzofuran', '5-APB'],
    category: 'empathogens',
    class: 'Benzofuran',
    description: '5-APB is a synthetic entactogen of the benzofuran class, structurally related to MDMA. It is known for combining empathogenic effects with psychedelic qualities. 5-APB is often considered more stimulating and longer-lasting than 6-APB.',
    effects: {
      positive: ['Empathy enhancement', 'Euphoria', 'Mild visuals', 'Stimulation', 'Enhanced sociability'],
      neutral: ['Long duration', 'Stimulation', 'Jaw clenching'],
      negative: ['Nausea', 'Anxiety', 'Overheating', 'Insomnia', 'Comedown']
    },
    dosage: {
      threshold: '30-50mg',
      light: '50-80mg',
      common: '80-120mg',
      strong: '120-180mg',
      heavy: '180mg+'
    },
    duration: {
      onset: '30-60 minutes',
      comeup: '45-90 minutes',
      peak: '3-5 hours',
      offset: '3-5 hours',
      total: '7-10 hours'
    },
    interactions: ['SSRIs', 'MAOIs', 'Other stimulants', 'Alcohol'],
    harmReduction: [
      'Long duration - plan accordingly',
      'Stay cool and hydrated',
      'Similar precautions as MDMA',
      'More stimulating than 6-APB',
      'Avoid mixing with other substances',
      'Test substances'
    ],
    legality: 'Schedule I in US. Controlled in many countries.',
    chemistry: {
      formula: 'C11H13NO',
      molecularWeight: '175.23 g/mol',
      class: 'Benzofuran'
    },
    history: '5-APB was first synthesized in the 1990s and appeared as a research chemical around 2011.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Comedown similar to MDMA but potentially longer.',
    riskLevel: 'moderate',
    aliases: ['5-(2-aminopropyl)benzofuran']
  },

  // ============================================
  // STIMULANTS - Cathinones
  // ============================================
  {
    id: 'alpha-pvp',
    name: 'α-PVP',
    commonNames: ['Flakka', 'Gravel', 'Alpha-PVP', 'A-PVP'],
    category: 'stimulants',
    class: 'Cathinone',
    description: 'α-PVP (alpha-Pyrrolidinopentiophenone) is a powerful synthetic stimulant of the cathinone class. It is a norepinephrine-dopamine reuptake inhibitor known for producing intense stimulation, euphoria, and high addiction potential. α-PVP has been associated with numerous cases of bizarre behavior, psychosis, and deaths.',
    effects: {
      positive: ['Intense euphoria', 'Strong stimulation', 'Increased energy', 'Increased focus'],
      neutral: ['Increased heart rate', 'Insomnia', 'Suppressed appetite'],
      negative: ['Very high addiction potential', 'Severe paranoia and psychosis', 'Hyperthermia', 'Dangerous behavior', 'Cardiovascular strain', 'Many reports of bizarre behavior', 'Death from overdose']
    },
    dosage: {
      threshold: '2-5mg',
      light: '5-10mg',
      common: '10-20mg',
      strong: '20-40mg',
      heavy: '40mg+'
    },
    duration: {
      onset: '10-30 minutes (insufflated)',
      comeup: '15-45 minutes',
      peak: '1-3 hours',
      offset: '2-4 hours',
      total: '4-6 hours'
    },
    interactions: ['All combinations dangerous', 'Other stimulants', 'Alcohol', 'Depressants'],
    harmReduction: [
      'NOT RECOMMENDED - high addiction and danger potential',
      'Very potent - use milligram scale',
      'Associated with dangerous and bizarre behavior',
      'High risk of psychosis',
      'Do not redose - compulsive redosing common',
      'Have someone present who can call for help',
      'Avoid if you have any mental health conditions'
    ],
    legality: 'Schedule I in US. Controlled internationally. Emergency scheduled in many countries due to dangers.',
    chemistry: {
      formula: 'C15H21NO',
      molecularWeight: '231.33 g/mol',
      class: 'Pyrovalerone cathinone'
    },
    history: 'α-PVP was developed in the 1960s but gained notoriety around 2013-2015 as "flakka" in Florida.',
    routes: ['Insufflation', 'Oral', 'Smoking'],
    afterEffects: 'Severe comedown, craving, possible psychosis. Extended recovery.',
    riskLevel: 'very-high',
    aliases: ['alpha-pyrrolidinopentiophenone', 'flakka']
  },
  {
    id: '3-fpm',
    name: '3-FPM',
    commonNames: ['3-Fluorophenmetrazine', '3-F'],
    category: 'stimulants',
    class: 'Phenmetrazine Derivative',
    description: '3-FPM (3-Fluorophenmetrazine) is a stimulant research chemical derived from phenmetrazine. It is known for producing functional stimulation with less euphoria and compulsion than other stimulants. 3-FPM is often used for productivity enhancement due to its relatively clear-headed effects.',
    effects: {
      positive: ['Functional stimulation', 'Increased focus', 'Mild euphoria', 'Productivity enhancement', 'Less compulsive than other stimulants'],
      neutral: ['Mild stimulation', 'Appetite suppression', 'Increased heart rate'],
      negative: ['Anxiety at high doses', 'Insomnia', 'Vasoconstriction', 'Headache', 'Addiction potential']
    },
    dosage: {
      threshold: '10-20mg',
      light: '20-40mg',
      common: '40-80mg',
      strong: '80-120mg',
      heavy: '120mg+'
    },
    duration: {
      onset: '20-40 minutes (oral)',
      comeup: '30-60 minutes',
      peak: '2-3 hours',
      offset: '2-3 hours',
      total: '4-6 hours'
    },
    interactions: ['MAOIs', 'Other stimulants', 'SSRIs'],
    harmReduction: [
      'Considered more functional than recreational',
      'Still has addiction potential - avoid daily use',
      'Less compulsive than many stimulants',
      'Stay hydrated',
      'Avoid late in the day',
      'Use accurate milligram scale'
    ],
    legality: 'Unscheduled at US federal level. May be prosecuted under Federal Analogue Act. Controlled in some countries.',
    chemistry: {
      formula: 'C11H14FNO',
      molecularWeight: '195.23 g/mol',
      class: 'Phenmetrazine derivative'
    },
    history: '3-FPM was developed as a research chemical and appeared around 2014 as a functional stimulant.',
    routes: ['Oral', 'Insufflation'],
    afterEffects: 'Mild comedown. Sleep disruption.',
    riskLevel: 'moderate',
    aliases: ['3-fluorophenmetrazine']
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

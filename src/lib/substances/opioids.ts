// Opioids Substances

import type { Substance } from '../types';

export const opioids: Substance[] = [
  {
      id: 'heroin',
      name: 'Heroin',
      commonNames: ['H', 'Dope', 'Smack', 'Junk', 'Horse', 'Brown', 'China White', 'Tar'],
      category: 'opioids',
      class: 'Opioid',
      description: 'Heroin (diacetylmorphine) is a semi-synthetic opioid derived from morphine. It acts primarily on mu-opioid receptors, producing intense euphoria, pain relief, and sedation. Heroin is highly addictive and carries significant risks of overdose, particularly given its variable purity and the prevalence of fentanyl as an adulterant in modern supplies.',
      effects: {
        positive: ['Intense euphoria (rush)', 'Powerful pain relief', 'Deep relaxation', 'Anxiety suppression', 'Dream-like state (nodding)'],
        neutral: ['Sedation', 'Pupil constriction (pinpoint pupils)', 'Constipation', 'Itching (histamine release)', 'Nausea'],
        negative: ['High addiction potential', 'Respiratory depression (fatal overdose risk)', 'Severe withdrawal', 'Collapsed veins (IV use)', 'Infection risk', 'Hormonal imbalance']
      },
      dosage: {
        threshold: '5-10mg',
        light: '10-20mg',
        common: '20-40mg',
        strong: '40-60mg',
        heavy: '60mg+'
      },
      routeData: {
        Intravenous: {
            dosage: {
                threshold: '3-5mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-30mg',
                heavy: '30mg+'
            },
            duration: {
                onset: '5-20 seconds',
                comeup: '30-90 seconds',
                peak: '5-15 minutes',
                offset: '1-3 hours',
                total: '3-5 hours'
            },
            notes: 'Pure diamorphine dosages listed. Street heroin purity varies wildly (often 10-50%). Fentanyl presence changes lethal dose significantly.'
        },
        Insufflation: {
            dosage: {
                threshold: '5-10mg',
                light: '15-30mg',
                common: '30-50mg',
                strong: '50-75mg',
                heavy: '75mg+'
            },
            duration: {
                onset: '2-5 minutes',
                comeup: '10-20 minutes',
                peak: '30-45 minutes',
                offset: '3-5 hours',
                total: '4-6 hours'
            },
            notes: 'Snorting. Bioavailability is lower than IV (~40-50%). "Cheese" or "Monkey Water" methods used for tar.'
        },
        Smoking: {
            dosage: {
                threshold: '5-10mg',
                light: '15-25mg',
                common: '25-50mg',
                strong: '50-75mg',
                heavy: '75mg+'
            },
            duration: {
                onset: '5-15 seconds',
                comeup: '1-2 minutes',
                peak: '5-15 minutes',
                offset: '1-2 hours',
                total: '2-4 hours'
            },
            notes: 'Vaporizing on foil ("Chasing the dragon"). Intense rush but shorter duration than snorting.'
        },
        Intramuscular: {
            dosage: {
                threshold: '3-6mg',
                light: '6-12mg',
                common: '12-24mg',
                strong: '24-36mg',
                heavy: '36mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '15-30 minutes',
                peak: '30-60 minutes',
                offset: '2-4 hours',
                total: '4-6 hours'
            },
            notes: 'Skin popping. High risk of abscesses and infection (wound botulism).'
        }
    },
      interactions: ['Benzodiazepines (deadly combo)', 'Alcohol', 'Other opioids', 'Stimulants ("Speedball" - increases strain on heart)', 'Antihistamines'],
      harmReduction: [
        'Never use alone; use the "Never Use Alone" hotline if necessary',
        'Always have naloxone (Narcan) available',
        'Test all substances for fentanyl/xylazine',
        'Rotate injection sites to prevent vein collapse',
        'Use new, sterile equipment every time',
        'Start with a small test shot',
        'Recovery is possible; seek medication-assisted treatment (methadone/buprenorphine)'
      ],
      legality: 'Illegal in almost all jurisdictions. Schedule I in the US.',
      chemistry: {
        formula: 'C21H23NO5',
        molecularWeight: '369.41 g/mol',
        class: 'Semi-synthetic opioid'
      },
      history: 'Synthesized in 1874. Bayer marketed it in 1898 as a non-addictive morphine substitute and cough suppressant. It was criminalized in the US in 1924.',
      routes: ['Intravenous', 'Insufflation', 'Smoking', 'Intramuscular', 'Rectal'],
      afterEffects: 'Dopamine depletion, rebound pain, and severe withdrawal symptoms (flu-like symptoms, restless legs, vomiting) starting 6-12 hours after last dose.',
      riskLevel: 'very-high',
      aliases: ['diacetylmorphine', 'diamorphine']
    },
  {
      id: 'kratom',
      name: 'Kratom',
      commonNames: ['Mitragyna speciosa', 'Kratom', 'Biak', 'Ketum', 'Tea'],
      category: 'opioids',
      class: 'Atypical Opioid',
      description: 'Kratom is a tropical tree native to Southeast Asia. Its leaves contain mitragynine and 7-hydroxymitragynine, which act as partial agonists at the mu-opioid receptor. It exhibits a unique dose-dependent effect profile: stimulating at low doses and sedating/opioid-like at higher doses.',
      effects: {
        positive: ['Pain relief', 'Energy and focus (low doses)', 'Mood elevation', 'Anxiety relief', 'Opioid withdrawal mitigation', 'Sedation (high doses)'],
        neutral: ['Appetite suppression', 'Pupil constriction', 'Dry mouth'],
        negative: ['Nausea and vomiting ("the wobbles")', 'Constipation', 'Dehydration', 'Dizziness', 'Dependence with daily use', 'Liver stress (rare)']
      },
      dosage: {
        threshold: '1-2g',
        light: '2-4g',
        common: '3-6g',
        strong: '6-10g',
        heavy: '10g+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '1-2g',
                light: '2-4g',
                common: '3-6g',
                strong: '6-10g',
                heavy: '10g+'
            },
            duration: {
                onset: '20-40 minutes',
                comeup: '30-60 minutes',
                peak: '1.5-2.5 hours',
                offset: '2-4 hours',
                total: '4-6 hours'
            },
            notes: 'Powder washed down with water ("toss and wash"), capsules, or brewed as tea. Extracts are significantly more potent.'
        }
    },
      interactions: ['Alcohol', 'Benzodiazepines', 'Other opioids', 'Stimulants', 'Modafinil (risk of seizure)'],
      harmReduction: [
        'Stay very hydrated',
        'Avoid daily use to prevent tolerance and dependence',
        'Rotate strains to potentially reduce tolerance buildup',
        'Be cautious with extracts (high addiction potential)',
        'Source from lab-tested vendors to avoid heavy metals/salmonella',
        'High doses often lead to unpleasant nausea (wobbles)'
      ],
      legality: 'Legal in most US states; banned in some states (AL, AR, IN, RI, VT, WI) and various countries. "Grey market" status.',
      chemistry: {
        formula: 'C23H30N2O4 (Mitragynine)',
        molecularWeight: '398.5 g/mol',
        class: 'Indole alkaloid'
      },
      history: 'Used traditionally in Thailand and Malaysia for centuries by laborers to combat fatigue and opium addiction. Introduced to the West recently as an alternative medicine.',
      routes: ['Oral'],
      afterEffects: 'Mild lethargy or irritability. Withdrawal symptoms resemble mild opioid withdrawal (runny nose, restless legs, insomnia).',
      riskLevel: 'moderate',
      aliases: ['mitragyna speciosa']
    },
  {
      id: 'morphine',
      name: 'Morphine',
      commonNames: ['MS Contin', 'Kadian', 'Roxanol', 'Statex'],
      category: 'opioids',
      class: 'Opioid Analgesic',
      description: 'Morphine is the primary active alkaloid found in the opium poppy. It is the gold standard against which other opioids are measured. It acts directly on the central nervous system to relieve pain. Oral bioavailability is relatively poor due to first-pass metabolism, making IV/IM routes significantly more potent.',
      effects: {
        positive: ['Strong pain relief', 'Euphoria', 'Physical relaxation', 'Anxiolysis', 'Sedation'],
        neutral: ['Itching (high histamine release)', 'Constipation', 'Pupil constriction', 'Urinary retention'],
        negative: ['Respiratory depression', 'Nausea/Vomiting', 'Addiction', 'Low blood pressure', 'Confusion']
      },
      dosage: {
        threshold: '5-10mg (oral)',
        light: '10-20mg (oral)',
        common: '20-40mg (oral)',
        strong: '40-80mg (oral)',
        heavy: '80mg+ (oral)'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '5-10mg',
                light: '10-20mg',
                common: '20-40mg',
                strong: '40-80mg',
                heavy: '80mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '2-3 hours',
                offset: '2-4 hours',
                total: '4-6 hours'
            },
            notes: 'Bioavailability ~30%. Extended release (MS Contin) lasts 8-12 hours.'
        },
        Intravenous: {
            dosage: {
                threshold: '1-3mg',
                light: '3-5mg',
                common: '5-10mg',
                strong: '10-20mg',
                heavy: '20mg+'
            },
            duration: {
                onset: '30-60 seconds',
                comeup: '2-5 minutes',
                peak: '10-20 minutes',
                offset: '2-3 hours',
                total: '3-4 hours'
            },
            notes: 'Medical standard. Significant histamine rush ("pins and needles"). 100% bioavailability.'
        },
        Rectal: {
            dosage: {
                threshold: '3-5mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-40mg',
                heavy: '40mg+'
            },
            duration: {
                onset: '10-20 minutes',
                comeup: '20-30 minutes',
                peak: '1-2 hours',
                offset: '3-4 hours',
                total: '4-6 hours'
            },
            notes: 'Boofing. Bypasses some first-pass metabolism; stronger than oral.'
        }
    },
      interactions: ['Benzodiazepines', 'Alcohol', 'MAOIs', 'Gabapentinoids', 'Antihistamines (potentiate sedation)'],
      harmReduction: [
        'Do not crush extended-release pills (danger of rapid overdose)',
        'Significant histamine release can cause dangerous swelling in sensitive individuals',
        'Have naloxone available',
        'Never mix with alcohol or benzos'
      ],
      legality: 'Prescription only. Schedule II in the US.',
      chemistry: {
        formula: 'C17H19NO3',
        molecularWeight: '285.34 g/mol',
        class: 'Natural Opiate (Phenanthrene)'
      },
      history: 'Isolated in 1804 by Friedrich Sertürner, named after Morpheus, the Greek god of dreams. Widespread use began with the invention of the hypodermic needle in 1853.',
      routes: ['Oral', 'Intravenous', 'Intramuscular', 'Rectal', 'Subcutaneous'],
      afterEffects: 'Constipation, "opioid hangover," lethargy.',
      riskLevel: 'high',
      aliases: ['morphium']
    },
  {
      id: 'codeine',
      name: 'Codeine',
      commonNames: ['Tylenol 3', 'Lean', 'Sizzurp', 'Codine', 'Cody'],
      category: 'opioids',
      class: 'Opiate Prodrug',
      description: 'Codeine is a naturally occurring opiate used for mild pain and cough suppression. It is a prodrug, meaning it must be metabolized by the liver enzyme CYP2D6 into morphine to be active. Genetic differences in this enzyme mean some people get no effect, while "ultra-rapid metabolizers" may overdose on standard doses.',
      effects: {
        positive: ['Mild euphoria', 'Relaxation', 'Cough suppression', 'Pain relief', 'Warmth'],
        neutral: ['Itching (very common)', 'Sedation', 'Constipation', 'Dry mouth'],
        negative: ['Nausea', 'Dizziness', 'Urinary retention', 'Dysphoria at high doses (histamine reaction)']
      },
      dosage: {
        threshold: '15-30mg',
        light: '30-60mg',
        common: '60-120mg',
        strong: '120-200mg',
        heavy: '200mg+ (Ceiling effect)'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '15-30mg',
                light: '30-60mg',
                common: '60-120mg',
                strong: '120-200mg',
                heavy: '200mg+'
            },
            duration: {
                onset: '30-45 minutes',
                comeup: '45-60 minutes',
                peak: '1-2 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Ceiling effect around 400mg where more drug adds side effects but no euphoria.'
        }
    },
      interactions: ['Alcohol', 'Benzodiazepines', 'CYP2D6 inhibitors (SSRI, etc.) block effects', 'Promethazine (potentiates sedation)'],
      harmReduction: [
        'Cold Water Extraction (CWE) is mandatory if using pills containing acetaminophen/paracetamol to prevent liver failure',
        'Start low to check for allergy/enzyme deficiency',
        'High doses cause extreme itching/hives',
        'Do not mix with alcohol'
      ],
      legality: 'Prescription only in US (Schedule II/III/V depending on formulation). OTC in UK/Canada/Australia (though regulations are tightening).',
      chemistry: {
        formula: 'C18H21NO3',
        molecularWeight: '299.36 g/mol',
        class: 'Natural Opiate'
      },
      history: 'Isolated in 1832. Commonly used in cough syrups and mild pain relievers worldwide.',
      routes: ['Oral'],
      afterEffects: 'Mild lethargy, constipation.',
      riskLevel: 'moderate',
      aliases: ['3-methylmorphine']
    },
  {
      id: 'oxycodone',
      name: 'Oxycodone',
      commonNames: ['OxyContin', 'Percocet', 'Roxicodone', 'Roxy', 'Blues', '30s'],
      category: 'opioids',
      class: 'Semi-synthetic Opioid',
      description: 'Oxycodone is a potent semi-synthetic opioid derived from thebaine. It has high oral bioavailability compared to morphine, making it extremely effective (and addictive) orally. It produces a stimulating, clear-headed euphoria compared to the "heavier" sedation of morphine or hydrocodone.',
      effects: {
        positive: ['Strong euphoria', 'Energetic relaxation', 'Pain relief', 'Social lubrication', 'Anxiety relief'],
        neutral: ['Itching', 'Sweating', 'Pupil constriction', 'Dry mouth'],
        negative: ['Nausea', 'Respiratory depression', 'Severe addiction', 'Irritability ("Opioid Rage")', 'Withdrawal']
      },
      dosage: {
        threshold: '2.5-5mg',
        light: '5-10mg',
        common: '10-25mg',
        strong: '25-40mg',
        heavy: '40mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '2.5-5mg',
                light: '5-10mg',
                common: '10-25mg',
                strong: '25-40mg',
                heavy: '40mg+'
            },
            duration: {
                onset: '20-40 minutes',
                comeup: '40-60 minutes',
                peak: '1.5-2.5 hours',
                offset: '2-4 hours',
                total: '4-6 hours'
            },
            notes: 'High oral bioavailability (~60-87%). OxyContin is extended release (12hr) but abuse usually involves crushing it.'
        },
        Insufflation: {
            dosage: {
                threshold: '2.5-5mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-40mg',
                heavy: '40mg+'
            },
            duration: {
                onset: '2-5 minutes',
                comeup: '10-15 minutes',
                peak: '30-60 minutes',
                offset: '2-3 hours',
                total: '3-5 hours'
            },
            notes: 'Snorting crushed pills. Faster onset but lower bioavailability than oral. High burn.'
        }
    },
      interactions: ['Alcohol', 'Benzodiazepines', 'CYP3A4 inhibitors (grapefruit juice potentiates)', 'Other depressants'],
      harmReduction: [
        'Street "Oxy" pills (M30s) are frequently pressed fentanyl - ALWAYS test',
        'Do not snort pills containing acetaminophen (Percocet)',
        'Perform Cold Water Extraction (CWE) if acetaminophen is present for oral high doses',
        'Tolerance builds rapidly'
      ],
      legality: 'Prescription only. Schedule II in the US.',
      chemistry: {
        formula: 'C18H21NO4',
        molecularWeight: '315.37 g/mol',
        class: 'Thebaine-derivative'
      },
      history: 'Synthesized in 1916. OxyContin marketing in the late 90s is often cited as a catalyst for the US opioid epidemic.',
      routes: ['Oral', 'Insufflation', 'Intravenous (dangerous due to pill binders)'],
      afterEffects: 'Irritability, craving, depression.',
      riskLevel: 'high',
      aliases: ['dihydrohydroxycodeinone']
    },
  {
      id: 'hydrocodone',
      name: 'Hydrocodone',
      commonNames: ['Vicodin', 'Norco', 'Lortab', 'Hydros', 'Vikes'],
      category: 'opioids',
      class: 'Semi-synthetic Opioid',
      description: 'Hydrocodone is a semi-synthetic opioid derived from codeine. It is almost always formulated with acetaminophen (paracetamol) in the US. It is roughly equivalent in strength to morphine orally, but slightly weaker than oxycodone. It tends to be more sedating than oxycodone.',
      effects: {
        positive: ['Euphoria', 'Pain relief', 'Relaxation', 'Cough suppression', 'Warm fuzzy feeling'],
        neutral: ['Sedation', 'Itching', 'Pupil constriction'],
        negative: ['Nausea', 'Respiratory depression', 'Liver damage (from acetaminophen)', 'Dependence', 'Constipation']
      },
      dosage: {
        threshold: '5mg',
        light: '5-10mg',
        common: '10-20mg',
        strong: '20-30mg',
        heavy: '30mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '5mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-30mg',
                heavy: '30mg+'
            },
            duration: {
                onset: '20-40 minutes',
                comeup: '45-60 minutes',
                peak: '1.5-2.5 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Usually combined with Acetaminophen. CWE required for doses >1000mg APAP.'
        }
    },
      interactions: ['Alcohol (double liver toxicity risk)', 'Benzodiazepines', 'Antihistamines'],
      harmReduction: [
        'Acetaminophen toxicity is the main risk - do not exceed 4000mg APAP/day',
        'Perform Cold Water Extraction (CWE) for recreational doses',
        'Do not snort (acetaminophen damages nasal cartilage and blocks absorption)',
        'Have naloxone available'
      ],
      legality: 'Prescription only. Rescheduled to Schedule II in the US (formerly Schedule III).',
      chemistry: {
        formula: 'C18H21NO3',
        molecularWeight: '299.36 g/mol',
        class: 'Codeine-derivative'
      },
      history: 'Synthesized in 1920. One of the most prescribed drugs in US history.',
      routes: ['Oral'],
      afterEffects: 'Grogginess, irritability.',
      riskLevel: 'high',
      aliases: ['dihydrocodeinone']
    },
  {
      id: 'hydromorphone',
      name: 'Hydromorphone',
      commonNames: ['Dilaudid', 'Dillies', 'Shields', 'H-Bomb'],
      category: 'opioids',
      class: 'Semi-synthetic Opioid',
      description: 'Hydromorphone is a ketone derivative of morphine. It is significantly more potent than morphine (5-8x). It is known for a very intense "rush" when injected, but has poor oral bioavailability, leading to a large discrepancy between oral and IV dosages.',
      effects: {
        positive: ['Intense euphoric rush (IV)', 'Strong pain relief', 'Sedation', 'Anxiolysis'],
        neutral: ['Nodding', 'Pupil constriction'],
        negative: ['Severe respiratory depression', 'Nausea', 'High overdose risk', 'Short duration (compulsive redosing)']
      },
      dosage: {
        threshold: '1-2mg (oral)',
        light: '2-4mg (oral)',
        common: '4-8mg (oral)',
        strong: '8-16mg (oral)',
        heavy: '16mg+ (oral)'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '1-2mg',
                light: '2-4mg',
                common: '4-8mg',
                strong: '8-16mg',
                heavy: '16mg+'
            },
            duration: {
                onset: '30-45 minutes',
                comeup: '45-60 minutes',
                peak: '1-2 hours',
                offset: '2-3 hours',
                total: '3-5 hours'
            },
            notes: 'Low bioavailability (~30-50%). Effects are much weaker than IV.'
        },
        Intravenous: {
            dosage: {
                threshold: '0.25-0.5mg',
                light: '0.5-1mg',
                common: '1-2mg',
                strong: '2-4mg',
                heavy: '4mg+'
            },
            duration: {
                onset: '10-30 seconds',
                comeup: '1-2 minutes',
                peak: '5-15 minutes',
                offset: '1-2 hours',
                total: '2-3 hours'
            },
            notes: 'EXTREME CAUTION. The "rush" is famous but short-lived. High overdose risk.'
        },
        Insufflation: {
             dosage: {
                threshold: '1-2mg',
                light: '2-4mg',
                common: '4-6mg',
                strong: '6-8mg',
                heavy: '8mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '10-20 minutes',
                peak: '30-60 minutes',
                offset: '2-3 hours',
                total: '3-5 hours'
            },
            notes: 'Better bioavailability than oral (~50-60%).'
        }
    },
      interactions: ['Benzodiazepines', 'Alcohol', 'Other opioids'],
      harmReduction: [
        'Measure IV doses very carefully - milligram precision matters',
        'Pills contain binders bad for veins - use micron filters',
        'Tolerance rises fast',
        'Never use alone'
      ],
      legality: 'Prescription only. Schedule II in the US.',
      chemistry: {
        formula: 'C17H19NO3',
        molecularWeight: '285.34 g/mol',
        class: 'Morphinone-derivative'
      },
      history: 'Patented in 1923. Preferred in hospital settings for severe acute pain due to rapid onset.',
      routes: ['Oral', 'Intravenous', 'Insufflation', 'Rectal'],
      afterEffects: 'Strong cravings due to short duration.',
      riskLevel: 'very-high',
      aliases: ['dihydromorphinone']
    },
  {
      id: 'oxymorphone',
      name: 'Oxymorphone',
      commonNames: ['Opana', 'Stop Signs', 'O-Bomb', 'Blues'],
      category: 'opioids',
      class: 'Semi-synthetic Opioid',
      description: 'Oxymorphone is a highly potent opioid analgesic. Like hydromorphone, it has low oral bioavailability (~10%) but is incredibly potent when snorted or injected. It is often considered one of the most euphoric opioids, leading to extremely high abuse potential.',
      effects: {
        positive: ['Overwhelming euphoria', 'Heavy sedation', 'Pain elimination', 'Dream-like state'],
        neutral: ['Itching', 'Nodding'],
        negative: ['Severe respiratory depression', 'Rapid tolerance', 'Severe withdrawal', 'Nausea/Vomiting']
      },
      dosage: {
        threshold: '5mg (oral)',
        light: '5-10mg (oral)',
        common: '10-20mg (oral)',
        strong: '20-30mg (oral)',
        heavy: '30mg+ (oral)'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '5mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-30mg',
                heavy: '30mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '1.5-2.5 hours',
                offset: '3-5 hours',
                total: '4-7 hours'
            },
            notes: 'Very inefficient route (~10% bioavailability). Taking with a high-fat meal can dangerously increase absorption.'
        },
        Insufflation: {
            dosage: {
                threshold: '1-2mg',
                light: '2-5mg',
                common: '5-10mg',
                strong: '10-15mg',
                heavy: '15mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '15-20 minutes',
                peak: '45-90 minutes',
                offset: '3-4 hours',
                total: '4-6 hours'
            },
            notes: 'Primary route of abuse. ~40% bioavailability (4x stronger than oral). Silicone coating on new pills makes this difficult.'
        }
    },
      interactions: ['Alcohol (DOSE DUMPING RISK with ER pills)', 'Benzodiazepines', 'Other opioids'],
      harmReduction: [
        'Do not consume alcohol with Opana ER (can cause rapid release of entire dose)',
        'Snorting is significantly more potent than swallowing - adjust dose accordingly',
        'Silicosis risk from snorting reformatted pills',
        'High overdose risk'
      ],
      legality: 'Prescription only. Schedule II in the US.',
      chemistry: {
        formula: 'C17H19NO4',
        molecularWeight: '301.34 g/mol',
        class: 'Morphinone-derivative'
      },
      history: 'Developed in 1914. Gained popularity in the 2000s/2010s as an alternative to OxyContin.',
      routes: ['Oral', 'Insufflation', 'Intravenous'],
      afterEffects: 'Severe withdrawal and depression.',
      riskLevel: 'very-high',
      aliases: ['14-hydroxydihydromorphinone']
    },
  {
      id: 'methadone',
      name: 'Methadone',
      commonNames: ['Dolophine', 'Methadose', 'Done', 'Juice'],
      category: 'opioids',
      class: 'Synthetic Opioid',
      description: 'Methadone is a synthetic opioid used for pain and opioid maintenance therapy (OMT). It has an extremely long half-life (24-60 hours). It prevents withdrawal and blocks the euphoric effects of other opioids. Recreational use is dangerous due to the delay between ingestion and peak effect, leading to "stacking" doses and overdose.',
      effects: {
        positive: ['Pain relief', 'Withdrawal prevention', 'Mood stability', 'Sedation'],
        neutral: ['Sweating (profuse)', 'Constipation', 'Weight gain', 'Libido loss'],
        negative: ['Respiratory depression', 'QT Prolongation (heart rhythm issues)', 'Fatal overdose from accumulation', 'Extremely long withdrawal']
      },
      dosage: {
        threshold: '5mg',
        light: '5-10mg',
        common: '10-20mg',
        strong: '20-40mg',
        heavy: '40mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '5mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-40mg',
                heavy: '40mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '1-3 hours',
                peak: '3-5 hours',
                offset: '12-24 hours',
                total: '24 hours+'
            },
            notes: 'High oral bioavailability. Danger: Respiratory depression lasts longer than analgesia.'
        }
    },
      interactions: ['Benzodiazepines (Very common cause of death)', 'Alcohol', 'QT-prolonging drugs', 'Grapefruit juice'],
      harmReduction: [
        'Do not redose if you don\'t feel it - peak is delayed',
        'Accumulates in body - dose that is safe on day 1 may overdose on day 3',
        'Store safely away from children (red liquid looks like juice)',
        'Withdrawal lasts a month or more - taper slowly'
      ],
      legality: 'Prescription only. Schedule II. Tightly regulated via clinics for addiction treatment.',
      chemistry: {
        formula: 'C21H27NO',
        molecularWeight: '309.45 g/mol',
        class: 'Diphenylheptane'
      },
      history: 'Synthesized in Germany (1937) during WWII due to opium shortages. Introduced to US in 1947.',
      routes: ['Oral', 'Intravenous (rare)'],
      afterEffects: 'Prolonged grogginess.',
      riskLevel: 'high',
      aliases: ['amidone']
    },
  {
      id: 'fentanyl',
      name: 'Fentanyl',
      commonNames: ['Duragesic', 'China White', 'Fent', 'Blues', 'M30s'],
      category: 'opioids',
      class: 'Synthetic Opioid',
      description: 'Fentanyl is a synthetic opioid ~50-100x stronger than morphine. It is used medically for anesthesia and breakthrough cancer pain. Illicit fentanyl (often pressed into fake pills) is the primary driver of overdose deaths. It has a rapid onset and short duration, but high lipid solubility allows it to store in fat with chronic use.',
      effects: {
        positive: ['Overwhelming sedation', 'Pain elimination', 'Rush (IV/Smoked)'],
        neutral: ['Nodding', 'Amnesia'],
        negative: ['Instant respiratory arrest', 'Chest wall rigidity ("Wooden Chest" - makes CPR difficult)', 'Cardiac arrest', 'Death']
      },
      dosage: {
        threshold: '10-25μg (micrograms)',
        light: '25-50μg',
        common: '50-100μg',
        strong: '100-150μg',
        heavy: '150μg+ (Lethal for non-tolerant)'
      },
      routeData: {
        Intravenous: {
            dosage: {
                threshold: '10-25μg',
                light: '25-50μg',
                common: '50-100μg',
                strong: '100μg+',
                heavy: 'Varies'
            },
            duration: {
                onset: 'Immediate',
                comeup: '10-30 seconds',
                peak: '2-5 minutes',
                offset: '30-60 minutes',
                total: '1-1.5 hours'
            },
            notes: 'Microgram dosing is essential. Street powder is impossible to dose safely without volumetric dilution.'
        },
        Smoking: {
             dosage: {
                threshold: '10-25μg',
                light: '25-50μg',
                common: '50-75μg',
                strong: '75μg+',
                heavy: 'Varies'
            },
            duration: {
                onset: 'Seconds',
                comeup: '1-2 minutes',
                peak: '5-10 minutes',
                offset: '30-45 minutes',
                total: '1 hour'
            },
            notes: 'Smoking "Dirty 30s" on foil. Very high urge to redose.'
        },
        Transdermal: {
             dosage: {
                threshold: '12μg/hr',
                light: '12-25μg/hr',
                common: '25-50μg/hr',
                strong: '50-100μg/hr',
                heavy: '100μg/hr+'
            },
            duration: {
                onset: '6-12 hours',
                comeup: '12-24 hours',
                peak: '24-72 hours',
                offset: '12-24 hours',
                total: '72 hours'
            },
            notes: 'Patches (Duragesic). Do not cut or heat patches (heat causes rapid overdose).'
        }
    },
      interactions: ['Everything. Any depressant significantly increases death risk.'],
      harmReduction: [
        'ASSUME ALL STREET DRUGS CONTAIN FENTANYL',
        'Use Fentanyl Test Strips',
        'Carry multiple doses of Narcan (fentanyl often requires 2-3+ doses)',
        'Never use alone',
        'Wooden Chest Syndrome can prevent breathing even if conscious - requires paralysis/ventilation in hospital'
      ],
      legality: 'Schedule II (medical) / Schedule I (analogues).',
      chemistry: {
        formula: 'C22H28N2O',
        molecularWeight: '336.47 g/mol',
        class: 'Phenylpiperidine'
      },
      history: 'Synthesized by Paul Janssen in 1960. Adopted for anesthesia.',
      routes: ['IV', 'Transdermal', 'Transmucosal (lollipop)', 'Smoking', 'Insufflation'],
      afterEffects: 'Rapid withdrawal onset.',
      riskLevel: 'very-high',
      aliases: ['sublimaze']
    },
  {
      id: 'carfentanil',
      name: 'Carfentanil',
      commonNames: ['Wildnil', 'Drop Dead'],
      category: 'opioids',
      class: 'Synthetic Opioid',
      description: 'Carfentanil is an analogue of fentanyl with an analgesic potency 10,000 times that of morphine. It is intended only for large animal use (elephants, rhinos). It is a chemical weapon candidate and an extremely lethal adulterant in street drugs.',
      effects: {
        positive: ['None for humans'],
        neutral: ['Unconsciousness'],
        negative: ['Immediate Death']
      },
      dosage: {
        threshold: 'Unknown (sub-microgram)',
        light: 'Unknown',
        common: 'DO NOT USE',
        strong: 'Death',
        heavy: 'Death'
      },
      routeData: {
          Intravenous: {
            dosage: { threshold: '1μg (Lethal)', light: '1μg', common: '1μg', strong: '1μg', heavy: '1μg' },
            duration: { onset: 'Immediate', comeup: 'N/A', peak: 'N/A', offset: 'N/A', total: 'N/A' },
            notes: 'Active at nanogram levels. An amount smaller than a grain of salt is fatal.'
          }
      },
      interactions: ['Everything'],
      harmReduction: [
        'If suspected, evacuate area (can be absorbed through skin or inhaled)',
        'Hazmat required for cleanup',
        'Requires massive doses of Naloxone (Renaloxone) to reverse'
      ],
      legality: 'Schedule II (Veterinary only).',
      chemistry: {
        formula: 'C24H30N2O3',
        molecularWeight: '394.51 g/mol',
        class: 'Phenylpiperidine'
      },
      history: 'Synthesized in 1974. Used to tranquilize elephants. Linked to the 2002 Moscow theater hostage crisis gas.',
      routes: ['N/A'],
      afterEffects: 'Death or permanent brain damage from hypoxia.',
      riskLevel: 'very-high',
      aliases: ['4-carbo-methoxyfentanyl']
    },
  {
      id: 'acetylfentanyl',
      name: 'Acetylfentanyl',
      commonNames: ['Acetyl'],
      category: 'opioids',
      class: 'Synthetic Opioid',
      description: 'Acetylfentanyl is a fentanyl analogue that is ~15x stronger than morphine (weaker than fentanyl, stronger than heroin). It is a common designer drug/adulterant.',
      effects: {
        positive: ['Euphoria', 'Sedation', 'Pain relief'],
        neutral: ['Nodding'],
        negative: ['Respiratory depression', 'Overdose', 'Addiction']
      },
      dosage: {
        threshold: '100-200μg',
        light: '200-500μg',
        common: '500-1000μg (1mg)',
        strong: '1-2mg',
        heavy: '2mg+'
      },
      routeData: {
        Insufflation: {
             dosage: {
                threshold: '100μg',
                light: '200-500μg',
                common: '500-1000μg',
                strong: '1-2mg',
                heavy: '2mg+'
            },
            duration: {
                onset: '2-5 minutes',
                comeup: '5-10 minutes',
                peak: '30-45 minutes',
                offset: '1-2 hours',
                total: '2-3 hours'
            },
            notes: 'Designer drug often sold as "Synthetic Heroin".'
        }
      },
      interactions: ['All depressants'],
      harmReduction: [
        'Treat as Fentanyl',
        'Volumetric dosing required',
        'Test strips may cross-react but not guarantee detection'
      ],
      legality: 'Schedule I in US.',
      chemistry: {
        formula: 'C21H26N2O',
        molecularWeight: '322.45 g/mol',
        class: 'Phenylpiperidine'
      },
      history: 'Discovered in same series as fentanyl. Surfaced on illicit market around 2013.',
      routes: ['IV', 'Insufflation', 'Smoking'],
      afterEffects: 'Similar to fentanyl.',
      riskLevel: 'very-high',
      aliases: ['desmethylfentanyl']
    },
  {
      id: 'buprenorphine',
      name: 'Buprenorphine',
      commonNames: ['Suboxone', 'Subutex', 'Bupe', 'Subs', 'Strips'],
      category: 'opioids',
      class: 'Partial Opioid Agonist',
      description: 'Buprenorphine is a partial agonist at the mu-opioid receptor. It binds extremely tightly to the receptor but activates it less than full agonists (like heroin/methadone). This creates a "ceiling effect" on respiratory depression, making it safer. It is used to treat addiction and pain.',
      effects: {
        positive: ['Pain relief', 'Mood lift', 'Blocks withdrawal', 'Blocks other opioids'],
        neutral: ['Constipation', 'Insomnia', 'Sweating'],
        negative: ['Precipitated Withdrawal (if taken too soon after full agonists)', 'Nausea', 'Dependence']
      },
      dosage: {
        threshold: '0.1-0.2mg',
        light: '0.2-0.5mg',
        common: '0.5-2mg (Pain/Recreational)',
        strong: '2-8mg (Maintenance)',
        heavy: '8mg+ (Maintenance)'
      },
      routeData: {
        Sublingual: {
            dosage: {
                threshold: '0.1mg',
                light: '0.2-0.5mg',
                common: '0.5-2mg',
                strong: '4-8mg',
                heavy: '8mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '2-4 hours',
                offset: '12-24 hours',
                total: '24-72 hours'
            },
            notes: 'High affinity means it rips other opioids off receptors. If dependent on heroin/fentanyl, taking this too soon causes "Precipitated Withdrawal" (hellish instant withdrawal).'
        }
    },
      interactions: ['Benzodiazepines (respiratory depression risk still exists)', 'Alcohol', 'Full Agonist Opioids (blocked by bupe)'],
      harmReduction: [
        'WAIT until in moderate withdrawal (COWS score > 12) before induction',
        'Spit out saliva after holding strip (reduces nausea/headache)',
        'Less overdose risk than methadone but difficult to get high on if tolerant',
        'Naloxone in Suboxone is inactive sublingually; it is there to prevent injection'
      ],
      legality: 'Prescription only. Schedule III in US.',
      chemistry: {
        formula: 'C29H41NO4',
        molecularWeight: '467.64 g/mol',
        class: 'Thebaine-derivative'
      },
      history: 'Synthesized in 1966. Approved for addiction in 2002.',
      routes: ['Sublingual', 'Transdermal (Butrans)', 'Buccal', 'IV (Buprenex)'],
      afterEffects: 'Long half-life means withdrawal is delayed but prolonged.',
      riskLevel: 'moderate',
      aliases: ['suboxone']
    },
  {
      id: 'tramadol',
      name: 'Tramadol',
      commonNames: ['Ultram', 'Tramal', 'Tram'],
      category: 'opioids',
      class: 'Atypical Opioid',
      description: 'Tramadol is a weak opioid agonist that also acts as an SNRI (Serotonin-Norepinephrine Reuptake Inhibitor). It metabolizes into O-DSMT (which is the stronger opioid). Because of the SNRI activity, it lowers the seizure threshold.',
      effects: {
        positive: ['Mood lift', 'Pain relief', 'Stimulation/Energy'],
        neutral: ['Sweating', 'Dry mouth'],
        negative: ['Seizures (doses >400mg)', 'Nausea', 'Serotonin Syndrome', 'Dizziness']
      },
      dosage: {
        threshold: '50mg',
        light: '50-100mg',
        common: '100-200mg',
        strong: '200-300mg',
        heavy: '300-400mg (Seizure Risk)'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '50mg',
                light: '50-100mg',
                common: '100-200mg',
                strong: '200-300mg',
                heavy: '350mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '2-4 hours',
                offset: '4-6 hours',
                total: '6-9 hours'
            },
            notes: 'Prodrug. Genetic poor metabolizers get little effect.'
        }
      },
      interactions: ['SSRIs/MAOIs (Serotonin Syndrome)', 'Stimulants (Seizures)', 'Alcohol', 'MDMA'],
      harmReduction: [
        'NEVER exceed 400mg in 24 hours (Seizure risk)',
        'Do not mix with antidepressants',
        'If you feel "zaps" or tremors, stop immediately',
        'Addiction involves both opioid and SNRI withdrawal'
      ],
      legality: 'Prescription only. Schedule IV in US.',
      chemistry: {
        formula: 'C16H25NO2',
        molecularWeight: '263.38 g/mol',
        class: 'Cyclohexanol'
      },
      history: 'Developed by Grünenthal in 1962.',
      routes: ['Oral'],
      afterEffects: 'Depression, "Brain zaps" on withdrawal.',
      riskLevel: 'moderate',
      aliases: ['ultram']
    },
  {
      id: 'o-desmethyltramadol',
      name: 'O-Desmethyltramadol',
      commonNames: ['O-DSMT', 'O-M'],
      category: 'opioids',
      class: 'Opioid',
      description: 'O-DSMT is the active metabolite of Tramadol. It is responsible for the opioid effects of Tramadol but lacks the SNRI (serotonin) activity. This makes it a more potent "traditional" opioid with less seizure risk, often sold as a Research Chemical.',
      effects: {
        positive: ['Warm euphoria', 'Pain relief', 'Relaxation', 'Long duration'],
        neutral: ['Itching', 'Nodding'],
        negative: ['Nausea', 'Constipation', 'Addiction', 'Respiratory depression']
      },
      dosage: {
        threshold: '10-20mg',
        light: '20-40mg',
        common: '40-80mg',
        strong: '80-120mg',
        heavy: '120mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '10-20mg',
                light: '20-40mg',
                common: '40-80mg',
                strong: '80-120mg',
                heavy: '120mg+'
            },
            duration: {
                onset: '30-45 minutes',
                comeup: '45-90 minutes',
                peak: '2-4 hours',
                offset: '4-6 hours',
                total: '8-10 hours'
            },
            notes: 'Significantly stronger than Tramadol. Long legs (duration).'
        }
      },
      interactions: ['Benzodiazepines', 'Alcohol', 'Other opioids'],
      harmReduction: [
        'Though safer than Tramadol re: seizures, it is a potent full agonist opioid',
        'Addiction potential is higher than Tramadol',
        'Boofing (rectal) is reported to be very effective'
      ],
      legality: 'Gray area (Analogue Act) in US. Not scheduled federally but illegal for human consumption.',
      chemistry: {
        formula: 'C15H23NO2',
        molecularWeight: '249.35 g/mol',
        class: 'Cyclohexanol'
      },
      history: 'Identified as main metabolite of Tramadol. Entered RC market ~2010s.',
      routes: ['Oral', 'Rectal', 'Insufflation'],
      afterEffects: 'Standard opioid hangover.',
      riskLevel: 'moderate',
      aliases: ['desmetramadol']
    },
  {
      id: 'tapentadol',
      name: 'Tapentadol',
      commonNames: ['Nucynta', 'Palexia', 'Taps'],
      category: 'opioids',
      class: 'Atypical Opioid',
      description: 'Tapentadol is chemically similar to Tramadol but acts as both a mu-opioid agonist and a Norepinephrine Reuptake Inhibitor (NRI). It does NOT affect serotonin significantly, reducing seizure/interaction risks compared to Tramadol. It is roughly between Tramadol and Oxycodone in potency.',
      effects: {
        positive: ['Pain relief', 'Euphoria', 'Dreamy state'],
        neutral: ['Visual hallucinations (at high doses)', 'Confusion', 'Dizziness'],
        negative: ['Delirium (high doses)', 'Nausea', 'Respiratory depression', 'Agitation']
      },
      dosage: {
        threshold: '25-50mg',
        light: '50-75mg',
        common: '75-150mg',
        strong: '150-250mg',
        heavy: '250mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '25-50mg',
                light: '50-75mg',
                common: '75-150mg',
                strong: '150-250mg',
                heavy: '250mg+'
            },
            duration: {
                onset: '30-45 minutes',
                comeup: '45-60 minutes',
                peak: '1.5-2.5 hours',
                offset: '3-4 hours',
                total: '4-6 hours'
            },
            notes: 'Hallucinations/Shadow people common at heavy doses (NRI effect).'
        }
      },
      interactions: ['MAOIs', 'Alcohol', 'Benzodiazepines'],
      harmReduction: [
        'Do not crush ER pills',
        'High doses can feel deliriant/dysphoric',
        'Less nausea than morphine'
      ],
      legality: 'Prescription only. Schedule II in US.',
      chemistry: {
        formula: 'C14H23NO',
        molecularWeight: '221.34 g/mol',
        class: 'Benzenoid'
      },
      history: 'Approved in 2008.',
      routes: ['Oral'],
      afterEffects: 'Grogginess, mild depression.',
      riskLevel: 'moderate',
      aliases: ['nucynta']
    },
  {
      id: 'desomorphine',
      name: 'Desomorphine',
      commonNames: ['Krokodil', 'Crocodil'],
      category: 'opioids',
      class: 'Semi-synthetic Opioid',
      description: 'Desomorphine itself is a potent opioid (8-10x morphine) with very rapid onset and short duration. However, it is infamous for "Krokodil," a crude homemade version made from codeine, iodine, and red phosphorus. The impurities cause severe tissue necrosis, gangrene, and scale-like skin damage.',
      effects: {
        positive: ['Intense rush', 'Euphoria (short lived)'],
        neutral: ['Sedation'],
        negative: ['SEVERE TISSUE NECROSIS', 'Gangrene', 'Rotting flesh', 'Bone infection', 'Amputation', 'Death']
      },
      dosage: {
        threshold: '0.5-1mg',
        light: '1-2mg',
        common: '2-4mg',
        strong: '4-6mg',
        heavy: '6mg+'
      },
      routeData: {
        Intravenous: {
            dosage: {
                threshold: '0.5mg',
                light: '1-2mg',
                common: '2-4mg',
                strong: '4-6mg',
                heavy: '6mg+'
            },
            duration: {
                onset: 'Immediate',
                comeup: 'Seconds',
                peak: '10-20 minutes',
                offset: '45-60 minutes',
                total: '1-1.5 hours'
            },
            notes: 'Short duration drives compulsive redosing. "Krokodil" users often die within 2 years of first use due to tissue damage.'
        }
      },
      interactions: ['Anything'],
      harmReduction: [
        'DO NOT USE KROKODIL',
        'Pure desomorphine is pharmacologically safe-ish, but street Krokodil is a death sentence',
        'If used, seek immediate medical attention for skin lesions'
      ],
      legality: 'Schedule I in US.',
      chemistry: {
        formula: 'C17H21NO2',
        molecularWeight: '271.35 g/mol',
        class: 'Morphinan'
      },
      history: 'Synthesized 1932. Krokodil epidemic began in Russia ~2003.',
      routes: ['IV'],
      afterEffects: 'Physical destruction.',
      riskLevel: 'very-high',
      aliases: ['dihydrodesoxymorphine']
    },
  {
      id: 'dihydrocodeine',
      name: 'Dihydrocodeine',
      commonNames: ['DHC', 'DF-118'],
      category: 'opioids',
      class: 'Semi-synthetic Opioid',
      description: 'Dihydrocodeine is approximately 1.5-2x stronger than codeine. It is active itself, but some is also metabolized into dihydromorphine. It provides better pain relief than codeine with slightly fewer histamine side effects.',
      effects: {
        positive: ['Euphoria', 'Relaxation', 'Pain relief', 'Warmth'],
        neutral: ['Itching', 'Constipation'],
        negative: ['Nausea', 'Dizziness']
      },
      dosage: {
        threshold: '10-20mg',
        light: '20-40mg',
        common: '40-80mg',
        strong: '80-150mg',
        heavy: '150mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '10-20mg',
                light: '20-40mg',
                common: '40-80mg',
                strong: '80-150mg',
                heavy: '150mg+'
            },
            duration: {
                onset: '30-45 minutes',
                comeup: '45-60 minutes',
                peak: '1.5-2 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Popular in UK/Japan.'
        }
      },
      interactions: ['Alcohol', 'Benzodiazepines'],
      harmReduction: [
        'CWE required if pills contain paracetamol',
        'Less ceiling effect than codeine but side effects still mount high'
      ],
      legality: 'Schedule II in US (rarely prescribed). OTC in some countries.',
      chemistry: {
        formula: 'C18H23NO3',
        molecularWeight: '301.38 g/mol',
        class: 'Codeine-derivative'
      },
      history: 'Developed in 1908.',
      routes: ['Oral'],
      afterEffects: 'Mild hangover.',
      riskLevel: 'moderate',
      aliases: ['drocode']
    },
  {
      id: 'tianeptine',
      name: 'Tianeptine',
      commonNames: ['Tianaa', 'Zaza', 'Coaxil', 'Stablon', 'Gas Station Heroin'],
      category: 'opioids',
      class: 'Atypical Antidepressant',
      description: 'Tianeptine is a tricyclic antidepressant used in Europe/Asia. At high doses (far exceeding therapeutic levels), it acts as a full mu-opioid agonist. It causes rapid tolerance and has a very short duration, leading to severe addiction and a notoriously difficult withdrawal that combines opioid symptoms with antidepressant discontinuation symptoms.',
      effects: {
        positive: ['Euphoria', 'Anxiolysis', 'Mood lift'],
        neutral: ['Nodding', 'Slurring'],
        negative: ['Severe Withdrawal', 'Nausea', 'Rapid Tolerance', 'Vein damage (caustic)', 'Edema (swelling)']
      },
      dosage: {
        threshold: '12.5mg (Therapeutic)',
        light: '25-50mg',
        common: '50-100mg',
        strong: '100-250mg',
        heavy: '250mg+ (Users reach grams/day)'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '12.5mg',
                light: '25-50mg',
                common: '50-100mg',
                strong: '100-300mg',
                heavy: '300mg+'
            },
            duration: {
                onset: '15-30 minutes',
                comeup: '15-30 minutes',
                peak: '1-1.5 hours',
                offset: '1-2 hours',
                total: '2-3 hours'
            },
            notes: 'Short duration forces users to dose every 2-3 hours, waking up at night to dose.'
        }
      },
      interactions: ['Alcohol', 'Opioids', 'Antidepressants'],
      harmReduction: [
        'Avoid recreational use - addiction potential is extremely high',
        'Do not inject (caustic - causes abscesses/necrosis)',
        'Withdrawal requires medical supervision',
        'Sold deceptively as "supplements"'
      ],
      legality: 'Unscheduled federally in US (though banned in several states like AL, GA, MS, etc.). Prescription in EU.',
      chemistry: {
        formula: 'C21H25ClN2O4S',
        molecularWeight: '436.95 g/mol',
        class: 'Tricyclic'
      },
      history: 'Patented in 1960s France. Emerged as US gas station drug ~2015.',
      routes: ['Oral'],
      afterEffects: 'Depression, severe rebound anxiety.',
      riskLevel: 'high',
      aliases: ['stablon']
    },
];


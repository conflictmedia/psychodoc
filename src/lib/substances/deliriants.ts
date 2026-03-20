// Deliriants Substances

import type { Substance } from '../types';

export const deliriants: Substance[] = [
  {
      id: 'datura',
      name: 'Datura',
      commonNames: ['Jimson Weed', 'Devil\'s Trumpet', 'Thorn Apple', 'Moonflower', 'Mad Apple'],
      category: 'deliriants',
      class: 'Tropane Alkaloid',
      description: 'Datura is a genus of poisonous plants belonging to the Solanaceae family. It contains potent anticholinergic tropane alkaloids (scopolamine, hyoscyamine, and atropine). Ingestion leads to a state of delirium characterized by complete inability to differentiate hallucination from reality, severe memory loss, and potentially fatal physiological effects.',
      effects: {
        positive: ['None reliably'],
        neutral: ['Sedation', 'Dreamless sleep (after effects wear off)'],
        negative: ['True hallucinations (Phantom smoking, talking to people not there)', 'Photophobia (Extreme light sensitivity)', 'Severe dry mouth ("Cottonmouth")', 'Hyperthermia', 'Tachycardia', 'Urinary retention', 'Amnesia', 'Death']
      },
      dosage: {
        threshold: 'Unknown',
        light: 'Dangerous',
        common: 'Dangerous',
        strong: 'Life-Threatening',
        heavy: 'Likely Fatal'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: 'Varies wildly',
                light: 'N/A',
                common: 'N/A',
                strong: 'N/A',
                heavy: 'N/A'
            },
            duration: {
                onset: '30-120 minutes',
                comeup: '1-3 hours',
                peak: '6-12 hours',
                offset: '12-24 hours',
                total: '24-72 hours'
            },
            notes: 'Potency varies up to 5:1 between seeds/leaves. One pod can be fatal. DO NOT INGEST.'
        },
        Smoking: {
             dosage: {
                threshold: 'Varies',
                light: 'N/A',
                common: 'N/A',
                strong: 'N/A',
                heavy: 'N/A'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '15-30 minutes',
                peak: '1-3 hours',
                offset: '3-6 hours',
                total: '4-8 hours'
            },
            notes: 'Slightly safer than oral due to ability to titrate, but still extremely high risk.'
        }
    },
      interactions: ['Antihistamines (Fatal)', 'Alcohol', 'Stimulants (Heart failure)', 'Depressants'],
      harmReduction: [
        'DO NOT USE. There is no recreational value.',
        'If ingested, seek immediate medical attention (Physostigmine is the antidote)',
        'Sitter is mandatory to prevent user from walking into traffic/harming self',
        'Lock doors and windows'
      ],
      legality: 'Legal to grow (US). Illegal to prepare for consumption in some states.',
      chemistry: {
        formula: 'C17H21NO4 (Scopolamine)',
        molecularWeight: '303.35 g/mol',
        class: 'Tropane'
      },
      history: 'Used historically in witchcraft ("Flying Ointments") and initiation rites. Responsible for many accidental poisonings.',
      routes: ['Oral', 'Smoking', 'Transdermal'],
      afterEffects: 'Blurry vision for days/weeks. Dry mouth. Memory gaps.',
      riskLevel: 'very-high',
      aliases: ['jimson weed', 'hells bells']
    },
  {
      id: 'muscimol',
      name: 'Amanita Muscaria',
      commonNames: ['Fly Agaric', 'Mario Mushroom', 'Soma'],
      category: 'deliriants',
      class: 'Isoxazole',
      description: 'The iconic red-and-white mushroom. It contains Ibotenic Acid (neurotoxin) which decarboxylates into Muscimol (GABA-A agonist) upon drying/heating. It is not a psychedelic like psilocybin; it is a deliriant-hypnotic that causes a dream-like stupor, repetitive motion syndrome, and size distortion (macropsia/micropsia).',
      effects: {
        positive: ['Euphoria', 'Dream-like state', 'Energy (at low doses)'],
        neutral: ['Looping thoughts', 'Size distortion (Alice in Wonderland syndrome)', 'Sedation'],
        negative: ['Nausea/Vomiting (Severe)', 'Muscle twitching', 'Delirium', 'Seizures (if high Ibotenic Acid content)']
      },
      dosage: {
        threshold: '1-5g (Dried caps)',
        light: '5-10g',
        common: '10-15g',
        strong: '15-30g',
        heavy: '30g+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '2g',
                light: '5g',
                common: '10g',
                strong: '15g+',
                heavy: 'N/A'
            },
            duration: {
                onset: '30-90 minutes',
                comeup: '2 hours',
                peak: '5-10 hours',
                offset: '2-4 hours',
                total: '10-14 hours'
            },
            notes: 'MUST be fully dried/heated (170°F) to convert toxins. Raw mushrooms are neurotoxic.'
        }
    },
      interactions: ['Alcohol', 'Benzodiazepines', 'Z-Drugs'],
      harmReduction: [
        'Never eat raw',
        'Carbonated drinks can reverse the conversion of Muscimol back to Ibotenic acid in the stomach (avoid soda)',
        'Potency varies wildly by season/location',
        'Sitter recommended for high doses'
      ],
      legality: 'Legal (US - except Louisiana). Unregulated.',
      chemistry: {
        formula: 'C4H6N2O2',
        molecularWeight: '114.1 g/mol',
        class: 'Isoxazole'
      },
      history: 'Proposed as the "Soma" of the Rig Veda. Used by Siberian shamans (who drank the urine of reindeer/others who ate the mushroom to filter toxins).',
      routes: ['Oral', 'Smoked (skin)'],
      afterEffects: 'Drowsiness, vivid dreams.',
      riskLevel: 'high',
      aliases: ['fly agaric']
    },
  {
      id: 'dph',
      name: 'Diphenhydramine',
      commonNames: ['Benadryl', 'DPH', 'Pink Ladies', 'Unisom'],
      category: 'deliriants',
      class: 'Antihistamine',
      description: 'Diphenhydramine is an OTC antihistamine. At recommended doses (25-50mg), it causes sedation. At overdose levels (300mg+), it acts as a potent anticholinergic deliriant, causing nightmare-like hallucinations (spiders, shadow people), impending doom, and short-term memory failure.',
      effects: {
        positive: ['Music enhancement (lower doses)', 'Sedation', 'Masturbation enhancement'],
        neutral: ['Dry mouth', 'Heavy legs'],
        negative: ['"Spiders" and insects', 'Shadow People', 'Restless Leg Syndrome (RLS)', 'Impending doom', 'Organ damage', 'Dementia risk (long term)']
      },
      dosage: {
        threshold: '100mg',
        light: '150-250mg',
        common: '250-500mg',
        strong: '500-700mg',
        heavy: '700mg+ (Seizure/Heart attack risk)'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '100mg',
                light: '200mg',
                common: '400mg',
                strong: '600mg',
                heavy: '700mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '45-90 minutes',
                peak: '2-4 hours',
                offset: '2-4 hours',
                total: '6-10 hours'
            },
            notes: 'High doses are physically painful (RLS/Dysphoria).'
        }
    },
      interactions: ['Alcohol', 'MAOIs', 'Depressants', 'DXM (Counter-flipping)'],
      harmReduction: [
        'Linked to early-onset dementia',
        'Extremely habit-forming despite dysphoria',
        'Hydrate significantly',
        'Do not exceed 700mg'
      ],
      legality: 'Legal OTC (US).',
      chemistry: {
        formula: 'C17H21NO',
        molecularWeight: '255.35 g/mol',
        class: 'Ethanolamine'
      },
      history: 'First antihistamine synthesized (1943).',
      routes: ['Oral'],
      afterEffects: 'Depression, brain fog, memory gaps.',
      riskLevel: 'high',
      aliases: ['benadryl']
    }
];

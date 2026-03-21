// Empathogens Substances

import type { Substance } from '../types';

export const empathogens: Substance[] = [
  {
      id: 'mdma',
      name: 'MDMA',
      commonNames: ['Molly', 'Ecstasy', 'E', 'XTC', 'Mandy', 'Pingers'],
      category: 'empathogens',
      class: 'Amphetamine',
      description: 'MDMA (3,4-Methylenedioxymethamphetamine) is the quintessential empathogen. It acts as a releasing agent of serotonin, norepinephrine, and dopamine. It produces a unique state of emotional openness, empathy, energy, and euphoria. It is currently in Phase 3 clinical trials for the treatment of PTSD.',
      effects: {
        positive: ['Extreme empathy', 'Euphoria', 'Music enhancement', 'Tactile enhancement', 'Decreased fear/anxiety'],
        neutral: ['Nystagmus (Eye wiggles)', 'Bruxism (Jaw clenching)', 'Sweating', 'Time distortion'],
        negative: ['Comedown (Tuesday Blues)', 'Neurotoxicity (high doses)', 'Hyperthermia', 'Hyponatremia (water intoxication)', 'Memory loss']
      },
      dosage: {
        threshold: '30mg',
        light: '50-75mg',
        common: '75-125mg',
        strong: '125-175mg',
        heavy: '175mg+ (High neurotoxicity risk)'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '30mg',
                light: '50-75mg',
                common: '80-120mg',
                strong: '125-170mg',
                heavy: '170mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '30-60 minutes',
                peak: '2-3 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Ideal route. Redosing (booster) of 50% initial dose can extend peak by ~1 hour.'
        },
        Insufflation: {
            dosage: {
                threshold: '20mg',
                light: '40-60mg',
                common: '60-100mg',
                strong: '100-140mg',
                heavy: '140mg+'
            },
            duration: {
                onset: '5-15 minutes',
                comeup: '15-30 minutes',
                peak: '1-2 hours',
                offset: '1-2 hours',
                total: '3-4 hours'
            },
            notes: 'Painful. Short duration. Drains serotonin faster for less magic. Not recommended.'
        }
    },
      interactions: ['MAOIs (FATAL - Serotonin Syndrome)', 'SSRIs (Blocks effects completely)', 'DXM', 'Tramadol', 'Alcohol'],
      harmReduction: [
        'Test your substance (Marquis reagent)',
        '3-Month Rule: Wait 3 months between uses to recover serotonin and prevent magic loss',
        'Hydrate: 500ml/hr if active, 250ml/hr if sedentary',
        'Keep body temperature down',
        'Magnesium Glycinate helps with jaw clenching'
      ],
      legality: 'Schedule I (US). Clinical trials active.',
      chemistry: {
        formula: 'C11H15NO2',
        molecularWeight: '193.25 g/mol',
        class: 'Amphetamine'
      },
      history: 'Synthesized 1912 by Merck. Rediscovered by Shulgin 1970s. Banned 1985.',
      routes: ['Oral', 'Insufflation', 'Rectal', 'IV'],
      afterEffects: 'Depression/Fatigue 2-3 days later due to serotonin depletion.',
      riskLevel: 'moderate',
      aliases: ['3,4-methylenedioxymethamphetamine']
    },
  {
      id: 'mda',
      name: 'MDA',
      commonNames: ['Sass', 'Sally', 'Sassafras', 'Tenamfetamine'],
      category: 'empathogens',
      class: 'Amphetamine',
      description: 'MDA is a precursor to, and metabolite of, MDMA. It is known as the "harder," more psychedelic, and more neurotoxic cousin of MDMA. It lasts longer and produces more visual hallucinations but offers less emotional warmth/empathy than MDMA.',
      effects: {
        positive: ['Euphoria', 'Visuals (geometry/tracers)', 'Energy', 'Music appreciation'],
        neutral: ['Heavy body load', 'Jaw clenching', 'Sweating'],
        negative: ['Neurotoxicity (Higher than MDMA)', 'Hepatotoxicity', 'Severe comedown', 'Hallucinations (deliriant-like at high doses)']
      },
      dosage: {
        threshold: '30mg',
        light: '40-60mg',
        common: '60-100mg',
        strong: '100-145mg',
        heavy: '145mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '30mg',
                light: '40-60mg',
                common: '70-100mg',
                strong: '100-130mg',
                heavy: '130mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '1 hour',
                peak: '2-4 hours',
                offset: '3-4 hours',
                total: '6-8 hours'
            },
            notes: 'Longer lasting than MDMA. More stimulating.'
        }
    },
      interactions: ['MAOIs', 'SSRIs', 'Stimulants'],
      harmReduction: [
        'Neurotoxicity is significantly higher than MDMA - strict spacing of usage required',
        'Antioxidants (ALA, ALCAR) recommended',
        'Visuals can become confusing at high doses'
      ],
      legality: 'Schedule I (US).',
      chemistry: {
        formula: 'C10H13NO2',
        molecularWeight: '179.22 g/mol',
        class: 'Amphetamine'
      },
      history: 'Synthesized 1910. Popular in the 1960s as "The Love Drug" before MDMA took over.',
      routes: ['Oral', 'Insufflation'],
      afterEffects: 'Rough physical hangover.',
      riskLevel: 'high',
      aliases: ['3,4-methylenedioxyamphetamine']
    },
  {
      id: '6-apb',
      name: '6-APB',
      commonNames: ['Benzofury', 'Benfamine'],
      category: 'empathogens',
      class: 'Benzofuran',
      description: '6-APB is a benzofuran analogue of MDA. It produces effects very similar to MDA/MDMA but with a significantly longer duration (up to 10 hours) and reportedly smoother comedown. It is a full agonist at 5-HT2B, making it potentially cardiotoxic with frequent use.',
      effects: {
        positive: ['Long-lasting euphoria', 'Visuals', 'Empathy', 'Music enhancement'],
        neutral: ['Nystagmus', 'Appetite suppression'],
        negative: ['Cardiotoxicity (5-HT2B agonism)', 'Insomnia', 'Nausea', 'Vasoconstriction']
      },
      dosage: {
        threshold: '40mg',
        light: '50-70mg',
        common: '80-120mg (Succinate: 120-160mg)',
        strong: '120mg+ (Succinate: 170mg+)',
        heavy: 'Variable by batch'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '40mg',
                light: '60mg',
                common: '80-100mg (HCL)',
                strong: '120mg+ (HCL)',
                heavy: 'N/A'
            },
            duration: {
                onset: '1-2 hours',
                comeup: '2 hours',
                peak: '3-5 hours',
                offset: '3-4 hours',
                total: '8-11 hours'
            },
            notes: 'IMPORTANT: "Succinate" batches are ~40% less potent than "HCL" batches. Onset is very slow (do not redose early).'
        }
    },
      interactions: ['MAOIs', 'SSRIs'],
      harmReduction: [
        'Verify salt form (HCL vs Succinate) to dose correctly',
        'Onset takes a long time - patience is key',
        'Avoid frequent use due to potential heart valve issues'
      ],
      legality: 'Schedule I (US - Analogue Act likely). Banned UK.',
      chemistry: {
        formula: 'C11H13NO',
        molecularWeight: '175.23 g/mol',
        class: 'Benzofuran'
      },
      history: 'Synthesized by David Nichols 1993. Marketed as legal high ~2010.',
      routes: ['Oral', 'Rectal'],
      afterEffects: 'Fatigue, but generally less depression than MDMA.',
      riskLevel: 'moderate',
      aliases: ['6-(2-aminopropyl)benzofuran']
    },
  {
      id: '5-apb',
      name: '5-APB',
      commonNames: ['5-APB'],
      category: 'empathogens',
      class: 'Benzofuran',
      description: '5-APB is a positional isomer of 6-APB. It acts similarly to MDA. It is often described as producing a "couch-lock" body high with strong euphoria but less visual stimulation than 6-APB. It is often mixed with 6-APB to mimic the full MDMA experience.',
      effects: {
        positive: ['Intense Euphoria', 'Empathy', 'Tactile enhancement'],
        neutral: ['Sedation/Couch-lock', 'Jaw clenching'],
        negative: ['Nausea', 'Cardiotoxicity risk', 'Headache']
      },
      dosage: {
        threshold: '20mg',
        light: '40-60mg',
        common: '60-100mg',
        strong: '100-150mg',
        heavy: '150mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '20mg',
                light: '50mg',
                common: '80mg',
                strong: '120mg',
                heavy: '150mg+'
            },
            duration: {
                onset: '45-90 minutes',
                comeup: '1-2 hours',
                peak: '3-4 hours',
                offset: '3-4 hours',
                total: '7-10 hours'
            },
            notes: 'Often combined with 6-APB.'
        }
    },
      interactions: ['MAOIs', 'SSRIs'],
      harmReduction: [
        '5-HT2B agonist - concern for heart valves with abuse',
        'Very physically intense'
      ],
      legality: 'Gray Area/Illegal (US/UK).',
      chemistry: {
        formula: 'C11H13NO',
        molecularWeight: '175.23 g/mol',
        class: 'Benzofuran'
      },
      history: 'Similar to 6-APB.',
      routes: ['Oral'],
      afterEffects: 'Lethargy.',
      riskLevel: 'moderate',
      aliases: ['5-(2-aminopropyl)benzofuran']
    },
  {
      id: '5-mapb',
      name: '5-MAPB',
      commonNames: ['5-MAPB', 'Benzofury', 'Borax Mol'],
      category: 'empathogens',
      class: 'Benzofuran',
      description: '5-MAPB (1-(benzofuran-5-yl)-N-methylpropan-2-amine) is a synthetic entactogen of the benzofuran class. It is the dihydrobenzofuran analogue of MDMA. It is known for producing intense euphoria and empathy very similar to MDMA, but with significantly less physical stimulation ("couch-lock") and almost no visual hallucinations. It was popularized as the primary ingredient in the "Borax Combo" (a mix of 5-MAPB, a stimulant, and a tryptamine designed to mimic MDMA with less neurotoxicity).',
      effects: {
        positive: ['Intense euphoria', 'Deep empathy', 'Tactile enhancement', 'Relaxation', 'Anxiety suppression'],
        neutral: ['Nystagmus (Eye wiggles)', 'Bruxism (Jaw clenching)', 'Time distortion', 'Sedation'],
        negative: ['Nausea (common on come-up)', 'Brain zaps (withdrawal)', 'Headache', 'Cardiotoxicity risk (5-HT2B agonism)', 'Dehydration']
      },
      dosage: {
        threshold: '10-20mg',
        light: '20-40mg',
        common: '40-70mg',
        strong: '70-100mg',
        heavy: '100mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '20mg',
                light: '30-50mg',
                common: '50-80mg (HCL)',
                strong: '80-100mg (HCL)',
                heavy: '100mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '2-4 hours',
                offset: '3-4 hours',
                total: '5-8 hours'
            },
            notes: 'HCL batches are potent. Succinate batches are heavier and require ~30% more product for same effect. Often sedating on its own.'
        },
        Rectal: {
            dosage: {
                threshold: '10mg',
                light: '20-40mg',
                common: '40-60mg',
                strong: '60-80mg',
                heavy: '80mg+'
            },
            duration: {
                onset: '15-30 minutes',
                comeup: '30-45 minutes',
                peak: '2-3 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Bypasses some nausea associated with oral dosing.'
        }
    },
      interactions: ['MAOIs (Fatal)', 'SSRIs (Blocks effects)', 'Stimulants', 'Alcohol', 'Tramadol'],
      harmReduction: [
        'Check which salt form you have (HCL vs Succinate) to dose safely',
        'Do not use frequently - potent 5-HT2B agonist (heart valve risk)',
        'Combines safely with low dose stimulants (2-FMA) to counter sedation, but increases heart strain',
        'Stay hydrated'
      ],
      legality: 'Gray Area/Illegal (US Analogue Act). Banned in UK/Germany/China.',
      chemistry: {
        formula: 'C12H15NO',
        molecularWeight: '189.26 g/mol',
        class: 'Benzofuran'
      },
      history: 'Synthesized by David Nichols\' team. Popularized on online forums around 2013 as a "legal MDMA".',
      routes: ['Oral', 'Rectal', 'Insufflation (Painful)'],
      afterEffects: 'Fatigue, low mood (less severe than MDMA for many).',
      riskLevel: 'moderate',
      aliases: ['1-(benzofuran-5-yl)-N-methylpropan-2-amine']
    },
  {
      id: "kanna",
      name: "Kanna",
      commonNames: ["Mesemebrine", "Channa", "Kougoed"],
      category: "empathogens",
      class: "Psychoactive alkaloid containing succulent",
      description: "The main psychoactive effects of kanna are a result of its action as a potent serotonin reuptake inhibitor (SRI), a PDE4 inhibitor, and a monoamine releasing agent. It produces euphoric and anxiolytic effects and has been described as feeling simmilar to MDMA",
      effects : {
        positive: ['Mild euphoria', 'Anxiety reduction/Disinhibiton', 'Audio Enhancement', 'Visual Enhancement (colors, patterns, clarity)', 'Pain relief', 'Stimulation/Sedation', 'Emotion Enhancement', 'Focus/Motivation enhancement'],
        neutral: ['Appetite Supression', 'Depth perception distortion', 'Visual haze', 'Increased perspiration', 'Pupil Dilation', 'Vasodilation/Vasoconstriction'],
        negative: ['Dry mouth', 'Headaches', 'Nausea', 'Heartburn', 'Stomach bloating', 'Diarrhea', 'Motor Control Loss']
      },
      routeData: {
        Oral: {
          dosage: {
            threshold: '50mg',
            light: '500-750mg',
            common: '750-1000mg',
            strong: '1500-2000mg',
            heavy: '2000mg+'
          },
          duration: {
            onset: '30-90 minutes',
            comeup: '30-120 minutes',
            peak: '1-3 hours',
            offset: '3-4 hours',
            total: '4-6 hours'
          },
          notes: 'Slowest onset, longest main experience, Duration varies from product and person-to-person'
        },
        Sublingual: {
          dosage: {
            threshold: '50mg',
            light: '50-100mg',
            common: '100-150mg',
            strong: '150-500mg',
            heavy: '500mg+'
          },
          duration: {
            onset: '5-15 minutes',
            comeup: '15-60 minutes',
            peak: '30-90 minutes',
            offset: '1-3 hours',
            total: '2-4 hours'
          },
          notes: 'Some summaries report ~4–6 hours (this mismatch is usually product/potency + person-to-person variability)'
        },
        Smoked: {
          dosage: {
            threshold: '30-50mg',
            light: '100-150mg',
            common: '150-200mg',
            strong: '200-250mg',
            heavy: '250mg+'
          },
          duration: {
            onset: '0-1 minutes',
            comeup: '1-10 minutes',
            peak: '15-30 minutes',
            offset: '60-90 minutes',
            total: '1-2 hours'
          },
          notes: 'Duration varies from product and person-to-person'
        },
        Insufflation: {
          dosage: {
            threshold: '50mg',
            light: '50-75mg',
            common: '75-100mg',
            strong: '100-125mg',
            heavy: '125mg+'
          },
          duration: {
            onset: '0-5 minutes',
            comeup: '5-10 minutes',
            peak: '20-60 minutes',
            offset: '20-60 minutes',
            total: '60-150 minutes'
          },
          notes: 'Insufflation of kanna and kanna extracts is reported as extremely painful and damaging to nasal cavity by some. Duration varies by product and person-to-person.'
        }
      
      },
      interactions: ['MAOIs', 'Serotonin releasers', 'SSRIs', 'SNRIs', '5-HTP'],
      harmReduction: [
        'Insufflation of kanna and its extracts is reccomended against as it can be painful.',
        'Kanna can be habit forming and lead to compulsive redosing',
        'Kanna is know to exhibit "Reverse Tolerance", where in order to expierence the strongest and most theraputic effects, a person must have taken kanna recently. ',
        '5ht3 antagonists like ginger and limonene can help with side effects like nausea, heartburn, stomach bloating, diarrhea.'
      ],
      legality: 'Completely legal in the USA except for Louisiana. Illegal in the UK.',
      chemistry: {
        formula: 'C17H23NO3 (Mesembrine)',
        molecularWeight: '289.375 g/mol',
        class: 'Alkaloids'
      },
      history: 'South African plant containing numerous psychoactive alkaloids, including mesembrine and mesembrenone. Kanna was used by South African pastoralists and hunter-gatherers to enhance their mood and increase their energy. It is used as a party drug for its euphoric effects. It has been described as producing MDMA-like effects.',
      afterEffects: 'At low doses kanna often results in an "afterglow" which results in mild and generally positive effects a few hours after the peak has passed. Its effects commonly include: Mood lift, Increased sense of humor, Anxiety suppresion.',
      riskLevel: 'low',
      aliases: ['Mesembryanthemum tortuosum', 'Sceletium tortuosum']
  }


];

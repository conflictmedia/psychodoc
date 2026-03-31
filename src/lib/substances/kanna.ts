import type { Substance } from '../types';

// Substance Data
// Name: MDMA
// ID: mdma
// Categories: empathogens, stimulants
// Class: Amphetamine

export const kanna: Substance = 
{


      id: "kanna",
      name: "Kanna",
      commonNames: ["Mesemebrine", "Channa", "Kougoed"],
      categories:[
        "empathogens",
      ],
      class: "Alkaloid",
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

// Stimulants Substances

import type { Substance } from '../types';

export const stimulants: Substance[] = [
  {
      id: 'caffeine',
      name: 'Caffeine',
      commonNames: ['Coffee', 'Tea', 'Energy Drinks', 'Guarana', 'Java'],
      category: 'stimulants',
      class: 'Xanthine Alkaloid',
      description: 'Caffeine is the most widely consumed psychoactive substance in the world. It acts as a central nervous system stimulant by antagonizing adenosine receptors, which prevents drowsiness and promotes alertness. It also indirectly increases dopamine and glutamate levels. While generally safe, high doses can cause anxiety, tremors, and heart palpitations.',
      effects: {
        positive: ['Wakefulness', 'Increased concentration', 'Improved physical performance', 'Mild mood lift', 'Faster reaction time'],
        neutral: ['Diuretic effect (frequent urination)', 'Increased metabolic rate', 'Increased blood pressure'],
        negative: ['Anxiety/Jitters', 'Insomnia', 'Gastrointestinal upset', 'Headache (withdrawal or overdose)', 'Crash', 'Dependence']
      },
      dosage: {
        threshold: '10-20mg',
        light: '20-50mg',
        common: '50-150mg',
        strong: '150-300mg',
        heavy: '300mg+'
      },
      routeData: {
        Oral: {
            dosage: {
                threshold: '10-20mg',
                light: '20-50mg',
                common: '50-150mg',
                strong: '150-300mg',
                heavy: '300mg+'
            },
            duration: {
                onset: '10-30 minutes',
                comeup: '15-45 minutes',
                peak: '1-2 hours',
                offset: '3-5 hours',
                total: '4-6 hours'
            },
            notes: 'Bioavailability is near 100%. Half-life varies significantly by individual (3-7 hours).'
        }
    },
      interactions: ['MAOIs (weak interaction)', 'Stimulants', 'Alcohol ("Buckfast" effect - masks sedation)', 'Adenosine (blocked by caffeine)'],
      harmReduction: [
        'Limit intake to <400mg/day to avoid cardiovascular stress',
        'Avoid late in the day to prevent insomnia',
        'Stay hydrated (mild diuretic)',
        'Powdered caffeine is dangerous due to difficulty dosing (1 tsp can be lethal)'
      ],
      legality: 'Legal worldwide. Unregulated in most foods/beverages.',
      chemistry: {
        formula: 'C8H10N4O2',
        molecularWeight: '194.19 g/mol',
        class: 'Methylxanthine'
      },
      history: 'Consumed for thousands of years. Tea used in China since ~2700 BCE; Coffee in Ethiopia since ~9th century.',
      routes: ['Oral', 'Sublingual', 'Rectal'],
      afterEffects: 'Headache, lethargy, irritability (caffeine withdrawal).',
      riskLevel: 'low',
      aliases: ['1,3,7-trimethylxanthine']
    },
  {
      id: 'nicotine',
      name: 'Nicotine',
      commonNames: ['Tobacco', 'Cigs', 'Vape', 'Juul', 'Snus', 'Dip'],
      category: 'stimulants',
      class: 'Alkaloid',
      description: 'Nicotine is a potent parasympathomimetic alkaloid found in the nightshade family. It acts as an agonist at nicotinic acetylcholine receptors. At low doses, it is stimulating; at high doses, it can be sedating or calming. It is highly addictive, hijacking the brain\'s reward system comparable to hard drugs.',
      effects: {
        positive: ['Focus enhancement', 'Stress reduction (for addicts)', 'Mild euphoria (head rush)', 'Appetite suppression'],
        neutral: ['Vasoconstriction', 'Increased heart rate', 'Increased bowel activity'],
        negative: ['High addiction potential', 'Nausea/Dizziness ("Nic sick")', 'Increased blood pressure', 'Carcinogenic (when smoked/chewed)', 'Withdrawal irritability']
      },
      dosage: {
        threshold: '0.2-0.5mg (absorbed)',
        light: '0.5-1.0mg',
        common: '1-2mg',
        strong: '2-4mg',
        heavy: '4mg+'
      },
      routeData: {
        Smoking: {
            dosage: {
                threshold: '0.2mg',
                light: '0.5-1mg',
                common: '1-2mg',
                strong: '2-3mg',
                heavy: '3mg+'
            },
            duration: {
                onset: '5-15 seconds',
                comeup: '30-60 seconds',
                peak: '5-10 minutes',
                offset: '30-60 minutes',
                total: '1-2 hours'
            },
            notes: 'A typical cigarette contains 10-14mg nicotine, but only 1-2mg is absorbed.'
        },
        Oral: {
             dosage: {
                threshold: '1mg',
                light: '2-4mg',
                common: '4-8mg',
                strong: '8-15mg',
                heavy: '15mg+'
            },
            duration: {
                onset: '5-15 minutes',
                comeup: '15-30 minutes',
                peak: '30-60 minutes',
                offset: '1-2 hours',
                total: '2-3 hours'
            },
            notes: 'Gum, Lozenges, or Pouches (Zyn/Snus). Absorbed buccally (cheek), not swallowed.'
        },
        Transdermal: {
            dosage: {
                threshold: '7mg/24hr',
                light: '7-14mg/24hr',
                common: '14-21mg/24hr',
                strong: '21mg+/24hr',
                heavy: 'N/A'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '1-2 hours',
                peak: 'Variable',
                offset: '2-4 hours after removal',
                total: '16-24 hours'
            },
            notes: 'Patches. Slow, steady release to prevent withdrawal.'
        }
    },
      interactions: ['Caffeine (nicotine increases caffeine metabolism)', 'Stimulants', 'Hormonal birth control (increased clot risk)'],
      harmReduction: [
        'Vaping/NRT is safer than combustion (smoking) but not risk-free',
        'Nicotine is toxic to children and pets (liquid nicotine is lethal)',
        'Avoid use during pregnancy',
        'High addiction liability'
      ],
      legality: 'Legal (Age restricted 18+ or 21+).',
      chemistry: {
        formula: 'C10H14N2',
        molecularWeight: '162.23 g/mol',
        class: 'Pyridine'
      },
      history: 'Indigenous American use for centuries. Introduced to Europe in 16th century.',
      routes: ['Inhalation', 'Buccal', 'Transdermal', 'Nasal'],
      afterEffects: 'Craving, irritability, anxiety (withdrawal).',
      riskLevel: 'high',
      aliases: ['3-(1-methyl-2-pyrrolidinyl)pyridine']
    },
  {
      id: 'cocaine',
      name: 'Cocaine',
      commonNames: ['Coke', 'Blow', 'Snow', 'Soft', 'Yay', 'White'],
      category: 'stimulants',
      class: 'Tropane Alkaloid',
      description: 'Cocaine is a powerful stimulant and local anesthetic derived from the Coca plant. It acts as a Triple Reuptake Inhibitor (SNDRI), blocking the reuptake of serotonin, norepinephrine, and dopamine. It is known for its intense but short-lived euphoria and ego-inflation.',
      effects: {
        positive: ['Intense euphoria', 'Ego inflation/Confidence', 'Sociability', 'Sexual arousal', 'Energy'],
        neutral: ['Pupil dilation', 'Numbing (local anesthesia)', 'Urge to defecate (baby laxative cut)'],
        negative: ['Cardiovascular stress (very high)', 'Paranoia', 'Anxiety', 'Insomnia', 'Nasal damage (deviated septum)', 'Cost/Financial drain', 'Levamisole poisoning (common cut)']
      },
      dosage: {
        threshold: '5-10mg',
        light: '10-30mg',
        common: '30-60mg',
        strong: '60-90mg',
        heavy: '90mg+'
      },
      routeData: {
        Insufflation: {
            dosage: {
                threshold: '5-10mg',
                light: '15-30mg',
                common: '30-60mg',
                strong: '60-90mg',
                heavy: '90mg+'
            },
            duration: {
                onset: '2-5 minutes',
                comeup: '5-10 minutes',
                peak: '15-30 minutes',
                offset: '45-60 minutes',
                total: '60-90 minutes'
            },
            notes: 'Snorting. Bioavailability ~60-80%. Causes vasoconstriction in nose.'
        },
        Smoking: {
             dosage: {
                threshold: '5-10mg',
                light: '10-20mg',
                common: '20-50mg',
                strong: '50-80mg',
                heavy: '80mg+'
            },
            duration: {
                onset: '5-10 seconds',
                comeup: '30-60 seconds',
                peak: '5-10 minutes',
                offset: '20-30 minutes',
                total: '30-45 minutes'
            },
            notes: 'Crack/Freebase. Extremely addictive due to rapid onset/offset ("moreish").'
        },
        Intravenous: {
             dosage: {
                threshold: '5-10mg',
                light: '10-20mg',
                common: '20-40mg',
                strong: '40-70mg',
                heavy: '70mg+'
            },
            duration: {
                onset: '10-30 seconds',
                comeup: '1-2 minutes',
                peak: '5-10 minutes',
                offset: '20-30 minutes',
                total: '45-60 minutes'
            },
            notes: 'Bell-ringer rush. Very high overdose risk.'
        }
    },
      interactions: ['Alcohol (Forms Cocaethylene - more toxic/euphoric)', 'MAOIs (Fatal)', 'Other Stimulants (Heart risk)', 'Tramadol (Seizure risk)'],
      harmReduction: [
        'Do not share straws/bills (Hepatitis C risk)',
        'Rinse nose with saline after use',
        'Avoid alcohol (Cocaethylene increases heart toxicity)',
        'Test for Fentanyl',
        'Chop powder as fine as possible to reduce nasal damage'
      ],
      legality: 'Illegal (Schedule II in US - has medical use as anesthetic).',
      chemistry: {
        formula: 'C17H21NO4',
        molecularWeight: '303.36 g/mol',
        class: 'Tropane'
      },
      history: 'Isolated in 1860. Used in Coca-Cola until 1903. Popularized in the 1970s/80s.',
      routes: ['Insufflation', 'Smoking (Freebase)', 'IV', 'Topical (Medical)', 'Oral (Gum rubbing)'],
      afterEffects: 'Depression, anxiety, craving, stuffed nose.',
      riskLevel: 'very-high',
      aliases: ['benzoylmethylecgonine']
    },
  {
      id: 'methamphetamine',
      name: 'Methamphetamine',
      commonNames: ['Meth', 'Tina', 'Ice', 'Crystal', 'Glass', 'Crank'],
      category: 'stimulants',
      class: 'Amphetamine',
      description: 'Methamphetamine is a potent CNS stimulant that releases high levels of dopamine, norepinephrine, and serotonin. It is neurotoxic at recreational doses. It has a methyl group that increases lipid solubility, allowing it to cross the blood-brain barrier faster than amphetamine. Known for extremely long duration and high addiction liability.',
      effects: {
        positive: ['Intense euphoria', 'Focus', 'Libido boost', 'Energy', 'Confidence'],
        neutral: ['Pupil dilation', 'Sweating', 'Jaw clenching'],
        negative: ['Neurotoxicity', 'Psychosis (Sleep deprivation)', 'Paranoia', 'Dental damage (Dry mouth)', 'Skin picking', 'Weight loss']
      },
      dosage: {
        threshold: '5mg',
        light: '5-15mg',
        common: '15-30mg',
        strong: '30-60mg',
        heavy: '60mg+'
      },
      routeData: {
        Smoking: {
             dosage: {
                threshold: '5-10mg',
                light: '10-20mg',
                common: '20-40mg',
                strong: '40-60mg',
                heavy: '60mg+'
            },
            duration: {
                onset: '5-10 seconds',
                comeup: '30-60 seconds',
                peak: '2-4 hours',
                offset: '4-8 hours',
                total: '12-24 hours'
            },
            notes: 'Vaporized in glass pipe. Very compulsive.'
        },
        Oral: {
             dosage: {
                threshold: '5mg',
                light: '5-15mg',
                common: '15-30mg',
                strong: '30-60mg',
                heavy: '60mg+'
            },
            duration: {
                onset: '20-45 minutes',
                comeup: '45-90 minutes',
                peak: '3-5 hours',
                offset: '6-10 hours',
                total: '12-24 hours'
            },
            notes: 'Smoothest route. Desoxyn (medical meth) is oral.'
        },
        Insufflation: {
             dosage: {
                threshold: '5-10mg',
                light: '10-20mg',
                common: '20-40mg',
                strong: '40-60mg',
                heavy: '60mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '10-20 minutes',
                peak: '2-4 hours',
                offset: '4-8 hours',
                total: '10-20 hours'
            },
            notes: 'Extreme burn ("Glass").'
        }
    },
      interactions: ['MAOIs (Fatal)', 'Other Stimulants', 'Alcohol', 'Antipsychotics'],
      harmReduction: [
        'Sleep is crucial - psychosis is largely caused by sleep deprivation',
        'Force yourself to eat and drink water',
        'Maintain oral hygiene (brush/floss) to prevent "Meth Mouth"',
        'Avoid redosing after a certain time to allow sleep'
      ],
      legality: 'Illegal (Schedule II in US - Desoxyn is prescription).',
      chemistry: {
        formula: 'C10H15N',
        molecularWeight: '149.24 g/mol',
        class: 'Phenethylamine'
      },
      history: 'Synthesized 1893. Used in WWII (Pervitin) by German troops.',
      routes: ['Smoking', 'IV', 'Oral', 'Insufflation', 'Rectal'],
      afterEffects: 'Severe depression, anhedonia, lethargy (can last days/weeks).',
      riskLevel: 'very-high',
      aliases: ['N-methylamphetamine', 'desoxyephedrine']
    },
  {
      id: 'amphetamine',
      name: 'Amphetamine',
      commonNames: ['Speed', 'Adderall', 'Paste', 'Base', 'Amph'],
      category: 'stimulants',
      class: 'Phenethylamine',
      description: 'Amphetamine is a CNS stimulant used to treat ADHD and Narcolepsy. Street amphetamine (Speed/Paste) in Europe is usually a sulfate salt and often cut. It releases dopamine and norepinephrine. It is less euphoric and shorter-lasting than methamphetamine, and less neurotoxic.',
      effects: {
        positive: ['Focus', 'Motivation', 'Energy', 'Mood lift'],
        neutral: ['Sweating', 'Dry mouth', 'Pupil dilation'],
        negative: ['Anxiety', 'Insomnia', 'Appetite suppression', 'Vasoconstriction', 'Jaw clenching']
      },
      dosage: {
        threshold: '5mg',
        light: '10-20mg',
        common: '20-40mg',
        strong: '40-70mg',
        heavy: '70mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '5-10mg',
                light: '10-25mg',
                common: '25-50mg',
                strong: '50-80mg',
                heavy: '80mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '2-4 hours',
                offset: '4-6 hours',
                total: '6-10 hours'
            },
            notes: 'Pharma dosages (Adderall) are purer than street "Paste".'
        },
        Insufflation: {
             dosage: {
                threshold: '5-10mg',
                light: '15-30mg',
                common: '30-50mg',
                strong: '50-80mg',
                heavy: '80mg+'
            },
            duration: {
                onset: '5-15 minutes',
                comeup: '15-30 minutes',
                peak: '1-2 hours',
                offset: '3-5 hours',
                total: '4-7 hours'
            },
            notes: 'Street paste must be dried before snorting.'
        }
    },
      interactions: ['MAOIs', 'Acidic foods (Vitamin C reduces absorption)', 'Alcohol', 'Caffeine'],
      harmReduction: [
        'Eat before dosing',
        'Magnesium supplements help with jaw clenching',
        'Wash acetone-based speed paste to remove impurities',
        'Stay hydrated'
      ],
      legality: 'Schedule II (US). Illegal without prescription.',
      chemistry: {
        formula: 'C9H13N',
        molecularWeight: '135.21 g/mol',
        class: 'Phenethylamine'
      },
      history: 'Synthesized 1887. Benzedrine inhalers popular in 1930s.',
      routes: ['Oral', 'Insufflation', 'IV', 'Rectal'],
      afterEffects: 'Fatigue, mood drop.',
      riskLevel: 'moderate',
      aliases: ['alpha-methylphenethylamine']
    },
  {
      id: 'lisdexamfetamine',
      name: 'Lisdexamfetamine',
      commonNames: ['Vyvanse', 'Elvanse', 'Tyvense'],
      category: 'stimulants',
      class: 'Prodrug',
      description: 'Lisdexamfetamine is a prodrug of dextroamphetamine coupled with the amino acid L-lysine. It is inactive until metabolized by red blood cells. This rate-limited hydrolysis provides a smooth, long-lasting effect (up to 14 hours) and reduces abuse potential via snorting or injection.',
      effects: {
        positive: ['Sustained focus', 'Productivity', 'Mood stabilization'],
        neutral: ['Appetite loss', 'Dry mouth'],
        negative: ['Insomnia (due to length)', 'Anxiety', 'Headache']
      },
      dosage: {
        threshold: '10-20mg',
        light: '20-30mg',
        common: '30-50mg',
        strong: '50-70mg',
        heavy: '70mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '20mg',
                light: '30mg',
                common: '40-50mg',
                strong: '60-70mg',
                heavy: '70mg+'
            },
            duration: {
                onset: '60-90 minutes',
                comeup: '1.5-2 hours',
                peak: '3-6 hours',
                offset: '4-6 hours',
                total: '10-14 hours'
            },
            notes: 'Cannot be snorted for effect. Protein causes delayed onset.'
        }
    },
      interactions: ['MAOIs', 'Urine acidifiers/alkalinizers', 'Alcohol'],
      harmReduction: [
        'Take very early in the morning to sleep at night',
        'Force yourself to eat lunch',
        'Don\'t redose'
      ],
      legality: 'Schedule II (US).',
      chemistry: {
        formula: 'C15H25N3O',
        molecularWeight: '263.38 g/mol',
        class: 'Amphetamine'
      },
      history: 'Marketed in 2007 as a less abusive alternative to Adderall.',
      routes: ['Oral'],
      afterEffects: 'Mild crash, fatigue.',
      riskLevel: 'moderate',
      aliases: ['vyvanse']
    },
  {
      id: 'methylphenidate',
      name: 'Methylphenidate',
      commonNames: ['Ritalin', 'Concerta', 'Focalin', 'Medikinet', 'Vitamin R'],
      category: 'stimulants',
      class: 'Piperidine',
      description: 'Methylphenidate is a norepinephrine-dopamine reuptake inhibitor (NDRI). It blocks the transporters rather than reversing them (like amphetamine). Subjectively, it is often described as more "robotic" or "cold" compared to amphetamine.',
      effects: {
        positive: ['Focus', 'Alertness', 'Productivity'],
        neutral: ['Higher heart rate load than amphetamine for some'],
        negative: ['Anxiety', 'Jitters', 'Crash', 'Stomach upset']
      },
      dosage: {
        threshold: '5mg',
        light: '5-10mg',
        common: '10-30mg',
        strong: '30-60mg',
        heavy: '60mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '5mg',
                light: '10-20mg',
                common: '20-40mg',
                strong: '40-60mg',
                heavy: '60mg+'
            },
            duration: {
                onset: '20-45 minutes',
                comeup: '30-45 minutes',
                peak: '1.5-2.5 hours',
                offset: '2-3 hours',
                total: '3-5 hours (IR)'
            },
            notes: 'Concerta is XR (8-12hr). Ritalin IR is short.'
        },
        Insufflation: {
             dosage: {
                threshold: '5mg',
                light: '10-15mg',
                common: '15-30mg',
                strong: '30-50mg',
                heavy: '50mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '10-20 minutes',
                peak: '45-90 minutes',
                offset: '1-2 hours',
                total: '2-4 hours'
            },
            notes: 'Lots of binders in pills - harmful to nose.'
        }
    },
      interactions: ['Alcohol (Forms Ethylphenidate - more euphoric/jittery)', 'MAOIs', 'Caffeine'],
      harmReduction: [
        'Avoid caffeine (synergistic anxiety)',
        'Do not crush Concerta (mechanized release system is hard to break and plastic shells are dangerous)',
        'Monitor heart rate'
      ],
      legality: 'Schedule II (US).',
      chemistry: {
        formula: 'C14H19NO2',
        molecularWeight: '233.31 g/mol',
        class: 'Phenethylamine homologue'
      },
      history: 'Synthesized 1944. Named after chemist\'s wife, Marguerite (Rita).',
      routes: ['Oral', 'Insufflation', 'Rectal'],
      afterEffects: 'Sudden crash ("Ritalin crash"), irritability.',
      riskLevel: 'moderate',
      aliases: ['MPH']
    },
  {
      id: '3-mmc',
      name: '3-MMC',
      commonNames: ['Metaphedrone', '3-Methylmethcathinone'],
      category: 'stimulants',
      class: 'Cathinone',
      description: '3-MMC is a structural isomer of Mephedrone (4-MMC). It appeared as a replacement after 4-MMC bans. It is stimulating and empathogenic, though generally considered less "magical" or serotonin-heavy than 4-MMC, and more stimulating/dopaminergic.',
      effects: {
        positive: ['Euphoria', 'Social enhancement', 'Music appreciation', 'Stimulation'],
        neutral: ['Pupil dilation', 'Bruxism (Jaw clenching)', 'Sweating'],
        negative: ['Craving', 'Vasoconstriction', 'Tachycardia', 'Anxiety', 'Short duration']
      },
      dosage: {
        threshold: '25-50mg',
        light: '50-100mg',
        common: '150-250mg',
        strong: '250-350mg',
        heavy: '350mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '50mg',
                light: '100-150mg',
                common: '150-250mg',
                strong: '250-350mg',
                heavy: '350mg+'
            },
            duration: {
                onset: '20-45 minutes',
                comeup: '30-45 minutes',
                peak: '1.5-2.5 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Preferred route for empathogenic effects.'
        },
        Insufflation: {
             dosage: {
                threshold: '20mg',
                light: '50-80mg',
                common: '80-120mg',
                strong: '120-160mg',
                heavy: '160mg+'
            },
            duration: {
                onset: '2-5 minutes',
                comeup: '10-15 minutes',
                peak: '40-60 minutes',
                offset: '1-2 hours',
                total: '2-3 hours'
            },
            notes: 'Painful to snort. More stimulating/coke-like, less empathogenic.'
        }
    },
      interactions: ['MAOIs', 'SSRI/SNRI (Risk of Serotonin Syndrome)', 'Tramadol'],
      harmReduction: [
        'Test your substance (often confused with 4-CMC/3-CMC which are neurotoxic)',
        'Highly compulsive redosing',
        'Use oral dosing for smoother experience',
        'Hydrate'
      ],
      legality: 'Illegal in most of EU/UK. Schedule I in some US states.',
      chemistry: {
        formula: 'C11H15NO',
        molecularWeight: '177.24 g/mol',
        class: 'Substituted Cathinone'
      },
      history: 'Surfaced ~2012 as Research Chemical.',
      routes: ['Oral', 'Insufflation', 'Rectal', 'IV'],
      afterEffects: 'Depression, fatigue, low mood for days.',
      riskLevel: 'high',
      aliases: ['3-m']
    },
  {
      id: '4-mmc',
      name: '4-MMC',
      commonNames: ['Mephedrone', 'M-Cat', 'Meow Meow', 'Drone'],
      category: 'stimulants',
      class: 'Cathinone',
      description: 'Mephedrone is a powerful entactogen-stimulant. It releases massive amounts of serotonin and dopamine. Users describe it as a mix between Cocaine and MDMA. It is infamous for its distinct "cat pee" smell and extreme compulsive redosing liability.',
      effects: {
        positive: ['Extreme euphoria', 'Empathy', 'Music enhancement', 'Stimulation'],
        neutral: ['Nystagmus (Eye wiggles)', 'Sweating (smells like chemicals)', 'Jaw clenching'],
        negative: ['Blue knees/elbows (severe vasoconstriction)', 'Paranoia', 'Heart palpitations', 'Severe cravings']
      },
      dosage: {
        threshold: '15-25mg',
        light: '50-100mg',
        common: '100-200mg',
        strong: '200-300mg',
        heavy: '300mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '25mg',
                light: '50-100mg',
                common: '150-250mg',
                strong: '250-300mg',
                heavy: '300mg+'
            },
            duration: {
                onset: '15-45 minutes',
                comeup: '30 minutes',
                peak: '1-2 hours',
                offset: '2 hours',
                total: '3-5 hours'
            },
            notes: 'Best availability. "Mephedrone breath" is common.'
        },
        Insufflation: {
             dosage: {
                threshold: '15mg',
                light: '25-75mg',
                common: '75-125mg',
                strong: '125-175mg',
                heavy: '175mg+'
            },
            duration: {
                onset: '2-5 minutes',
                comeup: '5-10 minutes',
                peak: '30-45 minutes',
                offset: '1 hour',
                total: '2 hours'
            },
            notes: 'Extremely painful. Causes significant nose damage.'
        }
    },
      interactions: ['MAOIs', 'SSRI (Serotonin Syndrome)', 'Alcohol', 'Other stimulants'],
      harmReduction: [
        'Watch for vasoconstriction (cold/blue limbs) - stop immediately if seen',
        'Don\'t buy more than you plan to use (compulsive redosing)',
        'Oral is safer and lasts longer than snorting',
        'Avoid "Pre-ban" marketing hype'
      ],
      legality: 'Illegal widely (Schedule I US, Class B UK).',
      chemistry: {
        formula: 'C11H15NO',
        molecularWeight: '177.24 g/mol',
        class: 'Substituted Cathinone'
      },
      history: 'Synthesized 1929. Rediscovered 2007. Legal High craze 2008-2010.',
      routes: ['Oral', 'Insufflation', 'Rectal', 'IV'],
      afterEffects: 'Severe "Tuesday Blues" (suicidal depression), insomnia.',
      riskLevel: 'very-high',
      aliases: ['mephedrone']
    },
  {
      id: 'modafinil',
      name: 'Modafinil',
      commonNames: ['Provigil', 'Modalert', 'Alertec'],
      category: 'stimulants',
      class: 'Eugeroic',
      description: 'Modafinil is a wakefulness-promoting agent used for narcolepsy. It increases histamine and orexin levels and acts as a weak Dopamine Reuptake Inhibitor. It provides functional wakefulness without the jittery euphoria of amphetamines.',
      effects: {
        positive: ['Wakefulness', 'Cognitive enhancement', 'Motivation'],
        neutral: ['Appetite suppression', 'Sulphur-smelling urine'],
        negative: ['Headache (common)', 'Dehydration', 'Skin rash (SJS - rare)', 'Insomnia']
      },
      dosage: {
        threshold: '50mg',
        light: '50-100mg',
        common: '100-200mg',
        strong: '200-300mg',
        heavy: '400mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '50mg',
                light: '50-100mg',
                common: '100-200mg',
                strong: '200-300mg',
                heavy: '400mg+'
            },
            duration: {
                onset: '45-90 minutes',
                comeup: '1 hour',
                peak: '2-4 hours',
                offset: '8-10 hours',
                total: '12-15 hours'
            },
            notes: 'Takes a long time to kick in. Do not redose early.'
        }
    },
      interactions: ['Birth Control (renders it ineffective)', 'Caffeine', 'Grapefruit juice'],
      harmReduction: [
        'Use backup contraception',
        'Stay extremely hydrated to prevent headaches',
        'Stop immediately if skin rash develops',
        'Take early (before 9am)'
      ],
      legality: 'Schedule IV (US). Prescription only.',
      chemistry: {
        formula: 'C15H15NO2S',
        molecularWeight: '273.35 g/mol',
        class: 'Sulfinyl'
      },
      history: 'Developed in France 1970s.',
      routes: ['Oral'],
      afterEffects: 'None usually. Mild sleep disruption.',
      riskLevel: 'low',
      aliases: ['provigil']
    },
  {
      id: 'ephedrine',
      name: 'Ephedrine',
      commonNames: ['Ephedra', 'Ma Huang', 'Bronkaid'],
      category: 'stimulants',
      class: 'Sympathomimetic Amine',
      description: 'Ephedrine acts on alpha and beta-adrenergic receptors and releases norepinephrine. It is more physical ("body load") than mental. Used for asthma and decongestion, but abused for weight loss and energy.',
      effects: {
        positive: ['Bronchodilation (easier breathing)', 'Physical energy', 'Appetite loss'],
        neutral: ['Sweating', 'Pupil dilation'],
        negative: ['High blood pressure', 'Tachycardia', 'Anxiety', 'Hand tremors']
      },
      dosage: {
        threshold: '5-10mg',
        light: '10-25mg',
        common: '25-50mg',
        strong: '50-75mg',
        heavy: '75mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '10mg',
                light: '15-25mg',
                common: '25-50mg',
                strong: '50-80mg',
                heavy: '80mg+'
            },
            duration: {
                onset: '15-30 minutes',
                comeup: '30-45 minutes',
                peak: '1-2 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'Often stacked with Caffeine/Aspirin (ECA Stack) for fat loss - risky for heart.'
        }
    },
      interactions: ['Caffeine (Synergistic toxicity)', 'MAOIs', 'Beta-blockers'],
      harmReduction: [
        'Monitor blood pressure',
        'Do not use for cardio exercise (heart strain)',
        'Avoid if prone to anxiety'
      ],
      legality: 'Regulated (List I Chemical in US due to meth production). BTC (Behind The Counter).',
      chemistry: {
        formula: 'C10H15NO',
        molecularWeight: '165.23 g/mol',
        class: 'Phenethylamine'
      },
      history: 'Used in TCM (Ma Huang) for 5000 years.',
      routes: ['Oral'],
      afterEffects: 'Jitters, crash.',
      riskLevel: 'moderate',
      aliases: ['ephedra']
    },
  {
      id: 'propylhexedrine',
      name: 'Propylhexedrine',
      commonNames: ['Benzedrex', 'Benz'],
      category: 'stimulants',
      class: 'Cycloalkylamine',
      description: 'Found in Benzedrex nasal inhalers. Structurally similar to methamphetamine but with a cyclohexane ring instead of a benzene ring. Abuse involves extracting the cotton rod inside. It produces dirty euphoria with heavy vasoconstriction and body load.',
      effects: {
        positive: ['Euphoria', 'Stimulation', 'Tingling (paresthesia)'],
        neutral: ['Sweating', 'Lavender burps'],
        negative: ['Severe vasoconstriction', 'Headache', 'Nausea', 'Heart palpitations', 'Crash']
      },
      dosage: {
        threshold: '60mg',
        light: '60-125mg',
        common: '125-250mg',
        strong: '250mg (One inhaler)',
        heavy: '250mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '60mg',
                light: '125mg',
                common: '125-250mg',
                strong: '250mg',
                heavy: '250mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60-90 minutes',
                peak: '2-4 hours',
                offset: '4-6 hours',
                total: '8-12 hours'
            },
            notes: 'Must extract cotton in acidic juice (lemon/coke). EATING THE COTTON CAUSES INTESTINAL BLOCKAGE.'
        }
    },
      interactions: ['MAOIs', 'Stimulants', 'Caffeine'],
      harmReduction: [
        'NEVER EAT THE COTTON ROD',
        'Vasodilators (Magnesium/L-Citrulline) help with body load',
        'Taste is vile (Lavender/Menthol) - creates aversion'
      ],
      legality: 'Legal OTC in US.',
      chemistry: {
        formula: 'C10H21N',
        molecularWeight: '155.28 g/mol',
        class: 'Cyclohexyl'
      },
      history: 'Replaced Amphetamine in inhalers in 1949.',
      routes: ['Oral (Extraction)'],
      afterEffects: 'Severe crash, depression, headache.',
      riskLevel: 'high',
      aliases: ['benzedrex']
    },
  {
      id: 'alpha-pvp',
      name: 'Alpha-PVP',
      commonNames: ['Flakka', 'Gravel', 'A-PVP'],
      category: 'stimulants',
      class: 'Pyrovalerone Cathinone',
      description: 'Alpha-PVP is a synthetic stimulant of the pyrovalerone class. It is an extremely potent Norepinephrine-Dopamine Reuptake Inhibitor (NDRI). It is known for "excited delirium," psychosis, paranoia, and super-human strength during overdose states. It is notoriously compulsive.',
      effects: {
        positive: ['Intense rush', 'Euphoria', 'Stimulation'],
        neutral: ['Sweating', 'Manic behavior'],
        negative: ['Psychosis', 'Paranoia', 'Delirium', 'Heart attack', 'Violent behavior']
      },
      dosage: {
        threshold: '1-2mg',
        light: '3-5mg',
        common: '5-15mg',
        strong: '15-25mg',
        heavy: '25mg+'
      },
      routeData: {
        Smoking: {
             dosage: {
                threshold: '1-2mg',
                light: '2-5mg',
                common: '5-15mg',
                strong: '15-25mg',
                heavy: '25mg+'
            },
            duration: {
                onset: 'Seconds',
                comeup: '1-2 minutes',
                peak: '15-30 minutes',
                offset: '1-2 hours',
                total: '2-4 hours'
            },
            notes: 'Vaping oil burner. Instant psychosis risk at high doses. "Fiending" is extreme.'
        },
        Insufflation: {
             dosage: {
                threshold: '1-2mg',
                light: '5-10mg',
                common: '10-20mg',
                strong: '20-30mg',
                heavy: '30mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '15-30 minutes',
                peak: '30-60 minutes',
                offset: '1-2 hours',
                total: '3-5 hours'
            },
            notes: 'Burn is significant.'
        }
    },
      interactions: ['Everything. Don\'t mix.'],
      harmReduction: [
        'Volumetric dosing is mandatory (active <5mg)',
        'Have a trip sitter',
        'Benzodiazepines are needed for landing/psychosis',
        'Avoid - very high risk profile'
      ],
      legality: 'Schedule I (US).',
      chemistry: {
        formula: 'C15H21NO',
        molecularWeight: '231.34 g/mol',
        class: 'Pyrovalerone'
      },
      history: 'Patented 1967. "Flakka" epidemic in Florida ~2014.',
      routes: ['Smoking', 'Insufflation', 'IV', 'Oral'],
      afterEffects: 'Paranoia, fear, depression.',
      riskLevel: 'very-high',
      aliases: ['flakka']
    },
  {
      id: 'pma',
      name: 'PMA',
      commonNames: ['Dr. Death', 'Pink Ecstasy', 'Chicken Yellow'],
      category: 'stimulants',
      class: 'Amphetamine',
      description: 'PMA (para-Methoxyamphetamine) is a serotonergic amphetamine often sold as fake MDMA. It is highly toxic. It has a slow onset, leading users to double-drop thinking the first pill was weak, resulting in fatal hyperthermia (overheating).',
      effects: {
        positive: ['Mild stimulation (at low doses)'],
        neutral: ['Hallucinations'],
        negative: ['HYPERTHERMIA (cooking from inside)', 'Seizures', 'Vomiting', 'Death']
      },
      dosage: {
        threshold: 'Unknown',
        light: '10-20mg',
        common: '20-50mg (DANGEROUS)',
        strong: '50mg+ (LETHAL RISK)',
        heavy: '60mg+ (Likely Fatal)'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: 'N/A',
                light: '10-20mg',
                common: '20-40mg',
                strong: '50mg+',
                heavy: 'N/A'
            },
            duration: {
                onset: '1-2 hours (Slow)',
                comeup: '2 hours',
                peak: '3-6 hours',
                offset: '2-4 hours',
                total: '6-10 hours'
            },
            notes: 'Steep dose-response curve. Difference between high and death is small.'
        }
    },
      interactions: ['MDMA', 'MAOIs', 'Caffeine', 'Alcohol'],
      harmReduction: [
        'ALWAYS TEST MDMA (Marquis reagent turns red/no reaction, not black/purple)',
        'If pills take >1 hour to kick in, DO NOT TAKE MORE',
        'Seek ice baths/medical help immediately if overheating'
      ],
      legality: 'Schedule I (US).',
      chemistry: {
        formula: 'C10H15NO',
        molecularWeight: '165.23 g/mol',
        class: 'Substituted Amphetamine'
      },
      history: 'Circulated in 1970s. Reappears periodically in fake ecstasy presses.',
      routes: ['Oral'],
      afterEffects: 'Organ damage, death.',
      riskLevel: 'very-high',
      aliases: ['4-MA']
    },
  {
      id: '4f-mph',
      name: '4F-MPH',
      commonNames: ['4-Fluoromethylphenidate'],
      category: 'stimulants',
      class: 'Piperidine',
      description: '4F-MPH is a fluorinated analogue of Methylphenidate. It is significantly more potent (3x) and longer-lasting, with higher dopamine transporter binding efficiency. It is considered a functional stimulant.',
      effects: {
        positive: ['Laser focus', 'Motivation', 'Wakefulness'],
        neutral: ['Appetite suppression', 'Cold hands'],
        negative: ['Robotic feeling', 'Anxiety', 'Insomnia', 'Compulsive redosing']
      },
      dosage: {
        threshold: '2-5mg',
        light: '5-10mg',
        common: '10-15mg',
        strong: '15-25mg',
        heavy: '25mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '2mg',
                light: '5-10mg',
                common: '10-15mg',
                strong: '20-30mg',
                heavy: '30mg+'
            },
            duration: {
                onset: '20-40 minutes',
                comeup: '45-60 minutes',
                peak: '2-4 hours',
                offset: '4-6 hours',
                total: '8-10 hours'
            },
            notes: 'Very potent. Milligram scale required.'
        },
        Insufflation: {
             dosage: {
                threshold: '1-2mg',
                light: '3-7mg',
                common: '7-12mg',
                strong: '15-20mg',
                heavy: '20mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '15-30 minutes',
                peak: '1.5-2.5 hours',
                offset: '3-5 hours',
                total: '5-8 hours'
            },
            notes: 'Potent. Easy to overdo.'
        }
    },
      interactions: ['Alcohol', 'MAOIs'],
      harmReduction: [
        'Volumetric dosing recommended',
        'Do not eyeball doses',
        'Long duration affects sleep'
      ],
      legality: 'Gray Area (Analogue Act in US). Illegal in UK.',
      chemistry: {
        formula: 'C14H18FNO2',
        molecularWeight: '251.30 g/mol',
        class: 'Phenidate'
      },
      history: 'Research chemical appearing ~2015.',
      routes: ['Oral', 'Insufflation'],
      afterEffects: 'Residual stimulation preventing sleep.',
      riskLevel: 'moderate',
      aliases: ['4-fluoromethylphenidate']
    },
  {
      id: '3-fpm',
      name: '3-FPM',
      commonNames: ['3-Fluorophenmetrazine', 'PAL-593'],
      category: 'stimulants',
      class: 'Morpholine',
      description: '3-FPM is a derivative of Phenmetrazine (Preludin). It is known for having a very "smooth" profile with minimal jitters or harsh comedown compared to amphetamines. It can be functional or recreational depending on dose.',
      effects: {
        positive: ['Clean stimulation', 'Focus', 'Mood lift', 'Aphrodisiac'],
        neutral: ['Sweating'],
        negative: ['"3-FPM Flu" (Vasculitis-like symptoms with heavy use)', 'Insomnia', 'Cravings']
      },
      dosage: {
        threshold: '5-10mg',
        light: '20-30mg',
        common: '30-60mg',
        strong: '60-100mg',
        heavy: '100mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '10mg',
                light: '25-50mg',
                common: '50-80mg',
                strong: '80-120mg',
                heavy: '120mg+'
            },
            duration: {
                onset: '20-40 minutes',
                comeup: '30-60 minutes',
                peak: '1-2 hours',
                offset: '2-4 hours',
                total: '5-8 hours'
            },
            notes: 'Functional at lower doses.'
        },
        Insufflation: {
             dosage: {
                threshold: '5mg',
                light: '15-30mg',
                common: '30-60mg',
                strong: '60-90mg',
                heavy: '90mg+'
            },
            duration: {
                onset: '5-10 minutes',
                comeup: '10-20 minutes',
                peak: '45-90 minutes',
                offset: '2-3 hours',
                total: '3-5 hours'
            },
            notes: 'Extremely painful burn.'
        }
    },
      interactions: ['MAOIs'],
      harmReduction: [
        'Watch for flu-like symptoms (autoimmune reaction reported by some users)',
        'Rotate ROA due to causticity'
      ],
      legality: 'Gray Area (US). Illegal UK/Canada.',
      chemistry: {
        formula: 'C11H14FNO',
        molecularWeight: '195.23 g/mol',
        class: 'Phenmetrazine'
      },
      history: 'Patented 2011. RC market ~2014.',
      routes: ['Oral', 'Insufflation', 'Vaping'],
      afterEffects: 'Mild lethargy.',
      riskLevel: 'moderate',
      aliases: ['3-fluorophenmetrazine']
    },
  {
      id: 'dextroamphetamine',
      name: 'Dextroamphetamine',
      commonNames: ['Dexedrine', 'Dex', 'Zenzedi'],
      category: 'stimulants',
      class: 'Phenethylamine',
      description: 'The dextrorotatory enantiomer of amphetamine. It is the dominant active ingredient in Adderall. It is responsible for the potent CNS stimulation, focus, and euphoria associated with amphetamine, with slightly fewer physical side effects (jitteriness) than levoamphetamine.',
      effects: {
        positive: ['High focus', 'Motivation', 'Euphoria', 'Confidence'],
        neutral: ['Pupil dilation', 'Dry mouth'],
        negative: ['Insomnia', 'Anxiety', 'Appetite suppression', 'Vasoconstriction']
      },
      dosage: {
        threshold: '2.5-5mg',
        light: '5-10mg',
        common: '15-30mg',
        strong: '30-50mg',
        heavy: '50mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '2.5mg',
                light: '5-10mg',
                common: '15-30mg',
                strong: '30-50mg',
                heavy: '50mg+'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '60 minutes',
                peak: '2-4 hours',
                offset: '4-6 hours',
                total: '6-10 hours'
            },
            notes: 'Cleaner headspace than racemic amphetamine (speed).'
        }
    },
      interactions: ['MAOIs (Dangerous)', 'Acidic foods (reduces effect)', 'Alcohol'],
      harmReduction: [
        'Stay hydrated',
        'Eat before dosing (suppresses appetite strongly)',
        'Monitor heart rate'
      ],
      legality: 'Schedule II (US).',
      chemistry: {
        formula: 'C9H13N',
        molecularWeight: '135.21 g/mol',
        class: 'Phenethylamine'
      },
      history: 'Marketed in 1937.',
      routes: ['Oral', 'Insufflation'],
      afterEffects: 'Crash, irritability.',
      riskLevel: 'moderate',
      aliases: ['d-amph']
    },
  {
      id: 'dexmethylphenidate',
      name: 'Dexmethylphenidate',
      commonNames: ['Focalin'],
      category: 'stimulants',
      class: 'Piperidine',
      description: 'The active d-isomer of methylphenidate (Ritalin). It is approximately 2x as potent by weight as racemic methylphenidate and is considered to have a smoother effect profile with less "body load" or jitters.',
      effects: {
        positive: ['Focus', 'Stimulation', 'Productivity'],
        neutral: ['Sweating'],
        negative: ['Anxiety', 'Crash', 'Appetite loss']
      },
      dosage: {
        threshold: '2.5mg',
        light: '5-10mg',
        common: '10-20mg',
        strong: '20-30mg',
        heavy: '30mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '2.5mg',
                light: '5mg',
                common: '10-15mg',
                strong: '20-25mg',
                heavy: '30mg+'
            },
            duration: {
                onset: '30-45 minutes',
                comeup: '45 minutes',
                peak: '1.5-2.5 hours',
                offset: '2-3 hours',
                total: '4-6 hours'
            },
            notes: 'More recreational than Ritalin via insufflation.'
        }
    },
      interactions: ['MAOIs', 'Alcohol', 'Caffeine'],
      harmReduction: [
        'Potent - use half the dose of regular Ritalin',
        'Do not snort pills with talc fillers'
      ],
      legality: 'Schedule II (US).',
      chemistry: {
        formula: 'C14H19NO2',
        molecularWeight: '233.31 g/mol',
        class: 'Piperidine'
      },
      history: 'Approved 2001.',
      routes: ['Oral', 'Insufflation'],
      afterEffects: 'Depression/Irritability on comedown.',
      riskLevel: 'moderate',
      aliases: ['focalin']
    },
  {
      id: 'armodafinil',
      name: 'Armodafinil',
      commonNames: ['Nuvigil', 'Waklert'],
      category: 'stimulants',
      class: 'Eugeroic',
      description: 'The R-enantiomer of Modafinil. It has a longer half-life and is considered "punchier" or slightly more stimulating than regular Modafinil. It is used for shift-work sleep disorder.',
      effects: {
        positive: ['Wakefulness', 'Focus', 'Cognitive enhancement'],
        neutral: ['Appetite suppression'],
        negative: ['Headache', 'Insomnia', 'Skin rash (rare)']
      },
      dosage: {
        threshold: '30mg',
        light: '50-75mg',
        common: '150mg',
        strong: '200-250mg',
        heavy: '250mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '30mg',
                light: '50mg',
                common: '150mg',
                strong: '250mg',
                heavy: '300mg+'
            },
            duration: {
                onset: '1-2 hours',
                comeup: '2 hours',
                peak: '4-6 hours',
                offset: '8-10 hours',
                total: '14-16 hours'
            },
            notes: 'Take very early. Lasts all day.'
        }
    },
      interactions: ['Birth Control', 'Caffeine'],
      harmReduction: [
        'Hydrate to prevent "Modafinil headache"',
        'Stop if rash appears'
      ],
      legality: 'Schedule IV (US).',
      chemistry: {
        formula: 'C15H15NO2S',
        molecularWeight: '273.35 g/mol',
        class: 'Sulfinyl'
      },
      history: 'Approved 2007.',
      routes: ['Oral'],
      afterEffects: 'Sleep difficulty.',
      riskLevel: 'low',
      aliases: ['nuvigil']
    },
  {
      id: 'adrafinil',
      name: 'Adrafinil',
      commonNames: ['Olmifon'],
      category: 'stimulants',
      class: 'Eugeroic',
      description: 'A prodrug to Modafinil. It is metabolized by the liver into Modafinil. Because it requires liver processing, it takes longer to kick in and can elevate liver enzymes with chronic use.',
      effects: {
        positive: ['Wakefulness', 'Focus'],
        neutral: ['Sulphur urine smell'],
        negative: ['Liver stress', 'Headache', 'Nausea']
      },
      dosage: {
        threshold: '100mg',
        light: '200-300mg',
        common: '300-600mg',
        strong: '600-900mg',
        heavy: '900mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '150mg',
                light: '300mg',
                common: '600mg',
                strong: '900mg',
                heavy: '1200mg'
            },
            duration: {
                onset: '1.5-2 hours',
                comeup: '2 hours',
                peak: '3-5 hours',
                offset: '6 hours',
                total: '12 hours'
            },
            notes: 'Less potent than Modafinil.'
        }
    },
      interactions: ['Alcohol (Liver strain)', 'Tylenol (Liver strain)'],
      harmReduction: [
        'Do not use daily (Liver enzyme buildup)',
        'Do not mix with alcohol'
      ],
      legality: 'Unscheduled (US).',
      chemistry: {
        formula: 'C15H15NO3S',
        molecularWeight: '289.35 g/mol',
        class: 'Sulfinyl'
      },
      history: 'Discovered 1974.',
      routes: ['Oral'],
      afterEffects: 'Fatigue.',
      riskLevel: 'low',
      aliases: ['olmifon']
    },
  {
      id: 'phentermine',
      name: 'Phentermine',
      commonNames: ['Adipex-P', 'Fastin'],
      category: 'stimulants',
      class: 'Substituted Amphetamine',
      description: 'A stimulant used for weight loss. It releases norepinephrine and suppresses appetite. It provides physical energy but little euphoria compared to amphetamine, making it functional but "jittery".',
      effects: {
        positive: ['Appetite suppression', 'Energy'],
        neutral: ['Sweating', 'Dry mouth'],
        negative: ['Anxiety', 'Heart palpitations', 'Insomnia', 'Chest pain']
      },
      dosage: {
        threshold: '8mg',
        light: '15mg',
        common: '30-37.5mg',
        strong: '37.5mg+',
        heavy: 'N/A'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '8mg',
                light: '15mg',
                common: '30mg',
                strong: '37.5mg',
                heavy: 'N/A'
            },
            duration: {
                onset: '30-60 minutes',
                comeup: '1 hour',
                peak: '3-5 hours',
                offset: '6 hours',
                total: '10-14 hours'
            },
            notes: 'Strictly functional/weight loss.'
        }
    },
      interactions: ['MAOIs', 'Caffeine', 'SSRI (Serotonin syndrome risk)'] ,
      harmReduction: [
        'Monitor heart rate/blood pressure',
        'Do not use long term'
      ],
      legality: 'Schedule IV (US).',
      chemistry: {
        formula: 'C10H15N',
        molecularWeight: '149.23 g/mol',
        class: 'Phenethylamine'
      },
      history: 'Approved 1959.',
      routes: ['Oral'],
      afterEffects: 'Irritability.',
      riskLevel: 'moderate',
      aliases: ['adipex']
    },
  {
      id: 'pmma',
      name: 'PMMA',
      commonNames: ['Dr. Death', 'Killer', 'Red Mitsubishi'],
      category: 'stimulants',
      class: 'Substituted Amphetamine',
      description: 'PMMA (para-Methoxy-N-methylamphetamine) is chemically related to PMA and MDMA. Like PMA, it is sold as fake Ecstasy. It inhibits MAO-A and releases serotonin. It causes fatal hyperthermia at doses slightly higher than active doses.',
      effects: {
        positive: ['Mild stimulation (weak)'],
        neutral: ['Tremors'],
        negative: ['Hyperthermia', 'Organ failure', 'Coma', 'Death', 'Panic']
      },
      dosage: {
        threshold: 'Unknown',
        light: 'N/A',
        common: 'Dangerous at any dose',
        strong: 'Lethal',
        heavy: 'Lethal'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: 'N/A',
                light: 'N/A',
                common: 'N/A',
                strong: 'N/A',
                heavy: 'N/A'
            },
            duration: {
                onset: '1-2 hours',
                comeup: 'Unknown',
                peak: 'Unknown',
                offset: 'Unknown',
                total: 'Unknown'
            },
            notes: 'If you suspect PMMA, seek medical help. Do not wait for symptoms.'
        }
    },
      interactions: ['Anything serotonergic'],
      harmReduction: [
        'DO NOT USE',
        'Test your MDMA',
        'Slow onset kills: users take more thinking it is weak MDMA'
      ],
      legality: 'Schedule I (US).',
      chemistry: {
        formula: 'C11H17NO',
        molecularWeight: '179.26 g/mol',
        class: 'Amphetamine'
      },
      history: 'Appeared as fake MDMA in 2010s.',
      routes: ['Oral'],
      afterEffects: 'Severe toxicity.',
      riskLevel: 'very-high',
      aliases: ['4-mma']
    },
  {
      id: '4f-eph',
      name: '4F-EPH',
      commonNames: ['4-Fluoroethylphenidate'],
      category: 'stimulants',
      class: 'Piperidine',
      description: 'A fluorinated analogue of Ethylphenidate. It is a research chemical stimulant. Reports describe it as functional but prone to causing significant anxiety and jitters compared to 4F-MPH.',
      effects: {
        positive: ['Stimulation', 'Wakefulness'],
        neutral: ['Sweating'],
        negative: ['Anxiety', 'Paranoia', 'Vasoconstriction', 'Heart palpitations']
      },
      dosage: {
        threshold: '5mg',
        light: '10-15mg',
        common: '15-30mg',
        strong: '30-50mg',
        heavy: '50mg+'
      },
      routeData: {
        Oral: {
             dosage: {
                threshold: '5mg',
                light: '10mg',
                common: '20mg',
                strong: '40mg',
                heavy: '50mg+'
            },
            duration: {
                onset: '20-40 minutes',
                comeup: '30 minutes',
                peak: '2-3 hours',
                offset: '2 hours',
                total: '4-7 hours'
            },
            notes: 'Functional only. Low recreational value.'
        }
    },
      interactions: ['Stimulants', 'MAOIs'],
      harmReduction: [
        'Start low - very jittery',
        'Avoid caffeine'
      ],
      legality: 'Gray Area (US).',
      chemistry: {
        formula: 'C15H20FNO2',
        molecularWeight: '265.32 g/mol',
        class: 'Phenidate'
      },
      history: 'RC market 2016.',
      routes: ['Oral', 'Insufflation'],
      afterEffects: 'Anxiety, crash.',
      riskLevel: 'moderate',
      aliases: ['4-fluoroethylphenidate']
    }
];

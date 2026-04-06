// Harm Reduction Resource Data Module
// Comprehensive harm reduction information for the Drugucopia project

import { substances, type Substance, type SubstanceCategory } from '@/lib/substances/index';

// Re-export SubstanceCategory for consumers
export type { SubstanceCategory } from '@/lib/substances/index';
import { categories } from '@/lib/categories';
export { categories };

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type GuideSeverity = 'critical' | 'important' | 'recommended';

export interface HarmReductionGuide {
  id: string;
  title: string;
  icon: string;
  severity: GuideSeverity;
  content: string;
}

export interface EmergencyResource {
  name: string;
  number: string;
  description: string;
}

export interface DangerousInteraction {
  substances: string[];
  risk: 'fatal' | 'high' | 'moderate';
  description: string;
  category: string[];
}

export interface ExternalResource {
  name: string;
  url: string;
  description: string;
}

export interface SubstanceHarmTips {
  category: string;
  substance: string;
  tips: string[];
}

export interface HighRiskSubstance {
  substance: Substance;
  riskLevel: string;
}

// ─── GENERAL HARM REDUCTION GUIDES ───────────────────────────────────────────

export const generalGuides: HarmReductionGuide[] = [
  {
    id: 'dosage-safety',
    title: 'Dosage Safety',
    icon: 'Droplets',
    severity: 'critical',
    content: `In the context of recreational substance use, correct dosing is vitally important.

Choosing an inappropriately high dose of a substance is obviously problematic due to the risk of dangerous side effects. However, starting with too low of a dose can make the user feel uncomfortable and frustrated, which may lead to careless re-dosing and increase the risk of a cumulative overdose.

A helpful saying in the field: "you can always take more but you can never take less"!

**Choosing a dose:**

When choosing a dose, the user should avoid doses which they are uncomfortable or unfamiliar with. An inexperienced user should always start in the lower end of the dose range, with the goal of working their way up in small increments until they are familiar with the behavior of the substance.

Doses should always be adjusted upward with slight increases (e.g. 1/4 to 1/2 of the previous dose). Large, erratic increases (e.g. 2x or 3x the previous dose) should be strictly avoided. It is important to note that many substances do not have linear dose-response curves, meaning that doubling the dose amount will cause a greater than double increase (and rapidly result in overwhelming, unpleasant, and potentially dangerous experiences). Following this rule will significantly minimize the risk of a negative experience.

It is vital to remember that everybody reacts differently to every substance depending on factors such as their own personal tolerance, body weight, metabolism, and personal sensitivity. Another factor to consider is substance purity which is likely to differ between different vendors and batches of product.

**Allergy Testing:**

Some individuals, especially those with health issues, can exhibit adverse responses to substances in the form of allergic reactions, uncomfortable physical or cognitive effects, or hyper-sensitivity. This risk can be mitigated by performing an "allergy test", which is simply dosing a minuscule amount of the substance (e.g. 1/10 to 1/4 of a regular dose) and waiting several hours to verify that one does not exhibit an unusual or idiosyncratic response.

**Eyeballing:**

**Do not eyeball.** Eyeballing is a highly inaccurate and unreliable method of measuring substances which involves looking at a substance and making a rough guess of the amount. Since there is not much difference between 10 milligrams and 30 milligrams visually, it can easily result in taking too much of a substance, which can have fatal consequences.

There are numerous forms of eyeballing methods including using micro scoops and the graph paper method, both of which result in inaccurate dosing.

Users should not trust a vendor's word that their product weighs a certain amount as it is not unheard of for vendors to accidentally or intentionally give out the wrong amount of a product, resulting in overdoses for some users.

It is especially dangerous to eyeball substances that have extremely low doses (under 10 mg).

**Milligram Scales:**

When buying or using chemicals in powdered form, it is strongly recommended to invest in a reliable and accurate digital milligram scale to ensure the ingestion of safe and known doses.

To achieve the most accurate measurement, the scale should only be used on a completely flat surface away from vibrations, wind, and drafts. Low batteries can also affect the scale's accuracy, so one should periodically replace them. Scales usually come with a calibration weight which can be used to detect accuracy decreases.

There is a large variety of different scales available online through various sites. To choose a quality scale, users should read the reviews before buying and come to their own personal decision. Users should ideally choose a scale that has a 0.001 gram (1 milligram) readability. When using a scale that has 0.005 gram readability (5 milligrams), the weight will be off by 5 milligrams in either direction, meaning that if one measures 20 milligrams of a substance, the results will be between 15 - 25 mg.

**Milligram scales under $1000 cannot accurately weigh out doses below at least 50 milligrams and are highly inaccurate under 10 - 15 milligrams. For potent substances, the volumetric liquid dosing technique is advised.**

Most milligram scales are more accurate in higher ranges (5 - 15 grams) than the lower ranges. Therefore, it is better to weigh chemicals while the included calibration weight is on the scale.

**Volumetric Liquid Dosing:**

Volumetric liquid dosing is the process of dissolving a compound in a liquid to make it easier to measure.

For harm reduction purposes, it is essential to prepare certain compounds which are too potent to measure with traditional weighing scales using a liquid solution. Most standard milligram scales cannot accurately weigh out doses below 10 - 15 mg. This technique makes it possible to use a cheap $30 scale and still measure accurately to only a few milligrams.`
  },
  {
    id: 'set-and-setting',
    title: 'Set & Setting',
    icon: 'Trees',
    severity: 'critical',
    content: `**Set:**

The user's set or state of mind in plays a major role in determining the outcome of a trip. Hallucinogens amplify one's current state of mind, mood and outlook: a positive mindset will likely become more positive and a negative one will become even more negative. As a result, hallucinogens should generally be avoided during acutely stressful or negative periods of life. Users should be fully aware of the ways in which hallucinogens, particularly psychedelics, are able to force one to face their internal problems that they may not be psychologically prepared to handle at that time.

Those with preexisting mental conditions (especially individuals with psychotic illnesses like schizophrenia) should avoid hallucinogens due to the way they can strongly amplify one's underlying mental and emotional state as well as promote delusions and hallucinations. Those who wish to take hallucinogens with such conditions should seek the advice of a qualified medical practitioner.

A common piece of advice while tripping is to "let go" and allow the effects of the substance to take charge. One should take the metaphorical passenger seat and forgo trying to control or suppress any part of the experience. It is extremely important that the user simply relaxes and take things as they come, as any resistance will only serve to amplify what is trying to be avoided.

Additionally, the user must understand that the experience of tripping is often ungraspable, meaning that one should accept being unable to understand or express the full scope of what is happening during the experience. The user should embrace the fact that their thought processes, although potentially more lucid in some ways, will be unavoidably impaired along with fine motor control, conversational skills, and situational awareness. The user should be sure to frequently remind themselves that these effects are normal and, most importantly, temporary. 


**Setting:**

 Choosing a suitable place to experience the effects of a hallucinogen is extremely important and plays a major role in determining the outcome of the experience. The ideal place for an inexperienced user is a familiar, safe, indoor environment over which they have full control and is devoid of factors that can negatively influence one's mental state. In order to prepare a proper setting for hallucinogens, it is advised to take the following steps:

    **Ensure that one is completely free of responsibilities for the duration of the experience,** and ideally the day after. This is because even the simplest of tasks can become incredibly difficult and potentially stressful to perform while under the influence of hallucinogens. The user should be prepared to fully relax and not perform chores or everyday routines. This includes driving and operating heavy machinery.

    **Avoid people who are not directly participating in the experience.** This includes relatives who may be sleeping in the same house and friends that are anything but extremely trustworthy, understanding, and informed about the effects of hallucinogens. The mere vicinity of unaware people can prompt anxiety and paranoia as well as prevent full immersion in the experience.

    **Avoid unfamiliar, loud, cluttered, and/or public environments.** The user should select an environment over which they have a considerable degree of control. This can be as simple as having the ability to adjust the air conditioning settings or freely enter and exit a restroom. One should be able to sit, lie down, and walk around as they please for the full duration of the experience. The chosen setting should ideally be equipped with privacy, relaxing music, comfortable seating, and readily available food and water. Examples of such settings include a safe, comfortable room at home or a friend's house.

    **Avoid sources of anything that can generate "bad vibes."** The user should not expose themselves to unpleasant or disturbing stimuli such as scary films or dark music. If bad vibes are encompassing the experience, they can be escaped by quickly changing the immediate environment the user is in. For example, if one is sitting down with the lights off, stand up and turn the lights on, change the music, or move to a different room in the house.

    Once the user has become intimately familiar with their substance of choice, it is up to them as an individual whether they would be comfortable tripping in a less controlled environment such as out in nature, social gatherings, parties, raves, etc. However, it should be noted that tripping in these settings entails considerably more physical and legal risk.

 `,
  },
  {
    id: 'drug-testing',
    title: 'Drug Testing & Reagent Kits',
    icon: 'TestTubes',
    severity: 'critical',
    content: `**Reagent Testing:**

When purchasing substances online or in-person, the user should always seek precise knowledge of which chemical they are in possession of because it may very well differ from what it was advertised or sold as. If this is the case, it could potentially result in a negative experience, serious injury, or death. Investing in reagent test kits (e.g. Marquis, Mecke, Mandelin, or Ehrlich) will provide the ability to test chemicals at home without needing to submit them to a laboratory.

Reagent results can also be compared with data found online to verify chemical content. Test kitting has become particularly important since Chinese chemical manufacturers became involved in the research chemical scene, sometimes selling impure and/or mislabeled products. `
  },
  {
    id: 'interactions',
    title: 'Dangerous Drug Interactions',
    icon: 'AlertOctagon',
    severity: 'critical',
    content: `Although many substances are reasonably safe by themselves, there are many combinations which can be extremely dangerous or even fatal. This should always be considered when combining multiple psychoactive substances and adequate independent research must be performed in order to determine the safety of the combination if one wishes to avoid injury, hospitalization, or death.

Many prescription medications interact negatively with commonly used recreational substances. The most common cause of substance-related deaths is the combination of depressants (such as opiates, benzodiazepines, or alcohol) with other depressants.`,
  },
  {
    id: 'safer-routes',
    title: 'Routes of Administration Safety',
    icon: 'Syringe',
    severity: 'important',
    content: `**Routes of Administration (RoAs):**

- **Oral cavity:** Avoiding sublingual, buccal, and sublabial (under the lip) for substances that are bioavailable in the stomach is a good way to avoid mimics. For example, 25I-NBOMe breaks down in the stomach, but 25I-NBOMe has been sold as LSD, which has been attributed to several deaths and may commonly be mistaken for LSD by sellers and users.

- **Respiratory tract (inhalation, vaporizing, smoking):** It is harder to administer substances through the respiratory tract because the exhaled air often has significant amounts of residues due to improper technique. Improved bioavailability can be achieved with 1) holding the breath for as long as possible, usually a minute 2) If one notice exhaled mist (vaporizing) or smoke, then the desired dose can be divided into smaller doses which are repeated.

- **Injection:** Injection is the most dangerous route of administration and is highly advised against due to the elevated risk of overdose, addiction, and other health complications. Sharing injection materials can be fatal due to blood transmitted diseases and infections. If one is determined to inject, refer to the safer injection guide for information on reducing some of the risks associated with injection drug use.

- **Insufflation ("snorting"):** Frequently insufflating substances can damage one's mucous membranes. Sharing snorting equipment (straws, banknotes, bullets, etc) has been linked to the transmission of hepatitis C according to a study and researches warns that other blood-borne diseases can be transmitted as well.`,
  },
  {
    id: 'hydration-nutrition',
    title: 'Hydration & Nutrition',
    icon: 'GlassWater',
    severity: 'important',
    content: `Proper hydration and nutrition before, during, and after substance use are often overlooked but critically important harm reduction practices. Many psychoactive substances affect your body's ability to regulate fluid balance, appetite, and temperature, making proactive self-care essential.

**Staying Hydrated.** Dehydration is a risk with many substances, particularly stimulants (MDMA, amphetamines, cocaine) which increase body temperature, heart rate, and sweating. However, overhydration is equally dangerous — drinking excessive amounts of plain water can lead to hyponatremia (dangerously low sodium levels), which can cause brain swelling, seizures, and death. This is what killed Leah Betts, the famous UK case from 1995 — not MDMA toxicity itself.

The safest approach: drink water regularly but moderately — approximately 250–500ml (8–16 oz) per hour. Use isotonic sports drinks or water with electrolyte tablets to maintain sodium balance. Sip rather than gulp. Eat salty snacks if available. Pay attention to your body: dark yellow urine is a sign of dehydration; very clear urine with frequent urination may indicate overhydration.

**Eating Before Use.** Having food in your stomach before consuming oral substances serves multiple purposes. It slows absorption (reducing the intensity of the peak), provides sustained energy, and reduces nausea and stomach upset. A light, nutritious meal 1–2 hours before substance use is ideal. Avoid very heavy, greasy, or spicy meals which can cause discomfort. For substances with significant body load (like 2C compounds or NBOMes), having a full stomach can significantly improve comfort.

**During the Experience.** Many substances suppress appetite. For longer experiences (psychedelics, empathogens), having easily digestible snacks available — fruit, crackers, smoothies — can maintain blood sugar and energy levels. Fresh fruit like grapes, berries, or melon is especially good because it provides water, sugar, and electrolytes. Avoid heavy meals during the experience, as they may cause nausea. For MDMA specifically, vitamin C-rich fruits like oranges can help replenish antioxidants depleted during the experience.

**Aftercare and Recovery.** Post-experience nutrition is crucial for recovery. Eat a balanced meal with protein and complex carbohydrates after the effects have worn off. Replenish electrolytes. For stimulant and empathogen use, the "Tuesday blues" or "Suicide Tuesday" phenomenon is partly related to serotonin depletion and partly to physical exhaustion and nutrient depletion. Foods rich in tryptophan (turkey, bananas, oats, nuts), magnesium (dark leafy greens, chocolate, nuts), and omega-3 fatty acids (fish, flaxseed) can support recovery.

**Avoid Alcohol for Hydration.** Alcohol is a diuretic — it causes your body to lose more water than it takes in. Using alcohol to "stay hydrated" or alongside dehydrating substances is counterproductive and dangerous. This is especially true when dancing at events where both alcohol and MDMA or other stimulants may be circulating.`,
  },
  {
    id: 'overdose-response',
    title: 'Overdose & Emergency Response',
    icon: 'Phone',
    severity: 'critical',
    content: `Knowing how to recognize and respond to an overdose is one of the most important harm reduction skills you can possess. In an overdose situation, seconds matter, and your actions can mean the difference between life and death. The most important principle: **never hesitate to call emergency services.** Many jurisdictions have "Good Samaritan" laws that protect people who call for help during an overdose from prosecution for drug possession.

**Recognizing Opioid Overdose.** Signs of opioid overdose include: pin-point pupils, loss of consciousness or unresponsiveness, slow or absent breathing (fewer than 12 breaths per minute, or breathing that has stopped entirely), gurgling or "death rattle" sounds, blue or purple lips and fingernails (cyanosis), and cold/clammy skin. If someone is unconscious and not breathing normally, treat it as an overdose.

**Naloxone (Narcan).** Naloxone is an opioid antagonist that rapidly reverses opioid overdose by blocking opioid receptors in the brain. It is available as a nasal spray (Narcan) or injectable. If you suspect an opioid overdose, administer naloxone immediately. Lay the person on their back, tilt their head back slightly, and spray one dose into one nostril. Wait 2–3 minutes. If there is no improvement, administer a second dose. Naloxone is not addictive, cannot be used to get high, and has no dangerous side effects — when in doubt, use it. Note that naloxone only reverses opioid overdoses — it will not help with stimulant, depressant, or psychedelic overdoses, and its effects may wear off before the opioid does, so continued monitoring is essential.

**Responding to Stimulant Overdose (including MDMA).** Signs include: chest pain, extremely high heart rate (>150 bpm), seizures, hyperthermia (body temperature above 40°C/104°F), extreme agitation or confusion, loss of consciousness. Cool the person down — remove excess clothing, apply cool wet cloths to the neck, armpits, and groin, fan them. Move them to a cool environment. If they are conscious, give them small sips of water. Do NOT give them more stimulants. If they are having a seizure, clear the area of dangerous objects, cushion their head, and do NOT put anything in their mouth. Call emergency services immediately.

**Recovery Position.** If someone is unconscious but breathing, place them in the recovery position: lay them on their side with their top leg bent forward for stability, their top arm under their head for support, and their head tilted back slightly to keep the airway open. Stay with them and monitor their breathing until emergency services arrive.

**General Principles.** (1) Stay calm — panic helps no one. (2) Call emergency services immediately — do not wait to "see if they get better." (3) Stay with the person — never leave an unconscious person alone. (4) Provide accurate information to paramedics — tell them what substances were taken, when, and how much. (5) Do NOT induce vomiting. (6) Do NOT give the person anything to eat or drink if they are unconscious. (7) Do NOT put the person in a cold bath — this can cause shock or drowning. (8) If the person stops breathing, begin CPR if you are trained. Every second counts.`,
  },
  {
    id: 'harm-reduction-philosophy',
    title: 'The Harm Reduction Philosophy',
    icon: 'Heart',
    severity: 'recommended',
    content: `Harm Reduction seeks to minimize the risks and hazards of psychoactive substances while maximizing their benefits via education and training.

According to the harm reduction approach, recreational substance use is first-and-foremost to be understood as a high-risk activity that inherently involves the risk of addiction, serious bodily injury, and death. Therefore, the most pragmatic strategy an individual can adopt — other than complete abstinence, which may not always be realistic or desirable — is to carefully research each substance and take practical steps to reduce the risks and harms associated with using it, until the benefits outweigh the cost.

Recreational drug use may be viewed in a similar light as other risky-but-enriching activities, particularly extreme sports such as sailing, skiing, skydiving, surfing, and mountain climbing. More mundanely, it may also be compared to driving a car, riding a motorcycle, or flying in an airplane.

While these activities carry substantial risks (including death), it is nevertheless widely understood that these risks can be minimized to an acceptable level with proper education and training. Depending on the cultural context, the ability to participate in these activities may be viewed as an inalienable expression of one's freedom, self-determination, and dignity.

The philosophy underlying responsible drug use can be described as relatively radical in that it places absolute responsibility on the individual to conduct proper research and take the necessary safety precautions. This is accompanied by the understanding that there is no such thing as truly "safe" use, only safe(r) use, and that individuals are ultimately responsible for the outcomes of their choices, whether it is health-related, financial, or otherwise.

Advocates of responsible drug use point to the many well-known artists and intellectuals who have used drugs, experimentally or otherwise, with few detrimental effects on their lives. Critics argue that drugs are escapist, dangerous, unpredictable, and often addictive; therefore, responsible drug use is an illusion.

**Examples of general harm reduction advice include:**

    **Educating oneself on the effects and legality of the substance being consumed**
    
    **Measuring accurate dosages and taking other precautions to reduce the risk of overdose**
    
    **Taking the time to chemically test all substances being consumed to determine purity and strength**
    
    **Do not swim.**
    
    **Not driving, operating heavy machinery, or otherwise being directly or indirectly responsible for the safety or care of another person while intoxicated**
    
    **Avoid recreational drunk dialing, emailing, etc, that may lead to socially negative consequences.**
    
    **Having a trip sitter when taking a substance with which one is not familiar**
    
    **Not attempting to trick or persuade anyone to use a substance they are not willing to use**
    
    **Not allowing substance use to overshadow other aspects of one's life or responsibilities**
    
    **Being morally conscious of the source of one's substances**
    
    **Avoid certain psychoactive substances**`,
  },
  {
    id: 'addiction',
    title: 'Addiction',
    icon: 'Bell',
    severity: 'important',
    content: `As addiction is a serious and well-known risk of using substances, the user should carefully monitor the frequency and intensity of any substance use to ensure it is not sliding into abuse and addiction. In particular, many stimulants, opioids, and depressants are known to be highly addictive. Careful consideration and research should be put into the regular use of any of these substances (and any substance in general).

Although the classical psychedelics are considered physically non-toxic and non-addictive, this is not the case with all hallucinogens. Dissociatives, deliriants, entactogens, and certain psychedelics (e.g. DOx, 25x-NBOMe, 2C-T-x) may come with potential adverse health effects that need to be individually researched before use.

Any hallucinogen can cause problems with a person's psychological health if overused. Keep in mind that substance use becomes an addiction once the negative consequences start to outweigh the positive aspects and interferes with the user's work and relationships, but they continues to use regardless.`,
  },
  {
    id: 'tolerance',
    title: 'Tolerance',
    icon: 'Timer',
    severity: 'important',
    content: `Understanding how tolerance and dependence develop is essential for anyone who uses psychoactive substances, even occasionally. These processes are biological realities that affect the brain and body, and ignoring them is one of the fastest paths to escalating use, diminishing returns, and potential health consequences.

**How Tolerance Develops:**

Tolerance occurs when your brain adapts to the presence of a substance by adjusting its receptor density, neurotransmitter production, or enzyme activity. This means you need progressively larger doses to achieve the same effect. The speed of tolerance development varies dramatically by substance class: psychedelics and empathogens like LSD, psilocybin, and MDMA develop tolerance very rapidly (often within a single use session, and lasting 5–14 days). Opioids and benzodiazepines develop tolerance more gradually over weeks of regular use. Stimulants like amphetamines develop tolerance within days to weeks. Cannabis tolerance develops over days of regular use.

**Tolerance Breaks:**

A tolerance break (sometimes called a "T-break") is a period of abstinence from a substance to allow the brain's receptors and neurochemistry to reset. The length of break needed depends on the substance: for psychedelics, 1–2 weeks is typically sufficient; for stimulants, 2–4 weeks; for GABAergic drugs like benzodiazepines, weeks to months; for opioids, the timeline can be similar. It's important to note that stopping certain substances abruptly (especially benzodiazepines and opioids after regular use) can cause dangerous or even life-threatening withdrawal symptoms. Always taper these medications under medical supervision rather than stopping suddenly.

**Cross-Tolerance:**

Substances within the same pharmacological class often share cross-tolerance, meaning tolerance to one substance confers tolerance to related compounds. For example, tolerance to LSD extends to psilocybin, DMT, mescaline, and other serotonergic psychedelics. Tolerance to amphetamine extends to methamphetamine and other dopamine-releasing agents. This is why "drug roulette" — switching between similar substances to bypass tolerance — doesn't actually work.
`
  },
  {
    id: 'mental-health',
    title: 'Mental Health Considerations',
    icon: 'Brain',
    severity: 'important',
    content: `The relationship between psychoactive substance use and mental health is complex, bidirectional, and profoundly important. Substances can both help alleviate certain mental health conditions (when used therapeutically under professional guidance) and trigger or worsen others. Understanding these dynamics is essential for anyone considering substance use, particularly with psychedelics and dissociatives.

**When to Avoid Substances Entirely:**

There are certain mental health conditions and situations where psychoactive substance use — especially psychedelics, dissociatives, and high-dose stimulants — should be approached with extreme caution or avoided entirely. These include: a personal or family history of schizophrenia, schizoaffective disorder, or other psychotic disorders; bipolar disorder (especially manic episodes); severe depression with suicidal ideation; active psychosis; a history of manic episodes triggered by substances; and borderline personality disorder (for which dissociatives carry particular risks). If you are unsure about your mental health history, consult a professional before using any psychoactive substance.

**HPPD (Hallucinogen Persisting Perception Disorder):**

HPPD is a condition where visual disturbances — such as trailing objects, geometric patterns, halos around objects, flashes of color, or enhanced motion perception — persist long after the effects of a psychedelic have worn off, sometimes permanently. It is relatively rare but can be extremely distressing and is most commonly associated with frequent or heavy use of psychedelics, particularly LSD. There is no universally effective treatment for HPPD, though some people find relief with certain medications (like clonazepam or lamotrigine). The best prevention is to use psychedelics infrequently (at least several weeks between experiences), at reasonable doses, and with proper set and setting.

**Triggering Latent Conditions:**

Psychoactive substances, particularly psychedelics and high-potency stimulants, can trigger the onset of latent psychiatric conditions in people with a genetic predisposition. This is most commonly discussed in relation to schizophrenia — someone who carries genetic risk factors for schizophrenia may experience their first psychotic episode during or after a psychedelic experience. This does not mean psychedelics "cause" schizophrenia; rather, they can accelerate the onset of a condition that was already developing. This risk is higher for those with a family history of psychotic disorders.

**The Integration Process:**

After a particularly intense or meaningful psychedelic experience, many people benefit from "integration" — the process of making sense of and incorporating insights from the experience into daily life. Integration can include: journaling about the experience; talking with a trusted friend, therapist, or integration specialist; meditation and mindfulness practices; making positive lifestyle changes suggested by the experience; creating art, music, or writing inspired by the experience; and simply giving yourself time and space to process. Organizations like the Integration Maps project and various psychedelic integration therapists can provide support.

**Substance-Induced Anxiety and Depression:**

Heavy or frequent use of many substances — particularly stimulants, empathogens, and dissociatives — can trigger or worsen anxiety and depression. The "comedown" or "crash" after stimulant use involves a depletion of dopamine and serotonin, leading to temporary but often severe depressive symptoms and anxiety. Frequent MDMA use is associated with long-term serotonin depletion and increased rates of depression and anxiety. If you find yourself feeling persistently anxious, depressed, or emotionally flat, taking an extended break from substance use is strongly recommended. If these feelings persist, please seek professional help.`,
  },
];

// ─── EMERGENCY RESOURCES ─────────────────────────────────────────────────────

export const emergencyResources: EmergencyResource[] = [
  {
    name: 'Poison Control (US)',
    number: '1-800-222-1222',
    description: 'Free, confidential, 24/7 expert advice on poisonings and overdose. Available in all 50 US states.',
  },
  {
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Free referral and information service for individuals and families facing mental health and/or substance use disorders. 24/7, 365 days a year.',
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    description: 'Free, confidential support for anyone in suicidal crisis or emotional distress. Call or text 988, available 24/7 across the United States.',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free crisis support via text message. Text HOME to 741741 to connect with a trained crisis counselor, available 24/7.',
  },
  {
    name: 'NIDA Helpline',
    number: '1-800-662-4357',
    description: 'National Institute on Drug Abuse resource for drug information, treatment referrals, and support.',
  },
  {
    name: 'Naloxone Hotline (NEXT Distro)',
    number: '833-210-3979',
    description: 'Help obtaining naloxone (Narcan) by mail for those who may not have access through local programs.',
  },
];

// ─── DANGEROUS INTERACTION PAIRS ─────────────────────────────────────────────

export const dangerousInteractions: DangerousInteraction[] = [
  {
    substances: ['MAOIs', 'MDMA', 'other serotonergics'],
    risk: 'fatal',
    description: 'Risk of serotonin syndrome — potentially fatal. MAOIs (including ayahuasca, Syrian rue, and harmala alkaloids) combined with MDMA or any serotonergic drug can cause a life-threatening accumulation of serotonin, leading to hyperthermia, seizures, coma, and death. Wait at least 2 weeks after taking MAOIs before using any serotonergic substance.',
    category: ['empathogens', 'hallucinogens'],
  },
  {
    substances: ['Alcohol', 'Benzodiazepines', 'other CNS depressants'],
    risk: 'fatal',
    description: 'Risk of respiratory depression — potentially fatal. Both alcohol and benzodiazepines enhance GABA activity in the brain, suppressing breathing. When combined, their effects multiply synergistically. This is one of the most common causes of fatal overdose worldwide. The combination is especially dangerous because alcohol reduces inhibitions, leading users to take more benzodiazepines than intended.',
    category: ['depressants'],
  },
  {
    substances: ['Alcohol', 'GHB/GBL'],
    risk: 'fatal',
    description: 'Unpredictable CNS depression, risk of death. GHB and alcohol both depress the central nervous system, and their combined effect on respiration can be fatal. Additionally, both substances can cause vomiting, and unconsciousness combined with vomiting is a lethal scenario. This combination has been responsible for numerous deaths.',
    category: ['depressants'],
  },
  {
    substances: ['Stimulants', 'MAOIs'],
    risk: 'fatal',
    description: 'Hypertensive crisis risk. MAOIs inhibit the breakdown of catecholamines (dopamine, norepinephrine, epinephrine). When combined with stimulants, this can cause a dangerous spike in blood pressure that may lead to stroke, heart attack, or brain hemorrhage. Avoid all stimulants for at least 2 weeks after MAOI use.',
    category: ['stimulants', 'hallucinogens'],
  },
  {
    substances: ['Opioids', 'CNS Depressants'],
    risk: 'fatal',
    description: 'Respiratory depression, primary cause of fatal overdoses. Opioids combined with any CNS depressant (alcohol, benzodiazepines, barbiturates, GHB) create a synergistic depression of breathing. This combination is responsible for the majority of prescription opioid overdose deaths. Even therapeutic doses of both can be dangerous when combined.',
    category: ['opioids', 'depressants'],
  },
  {
    substances: ['Ketamine', 'Stimulants'],
    risk: 'high',
    description: 'Extreme cardiovascular strain. Combining ketamine with stimulants places significant stress on the heart and vascular system, potentially leading to hypertension, tachycardia, and in severe cases, heart attack or stroke. The opposing effects can also cause confusion about your actual level of intoxication.',
    category: ['dissociatives', 'stimulants'],
  },
  {
    substances: ['Cocaine', 'Alcohol'],
    risk: 'high',
    description: 'Formation of cocaethylene, a cardiotoxic compound. When cocaine and alcohol are consumed together, the liver produces cocaethylene, which is more toxic to the heart than cocaine alone, has a longer half-life, and increases the risk of sudden cardiac death by up to 18–25 times compared to cocaine use alone.',
    category: ['stimulants', 'depressants'],
  },
  {
    substances: ['SSRIs', 'MDMA/Tramadol'],
    risk: 'high',
    description: 'Increased risk of serotonin syndrome. SSRIs reduce the effectiveness of MDMA (blocking the desired effects while increasing side effects) and combining them with tramadol or other serotonergic drugs can lead to serotonin syndrome. Taper SSRIs for at least 4–6 weeks before using MDMA for the best experience and lowest risk.',
    category: ['empathogens'],
  },
  {
    substances: ['Dextromethorphan (DXM)', 'MAOIs'],
    risk: 'fatal',
    description: 'Risk of serotonin syndrome and potentially fatal toxic reactions. DXM is a serotonergic NMDA antagonist, and combining it with MAOIs can cause serotonin syndrome and potentially life-threatening hyperpyrexia. This combination should be strictly avoided.',
    category: ['dissociatives', 'hallucinogens'],
  },
  {
    substances: ['PCP', 'Stimulants'],
    risk: 'high',
    description: 'Severe psychosis risk and extreme cardiovascular strain. Both PCP and stimulants can cause paranoia, aggression, and psychosis. When combined, these effects are amplified and can lead to violent behavior, self-harm, and cardiovascular emergency. The risk of lasting psychological damage is significant.',
    category: ['dissociatives', 'stimulants'],
  },
  {
    substances: ['NBOMe compounds', 'Stimulants'],
    risk: 'high',
    description: 'Severe cardiovascular toxicity. NBOMe compounds already carry significant cardiotoxic risk at therapeutic doses. Combining them with stimulants dramatically increases the risk of dangerous arrhythmias, hypertension, seizures, and death. NBOMe-related deaths have been well-documented.',
    category: ['hallucinogens', 'stimulants'],
  },
  {
    substances: ['2C-T-x compounds', 'MAOIs'],
    risk: 'fatal',
    description: 'Dangerously high blood pressure and risk of fatal overdose. The 2C-T family of compounds becomes significantly more potent and dangerous when combined with MAOIs, as MAOIs interfere with their metabolism. This combination has been associated with fatal outcomes.',
    category: ['hallucinogens'],
  },
];

// ─── EXTERNAL RESOURCES ──────────────────────────────────────────────────────

export const externalResources: ExternalResource[] = [
  {
    name: 'PsychonautWiki',
    url: 'https://psychonautwiki.org',
    description: 'Comprehensive, community-driven encyclopedia of psychoactive substances with detailed information on effects, dosages, chemistry, and harm reduction. One of the most thorough and well-sourced resources available.',
  },
  {
    name: 'Erowid',
    url: 'https://erowid.org',
    description: 'The foundational harm reduction and drug information resource, operating since 1995. Includes detailed substance profiles, thousands of experience reports, dosage information, and legal/health resources.',
  },
  {
    name: 'DanceSafe',
    url: 'https://dancesafe.org',
    description: 'Non-profit harm reduction organization providing drug checking services, reagent test kits, educational materials, and peer-based health and safety services at music events and festivals.',
  },
  {
    name: 'TripSit',
    url: 'https://tripsit.me',
    description: 'Harm reduction community providing substance information, combination charts, factsheets, and live chat support. Their drug combination checker is an essential tool for anyone considering mixing substances.',
  },
  {
    name: 'Bluelight',
    url: 'https://www.bluelight.org',
    description: 'International harm reduction community and forum providing substance information, trip reports, harm reduction guides, and peer support. One of the oldest and most comprehensive harm reduction resources on the internet.',
  },
  {
    name: 'Drugs-Forum',
    url: 'https://drugs-forum.com',
    description: 'Long-running harm reduction community forum with extensive discussions on substance effects, experiences, chemistry, and harm reduction practices. A valuable resource for real-world harm reduction knowledge.',
  },
  {
    name: 'Harm Reduction International',
    url: 'https://www.hri.global',
    description: 'Global NGO working to promote harm reduction policies, research, and interventions worldwide. Provides evidence-based advocacy and resources for harm reduction programs.',
  },
  {
    name: 'MAPS (Multidisciplinary Association for Psychedelic Studies)',
    url: 'https://maps.org',
    description: 'Non-profit research and educational organization focused on developing medical, legal, and cultural contexts for people to benefit from the careful uses of psychedelics and marijuana.',
  },
];

// ─── AGGREGATION FUNCTIONS ───────────────────────────────────────────────────

/**
 * Get harm reduction tips grouped by category
 */
export function getHarmReductionByCategory(
  category: SubstanceCategory
): { substance: string; tips: string[] }[] {
  return substances
    .filter((s) => s.categories.includes(category))
    .filter((s) => s.harmReduction && s.harmReduction.length > 0)
    .map((s) => ({
      substance: s.name,
      tips: s.harmReduction,
    }));
}

/**
 * Get all harm reduction tips organized by category
 */
export function getAllHarmReductionTips(): SubstanceHarmTips[] {
  const results: SubstanceHarmTips[] = [];

  for (const substance of substances) {
    if (substance.harmReduction && substance.harmReduction.length > 0) {
      for (const cat of substance.categories) {
        const catInfo = categories.find((c) => c.id === cat);
        results.push({
          category: catInfo?.name ?? cat,
          substance: substance.name,
          tips: substance.harmReduction,
        });
      }
    }
  }

  // Deduplicate: a substance may appear under multiple categories
  // Keep all entries but ensure no duplicate (category, substance) pairs
  const seen = new Set<string>();
  return results.filter((item) => {
    const key = `${item.category}|${item.substance}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get substances sorted by risk level (highest risk first)
 */
export function getHighRiskSubstances(): HighRiskSubstance[] {
  const riskOrder: Record<string, number> = {
    'very-high': 0,
    'high': 1,
    'moderate': 2,
    'low': 3,
  };

  return substances
    .map((s) => ({
      substance: s,
      riskLevel: s.riskLevel,
    }))
    .sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
}

// ─── QUICK REFERENCE PRINCIPLES ──────────────────────────────────────────────

export const quickPrinciples = [
  {
    id: 'start-low',
    title: 'Start Low, Go Slow',
    icon: 'Minus',
    description: 'Begin with the lowest possible dose and wait before taking more.',
  },
  {
    id: 'test-substances',
    title: 'Test Your Substances',
    icon: 'TestTubes',
    description: 'Use reagent tests and fentanyl test strips to verify what you have.',
  },
  {
    id: 'never-use-alone',
    title: 'Never Use Alone',
    icon: 'Users',
    description: 'Have a trusted, sober person present — a trip sitter saves lives.',
  },
  {
    id: 'know-the-dose',
    title: 'Know Your Dose',
    icon: 'Scale',
    description: 'Use a milligram scale. Never eyeball doses, especially for potent compounds.',
  },
  {
    id: 'stay-hydrated',
    title: 'Stay Hydrated',
    icon: 'GlassWater',
    description: 'Drink water regularly (250–500ml/hour). Use electrolytes, avoid overhydration.',
  },
  {
    id: 'research-first',
    title: 'Research Before You Use',
    icon: 'BookOpen',
    description: 'Know the effects, duration, risks, and interactions before trying any substance.',
  },
  {
    id: 'have-naloxone',
    title: 'Carry Naloxone',
    icon: 'Syringe',
    description: 'If using opioids or if adulteration is possible, keep naloxone (Narcan) accessible.',
  },
  {
    id: 'one-substance',
    title: 'One at a Time',
    icon: 'ListOrdered',
    description: 'Mixing substances is one of the deadliest risks. Use one substance at a time.',
  },
];

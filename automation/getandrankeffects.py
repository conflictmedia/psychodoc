import mwparserfromhell
import requests
import re
import argparse

BASE = "https://psychonautwiki.org/w/api.php"

def clean_wikitext(text):
    """Thoroughly clean stripped wikitext."""
    text = re.sub(r"(?m)^:+\s*", "", text)
    text = re.sub(r":{2,}", " ", text)
    text = re.sub(r"(?m)^;+\s*", "", text)
    text = re.sub(r"(?m)^\*+\s*", "• ", text)
    text = re.sub(r"(?m)^#+\s*", "", text)
    text = re.sub(r"(?m)^-{4,}", "---", text)
    text = re.sub(r'^[\s\t\xa0]*1:[\s\t\xa0]*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^Effect ', '', text, flags=re.MULTILINE)
    text = re.sub(r'(?<=\()effect ', '', text)
    text = re.sub(r'(?<=; )effect ', '', text)
    text = re.sub(r' and effect ', ' and ', text)
    text = re.sub(r'(?<=\()effect::', '', text)
    text = re.sub(r'(?<=; )effect::', '', text)
    text = re.sub(r' and effect::', ' and ', text)

    text = re.sub(r"'{2,3}", "", text)
    text = text.replace("&nbsp;", " ")
    text = text.replace("&ndash;", "–")
    text = text.replace("&mdash;", "—")
    text = text.replace("&amp;", "&")
    text = re.sub(r"<ref[^>]*>.*?</ref>", "", text, flags=re.DOTALL)
    text = re.sub(r"<ref[^/]*/?>", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"__[A-Z]+__", "", text)
    text = re.sub(r"(?m)\s+$", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()
    return text


def get_wikitext(page_name):
    """Fetch raw wikitext for a page."""
    resp = requests.get(BASE, params={
        "action": "query",
        "titles": page_name,
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "format": "json"
    })
    pages = resp.json()["query"]["pages"]
    for page_id, page_data in pages.items():
        if page_id == "-1":
            return None
        return page_data["revisions"][0]["slots"]["main"]["*"]


# ============================================
# PUBLIC API FUNCTIONS
# ============================================

def get_positive_effects(page_name):
    """Fetch and return positive effects for a given page."""
    effects = _get_classified_effects(page_name)
    return [e['text'] for e in effects if e['sentiment'] == 'positive']


def get_negative_effects(page_name):
    """Fetch and return negative effects for a given page."""
    effects = _get_classified_effects(page_name)
    return [e['text'] for e in effects if e['sentiment'] == 'negative']


def get_neutral_effects(page_name):
    """Fetch and return neutral effects for a given page."""
    effects = _get_classified_effects(page_name)
    return [e['text'] for e in effects if e['sentiment'] == 'neutral']


def _get_classified_effects(page_name):
    """Internal function to fetch and classify all effects for a page."""
    raw = get_wikitext(page_name)
    if raw is None:
        return []
    
    wikicode = mwparserfromhell.parse(raw)
    effects = []
    
    for template in wikicode.filter_templates():
        tname = template.name.strip().lower()
        if "effects" in tname and not tname.startswith("effects/base") and not tname.startswith("preamble"):
            for param in template.params:
                raw_value = str(param.value)

                # Remove <ref>...</ref> and self-closing <ref/>
                raw_value = re.sub(r"<ref[^>]*>.*?</ref>", "", raw_value, flags=re.DOTALL)
                raw_value = re.sub(r"<ref[^/]*/?>", "", raw_value)
                # Remove {{citation needed}} and other maintenance templates
                raw_value = re.sub(r"\{\{[^}]*\}\}", "", raw_value)
                # Convert [[Effect::Name]] → Name while brackets are still there
                raw_value = re.sub(r'\[\[Effect::([^\]|]+)\]\]', r'\1', raw_value)

                # Split into lines BEFORE strip_code so we can see the * bullets
                lines = raw_value.split('\n')

                for line in lines:
                    line = line.strip()
                    if not line.startswith('*'):
                        continue
                    line = re.sub(r'^\*+\s*', '', line)

                    # NOW strip remaining wiki markup on this single line
                    line = mwparserfromhell.parse(line).strip_code().strip()
                    line = re.sub(r'[Ee]ffect::', '', line)
                    line = re.sub(r'[Ee]ffects::', '', line)
                    line = re.sub(r"'{2,3}", "", line)
                    line = line.strip()
                    if line:
                        effects.append(line)
                            
    classifier = HybridSentimentClassifier()
    classified = []
    
    for effect_text in effects:
        if ' - ' in effect_text:
            name = effect_text.split(' - ')[0].strip()
        else:
            name = effect_text
        result = classifier.classify(effect_text, name)
        classified.append({
            'name': name,
            'text': effect_text,
            'sentiment': result.label,
            'score': result.score,
            'confidence': result.confidence
        })
    
    return classified


# ============================================
# HYBRID SENTIMENT CLASSIFIER
# ============================================

from typing import Tuple, List, Dict, Optional
from dataclasses import dataclass

@dataclass
class ClassificationResult:
    label: str
    score: float
    confidence: str
    reasons: List[str]
    matched_keywords: Dict[str, List[str]]


class HybridSentimentClassifier:
    POSITIVE_KEYWORDS = {
        'enhancement', 'enhance', 'enhanced', 'improve', 'improvement',
        'boost', 'boosted', 'increase', 'increased', 'strengthen',
        'euphoria', 'euphoric', 'bliss', 'joy', 'pleasure', 'enjoyment',
        'relief', 'comfort', 'relaxation', 'calm',
        'benefit', 'beneficial', 'therapeutic', 'therapy', 'treatment',
        'healing', 'recovery', 'cure', 'remission',
        'creativity', 'insight', 'introspection', 'clarity', 'focus',
        'motivation', 'inspiration', 'wisdom', 'understanding',
        'empathy', 'affection', 'sociability', 'connection', 'unity',
        'bonding', 'love', 'intimacy',
        'spiritual', 'spirituality', 'transcendence', 'enlightenment',
        'realization', 'awakening', 'mindfulness',
        'stamina', 'energy', 'vitality', 'wakefulness', 'alertness',
        'lightness', 'weightlessness', 'control enhancement',
        'appreciation', 'meaning', 'novelty', 'immersion', 'humor',
        'laughter', 'neurogenesis', 'neuroplasticity','stimulation',
    }
    
    NEGATIVE_KEYWORDS = {
        'nausea', 'vomiting', 'headache', 'migraine', 'dizziness',
        'dehydration', 'overheating', 'sweating', 'chills',
        'blood pressure', 'heart rate', 'palpitation', 'tachycardia',
        'vasoconstriction', 'hypertension',
        'pain', 'cramp', 'tremor', 'shaking', 'twitching',
        'teeth grinding', 'bruxism', 'jaw clenching',
        'difficulty urinating', 'urinary retention',
        'anxiety', 'paranoia', 'panic', 'fear', 'dread',
        'delusion', 'delusional', 'psychosis', 'psychotic',
        'dysphoria', 'depression', 'confusion', 'disorientation',
        'memory suppression', 'memory loss', 'amnesia',
        'thought loops', 'looping', 'obsessive', 'rumination',
        'impair', 'impairment', 'dysfunction', 'deficit',
        'suppress', 'suppression', 'inhibition',
        'danger', 'dangerous', 'risk', 'harmful', 'toxic',
        'overdose', 'poisoning', 'adverse',
        'regression', 'withdrawal', 'crash', 'comedown',
        'exhaustion', 'fatigue', 'lethargy',
        'distort', 'distortion', 'hallucination', 'hallucinate',
        'unreliable', 'inconsistent', 'unpredictable',
        'abuse', 'nefarious', 'manipulation',
    }
    
    def __init__(self):
        self._analyzer = None
        self.weights = {'vader': 0.3, 'keyword': 0.5, 'heuristic': 0.2}
        self.thresholds = {'positive': 0.1, 'negative': -0.1}
    
    @property
    def analyzer(self):
        if self._analyzer is None:
            from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
            self._analyzer = SentimentIntensityAnalyzer()
        return self._analyzer
    
    def _get_vader_score(self, text: str) -> float:
        return self.analyzer.polarity_scores(text)['compound']
    
    def _get_keyword_matches(self, text: str) -> Tuple[List[str], List[str]]:
        text_lower = text.lower()
        pos_matches = [kw for kw in self.POSITIVE_KEYWORDS if kw in text_lower]
        neg_matches = [kw for kw in self.NEGATIVE_KEYWORDS if kw in text_lower]
        return pos_matches, neg_matches
    
    def _calculate_keyword_score(self, pos_matches: List[str], neg_matches: List[str]) -> float:
        if not pos_matches and not neg_matches:
            return 0.0
        pos_weight = sum(len(kw) for kw in pos_matches) / 10
        neg_weight = sum(len(kw) for kw in neg_matches) / 10
        raw_score = pos_weight - neg_weight
        max_possible = max(pos_weight, neg_weight, 1)
        return raw_score / max_possible
    
    def _apply_heuristics(self, text: str, name: str, base_score: float) -> Tuple[float, List[str]]:
        text_lower = text.lower()
        name_lower = name.lower()
        reasons = []
        score_adjustment = 0.0
        
        # Physical side effects
        side_effects = ['nausea', 'vomiting', 'dehydration', 'overheating',
                        'blood pressure', 'teeth grinding', 'vasoconstriction',
                        'difficulty urinating', 'headache', 'dizziness']
        if any(se in name_lower for se in side_effects):
            score_adjustment -= 0.4
            reasons.append("Physical side effect detected")
        
        # Therapeutic benefits
        therapy_indicators = ['therapeutic', 'therapy', 'treatment', 'outperforms',
                              'clinical', 'medical benefit', 'healing']
        if any(ind in text_lower for ind in therapy_indicators):
            score_adjustment += 0.3
            reasons.append("Therapeutic/medical benefit detected")
        
        # Enhancement effects
        if 'enhancement' in name_lower and 'suppression' not in name_lower:
            score_adjustment += 0.2
            reasons.append("Enhancement effect")
        
        # Suppression effects (context-dependent)
        if 'addiction suppression' in name_lower or 'craving suppression' in name_lower:
            score_adjustment += 0.5
            reasons.append("Beneficial suppression effect")
        elif 'memory suppression' in name_lower or 'thought suppression' in name_lower:
            score_adjustment -= 0.3
            reasons.append("Cognitive suppression effect")
        elif 'suppression' in name_lower and 'appetite' not in name_lower:
            score_adjustment -= 0.1
            reasons.append("General suppression effect")
        
        # Risk indicators
        risk_indicators = ['overdose', 'dangerous', 'risk of', 'may cause',
                           'can lead to', 'potentially harmful']
        if any(ind in text_lower for ind in risk_indicators):
            score_adjustment -= 0.2
            reasons.append("Risk indicator detected")
        
        # Perceptual effects (neutral)
        perceptual_patterns = ['distortion', 'geometry', 'pattern', 'tracers',
                               'drifting', 'shifting', 'recursion', 'magnification',
                               'frame rate', 'acuity', 'perspective', 'depth perception']
        if any(p in name_lower for p in perceptual_patterns):
            score_adjustment = -base_score
            reasons.append("Perceptual effect (inherently neutral)")
        
        return base_score + score_adjustment, reasons
    
    def classify(self, text: str, name: Optional[str] = None) -> ClassificationResult:
        if name is None:
            name = re.split(r'[-.]', text)[0].strip()
        
        vader_score = self._get_vader_score(text)
        pos_matches, neg_matches = self._get_keyword_matches(text)
        keyword_score = self._calculate_keyword_score(pos_matches, neg_matches)
        
        base_score = vader_score * self.weights['vader'] + keyword_score * self.weights['keyword']
        final_score, heuristic_reasons = self._apply_heuristics(text, name, base_score)
        
        if final_score >= self.thresholds['positive']:
            label = 'positive'
        elif final_score <= self.thresholds['negative']:
            label = 'negative'
        else:
            label = 'neutral'
        
        score_magnitude = abs(final_score)
        agreement = (vader_score > 0 and keyword_score > 0) or (vader_score < 0 and keyword_score < 0)
        
        if score_magnitude > 0.3 and agreement:
            confidence = 'high'
        elif score_magnitude > 0.15:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        reasons = []
        if pos_matches:
            reasons.append(f"Positive keywords: {', '.join(pos_matches[:3])}")
        if neg_matches:
            reasons.append(f"Negative keywords: {', '.join(neg_matches[:3])}")
        reasons.extend(heuristic_reasons)
        
        return ClassificationResult(
            label=label,
            score=round(final_score, 3),
            confidence=confidence,
            reasons=reasons,
            matched_keywords={'positive': pos_matches, 'negative': neg_matches}
        )


# ============================================
# USAGE
# ============================================

if __name__ == "__main__":

    ap = argparse.ArgumentParser("substance2parse")
    ap.add_argument("substance", help="substance to get and rank effects for")
    args = ap.parse_args()
    
    # Get effects for any substance
    positive = get_positive_effects(args.substance)
    negative = get_negative_effects(args.substance)
    neutral = get_neutral_effects(args.substance)

    print("positive: ")
    print(positive)
    print("negative: ")
    print(negative)
    print("neutral: ")
    print(neutral)
    
#     print(f"Positive: {len(positive)} effects")
#     print(f"Negative: {len(negative)} effects")
#     print(f"Neutral: {len(neutral)} effects")
    
#     print("\nSample positive:")
#     for e in positive[:3]:
#         print(f"  + {e[:80]}..." if len(e) > 80 else f"  + {e}")
    
#     print("\nSample negative:")
#     for e in negative[:3]:
#         print(f"  - {e[:80]}..." if len(e) > 80 else f"  - {e}")
    
#     print("\nSample neutral:")
#     for e in neutral[:3]:
#         print(f"  ~ {e[:80]}..." if len(e) > 80 else f"  ~ {e}")

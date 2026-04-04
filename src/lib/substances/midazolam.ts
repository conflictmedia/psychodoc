// Auto-generated from substances.txt
import type { Substance } from '../types';

// Substance Data
// Name: Midazolam
// ID: midazolam
// Categories: depressants
// Class: Benzodiazepines

export const midazolam: Substance = 
{
  "id": "midazolam",
  "name": "Midazolam",
  "commonNames": [
    "Midazolam",
    "Versed"
  ],
  "categories": [
    "depressants"
  ],
  "class": "Benzodiazepines",
  "description": "benzodiazepines\nMidazolam (trade name Versed) is a depressant substance of the benzodiazepine class. It is on the World Health Organization's List of Essential Medicines. Subjective effects include sedation, anxiety suppression, disinhibition, muscle relaxation, respiratory depression, and moderate euphoria.",
  "effects": {
    "positive": [],
    "neutral": [],
    "negative": []
  },
  "routeData": {
    "intravenous": {
      "dosage": {
        "threshold": "1mg",
        "light": "1-2mg",
        "common": "2-4mg",
        "strong": "4-5mg",
        "heavy": "5mg"
      },
      "duration": {
        "onset": "4-6 minutes",
        "comeup": "Unknown",
        "peak": "1-4 hours",
        "offset": "0.5-1.5 hours",
        "total": "2-6 hours"
      }
    },
    "oral": {
      "dosage": {
        "threshold": "1mg",
        "light": "2.5-5mg",
        "common": "5-15mg",
        "strong": "15-30mg",
        "heavy": "30mg"
      },
      "duration": {
        "onset": "30-60 minutes",
        "comeup": "30-60 minutes",
        "peak": "1-2 hours",
        "offset": "1-2 hours",
        "total": "2-4 hours"
      }
    }
  },
  "interactions": [],
  "harmReduction": [],
  "legality": "Legal status varies by jurisdiction. Check local laws.",
  "chemistry": {
    "formula": "Unknown",
    "molecularWeight": "Unknown",
    "class": "Benzodiazepines"
  },
  "history": null,
  "afterEffects": "See route data for afterglow information.",
  "riskLevel": "moderate"
};

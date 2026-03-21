---
name: "\U0001F4DD Submit Information Change"
about: Propose a change to existing substance information in the database
title: "[Info Change]: <substance_name> — <brief_description_of_change>"
labels: info_change, review_needed
assignees: ""
---

<!--
  ⚠️ AUTOMATION NOTICE ⚠️
  This template is parsed by automation. Please follow these rules:

  1. Do NOT remove or rename any ### headings
  2. Do NOT remove or modify the field labels (text before the colon)
  3. Place your values AFTER the colon on the same line
  4. For list fields, use one item per line starting with "- "
  5. For route-specific data, copy the ENTIRE route block for each route change
  6. Use "N/A" for fields/sections that are NOT being changed — do NOT leave them blank
  7. Do NOT add extra headings or restructure the template
  8. Only fill in sections you are proposing to change; mark everything else "N/A"
-->

### substance_id

<!-- The existing substance_id exactly as it appears in the database (e.g., nicotine, lsd-25, 2c-b) -->

### change_type

<!-- ONE or more of (one per line): correction | addition | removal | update -->

-

### change_summary

<!-- A single-paragraph plain-language summary of what is being changed and why. No line breaks. -->

### substance_name

<!-- Only if proposing a change to the display name. Otherwise: N/A -->

### common_names

<!-- Only if adding, removing, or correcting common names. Prefix each line with "+ " to add, "- " to remove, or "~ " to correct (old → new). Otherwise: N/A -->



### category

<!-- Only if proposing a category change. Provide the NEW value. ONE of: stimulants | depressants | psychedelics | dissociatives | empathogens | cannabinoids | opioids | nootropics | deliriants | other. Otherwise: N/A -->

### chemical_class

<!-- Only if changing. Provide the NEW value. Otherwise: N/A -->

### aliases

<!-- Only if adding, removing, or correcting aliases. Prefix: "+ " to add, "- " to remove, "~ " to correct (old → new). Otherwise: N/A -->



### description

<!-- Only if changing. Provide the FULL replacement paragraph. No line breaks. Otherwise: N/A -->

### effects_positive

<!-- Only if changing. Prefix: "+ " to add, "- " to remove, "~ " to correct (old → new). Otherwise: N/A -->



### effects_neutral

<!-- Only if changing. Prefix: "+ " to add, "- " to remove, "~ " to correct (old → new). Otherwise: N/A -->



### effects_negative

<!-- Only if changing. Prefix: "+ " to add, "- " to remove, "~ " to correct (old → new). Otherwise: N/A -->



### dosage_general_threshold

<!-- New value, or N/A -->

### dosage_general_light

<!-- New value, or N/A -->

### dosage_general_common

<!-- New value, or N/A -->

### dosage_general_strong

<!-- New value, or N/A -->

### dosage_general_heavy

<!-- New value, or N/A -->

### routes

<!-- Only if adding or removing routes from the substance. Prefix: "+ " to add, "- " to remove. Otherwise: N/A -->



<!--
  ========================
  ROUTE-SPECIFIC DATA CHANGES
  ========================
  Copy the entire block below (from "### route_change_start" to "### route_change_end")
  for EACH route being modified. Fill in route_name and ONLY the fields being changed.
  Use "N/A" for fields within the route that are NOT changing.
-->

### route_change_start

route_name:
dosage_threshold:
dosage_light:
dosage_common:
dosage_strong:
dosage_heavy:
duration_onset:
duration_comeup:
duration_peak:
duration_offset:
duration_total:
route_notes:

### route_change_end

<!-- COPY ABOVE BLOCK FOR ADDITIONAL ROUTE CHANGES -->

### interactions

<!-- Only if changing. Prefix: "+ " to add, "- " to remove, "~ " to correct (old → new). Otherwise: N/A -->



### harm_reduction

<!-- Only if changing. Prefix: "+ " to add, "- " to remove, "~ " to correct (old → new). Otherwise: N/A -->



### after_effects

<!-- Only if changing. Provide the FULL replacement text. Otherwise: N/A -->

### risk_level

<!-- Only if changing. ONE of: low | moderate | high | extreme. Otherwise: N/A -->

### chemistry_formula

<!-- New value, or N/A -->

### chemistry_molecular_weight

<!-- New value, or N/A -->

### chemistry_class

<!-- New value, or N/A -->

### legality

<!-- Only if changing. Provide the FULL replacement text. Otherwise: N/A -->

### history

<!-- Only if changing. Provide the FULL replacement text. Otherwise: N/A -->

### sources

<!-- Reference URLs or citations supporting the proposed change(s), one per line. At least one is REQUIRED. -->

-
-

### checklist

<!-- Replace [ ] with [x] to confirm -->

- [ ] I have verified the substance_id matches an existing entry in the
      database
- [ ] I have searched existing issues to confirm this change is not already
      proposed or in progress
- [ ] All changed dosage information comes from reputable harm-reduction or
      pharmacological sources
- [ ] I have provided at least one source supporting the proposed change(s)
- [ ] Changed effects, interactions, and harm-reduction tips are written
      objectively
- [ ] I have only filled in sections that are being changed and marked all
      others as N/A
- [ ] I understand this will be reviewed and may be edited before inclusion

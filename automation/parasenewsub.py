#!/usr/bin/env python3
"""
parse_substance_issue.py
Parses a GitHub issue body using the structured substance template
and outputs a JSON object matching the substance schema.
"""

import re
import json
import sys


def parse_substance_issue(body: str) -> dict:
    """Parse the issue body into a structured substance dict."""

    def get_section(name: str) -> str:
        """Extract raw content under a ### heading."""
        pattern = rf"### {re.escape(name)}\s*\n(.*?)(?=\n### |\Z)"
        match = re.search(pattern, body, re.DOTALL)
        if not match:
            return ""
        content = match.group(1).strip()
        # Remove HTML comments
        content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL).strip()
        return content

    def get_value(name: str) -> str:
        """Get a single-line value from a section."""
        raw = get_section(name)
        # Take first non-empty line
        for line in raw.splitlines():
            line = line.strip()
            if line and not line.startswith("<!--"):
                return line
        return ""

    def get_list(name: str) -> list:
        """Get a list of '- item' entries from a section."""
        raw = get_section(name)
        items = []
        for line in raw.splitlines():
            line = line.strip()
            if line.startswith("- ") and len(line) > 2:
                items.append(line[2:].strip())
        return items

    def parse_routes(body_text: str) -> dict:
        """Parse all route_start/route_end blocks."""
        route_pattern = r"### route_start\s*\n(.*?)### route_end"
        matches = re.findall(route_pattern, body_text, re.DOTALL)
        routes = {}

        for block in matches:
            route = {}
            for line in block.strip().splitlines():
                line = line.strip()
                if ":" in line and not line.startswith("#") and not line.startswith("<!--"):
                    key, _, value = line.partition(":")
                    key = key.strip()
                    value = value.strip()
                    if value and value.lower() != "n/a":
                        route[key] = value

            route_name = route.pop("route_name", None)
            if not route_name:
                continue

            routes[route_name] = {
                "dosage": {
                    "threshold": route.get("dosage_threshold", ""),
                    "light": route.get("dosage_light", ""),
                    "common": route.get("dosage_common", ""),
                    "strong": route.get("dosage_strong", ""),
                    "heavy": route.get("dosage_heavy", ""),
                },
                "duration": {
                    "onset": route.get("duration_onset", ""),
                    "comeup": route.get("duration_comeup", ""),
                    "peak": route.get("duration_peak", ""),
                    "offset": route.get("duration_offset", ""),
                    "total": route.get("duration_total", ""),
                },
                "notes": route.get("route_notes", ""),
            }

        return routes

    def parse_checklist(name: str) -> dict:
        """Parse checklist items into a dict of label -> bool."""
        raw = get_section(name)
        checklist = {}
        for line in raw.splitlines():
            line = line.strip()
            match = re.match(r"-\s*\[([ xX])\]\s*(.*)", line)
            if match:
                checked = match.group(1).lower() == "x"
                label = match.group(2).strip()
                checklist[label] = checked
        return checklist

    # --- Build substance object ---

    substance = {
        "id": get_value("substance_id"),
        "name": get_value("substance_name"),
        "commonNames": get_list("common_names"),
        "category": get_value("category"),
        "class": get_value("chemical_class"),
        "description": get_value("description"),
        "effects": {
            "positive": get_list("effects_positive"),
            "neutral": get_list("effects_neutral"),
            "negative": get_list("effects_negative"),
        },
        "dosage": {
            "threshold": get_value("dosage_general_threshold"),
            "light": get_value("dosage_general_light"),
            "common": get_value("dosage_general_common"),
            "strong": get_value("dosage_general_strong"),
            "heavy": get_value("dosage_general_heavy"),
        },
        "routes": get_list("routes"),
        "routeData": parse_routes(body),
        "interactions": get_list("interactions"),
        "harmReduction": get_list("harm_reduction"),
        "afterEffects": get_value("after_effects"),
        "riskLevel": get_value("risk_level"),
        "chemistry": {
            "formula": get_value("chemistry_formula"),
            "molecularWeight": get_value("chemistry_molecular_weight"),
            "class": get_value("chemistry_class"),
        },
        "legality": get_value("legality"),
        "history": get_value("history"),
        "aliases": get_list("aliases"),
    }

    # --- Metadata (not part of substance schema) ---
    meta = {
        "sources": get_list("sources"),
        "checklist": parse_checklist("checklist"),
    }

    return {"substance": substance, "_meta": meta}


def validate(substance: dict) -> list:
    """Return a list of validation errors (empty = valid)."""
    errors = []
    required_fields = ["id", "name", "category", "description", "riskLevel"]
    valid_categories = [
        "stimulants", "depressants", "psychedelics", "dissociatives",
        "empathogens", "cannabinoids", "opioids", "nootropics",
        "deliriants", "other"
    ]
    valid_risk = ["low", "moderate", "high", "extreme"]

    for field in required_fields:
        if not substance.get(field):
            errors.append(f"Missing required field: {field}")

    if substance.get("category") and substance["category"] not in valid_categories:
        errors.append(f"Invalid category: '{substance['category']}'. Must be one of: {valid_categories}")

    if substance.get("riskLevel") and substance["riskLevel"] not in valid_risk:
        errors.append(f"Invalid risk_level: '{substance['riskLevel']}'. Must be one of: {valid_risk}")

    if not substance.get("routeData"):
        errors.append("At least one route-specific data block (route_start/route_end) is required")

    if not substance.get("effects", {}).get("positive"):
        errors.append("At least one positive effect is required")

    if not substance.get("effects", {}).get("negative"):
        errors.append("At least one negative effect is required")

    if not substance.get("commonNames"):
        errors.append("At least one common name is required")

    # Validate ID format
    if substance.get("id") and not re.match(r"^[a-z0-9-]+$", substance["id"]):
        errors.append(f"Invalid substance ID format: '{substance['id']}'. Use lowercase alphanumeric + hyphens only")

    return errors


if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r") as f:
            issue_body = f.read()
    else:
        issue_body = sys.stdin.read()

    result = parse_substance_issue(issue_body)
    errors = validate(result["substance"])

    if errors:
        print("❌ VALIDATION ERRORS:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        result["_validation"] = {"valid": False, "errors": errors}
    else:
        result["_validation"] = {"valid": True, "errors": []}
        print("✅ Validation passed", file=sys.stderr)

    print(json.dumps(result, indent=2))

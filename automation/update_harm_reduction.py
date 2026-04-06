import os
import re
import json
import argparse
import wiki_parse

EXCLUDED = {"index.ts", "substances.ts"}

def extract_substance_name(ts_content):
    """Extract the substance name from a .ts file."""
    match = re.search(r'"name":\s*"([^"]+)"', ts_content)
    return match.group(1) if match else None

def text_to_harm_reduction_list(text):
    """Split cleaned wiki text into a list of harm reduction points."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    # Filter out bullet markers introduced by clean_wikitext
    lines = [re.sub(r"^•\s*", "", line) for line in lines]
    # Drop any token that looks like a wiki anchor link (e.g. "Responsible use #Hallucinogens")
    lines = [re.sub(r"\S+\s*#\S+", "", line).strip() for line in lines]
    return [line for line in lines if line]

def update_harm_reduction(ts_content, items):
    """Replace the harmReduction array in the .ts file content."""
    json_items = json.dumps(items, indent=2, ensure_ascii=False)
    # Indent all lines except the opening bracket to match TS 2-space indent
    lines = json_items.splitlines()
    indented = lines[0] + "\n" + "\n".join("  " + l for l in lines[1:])
    new_array = f'"harmReduction": {indented}'

    updated = re.sub(
        r'"harmReduction":\s*\[.*?\]',
        new_array,
        ts_content,
        flags=re.DOTALL
    )
    return updated

def process_directory(directory, dry_run=False, section="Harm reduction", exclude_children=False, exclude=None):
    ts_files = [
        f for f in os.listdir(directory)
        if f.endswith(".ts") and f not in EXCLUDED
    ]

    if not ts_files:
        print("No eligible .ts files found.")
        return

    for filename in sorted(ts_files):
        filepath = os.path.join(directory, filename)

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        substance_name = extract_substance_name(content)
        if not substance_name:
            print(f"[SKIP] {filename}: could not determine substance name")
            continue

        section_label = ", ".join(section) if isinstance(section, list) else section
        print(f"[{filename}] Fetching '{section_label}' for '{substance_name}'...")
        if isinstance(section, list):
            text = wiki_parse.get_sections_text(substance_name, section, summarize=False,
                                                 exclude_children=exclude_children, exclude=exclude)
        else:
            text = wiki_parse.get_section_text(substance_name, section, summarize=False)

        if text is None:
            print(f"  → Section not found on PsychonautWiki, skipping.")
            continue

        items = text_to_harm_reduction_list(text)
        if not items:
            print(f"  → Section was empty after parsing, skipping.")
            continue

        print(f"  → {len(items)} harm reduction point(s) found.")

        updated_content = update_harm_reduction(content, items)

        if dry_run:
            print(f"  → [dry-run] Would write {len(items)} items to {filename}")
        else:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print(f"  → Updated {filename}")

def main():
    parser = argparse.ArgumentParser(
        description="Populate harmReduction arrays in .ts substance files using PsychonautWiki."
    )
    parser.add_argument("directory", help="Directory containing .ts substance files")
    parser.add_argument(
        "--section", nargs="+", default=["Harm reduction"],
        help="Wiki section(s) to pull from (default: 'Harm reduction'). Pass multiple to combine."
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Preview changes without writing to files"
    )
    parser.add_argument(
        "--exclude-children", action="store_true",
        help="Only fetch explicitly requested sections, not their subsections"
    )
    parser.add_argument(
        "--exclude", nargs="+", default=None,
        help="Specific section heading(s) to exclude (e.g., --exclude 'Dangerous interactions')"
    )
    args = parser.parse_args()

    process_directory(args.directory, dry_run=args.dry_run, section=args.section,
                      exclude_children=args.exclude_children, exclude=args.exclude)

if __name__ == "__main__":
    main()

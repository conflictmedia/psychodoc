import requests
import mwparserfromhell
import argparse
import re
import wiki_summarizer

before_clean = ""

def clean_wikitext(text):
    """Thoroughly clean stripped wikitext."""

    # --- Line-level markup ---
    # Colons (indentation / definition list)
    text = re.sub(r"(?m)^:+\s*", "", text)
    text = re.sub(r":{2,}", " ", text)
    # Semicolons (definition term)
    text = re.sub(r"(?m)^;+\s*", "", text)
    # Bullets → nice unicode bullet
    text = re.sub(r"(?m)^\*+\s*", "• ", text)
    # Numbered lists → plain text
    text = re.sub(r"(?m)^#+\s*", "", text)
    # Horizontal rules
    text = re.sub(r"(?m)^-{4,}", "---", text)

    # --- Inline artifacts ---
    # Bold/italic markup ('''bold''', ''italic'')
    text = re.sub(r"'{2,3}", "", text)
    # Leftover HTML entities
    text = text.replace("&nbsp;", " ")
    text = text.replace("&ndash;", "–")
    text = text.replace("&mdash;", "—")
    text = text.replace("&amp;", "&")
    # Leftover <ref> tags that strip_code might miss
    text = re.sub(r"<ref[^>]*>.*?</ref>", "", text, flags=re.DOTALL)
    text = re.sub(r"<ref[^/]*/?>", "", text)
    # Any remaining HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    # __NOTOC__, __TOC__, etc.
    text = re.sub(r"__[A-Z]+__", "", text)
    # Any surviving wikilink brackets [[...]] — replace with inner text or remove
    text = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]", r"\1", text)
    text = re.sub(r"\[\[[^\]]*\]\]", "", text)
    # Strip "Cross-tolerance " prefix left by cross-tolerance templates
    text = re.sub(r"\bCross-tolerance\s+", "", text)

    # --- Image caption remnants (e.g., "thumb|upright=1.35|Table from...") ---
    # Remove lines that look like image captions with MediaWiki parameters
    # Patterns: "thumb|...", "upright=...", or starting with common image params
    image_param_pattern = r"^(?:thumb|frame|border|left|right|center|none|upright[\d.=]*|\d+px)[|]|\|[\s]*(?:thumb|frame|border|left|right|center|none|upright|alt=|link=|caption)"
    text = "\n".join(line for line in text.splitlines() 
                     if not re.match(image_param_pattern, line, re.IGNORECASE))
    # Also remove any remaining standalone "thumb|...|..." patterns mid-line
    text = re.sub(r"\bthumb\|[^|]*(?:\|[^|]*)+", "", text)
    # Remove orphaned image parameter fragments
    text = re.sub(r"\bupright\s*=\s*[\d.]+\b", "", text)
    # Remove icon size fragments like "17pxMain article:" or "15pxSee also:"
    text = re.sub(r"\b\d+px\s*(?:Main article|See also|Further information|Related)\s*:?", "", text, flags=re.IGNORECASE)
    # Remove any standalone "Npx" fragments at start of words
    text = re.sub(r"\b\d+px(?=[A-Z])", "", text)

    # --- Anchor link remnants (e.g. "Responsible use #Hallucinogens") ---
    # Drop the entire line so no stub words are left behind
    text = "\n".join(line for line in text.splitlines() if not re.search(r"\s#\w", line))

    # --- Whitespace cleanup ---
    # Trailing whitespace on lines
    text = re.sub(r"(?m)\s+$", "", text)
    # Multiple blank lines → max 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Leading/trailing whitespace
    text = text.strip()

    return text

BASE = "https://psychonautwiki.org/w/api.php"

def _fetch_wikitext(page_name):
    """Raw API fetch — returns wikitext string or None if page not found."""
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


def get_wikitext(page_name):
    """Fetch raw wikitext, trying capitalisation variants if the exact title is not found."""
    # Try the name as-is first, then with first letter uppercased (MediaWiki default)
    candidates = dict.fromkeys([
        page_name,
        page_name[0].upper() + page_name[1:] if page_name else page_name,
        page_name.upper(),
    ])
    for candidate in candidates:
        result = _fetch_wikitext(candidate)
        if result is not None:
            if candidate != page_name:
                print(f"  → Resolved '{page_name}' as '{candidate}'")
            return result
    return None

def get_sections(wikicode):
    """Get all sections with their headings and content."""
    sections = {}
    current_heading = "Introduction"
    current_content = []

    for node in wikicode.nodes:
        if isinstance(node, mwparserfromhell.nodes.Heading):
            # Save previous section
            sections[current_heading] = "".join(str(n) for n in current_content)
            current_heading = node.title.strip_code().strip()
            current_content = []
        else:
            current_content.append(node)

    # Don't forget the last section
    sections[current_heading] = "".join(str(n) for n in current_content)
    return sections


def _strip_multiline_templates(text):
    """Remove templates that span multiple lines to prevent them swallowing section headings."""
    result = []
    depth = 0
    i = 0
    start = 0
    while i < len(text) - 1:
        if text[i:i+2] == "{{":
            if depth == 0:
                result.append(text[start:i])
            depth += 1
            i += 2
        elif text[i:i+2] == "}}":
            depth -= 1
            i += 2
            if depth == 0:
                start = i
        else:
            i += 1
    if depth == 0:
        result.append(text[start:])
    return "".join(result)


def get_sections_with_levels(wikicode):
    """Get sections with heading level info."""
    # Strip multiline templates before parsing so their internal headings
    # don't get swallowed (e.g. {{effects/base|...}} spanning multiple sections)
    raw_text = str(wikicode)
    stripped_text = _strip_multiline_templates(raw_text)
    wikicode = mwparserfromhell.parse(stripped_text)

    sections = []
    current = {
        "heading": "Introduction",
        "level": 0,
        "raw": "",
        "nodes": []
    }

    for node in wikicode.nodes:
        if isinstance(node, mwparserfromhell.nodes.Heading):
            # Finalize previous section
            current["raw"] = "".join(str(n) for n in current["nodes"])
            sections.append(current)
            current = {
                "heading": node.title.strip_code().strip(),
                "level": node.level,   # 2 = ==, 3 = ===, etc.
                "raw": "",
                "nodes": []
            }
        else:
            current["nodes"].append(node)

    current["raw"] = "".join(str(n) for n in current["nodes"])
    sections.append(current)
    return sections

def _parse_section(raw, summarize):
    """Clean and optionally summarize raw wikitext for a single section."""
    parsed = mwparserfromhell.parse(raw)

    for tag in parsed.filter_tags(recursive=True):
        if tag.tag.matches("ref"):
            try:
                parsed.remove(tag)
            except ValueError:
                pass

    # Remove all templates entirely
    for template in parsed.filter_templates(recursive=True):
        try:
            parsed.remove(template)
        except ValueError:
            pass

    # Resolve wikilinks
    for wikilink in parsed.filter_wikilinks(recursive=True):
        title_str = str(wikilink.title)
        if "#" in title_str:
            # Anchor link — remove entirely
            try:
                parsed.remove(wikilink)
            except ValueError:
                pass
        elif "::" in title_str:
            # Semantic property link — keep value after :: or remove if empty
            value = title_str.split("::", 1)[1].strip()
            if value:
                wikilink.text = value
            else:
                try:
                    parsed.remove(wikilink)
                except ValueError:
                    pass
        elif not wikilink.text:
            # Plain link like [[research chemical]] — use title as display text
            wikilink.text = title_str.strip()
        # else: has display text already, strip_code handles it

    stripped = parsed.strip_code()
    clean = clean_wikitext(stripped)

    if summarize:
        return wiki_summarizer.extractive_summary(clean, ratio=0.30, diversity_factor=0.6)
    return clean


def get_section_text(page, section="Introduction", summarize=True):
    """Fetch and clean a section from a PsychonautWiki page. Returns cleaned text or None."""
    raw = get_wikitext(page)
    if raw is None:
        return None

    wikicode = mwparserfromhell.parse(raw)
    all_sections = get_sections_with_levels(wikicode)

    for s in all_sections:
        if s["heading"] == section:
            return _parse_section(s["raw"], summarize)

    return None  # section not found


def get_sections_text(page, sections, summarize=True, exclude_children=False, exclude=None):
    """Fetch and clean multiple sections, returning combined text.

    sections: list of heading strings to fetch.
    exclude_children: if True, only fetch explicitly requested sections (not their subsections).
                      By default, subsections under matched sections are included.
    exclude: list of specific section heading names to exclude (e.g., ["Dangerous interactions"]).
    """
    raw = get_wikitext(page)
    if raw is None:
        return None

    wikicode = mwparserfromhell.parse(raw)
    all_sections = get_sections_with_levels(wikicode)
    section_set = set(sections)
    exclude_set = set(exclude) if exclude else set()

    parts = []
    active_parent_level = None  # track when we are inside a matched parent
    found_headings = set()

    for s in all_sections:
        # Skip explicitly excluded sections
        if s["heading"] in exclude_set:
            continue

        # If this heading is directly requested, collect it and start tracking children
        if s["heading"] in section_set:
            active_parent_level = s["level"]
            found_headings.add(s["heading"])
            text = _parse_section(s["raw"], summarize)
            if text:
                parts.append(text)
        # If not excluding children and we are inside a matched parent, collect subsections
        elif not exclude_children and active_parent_level is not None:
            if s["level"] > active_parent_level:
                text = _parse_section(s["raw"], summarize)
                if text:
                    parts.append(text)
            else:
                # Sibling or higher heading — stop tracking this parent
                active_parent_level = None

    missing = section_set - found_headings
    if missing:
        print(f"  → Sections not found (skipped): {', '.join(sorted(missing))}")
    return "\n\n".join(parts) if parts else None

def list_sections(page):
    """Print all available section headings for a page."""
    raw = get_wikitext(page)
    if raw is None:
        print(f"Page '{page}' not found.")
        return

    wikicode = mwparserfromhell.parse(raw)
    sections = get_sections_with_levels(wikicode)

    print(f"Sections in '{page}':")
    for s in sections:
        indent = "  " * max(0, s["level"] - 1)
        prefix = f"{'=' * s['level']} " if s["level"] > 0 else "  "
        print(f"  {indent}{prefix}{s['heading']}")


def main():
    parser = argparse.ArgumentParser(description="Parse MediaWiki page sections")
    parser.add_argument("page", help="Page name to fetch from PsychonautWiki")
    parser.add_argument("section", nargs="*", default=["Introduction"],
                        help="Section heading(s) to fetch (default: Introduction). Pass multiple to combine.")
    parser.add_argument("--list-sections", action="store_true",
                        help="List all available sections for the page and exit")
    parser.add_argument("--no-summary", action="store_true",
                        help="Return full cleaned text without extractive summarization")
    parser.add_argument("--exclude-children", action="store_true",
                        help="Only fetch explicitly requested sections, not their subsections")
    parser.add_argument("--exclude", nargs="+", default=None,
                        help="Specific section heading(s) to exclude (e.g., --exclude 'Dangerous interactions')")
    args = parser.parse_args()

    if args.list_sections:
        list_sections(args.page)
        return

    summarize = not args.no_summary
    if len(args.section) == 1:
        result = get_section_text(args.page, args.section[0], summarize=summarize)
    else:
        result = get_sections_text(args.page, args.section, summarize=summarize,
                                   exclude_children=args.exclude_children, exclude=args.exclude)
    if result is None:
        print(f"Page '{args.page}' not found or section not found.")
    else:
        print(result)
        
if __name__ == "__main__":
    main()

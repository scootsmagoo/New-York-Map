#!/usr/bin/env python3
"""Turn a locally owned EPUB into plain-text chapter files for grep.

    python3 scripts/books/extract-epub.py <book.epub> <slug>

Writes data-raw/books/<slug>/ (gitignored — never commit book text):
  NN-<chapter>.txt   one file per table-of-contents entry, in reading order
  all.txt            everything, with "##### <chapter>" separators
Print page numbers, when the EPUB carries them (id="page_123"), become
inline "[p. 123]" markers so passages can be cited by page.
"""
import html, os, re, sys, zipfile, posixpath
import xml.etree.ElementTree as ET

OPF = "{http://www.idpf.org/2007/opf}"
NCX = "{http://www.daisy.org/z3986/2005/ncx/}"


def to_text(markup: str) -> str:
    s = re.sub(r"(?is)<(script|style|head)\b.*?</\1>", "", markup)
    s = re.sub(r'(?i)<[^>]*\bid="page_?(\w+)"[^>]*>', r" [p. \1] ", s)
    s = re.sub(r"(?i)<br\s*/?>|</(p|div|h\d|li|tr|blockquote)>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace("\xa0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    return re.sub(r"\n\s*\n+", "\n\n", s).strip()


def main(epub: str, slug: str) -> None:
    z = zipfile.ZipFile(epub)
    container = ET.fromstring(z.read("META-INF/container.xml"))
    opf_path = container.find(".//{*}rootfile").get("full-path")
    base = posixpath.dirname(opf_path)
    opf = ET.fromstring(z.read(opf_path))
    items = {i.get("id"): i for i in opf.iter(f"{OPF}item")}
    spine = [posixpath.join(base, items[r.get("idref")].get("href"))
             for r in opf.iter(f"{OPF}itemref")]

    # Chapter labels from the NCX: first nav point pointing at each file.
    labels: dict[str, str] = {}
    toc_id = opf.find(f"{OPF}spine").get("toc")
    if toc_id:
        ncx = ET.fromstring(z.read(posixpath.join(base, items[toc_id].get("href"))))

        def walk(parent, prefix: str) -> None:
            for np in parent.findall(f"{NCX}navPoint"):
                src = posixpath.join(base, np.find(f"{NCX}content").get("src").split("#")[0])
                label = " ".join(np.find(f"{NCX}navLabel/{NCX}text").text.split())
                # Keep sections findable under their numbered chapter.
                full = f"{prefix} › {label}" if prefix else label
                labels.setdefault(src, full)
                walk(np, re.match(r"\d+\.", label) and full or prefix)

        walk(ncx.find(f"{NCX}navMap"), "")

    out = os.path.join("data-raw", "books", slug)
    os.makedirs(out, exist_ok=True)
    for f in os.listdir(out):
        os.remove(os.path.join(out, f))
    chapters: list[tuple[str, list[str]]] = [("front matter", [])]
    for path in spine:
        if path in labels:
            chapters.append((labels[path], []))
        chapters[-1][1].append(to_text(z.read(path).decode("utf-8", "replace")))

    with open(os.path.join(out, "all.txt"), "w") as all_f:
        for n, (label, parts) in enumerate(chapters):
            body = "\n\n".join(p for p in parts if p)
            if not body:
                continue
            name = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")[:60]
            with open(os.path.join(out, f"{n:03d}-{name}.txt"), "w") as f:
                f.write(body + "\n")
            all_f.write(f"\n\n##### {label}\n\n{body}\n")
            print(f"{n:03d}  {len(body.split()):7d} words  {label}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])

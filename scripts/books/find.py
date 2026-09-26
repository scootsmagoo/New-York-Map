#!/usr/bin/env python3
"""Search the extracted books with citations.

    python3 scripts/books/find.py "Seneca Village"            # both books
    python3 scripts/books/find.py -b gotham -n 5 "Rodrigues"
    python3 scripts/books/find.py -w 600 "Croton.*1842"        # regex, wider context

Each hit prints the book, the chapter it falls in, and (Gotham only) the
print page, e.g. "gotham · 35. Filth, Fever, Water, Fire · p. 625".
Run scripts/books/extract-epub.py first; see docs/BOOK_REFERENCE.md.
"""
import argparse, glob, os, re, sys

ap = argparse.ArgumentParser()
ap.add_argument("pattern", help="case-insensitive regex")
ap.add_argument("-b", "--book", help="gotham | greater-gotham (default: all)")
ap.add_argument("-n", "--max", type=int, default=8, help="hits per book")
ap.add_argument("-w", "--width", type=int, default=260, help="context chars")
args = ap.parse_args()

root = os.path.join(os.path.dirname(__file__), "..", "..", "data-raw", "books")
books = [args.book] if args.book else sorted(os.listdir(root))
rx = re.compile(args.pattern, re.I)
for book in books:
    path = os.path.join(root, book, "all.txt")
    if not os.path.exists(path):
        sys.exit(f"missing {path} — run scripts/books/extract-epub.py")
    text = open(path).read()
    # Stop before back matter so hits are narrative, not index/notes.
    end = min((m.start() for m in re.finditer(r"^##### (References|Acknowledgments)", text, re.M)), default=len(text))
    heads = [(m.start(), m.group(1)) for m in re.finditer(r"^##### (.+)$", text, re.M)]
    hits = list(rx.finditer(text, 0, end))
    print(f"== {book}: {len(hits)} hit(s)")
    for m in hits[: args.max]:
        chap = next((h for pos, h in reversed(heads) if pos <= m.start()), "?")[:60]
        page = re.findall(r"\[p\. (\w+)\]", text[max(0, m.start() - 6000): m.start()])
        cite = f"{book} · {chap}" + (f" · p. {page[-1]}" if page else "")
        a, b = max(0, m.start() - args.width), min(len(text), m.end() + args.width)
        snippet = " ".join(text[a:b].split())
        print(f"\n[{cite}]\n…{snippet}…")
    print()

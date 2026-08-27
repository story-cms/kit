# Journeys Studio Kit

Shared CMS kit for authoring Stories, their Chapters, and the Blocks inside those chapters.

## Language

**Story**:
A published work in a locale, with a type, a chapter type, and a template.
_Avoid_: Course, devotion, book (those are story types or templates, not the work itself)

**Story template**:
The identifier on a Story (`course`, `devotion`, …) that selects how every chapter of that story is authored, validated, and previewed.
_Avoid_: Chapter template (the template belongs to the Story; every chapter shares it)

**Standard template**:
A story template whose chapters use the shared block editor rather than a bespoke field schema. Course and devotion are the current members of this expandable set.

**Standard Chapter**:
A chapter whose story uses a standard template.

**Chapter**:
An ordered unit of a Story. The story's chapter type is the display noun (Session, Day, Episode).
_Avoid_: Session, devotion, lesson (those are chapter types or story types)

**Block**:
A structured content unit inside a chapter: title, content, or scripture.

**Draft**:
The unpublished working copy of a chapter.

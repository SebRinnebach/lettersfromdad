# Letters from Dad

A collection of short letters for the kids, edited as individual Markdown files and assembled into a single manuscript.

## Repository Structure

- `letters/` is the source of truth. Edit one letter per file.
- `lettersfromdad.md` is the generated combined manuscript for reading on GitHub.
- `logo_small.png` is the image used at the top of the combined manuscript.
- `scripts/build-manuscript.mjs` assembles and checks the combined manuscript.

## Editing Workflow

1. Edit the relevant file in `letters/`.
2. Run `npm run build` to regenerate `lettersfromdad.md`.
3. Run `npm run check` before committing.
4. Commit focused changes, ideally one letter or one coherent edit at a time.

## Adding A New Letter

1. Create a new file in `letters/` using the next number:

   ```text
   letters/letter-07-short-descriptive-title.md
   ```

2. Start the file with the matching letter marker:

   ```markdown
   LETTER 07

   TITLE OF THE LETTER
   ```

3. Run `npm run build` and `npm run check`.

## Version Control Advice

- Keep filenames stable. Avoid `v2`, `final`, or dated copies of letters.
- Use Git commits for versions instead of duplicate files.
- Make focused commits with plain messages, for example `Revise letter 04 opening`.
- Use branches for larger rewrites, for example `rewrite/letter-05-change`.
- If you later want cleaner prose diffs, convert each letter to semantic line breaks in a formatting-only commit before making content edits.


# Fonts

This directory is where the site's typeface lives. It is empty in the repo
because Satoshi cannot be redistributed from here.

## Add Satoshi

1. Download the **variable** package from <https://www.fontshare.com/fonts/satoshi>
2. Drop these two files in beside this README:

   - `Satoshi-Variable.woff2`
   - `Satoshi-VariableItalic.woff2`

That is the whole install. `src/styles/fonts.css` already points at these exact
paths, and `index.html` already preloads the first one, so the face takes over
on the next build with no code change.

## Until then

The site renders in Plus Jakarta Sans (bundled from npm), which is the closest
variable geometric sans that can be installed here — Fontshare is not reachable
from the build environment. Once Satoshi is in place you can drop the stand-in:
see the removal note at the top of `src/styles/fonts.css`.

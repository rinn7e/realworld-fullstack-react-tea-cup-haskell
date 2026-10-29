#!/usr/bin/env bash
# Every file is its own module, and the files of one folder share their
# internals through `@_spi(<folder module>)`, the `.Internal` pattern of
# Haskell. The compiler lets any module opt in with `@_spi(X) import`, so this
# check is what keeps it to the folder: every `@_spi(X)` of a file, on a
# declaration or an import, must name the folder of that file.
#
# The folder of a file is its path under src/ with `_` between the folders
# (`Screen/UserScreen` is `Screen_UserScreen`); a `SubComponent/` file belongs
# to its screen, and the root, `Handler/` and `Util/` are `App`.
set -u

cd "$(dirname "$0")/.."

group_of() {
  local dir
  dir=$(dirname "$1")
  dir=${dir%/SubComponent}
  case "$dir" in
    src | src/Handler | src/Util) echo "App" ;;
    *) dir=${dir#src/}; echo "${dir//\//_}" ;;
  esac
}

failed=0
while IFS= read -r file; do
  group=$(group_of "$file")
  while IFS=: read -r line name; do
    if [ "$name" != "$group" ]; then
      echo "FAIL $file:$line: @_spi($name), but the folder is $group"
      failed=1
    fi
  done < <(grep -no '@_spi([A-Za-z_]*)' "$file" | sed 's/@_spi(\(.*\))/\1/')
done < <(find src -name '*.swift' | sort)

if [ "$failed" -eq 0 ]; then
  echo "ok: every @_spi stays in its folder"
fi
exit "$failed"

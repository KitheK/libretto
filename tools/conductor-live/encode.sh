#!/usr/bin/env bash
# Turn raw takes (tools/conductor-live/takes/*.webm, 1280x800 @25fps) into
# Libretto motion assets: <name>.gif (palette, 12fps), <name>.webm (VP9), <name>-poster.png.
# Long agent waits are cut (the cut points are listed per clip below).
set -euo pipefail
cd "$(dirname "$0")"
OUT=../../public/conductor/motion
mkdir -p "$OUT"

# name | segments "start-end[,start-end]" | crop w:h:x:y | output width | poster time (s, in output)
CLIPS=(
  "assistant-greeting|1.0-15.0|888:330:392:250|720|4.5"
  "agent-think|4.4-13.2,17.6-27.8|888:722:392:78|720|17.0"
  "agent-review|4.4-12.0,23.4-34.8|888:722:392:78|720|12.0"
  "theme-toggle|1.2-10.3|1280:800:0:0|800|5.0"
  "desk-tour|1.2-18.7|1280:800:0:0|720|1.0"
)

for row in "${CLIPS[@]}"; do
  IFS="|" read -r name segs crop width poster <<<"$row"
  src="takes/${name%%-*}.webm"
  case "$name" in
    assistant-greeting) src=takes/greeting.webm ;;
    agent-think) src=takes/think.webm ;;
    agent-review) src=takes/review.webm ;;
    theme-toggle) src=takes/theme.webm ;;
    desk-tour) src=takes/tour.webm ;;
  esac
  IFS="," read -ra parts <<<"$segs"
  filter=""; labels=""
  for i in "${!parts[@]}"; do
    s="${parts[$i]%-*}"; e="${parts[$i]#*-}"
    filter+="[0:v]trim=start=$s:end=$e,setpts=PTS-STARTPTS[s$i];"
    labels+="[s$i]"
  done
  filter+="${labels}concat=n=${#parts[@]}:v=1:a=0,crop=$crop,scale=$width:-2:flags=lanczos[base]"

  ffmpeg -v error -y -i "$src" -filter_complex "$filter" -map "[base]" \
    -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an "$OUT/$name.webm"

  ffmpeg -v error -y -i "$OUT/$name.webm" -filter_complex \
    "fps=12,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    "$OUT/$name.gif"

  ffmpeg -v error -y -ss "$poster" -i "$OUT/$name.webm" -frames:v 1 "$OUT/$name-poster.png"
  printf "%-20s gif %6s KB  webm %6s KB\n" "$name" $(( $(stat -c%s "$OUT/$name.gif") / 1024 )) $(( $(stat -c%s "$OUT/$name.webm") / 1024 ))
done

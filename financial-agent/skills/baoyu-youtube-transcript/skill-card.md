## Description:

Downloads YouTube video transcripts, subtitles, metadata, and cover images by URL or video ID, with support for multiple languages, translation, chapters, speaker identification, and cached re-formatting.

This skill is ready for commercial/non-commercial use.

## Publisher:

[jimliu](https://clawhub.ai/user/jimliu)

### License/Terms of Use:

MIT-0

## Use Case:

Developers, researchers, and content workflows use this skill to fetch YouTube captions or subtitles, list available transcript languages, save Markdown or SRT transcript files, cache video metadata, and optionally produce chaptered speaker-labeled transcripts.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: The skill may run mutable third-party tooling or remote executable components through Bun, npx, uvx, or yt-dlp fallback paths.

Mitigation: Run it only in environments where those subprocesses are acceptable, prefer preinstalled pinned binaries, and avoid npx or uvx fallback execution.

Risk: The yt-dlp fallback can use browser session cookies when YOUTUBE_TRANSCRIPT_COOKIES_FROM_BROWSER is set.

Mitigation: Leave that environment variable unset unless the operator intentionally wants browser cookies available to the fallback process.

Risk: Transcript text, video metadata, and cover images are cached under the selected output directory.

Mitigation: Choose an appropriate output directory and review generated files before sharing or committing them.

## Reference(s):

- [ClawHub skill page](https://clawhub.ai/jimliu/skills/baoyu-youtube-transcript)
- [Project homepage](https://github.com/JimLiu/baoyu-skills#baoyu-youtube-transcript)
- [Speaker transcript prompt](artifact/prompts/speaker-transcript.md)

## Skill Output:

**Output Type(s):** [text, markdown, shell commands, configuration, files, guidance]

**Output Format:** [Markdown, SRT, JSON metadata, cached transcript files, and cover image files]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [Can write transcript.md, transcript.srt, meta.json, transcript-raw.json, transcript-sentences.json, .index.json, and imgs/cover.jpg under the selected output directory.]

## Skill Version(s):

1.117.2 (source: server release metadata)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.

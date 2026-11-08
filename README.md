# Britannia English: Listening section (Stage 1 prototype)

Open `listening.html`. It lists 8 lessons for each of B1, B2 and C1 (24 activities). **You never edit the code** (`js/`, `css/`, `listening.html`). You only add media files and edit JSON files.

## 1. Test it on your computer
Browsers block JSON files when a page is opened by double-clicking, so use the included test server (needs Python 3, free from python.org).
1. Unzip the folder.
2. Open a terminal in the folder (Windows: type `cmd` in the folder's address bar; Mac: right-click the folder, "New Terminal at Folder").
3. Run `python3 serve.py` (Windows: `py serve.py`).
4. Open **http://localhost:8000/listening.html** in your browser. Stop the server with Ctrl+C.
5. After each edit, refresh the page (the test server never caches).

Use `serve.py` rather than `python -m http.server`: only `serve.py` lets the progress bar jump to a point in the recording, as it will on GitHub Pages.

## 2. Add an audio or video file
Name the file exactly as below and put it in the right folder:

| Level | Audio | Video |
|---|---|---|
| B1 | `assets/audio/b1/lesson-01.mp3` | `assets/video/b1/lesson-01.mp4` |
| B2 | `assets/audio/b2/lesson-01.mp3` | `assets/video/b2/lesson-01.mp4` |
| C1 | `assets/audio/c1/lesson-01.mp3` | `assets/video/c1/lesson-01.mp4` |

(Numbers run from `01` to `08`.) For **audio**, nothing else is needed: the player activates itself. For **video**, open the lesson's JSON file and change `"media"` to the video path, e.g. `"media": "assets/video/b1/lesson-01.mp4"`. Accepted formats: mp3, m4a, wav, ogg (audio); mp4 (H.264), webm (video). Keep names in lower case: GitHub Pages is case-sensitive (`lesson-01.MP3` will not be found).
Tip: a 1-minute mp3 at 128 kbps is about 1 MB, well within GitHub's limits.

## 3. Add questions, answers, explanations and a transcript
Edit `data/listening/<level>/lesson-NN.json` (any text editor, e.g. Notepad or VS Code). Replace `"questions": []` with your questions, and fill in `"transcript"`:
```json
"questions": [
  {
    "prompt": "What is the main topic of the conversation?",
    "options": ["Option A", "Option B", "Option C"],
    "answer": 1,
    "explanation": "Why Option B is correct, with a clue from the recording."
  },
  {
    "prompt": "The speaker has lived in London for two years.",
    "options": ["True", "False"],
    "answer": 0,
    "explanation": "She says she moved here in 2024."
  }
],
"transcript": "Full text of the recording."
```
- `answer` is the position of the correct option, **starting from 0** (first option = 0).
- You can also edit `topic`, `objective`, `context` (short introduction shown above the player) and `targetDuration`.
- The learner sees: immediate feedback per question, the correct answer, your explanation, a score, "Try again" (unlimited), and the transcript **only after "Check answers"**. The card on the list then shows the learner's best score.
- JSON rules: straight quotation marks `"`, a comma between items, no comma after the last one. If you make a mistake, the page names the file (and the question number) that needs fixing; one broken file does not affect the others.

## 4. Add a lesson 9
Add `{"n": 9}` to `data/listening/index.json`, then copy `lesson-08.json` to `lesson-09.json` in each level folder and edit it.

## 5. Check that everything works (10 minutes)
- [ ] B1, B2 and C1 each show 8 lesson cards marked "Placeholder"; every card opens.
- [ ] With no file, the player says "No media file yet" with the expected path.
- [ ] After adding an audio file: Play/Pause, Replay, progress bar (click or drag) and speed all work.
- [ ] After adding questions: choose answers, click "Check answers"; feedback, explanation, score and transcript appear; "Try again" clears everything.
- [ ] Go back to the list: the card shows "Best score".
- [ ] Narrow your browser window or open the page on your phone: nothing runs off the screen.

## Notes
- Scores are saved in the browser's localStorage: on that device and browser only, not synced, and erased if the learner clears browser data.
- `build_placeholders.py` is optional: it **overwrites** every lesson file. Never run it after adding your own content.
- Publishing: see `GITHUB-PAGES-GUIDE.md`.

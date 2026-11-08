# Testing on GitHub Pages: step by step

**1. Create a free account** at github.com and sign in.

**2. Create a repository.** Click **+** (top right) → **New repository**. Name it, for example, `britannia-english`. Choose **Public** (GitHub Pages is free for public repositories). Click **Create repository**.

**3. Upload the files.** Unzip the package on your computer. In your new repository click **uploading an existing file** (or **Add file → Upload files**). Open the unzipped `britannia-english` folder and drag its **contents** (`index.html`, `listening.html`, and the `css`, `js`, `data`, `assets` folders, plus the other files) into the browser window. Check that `index.html` sits at the top level, not inside another folder. Wait for the upload to finish, then click **Commit changes**.

**4. Switch on GitHub Pages.** Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, then **Save**.

**5. Wait 1 to 2 minutes**, refresh the Pages settings screen, and copy the address shown: `https://YOUR-USERNAME.github.io/britannia-english/`. It opens the listening page. Open it on your computer **and on your phone**.

**6. Test.** Follow the checklist in section 5 of `README.md`.

**7. Add your media and questions.** In the repository, open the right folder (for example `assets/audio/b1`), click **Add file → Upload files**, drop your `lesson-01.mp3`, and commit. To edit questions, open the JSON file, click the pencil icon, edit, and click **Commit changes**. Uploading a file with the same name replaces the old one.

**8. See your changes.** Wait about a minute, then do a hard refresh (Ctrl+F5, or Cmd+Shift+R on Mac). On a phone, close and reopen the tab.

## If something does not work
- **404 or "Cannot find …" message:** the file name or folder is wrong. Names are case-sensitive: use `lesson-01.mp3`, not `Lesson-01.MP3`.
- **Player says "No media file yet":** the file is not at the path shown under the player.
- **"Invalid JSON":** a missing comma or quotation mark in the file named on screen. Paste the file into jsonlint.com to find it.
- **Old version still showing:** wait a minute and hard refresh.
- **Upload refused:** browser uploads accept files up to 25 MB each; compress long recordings to mp3.

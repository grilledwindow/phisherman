# Phisherman

## Setup
Reuirements:
- Python3
- Chromium-based browser

### Retrieving offline copy of email
Since the page needs to be refreshed every time the extension is updated, an offline copy is much faster for testing changes.
1. In your browser, navigate to gmail (login if needed)
2. Go to a random email
3. In dev console (Ctrl + Shift + I), enter the following line:
`let body = document.querySelector('div.a3s.aiL'); body`
4. Right click on the resulting element and "Copy outerHTML"
5. Paste it in the project file `backend/templates/gmail.html`

### Backend
1. `cd backend`
2. Create Python virtual environment: `python3 -m venv .venv`
3. Activate venv: run required [command](https://docs.python.org/3/library/venv.html#how-venvs-work)
4. Install packages: `.venv/bin/pip install -r requirements.txt`
5. Run app: `flask run`

### Extension
Currently, the extension only works on Chrome/Chromium browsers, tested on Brave.
1. In the browser, go to `brave://extensions`
2. Enable developer mode
3. Load unpacked -> select `extension` folder

If the extension needs to run on URLs that are undetected, you may add a new rule in `extension/manifest.json`, in the `matches` array.

# XML & JSON Lab

A static web page for the XML and JSON lab assignment. It loads `book.xml` with the Fetch API and parses it with `DOMParser`, then loads `userProfiles.json` with `response.json()`.

All profile details are fictional sample data.

## Run locally

Fetch requests need a local web server. From this folder, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Publish with GitHub Pages

1. Push these files to the root of a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
4. Submit the published URL shown in the Pages settings. It will usually be `https://USERNAME.github.io/REPOSITORY/`.

# stuartbates.com

Personal site and occasional writing.

The site is built with Jekyll and published on GitHub Pages. Blog posts live in
`_posts`; only posts with `published: true` are included in the generated site.

## Run locally

```sh
bundle install
bundle exec jekyll serve
```

The local site is available at <http://127.0.0.1:4000>.

## Publishing

Pushing to `main` builds and deploys the site through GitHub Actions. GitHub
Pages must be configured to use **GitHub Actions** as its source.

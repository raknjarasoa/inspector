<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

> An angular library that lets you inspect and change Angular component properties

## Features <!-- omit in toc -->

- ✅ Inspect Angular components on the fly
- ✅ Change component properties without touching the code
- ✅ Simulate Angular events
- ✅ See the results in realtime

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
  - [Angular CLI](#angular-cli)
- [Contributors ✨](#contributors-)

## Installation

### Angular CLI

`ng add @ngneat/inspector`

Above command will do following for you:

1. Add and install following dev dependencies:
   1. @ngneat/inspector
   2. prismjs (used for code highlighting)
2. Import `environments` from `../environments/environment.ts` in projects root module. *This can be skipped with `--skipImport`.*
3. Import `InspectorModule` from `@ngneat/inspector` in your project's root module's `imports` section. This is a conditional import, it shouldn't be part of your production build. *This can be skipped with `--skipImport`.*

<!-- ## FAQ

## How to ...

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid assumenda atque blanditiis cum delectus eligendi ips -->

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/shhdharmen"><img src="https://avatars3.githubusercontent.com/u/6831283?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dharmen Shah</b></sub></a><br /><a href="https://github.com/@ngneat/inspector/commits?author=shhdharmen" title="Code">💻</a> <a href="#content-shhdharmen" title="Content">🖋</a> <a href="#ideas-shhdharmen" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-shhdharmen" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://www.netbasal.com/"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/inspector/issues?q=author%3ANetanelBasal" title="Bug reports">🐛</a> <a href="#content-NetanelBasal" title="Content">🖋</a> <a href="https://github.com/@ngneat/inspector/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-NetanelBasal" title="Mentoring">🧑‍🏫</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

---

*Icons made by [Freepik](http://www.freepik.com/ "Freepik") from [www.flaticon.com](http://www.flaticon.com/ "Flaticon")*

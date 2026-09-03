# 2024 presidential election market data

`polymarket-2024-hourly.csv` contains 3,863 hourly observations for the
Polymarket contract "Will Donald Trump win the 2024 US presidential election?"
from May 29 through November 5, 2024. `time` is UTC and `q` is the traded price
of the Trump `Yes` token, interpreted as the market-implied probability.

The June 1-November 5 portion was converted without transformation from
`polymarket2024.rda` in Sebastian Stockl's MIT-licensed `eventclock` package,
version 0.3.0:

- Dataset documentation: https://www.sebastianstoeckl.com/eventclock/reference/polymarket2024.html
- Source repository: https://github.com/sstoeckl/eventclock
- Reconstruction script: `data-raw/01-fetch-polymarket.R` in that repository
- Original RDA SHA-256: `c69bab3a39849bd6185e368394775ea391005147d119aeb67f51fcd580be2f73`
- Expanded CSV SHA-256: `d2cff3685d3201dc572000484a41fe0f4460d7b41e8a4b0acf654827e01ce320`

The upstream script downloads the Trump `Yes` token from Polymarket's public
CLOB price-history endpoint with 60-minute fidelity. The May 29-31 prelude was
downloaded directly from the same endpoint on September 3, 2026 so the May 30
conviction has complete before and after windows. The token ID is:

`21742633143463906290569050155826241533067272736897614950488156847949938836455`

## License

The upstream package and dataset are distributed under the MIT License:

Copyright (c) 2026 Sebastian Stockl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

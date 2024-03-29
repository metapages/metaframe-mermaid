# [Metaframe](https://docs.metapage.io/): mermaid diagrams

Mermaid diagrams are dynamically created from text configuration:

- Live editor: https://mermaid-js.github.io/mermaid-live-editor/
- Documentation: https://mermaid.js.org/intro/n00b-gettingStarted.html

[![](https://mermaid.ink/svg/pako:eNpNkDFuwzAMRa9CcE7Q3UOndIuXdrQysBIdE5FkQ6IKBEnuXtlKinIQyI8n8pM3tLNj7PCcaJng-Gki1AicAomD_f4d-iY5HgeDgZUWOvNbLSWKyhwNnv5zuXy3Xis6Jgrc9DX64SB58XQFJ1SpAF4uDDpJhjnyqZEcXUv6re_doPViL8A_HDUbvIMdNuXJtxd3-HRdt7mtmkGduI7HrqbVLxWvBk18VLQsjpQ_nOicsBvJZ94hFZ2_rtFip6nwCzo0q38Ub5_6drbteo9fDOFpqw)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNpNkDFuwzAMRa9CcE7Q3UOndIuXdrQysBIdE5FkQ6IKBEnuXtlKinIQyI8n8pM3tLNj7PCcaJng-Gki1AicAomD_f4d-iY5HgeDgZUWOvNbLSWKyhwNnv5zuXy3Xis6Jgrc9DX64SB58XQFJ1SpAF4uDDpJhjnyqZEcXUv6re_doPViL8A_HDUbvIMdNuXJtxd3-HRdt7mtmkGduI7HrqbVLxWvBk18VLQsjpQ_nOicsBvJZ94hFZ2_rtFip6nwCzo0q38Ub5_6drbteo9fDOFpqw)


## Inputs

 - `mermaid`: string text of diagram
 - `metapage/definition`: allows this metaframe to be used as a plugin to automatically render metapage definitions

## Outputs

- `click`: id of the node clicked (if click events added, see below for an example)

## Examples

[👉 Example of generating a diagram and capturing clicks 🔗](https://app.metapages.org/#?definition=eyJtZXRhIjp7ImRlc2NyaXB0aW9uIjoiVGhpcyBkZW1vbnN0cmF0ZXMgaG93IHlvdSBjYW4gZWFzaWx5IGdlbmVyYXRlIHZpc3VhbCBsYXlvdXRzIHdpdGggY29kZSwgdGhlbiBkaXNwbGF5LCBhbmQgYWxzbyBjYXB0dXJlIHRoZSBjbGlja3MgdG8gYW5vdGhlciBtZXRhZnJhbWUiLCJsYXlvdXRzIjp7InJlYWN0LWdyaWQtbGF5b3V0Ijp7ImRvY3MiOiJodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9yZWFjdC1ncmlkLWxheW91dCIsImxheW91dCI6W3siaCI6MiwiaSI6ImNsaWNrIiwiaXNEcmFnZ2FibGUiOnRydWUsIm1vdmVkIjpmYWxzZSwic3RhdGljIjpmYWxzZSwidyI6NywieCI6MCwieSI6Nn0seyJoIjo1LCJpIjoiY29kZS9qc29uLWVkaXRvciIsImlzRHJhZ2dhYmxlIjp0cnVlLCJtb3ZlZCI6ZmFsc2UsInN0YXRpYyI6ZmFsc2UsInciOjUsIngiOjAsInkiOjB9LHsiaCI6NSwiaSI6Im1lcm1haWQiLCJtb3ZlZCI6ZmFsc2UsInN0YXRpYyI6ZmFsc2UsInciOjcsIngiOjUsInkiOjB9XSwicHJvcHMiOnsiY29scyI6MTIsImNvbnRhaW5lclBhZGRpbmciOls1LDVdLCJtYXJnaW4iOlsxMCwyMF0sInJvd0hlaWdodCI6MTAwfX19fSwibWV0YWZyYW1lcyI6eyJjbGljayI6eyJpbnB1dHMiOlt7Im1ldGFmcmFtZSI6Im1lcm1haWQiLCJzb3VyY2UiOiJjbGljayIsInRhcmdldCI6InRleHQifV0sInVybCI6Imh0dHBzOi8vZWRpdG9yLm10Zm0uaW8vIz9vcHRpb25zPWV5Sm9hV1JsYldWdWRXbG1hV1p5WVcxbElqcDBjblZsTENKdGIyUmxJam9pYzJnaUxDSnpZWFpsYkc5aFpHbHVhR0Z6YUNJNlptRnNjMlVzSW5Sb1pXMWxJam9pYkdsbmFIUWlmUT09In0sImNvZGUvanNvbi1lZGl0b3IiOnsidXJsIjoiaHR0cHM6Ly9lZGl0b3IubXRmbS5pby8jP29wdGlvbnM9ZXlKb2FXUmxiV1Z1ZFdsbWFXWnlZVzFsSWpwMGNuVmxMQ0p0YjJSbElqb2ljMmdpTENKellYWmxiRzloWkdsdWFHRnphQ0k2ZEhKMVpTd2lkR2hsYldVaU9pSnNhV2RvZENKOSZ0ZXh0PVozSmhjR2dnVkVRS0lDQkJXME5vY21semRHMWhjMTBnTFMwK2ZFZGxkQ0J0YjI1bGVYd2dRaWhIYnlCemFHOXdjR2x1WnlrS0lDQkNJQzB0UGlCRGUweGxkQ0J0WlNCMGFHbHVhMzBLSUNCRElDMHRQbnhQYm1WOElFUmJUR0Z3ZEc5d1hRb2dJRU1nTFMwK2ZGUjNiM3dnUlZ0cFVHaHZibVZkQ2lBZ1F5QXRMVDU4VkdoeVpXVjhJRVpiWm1FNlptRXRZMkZ5SUVOaGNsMEtJQ0JqYkdsamF5QkJJR2hoYm1Sc1pVTnNhV05yQ2lBZ1kyeHBZMnNnUWlCb1lXNWtiR1ZEYkdsamF3b2dJR05zYVdOcklFTWdhR0Z1Wkd4bFEyeHBZMnNLSUNCamJHbGpheUJFSUdoaGJtUnNaVU5zYVdOckNpQWdZMnhwWTJzZ1JTQm9ZVzVrYkdWRGJHbGphd29KQ1E9PSJ9LCJtZXJtYWlkIjp7ImlucHV0cyI6W3sibWV0YWZyYW1lIjoiY29kZS9qc29uLWVkaXRvciIsInNvdXJjZSI6InRleHQiLCJ0YXJnZXQiOiJtZXJtYWlkIn1dLCJ1cmwiOiJodHRwczovL21lcm1haWQubXRmbS5pby8jP2hpZGVtZW51PXRydWUmb3B0aW9ucz1leUpwYm5acGMybGliR1ZOWlc1MVYyaGxia2hwWkdSbGJpSTZkSEoxWlgwPSJ9fSwicGx1Z2lucyI6WyJodHRwczovL21lcm1haWQubXRmbS5pby8jP2hpZGVtZW51PXRydWUmb3B0aW9ucz1leUpwYm5acGMybGliR1ZOWlc1MVYyaGxia2hwWkdSbGJpSTZkSEoxWlgwPSIsImh0dHBzOi8vZWRpdG9yLm10Zm0uaW8vIz9vcHRpb25zPWV5SnRiMlJsSWpvaWFuTnZiaUlzSW5OaGRtVnNiMkZrYVc1b1lYTm9JanBtWVd4elpTd2lkR2hsYldVaU9pSjJjeTFrWVhKckluMD0iXSwidmVyc2lvbiI6IjAuMyJ9)

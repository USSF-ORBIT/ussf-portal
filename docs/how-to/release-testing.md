# Steps for approving a release from staging to production

We release at the end of each iteration, typically, which is a two-week cycle. At the end of the iteration someone will create a release PR as described in [our release](./releasing.md) documentation. Approval of that release should include Accessiblity and NIPR testing. This doc aims to document the steps we typically take.

## Accessibility testing

This can be performed on our development server before the release PR is approved. This checklist is repeated in the release PR template for reference. Alternatively, this can be tested on staging with confirmation in slack approving the release.

- Performed [a11y testing](https://github.com/trussworks/accessibility/blob/master/sample_a11y_testing_process.md):
  - [ ] Checked responsiveness in mobile, tablet, and desktop
  - [ ] Checked keyboard navigability
  - [ ] Tested with [VoiceOver](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts) in Safari
  - [ ] Checked VO's [rotor menu](https://github.com/trussworks/accessibility/blob/master/README.md#how-to-use-the-rotor-menu) for landmarks, page heading structure and links
  - [ ] Used a browser a11y tool to check for issues (WAVE, axe, ANDI or Accessibility addon tab for Storybook)

## NIPRnet testing

This is an important step to ensure folks using the portal on NIPRnet can access it succesfully. This will need to be done by someone with access to a NIPR machine, typically our COR.

- Run through testing:
  - [ ] On NIPR in MSEdge
  - [ ] On NIPR in Firefox
  - [ ] On NIPR in Chrome
  - [ ] On NIPR in Safari, if possible

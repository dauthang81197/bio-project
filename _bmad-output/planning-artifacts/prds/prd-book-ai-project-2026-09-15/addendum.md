# Technical Constraints

- User-requested frontend technology: Next.js, refining the initial ReactJS requirement.
- User-requested backend technology: NestJS, refining the initial Node.js requirement.
- User-requested payment provider: PayPal.

Architecture and integration details have not yet been decided.

## Email Attachment Feasibility

Current user decision: send a Google Drive link or another owner-supplied download URL in the delivery email. Direct attachment delivery is superseded. The first release does not require a custom protected-download mechanism, expiration, download limits, or automated Google Drive integration. Further delivery improvements will be considered later. No email provider or exclusive file storage service has been selected.

Checked on 2026-09-15 after the owner confirmed PDFs up to approximately 100 MB.

- Amazon SES supports a total message size up to 40 MB, including attachments: https://docs.aws.amazon.com/ses/latest/dg/attachments.html
- Gmail documents replacing attachments over its applicable sending limit with a Google Drive link: https://support.google.com/mail/answer/6584?hl=en-uk
- Google documents higher Enterprise Plus limits of 50 MB attachments for sending and 70 MB total incoming messages: https://workspaceupdates.googleblog.com/2026/02/ending-larger-attachments-in-gmail-new-50MB-limit-for-Enterprise-Plus.html

Inference: direct attachment delivery of a 100 MB PDF cannot serve the intended general email audience reliably.

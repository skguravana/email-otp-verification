# email-otp-verification
This project is a simple OTP (One-Time Password) Email Verification System built with Node.js, Express.js, HTML, CSS, and JavaScript. It allows users to verify their email addresses by sending a 4-digit OTP to their email and validating it.

#Features\n
  Validate email input format.
  Generate and send OTP via email using NodeMailer.
  Verify the OTP entered by the user.
  OTP expires after 60 seconds for security.
Project Structure
  index.html: Frontend for email input and OTP verification interface.
  script.js: Handles frontend logic like input validation, OTP navigation, and API calls.
  server.js: Backend server to handle OTP generation, email sending, and verification.
Prerequisites
  Node.js and npm installed on your system.
  A Gmail account for sending OTPs (used with NodeMailer).
  Install required Node.js packages.

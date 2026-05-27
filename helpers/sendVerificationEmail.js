await resend.emails.send({
  from: "onboarding@resend.dev",

  to: user.email,

  subject: "Reset Password",

  html: `
    <a href="${process.env.NEXTAUTH_URL}/reset-password/${resetToken}">
      Reset Password
    </a>
  `,
});
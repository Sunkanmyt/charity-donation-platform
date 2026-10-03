const verifyAccountEmail = ({ firstName, verificationUrl }) => {
  return {
    subject: "Verify Your Hope Share Platform Account",

    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Verify Your Account</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #1f2937;
        ">

          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background-color: #f4f7fb; margin: 0; padding: 32px 16px;"
          >
            <tr>
              <td align="center">

                <!-- Main Container -->
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td
                      style="
                        background-color: #111827;
                        padding: 30px 32px;
                        text-align: center;
                      "
                    >
                      <div style="
                        font-size: 22px;
                        font-weight: 700;
                        color: #ffffff;
                        letter-spacing: -0.3px;
                      ">
                        Hope Share Platform
                      </div>

                      <div style="
                        margin-top: 8px;
                        font-size: 13px;
                        color: #cbd5e1;
                      ">
                        Secure account verification
                      </div>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 36px 32px;">

                      <!-- Verification Icon -->
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        align="center"
                        style="margin-bottom: 24px;"
                      >
                        <tr>
                          <td
                            align="center"
                            valign="middle"
                            width="64"
                            height="64"
                            style="
                              width: 64px;
                              height: 64px;
                              background-color: #ecfdf5;
                              border-radius: 50%;
                              color: #059669;
                              font-size: 28px;
                              font-weight: bold;
                            "
                          >
                            ✓
                          </td>
                        </tr>
                      </table>

                      <!-- Heading -->
                      <h1 style="
                        margin: 0 0 14px;
                        text-align: center;
                        font-size: 28px;
                        line-height: 36px;
                        color: #111827;
                        font-weight: 700;
                      ">
                        Verify your email address
                      </h1>

                      <p style="
                        margin: 0 0 24px;
                        text-align: center;
                        font-size: 16px;
                        line-height: 26px;
                        color: #6b7280;
                      ">
                        Hi ${firstName}, welcome to
                        <strong style="color: #111827;">
                          Hope Share Platform
                        </strong>.
                      </p>

                      <p style="
                        margin: 0 0 28px;
                        font-size: 15px;
                        line-height: 26px;
                        color: #4b5563;
                      ">
                        Thank you for creating an account with us. To complete
                        your registration and keep your account secure, please
                        confirm that this email address belongs to you.
                      </p>

                      <!-- CTA -->
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="margin: 0 0 28px;"
                      >
                        <tr>
                          <td align="center">

                            <a
                              href="${verificationUrl}"
                              target="_blank"
                              style="
                                display: inline-block;
                                background-color: #111827;
                                color: #ffffff;
                                text-decoration: none;
                                font-size: 15px;
                                font-weight: 700;
                                padding: 15px 30px;
                                border-radius: 10px;
                                line-height: 20px;
                              "
                            >
                              Verify My Account &nbsp; →
                            </a>

                          </td>
                        </tr>
                      </table>

                      <!-- Expiry Notice -->
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                          background-color: #fffbeb;
                          border: 1px solid #fde68a;
                          border-radius: 10px;
                          margin-bottom: 28px;
                        "
                      >
                        <tr>
                          <td style="padding: 16px 18px;">

                            <p style="
                              margin: 0;
                              font-size: 13px;
                              line-height: 21px;
                              color: #92400e;
                            ">
                              <strong>Security notice:</strong>
                              This verification link is temporary and will
                              expire after 24 hours. For your security, do not
                              share this link with anyone.
                            </p>

                          </td>
                        </tr>
                      </table>

                      <!-- Alternative Link -->
                      <p style="
                        margin: 0 0 10px;
                        font-size: 13px;
                        line-height: 20px;
                        color: #6b7280;
                      ">
                        If the button above does not work, copy and paste the
                        following link into your browser:
                      </p>

                      <div style="
                        padding: 14px;
                        background-color: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        word-break: break-all;
                      ">
                        <a
                          href="${verificationUrl}"
                          target="_blank"
                          style="
                            color: #2563eb;
                            text-decoration: none;
                            font-size: 12px;
                            line-height: 19px;
                          "
                        >
                          ${verificationUrl}
                        </a>
                      </div>

                      <p style="
                        margin: 28px 0 0;
                        font-size: 13px;
                        line-height: 21px;
                        color: #9ca3af;
                      ">
                        If you did not create an account with Hope Share
                        Platform, you can safely ignore this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      style="
                        padding: 24px 32px;
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                      "
                    >
                      <p style="
                        margin: 0 0 8px;
                        font-size: 12px;
                        color: #6b7280;
                      ">
                        This is an automated email. Please do not reply.
                      </p>

                      <p style="
                        margin: 0;
                        font-size: 11px;
                        color: #9ca3af;
                      ">
                        © ${new Date().getFullYear()} Hope Share Platform.
                        All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
      </html>
    `,
  };
};

module.exports = verifyAccountEmail;

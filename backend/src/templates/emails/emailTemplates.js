const emailTemplates = {
  // 1. New Login Alert
  loginAlert: (firstName, time) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Login Alert</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f7f9;
        font-family: Arial, Helvetica, sans-serif;
        color: #17202a;
      ">
        <div style="
          width: 100%;
          padding: 40px 0;
          background-color: #f5f7f9;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e7ebef;
          ">

            <div style="
              padding: 24px 32px;
              background-color: #ffffff;
              border-bottom: 1px solid #edf0f2;
            ">
              <div style="
                font-size: 22px;
                font-weight: 700;
                color: #111827;
                letter-spacing: -0.5px;
              ">
                Hope Share Platform
              </div>
            </div>

            <div style="padding: 40px 32px;">

              <div style="
                width: 48px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                background-color: #eef6ff;
                border-radius: 12px;
                color: #2563eb;
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 24px;
              ">
                ↗
              </div>

              <h1 style="
                margin: 0 0 12px 0;
                font-size: 26px;
                line-height: 1.3;
                color: #111827;
                font-weight: 700;
              ">
                New login detected
              </h1>

              <p style="
                margin: 0 0 28px 0;
                font-size: 15px;
                line-height: 1.7;
                color: #59636e;
              ">
                Hi ${firstName}, we noticed a new login to your account.
              </p>

              <div style="
                background-color: #f8fafc;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 28px;
              ">
                <div style="
                  font-size: 11px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.8px;
                  color: #8a949e;
                  margin-bottom: 8px;
                ">
                  Login time
                </div>

                <div style="
                  font-size: 15px;
                  font-weight: 600;
                  color: #1f2937;
                ">
                  ${new Date(time).toLocaleString()}
                </div>
              </div>

              <p style="
                margin: 0 0 20px 0;
                font-size: 14px;
                line-height: 1.7;
                color: #59636e;
              ">
                If this login was made by you, no further action is required.
              </p>

              <div style="
                padding: 18px 20px;
                background-color: #fff8f1;
                border: 1px solid #fed7aa;
                border-radius: 10px;
              ">
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #9a3412;
                ">
                  <strong>Wasn't you?</strong><br />
                  Change your password immediately and contact our support team
                  if you believe your account has been compromised.
                </p>
              </div>

            </div>

            <div style="
              padding: 24px 32px;
              background-color: #fafafa;
              border-top: 1px solid #edf0f2;
            ">
              <p style="
                margin: 0 0 8px 0;
                font-size: 12px;
                line-height: 1.6;
                color: #8a949e;
              ">
                This is an automated security notification. Please do not reply
                to this email.
              </p>

              <p style="
                margin: 0;
                font-size: 12px;
                color: #a0a8b0;
              ">
                © ${new Date().getFullYear()} Hope Share Platform
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `,

  // 2. Profile Update
  profileUpdate: (firstName) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profile Updated</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f7f9;
        font-family: Arial, Helvetica, sans-serif;
        color: #17202a;
      ">
        <div style="
          width: 100%;
          padding: 40px 0;
          background-color: #f5f7f9;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e7ebef;
          ">

            <div style="
              padding: 24px 32px;
              background-color: #ffffff;
              border-bottom: 1px solid #edf0f2;
            ">
              <div style="
                font-size: 22px;
                font-weight: 700;
                color: #111827;
                letter-spacing: -0.5px;
              ">
                Hope Share Platform
              </div>
            </div>

            <div style="padding: 40px 32px;">

              <div style="
                width: 48px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                background-color: #ecfdf5;
                border-radius: 12px;
                color: #059669;
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 24px;
              ">
                ✓
              </div>

              <h1 style="
                margin: 0 0 12px 0;
                font-size: 26px;
                line-height: 1.3;
                color: #111827;
              ">
                Profile updated successfully
              </h1>

              <p style="
                margin: 0 0 28px 0;
                font-size: 15px;
                line-height: 1.7;
                color: #59636e;
              ">
                Hi ${firstName}, your account information has been successfully
                updated.
              </p>

              <div style="
                padding: 20px;
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 12px;
                margin-bottom: 24px;
              ">
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #166534;
                ">
                  Your profile changes have been saved successfully.
                  If you made these changes, no further action is required.
                </p>
              </div>

              <div style="
                padding: 18px 20px;
                background-color: #fff8f1;
                border: 1px solid #fed7aa;
                border-radius: 10px;
              ">
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #9a3412;
                ">
                  <strong>Didn't make these changes?</strong><br />
                  Please secure your account immediately and contact support.
                </p>
              </div>

            </div>

            <div style="
              padding: 24px 32px;
              background-color: #fafafa;
              border-top: 1px solid #edf0f2;
            ">
              <p style="
                margin: 0 0 8px 0;
                font-size: 12px;
                line-height: 1.6;
                color: #8a949e;
              ">
                This is an automated account notification. Please do not reply
                to this email.
              </p>

              <p style="
                margin: 0;
                font-size: 12px;
                color: #a0a8b0;
              ">
                © ${new Date().getFullYear()} Hope Share Platform
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `,

  // 3. Password Change
  passwordChange: (firstName) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Changed</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f7f9;
        font-family: Arial, Helvetica, sans-serif;
        color: #17202a;
      ">
        <div style="
          width: 100%;
          padding: 40px 0;
          background-color: #f5f7f9;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e7ebef;
          ">

            <div style="
              padding: 24px 32px;
              background-color: #ffffff;
              border-bottom: 1px solid #edf0f2;
            ">
              <div style="
                font-size: 22px;
                font-weight: 700;
                color: #111827;
                letter-spacing: -0.5px;
              ">
                Hope Share Platform
              </div>
            </div>

            <div style="padding: 40px 32px;">

              <div style="
                width: 48px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                background-color: #ecfdf5;
                border-radius: 12px;
                color: #059669;
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 24px;
              ">
                ✓
              </div>

              <h1 style="
                margin: 0 0 12px 0;
                font-size: 26px;
                line-height: 1.3;
                color: #111827;
              ">
                Password changed
              </h1>

              <p style="
                margin: 0 0 28px 0;
                font-size: 15px;
                line-height: 1.7;
                color: #59636e;
              ">
                Hi ${firstName}, your account password was successfully changed.
              </p>

              <div style="
                padding: 20px;
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 12px;
                margin-bottom: 24px;
              ">
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #166534;
                ">
                  <strong>Your password has been updated.</strong><br />
                  If you made this change, no further action is required.
                </p>
              </div>

              <div style="
                padding: 18px 20px;
                background-color: #fff8f1;
                border: 1px solid #fed7aa;
                border-radius: 10px;
              ">
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #9a3412;
                ">
                  <strong>Didn't change your password?</strong><br />
                  Use the password reset option on the login page immediately
                  or contact our support team.
                </p>
              </div>

            </div>

            <div style="
              padding: 24px 32px;
              background-color: #fafafa;
              border-top: 1px solid #edf0f2;
            ">
              <p style="
                margin: 0 0 8px 0;
                font-size: 12px;
                line-height: 1.6;
                color: #8a949e;
              ">
                This is an automated security notification. Please do not reply
                to this email.
              </p>

              <p style="
                margin: 0;
                font-size: 12px;
                color: #a0a8b0;
              ">
                © ${new Date().getFullYear()} Hope Share Platform
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `,

  // 4. Donation Confirmation
  donationConfirmation: (
    firstName,
    campaignTitle,
    amount,
    donationId,
    donationDate = new Date(),
  ) => {
    const formattedDate = new Date(donationDate).toLocaleString();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Donation Successful</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f5f7f9;
          font-family: Arial, Helvetica, sans-serif;
          color: #17202a;
        ">

          <div style="
            width: 100%;
            padding: 40px 0;
            background-color: #f5f7f9;
          ">

            <div style="
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid #e7ebef;
            ">

              <!-- Header -->
              <div style="
                padding: 24px 32px;
                background-color: #ffffff;
                border-bottom: 1px solid #edf0f2;
              ">
                <div style="
                  font-size: 22px;
                  font-weight: 700;
                  color: #111827;
                  letter-spacing: -0.5px;
                ">
                  Hope Share Platform
                </div>
              </div>

              <!-- Content -->
              <div style="padding: 40px 32px;">

                <!-- Success Icon -->
                <div style="
                  width: 48px;
                  height: 48px;
                  line-height: 48px;
                  text-align: center;
                  background-color: #ecfdf5;
                  border-radius: 12px;
                  color: #059669;
                  font-size: 22px;
                  font-weight: 700;
                  margin-bottom: 24px;
                ">
                  ✓
                </div>

                <!-- Heading -->
                <h1 style="
                  margin: 0 0 12px 0;
                  font-size: 26px;
                  line-height: 1.3;
                  color: #111827;
                  font-weight: 700;
                ">
                  Donation successful
                </h1>

                <!-- Introduction -->
                <p style="
                  margin: 0 0 28px 0;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #59636e;
                ">
                  Hi ${firstName}, thank you for your generous donation.
                  Your contribution has been successfully recorded.
                </p>

                <!-- Donation Details -->
                <div style="
                  background-color: #f8fafc;
                  border: 1px solid #e5e7eb;
                  border-radius: 12px;
                  padding: 20px;
                  margin-bottom: 28px;
                ">

                  <div style="
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #8a949e;
                    margin-bottom: 8px;
                  ">
                    Donation details
                  </div>

                  <div style="
                    font-size: 18px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 16px;
                  ">
                    ${campaignTitle}
                  </div>

                  <!-- Amount -->
                  <div style="
                    border-top: 1px solid #e5e7eb;
                    padding-top: 14px;
                  ">
                    <div style="
                      font-size: 13px;
                      color: #8a949e;
                      margin-bottom: 4px;
                    ">
                      Amount donated
                    </div>

                    <div style="
                      font-size: 24px;
                      font-weight: 700;
                      color: #059669;
                    ">
                      ₦${Number(amount).toLocaleString("en-NG")}
                    </div>
                  </div>

                  <!-- Date -->
                  <div style="
                    margin-top: 18px;
                    padding-top: 14px;
                    border-top: 1px solid #e5e7eb;
                  ">
                    <div style="
                      font-size: 13px;
                      color: #8a949e;
                      margin-bottom: 4px;
                    ">
                      Date
                    </div>

                    <div style="
                      font-size: 14px;
                      font-weight: 600;
                      color: #1f2937;
                    ">
                      ${formattedDate}
                    </div>
                  </div>

                  <!-- Reference -->
                  <div style="
                    margin-top: 18px;
                    padding-top: 14px;
                    border-top: 1px solid #e5e7eb;
                  ">
                    <div style="
                      font-size: 13px;
                      color: #8a949e;
                      margin-bottom: 4px;
                    ">
                      Donation reference
                    </div>

                    <div style="
                      font-size: 13px;
                      font-weight: 600;
                      color: #1f2937;
                      word-break: break-all;
                    ">
                      ${donationId}
                    </div>
                  </div>

                </div>

                <!-- Success Message -->
                <div style="
                  padding: 20px;
                  background-color: #f0fdf4;
                  border: 1px solid #bbf7d0;
                  border-radius: 12px;
                  margin-bottom: 24px;
                ">
                  <p style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #166534;
                  ">
                    Your donation has been recorded successfully.
                    Thank you for supporting this campaign and helping
                    make a difference.
                  </p>
                </div>

                <!-- Security / Support Note -->
                <p style="
                  margin: 0;
                  font-size: 13px;
                  line-height: 1.6;
                  color: #8a949e;
                ">
                  Please keep this email for your records. If you did not
                  make this donation, please contact our support team
                  immediately.
                </p>

              </div>

              <!-- Footer -->
              <div style="
                padding: 24px 32px;
                background-color: #fafafa;
                border-top: 1px solid #edf0f2;
              ">

                <p style="
                  margin: 0 0 8px 0;
                  font-size: 12px;
                  line-height: 1.6;
                  color: #8a949e;
                ">
                  This is an automated donation confirmation.
                  Please do not reply to this email.
                </p>

                <p style="
                  margin: 0;
                  font-size: 12px;
                  color: #a0a8b0;
                ">
                  © ${new Date().getFullYear()} Hope Share Platform
                </p>

              </div>

            </div>
          </div>

        </body>
      </html>
    `;
  },
};

module.exports = emailTemplates;

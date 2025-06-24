import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as TeeBoxLogo } from "../../../assets/teebox.svg";
import Link from "@mui/material/Link";

export const Footer = () => {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"privacy" | "terms" | null>(
    null
  );

  const handleOpen = (type: "privacy" | "terms") => {
    setModalContent(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalContent(null);
  };

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#181e29", color: "common.white", py: 8 }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          justifyContent="center"
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": {
                    width: "100%",
                    height: "100%",
                    display: "block",
                    "& path": {
                      fill: "white",
                    },
                  },
                }}
              >
                <TeeBoxLogo />
              </Box>
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 700, textAlign: "center" }}
              >
                TEE BOX League
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "grey.400",
                mb: 2,
                maxWidth: "28rem",
                textAlign: "center",
              }}
            >
              The ultimate league App.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-end" },
              justifyContent: "flex-start",
            }}
          >
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <li style={{ marginBottom: 8 }}>
                <span
                  style={{
                    color: "#a3a3c2",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen("privacy")}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#4ade80")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#a3a3c2")}
                >
                  Privacy Policy
                </span>
              </li>
              <li style={{ marginBottom: 8 }}>
                <span
                  style={{
                    color: "#a3a3c2",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen("terms")}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#4ade80")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#a3a3c2")}
                >
                  Terms of Service
                </span>
              </li>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "grey.800",
            mt: 6,
            pt: 4,
            textAlign: "center",
            color: "grey.400",
          }}
        >
          <Typography>
            © {new Date().getFullYear()} TEE BOX League. All rights reserved.
            Brilliant Minds Inc powered by Big Mkt Inc.
          </Typography>
        </Box>
      </Container>
      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {modalContent === "privacy" ? "Privacy Policy" : "Terms of Service"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {modalContent === "privacy" ? (
            <>
              <Typography variant="h6" gutterBottom>
                Privacy Policy
              </Typography>
              <Typography gutterBottom>
                Brilliant Minds built the TEE BOX League app as a commercial
                app. This Privacy Policy outlines our practices regarding the
                collection, use, and disclosure of personal information for
                users of the TEE BOX League app and related services
                ("Service"). By using the Service, you agree to the terms of
                this Privacy Policy.
              </Typography>
              <ol style={{ paddingLeft: 20 }}>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Definitions
                  </Typography>
                  <Typography gutterBottom>
                    "Service" refers to the TEE BOX League app and any related
                    websites or applications operated by Brilliant Minds.
                    <br />
                    "Personal Information" means any data that identifies or can
                    be used to identify an individual, such as name, email
                    address, or device ID.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Information We Collect
                  </Typography>
                  <ul>
                    <li>
                      Device and usage data (IP address, OS version, device
                      model, etc.)
                    </li>
                    <li>Location data (with user consent)</li>
                    <li>Cookies and similar technologies</li>
                    <li>Log Data (e.g., errors, app usage statistics)</li>
                    <li>
                      Account data when linking to third-party services (e.g.,
                      Google or Facebook)
                    </li>
                  </ul>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    How We Use Your Information
                  </Typography>
                  <ul>
                    <li>Account setup and management</li>
                    <li>
                      Communication of updates, features, and promotional
                      material
                    </li>
                    <li>Displaying targeted advertising and content</li>
                    <li>Responding to support inquiries and feedback</li>
                    <li>Analytics and improving the Service</li>
                    <li>Legal compliance and enforcement</li>
                  </ul>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    User Rights
                  </Typography>
                  <Typography gutterBottom>
                    Users in certain jurisdictions (e.g., California, EU) have
                    rights to:
                  </Typography>
                  <ul>
                    <li>Request access to personal data</li>
                    <li>Update or correct data</li>
                    <li>Request deletion of personal data</li>
                    <li>
                      Opt out of marketing communications and certain data uses
                    </li>
                  </ul>
                  <Typography gutterBottom>
                    To exercise these rights, email{" "}
                    <Link
                      href="mailto:info@brilliantmindsinc.net"
                      underline="hover"
                      sx={{
                        color: "#a3a3c2",
                        fontWeight: 500,
                        transition: "color 0.2s",
                        "&:hover": { color: "#4ade80" },
                      }}
                    >
                      info@brilliantmindsinc.net
                    </Link>
                    . We will respond within 30 days.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Data Retention
                  </Typography>
                  <Typography gutterBottom>
                    We retain your personal data only as long as necessary to
                    provide the Service or comply with legal obligations.
                    Anonymized data may be retained for analytics purposes.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Cookies
                  </Typography>
                  <Typography gutterBottom>
                    We use cookies and similar technologies for functionality
                    and analytics. Users can control cookie settings through
                    their browser preferences.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Security
                  </Typography>
                  <Typography gutterBottom>
                    We implement commercially reasonable measures to protect
                    personal data, including encryption, secure servers, and
                    access controls. No method is 100% secure, and we cannot
                    guarantee absolute protection.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Service Providers
                  </Typography>
                  <Typography gutterBottom>
                    We may share data with third-party vendors performing
                    services on our behalf, such as analytics, hosting, and
                    support. These vendors are contractually obligated to use
                    data solely for service provision.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Links to Other Sites
                  </Typography>
                  <Typography gutterBottom>
                    Our Service may contain links to third-party websites. We
                    are not responsible for the content or privacy practices of
                    those sites. Please review their policies before interacting
                    with them.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Children's Privacy
                  </Typography>
                  <Typography gutterBottom>
                    We do not knowingly collect data from children under 13. If
                    you become aware that a child has provided us with personal
                    data, please contact us so we can delete it promptly.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    International Data Transfers
                  </Typography>
                  <Typography gutterBottom>
                    If you are accessing the Service from outside the U.S., you
                    understand that your data may be processed in the U.S. and
                    other countries with different data protection laws.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Updates to This Privacy Policy
                  </Typography>
                  <Typography gutterBottom>
                    We may update this Privacy Policy periodically. Changes will
                    be posted on this page and effective immediately upon
                    posting. Continued use of the Service constitutes acceptance
                    of the revised policy.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Contact Us
                  </Typography>
                  <Typography gutterBottom>
                    For questions or concerns, please contact us at{" "}
                    <Link
                      href="mailto:info@brilliantmindsinc.net"
                      underline="hover"
                      sx={{
                        color: "#a3a3c2",
                        fontWeight: 500,
                        transition: "color 0.2s",
                        "&:hover": { color: "#4ade80" },
                      }}
                    >
                      info@brilliantmindsinc.net
                    </Link>
                    .
                  </Typography>
                </li>
              </ol>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Terms & Conditions
              </Typography>
              <Typography gutterBottom>
                Welcome to the TEE BOX League app ("App"), owned and operated by
                Brilliant Minds. These Terms & Conditions ("Terms") govern your
                use of our App and services ("Service"). By using the Service,
                you agree to these Terms. If you do not agree, please do not use
                the Service.
              </Typography>
              <ol style={{ paddingLeft: 20 }}>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Use of the Service
                  </Typography>
                  <Typography gutterBottom>
                    You agree to use the Service only for lawful purposes and in
                    accordance with these Terms. You are responsible for any
                    activity that occurs under your account.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    User Accounts
                  </Typography>
                  <Typography gutterBottom>
                    To use certain features, you must create an account. You
                    agree to provide accurate information and maintain the
                    security of your account credentials.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Eligibility
                  </Typography>
                  <Typography gutterBottom>
                    You must be at least 13 years old to use the Service. If you
                    are under 18, you must have permission from a parent or
                    legal guardian.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Intellectual Property
                  </Typography>
                  <Typography gutterBottom>
                    All content, trademarks, and data on the App, including but
                    not limited to software, databases, text, graphics, icons,
                    and hyperlinks, are the property of or licensed to Brilliant
                    Minds and are protected by law.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    User Content
                  </Typography>
                  <Typography gutterBottom>
                    You may be allowed to post, upload, or transmit content. You
                    retain ownership of your content but grant us a license to
                    use it for operating and improving the Service.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Prohibited Activities
                  </Typography>
                  <ul>
                    <li>Use the Service for illegal purposes</li>
                    <li>Post harmful, offensive, or misleading content</li>
                    <li>Interfere with the Service's operation</li>
                    <li>Attempt to access other user accounts or data</li>
                  </ul>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Termination
                  </Typography>
                  <Typography gutterBottom>
                    We reserve the right to suspend or terminate your access to
                    the Service at our sole discretion, without notice, for
                    conduct that we believe violates these Terms.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Disclaimers
                  </Typography>
                  <Typography gutterBottom>
                    The Service is provided "as is" without warranties of any
                    kind. We do not guarantee the accuracy, reliability, or
                    availability of the Service at all times.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Limitation of Liability
                  </Typography>
                  <Typography gutterBottom>
                    To the fullest extent permitted by law, Brilliant Minds or
                    its affiliates shall not be liable for any indirect,
                    incidental, or consequential damages arising from your use
                    of the Service.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Indemnification
                  </Typography>
                  <Typography gutterBottom>
                    You agree to indemnify and hold harmless Brilliant Minds and
                    its affiliates from any claims, damages, or expenses arising
                    from your use of the Service or violation of these Terms.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Changes to Terms
                  </Typography>
                  <Typography gutterBottom>
                    We may update these Terms from time to time. Continued use
                    of the Service constitutes acceptance of the revised Terms.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Governing Law
                  </Typography>
                  <Typography gutterBottom>
                    These Terms are governed by the laws of the State of
                    California, without regard to conflict of law principles.
                  </Typography>
                </li>
                <li>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Contact Us
                  </Typography>
                  <Typography gutterBottom>
                    If you have any questions about these Terms, please contact
                    us at{" "}
                    <Link
                      href="mailto:info@brilliantmindsinc.net"
                      underline="hover"
                      sx={{
                        color: "#a3a3c2",
                        fontWeight: 500,
                        transition: "color 0.2s",
                        "&:hover": { color: "#4ade80" },
                      }}
                    >
                      info@brilliantmindsinc.net
                    </Link>
                    .
                  </Typography>
                </li>
              </ol>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

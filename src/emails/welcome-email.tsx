import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstname: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export const WelcomeEmail = ({
  userFirstname,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to GlamHunt! Your journey to stardom starts now.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`} // Assuming you have a logo file in /public
          width="170"
          height="50"
          alt="GlamHunt"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Congratulations and welcome to GlamHunt! Your profile is now live and visible to top brands, casting directors, and photographers from around the world. We're thrilled to have you as part of our community of talented models.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={`${baseUrl}/profile`}>
            View Your Profile
          </Button>
        </Section>
        <Text style={paragraph}>
          Here are a few tips to get started:
          <br />
          - Keep your portfolio updated with your latest work.
          <br />
          - Respond promptly to booking inquiries to build a great reputation.
          <br />
          - Explore our 'Discover' page to see other talent in the community.
        </Text>
        <Text style={paragraph}>
          Best of luck on your modeling journey!
          <br />
          The GlamHunt Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          GlamHunt, 123 Fashion Ave, Mumbai, India
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#ff4081',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

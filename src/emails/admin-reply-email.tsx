import {
  Body,
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

interface AdminReplyEmailProps {
  replyMessage: string;
  originalSubject: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export const AdminReplyEmail = ({
  replyMessage,
  originalSubject
}: AdminReplyEmailProps) => (
  <Html>
    <Head />
    <Preview>A reply from GlamHunt regarding your inquiry.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="170"
          height="50"
          alt="GlamHunt"
          style={logo}
        />
        <Text style={paragraph}>Hello,</Text>
        <Text style={paragraph}>
          Thank you for contacting GlamHunt. Here is a response regarding your inquiry: "{originalSubject}".
        </Text>
        <Section style={replySection}>
          <Text style={paragraph}>{replyMessage}</Text>
        </Section>
        <Text style={paragraph}>
          If you have any further questions, please feel free to reply to this email.
        </Text>
        <Text style={paragraph}>
          Best regards,
          <br />
          The GlamHunt Admin Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          GlamHunt, 123 Fashion Ave, Mumbai, India
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AdminReplyEmail;

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

const replySection = {
  backgroundColor: '#f2f3f3',
  border: '1px solid #e2e2e2',
  borderRadius: '4px',
  padding: '20px',
  margin: '20px 0',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

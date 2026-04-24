import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  project: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  project,
}) => (
  <div style={{
    fontFamily: 'sans-serif',
    color: '#1a1a2e',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #e94560',
    borderRadius: '12px'
  }}>
    <h2 style={{ color: '#e94560', borderBottom: '2px solid #e94560', paddingBottom: '10px' }}>New Mission Inquiry</h2>
    <p>You have received a new message from the Navrobotec contact form.</p>
    
    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
      <p style={{ margin: '5px 0' }}><strong>Name:</strong> {firstName} {lastName}</p>
      <p style={{ margin: '5px 0' }}><strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: '#e94560' }}>{email}</a></p>
    </div>

    <div style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
      <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>Project Details:</p>
      <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{project}</p>
    </div>

    <footer style={{ marginTop: '30px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
      © {new Date().getFullYear()} Navrobotec. All rights reserved.
    </footer>
  </div>
);

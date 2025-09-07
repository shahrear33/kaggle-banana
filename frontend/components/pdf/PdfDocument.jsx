import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = {
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff'
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2967FF',
    fontWeight: 'bold'
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666666'
  },
  certificateTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333333',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  labelColumn: {
    width: '30%',
    paddingRight: 10
  },
  valueColumn: {
    width: '70%',
    paddingLeft: 10
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5
  },
  value: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5
  },
  skillsContainer: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9'
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2967FF'
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5
  },
  skillBadge: {
    fontSize: 10,
    backgroundColor: '#e6eeff',
    padding: 4,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
    color: '#2967FF'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666'
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingHorizontal: 20
  },
  signatureColumn: {
    width: '45%',
    alignItems: 'center'
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    width: '100%',
    marginTop: 30,
    marginBottom: 5
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666666'
  }
};

function PdfDocument({ plan }) {
  // Check if there's at least one certificate to display
  if (!plan || plan.length === 0) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.header}>Certificate Not Available</Text>
        </Page>
      </Document>
    );
  }
  
  // Take the first certificate from the plan array
  const certificate = plan[0];
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Certificate of Achievement</Text>
        <Text style={styles.subheader}>TryShip Educational Platform</Text>
        
        {/* Certificate Title */}
        <Text style={styles.certificateTitle}>{certificate.name}</Text>
        
        {/* Main Content */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, marginBottom: 20, textAlign: 'center' }}>
            This is to certify that the bearer has successfully completed all requirements
            and demonstrated proficiency in the subject matter.
          </Text>
          
          {/* Certificate Info */}
          <View style={styles.infoContainer}>
            <View style={styles.labelColumn}>
              <Text style={styles.label}>Certificate ID:</Text>
              <Text style={styles.label}>Issue Date:</Text>
              <Text style={styles.label}>Valid Until:</Text>
            </View>
            <View style={styles.valueColumn}>
              <Text style={styles.value}>{certificate.entry_fee}</Text>
              <Text style={styles.value}>{certificate.best_time_to_visit}</Text>
              <Text style={styles.value}>Lifetime</Text>
            </View>
          </View>
          
          {/* Description */}
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Description:</Text>
            <Text style={{ fontSize: 12 }}>{certificate.description}</Text>
          </View>
          
          {/* Skills (hardcoded as example) */}
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsTitle}>Skills & Competencies</Text>
            <View style={styles.skillsRow}>
              <Text style={styles.skillBadge}>Web Development</Text>
              <Text style={styles.skillBadge}>React</Text>
              <Text style={styles.skillBadge}>JavaScript</Text>
              <Text style={styles.skillBadge}>Problem Solving</Text>
              <Text style={styles.skillBadge}>Communication</Text>
            </View>
          </View>
          
          {/* Signatures */}
          <View style={styles.signatureRow}>
            <View style={styles.signatureColumn}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Program Director</Text>
            </View>
            <View style={styles.signatureColumn}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Industry Partner</Text>
            </View>
          </View>
        </View>
        
        {/* Footer */}
        <Text style={styles.footer}>
          Issued on {currentDate} by TryShip Educational Platform • Certificate can be verified at tryship.edu/verify
        </Text>
      </Page>
    </Document>
  );
}

export default PdfDocument;
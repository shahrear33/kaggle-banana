"use client"
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import { Button } from '@/components/ui/components/button';
import { FaDownload } from 'react-icons/fa';


const PDFGenerator = ({ input, fileName = "Certificate" }) => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div className="flex-1">
      {isClient && 
        <PDFDownloadLink 
          document={<PdfDocument plan={input} />} 
          fileName={`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`}
          className="w-full"
        >
          {({ loading, error }) => {
            if (error) {
              console.error('PDF generation error:', error);
              return (
                <Button size="sm" variant="destructive" disabled className="w-full gap-2">
                  Error generating PDF
                </Button>
              );
            }
            
            return loading ? (
              <Button size="sm" variant="secondary" disabled className="w-full gap-2">
                Preparing PDF...
              </Button>
            ) : (
              <Button size="sm" variant="primary" className="w-full gap-2">
                <FaDownload className="mr-2" /> Download PDF
              </Button>
            );
          }}
        </PDFDownloadLink>
      }
    </div>
  );
};

export default PDFGenerator;






import React from 'react'
import CertificateComponent from '../../components/Certificate.jsx'

function Certificate() {
  return (
    <>
        <CertificateComponent
            recipientName="John Doe"
            programName="Professional Data Analysis Program"
            dateText="on this 5th day of December, 2025."
            directorName="OLUWAFUNMIKE ADEYEMI"
            instructorName="BENEDICT EMOEKABU"
            certificateId="RC2025DA6002"
            academyName="GritinAI"
        />
    </>
  )
}

export default Certificate
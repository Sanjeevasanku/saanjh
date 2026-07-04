const { patient, report } = require('../schema');
const ragClient = require('./ragClient');

function formatProfileDocument(patientDoc) {
    const age = patientDoc.birthDate
        ? Math.floor(
              (Date.now() - new Date(patientDoc.birthDate).getTime()) /
                  (365.25 * 24 * 60 * 60 * 1000)
          )
        : 'unknown';

    return [
        `Patient profile: ${patientDoc.name}`,
        `Gender: ${patientDoc.gender || 'N/A'}`,
        `Approximate age: ${age}`,
        `Blood group: ${patientDoc.bloodGroup || 'N/A'}`,
        `Phone: ${patientDoc.phoneNumber || 'N/A'}`,
        `Chronic conditions: ${(patientDoc.chronics || []).join(', ') || 'None recorded'}`,
    ].join('\n');
}

function formatReportDocument(reportDoc) {
    const date =
        reportDoc.valuesFromReport?.date ||
        (reportDoc.dateOfReport
            ? new Date(reportDoc.dateOfReport).toLocaleDateString()
            : 'Unknown date');

    const values = reportDoc.valuesFromReport
        ? Object.entries(reportDoc.valuesFromReport)
              .filter(([key]) => key !== 'medicalQuery')
              .map(([key, val]) => `${key}: ${val}`)
              .join('\n')
        : '';

    return [
        `Lab report dated ${date}`,
        `Severity: ${reportDoc.severity ?? 'N/A'}/10`,
        `Specialist recommended: ${reportDoc.specialistReq || 'N/A'}`,
        `Summary: ${reportDoc.summary || 'N/A'}`,
        `Possible diseases: ${(reportDoc.possibleDiseases || []).join(', ') || 'N/A'}`,
        `Precautions: ${(reportDoc.precations || []).join('; ') || 'N/A'}`,
        `Doctor notes: ${reportDoc.doctorNotes || 'None'}`,
        `Lab values:\n${values}`,
    ].join('\n');
}

async function buildDocumentsForPatient(patientId) {
    const patientDoc = await patient.findById(patientId);
    if (!patientDoc) {
        throw new Error('Patient not found');
    }

    const reports = await report
        .find({ patientId })
        .sort({ dateOfReport: -1 })
        .limit(10);

    const documents = [
        {
            docId: `profile_${patientId}`,
            text: formatProfileDocument(patientDoc),
            metadata: { type: 'profile' },
        },
    ];

    for (const r of reports) {
        documents.push({
            docId: `report_${r._id}`,
            text: formatReportDocument(r),
            metadata: { type: 'report', reportId: String(r._id) },
        });
    }

    return { patientDoc, documents };
}

async function indexPatient(patientId) {
    const { patientDoc, documents } = await buildDocumentsForPatient(patientId);
    return ragClient.indexDocuments(patientId, patientDoc.name, documents);
}

async function indexReport(patientId, reportDoc, patientName) {
    const documents = [
        {
            docId: `report_${reportDoc._id}`,
            text: formatReportDocument(reportDoc),
            metadata: { type: 'report', reportId: String(reportDoc._id) },
        },
    ];
    return ragClient.indexDocuments(patientId, patientName, documents);
}

module.exports = {
    indexPatient,
    indexReport,
    buildDocumentsForPatient,
    formatProfileDocument,
    formatReportDocument,
};

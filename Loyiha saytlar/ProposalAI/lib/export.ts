import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";
import type { ProposalContent } from "@/lib/validators";

type PdfDocument = InstanceType<typeof PDFDocument>;

export async function createProposalPdfBuffer(content: ProposalContent) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 48,
    bufferPages: true
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));

  const completed = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  renderPdfContent(doc, content);
  doc.end();

  return completed;
}

function renderPdfContent(doc: PdfDocument, content: ProposalContent) {
  doc.font("Helvetica-Bold").fontSize(22).fillColor("#0b1324").text(content.coverPage.title);
  doc.moveDown(0.6);
  doc.font("Helvetica").fontSize(11).fillColor("#334155").text(content.coverPage.projectDescription);
  doc.moveDown(1);

  writeSection(doc, "Executive Summary", [content.executiveSummary]);
  writeSection(doc, "Scope of Work", content.scopeOfWork.map((item) => `- ${item}`));
  writeSection(doc, "Deliverables", content.deliverables.map((item) => `- ${item}`));
  writeSection(doc, "Timeline", content.timeline.map((item) => `${item.title}: ${item.body ?? ""}`));
  writeSection(doc, "Pricing", content.pricing.map((item) => `${item.title}: ${item.body ?? ""}`));
  writeSection(doc, "Terms and Conditions", content.termsAndConditions.map((item) => `- ${item}`));

  doc.moveDown(1.2);
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#0b1324").text("Signature Section");
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(11).fillColor("#334155").text(`Company: ${content.signature.companyRepresentative}`);
  doc.text(`Client: ${content.signature.clientRepresentative}`);
}

function writeSection(doc: PdfDocument, title: string, lines: string[]) {
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#0b1324").text(title);
  doc.moveDown(0.35);
  doc.font("Helvetica").fontSize(11).fillColor("#334155");
  lines.forEach((line) => {
    doc.text(line, { indent: 8, lineGap: 3 });
  });
}

export async function createProposalDocxBuffer(content: ProposalContent) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: content.coverPage.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: content.coverPage.projectDescription,
            alignment: AlignmentType.CENTER
          }),
          heading("Executive Summary"),
          paragraph(content.executiveSummary),
          heading("Scope of Work"),
          ...content.scopeOfWork.map((item) => bullet(item)),
          heading("Deliverables"),
          ...content.deliverables.map((item) => bullet(item)),
          heading("Timeline"),
          ...content.timeline.map((item) => paragraph(`${item.title}: ${item.body ?? ""}`)),
          heading("Pricing"),
          ...content.pricing.map((item) => paragraph(`${item.title}: ${item.body ?? ""}`)),
          heading("Terms and Conditions"),
          ...content.termsAndConditions.map((item) => bullet(item)),
          heading("Signature Section"),
          paragraph(`Company: ${content.signature.companyRepresentative}`),
          paragraph(`Client: ${content.signature.clientRepresentative}`)
        ]
      }
    ]
  });

  return Packer.toBuffer(doc);
}

function heading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1
  });
}

function paragraph(text: string) {
  return new Paragraph({ text });
}

function bullet(text: string) {
  return new Paragraph({
    text,
    bullet: { level: 0 }
  });
}

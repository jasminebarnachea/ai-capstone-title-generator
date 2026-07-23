import type { SavedProject } from "@/types";

const clean = (value: string) => value.replace(/[\\()]/g, "\\$&").replace(/[–—]/g, "-").replace(/₱/g, "PHP ");
const wrap = (text: string, limit = 92) => text.split(/\s+/).filter(Boolean).reduce<string[]>((lines, word) => {
  const last = lines[lines.length - 1];
  if (!last) lines.push(word);
  else if (`${last} ${word}`.length <= limit) lines[lines.length - 1] = `${last} ${word}`;
  else lines.push(word);
  return lines;
}, []);

export function downloadProjectPdf(project: SavedProject) {
  const lines = [
    "CAPSTONEFORGE AI - PROJECT DRAFT",
    "",
    `TITLE: ${project.title}`,
    "",
    "DESCRIPTION",
    ...wrap(project.description),
    "",
    "PROBLEM ADDRESSED",
    ...wrap(project.problemAddressed),
    "",
    `TARGET USERS: ${project.targetUsers}`,
    `DIFFICULTY: ${project.difficulty}    TIMELINE: ${project.timeline}    BUDGET: ${project.budget}`,
    "",
    "CORE FEATURES",
    ...project.features.flatMap((feature) => wrap(`- ${feature}`)),
    "",
    "RECOMMENDED TECHNOLOGIES",
    ...wrap(project.technologies.join(", ")),
    "",
    "SCOPE",
    ...wrap(project.scope || "Review scope with your adviser."),
  ].slice(0, 55);
  const stream = ["BT", "/F1 10 Tf", "50 760 Td", "14 TL", ...lines.map((line, index) => `${index ? "T*" : ""} (${clean(line)}) Tj`), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 72) || "capstone-project"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

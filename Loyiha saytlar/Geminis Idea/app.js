const STORAGE_KEY = "proposalai.demo.state.v1";
const THEME_KEY = "proposalai.theme";
const planLimits = {
  free: 3,
  pro: Infinity,
  agency: Infinity
};

const blogPosts = [
  {
    title: "How to write proposals that convert",
    category: "Sales",
    readTime: "6 min read",
    excerpt: "A practical framework for pricing, scope, and positioning a premium service offer."
  },
  {
    title: "Why agencies need proposal version history",
    category: "Operations",
    readTime: "4 min read",
    excerpt: "Track revisions, reduce confusion, and keep every client approval in one place."
  },
  {
    title: "Building a SaaS billing flow with Stripe",
    category: "Engineering",
    readTime: "8 min read",
    excerpt: "Plan limits, customer portals, webhook sync, and entitlement checks done the right way."
  }
];

const landingPages = [
  { name: "Freelancer proposals", slug: "/freelancers", copy: "One-person business proposals with quick turnaround." },
  { name: "Agency packages", slug: "/agencies", copy: "Team-friendly sales documents with shared access." },
  { name: "Software projects", slug: "/software", copy: "Scope, milestones, and implementation plans." },
  { name: "Design retainers", slug: "/design", copy: "Premium creative packages and revision terms." },
  { name: "Marketing campaigns", slug: "/marketing", copy: "Strategy, deliverables, and KPI focused contracts." },
  { name: "Consulting offers", slug: "/consulting", copy: "Executive-style proposals for advisory services." }
];

const roadmap = [
  {
    title: "Foundation",
    body: "Next.js App Router, TypeScript, Tailwind, Prisma, env validation, auth layout, and shared UI tokens."
  },
  {
    title: "Core product",
    body: "Proposal creation, AI draft generation, version history, exports, and dashboard search."
  },
  {
    title: "Billing + access",
    body: "Stripe subscriptions, quota enforcement, customer portal, and team membership rules."
  },
  {
    title: "Scale",
    body: "Admin analytics, audits, background jobs, performance monitoring, SEO pages, and content growth."
  }
];

const initialSeed = [
  {
    id: crypto.randomUUID(),
    clientName: "Northwind Labs",
    companyName: "ProposalAI Studio",
    projectDescription: "Design and build a proposal workflow for a B2B sales team with branded documents, automation, and export tools.",
    budget: "$12,000",
    timeline: "6 weeks",
    servicesOffered: "Discovery workshop, UX strategy, proposal templates, export pipeline, QA",
    industry: "Software",
    tone: "Executive",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: "Sent",
    version: 1
  },
  {
    id: crypto.randomUUID(),
    clientName: "Studio Atlas",
    companyName: "ProposalAI Studio",
    projectDescription: "Create a premium retainer proposal for a design agency that needs a polished sales deck, pricing grid, and terms page.",
    budget: "$8,500",
    timeline: "4 weeks",
    servicesOffered: "Brand direction, proposal design system, content writing, responsive layout, export setup",
    industry: "Design",
    tone: "Premium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: "Draft",
    version: 1
  }
];

const sampleBrief = {
  clientName: "Northwind Labs",
  companyName: "ProposalAI Studio",
  projectDescription: "Build a premium SaaS experience for generating polished client proposals with AI, billing, export, and admin tools.",
  budget: "$15,000",
  timeline: "6 weeks",
  servicesOffered: "Product discovery, UX/UI design, front-end build, AI prompt design, billing integration, launch support",
  industry: "Software",
  tone: "Premium"
};

const state = {
  theme: "dark",
  plan: "free",
  proposals: [],
  exportCount: 0,
  editingId: null,
  search: ""
};

const dom = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  hydrateState();
  bindEvents();
  renderAll();
});

function cacheDom() {
  [
    "themeToggle",
    "themeIcon",
    "themeLabel",
    "proposalForm",
    "clientName",
    "companyName",
    "projectDescription",
    "budget",
    "timeline",
    "servicesOffered",
    "industry",
    "tone",
    "generateBtn",
    "fillSampleBtn",
    "fillSampleTop",
    "resetBtn",
    "pdfBtn",
    "docxBtn",
    "proposalPreview",
    "previewTitle",
    "historySearch",
    "historyCount",
    "historyList",
    "currentPlanLabel",
    "usageBadge",
    "usageFill",
    "usageNote",
    "statProposals",
    "statMonthlyUsage",
    "statClients",
    "statExports",
    "industryChart",
    "adminUsers",
    "adminTeams",
    "adminPaid",
    "adminMrr",
    "adminUsersTable",
    "blogList",
    "landingPages",
    "roadmap"
  ].forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function hydrateState() {
  const stored = readJson(STORAGE_KEY);
  const storedTheme = readStorage(THEME_KEY);

  state.theme = storedTheme === "light" ? "light" : "dark";
  state.plan = stored?.plan || "free";
  state.exportCount = stored?.exportCount || 0;
  state.proposals = Array.isArray(stored?.proposals) && stored.proposals.length ? stored.proposals : initialSeed;

  applyTheme(state.theme);
  syncForm(sampleBrief);
}

function bindEvents() {
  dom.themeToggle.addEventListener("click", toggleTheme);
  dom.proposalForm.addEventListener("submit", handleGenerate);
  dom.fillSampleBtn.addEventListener("click", () => syncForm(sampleBrief));
  dom.fillSampleTop.addEventListener("click", () => syncForm(sampleBrief));
  dom.resetBtn.addEventListener("click", resetForm);
  dom.historySearch.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderHistory();
  });
  dom.pdfBtn.addEventListener("click", () => {
    const proposal = getActiveProposal();
    if (proposal) {
      exportPdf(proposal);
    }
  });
  dom.docxBtn.addEventListener("click", () => {
    const proposal = getActiveProposal();
    if (proposal) {
      exportDocx(proposal);
    }
  });

  document.querySelectorAll(".plan-btn").forEach((button) => {
    button.addEventListener("click", () => setPlan(button.dataset.plan));
  });

  document.getElementById("proposalForm").querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener("input", updateLivePreview);
    input.addEventListener("change", updateLivePreview);
  });
}

function renderAll() {
  renderTheme();
  renderUsage();
  renderPreview(readFormValues());
  renderHistory();
  renderMetrics();
  renderIndustryChart();
  renderAdmin();
  renderBlog();
  renderLandingPages();
  renderRoadmap();
  updateGenerateButton();
  saveState();
}

function syncForm(brief) {
  dom.clientName.value = brief.clientName;
  dom.companyName.value = brief.companyName;
  dom.projectDescription.value = brief.projectDescription;
  dom.budget.value = brief.budget;
  dom.timeline.value = brief.timeline;
  dom.servicesOffered.value = brief.servicesOffered;
  dom.industry.value = brief.industry;
  dom.tone.value = brief.tone;
  dom.previewTitle.textContent = `${brief.clientName || "Northwind Labs"} Proposal`;
  updateLivePreview();
}

function resetForm() {
  state.editingId = null;
  dom.proposalForm.reset();
  syncForm({
    clientName: "",
    companyName: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    servicesOffered: "",
    industry: "Freelance",
    tone: "Premium"
  });
  updateGenerateButton();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme(state.theme);
  writeStorage(THEME_KEY, state.theme);
  renderTheme();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function renderTheme() {
  const isDark = state.theme === "dark";
  dom.themeIcon.textContent = isDark ? "◐" : "◑";
  dom.themeLabel.textContent = isDark ? "Dark mode" : "Light mode";
}

function setPlan(plan) {
  state.plan = plan;
  renderAll();
  notify(`Switched to ${capitalize(plan)} plan.`);
}

function handleGenerate(event) {
  event.preventDefault();

  const formData = readFormData();
  if (!formData) {
    return;
  }

  const isEditing = Boolean(state.editingId);
  if (!isEditing && exceedsFreeLimit()) {
    notify("Free plan limit reached. Upgrade to Pro or Agency to create more proposals.");
    return;
  }

  const proposal = buildProposal(formData, state.editingId);
  if (isEditing) {
    state.proposals = state.proposals.map((item) => (item.id === state.editingId ? proposal : item));
    notify(`Updated proposal for ${proposal.clientName}.`);
  } else {
    state.proposals = [proposal, ...state.proposals];
    state.editingId = proposal.id;
    notify(`Generated proposal for ${proposal.clientName}.`);
  }

  dom.previewTitle.textContent = `${proposal.clientName} Proposal`;
  renderAll();
  scrollToSection("dashboard");
}

function readFormData() {
  const data = readFormValues();

  if (!data.clientName || !data.companyName || !data.projectDescription || !data.budget || !data.timeline || !data.servicesOffered) {
    notify("Please fill in every required field before generating the proposal.");
    return null;
  }

  return data;
}

function buildProposal(formData, existingId) {
  const services = splitServices(formData.servicesOffered);
  const now = new Date().toISOString();
  return {
    id: existingId || crypto.randomUUID(),
    clientName: formData.clientName,
    companyName: formData.companyName,
    projectDescription: formData.projectDescription,
    budget: formData.budget,
    timeline: formData.timeline,
    servicesOffered: formData.servicesOffered,
    industry: formData.industry,
    tone: formData.tone,
    services,
    status: existingId ? "Updated" : "Draft",
    version: existingId ? getProposalById(existingId)?.version + 1 || 2 : 1,
    createdAt: existingId ? getProposalById(existingId)?.createdAt || now : now,
    updatedAt: now
  };
}

function splitServices(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProposalById(id) {
  return state.proposals.find((proposal) => proposal.id === id);
}

function getActiveProposal() {
  if (state.editingId) {
    return getProposalById(state.editingId);
  }
  return state.proposals[0];
}

function updateLivePreview() {
  const draft = readDraft();
  if (!draft.clientName) {
    dom.previewTitle.textContent = "Northwind Labs Proposal";
  } else {
    dom.previewTitle.textContent = `${draft.clientName} Proposal`;
  }
  renderPreview(draft);
  updateGenerateButton();
  renderUsage();
}

function readDraft() {
  return readFormValues();
}

function renderPreview(draft = null) {
  const hasDraft = draft && Object.values(draft).some((value) => String(value || "").trim().length > 0);
  const proposal = hasDraft ? buildPreviewProposal(draft) : buildPreviewProposal(sampleBrief);
  const services = proposal.services || splitServices(proposal.servicesOffered || "");

  dom.proposalPreview.innerHTML = `
    <section class="proposal-section proposal-hero">
      <div class="proposal-kicker">Cover Page</div>
      <h3>${escapeHtml(proposal.clientName)} x ${escapeHtml(proposal.companyName)}</h3>
      <p>${escapeHtml(proposal.projectDescription)}</p>
      <div class="proposal-meta">
        <div class="meta-card"><span>Budget</span><strong>${escapeHtml(proposal.budget)}</strong></div>
        <div class="meta-card"><span>Timeline</span><strong>${escapeHtml(proposal.timeline)}</strong></div>
        <div class="meta-card"><span>Industry</span><strong>${escapeHtml(proposal.industry)}</strong></div>
        <div class="meta-card"><span>Tone</span><strong>${escapeHtml(proposal.tone)}</strong></div>
      </div>
    </section>

    <section class="proposal-section">
      <h4>Executive Summary</h4>
      <p>${escapeHtml(getExecutiveSummary(proposal))}</p>
    </section>

    <section class="proposal-section">
      <h4>Scope of Work</h4>
      <ul>${services.map((service) => `<li>${escapeHtml(service)}</li>`).join("")}</ul>
    </section>

    <section class="proposal-section">
      <h4>Deliverables</h4>
      <ul>${getDeliverables(proposal).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>

    <section class="proposal-section">
      <h4>Timeline</h4>
      <ul>${getTimelineBreakdown(proposal).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>

    <section class="proposal-section">
      <h4>Pricing</h4>
      <p>${escapeHtml(getPricingCopy(proposal))}</p>
    </section>

    <section class="proposal-section">
      <h4>Terms and Conditions</h4>
      <ul>${getTerms(proposal).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>

    <section class="proposal-section proposal-signature">
      <h4>Signature Section</h4>
      <div class="signature-line">
        <div class="signature-rule"></div>
        <span>${escapeHtml(proposal.companyName)} Authorized Signature</span>
      </div>
      <div class="signature-line">
        <div class="signature-rule"></div>
        <span>${escapeHtml(proposal.clientName)} Approval</span>
      </div>
    </section>
  `;
}

function buildPreviewProposal(formData) {
  return {
    clientName: formData.clientName || "Northwind Labs",
    companyName: formData.companyName || "ProposalAI Studio",
    projectDescription: formData.projectDescription || sampleBrief.projectDescription,
    budget: formData.budget || sampleBrief.budget,
    timeline: formData.timeline || sampleBrief.timeline,
    servicesOffered: formData.servicesOffered || sampleBrief.servicesOffered,
    industry: formData.industry || sampleBrief.industry,
    tone: formData.tone || sampleBrief.tone,
    services: splitServices(formData.servicesOffered || sampleBrief.servicesOffered)
  };
}

function getExecutiveSummary(proposal) {
  return `ProposalAI will craft a ${proposal.tone.toLowerCase()} proposal for ${proposal.clientName} that frames the work around measurable outcomes, clear ownership, and a premium delivery experience for ${proposal.industry.toLowerCase()} clients.`;
}

function getDeliverables(proposal) {
  const base = splitServices(proposal.servicesOffered);
  return [
    "Cover page with client branding and project title",
    "Executive summary tailored to the client brief",
    "Scope breakdown for each service line",
    ...base.map((item) => `Deliverable package for ${item.toLowerCase()}`),
    "Signature-ready approval page"
  ];
}

function getTimelineBreakdown(proposal) {
  return [
    `Week 1: discovery, stakeholder alignment, and brief refinement for a ${proposal.timeline} engagement`,
    "Week 2: proposal strategy, structure, and pricing logic",
    "Week 3: revisions, formatting, and export preparation",
    "Final stage: review, approval, and signed delivery"
  ];
}

function getPricingCopy(proposal) {
  return `Estimated project value: ${proposal.budget}. ProposalAI recommends a 50% kickoff payment, 50% on delivery, and a 14-day review window to keep the scope predictable and premium.`;
}

function getTerms(proposal) {
  return [
    "Three revision rounds are included unless otherwise negotiated.",
    "Any additional requests outside scope are billed separately.",
    "Final assets are delivered after the agreed deposit is received.",
    `This proposal remains valid for 14 days from ${formatDate(new Date())}.`,
    `All work is delivered with a ${proposal.tone.toLowerCase()} presentation style and approval flow.`
  ];
}

function renderHistory() {
  const filtered = state.proposals.filter((proposal) => {
    const haystack = [
      proposal.clientName,
      proposal.companyName,
      proposal.projectDescription,
      proposal.servicesOffered,
      proposal.industry,
      proposal.status
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(state.search);
  });

  dom.historyCount.textContent = `${filtered.length} proposal${filtered.length === 1 ? "" : "s"}`;
  dom.historyList.innerHTML = filtered.length
    ? filtered.map((proposal) => renderHistoryItem(proposal)).join("")
    : `<div class="empty-state">No proposals match your search.</div>`;

  dom.historyList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const id = button.dataset.id;
      if (action === "edit") {
        loadProposalIntoForm(id);
      }
      if (action === "duplicate") {
        duplicateProposal(id);
      }
      if (action === "delete") {
        deleteProposal(id);
      }
      if (action === "pdf") {
        const proposal = getProposalById(id);
        if (proposal) exportPdf(proposal);
      }
      if (action === "docx") {
        const proposal = getProposalById(id);
        if (proposal) exportDocx(proposal);
      }
    });
  });
}

function renderHistoryItem(proposal) {
  return `
    <article class="history-item">
      <div class="history-top">
        <div class="history-title">
          <strong>${escapeHtml(proposal.clientName)}</strong>
          <span>${escapeHtml(proposal.companyName)} - ${escapeHtml(proposal.industry)}</span>
        </div>
        <span class="pill">${escapeHtml(proposal.status)}</span>
      </div>

      <p>${escapeHtml(proposal.projectDescription)}</p>

      <div class="history-meta">
        <span>Budget ${escapeHtml(proposal.budget)}</span>
        <span>Timeline ${escapeHtml(proposal.timeline)}</span>
        <span>Version ${proposal.version}</span>
        <span>${formatDate(proposal.updatedAt)}</span>
      </div>

      <div class="history-actions">
        <button class="btn btn-secondary mini" data-action="edit" data-id="${proposal.id}" type="button">Edit</button>
        <button class="btn btn-secondary mini" data-action="duplicate" data-id="${proposal.id}" type="button">Duplicate</button>
        <button class="btn btn-secondary mini" data-action="pdf" data-id="${proposal.id}" type="button">PDF</button>
        <button class="btn btn-secondary mini" data-action="docx" data-id="${proposal.id}" type="button">DOCX</button>
        <button class="btn btn-ghost mini" data-action="delete" data-id="${proposal.id}" type="button">Delete</button>
      </div>
    </article>
  `;
}

function loadProposalIntoForm(id) {
  const proposal = getProposalById(id);
  if (!proposal) {
    return;
  }

  state.editingId = proposal.id;
  dom.clientName.value = proposal.clientName;
  dom.companyName.value = proposal.companyName;
  dom.projectDescription.value = proposal.projectDescription;
  dom.budget.value = proposal.budget;
  dom.timeline.value = proposal.timeline;
  dom.servicesOffered.value = proposal.servicesOffered;
  dom.industry.value = proposal.industry;
  dom.tone.value = proposal.tone;
  dom.previewTitle.textContent = `${proposal.clientName} Proposal`;
  updateGenerateButton();
  renderPreview(buildPreviewProposal(proposal));
  notify(`Loaded ${proposal.clientName} for editing.`);
  scrollToSection("builder");
}

function duplicateProposal(id) {
  const proposal = getProposalById(id);
  if (!proposal) {
    return;
  }

  const copy = {
    ...proposal,
    id: crypto.randomUUID(),
    clientName: `${proposal.clientName} Copy`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    status: "Draft"
  };

  state.proposals = [copy, ...state.proposals];
  renderAll();
  notify(`Duplicated ${proposal.clientName}.`);
}

function deleteProposal(id) {
  const proposal = getProposalById(id);
  if (!proposal) {
    return;
  }

  state.proposals = state.proposals.filter((item) => item.id !== id);
  if (state.editingId === id) {
    state.editingId = null;
  }
  renderAll();
  notify(`Deleted ${proposal.clientName}.`);
}

function renderMetrics() {
  const total = state.proposals.length;
  const monthly = state.proposals.filter((proposal) => isThisMonth(proposal.createdAt)).length;
  const uniqueClients = new Set(state.proposals.map((proposal) => proposal.clientName.toLowerCase())).size;

  dom.statProposals.textContent = String(total);
  dom.statMonthlyUsage.textContent = String(monthly);
  dom.statClients.textContent = String(uniqueClients);
  dom.statExports.textContent = String(state.exportCount);
}

function renderUsage() {
  const monthly = state.proposals.filter((proposal) => isThisMonth(proposal.createdAt)).length;
  const limit = planLimits[state.plan];
  const quotaText = Number.isFinite(limit) ? `${monthly} / ${limit} this month` : "Unlimited proposals";
  const progress = Number.isFinite(limit) ? Math.min(100, Math.round((monthly / limit) * 100)) : 100;

  dom.currentPlanLabel.textContent = capitalize(state.plan);
  dom.usageBadge.textContent = quotaText;
  dom.usageFill.style.width = `${progress}%`;
  dom.usageNote.textContent = Number.isFinite(limit)
    ? `Free plan includes ${limit} proposals per month. Upgrade to Pro for unlimited proposals.`
    : state.plan === "agency"
      ? "Agency plan includes team access, admin controls, and shared workspace privileges."
      : "Pro plan unlocks unlimited proposals, exports, and premium features.";
}

function exceedsFreeLimit() {
  if (state.plan !== "free") {
    return false;
  }
  const monthly = state.proposals.filter((proposal) => isThisMonth(proposal.createdAt)).length;
  return monthly >= planLimits.free;
}

function updateGenerateButton() {
  const hasEdit = Boolean(state.editingId);
  dom.generateBtn.textContent = hasEdit ? "Update proposal" : "Generate proposal";
  dom.generateBtn.disabled = state.plan === "free" && !hasEdit && exceedsFreeLimit();
  dom.generateBtn.title = dom.generateBtn.disabled ? "Upgrade to Pro to create more proposals" : "";
}

function renderIndustryChart() {
  const counts = state.proposals.reduce((acc, proposal) => {
    acc[proposal.industry] = (acc[proposal.industry] || 0) + 1;
    return acc;
  }, {});

  const items = Object.entries(counts);
  dom.industryChart.innerHTML = items.length
    ? items
        .map(([industry, count]) => {
          const total = state.proposals.length || 1;
          const percent = Math.round((count / total) * 100);
          return `
            <div class="chart-row">
              <div class="chart-row-header">
                <strong>${escapeHtml(industry)}</strong>
                <small>${count} proposals</small>
              </div>
              <div class="chart-bar"><span style="width:${percent}%"></span></div>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-state">No proposal data yet.</div>`;
}

function renderAdmin() {
  const totalUsers = 24 + state.proposals.length;
  const teams = state.plan === "agency" ? 6 : 2;
  const paid = state.plan === "free" ? 8 : 18;
  const mrr = state.plan === "free" ? 420 : state.plan === "pro" ? 812 : 1260;

  dom.adminUsers.textContent = String(totalUsers);
  dom.adminTeams.textContent = String(teams);
  dom.adminPaid.textContent = String(paid);
  dom.adminMrr.textContent = `$${mrr.toLocaleString()}`;

  const users = [
    { name: "Amina Karimova", role: "Owner", plan: capitalize(state.plan), status: "Active" },
    { name: "Jon Cooper", role: "Admin", plan: "Pro", status: "Active" },
    { name: "Lina Ortiz", role: "Editor", plan: "Agency", status: "Active" },
    { name: "Maya Singh", role: "Viewer", plan: "Free", status: "Invited" }
  ];

  dom.adminUsersTable.innerHTML = users
    .map(
      (user) => `
        <div class="admin-user">
          <div class="admin-user-header">
            <strong>${escapeHtml(user.name)}</strong>
            <span class="pill">${escapeHtml(user.status)}</span>
          </div>
          <span>${escapeHtml(user.role)} - ${escapeHtml(user.plan)} plan</span>
        </div>
      `
    )
    .join("");
}

function renderBlog() {
  dom.blogList.innerHTML = blogPosts
    .map(
      (post) => `
        <article class="content-item">
          <div class="content-item-header">
            <strong>${escapeHtml(post.category)}</strong>
            <span>${escapeHtml(post.readTime)}</span>
          </div>
          <h4>${escapeHtml(post.title)}</h4>
          <p>${escapeHtml(post.excerpt)}</p>
        </article>
      `
    )
    .join("");
}

function renderLandingPages() {
  dom.landingPages.innerHTML = landingPages
    .map(
      (page) => `
        <article class="content-item">
          <div class="content-item-header">
            <strong>${escapeHtml(page.name)}</strong>
            <span>${escapeHtml(page.slug)}</span>
          </div>
          <p>${escapeHtml(page.copy)}</p>
        </article>
      `
    )
    .join("");
}

function renderRoadmap() {
  dom.roadmap.innerHTML = roadmap
    .map(
      (item, index) => `
        <article class="roadmap-item">
          <div class="pill">Phase ${index + 1}</div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `
    )
    .join("");
}

function exportPdf(proposal) {
  const jsPDF = window.jspdf?.jsPDF;
  if (!jsPDF) {
    notify("PDF export library did not load.");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const lines = proposalToText(proposal).split("\n");
  let y = 54;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ProposalAI", 40, y);
  y += 24;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Proposal for ${proposal.clientName}`, 40, y);
  y += 24;

  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 520);
    if (y + wrapped.length * 16 > 760) {
      doc.addPage();
      y = 54;
    }
    doc.text(wrapped, 40, y);
    y += wrapped.length * 16 + 8;
  });

  doc.save(`${slugify(proposal.clientName)}-proposal.pdf`);
  state.exportCount += 1;
  renderMetrics();
  saveState();
}

async function exportDocx(proposal) {
  const docxLib = window.docx;
  if (!docxLib) {
    notify("DOCX export library did not load.");
    return;
  }

  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docxLib;
  const children = [
    new Paragraph({ text: "ProposalAI", heading: HeadingLevel.TITLE }),
    new Paragraph({ text: `Proposal for ${proposal.clientName}`, heading: HeadingLevel.HEADING_1 })
  ];

  proposalToText(proposal)
    .split("\n")
    .filter(Boolean)
    .forEach((line) => {
      const isHeader = /^[A-Z][A-Za-z ]+:$/.test(line.trim());
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, bold: isHeader })]
        })
      );
    });

  const doc = new Document({
    sections: [{ children }]
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${slugify(proposal.clientName)}-proposal.docx`);
  state.exportCount += 1;
  renderMetrics();
  saveState();
}

function proposalToText(proposal) {
  return [
    "Cover Page:",
    `${proposal.clientName} x ${proposal.companyName}`,
    proposal.projectDescription,
    "",
    "Executive Summary:",
    getExecutiveSummary(proposal),
    "",
    "Scope of Work:",
    ...splitServices(proposal.servicesOffered).map((item) => `- ${item}`),
    "",
    "Deliverables:",
    ...getDeliverables(proposal).map((item) => `- ${item}`),
    "",
    "Timeline:",
    ...getTimelineBreakdown(proposal).map((item) => `- ${item}`),
    "",
    "Pricing:",
    getPricingCopy(proposal),
    "",
    "Terms and Conditions:",
    ...getTerms(proposal).map((item) => `- ${item}`),
    "",
    "Signature Section:",
    `${proposal.companyName} Authorized Signature`,
    `${proposal.clientName} Approval`
  ].join("\n");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function notify(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveState() {
  writeJson(STORAGE_KEY, {
    plan: state.plan,
    proposals: state.proposals,
    exportCount: state.exportCount
  });
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in private or restricted sessions.
  }
}

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in private or restricted sessions.
  }
}

function readFormValues() {
  return {
    clientName: dom.clientName.value.trim(),
    companyName: dom.companyName.value.trim(),
    projectDescription: dom.projectDescription.value.trim(),
    budget: dom.budget.value.trim(),
    timeline: dom.timeline.value.trim(),
    servicesOffered: dom.servicesOffered.value.trim(),
    industry: dom.industry.value,
    tone: dom.tone.value
  };
}

function isThisMonth(value) {
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

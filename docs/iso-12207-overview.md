# ISO/IEC/IEEE 12207 — Software Life Cycle Processes

Lookup notes for Factory engineering. Sources are official ISO / IEEE / IEC catalog and preview pages only.

---

## (1) Official title and number

**Current (active) edition**

- **ISO/IEC/IEEE 12207:2026** — *Systems and software engineering — Software life cycle processes*
- Edition **2**, published **2026-04** (IEEE published **2026-04-15**)
- Also cited as **IEEE/ISO/IEC 12207-2026**
- Status: **Published / Active** (ISO stage 60.60)
- Technical committee: [ISO/IEC JTC 1/SC 7](https://www.iso.org/committee/45086.html) (Software and systems engineering); IEEE C/S2ESC

**Prior edition (widely cited; now withdrawn / superseded)**

- **ISO/IEC/IEEE 12207:2017** — same title; Edition **1**, published **2017-11**
- Also cited as **IEEE/ISO/IEC 12207-2017**
- Status: **Withdrawn** on ISO; **Superseded** on IEEE SA (replaced by 12207:2026)
- 145 pages (ISO catalog)

Related companion (mapping only, not the main process standard):

- [ISO/IEC/IEEE 12207-2:2020](https://www.iso.org/standard/73446.html) — Part 2: relation/mapping between 12207:2017 and ISO/IEC 12207:2008

---

## (2) Where to access it (official URLs)

| Role | URL |
|------|-----|
| **ISO purchase / catalog (2026, current)** | https://www.iso.org/standard/90219.html |
| **ISO catalog (2017, withdrawn)** | https://www.iso.org/standard/63712.html |
| **ISO Online Browsing Platform (free preview)** | https://www.iso.org/obp/ui/ — open the standard from the catalog “Preview” / “Read sample” controls |
| **IEEE SA (2026, active)** | https://standards.ieee.org/ieee/12207/11416/ |
| **IEEE SA (2017, superseded)** | https://standards.ieee.org/ieee/12207/5672/ |
| **IEEE purchase (Accuris / IEEE store, 2026)** | https://store.accuristech.com/ieee/products/vendor_id/11416 |
| **IEEE Xplore (2017 metadata / paid PDF)** | https://ieeexplore.ieee.org/document/8100771 |
| **IEC preview sample (2026 PDF front matter + TOC)** | https://ocp-api.iec.ch/api/publications/113447/view?hasAccess=false&language=en&previewLanguage=en&media=PDF |

National adoptions (e.g. BS ISO/IEC/IEEE 12207) also sell the same text via ISO member bodies; prefer the ISO / IEEE / IEC links above as primary.

Aligned systems counterpart (often used with 12207): [ISO/IEC/IEEE 15288](https://www.iso.org/standard/81739.html) (system life cycle processes). 12207:2026 states process purposes/outcomes are aligned with ISO/IEC/IEEE 15288:2023.

---

## (3) Concise summary of core content and processes

### What the standard is

12207 is a **common framework of software life cycle processes**, with shared terminology for acquirers, suppliers, developers, operators, maintainers, and other stakeholders. It defines **processes → activities → tasks**, each with a stated **purpose** and required **outcomes**. It covers acquisition, supply, development, operation, maintenance, and disposal of software products/services (including firmware software), stand-alone or embedded/SoS contexts.

It is **not** a fixed waterfall methodology. Organizations choose a life cycle model (including agile) and **map** selected processes into stages. Processes may run **concurrently, iteratively, and recursively**. Normative **tailoring** is defined (Annex A in both 2017 and 2026). Documentation item formats are out of scope; see ISO/IEC/IEEE 15289 for information-item content.

### Document structure (2026)

From the official IEC preview TOC for ISO/IEC/IEEE 12207:2026:

1. Scope  
2. Normative references  
3. Terms, definitions and abbreviated terms  
4. Conformance (full conformance to outcomes or to tasks; tailored conformance)  
5. Key concepts and application (system/org/project concepts, life cycle stages/models, process concepts, process groups, iteration/recursion, process reference model)  
6. **Software life cycle processes** (the process catalog)  
- Annex A (normative) Tailoring process  
- Annexes B–E (informative): example information items, assessment PRM, MBSSE, assurance  

### Four process groups and full process list (2026)

Verified from the IEC official preview TOC for **ISO/IEC/IEEE 12207:2026**. The 2017 edition used the same four groups and nearly the same process set (notable rename: 2017 “System/Software requirements definition” / “Architecture Definition” → 2026 “System requirements definition” / “System architecture definition”).

#### 6.1 Agreement processes

Establish and fulfill agreements between organizations (or internal parties).

| Process | What it addresses (from name + official scope language) |
|---------|--------------------------------------------------------|
| **Acquisition** | Obtain a product or service that satisfies need — from defining need through acceptance |
| **Supply** | Provide a product or service that meets agreed requirements |

#### 6.2 Organizational project-enabling processes

Provide the organizational capability and resources that enable projects.

| Process | What it addresses |
|---------|-------------------|
| **Life cycle model management** | Define, maintain, and improve life cycle models/processes used by the organization |
| **Infrastructure management** | Provide and maintain facilities, tools, and IT/comms infrastructure |
| **Portfolio management** | Initiate, sustain, and redirect projects to meet organizational strategy |
| **Human resource management** | Provide skilled people and develop competencies |
| **Quality management** | Establish and improve quality assurance/management across the organization |
| **Knowledge management** | Capture, maintain, and reuse knowledge and assets |

#### 6.3 Technical management processes

Manage the technical work of a project (planning through quality assurance).

| Process | What it addresses |
|---------|-------------------|
| **Project planning** | Define plans, estimates, resources, and schedules |
| **Project assessment and control** | Monitor progress and take corrective action |
| **Decision management** | Select among alternatives with recorded rationale |
| **Risk management** | Identify, analyze, treat, and monitor risks |
| **Configuration management** | Identify, control, and account for configuration items |
| **Information management** | Obtain, maintain, and distribute needed information |
| **Measurement** | Collect and analyze data to support management |
| **Quality assurance** | Provide independent confidence that work products and processes meet requirements |

#### 6.4 Technical processes

Define, realize, operate, sustain, and retire the software system-of-interest.

| Process | What it addresses |
|---------|-------------------|
| **Business or mission analysis** | Problem/opportunity space and solution alternatives |
| **Stakeholder needs and requirements definition** | Stakeholder needs → stakeholder requirements |
| **System requirements definition** | Transform stakeholder requirements into system/software requirements |
| **System architecture definition** | Allocate requirements to architectural entities and interfaces |
| **Design definition** | Detailed design sufficient for implementation |
| **System analysis** | Quantitative/qualitative analysis to support decisions |
| **Implementation** | Produce implemented software elements |
| **Integration** | Assemble elements into a complete system |
| **Verification** | Confirm the system fulfills specified requirements |
| **Transition** | Move the system into operational use |
| **Validation** | Confirm the system fulfills stakeholder needs in the intended environment |
| **Operation** | Use the system to deliver services |
| **Maintenance** | Sustain capability and correct/adapt the system |
| **Disposal** | End of life — retire, archive, or destroy |

**Per-process requirements pattern (normative structure):** for each process the full standard specifies **purpose**, **outcomes**, and **activities/tasks**. Conformance claims are against outcomes and/or tasks (Clause 4). The free preview/TOC confirms the process catalog; the purchased PDF contains the full purpose/outcome/task text.

### Life cycle “phases” vs processes

12207 treats **stages** (conception → development → operations/support → retirement) as life-cycle concepts in Clause 5, not as a mandatory phase list. The **executable unit of the standard is the process**, selected and sequenced inside an organization’s chosen model.

---

## (4) Free or paid?

| Access | Cost |
|--------|------|
| **Full text PDF / paper / ePub** | **Paid** — not open access |
| **ISO store (2026)** | Listed at **CHF 227** (PDF + ePub or paper; shipping extra for paper) — https://www.iso.org/standard/90219.html |
| **IEEE Accuris store (2026)** | Listed at **USD $169** PDF (members **$136**) — https://store.accuristech.com/ieee/products/vendor_id/11416 |
| **IEEE Xplore** | Sign-in or purchase; not open access |
| **Free** | Catalog abstracts on ISO/IEEE pages; **limited preview / sample** via ISO OBP and IEC preview PDF (front matter, TOC, partial content — not the full normative process text) |
| **Subscriptions** | Organizational IEEE standards subscription / ISO national-body subscriptions may include access |

**Bottom line:** the standard itself is a **commercial paid** international standard. Official free material is limited to abstracts and browsing-platform / IEC sample previews.

---

## Sources

- [ISO/IEC/IEEE 12207:2026 catalog](https://www.iso.org/standard/90219.html) (Published Edition 2, 2026-04; CHF 227; abstract; 140 pages)
- [ISO/IEC/IEEE 12207:2017 catalog](https://www.iso.org/standard/63712.html) (Withdrawn; replaced by 2026; 145 pages)
- [ISO/IEC JTC 1/SC 7 catalogue](https://www.iso.org/committee/45086/x/catalogue/p/1/u/1/w/0/d/0) (12207:2017 withdrawn; 12207:2026 stage 60.60)
- [IEEE/ISO/IEC 12207-2026](https://standards.ieee.org/ieee/12207/11416/) (Active; published 2026-04-15)
- [IEEE/ISO/IEC 12207-2017](https://standards.ieee.org/ieee/12207/5672/) (Superseded)
- [IEEE Accuris purchase — 12207-2026](https://store.accuristech.com/ieee/products/vendor_id/11416) ($169 / $136 member)
- [IEEE Xplore 12207-2017](https://ieeexplore.ieee.org/document/8100771) (DOI 10.1109/IEEESTD.2017.8100771; superseded; paid)
- [IEC preview PDF — ISO/IEC/IEEE 12207 Second edition 2026-04](https://ocp-api.iec.ch/api/publications/113447/view?hasAccess=false&language=en&previewLanguage=en&media=PDF) (official TOC / process list)
- [ISO/IEC/IEEE 12207-2:2020](https://www.iso.org/standard/73446.html) (mapping companion)

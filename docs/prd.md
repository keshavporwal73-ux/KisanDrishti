# Requirements Document

## 1. Application Overview

**Application Name:** KisanDrishti

**Tagline:** Evidence Before Valuation

**Description:**
KisanDrishti is a low-cost smartphone-based mobile application that provides a Tamper-Evident Visual Evidence Protocol for agricultural produce transactions. It is NOT an AI crop-price predictor, NOT a laboratory, NOT an official grading authority, and NOT an expensive inspection machine. The application creates standardized visual records of physical crop samples using ordinary smartphone cameras, enabling farmers and buyers to reference the same observable evidence during quality-based negotiations. It addresses the problem of arbitrary quality deductions by establishing a transparent, verifiable visual documentation system.

**Core Product Positioning:**
- Low-cost smartphone-based visual evidence protocol
- Does not require specialized cameras, spectrometers, IoT sensors, laboratory equipment, paid hardware, or expensive physical kits
- Visual evidence protocol, not a grading authority or price predictor
- Does not provide official mandi grading, laboratory testing, moisture measurement, chemical analysis, or financial/legal adjudication
- Provides observable visual evidence only
- Central promise: \"Don't tell both sides what the crop is worth. Give both sides the same visual evidence to inspect.\"

---

## 2. Target Users and Usage Scenarios

**Target Users:**
- Farmers selling agricultural produce
- Buyers/traders purchasing crops
- Agricultural intermediaries involved in quality assessment
- Enterprise/procurement teams managing bulk evidence
- Warehouses requiring standardized visual documentation

**Core Usage Scenarios:**
- Pre-transaction documentation: Farmers capture visual evidence of crop samples before negotiation
- Dispute prevention: Both parties reference the same visual record during quality discussions
- Transaction transparency: Creating verifiable evidence of sample condition at time of capture
- Historical reference: Maintaining records of past transactions for comparison
- Bulk evidence management: Enterprise users managing multiple evidence records

---

## 3. Page Structure and Functional Description

### Page Hierarchy

```
KisanDrishti Mobile App
├── Home / Dashboard
├── Create Evidence
│   ├── Crop/Commodity Selection
│   ├── Capture Instructions
│   ├── Photo Capture (2-3 photos)
│   ├── Automatic Capture Quality Gate
│   ├── Quality Failure & Recapture Guidance
│   ├── Hybrid Vision Analysis
│   ├── Evidence Result & Interactive Spatial Viewer
│   ├── Evidence Matrix
│   ├── Gemini Explanation Panel
│   └── Tamper-Evident Evidence Record
├── Evidence Card & Shareable Report
├── Evidence History & Repository
├── Interactive Evidence Showcase & Benchmark Protocol
└── How It Works
```

### 3.1 Home / Dashboard

**Elements:**
- KisanDrishti logo and name display
- Tagline: \"Evidence Before Valuation\"
- Create Evidence button
- My Evidence Records button
- How It Works button
- Interactive Evidence Showcase button
- Disclaimer section

**Dashboard Metrics:**
- Evidence Records: total count of created evidence records
- Capture Quality Pass Rate: percentage of captures passing quality gate
- Visual Findings: count of records with observable visual findings
- Unverified Findings: count of findings requiring laboratory confirmation
- Evidence Shared: count of shared evidence records
- Recent Evidence: list of most recent evidence records
- Evidence Timeline: chronological view of evidence creation activity

**Functionality:**
- Display clear disclaimer: \"KisanDrishti provides visual evidence only. It does not provide official mandi grading, laboratory testing, moisture measurement, chemical analysis, or financial/legal adjudication. It does not decide what the crop is worth—it creates standardized visual evidence that both sides can inspect.\"
- Navigate to Create Evidence flow
- Navigate to Evidence History
- Navigate to How It Works information page
- Navigate to Interactive Evidence Showcase
- Display professional agricultural infrastructure style dashboard with clean metrics

**Visual Design System:**
- Color palette: deep green/agricultural tones (#134E4A, #1B4D3E, emerald, dark forest)
- Off-white backgrounds
- Dark typography
- Restrained amber/red/green status indicators
- Subtle grid/data visualization elements
- No childish illustrations
- No fake statistics
- No unnecessary gradients
- Clean professional appearance

### 3.2 Create Evidence - Crop/Commodity Selection

**Input Fields:**
- Crop/Commodity (dropdown/selection): Wheat, Paddy/Rice, Mustard, Soybean, Maize, Cotton, Chana/Chickpea, etc.
- Variety (optional text field)
- Lot ID (text field)
- Location (text field)
- Buyer/transaction reference (optional text field)
- Date/time (automatically recorded)

**Functionality:**
- Collect evidence metadata
- Auto-capture current date and time
- Proceed to Capture Instructions

### 3.3 Capture Instructions

**Instruction Content:**
- \"Take 2-3 smartphone photos of a representative sample\"
- \"Do not pick only the best or worst grains—capture a typical portion of the lot\"
- \"Place sample on a clean, visible surface with good lighting\"
- \"Optional: Use a low-cost printed alignment sheet/mat to help with framing, scale, and color reference (strictly optional, not a rigid lab constraint)\"
- \"Do not arrange or count individual grains\"

**Photo Requirements:**
- Main sample photo: overall view of sample
- Close-up photo: detailed view of sample
- Optional wider/context photo: surrounding context

**Optional Alignment Sheet/Mat:**
- Low-cost printed sheet available for download
- Helps with framing, scale, and color reference only
- Not a rigid 10cm × 10cm lab constraint
- Not required for evidence creation

**Functionality:**
- Display clear capture instructions
- Provide optional alignment sheet download link
- Proceed to Photo Capture

### 3.4 Photo Capture (2-3 photos)

**Capture Interface:**
- Camera viewfinder with simple framing guide
- Capture button for each required photo
- Photo counter (1/2, 2/2, or 1/3, 2/3, 3/3)
- Retake button for each photo
- Preview thumbnail for captured photos

**Photo Sequence:**
1. Main sample photo
2. Close-up photo
3. Optional wider/context photo

**Functionality:**
- Access device camera for photo capture
- Capture 2-3 photos in sequence
- Allow retake for any photo
- Display preview thumbnails
- Proceed to Automatic Capture Quality Gate after all photos captured

### 3.5 Automatic Capture Quality Gate

**Quality Checks:**
- Blur detection: assess image sharpness
- Shadow detection: identify excessive shadows
- Lighting assessment: evaluate exposure level
- Glare detection: identify overexposed regions
- Framing check: verify sample is within frame
- Sample visibility: ensure sample is clearly visible
- Overlap check: verify photos show different views
- Resolution check: ensure sufficient image resolution

**Quality Gate Logic:**
- Pass: All quality checks meet minimum thresholds
- Fail: One or more quality checks below threshold

**Functionality:**
- Perform automated quality checks on all captured photos
- Evaluate blur, shadows, lighting, glare, framing, sample visibility, overlap, resolution
- Determine pass/fail status
- If pass: Proceed to Hybrid Vision Analysis
- If fail: Proceed to Quality Failure & Recapture Guidance

### 3.6 Quality Failure & Recapture Guidance

**Failure Screen Display:**
- Prominent message: \"Capture quality insufficient. Please recapture the sample.\"
- Specific failure reasons listed:
  + Blurry image detected
  + Excessive shadows detected
  + Poor lighting (underexposure or overexposure)
  + Glare detected
  + Sample not properly framed
  + Sample not clearly visible
  + Photos too similar (insufficient overlap)
  + Resolution too low

**Corrective Guidance:**
- Specific tips for each detected failure:
  + Blur: \"Hold phone steady and ensure focus before capture\"
  + Shadows: \"Move to location with even lighting, avoid direct shadows\"
  + Poor lighting: \"Improve lighting conditions or move to brighter location\"
  + Glare: \"Reduce direct light or adjust angle to avoid reflections\"
  + Framing: \"Ensure entire sample is visible within frame\"
  + Visibility: \"Place sample on clean, contrasting surface\"
  + Overlap: \"Capture different views (overall, close-up, context)\"
  + Resolution: \"Move closer or use higher resolution camera setting\"

**Recapture Action:**
- \"Recapture Photos\" button
- Returns to Photo Capture with guidance displayed

**Functionality:**
- Display explicit failure screen when quality gate fails
- List specific failure reasons detected
- Provide actionable corrective guidance for each failure
- Enable immediate recapture
- Return to Photo Capture with persistent guidance tips

### 3.7 Hybrid Vision Analysis

**Architecture Components:**

**Local Computer Vision Processing:**
- Image normalization
- Sample/background separation
- Quality checks
- Spatial localization
- Candidate anomaly region detection
- Bounding boxes/masks generation

**Gemini Multimodal Analysis:**
- Visual reasoning and classification
- Anomaly explanation
- Visual defect categorization: broken/damaged material, visible discoloration, visible foreign material, abnormal appearance, physical surface damage
- Contextual explanation of selected regions

**Feature Categorization:**
- OBSERVED: visually detected features (broken/damaged material, visible discoloration, visible foreign material, abnormal appearance, physical surface damage)
- POSSIBLE: visual interpretation requiring confirmation
- UNVERIFIED: measurements requiring laboratory/professional equipment

**Strictly Forbidden:**
- Moisture percentage
- Protein percentage
- Chemical contamination measurements
- Pesticide residue measurements
- Internal defects
- Nutritional values
- Laboratory measurements
- Rupee deductions or price calculations

**Constraints:**
- NEVER fabricate laboratory measurements
- Explicitly categorize every feature according to verification status
- If vision system cannot confidently analyze sample, display: \"Reliable visual evidence could not be established. Please recapture the sample.\"
- Do NOT invent results when confidence is low

**Functionality:**
- Process captured photos through local CV pipeline
- Send photos to Gemini for multimodal analysis
- Detect and classify observable anomalies
- Generate spatial coordinates for each detected anomaly
- Create bounding boxes/masks for visualization
- Categorize all findings as OBSERVED, POSSIBLE, or UNVERIFIED
- Proceed to Evidence Result display

### 3.8 Evidence Result & Interactive Spatial Viewer

**Summary Metrics Display (Observable Visual Evidence):**
- Broken/Damaged Material: percentage or count
- Visible Discoloration: percentage or count
- Visible Foreign Material: count
- Abnormal Appearance: percentage or count
- Physical Surface Damage: percentage or count
- Capture Quality Status: pass/fail indicator

**Interactive Spatial Viewer:**
- Display captured photos (main, close-up, optional context)
- Overlay interactive spatial bounding boxes/pin markers/masks for flagged observations
- Number each detected anomaly with marker
- Provide interactive filtering by category: All, Foreign Material, Broken/Damaged, Discoloration, Abnormal Appearance, Surface Damage

**Primary Feature - Interactive Zoom & Pan:**
- Tap on numbered marker or metric to trigger smooth zoom and pan into corresponding region
- Highlight selected observation
- Display detailed inspection card for selected observation
- Show observation-specific analysis and classification
- Every finding must link back to the original captured photo with interactive bounding box/highlight

**Multi-Language Toggle:**
- Language selector: English, Hindi, Punjabi
- Apply selected language to all UI text and labels
- Maintain language preference across session

**Mandatory Disclaimer Display:**
- Prominent disclaimer: \"This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot.\"
- Additional disclaimer: \"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.\"

**Functionality:**
- Render captured photos with overlays
- Enable category-based filtering of visible markers
- Implement smooth zoom/pan animation on marker selection
- Display contextual inspection cards for individual observations
- Allow navigation between detected observations
- Support multi-language toggle (English, Hindi, Punjabi)
- Display mandatory disclaimers prominently
- Proceed to Evidence Matrix view

### 3.9 Evidence Matrix

**Table Structure:**

Columns:
- Evidence Item
- Result
- Status (OBSERVED / POSSIBLE / UNVERIFIED)
- Confidence / Method

**Content Categories:**

**OBSERVED VISUAL EVIDENCE:**
- Broken/damaged material: percentage or count
- Visible foreign material: count
- Visible discoloration: percentage or count
- Abnormal appearance: percentage or count
- Physical surface damage: percentage or count
- Capture quality status

**UNVERIFIED Evidence Items (explicitly included):**
- Moisture: Not tested
- Protein: Not tested
- Internal defects: Not verified
- Chemical composition / pesticide residue: Not tested
- Nutritional values: Not tested
- Internal contamination: Not verified

**Constraints:**
- Never convert visual observations into final commercial grade
- Never provide rupee deduction calculations
- Clearly distinguish between observed and unverified measurements
- Do NOT fabricate laboratory measurements or official grades

**Functionality:**
- Display structured evidence table
- Show status indicators for each evidence item
- Provide confidence scores where applicable
- Explicitly list unverified measurements with \"Not tested\" or \"Not verified\" status
- Allow navigation to Gemini Explanation Panel for detailed reasoning

### 3.10 Gemini Explanation Panel

**Deep-Dive Explanation Structure:**

For selected anomalies, display:
- Finding (description of detected anomaly)
- Visual Evidence (reference to specific photo region with interactive bounding box/highlight)
- Visual reasoning (explanation of classification logic)
- Status (OBSERVED VISUAL EVIDENCE / POSSIBLE INTERPRETATION)
- Limitation disclaimer

**Functionality:**
- Provide detailed explanation for user-selected anomalies
- Link explanation to corresponding spatial evidence in photo with interactive highlight
- Display visual reasoning process
- Clearly indicate epistemic status of each finding
- Show explicit limitations of visual analysis

### 3.11 Tamper-Evident Evidence Record

**Record Details:**
- Evidence ID
- Crop/Commodity
- Lot ID
- Capture timestamp
- Location
- Device/session metadata
- 2-3 uploaded photos with references
- Capture quality status
- Visual observations summary
- Evidence status (OBSERVED / POSSIBLE / UNVERIFIED)
- Highlighted bounding boxes data
- Limitations statement

**Cryptographic Hash:**
- Compute genuine SHA-256 cryptographic hash of canonical evidence JSON package
- Display hash value prominently
- Use terminology \"tamper-evident\" NOT \"immutable\"

**Hash Verification Widget:**
- Allow hash integrity checking
- Enable verification against modified data
- Show verification result (match/mismatch)

**Explanation:**
- Display clear explanation: \"The hash is tamper-evident—it helps detect changes to the recorded digital evidence after creation. It does not prove that the photographed sample was representative of the entire lot, nor does it prevent creation of fraudulent initial records.\"

**Mandatory Disclaimer:**
- \"This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot.\"

**Functionality:**
- Generate canonical JSON representation of complete evidence package
- Compute SHA-256 hash of evidence package
- Store hash with evidence record
- Provide hash verification interface
- Compare stored hash with recomputed hash to detect tampering
- Display verification status
- Display mandatory disclaimers
- Proceed to Evidence Card generation

### 3.12 Evidence Card & Shareable Report / Export

**Evidence Card Content:**

Title: KisanDrishti Tamper-Evident Visual Record

Content:
- Evidence metadata (ID, crop/commodity, lot, timestamp, location)
- Summary metrics (observable visual evidence: broken/damaged material, visible discoloration, visible foreign material, abnormal appearance, physical surface damage)
- Key visual evidence thumbnails (2-3 photos)
- Evidence matrix summary
- Highlighted bounding boxes visualization
- Cryptographic hash (tamper-evident)
- Limitations statement
- Mandatory disclaimer: \"This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot.\"
- Additional disclaimer: \"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.\"

**Export Options:**
- Export to PDF
- Shareable web link (recipient view mode without app install requirement)
- QR code generation for quick access
- Copy Link button
- WhatsApp share with preformatted evidence summary

**Interactive Viewer:**
- Zoom and anomaly highlights
- Navigate between photos
- View detailed findings

**Functionality:**
- Generate formatted evidence card
- Render PDF version for download
- Create shareable web link with unique URL
- Generate QR code for evidence access
- Format WhatsApp message with evidence summary and link
- Enable one-click sharing to WhatsApp
- Provide copy-to-clipboard functionality for link
- Display recipient view mode for shared links (read-only access with interactive viewer)

### 3.13 Evidence History & Repository

**Display Elements:**
- List of previous evidence records
- Search functionality
- Filter options (by crop, date range, location, status)
- Sort options (by date, crop type, visual findings count)

**Evidence List Item Display:**
- Evidence ID
- Crop/Commodity and variety
- Lot ID
- Capture date/time
- Status tags
- Visual findings summary (broken/damaged, discoloration, foreign material)
- Quick verify hash button
- Open record button

**Functionality:**
- Display searchable and filterable history of evidence records
- Enable search by evidence ID, lot ID, crop type, location
- Provide filtering by crop type, date range, visual findings status
- Sort evidence list by various criteria
- Quick hash verification from list view
- Navigate to full evidence record on selection

### 3.14 Interactive Evidence Showcase & Benchmark Protocol

**Purpose:**
- Provide production-ready reference evidence records for major Indian agricultural commodities
- Demonstrate complete visual evidence protocol workflow
- Establish benchmark standards for evidence quality across key APMC Mandis
- Enable users to explore authentic verified lot datasets

**Commodity Coverage:**
- Wheat
- Basmati Paddy
- Mustard
- Soybean
- Maize
- Chana (Chickpea)

**Evidence Record Structure (per commodity):**

**Metadata:**
- Commodity name and variety
- Verified lot ID from authentic APMC Mandi source
- APMC Mandi location (e.g., Khanna Mandi Punjab, Karnal Mandi Haryana, Indore Mandi Madhya Pradesh)
- Capture date and time
- Lot size and transaction context

**Visual Evidence Package:**
- High-resolution main sample photo (minimum 1920x1080)
- High-resolution close-up photo
- Optional context photo
- All photos captured using standard smartphone camera
- Photos demonstrate proper lighting, framing, and sample visibility

**Analysis Results:**
- Observable visual evidence metrics:
  + Broken/Damaged Material: percentage or count
  + Visible Discoloration: percentage or count
  + Visible Foreign Material: count
  + Abnormal Appearance: percentage or count
  + Physical Surface Damage: percentage or count
- Capture quality status: Pass
- Interactive spatial viewer with numbered markers
- Bounding boxes/highlights for each detected observation

**Evidence Matrix:**
- Complete structured table with OBSERVED and UNVERIFIED categories
- Confidence scores for visual observations
- Clear status indicators

**Gemini Explanations:**
- Detailed reasoning for selected observations
- Visual evidence references with interactive highlights
- Epistemic status clarification

**Tamper-Evident Verification:**
- Authentic SHA-256 hash for each evidence record
- Hash verification widget demonstrating integrity check
- Verification timestamp

**Navigation Structure:**

```
Interactive Evidence Showcase
├── Commodity Selection Grid
│   ├── Wheat
│   ├── Basmati Paddy
│   ├── Mustard
│   ├── Soybean
│   ├── Maize
│   └── Chana
├── Evidence Record Detail View (per commodity)
│   ├── Metadata Display
│   ├── High-Res Photo Gallery
│   ├── Interactive Spatial Viewer
│   ├── Evidence Matrix
│   ├── Gemini Explanations
│   └── Hash Verification
└── Benchmark Comparison View
```

**Commodity Selection Grid:**
- Display six commodity cards (Wheat, Basmati Paddy, Mustard, Soybean, Maize, Chana)
- Each card shows:
  + Commodity name and variety
  + APMC Mandi location
  + Thumbnail of main sample photo
  + Visual findings summary
  + \"View Evidence\" button

**Evidence Record Detail View:**
- Full-screen presentation of complete evidence record
- Metadata section displaying lot ID, APMC Mandi, capture date/time, lot size
- High-resolution photo gallery with swipe navigation
- Interactive spatial viewer with zoom/pan and numbered markers
- Evidence matrix with expandable rows
- Gemini explanation panels accessible via marker selection
- Hash verification widget with \"Verify Integrity\" button
- Mandatory disclaimers displayed prominently

**Benchmark Comparison View:**
- Side-by-side comparison of evidence records across commodities
- Highlight differences in visual findings patterns
- Demonstrate protocol consistency across different crop types

**Functionality:**
- Display commodity selection grid on showcase entry
- Navigate to detailed evidence record on commodity selection
- Render high-resolution photos with interactive viewer
- Enable zoom/pan/marker interaction identical to user-created evidence
- Provide hash verification for each benchmark record
- Allow navigation between different commodity evidence records
- Support sharing of benchmark evidence records via link/QR code
- Maintain professional visual design consistent with main application

**Data Requirements:**
- Authentic verified lot IDs from real APMC Mandi transactions
- High-resolution photos captured using standard smartphone cameras
- Realistic visual analysis results based on actual sample conditions
- Valid SHA-256 hashes computed from complete evidence packages
- Accurate APMC Mandi location references

**Quality Standards:**
- All photos must pass automatic capture quality gate
- Visual findings must be verifiable through spatial viewer
- Hash verification must demonstrate successful integrity check
- Evidence records must include complete metadata
- All disclaimers must be displayed prominently

### 3.15 How It Works

**Content:**
- Explanation of KisanDrishti purpose and positioning: low-cost smartphone-based visual evidence protocol, not a price predictor, laboratory, or grading authority
- Step-by-step overview of evidence creation process
- Explanation of visual evidence protocol
- Description of tamper-evident cryptographic hash and its limitations
- Clarification of what KisanDrishti does and does not provide
- Epistemic framework explanation (OBSERVED, POSSIBLE, UNVERIFIED)
- Usage guidelines and best practices
- Business model explanation: Free/very-low-cost for farmers; enterprise/procurement/traders/warehouses for bulk evidence management
- Core message: \"Don't tell both sides what the crop is worth. Give both sides the same visual evidence to inspect.\"

**Functionality:**
- Display informational content about application
- Provide educational material on visual evidence protocol
- Explain limitations and appropriate use cases
- Describe business model and pricing

---

## 4. Business Rules and Logic

### 4.1 Epistemic Framework

**Feature Categorization:**
- All analysis results must be categorized as OBSERVED, POSSIBLE, or UNVERIFIED
- OBSERVED: Features directly visible in photos (broken/damaged material, visible discoloration, visible foreign material, abnormal appearance, physical surface damage)
- POSSIBLE: Visual interpretations requiring expert confirmation
- UNVERIFIED: Measurements requiring laboratory equipment (moisture, protein, chemical composition, internal defects, nutritional values, internal contamination)

**Strictly Forbidden Claims:**
- Never provide moisture percentage
- Never provide protein percentage
- Never provide chemical contamination measurements
- Never provide pesticide residue measurements
- Never provide internal defect assessments
- Never provide nutritional value measurements
- Never provide laboratory measurement values
- Never calculate rupee deductions or price adjustments
- Never provide final commercial grade designation
- Never claim to provide official mandi grading
- Never claim legal or financial adjudication authority

**Uncertainty Visibility:**
- Confidence scores must be displayed where applicable
- Limitations must be explicitly stated
- Unverified measurements must be clearly labeled as \"Not tested\" or \"Not verified\"
- If vision system cannot confidently analyze sample, display: \"Reliable visual evidence could not be established. Please recapture the sample.\"

### 4.2 Visual Evidence Prioritization

**Primary Observable Evidence:**
- Broken/damaged material
- Visible discoloration
- Visible foreign material
- Abnormal appearance
- Physical surface damage
- Capture quality status

**Spatial Evidence Requirement:**
- Every finding must link back to the original captured photo with an interactive bounding box/highlight
- Users must be able to zoom/pan to inspect flagged observations
- No finding should be presented without corresponding spatial evidence

**Dashboard Metrics:**
- Evidence Records: total count
- Capture Quality Pass Rate: percentage
- Visual Findings: count of records with observable findings
- Unverified Findings: count of findings requiring lab confirmation
- Evidence Shared: count of shared records
- Recent Evidence: chronological list
- Evidence Timeline: activity visualization
- Do NOT display gimmicky metrics like \"412 grains detected\"

### 4.3 Capture Quality Gate Logic

**Quality Checks:**
- Blur detection: Measure image sharpness using Laplacian variance or similar method
- Shadow detection: Analyze brightness distribution, identify dark regions
- Lighting assessment: Evaluate overall exposure level, detect underexposure or overexposure
- Glare detection: Identify overexposed regions or specular highlights
- Framing check: Verify sample occupies appropriate portion of frame
- Sample visibility: Ensure sample is distinguishable from background
- Overlap check: Compare photos to verify different views captured
- Resolution check: Verify image resolution meets minimum threshold

**Pass/Fail Thresholds:**
- Blur: sharpness score > threshold
- Shadows: shadow coverage < threshold percentage
- Lighting: brightness within acceptable range
- Glare: glare coverage < threshold percentage
- Framing: sample occupies 30-70% of frame
- Visibility: sample/background contrast > threshold
- Overlap: photo similarity < threshold (photos sufficiently different)
- Resolution: minimum 1920x1080 or equivalent

**Failure Handling:**
- Trigger explicit failure screen when any check fails
- List specific failure reasons
- Provide actionable corrective guidance
- Enable immediate recapture

### 4.4 Hybrid Vision Analysis Logic

**Local CV Processing:**
- Image normalization: adjust brightness, contrast, color balance
- Sample/background separation: segment sample region from background
- Quality checks: verify image meets analysis requirements
- Spatial localization: identify regions of interest
- Candidate anomaly detection: flag potential anomalies for Gemini analysis
- Bounding box generation: create spatial coordinates for each candidate

**Gemini Multimodal Analysis:**
- Receive candidate anomaly regions from local CV
- Perform visual reasoning and classification
- Categorize anomalies: broken/damaged material, visible discoloration, visible foreign material, abnormal appearance, physical surface damage
- Generate contextual explanations
- Assign confidence scores
- Return classification results and explanations

**Result Integration:**
- Combine local CV and Gemini results
- Generate evidence matrix with categorized findings
- Create spatial viewer data with bounding boxes
- Compute overall evidence summary metrics

### 4.5 Tamper-Evident Hash Logic

**Hash Generation:**
- Create canonical JSON representation of complete evidence package including: evidence metadata, photo references, analysis results, timestamp, device metadata, visual observations, evidence status, bounding boxes data, limitations statement
- Compute SHA-256 hash of canonical JSON string
- Store hash with evidence record

**Hash Verification:**
- Retrieve stored evidence record
- Recompute hash from current evidence data
- Compare stored hash with recomputed hash
- Display match/mismatch result
- If mismatch detected, indicate that evidence record has been modified

**Hash Terminology:**
- Use \"tamper-evident\" NOT \"immutable\"
- Clarify that hash detects post-recording digital edits
- Clarify that hash does NOT prove truthful sampling
- Clarify that hash does NOT prevent creation of fraudulent initial records

**Hash Limitations:**
- Hash verifies digital record integrity only
- Hash does not prove sample representativeness of entire lot
- Hash does not prevent creation of fraudulent initial records

### 4.6 Sample Representativeness

**User Responsibility:**
- Application provides tools for standardized capture
- User is responsible for selecting representative sample
- Instructions guide user to capture typical portion of lot
- Instructions explicitly state: \"Do not pick only the best or worst grains\"

**No Guarantees:**
- Application does not guarantee sample representativeness
- Application does not verify that photographed sample matches actual lot
- Mandatory disclaimer clearly states: \"This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot.\"

### 4.7 Optional Alignment Sheet/Mat

**Purpose:**
- Helps with framing, scale, and color reference only
- Not a rigid 10cm × 10cm lab constraint
- Strictly optional, not required for evidence creation

**Usage:**
- User can download and print low-cost alignment sheet
- User places sample on sheet for capture
- Sheet provides visual reference for framing and scale
- Sheet does NOT require arranging or counting individual grains

**Constraints:**
- Do not enforce rigid sample size or arrangement
- Do not require precise grain placement
- Do not use sheet for grain counting or measurement

### 4.8 Multi-Language Support

**Supported Languages:**
- English
- Hindi
- Punjabi

**Language Application:**
- Apply selected language to all UI text, labels, buttons, messages
- Maintain language preference across session
- Store language preference in user settings

**Translation Scope:**
- UI elements and navigation
- Instructions and guidance
- Error messages and warnings
- Evidence matrix labels
- Disclaimer text

### 4.9 Business Model

**Farmer Tier:**
- Free or very-low-cost access
- Core evidence creation functionality
- Basic sharing and export features

**Enterprise Tier:**
- Paid subscription for enterprise/procurement/traders/warehouses
- Bulk evidence management features
- Advanced search and filtering
- Analytics and reporting
- API access for integration
- Priority support

### 4.10 Interactive Evidence Showcase Data Management

**Benchmark Evidence Records:**
- Six production-ready evidence records (Wheat, Basmati Paddy, Mustard, Soybean, Maize, Chana)
- Each record includes authentic verified lot ID from real APMC Mandi
- High-resolution photos captured using standard smartphone cameras
- Complete visual analysis results with spatial viewer data
- Valid SHA-256 hashes for tamper-evident verification

**Data Source Requirements:**
- Lot IDs must reference authentic APMC Mandi transactions
- APMC Mandi locations must be accurate (e.g., Khanna Mandi Punjab, Karnal Mandi Haryana, Indore Mandi Madhya Pradesh)
- Photos must demonstrate proper capture technique and quality standards
- Visual findings must be realistic and verifiable through spatial viewer

**Quality Assurance:**
- All benchmark photos must pass automatic capture quality gate
- Visual analysis results must be consistent with observable evidence in photos
- Hash verification must demonstrate successful integrity check
- Evidence records must include complete metadata and disclaimers

### 4.11 Data Flow

**Evidence Creation Flow:**
1. User selects crop/commodity and enters metadata
2. System generates unique evidence ID
3. User views capture instructions
4. User captures 2-3 photos (main, close-up, optional context)
5. System performs automatic capture quality gate checks
6. If quality gate fails, system displays failure screen with recapture guidance
7. If quality gate passes, system performs local CV processing
8. System sends photos to Gemini for multimodal analysis
9. System combines local CV and Gemini results
10. System generates evidence matrix and spatial viewer data
11. System computes tamper-evident SHA-256 hash of evidence package
12. System stores complete evidence record
13. User can view, share, or export evidence record

**Evidence Sharing Flow:**
1. User selects evidence record to share
2. System generates shareable web link with unique URL
3. System creates formatted evidence card
4. User selects sharing method (link copy, WhatsApp, PDF export, QR code)
5. Recipient accesses shared link without app installation
6. Recipient views read-only evidence record with interactive viewer
7. Recipient can verify tamper-evident hash

**Interactive Evidence Showcase Flow:**
1. User navigates to Interactive Evidence Showcase from dashboard
2. System displays commodity selection grid with six options
3. User selects commodity (e.g., Wheat)
4. System loads production-ready evidence record for selected commodity
5. User explores high-resolution photos, interactive spatial viewer, evidence matrix, Gemini explanations
6. User verifies tamper-evident hash using verification widget
7. User can navigate to other commodity evidence records or share benchmark evidence

---

## 5. Exception and Boundary Conditions

| Scenario | Handling |
|----------|----------|
| Photo capture fails | Display error message, allow retry |
| Camera access denied | Display permission request guidance, provide instructions to enable camera access |
| Capture quality gate fails | Display failure screen with specific reasons and corrective guidance, require recapture |
| Multiple quality checks fail simultaneously | List all failure reasons, provide guidance for each, require recapture |
| User skips optional context photo | Allow evidence creation with 2 photos only |
| Vision system cannot confidently analyze sample | Display: \"Reliable visual evidence could not be established. Please recapture the sample.\" Do NOT invent results |
| Gemini API unavailable | Fallback to local CV analysis only, display notice that multimodal analysis is unavailable |
| Network connection lost during analysis | Save progress locally, retry when connection restored, display connection status |
| Hash verification fails | Display clear tampering warning, show original vs. current hash values |
| Shared link accessed after record deletion | Display \"Record not found\" message |
| User attempts to edit completed evidence record | Display message that evidence records are tamper-evident and cannot be edited, suggest creating new evidence |
| Location field empty | Default to \"Not specified\" in record, allow evidence creation to proceed |
| No anomalies detected | Display \"No visual anomalies detected\" with appropriate messaging, proceed normally |
| Extremely high anomaly count | Display result without judgment, no special handling |
| Unsupported crop type entered | Allow custom text entry, proceed with analysis using general material detection |
| Multiple users access same shared link simultaneously | Each user gets independent read-only view, no conflict |
| Language change during active evidence creation | Apply language change immediately to all UI elements |
| Recapture after multiple quality gate failures | Allow unlimited recapture attempts, provide persistent guidance |
| User attempts to create evidence without internet connection | Display message that internet connection is required for Gemini analysis, allow local CV processing only with notice |
| Photo file size exceeds limit | Compress photo automatically, display notice if compression affects quality |
| Device storage full | Display storage warning, suggest deleting old evidence records or photos |
| Alignment sheet not available | Allow evidence creation without alignment sheet, display notice that sheet is optional |
| Interactive Evidence Showcase commodity record fails to load | Display error message, allow retry, provide fallback to other commodity records |
| Hash verification widget fails in showcase | Display error message, indicate verification unavailable, allow continued exploration of evidence record |

---

## 6. Acceptance Criteria

1. User opens KisanDrishti mobile app and sees dashboard displaying Evidence Records count, Capture Quality Pass Rate, Visual Findings count, Recent Evidence list, Interactive Evidence Showcase button, and prominent disclaimer stating the app provides visual evidence only and does not decide crop worth
2. User taps Interactive Evidence Showcase button and views commodity selection grid displaying six cards (Wheat, Basmati Paddy, Mustard, Soybean, Maize, Chana) with APMC Mandi locations and visual findings summaries
3. User selects Wheat commodity card and views complete production-ready evidence record including verified lot ID from Khanna Mandi Punjab, high-resolution main and close-up photos, interactive spatial viewer with numbered markers, and tamper-evident SHA-256 hash
4. User taps on \"Visible Foreign Material\" marker in showcase spatial viewer, triggering smooth zoom/pan animation to corresponding region with interactive bounding box highlight and displaying detailed Gemini explanation panel
5. User navigates to Evidence Matrix in showcase and sees structured table with OBSERVED categories (broken/damaged material 5.2%, visible discoloration 1.4%, visible foreign material 3) and UNVERIFIED measurements clearly labeled \"Not tested\" (moisture, protein, chemical composition)
6. User taps \"Verify Integrity\" button in showcase hash verification widget and sees successful verification result confirming evidence record has not been modified since creation
7. User returns to commodity selection grid and explores Basmati Paddy evidence record from Karnal Mandi Haryana with different visual findings pattern, demonstrating protocol consistency across crop types
8. User taps Create Evidence button from dashboard, selects crop \"Mustard\", enters lot ID \"LOT-2026-092\", location \"Indore\", and proceeds to capture instructions
9. User captures main sample photo and close-up photo using smartphone camera, system displays photo counters and preview thumbnails, proceeds to automatic quality gate
10. System performs quality gate checks (blur, shadows, lighting, glare, framing, sample visibility, overlap, resolution), all checks pass, system proceeds to hybrid vision analysis with progress indicators
11. User views Evidence Result dashboard showing observable visual evidence metrics with interactive spatial viewer, taps on numbered marker to zoom/pan into flagged observation with detailed inspection card
12. User navigates to Tamper-Evident Evidence Record showing evidence metadata, 2 uploaded photos, SHA-256 hash, hash verification widget, and mandatory disclaimer: \"This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot.\"
13. User generates shareable Evidence Card with disclaimers, exports to PDF, and shares via WhatsApp with preformatted message containing evidence summary and web link
14. Recipient opens shared web link on any device without app installation and views read-only evidence record with interactive viewer, zoom/pan functionality, and ability to verify tamper-evident hash
15. User navigates to Evidence History, searches for \"Mustard\" evidence records, filters by date range September 2026, and opens previous evidence record showing observable visual evidence summary and quick hash verification button

---

## 7. Out of Scope for Current Release

- Specialized cameras, spectrometers, IoT sensors, laboratory equipment, paid hardware, or expensive physical kits
- Moisture measurement or moisture meter integration
- Protein measurement or protein analyzer integration
- Chemical composition analysis or chemical testing equipment integration
- Pesticide residue testing
- Internal defect detection requiring specialized equipment
- Nutritional value measurement
- Official mandi grading integration
- Financial calculation features (price estimation, rupee deduction calculation, payment processing)
- Legal adjudication or dispute resolution mechanisms
- Grain/object counting as primary user-facing metric or headline feature
- Rigid 10cm × 10cm lab constraint for sample placement
- Mandatory alignment sheet requirement
- Grain arrangement or counting instructions
- Multi-user collaboration features (shared workspaces, team accounts)
- Blockchain integration for evidence storage
- Automated sample collection robotics
- Real-time market price integration
- Buyer/seller matching or marketplace features
- Contract management or transaction tracking
- Advanced statistical analysis or trend reporting across multiple evidence records
- Integration with government agricultural databases
- Automated notification system for buyers/sellers
- Video capture of sample preparation process
- 3D imaging or depth sensing for volumetric analysis
- Spectroscopy or hyperspectral imaging
- Machine learning model training interface for users
- White-label or customization options for different regions/crops
- Cloud-based photo storage and synchronization (beyond evidence record storage)
- User authentication and account management (beyond basic session management)
- Advanced image editing or enhancement tools
- Batch processing of multiple samples
- Integration with external sensors (dedicated lux meters, professional tilt sensors)
- Automated report generation scheduling
- Custom defect classification training
- Expansion of Interactive Evidence Showcase beyond six major commodities
- Real-time collaborative evidence review sessions
- Automated APMC Mandi data synchronization
- Historical price correlation analysis for benchmark evidence
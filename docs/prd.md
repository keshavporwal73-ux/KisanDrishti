# Requirements Document

## 1. Application Overview

**Application Name:** KisanDrishti

**Tagline:** Evidence Before Valuation

**Description:**
KisanDrishti is a mobile-first web application that provides a Tamper-Evident Visual Evidence Protocol for agricultural produce transactions. It is NOT an AI crop-grading authority or a grain-counting application. The application creates standardized visual records of physical crop samples, enabling farmers and buyers to reference the same observable evidence during quality-based negotiations. It addresses the problem of arbitrary quality deductions by establishing a transparent, verifiable visual documentation system.

**Core Product Positioning:**
- Visual evidence protocol, not a grading authority or counting tool
- Does not provide official mandi grading, laboratory testing, moisture measurement, chemical analysis, or financial/legal adjudication
- Provides observable visual evidence only
- Does not decide what the crop is worth—it creates standardized visual evidence that both sides can inspect

---

## 2. Target Users and Usage Scenarios

**Target Users:**
- Farmers selling agricultural produce
- Buyers/traders purchasing crops
- Agricultural intermediaries involved in quality assessment

**Core Usage Scenarios:**
- Pre-transaction documentation: Farmers capture visual evidence of crop samples before negotiation
- Dispute prevention: Both parties reference the same visual record during quality discussions
- Transaction transparency: Creating verifiable evidence of sample condition at time of capture
- Historical reference: Maintaining records of past transactions for comparison

---

## 3. Page Structure and Functional Description

### Page Hierarchy

```
KisanDrishti Web App
├── Home / Dashboard
├── Start New Audit
│   ├── Audit Information Entry
│   ├── Sample Preparation Checklist
│   ├── Physical Calibration Sheet
│   ├── Enhanced Capture Screen with Live Camera Feed
│   ├── Pre-Validation Quality Checks
│   ├── Failure Detection & Recapture Guidance
│   ├── Hybrid Vision Analysis
│   ├── Live Audit Result & Interactive Spatial Evidence Viewer
│   ├── Evidence Matrix
│   ├── Gemini Multimodal Explanation Panel
│   └── Tamper-Evident Evidence Record
├── Evidence Card & Shareable Report
├── Evidence History & Repository
├── Demo Mode
└── How It Works
```

### 3.1 Home / Dashboard

**Elements:**
- KisanDrishti logo and name display
- Tagline: \"Evidence Before Valuation\"
- Start New Audit button
- My Evidence Records button
- How It Works button
- Demo Mode button
- Disclaimer section

**Functionality:**
- Display clear disclaimer: \"KisanDrishti provides visual evidence only. It does not provide official mandi grading, laboratory testing, moisture measurement, chemical analysis, or financial/legal adjudication. It does not decide what the crop is worth—it creates standardized visual evidence that both sides can inspect.\"
- Navigate to Start New Audit flow
- Navigate to Evidence History
- Navigate to How It Works information page
- Navigate to Demo Mode walkthrough

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

### 3.2 Start New Audit - Audit Information Entry

**Input Fields:**
- Crop (dropdown/selection): Wheat, Paddy/Rice, Mustard, Soybean, Maize, Cotton, Chana/Chickpea, etc.
- Variety (optional text field)
- Lot ID (text field)
- Location (text field)
- Buyer/transaction reference (optional text field)
- Sample size (selection): 100g, 250g, 500g, etc.
- Date/time (automatically recorded)

**Functionality:**
- Collect audit metadata
- Auto-capture current date and time
- Proceed to Sample Preparation Checklist

### 3.3 Sample Preparation Checklist

**Interactive Checklist Items:**
- Clean grid surface (no dust or debris)
- Even spread of sample without clusters or piles
- Ambient daylight or adequate lighting
- Camera positioned perpendicular to grid
- Sample placed within marked 10cm × 10cm boundary
- All alignment markers visible

**Functionality:**
- Display interactive checklist with checkboxes
- Allow users to mark items as completed
- Provide visual guidance for each checklist item
- Proceed to Physical Calibration Sheet display after checklist review

### 3.4 Physical Calibration Sheet

**Visual Interactive Representation:**
- Display interactive visual representation of calibration sheet
- Show 10 cm × 10 cm sample boundary
- Display measurement/grid markings (1mm / 1cm ticks)
- Show RGB/CMYK-style reference color patches
- Display alignment markers (corner fiducials / ArUco-like targets)
- Show unique QR/session identifier

**Printable/Downloadable Sheet:**
- Provide A4 calibration sheet download option
- Include all visual elements: sample boundary, grid markings, color patches, alignment markers, QR identifier

**Instructions:**
- Display clear instruction: \"Place a representative sample inside the marked area. Capture the entire sample without intentionally selecting only visually favorable grains.\"
- Do NOT claim that the sheet guarantees representative sampling

**Functionality:**
- Generate unique session identifier for each audit
- Provide download/print functionality for calibration sheet
- Proceed to Enhanced Capture Screen

### 3.5 Enhanced Capture Screen with Live Camera Feed

**Live Camera Feed Interface:**
- Real-time camera stream display
- Sample boundary overlay matching calibration sheet dimensions
- Alignment indicators
- Live lighting/lux meter display
- Live tilt sensor/gyroscope reading display
- Canvas snapshot capture button
- Switch camera button (front/rear)
- Fallback to file upload option
- Fallback to preset sample images option

**Real-Time Quality Indicators:**
- Lighting level (lux estimate) with color-coded status (red/amber/green)
- Angle/tilt deviation display with numerical degree reading
- Grid alignment detection status
- Focus/sharpness indicator
- Overall quality score display

**Capture Actions:**
- Capture Evidence button (takes canvas snapshot from live stream)
- Retake button
- Upload image button (fallback)
- Select preset sample button (fallback)

**Functionality:**
- Access device camera for live real-time stream
- Display live camera feed with overlay guides
- Continuously monitor and display lighting level (lux)
- Continuously monitor and display tilt/angle using device gyroscope
- Provide real-time warnings if quality indicators are suboptimal
- Capture high-resolution canvas snapshot from live stream
- Allow retake if user is unsatisfied
- Support image upload via drag & drop or file selection as fallback
- Provide preset sample images as fallback option
- Proceed to Pre-Validation Quality Checks

### 3.6 Pre-Validation Quality Checks

**Automated Quality Validation:**
- Brightness check (detect underexposure or overexposure)
- Contrast check (ensure sufficient detail visibility)
- Grid alignment detection (verify calibration markers are detected)
- Blur detection (assess image sharpness)
- Tilt validation (verify angle is within acceptable range)

**Validation Results:**
- Pass: Proceed to Hybrid Vision Analysis
- Fail: Proceed to Failure Detection & Recapture Guidance

**Functionality:**
- Perform automated quality checks on captured image
- Evaluate brightness, contrast, grid alignment, blur, tilt
- Determine pass/fail status for each check
- Route to appropriate next step based on validation results

### 3.7 Failure Detection & Recapture Guidance

**Failure Screen Display:**
- Prominent message: \"Reliable visual evidence could not be established. Please recapture the sample under better conditions.\"
- Specific failure reasons listed:
  + Severe tilt detected (angle > X degrees)
  + Underexposure (insufficient lighting)
  + Overexposure (excessive lighting)
  + Grid not found (alignment markers not detected)
  + Blurry image (insufficient sharpness)
  + Poor contrast (detail not visible)

**Corrective Guidance:**
- Specific tips for each detected failure:
  + Tilt: \"Hold camera directly above grid, parallel to surface\"
  + Underexposure: \"Move to brighter location or add lighting\"
  + Overexposure: \"Reduce direct light or move to shaded area\"
  + Grid not found: \"Ensure all corner markers are visible in frame\"
  + Blur: \"Hold camera steady and ensure focus before capture\"
  + Contrast: \"Improve lighting conditions for better detail\"

**Recapture Action:**
- \"Recapture with Corrected Settings\" button (1-click action)
- Returns to Enhanced Capture Screen with guidance displayed

**Functionality:**
- Display explicit failure screen when quality checks fail
- List specific failure reasons detected
- Provide actionable corrective guidance for each failure
- Enable immediate recapture with one-click action
- Return to Enhanced Capture Screen with persistent guidance tips

### 3.8 Hybrid Vision Analysis

**Architecture Components:**

**Local Computer Vision Processing:**
- Image normalization
- Calibration-grid detection
- Contour segmentation
- Object detection (used internally when necessary, not exposed as primary metric)
- Spatial coordinates extraction
- Bounding boxes/masks generation

**Gemini Multimodal Analysis:**
- Anomaly reasoning
- Visual defect classification: shriveled, discolored, broken, foreign objects, weed seeds, stones/inorganic
- Contextual explanation of selected patches

**Analysis Modes:**
- Mock/local algorithmic analysis with rich realistic wheat/grain preset samples
- Dynamic upload analysis with interactive spatial coordinates

**Feature Categorization:**
- OBSERVED: visually detected/countable features (broken/damaged candidates, discoloration candidates, foreign objects, visible physical damage, approximate visual size/color characteristics where technically reliable)
- POSSIBLE: visual interpretation requiring confirmation
- UNVERIFIED: measurements requiring laboratory/professional equipment

**Constraints:**
- NEVER fabricate actual laboratory measurements
- Explicitly categorize every feature according to verification status
- If vision system cannot confidently segment or analyze the sample, display: \"Reliable visual evidence could not be established. Please recapture the sample under better conditions.\"
- Do NOT invent results when confidence is low

**Functionality:**
- Process captured image through local CV pipeline
- Send image to Gemini for multimodal analysis
- Detect and classify anomalies (broken/damaged, discolored, foreign objects)
- Generate spatial coordinates for each detected anomaly
- Create bounding boxes/masks for visualization
- Categorize all findings as OBSERVED, POSSIBLE, or UNVERIFIED
- Proceed to Live Audit Result display

### 3.9 Live Audit Result & Interactive Spatial Evidence Viewer

**High-Impact Visual Evidence Dashboard:**

**Summary Metrics Display (Observable Visual Evidence):**
- Broken/Damaged Candidates: percentage (e.g., 6.4%)
- Discoloration Candidates: percentage (e.g., 1.8%)
- Foreign Objects: count (e.g., 2)
- Visible Physical Damage: percentage or count where applicable
- Sample Coverage Quality: indicator
- Capture Quality Score: indicator

**Observable Defect Severity Breakdown:**
- Critical Visual Defects: count and percentage (e.g., severe breakage, large foreign objects)
- Minor Visual Defects: count and percentage (e.g., slight discoloration, small chips)

**Note:** Object/grain counting is used internally by the CV pipeline when necessary but is NOT presented as a primary dashboard metric or headline feature.

**Interactive Spatial Viewer:**
- Display original sample image
- Overlay interactive spatial bounding boxes / pin markers / masks for flagged observations
- Number each detected anomaly with marker
- Provide interactive filtering by category: All, Foreign Objects, Broken/Damaged, Discolored, Visible Damage, Critical Defects, Minor Defects

**Primary Feature - Interactive Zoom & Pan:**
- Tap on numbered marker or metric to trigger smooth zoom and pan into corresponding region
- Highlight selected observation
- Display detailed inspection card for selected observation
- Show observation-specific analysis and classification
- Every finding must link back to the original captured image with interactive bounding box/highlight

**Anomaly Measurement Ruler Tool:**
- Enable ruler tool mode
- Allow users to click two points on the 10cm × 10cm grid
- Calculate and display millimeter distance between points
- Overlay measurement line with distance label
- Reference grid markings for accurate measurement

**Side-by-Side Comparison Tool:**
- Select comparison mode
- Choose comparison target: historical lot audit or baseline grade standard
- Display current audit and comparison target side-by-side
- Highlight differences in observable visual evidence metrics
- Show comparative summary (e.g., \"Broken/Damaged: Current 6.4% vs Historical 4.2%\")

**Multi-Language Toggle:**
- Language selector: English, Hindi, Punjabi
- Apply selected language to all UI text and labels
- Maintain language preference across session

**Disclaimer Display:**
- Prominent disclaimer: \"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.\"

**Functionality:**
- Render high-resolution sample image with overlays
- Enable category-based filtering of visible markers including severity breakdown
- Implement smooth zoom/pan animation on marker selection
- Display contextual inspection cards for individual observations
- Allow navigation between detected observations
- Enable ruler tool for millimeter distance measurement on grid
- Provide side-by-side comparison with historical audits or baseline standards
- Support multi-language toggle (English, Hindi, Punjabi)
- Display epistemic humility disclaimer prominently
- Proceed to Evidence Matrix view

### 3.10 Evidence Matrix

**Table Structure:**

Columns:
- Evidence Item
- Result
- Status (OBSERVED / POSSIBLE / UNVERIFIED)
- Confidence / Method

**Content Categories:**

**OBSERVED VISUAL EVIDENCE:**
- Broken/damaged candidates: percentage
- Foreign object candidates: count
- Discoloration candidates: percentage
- Visible physical damage: percentage or count
- Critical visual defects: count and percentage
- Minor visual defects: count and percentage
- Approximate visual size characteristics (where technically reliable)
- Approximate color characteristics (where technically reliable)
- Sample coverage quality
- Capture quality score

**UNVERIFIED Evidence Items (explicitly included):**
- Moisture: Not tested
- Protein: Not tested
- Internal fungal contamination: Not tested
- Chemical composition / pesticide residue: Not tested
- Falling number / gluten: Not tested
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

### 3.11 Gemini Multimodal Explanation Panel

**Deep-Dive Explanation Structure:**

For selected anomalies, display:
- Finding (description of detected anomaly)
- Visual Evidence (reference to specific image region with interactive bounding box/highlight)
- Visual reasoning (explanation of classification logic)
- Status (OBSERVED VISUAL EVIDENCE / POSSIBLE INTERPRETATION)
- Limitation disclaimer

**Functionality:**
- Provide detailed explanation for user-selected anomalies
- Link explanation to corresponding spatial evidence in image with interactive highlight
- Display visual reasoning process
- Clearly indicate epistemic status of each finding
- Show explicit limitations of visual analysis

### 3.12 Tamper-Evident Evidence Record & Cryptography

**Record Details:**
- Audit ID
- Lot ID
- Crop type
- Capture timestamp
- Location
- Device/session metadata
- Original image reference & hash
- Analysis version
- Evidence findings snapshot (complete data package)

**Cryptographic Hash:**
- Compute genuine SHA-256 cryptographic hash of canonical evidence JSON package
- Display hash value prominently

**Tamper Verification Widget:**
- Allow hash integrity checking
- Enable verification against modified data
- Show verification result (match/mismatch)

**Explanation:**
- Display clear explanation: \"The hash helps detect changes to the recorded digital evidence after creation. It does not prove that the photographed sample was representative of the entire lot.\"

**Functionality:**
- Generate canonical JSON representation of complete evidence package
- Compute SHA-256 hash of evidence package
- Store hash with evidence record
- Provide hash verification interface
- Compare stored hash with recomputed hash to detect tampering
- Display verification status
- Proceed to Evidence Card generation

### 3.13 Evidence Card & Shareable Web Report / Export

**Premium Shareable Report Card:**

Title: KisanDrishti Tamper-Evident Visual Record

Content:
- Audit metadata (ID, crop, lot, timestamp, location)
- Summary metrics (observable visual evidence: broken/damaged candidates, discoloration candidates, foreign objects, defect severity breakdown)
- Key visual evidence thumbnail
- Evidence matrix summary
- Cryptographic hash
- Disclaimer: \"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.\"

**Export Options:**
- Export to PDF
- Printable view
- Shareable web link (recipient view mode without app install requirement)
- Copy Link button
- WhatsApp share with preformatted evidence summary

**Functionality:**
- Generate formatted evidence card
- Render PDF version for download
- Create shareable web link with unique URL
- Format WhatsApp message with evidence summary and link
- Enable one-click sharing to WhatsApp
- Provide copy-to-clipboard functionality for link
- Display recipient view mode for shared links (read-only access)

### 3.14 Evidence History & Repository

**Display Elements:**
- List of previous audits
- Search functionality
- Filter options (by crop, date range, location, status)
- Sort options (by date, crop type, anomaly count)

**Audit List Item Display:**
- Audit ID
- Crop type and variety
- Lot ID
- Capture date/time
- Status tags
- Anomaly summary (broken/damaged, discoloration, foreign objects)
- Quick verify hash button
- Open record button

**Realistic Seed Data:**
- Preloaded sample audits for: Wheat, Basmati Rice, Mustard, Soybean, etc.
- Varied anomaly counts and findings
- Different timestamps and locations

**Functionality:**
- Display searchable and filterable history of audits
- Enable search by audit ID, lot ID, crop type, location
- Provide filtering by crop type, date range, anomaly status
- Sort audit list by various criteria
- Quick hash verification from list view
- Navigate to full audit record on selection
- Display realistic seed data for demonstration purposes

### 3.15 Demo Mode - Fictional Sample

**Demo Mode Label:**
- Clearly labeled as DEMO MODE throughout experience
- Prominent visual indicator distinguishing demo from real audits

**Preloaded Content:**
- High-fidelity wheat sample image
- Annotated anomalies with detailed classifications (broken/damaged, discolored, foreign objects)
- Complete evidence matrix with realistic data
- Interactive spatial viewer with zoom/pan functionality
- Gemini explanation panels for selected anomalies
- Complete evidence record with hash

**Walkthrough Flow:**
- Guided tour of complete audit process
- Interactive exploration of spatial evidence viewer
- Demonstration of zoom/pan inspection feature
- Example evidence matrix and explanations
- Sample shareable report card

**Functionality:**
- Provide dedicated demo mode accessible from dashboard
- Load preloaded fictional wheat sample with rich annotations
- Enable full interactive exploration of all features
- Maintain clear DEMO MODE labeling throughout
- Allow users to experience complete workflow without creating real audit

### 3.16 How It Works

**Content:**
- Explanation of KisanDrishti purpose and positioning: visual evidence protocol, not a grading authority or counting tool
- Step-by-step overview of audit process
- Explanation of visual evidence protocol
- Description of tamper-evident cryptographic hash
- Clarification of what KisanDrishti does and does not provide
- Epistemic humility principles explanation
- Usage guidelines and best practices
- Core message: \"KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.\"

**Functionality:**
- Display informational content about application
- Provide educational material on visual evidence protocol
- Explain limitations and appropriate use cases

---

## 4. Business Rules and Logic

### 4.1 Epistemic Humility Principles

**Feature Categorization:**
- All analysis results must be categorized as OBSERVED, POSSIBLE, or UNVERIFIED
- OBSERVED: Features directly visible in image (broken/damaged candidates, discoloration candidates, foreign objects, visible physical damage, approximate visual size/color characteristics where technically reliable)
- POSSIBLE: Visual interpretations requiring expert confirmation (internal damage indicators, early-stage defects)
- UNVERIFIED: Measurements requiring laboratory equipment (moisture, protein, chemical composition, internal contamination)

**Prohibited Claims:**
- Never provide final commercial grade designation
- Never calculate rupee deductions or price adjustments
- Never claim to provide official mandi grading
- Never fabricate laboratory measurement values
- Never claim legal or financial adjudication authority
- Never present grain/object counting as primary value proposition or headline feature

**Uncertainty Visibility:**
- Confidence scores must be displayed where applicable
- Limitations must be explicitly stated
- Unverified measurements must be clearly labeled as \"Not tested\" or \"Not verified\"
- If vision system cannot confidently segment or analyze sample, display: \"Reliable visual evidence could not be established. Please recapture the sample under better conditions.\"

### 4.2 Visual Evidence Prioritization

**Primary Observable Evidence:**
- Broken/damaged grain candidates
- Discoloration candidates
- Foreign-object candidates
- Visible physical damage
- Critical vs minor visual defects
- Approximate visual size/color characteristics where technically reliable
- Sample coverage and capture quality

**Spatial Evidence Requirement:**
- Every finding must link back to the original captured image with an interactive bounding box/highlight
- Users must be able to zoom/pan to inspect flagged observations
- No finding should be presented without corresponding spatial evidence

**Internal vs. User-Facing Metrics:**
- Object detection/counting may be used internally by the computer-vision pipeline when necessary
- Users should NOT be presented with metrics such as \"412 grains detected\" as core value proposition
- Focus user-facing metrics on observable visual evidence categories

### 4.3 Enhanced Capture Quality Validation

**Real-Time Monitoring:**
- Continuously monitor lighting level (lux) during live camera feed
- Continuously monitor tilt/angle using device gyroscope
- Provide real-time visual feedback (color-coded indicators)
- Display numerical readings for lux and tilt angle

**Pre-Validation Checks:**
- Brightness: Evaluate exposure level, detect underexposure or overexposure
- Contrast: Assess detail visibility and dynamic range
- Grid Alignment: Detect calibration markers, verify all corners visible
- Blur: Measure image sharpness, detect motion blur or focus issues
- Tilt: Validate angle is within acceptable range (e.g., < 10 degrees deviation)

**Failure Thresholds:**
- Severe tilt: angle > 15 degrees
- Underexposure: brightness < threshold value
- Overexposure: brightness > threshold value
- Grid not found: fewer than 4 corner markers detected
- Blur: sharpness score < threshold value
- Poor contrast: contrast ratio < threshold value

**Failure Handling:**
- Trigger explicit failure screen when any check fails
- List specific failure reasons
- Provide actionable corrective guidance
- Enable immediate recapture with one-click action

### 4.4 Defect Severity Classification

**Critical Visual Defects:**
- Severe breakage (grain split into multiple pieces)
- Large foreign objects (stones, metal, plastic)
- Extensive discoloration (mold, rot, severe staining)
- Major physical damage (crushed, severely deformed)

**Minor Visual Defects:**
- Slight discoloration (minor staining, fading)
- Small chips or cracks
- Minor deformation
- Small foreign matter (dust, chaff)

**Classification Logic:**
- Evaluate size, extent, and severity of each detected anomaly
- Assign to Critical or Minor category based on predefined criteria
- Display breakdown in summary metrics and evidence matrix

### 4.5 Measurement Ruler Tool Logic

**Measurement Process:**
- User enables ruler tool mode
- User clicks first point on grid
- User clicks second point on grid
- System calculates pixel distance between points
- System converts pixel distance to millimeters using calibration grid reference (10cm × 10cm = 100mm × 100mm)
- System displays measurement line with distance label

**Calibration Reference:**
- Use detected grid markings (1mm / 1cm ticks) as reference
- Calculate pixel-to-millimeter conversion ratio
- Apply conversion to user-selected measurement

### 4.6 Side-by-Side Comparison Logic

**Comparison Targets:**
- Historical lot audit: Previous audit of same lot ID
- Baseline grade standard: Predefined reference standard for crop type

**Comparison Metrics:**
- Broken/damaged candidates percentage
- Discoloration candidates percentage
- Foreign objects count
- Critical defects count/percentage
- Minor defects count/percentage

**Comparison Display:**
- Show current audit and comparison target side-by-side
- Highlight differences with color-coded indicators (red for worse, green for better, gray for similar)
- Display comparative summary text

### 4.7 Multi-Language Support

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

### 4.8 Cryptographic Hash Logic

**Hash Generation:**
- Create canonical JSON representation of complete evidence package including: audit metadata, image reference, analysis results, timestamp, device metadata
- Compute SHA-256 hash of canonical JSON string
- Store hash with evidence record

**Hash Verification:**
- Retrieve stored evidence record
- Recompute hash from current evidence data
- Compare stored hash with recomputed hash
- Display match/mismatch result
- If mismatch detected, indicate that evidence record has been modified

**Hash Limitations:**
- Hash verifies digital record integrity only
- Hash does not prove sample representativeness of entire lot
- Hash does not prevent creation of fraudulent initial records

### 4.9 Sample Representativeness

**User Responsibility:**
- Application provides tools for standardized capture
- User is responsible for selecting representative sample
- Calibration sheet provides standardized capture area
- Instructions guide user to capture entire sample without cherry-picking

**No Guarantees:**
- Application does not guarantee sample representativeness
- Application does not verify that photographed sample matches actual lot
- Disclaimer clearly states these limitations

### 4.10 Image Quality Requirements

**Quality Indicators:**
- Lighting level (lux estimate)
- Angle/tilt deviation from optimal
- Focus/sharpness assessment
- Calibration grid detection success
- Overall quality score

**Quality Feedback:**
- Real-time warnings during capture if quality indicators are suboptimal
- Recommendations for improving capture conditions
- Allow user to proceed even with quality warnings (user decision)

### 4.11 Data Flow

**Audit Creation Flow:**
1. User enters audit metadata
2. System generates unique audit ID and session identifier
3. User reviews sample preparation checklist
4. User views calibration sheet
5. User captures image using live camera feed with real-time quality monitoring
6. System performs pre-validation quality checks
7. If validation fails, system displays failure screen with recapture guidance
8. If validation passes, system performs local CV processing
9. System sends image to Gemini for multimodal analysis
10. System combines local CV and Gemini results
11. System generates evidence matrix and spatial viewer data (prioritizing observable visual evidence)
12. System computes cryptographic hash of evidence package
13. System stores complete evidence record
14. User can view, share, or export evidence record

**Evidence Sharing Flow:**
1. User selects evidence record to share
2. System generates shareable web link with unique URL
3. System creates formatted evidence card
4. User selects sharing method (link copy, WhatsApp, PDF export)
5. Recipient accesses shared link without app installation
6. Recipient views read-only evidence record
7. Recipient can verify cryptographic hash

---

## 5. Exception and Boundary Conditions

| Scenario | Handling |
|----------|----------|
| Image upload fails | Display error message, allow retry or alternative upload method |
| Camera access denied | Fallback to image upload interface, display permission request guidance |
| Live camera stream fails | Fallback to file upload or preset sample selection |
| Gyroscope/tilt sensor unavailable | Disable tilt monitoring, proceed with other quality checks |
| Lux sensor unavailable | Disable lux monitoring, proceed with brightness analysis from captured image |
| Poor lighting detected | Display warning, provide lighting improvement suggestions, allow user to proceed |
| Severe tilt detected | Trigger failure screen with specific guidance, require recapture |
| Calibration grid not detected | Trigger failure screen with alignment guidance, require recapture |
| Blurry image detected | Trigger failure screen with focus/stability guidance, require recapture |
| Underexposure detected | Trigger failure screen with lighting guidance, require recapture |
| Overexposure detected | Trigger failure screen with lighting reduction guidance, require recapture |
| Vision system cannot confidently analyze sample | Display: \"Reliable visual evidence could not be established. Please recapture the sample under better conditions.\" Do NOT invent results |
| Gemini API unavailable | Fallback to local CV analysis only, display notice that multimodal analysis is unavailable |
| Network connection lost during analysis | Save progress locally, retry when connection restored, display connection status |
| Hash verification fails | Display clear tampering warning, show original vs. current hash values |
| Shared link accessed after record deletion | Display \"Record not found\" message |
| User attempts to edit completed audit | Display message that audits are immutable, suggest creating new audit |
| Sample size not specified | Default to \"Not specified\" in record, allow audit to proceed |
| Location field empty | Default to \"Not specified\" in record, allow audit to proceed |
| No anomalies detected | Display \"No visual anomalies detected\" with appropriate messaging, proceed normally |
| Extremely high anomaly count (>50%) | Display result without judgment, no special handling |
| Unsupported crop type entered | Allow custom text entry, proceed with analysis using general grain detection |
| Multiple users access same shared link simultaneously | Each user gets independent read-only view, no conflict |
| Ruler tool used on non-grid area | Display warning that measurement may be inaccurate outside calibrated grid |
| Comparison target not available | Display message that comparison cannot be performed, proceed without comparison |
| Language change during active audit | Apply language change immediately to all UI elements |
| Recapture after multiple failures | Allow unlimited recapture attempts, provide persistent guidance |

---

## 6. Acceptance Criteria

1. User navigates to KisanDrishti home page and sees application name, tagline \"Evidence Before Valuation\", disclaimer stating the app does not decide crop worth but creates standardized visual evidence, and action buttons
2. User clicks Start New Audit, enters crop type \"Wheat\", lot ID \"LOT-2026-001\", location \"Punjab\", sample size \"250g\", and proceeds
3. User views interactive sample preparation checklist with items (clean grid, even spread, ambient daylight, camera perpendicular), marks items as completed, and proceeds
4. User views calibration sheet with 10cm × 10cm boundary, grid markings, color patches, alignment markers, downloads/prints the sheet, and places wheat sample on it
5. User accesses enhanced capture screen with live camera feed, sees real-time lux meter reading (450 lux, green status), tilt sensor reading (2 degrees, green status), sample boundary overlay, and alignment indicators
6. User captures image using canvas snapshot from live stream, system performs pre-validation quality checks (brightness, contrast, grid alignment, blur, tilt), all checks pass, and proceeds to analysis
7. System processes image through local CV and Gemini analysis, displaying progress indicators
8. User views Live Audit Result dashboard showing observable visual evidence metrics: Broken/Damaged Candidates 6.4%, Discoloration Candidates 1.8%, Foreign Objects 2, Critical Visual Defects 3 (4.2%), Minor Visual Defects 5 (7.1%), with interactive spatial viewer displaying numbered markers for each flagged observation
9. User taps on a \"Foreign Object\" marker, triggering smooth zoom/pan animation to that region with interactive bounding box highlight and displaying detailed inspection card
10. User enables ruler tool, clicks two points on grid, system displays measurement line with distance label \"12.5 mm\"
11. User selects side-by-side comparison mode, chooses historical lot audit as comparison target, views current audit and historical audit side-by-side with comparative summary showing differences in observable metrics
12. User switches language to Hindi using multi-language toggle, all UI text and labels update to Hindi immediately
13. User navigates to Evidence Matrix and sees structured table with OBSERVED categories (broken/damaged candidates, discoloration candidates, foreign objects, critical defects, minor defects) and UNVERIFIED measurements clearly labeled \"Not tested\" (moisture, protein, chemical composition, internal contamination)
14. User views Tamper-Evident Evidence Record showing audit metadata, SHA-256 hash, hash verification widget, and explanation of hash limitations
15. User generates shareable Evidence Card with disclaimer \"KisanDrishti does not decide what the crop is worth\", exports to PDF, and shares via WhatsApp with preformatted message containing evidence summary and web link
16. Recipient opens shared web link without app installation and views read-only evidence record with ability to verify cryptographic hash
17. User navigates to Evidence History, searches for \"Wheat\" audits, filters by date range, and opens a previous audit record showing observable visual evidence summary

---

## 7. Out of Scope for Current Release

- Grain/object counting as primary user-facing metric or headline feature
- Official mandi grading integration
- Laboratory testing integration (moisture meters, protein analyzers, chemical testing equipment)
- Financial calculation features (price estimation, deduction calculation, payment processing)
- Legal adjudication or dispute resolution mechanisms
- Multi-user collaboration features (shared workspaces, team accounts)
- Blockchain integration for evidence storage
- Automated sample collection robotics
- Real-time market price integration
- Buyer/seller matching or marketplace features
- Contract management or transaction tracking
- Offline mode with full functionality
- Advanced statistical analysis or trend reporting across multiple audits
- Integration with government agricultural databases
- Automated notification system for buyers/sellers
- Video capture of sample preparation process
- 3D imaging or depth sensing for volumetric analysis
- Spectroscopy or hyperspectral imaging
- Machine learning model training interface for users
- API access for third-party integrations
- White-label or customization options for different regions/crops
- Automated calibration sheet generation with dynamic QR codes
- Cloud-based image storage and synchronization
- User authentication and account management
- Advanced image editing or enhancement tools
- Batch processing of multiple samples
- Integration with external sensors (dedicated lux meters, professional tilt sensors)
- Automated report generation scheduling
- Custom defect classification training
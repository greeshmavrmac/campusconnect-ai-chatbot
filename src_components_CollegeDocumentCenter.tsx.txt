/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Building, 
  Clock, 
  FileCheck, 
  UserCheck, 
  ClipboardList, 
  AlertCircle,
  HelpCircle,
  X
} from "lucide-react";

interface FAQPair {
  q: string;
  a: string;
}

interface DocumentItem {
  id: string;
  name: string;
  nameTe: string;
  shortDesc: string;
  shortDescTe: string;
  category: "Academic" | "Examination" | "Hostel" | "Accounts" | "Placements" | "Administration";
  purpose: string;
  purposeTe: string;
  requiredDocs: string[];
  requiredDocsTe: string[];
  eligibility: string;
  eligibilityTe: string;
  steps: string[];
  stepsTe: string[];
  office: string;
  officeTe: string;
  processingTime: string;
  processingTimeTe: string;
  importantNotes: string;
  importantNotesTe: string;
  faqs: FAQPair[];
  faqsTe: FAQPair[];
}

const DOCUMENT_DATA: DocumentItem[] = [
  {
    id: "doc_1",
    name: "Bonafide Certificate",
    nameTe: "బోనఫైడ్ సర్టిఫికేట్",
    shortDesc: "Official proof of student enrollment for passports, bank accounts, and concession systems.",
    shortDescTe: "పాస్‌పోర్ట్‌లు, బ్యాంక్ ఖాతాలు మరియు రాయితీ విధానాల కోసం విద్యార్థి ప్రవేశానికి సంబంధించిన అధికారిక రుజువు.",
    category: "Academic",
    purpose: "To certify current academic eligibility, semester details, and student status inside the institution.",
    purposeTe: "సంస్థలో ప్రస్తుత విద్యా అర్హత, సెమిస్టర్ వివరాలు మరియు విద్యార్థి స్థితిని ధృవీకరించడానికి ఉపయోగపడుతుంది.",
    requiredDocs: [
      "College ID Card Copy",
      "Application Form with Mentor endorsement",
      "Previous Semester Marksheet / Admission Challan proof"
    ],
    requiredDocsTe: [
      "కళాశాల ఐడీ కార్డ్ నకలు (జెరాక్స్)",
      "మెంటర్ సంతకంతో కూడిన దరఖాస్తు పత్రం",
      "మునుపటి సెమిస్టర్ మార్కుల జాబితా / అడ్మిషన్ చలాన్ ప్రూఫ్"
    ],
    eligibility: "Currently registered regular student with active records and zero outstanding disciplinary action.",
    eligibilityTe: "ప్రస్తుతం నమోదైన మరియు క్రమశిక్షణా చర్యలు లోపించని విద్యార్థి.",
    steps: [
      "Obtain the Bonafide Application form from Academic Desk counter 2.",
      "Get approval signature from your designated mentor or classroom HOD.",
      "Submit the verified form to the Academic Superintendent desk.",
      "Collect the signed and stamped physical physical certificate."
    ],
    stepsTe: [
      "అకడమిక్ డెస్క్ కౌంటర్ 2 నుండి బోనఫైడ్ దరఖాస్తు ఫారమ్‌ను పొందండి.",
      "మీ కిటాయించిన మెంటర్ లేదా తరగతి HOD నుండి ఆమోదం సంతకం తీసుకోండి.",
      "ధృవీకరించిన దరఖాస్తును అకడమిక్ సూపరింటెండెంట్ డెస్క్ వద్ద సమర్పించండి.",
      "సంతకం మరియు స్టాంప్ వేయబడిన బోనఫైడ్ పత్రాన్ని సేకరించండి."
    ],
    office: "Academic Section Desk Counter 2, Administrative Block Floor 1",
    officeTe: "అకడమిక్ సెక్షన్ డెస్క్ కౌంటర్ 2, అడ్మినిస్ట్రేటివ్ బ్లాక్ మొదటి అంతస్తు",
    processingTime: "1 to 2 Working Days",
    processingTimeTe: "1 నుండి 2 పని దినాలు",
    importantNotes: "Double-check spelling of your full name matching your Class 10/SSC Board sheet during hand-in verification.",
    importantNotesTe: "సమర్పణ సమయంలో మీ పూర్తి పేరు 10వ తరగతి సర్టిఫికేట్ తో సరిపోలుతోందో లేదో సరిచూసుకోండి.",
    faqs: [
      { q: "Is there any extra fee?", a: "No, the standard bonafide is issued free of additional charges for regular terms." },
      { q: "Is digital copy valid?", a: "Most offices require the physically sealed sheet containing Registrar signature." }
    ],
    faqsTe: [
      { q: "ఏదైనా అదనపు రుసుము ఉందా?", a: "లేదు, సాధారణ బోనఫైడ్ ఎటువంటి అదనపు రుసుము లేకుండా ఉచితంగా జారీ చేయబడుతుంది." },
      { q: "డిజిటల్ కాపీ చెల్లుతుందా?", a: "చాలా కార్యాలయాలు రిజిస్ట్రార్ సంతకంతో కూడిన అసలు స్టాంప్ పేపర్‌ను కోరుతాయి." }
    ]
  },
  {
    id: "doc_2",
    name: "Transfer Certificate (TC)",
    nameTe: "బదిలీ ధృవీకరణ పత్రం (TC)",
    shortDesc: "Required validation certificate for outgoing student transfers to join other institutions.",
    shortDescTe: "కళాశాల విడిచి వెళ్ళే విద్యార్థులు ఇతర సంస్థలలో చేరడానికి అవసరమైన ముఖ్యమైన ధృవీకరణ పత్రం.",
    category: "Administration",
    purpose: "To legally relieve a student from institutional roles indicating character and completed academic status.",
    purposeTe: "విద్యార్థి ప్రవర్తన, పూర్తి చేసిన విద్యా స్థితిని సూచిస్తూ కళాశాల నుండి అధికారికంగా ఉపసంహరించడానికి ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Completed and signed No-Due Book / Certificate",
      "Original Admission Letter and SSC Certificate Copy",
      "Student Identity Card to surrender to administration"
    ],
    requiredDocsTe: [
      "పూర్తి చేసిన నో-డ్యూస్ (బకాయిలు లేని) బుక్లెట్",
      "అసలు అడ్మిషన్ లెటర్ మరియు 10వ తరగతి సర్టిఫికేట్ జెరాక్స్",
      "కార్యాలయంలో అప్పగించడానికి విద్యార్థి అసలు ఐడీ కార్డ్"
    ],
    eligibility: "Completed graduates, officially discontinued students with cleared accounts & zero active dues.",
    eligibilityTe: "విద్యాభ్యాసము పూర్తయిన గ్రాడ్యుయేట్లు లేదా అధికారికంగా వైదొలిగి, బకాయిలు లేని విద్యార్థులు.",
    steps: [
      "Get No-Due clearance signed from Office, Lab counters, Sports, Library, and Hostels.",
      "Submit exit application and the stamped No-Due sheet at main counter Counter 3.",
      "The clerk verifies credentials against University registers.",
      "Sign the relief and collection ledger registry inside Office for dispatch."
    ],
    stepsTe: [
      "ఆఫీస్, ల్యాబ్స్, లైబ్రరీ మరియు హాస్టల్‌ల నుండి నో-డ్యూస్ సంతకాలు పొందండి.",
      "నిర్దేశిత దరఖాస్తుతో పాటు నో-డ్యూస్ పత్రాన్ని మెయిన్ ఆఫీస్ కౌంటర్ 3 వద్ద సమర్పించండి.",
      "క్లర్క్ మీ సమాచారాన్ని విశ్వవిద్యాలయ రికార్డులతో సరిపోల్చి ధృవీకరిస్తారు.",
      "కార్యాలయ రికార్డు రిజిస్టర్‌లో సంతకం చేసి బదిలీ పత్రం (TC) ని సేకరించండి."
    ],
    office: "Main Office Counter 3, Admin Building",
    officeTe: "మెయిన్ ఆఫీస్ కౌంటర్ 3, అడ్మినిస్ట్రేటివ్ బిల్డింగ్",
    processingTime: "5 to 7 Working Days",
    processingTimeTe: "5 నుండి 7 పని దినాలు",
    importantNotes: "Duplicate Transfer Certificates can only be processed on filing a police FIR confirming physical loss or accident.",
    importantNotesTe: "TC నష్టపోయినట్లయితే పోలీసు FIR నమోదు చేసిన తర్వాత మాత్రమే నకిలీ TC జారీ చేయబడుతుంది.",
    faqs: [
      { q: "Can my parents collect my TC?", a: "Yes, they must show an authorization letter signed by you and a government verification ID." },
      { q: "What is relief timing?", a: "Office registers TCs daily after 2:30 PM." }
    ],
    faqsTe: [
      { q: "మా తల్లిదండ్రులు నా టీసీని సేకరించవచ్చా?", a: "అవును, మీ సంతకంతో కూడిన అధికారిక అనుమతి పత్రం మరియు ప్రభుత్వ ఐడీ కార్డు చూపించాలి." },
      { q: "సమయాలు ఏమిటి?", a: "కార్యాలయ రిజిస్టర్ ప్రతిరోజూ మధ్యాహ్నం 2:30 గంటల తర్వాత మాత్రమే టీసీలు అందజేస్తుంది." }
    ]
  },
  {
    id: "doc_3",
    name: "Hall Ticket",
    nameTe: "హాల్ టికెట్",
    shortDesc: "Prerequisite admit card generated to access end-semester examination rooms.",
    shortDescTe: "సెమిస్టర్ ముగింపు పరీక్షలకు హాజరు కావడానికి తప్పనిసరిగా ఉండవలసిన అడ్మిట్ కార్డ్.",
    category: "Examination",
    purpose: "To authenticate active student registry, exam registration, and subject lists authorized for final evaluations.",
    purposeTe: "సెమిస్టర్ పరీక్షలకు రిజిస్టర్ అయిన సబ్జెక్టుల జాబితాను మరియు హాజరును ధృవీకరించడానికి ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Paid Exam Registration Fee challan receipt Copy",
      "No-due clearance memo generated in portal account",
      "Attendance clearance from academic counselor (75% minimum metric)"
    ],
    requiredDocsTe: [
      "పరీక్ష ఫీజు చెల్లించిన చలాన్ రసీదు నకలు",
      "పోర్టల్‌లో జనరేట్ అయిన నో-డ్యూస్ క్లియరెన్స్ మెమో",
      "కౌన్సిలర్ నుండి హాజరు శాతం ధృవీకరణ పత్రం (కనీసం 75%)"
    ],
    eligibility: "Active enrolled students meeting academic attendance requirements (75% regular, 65% condoned with fees).",
    eligibilityTe: "సెమిస్టర్ హాజరు ప్రమాణాలు (కనీసం 75%) సాధించి పరీక్ష రుసుము చెల్లించిన విద్యార్థులు.",
    steps: [
      "Log into Student portal within registration deadlines and clear fees.",
      "Check that attendance threshold eligibility condition is satisfied.",
      "Click Download Exam Admit Slip and print the sheet in logical scale.",
      "Present physical sheet to Dept. head for security official stamp."
    ],
    stepsTe: [
      "గడువులోగా స్టూడెంట్ పోర్టల్‌లోకి లాగిన్ అయి పరీక్ష ఫీజు వివరాలు పూర్తి చేయండి.",
      "హాజరు శాతం అర్హత ప్రమాణాలు సరిపోయాయో లేదో నిర్ధారించుకోండి.",
      "డౌన్‌లోడ్ లింక్‌ క్లిక్ చేసి హాల్ టికెట్‌ను ప్రింట్ తీసుకోండి.",
      "అధికారిక స్టాంప్ మరియు హెచ్ఓడి సంతకం కోసం మీ శాఖ కార్యాలయంలో సమర్పించండి."
    ],
    office: "Examination Branch Cell, Block-A Basement Sector 2",
    officeTe: "పరీక్షల విభాగం సెల్, బ్లాక్-A బేస్మెంట్ సెక్టార్ 2",
    processingTime: "Immediate PDF download, 1 working day for stamps",
    processingTimeTe: "వెంటనే డౌన్‌లోడ్ అవుతుంది, ఆఫీస్ స్టాంప్ కోసం 1 రోజు పడుతుంది",
    importantNotes: "Double-check printed registration subjects and elective codes immediately upon extraction to avoid hall seating failures.",
    importantNotesTe: "హాల్ టికెట్ లో ముద్రితమైన సబ్జెక్టులు మరియు కోడ్‌ల వివరాలను ముందే సరిచూసుకోండి.",
    faqs: [
      { q: "Is black and white print valid?", a: "Yes, black/white prints are perfectly functional. Photo must be clear." },
      { q: "What to do if photo is missing online?", a: "Bring 2 passport-sized photos directly to the examination branch supervisor for manual signature." }
    ],
    faqsTe: [
      { q: "బ్లాక్ అండ్ వైట్ ప్రింట్ సరిపోతుందా?", a: "అవును, బ్లాక్ అండ్ వైట్ ప్రింట్ ఆమోదించబడుతుంది కానీ ఫోటో స్పష్టంగా ఉండాలి." },
      { q: "ఆన్‌లైన్ లో ఫోటో లేకపోతే ఏం చేయాలి?", a: "పరీక్షల శాఖ సూపరింటెండెంట్‌ని సంప్రదించి మాన్యువల్ ఫోటో మరియు స్టాంప్ పొందాలి." }
    ]
  },
  {
    id: "doc_4",
    name: "Revaluation Process",
    nameTe: "రీవాల్యుయేషన్ విధానం",
    shortDesc: "Formal academic appeal form to re-verify end-semester exams paper evaluations.",
    shortDescTe: "సెమిస్టర్ పరీక్షల జవాబు పత్రాల మూల్యాంకనాన్ని పునఃపరిశీలించే విధానం.",
    category: "Examination",
    purpose: "To allow students to seek recalculation or fresh grading of marks for any examination script.",
    purposeTe: "పరీక్షల మూల్యాంకనంలో ఏవైనా పొరపాట్లు జరిగితే మార్కుల సవరణ కోసం విద్యార్థులు అప్లై చేసుకునే అవకాశం కల్పిస్తుంది.",
    requiredDocs: [
      "Published Marks Memo sheet PDF copy",
      "Revaluation Application Form printout verified with student profile ID",
      "Paid SBI bank gateway challan copy per paper requested"
    ],
    requiredDocsTe: [
      "వెల్లడైన మార్కుల మెమో పీడీఎఫ్ నకలు (మార్క్స్ షీట్)",
      "విద్యార్థి సమాచారంతో కూడిన రీవాల్యుయేషన్ దరఖాస్తు ప్రతులు",
      "సబ్జెక్టుల వారీగా చెల్లించిన బ్యాంకు చలాన్ రసీదు"
    ],
    eligibility: "Any enrolled regular student with published results can apply within 15 days of official scorecard announcement.",
    eligibilityTe: "ఫలితాలు విడుదలైన 15 రోజుల లోపు సంబంధిత సబ్జెక్టుకు దరఖాస్తు చేసుకోవడానికి ఏ విద్యార్థి అయినా అర్హుడే.",
    steps: [
      "Access Results Portal, select Revaluation Requests ledger subpage.",
      "Check target subjects and pay fees using college transactional gateway.",
      "Submit offline hardcopies at Examination Branch Counter 1.",
      "Verify registration and collect receipt for trace reference."
    ],
    stepsTe: [
      "ఫలితాల పోర్టల్ లోకి వెళ్లి, రీవాల్యుయేషన్ దరఖాస్తు విభాగం ఎంపిక చేసుకోండి.",
      "కావలసిన సబ్జెక్టులను ఎంచుకుని నిర్ణీత రుసుమును ఆన్‌లైన్ పేమెంట్ గేట్‌వే ద్వారా చెల్లించండి.",
      "ప్రింటెడ్ దరఖాస్తు మరియు చలాన్ కాపీని పరీక్షల విభాగం కౌంటర్ 1 వద్ద సమర్పించండి.",
      "రిజిస్ట్రేషన్ నిర్ధారిత రసీదును భద్రపరుచుకోండి."
    ],
    office: "Examination Desk Desk No 1, Main Office Block",
    officeTe: "పరీక్షల డెస్క్ నెం 1, మైన్ ఆఫీస్ బ్లాక్",
    processingTime: "15 to 20 Working Days",
    processingTimeTe: "15 నుండి 20 పని దినాలు",
    importantNotes: "Scores may increase or remain the same after re-evaluation. No negative marks reducing previous marks can be allocated.",
    importantNotesTe: "రీవాల్యుయేషన్ తర్వాత మార్కులు పెరగవచ్చు లేదా మునుపటి మార్కులే ఉండవచ్చు. మార్కులు తగ్గించే అవకాశం లేదు.",
    faqs: [
      { q: "Can I get photo copy of sheet?", a: "Yes, you must submit a combined photocopy request on paying a dedicated additional fee." },
      { q: "Is fee refundable?", a: "No, revaluation fee is strictly non-refundable." }
    ],
    faqsTe: [
      { q: "జవాబు పత్రం ఫోటోకాపీ పొందవచ్చా?", a: "అవును, అదనపు రుసుము చెల్లించి సదరు జవాబు పత్రాల జిరాక్స్ కాపీ పొందటానికి దరఖాస్తు చేయవచ్చు." },
      { q: "ఫీజు తిరిగి ఇవ్వబడుతుందా?", a: "లేదు, దరఖాస్తు రుసుము ఏ దశలోనూ తిరిగి వాపస్ ఇవ్వబడదు." }
    ]
  },
  {
    id: "doc_5",
    name: "Scholarship Application",
    nameTe: "స్కాలర్‌షిప్ దరఖాస్తు విధానం",
    shortDesc: "Annual submission for fee waiver schemes including corporate grants & local reimbursement portals.",
    shortDescTe: "ఫీజు రాయితీ మరియు ప్రభుత్వం అందించే విద్యా దీవెన స్కాలర్‌షిప్ ల కొరకు వార్షిక దరఖాస్తు.",
    category: "Accounts",
    purpose: "To coordinate documentation for financial support, JVD, or merit-based assistance setup.",
    purposeTe: "రాష్ట్ర స్థాయి విద్యా ప్రోత్సాహకాలు మరియు వివిధ అర్హత స్కాలర్‌షిప్ ల నమోదుకు సహాయపడుతుంది.",
    requiredDocs: [
      "Admit Registration letter with state rank slip details",
      "Income certificate valid within current financial fiscal cycle",
      "Caste Certificate copy validated online",
      "Aadhaar details of self and mother linked in banking logs"
    ],
    requiredDocsTe: [
      "ప్రవేశ కార్డు (ర్యాంక్ కార్డు) మరియు సీటు కేటాయింపు పత్రం",
      "ప్రస్తుత ఆర్థిక సంవత్సరానికి సంబంధించి తహశీల్దార్ ఇచ్చిన ఆదాయ ధృవీకరణ పత్రం",
      "ఆన్‌లైన్‌లో ధృవీకరించిన కుల ధృవీకరణ పత్రం (Caste Certificate)",
      "బ్యాంకు ఖాతాతో మరియు ఫోన్‌ నంబర్‌తో అనుసంధానించబడిన తల్లి మరియు విద్యార్థి ఆధార్ కార్డ్‌లు"
    ],
    eligibility: "Active students who satisfy economic reservation limits set by central, state, and college welfare authorities.",
    eligibilityTe: "ప్రభుత్వం నిర్దేశించిన ఆర్థిక శ్రేణులు మరియు రిజర్వేషన్ వర్గాల అర్హత కలిగిన ప్రతి విద్యార్థి.",
    steps: [
      "Complete registration inside official state online welfare system portal first.",
      "Print double-sided hard copies containing reference enrollment ID.",
      "Gather physical copies of income, marks, and registry papers.",
      "File document packets into verified box with accounts supervisor."
    ],
    stepsTe: [
      "మొదటగా అధికారిక ప్రభుత్వ సంబంధిత వెబ్‌సైట్ పోర్టల్‌లో రిజిస్ట్రేషన్ పూర్తి చేయండి.",
      "నమోదు గుర్తింపు సంఖ్య కలిగిన ప్రింటవుట్‌ దరఖాస్తు కాపీ తీసుకోండి.",
      "ఆదాయ, కుల, మునుపటి మార్కుల పత్రాలన్నింటినీ జత చేయండి.",
      "కార్యాలయ అకౌంట్స్ పర్యవేక్షకుడి వద్ద ఫైల్స్ సమర్పించి ఆమోదం పొందండి."
    ],
    office: "Accounts and Scholarship Desk Floor 1, Desk Counter 4",
    officeTe: "అకౌంట్స్ కౌంటర్ 4 మరియు స్కాలర్‌షిప్ డెస్క్ మొదటి అంతస్తు",
    processingTime: "15 to 30 Days (Subject to state dispatch)",
    processingTimeTe: "15 నుండి 30 రోజులు (ప్రభుత్వ ఆమోదం ఆధారంగా)",
    importantNotes: "A continuous 75% biometric attendance rate is absolutely required by government desks to clear automatic semester bank payouts.",
    importantNotesTe: "స్కాలర్‌షిప్ నిధుల విడుదలకు కళాశాల బయోమెట్రిక్ లో కనీసం 75% హాజరు ఉండటం కేంద్ర, రాష్ట్ర నిబంధనల ప్రకారం తప్పనిసరి.",
    faqs: [
      { q: "What is mother bank link?", a: "The mother's bank account must be fully linked with Aadhaar directly mapping JVD settings." },
      { q: "How to correct error?", a: "HOD office coordinates corrections with college verification desks twice a month." }
    ],
    faqsTe: [
      { q: "తల్లి బ్యాంకు ఖాతా ఎందుకు అనుసంధానించాలి?", a: "నిబంధనల ప్రకారం స్కాలర్‌షిప్ నిధులు నేరుగా తల్లి ఖాతాకు జమ అవుతాయి, కాబట్టి ఆధార్ మ్యాపింగ్ తప్పనిసరి." },
      { q: "ఏదైనా తప్పు ఉంటే ఎలా సరిదిద్దాలి?", a: "సంబంధిత విభాగానికి వెళ్లి నిర్దేశిత పత్రాలతో మార్పుల కొరకు దరఖాస్తు చేయవచ్చు." }
    ]
  },
  {
    id: "doc_6",
    name: "Hostel Admission",
    nameTe: "హాస్టల్ అడ్మిషన్ దరఖాస్తు",
    shortDesc: "Initial registration bundle requesting accommodation within campus hostel zones.",
    shortDescTe: "కళాశాల క్యాంపస్ పరిధిలోని హాస్టళ్లలో వసతి కొరకు దరఖాస్తు ఫారమ్.",
    category: "Hostel",
    purpose: "To register outer city students inside security logs, assigning rooms, dining layouts, and emergency coordinates.",
    purposeTe: "సుదూర ప్రాంతాల నుండి వచ్చే విద్యార్థులకు నివాస వసతి కల్పించడం మరియు నిబంధనల నమోదుకు ఇది ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Hostel registration fee slip proof copy",
      "Medical fitness sheet verified by government medical expert",
      "Passports size photo sheets and copy of student academic admit sheet",
      "Parent/guardian emergency contact authorization sheet"
    ],
    requiredDocsTe: [
      "హాస్టల్ రిజిస్ట్రేషన్ ఫీజు చెల్లించిన రసీదు నకలు",
      "ప్రభుత్వ వైద్యునితో ధృవీకరించిన శారీరక దృఢత్వ ధృవీకరణ పత్రం (Medical Fitness Certificate)",
      "పాస్‌పోర్ట్ పరిమాణ ఫోటోలు మరియు ప్రవేశ ధృవీకరణ పత్రం",
      "తల్లిదండ్రులు/సంరక్షకుల అత్యవసర చిరునామా, ఫోన్ నంబర్లు"
    ],
    eligibility: "Regularly enrolled outstation full-time program students, verified with address proofs beyond 50km radius.",
    eligibilityTe: "కళాశాలలో చదువుతూ, నివాస పరిధి 50 కిలోమీటర్ల కంటే దూరంగా ఉన్న విద్యార్థులకు మొదటి ప్రాధాన్యత.",
    steps: [
      "Obtain Vacancy check outline from Administrative Hostel clerk inside dinings Block.",
      "Pay annual room and meal layouts reservation deposit.",
      "Get health fitness cert endorsed and hand over physical details board.",
      "Collect gate lock slip and designated allotment layout card."
    ],
    stepsTe: [
      "డైనింగ్ బ్లాక్ లోని హాస్టల్ క్లర్క్ నుండి ఖాళీ గదుల వివరాలు తెలుసుకోండి.",
      "వార్షిక గది మరియు భోజన ఛార్జీలను చెల్లించి ఆ రసీదు తీసుకోండి.",
      "వైద్యుని సంతకం కలిగిన పత్రాలతో పాటు దరఖాస్తును సంబంధిత ఆఫీస్ కి అప్పగించండి.",
      "రూమ్ మరియు గేట్ అవుటింగ్ పాస్ కార్డును సేకరించండి."
    ],
    office: "Hostel Warden Administrative Building Room 2",
    officeTe: "హాస్టల్ వార్డెన్ కార్యాలయం, అడ్మినిస్ట్రేటివ్ బ్లాక్ గది నెం 2",
    processingTime: "2 to 3 Working Days",
    processingTimeTe: "2 నుండి 3 పని దినాలు",
    importantNotes: "Hostel layout blocks are fresh mapped annually. Seat reservation defaults to clearing prior term bills completely.",
    importantNotesTe: "హాస్టల్ వసతి సీట్లు ప్రతి సంవత్సరం కొత్తగా కేటాయించబడతాయి. పాత బకాయిలు ఉంటే కొత్త సీటు కేటాయింపు నిలిపివేయబడుతుంది.",
    faqs: [
      { q: "Can I choose my room?", a: "Allotments are automated. Mutual roommate change requests are entertained inside the first 2 weeks." },
      { q: "What about laundry?", a: "Laundry setups are handled at dedicated student concession blocks." }
    ],
    faqsTe: [
      { q: "నాకు నచ్చిన గది ఎంచుకోవచ్చా?", a: "గదుల కేటాయింపు కంప్యూటరైజ్డ్ పద్ధతిలో జరుగుతుంది, మ్యూచువల్ మార్పిడి కోసం మొదటి 2 వారాలలో దరఖాస్తు చేసుకోవాలి." },
      { q: "లాండ్రీ సదుపాయం ఉందా?", a: "అవును, విద్యార్థుల కొరకు లాండ్రీ సదుపాయం నిర్ణీత రాయితీలతో అందుబాటులో ఉంది." }
    ]
  },
  {
    id: "doc_7",
    name: "Hostel Clearance",
    nameTe: "హాస్టల్ విముక్తి పత్రం (Hostel Clearance)",
    shortDesc: "Formal clearance certificate required during hostel exit to request caution deposits refunds.",
    shortDescTe: "హాస్టల్ నుండి ఖాళీ చేసేటప్పుడు డిపాజిట్ సొమ్మును తిరిగి పొందటానికి అవసరమైన క్లియరెన్స్ పత్రం.",
    category: "Hostel",
    purpose: "To verify complete furniture handbacks, check utility bills status, clear room keys, and dispatch refunds.",
    purposeTe: "గది సామాగ్రి సరిగా సరిపోల్చడం, హాస్టల్ బకాయిల క్లియరెన్స్ మరియు డిపాజిట్ వెనక్కి పంపడం కొరకు ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Original Caution Deposit Challan Receipt",
      "Room inspection report copy signed by hostel block floor captain",
      "Surrendered key set receipts memo"
    ],
    requiredDocsTe: [
      "హాస్టల్ అడ్మిషన్ సమయం లో చెల్లించిన ఒరిజినల్ కాషన్ డిపాజిట్ చలాన్",
      "హాస్టల్ అంతస్తు ఇన్‌ఛార్జ్ సంతకం చేసిన రూమ్ తనిఖీ నివేదిక నకలు",
      "గది తాళం తాళంచెవులు అప్పగించిన పత్రం"
    ],
    eligibility: "Completed structural coursework students, withdrawals, or students exiting hostel residency bounds.",
    eligibilityTe: "కోర్సు పూర్తి చేసిన గ్రాడ్యుయేట్లు లేదా వ్యక్తిగత కారణాల వల్ల హాస్టల్ నుండి బయటకు వెళ్లే విద్యార్థులు.",
    steps: [
      "Clean vacant room completely and request physical inspection from block warden.",
      "Acquire Warden inspection signatures affirming zero structural room breaks.",
      "Submit physical clearance dossier along with deposit challan at office counter.",
      "Clear final mess bills ledger to begin security deposit backtransfer."
    ],
    stepsTe: [
      "మీ రూమ్ శుభ్రం చేసి భౌతిక తనిఖీ కోసం వార్డెన్ కు సమాచారం ఇవ్వండి.",
      "రూమ్‌లో ఎలాంటి మౌలిక వస్తువుల నష్టం జరగలేదని వార్డెన్‌తో ధృవీకరణ సంతకం తీసుకోండి.",
      "సంతకాలతో కూడిన క్లియరెన్స్ ఫారాన్ని ఒరిజినల్ డిపాజిట్ రసీదుతో ఆఫీస్ లో ఇవ్వండి.",
      "ఖాతా ముతాయంపు పూర్తయిన తర్వాత డిపాజిట్ సొమ్మును మీ ఖాతాకు బదిలీ చేస్తారు."
    ],
    office: "Hostel Block Central Office Warden Desk",
    officeTe: "హాస్టల్ సెంట్రల్ ఆఫీస్ వార్డెన్ డెస్క్",
    processingTime: "3 to 5 Working Days",
    processingTimeTe: "3 నుండి 5 పని దినాలు",
    importantNotes: "Any physical room breakages or un-returned key penalties will be directly adjusted from Caution Deposit balance.",
    importantNotesTe: "గది సామాగ్రి దెబ్బతిని ఉన్నా లేదా కీలు పోగొట్టుకున్నా ఆ నష్టం కాషన్ డిపాజిట్ నుండి మినహాయించబడుతుంది.",
    faqs: [
      { q: "How long does cash back take?", a: "Caution refunds are channeled safely to designated bank accounts within 30 days of office registry." },
      { q: "Is mess card surrendered?", a: "Yes, active high-speed RF mess cards must be returned back." }
    ],
    faqsTe: [
      { q: "కాషన్ డిపాజిట్ ఎంతకాలంలో వస్తుంది?", a: "నివేదిక అందిన 30 రోజులలోగా మీ ఖాతాకు బదిలీ చేయబడుతుంది." },
      { q: "మెస్ కార్డు ఇవ్వాలా?", a: "అవును, ఉపయోగించిన ఆర్‌ఎఫ్ఐడీ (RFID) స్మార్ట్ మెస్ కార్డును కూడా అప్పగించాలి." }
    ]
  },
  {
    id: "doc_8",
    name: "Fee Receipt",
    nameTe: "ఫీజు రసీదు ప్రతులు (Fee Receipt)",
    shortDesc: "Official stamped payment token serving as record confirmation for educational payments.",
    shortDescTe: "ఫీజు చెల్లింపులకు సంబంధించిన అధికారికంగా ముద్రించబడిన ముఖ్యమైన రసీదు.",
    category: "Accounts",
    purpose: "To serve as statutory taxation log and legal receipt proof confirming tuition and miscellaneous fee completions.",
    purposeTe: "ట్యూషన్ ఫీజు లేదా ప్రవేశ రుసుము చెల్లించడానికి సంబంధించిన ప్రభుత్వ మరియు కళాశాల రుజువు.",
    requiredDocs: [
      "Paid challan receipt (student segment) or online transaction proof",
      "Student identity reference information",
      "Previous session due record clearance logs if applicable"
    ],
    requiredDocsTe: [
      "బ్యాంకు లో చెల్లించిన చలాన్ రసీదు లేదా ఆన్‌లైన్ చెల్లింపు స్క్రీన్‌షాట్",
      "విద్యార్థి రోల్ నంబర్ మరియు గుర్తింపు వివరాలు",
      "మునుపటి సెమిస్టర్ బకాయిలు తనిఖీ నివేదిక"
    ],
    eligibility: "Any registered student who successfully deposited educational fees via bank counters or online systems.",
    eligibilityTe: "బ్యాంకు ద్వారా లేదా ఆన్‌లైన్ పేమెంట్ గేట్‌వే ద్వారా ఫీజు చెల్లించిన ప్రతి విద్యార్థి.",
    steps: [
      "Initiate fee payments at bank branch or portal system safely.",
      "Verify that clearance status updates automatically on college registry ledger.",
      "Present digital confirmation code or banking counter sheet to account desk counter.",
      "Claim physically sealed official ledger printout."
    ],
    stepsTe: [
      "కళాశాల ఆన్‌లైన్ గేట్‌వే లేదా నిర్దేశిత బ్యాంకు బ్రాంచ్‌లో ఫీజు చెల్లించండి.",
      "అకౌంట్ లో చెల్లింపు స్థితి అప్‌డేట్ అయిందో లేదో సరిచూసుకోండి.",
      "ఆన్‌లైన్ కన్ఫర్మేషన్ కోడ్ లేదా బ్యాంకు రసీదును అకౌంట్స్ కౌంటర్ వద్ద సమర్పించండి.",
      "అధికారిక ఆఫీస్ స్టాంప్ మరియు సంతకంతో సరికొత్త ఫీజు రసీదును పొందండి."
    ],
    office: "Accounts Section Counter 2, Admin Block Floor 1",
    officeTe: "అకౌంట్స్ సెక్షన్ కౌంటర్ 2, అడ్మినిస్ట్రేటివ్ బ్లాక్ మొదటి అంతస్తు",
    processingTime: "Immediate (Online status takes 24 hours to reconcile)",
    processingTimeTe: "వెంటనే అందుతుంది (ఆన్‌లైన్ చెల్లింపులకి 24 గంటల సమయం పడుతుంది)",
    importantNotes: "Always store hard-copy prints of receipts as they are essential files to claim final end-of-year caution deposits.",
    importantNotesTe: "భవిష్యత్ అవసరాల కోసం మరియు ముగింపులో కాషన్ డిపాజిట్ క్లెయిమ్ చేసుకోవడానికి ఈ రసీదును భద్రపరుచుకోండి.",
    faqs: [
      { q: "Lost official receipt solution?", a: "File a copy loss application. Re-generation fee of Rs.100 applies to print duplicate ledgers." },
      { q: "Can I print online copy?", a: "Online portal generated slips are valid for internal counseling, but physical stamp is required for exit clearance." }
    ],
    faqsTe: [
      { q: "రసీదు పోతే ఎలా ఉపయోగించాలి?", a: "పోగొట్టుకున్న దరఖాస్తును సమర్పించి, 100 రూపాయల పెనాల్టీతో నకిలీ రసీదు పొందవచ్చు." },
      { q: "ఆన్‌లైన్ కాపీ సరిపోతుందా?", a: "సాధారణ అవసరాలకు ఆన్‌లైన్ కాపీ సరిపోతుంది, కానీ కాలేజీ నిష్క్రమణ సమయంలో అసలు స్టాంప్ సంతకం కావాలి." }
    ]
  },
  {
    id: "doc_9",
    name: "Fee Reimbursement",
    nameTe: "ఫీజు రీయింబర్స్మెంట్ దరఖాస్తు",
    shortDesc: "Annual profile clearance confirming scholarship-funded state concessions and JVD reimbursements.",
    shortDescTe: "ఫీజు రీయింబర్స్మెంట్ మరియు స్కాలర్‌షిప్ రాయితీల ధృవీకరణ విధానం.",
    category: "Accounts",
    purpose: "To match government seat allocation records, checking biometric credentials for free education coverage.",
    purposeTe: "రాష్ట్ర స్థాయి ఫీజు మినహాయింపు మరియు సీటు కేటాయింపులను సరిచూడటానికి ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Convener Allotment Letter generated during structural counseling slot",
      "Family income certificate valid per tax board rules",
      "Biometric attendance database registration approval proof",
      "Parent bank account mapping consent documentation"
    ],
    requiredDocsTe: [
      "కౌన్సిలింగ్ సమయం లో లభించిన కన్వీనర్ సీట్ అలాట్‌మెంట్ ఆర్డర్",
      "ప్రభుత్వ నిబంధనల ప్రకారం ధృవీకరించిన వార్షిక ఆదాయ పత్రం",
      "రిజిస్ట్రేషన్ అర్హత తెలిపే బయోమెట్రిక్ హాజరు నమోదు పత్రం",
      "తల్లి బ్యాంకు వివరాలతో కూడిన అంగీకార పత్రం"
    ],
    eligibility: "Students admitted via convener ranks satisfying structural guidelines for full/partial fee reimbursements.",
    eligibilityTe: "కన్వీనర్ కోటా ద్వారా ప్రవేశం పొంది సంబంధిత రాయితీ మార్గదర్శకాలు కలిగిన విద్యార్థులు.",
    steps: [
      "Verify counseling allotment data with Admission Counter officer immediately.",
      "Sign online biometric identity mapping consent forms.",
      "Clear active terminal semester audits via portal interfaces.",
      "Submit online fee reimbursement claim forms to Scholarship Cell."
    ],
    stepsTe: [
      "ముందుగా అడ్మిషన్ల విభాగంలో కన్వీనర్ సీట్ డేటాను సరిచూసుకోండి.",
      "ఆన్‌లైన్ లో మీ బయోమెట్రిక్ సమాచారాన్ని ధృవీకరించండి.",
      "స్కాలర్‌షిప్ సెల్ లో రాయితీ అర్హత దరఖాస్తు కాపీని సమర్పించండి.",
      "ఏదైనా సమస్య ఉన్నట్లయితే హెల్ప్ డెస్కు అధికారులను సంప్రదించండి."
    ],
    office: "Accounts Department - Scholarship Division Block Counter 4",
    officeTe: "అకౌంట్స్ డిపార్ట్‌మెంట్ - స్కాలర్‌షిప్ విభాగం కౌంటర్ 4",
    processingTime: "10 to 14 Working Days to verify",
    processingTimeTe: "10 నుండి 14 పని దినాలు (ధృవీకరణ కొరకు)",
    importantNotes: "Reimbursement is highly dependent on biometric verification. Zero registry inputs will result in state payment declines.",
    importantNotesTe: "హాజరు శాతానికి సంబంధించిన ప్రభుత్వ నిబంధన మీ రాయితీ అమల్లోకి రావడానికి అత్యంత కీలకం.",
    faqs: [
      { q: "Who pays extra charges?", a: "Non-reimbursable elements such as exam paper fees and sports logs must be cleared directly by the student." },
      { q: "Self-finance eligibility?", a: "Yes, eligibility check criteria are outlined inside local notification guidelines." }
    ],
    faqsTe: [
      { q: "అదనపు ఫీజులు ఎవరు చెల్లించాలి?", a: "పరీక్షల ఫీజు మరియు ఇతర చిన్న ఫీజులు నేరుగా విద్యార్థే ఆన్‌లైన్ లో చెల్లించాలి." },
      { q: "సెల్ఫ్-ఫైనాన్స్ సీట్లకు వర్తిస్తుందా?", a: "నిబంధనల ప్రకారం అర్హత కలిగిన అన్ని విభాగాలకు వర్తిస్తుంది." }
    ]
  },
  {
    id: "doc_10",
    name: "Bus Pass Concession Support",
    nameTe: "బస్సు పాస్ రాయితీ మద్దతు",
    shortDesc: "Authenticated state RTC pass confirmation letter verifying concessional transport routes eligibility.",
    shortDescTe: "రాయితీ బస్సు పాస్ పొందుటకు కళాశాల అందించే ప్రయాణ ధృవీకరణ పత్రం.",
    category: "Administration",
    purpose: "To vouch for students commuting on state public transport and authorize local student ticket rates.",
    purposeTe: "దూర ప్రాంతాల నుండి బస్సుల్లో ప్రయాణించే విద్యార్థులకు రాయితీ పాసుల ధృవీకరణ కోసం సహాయపడుతుంది.",
    requiredDocs: [
      "Sealed College Enrollment Fee book snapshot",
      "Two copies of recent passport size photographs",
      "Printed Application from official State Bus Pass Portal database"
    ],
    requiredDocsTe: [
      "స్టాంప్ వేసిన కళాశాల ఫీజు రసీదు నకలు",
      "రెండు సరికొత్త పాస్‌పోర్ట్ సైజు ఫోటోలు",
      "రాష్ట్ర ఆర్టీసీ ఆన్‌లైన్ పోర్టల్‌లో నమోదు చేసిన ప్రింటెడ్ దరఖాస్తు ప్రతులు"
    ],
    eligibility: "Regular student with physical attendance commute matching route map parameters between home sector and campus.",
    eligibilityTe: "నివాస స్థలం నుండి కళాశాలకు ప్రతిరోజూ ప్రయాణించే క్రమం తప్పని పూర్తిస్థాయి విద్యార్థి.",
    steps: [
      "Log into State RTC transport concessions web portal system and register.",
      "Pick target destination depot point matching student residential profile address.",
      "Print application and present to Administrative Counter 1.",
      "Acquire authorized principal signature stamp, then take offline sheets to local RTC Depot."
    ],
    stepsTe: [
      "ఆర్టీసీ బస్ పాస్ అధికారిక వెబ్‌సైట్ లోకి లాగిన్ అయి దరఖాస్తు నమోదు చేయండి.",
      "మీ నివాస చిరునామా ఆధారంగా బస్సు రూట్ మరియు గమ్యస్థానం ఎంచుకోండి.",
      "ప్రింటెడ్ దరఖాస్తుపై అడ్మినిస్ట్రేటివ్ కౌంటర్ 1 కు వెళ్లి సంతకం అడగండి.",
      "కాలేజీ ప్రిన్సిపాల్ సంతకం స్టాంప్ పొందిన తర్వాత ఆర్టీసీ బస్ డిపో వద్ద సమర్పించండి."
    ],
    office: "Administrative Section Main Block Counter Counter 1",
    officeTe: "అడ్మినిస్ట్రేటివ్ ఆఫీస్ మెయిన్ బ్లాక్ కౌంటర్ 1",
    processingTime: "1 to 2 Working Days",
    processingTimeTe: "1 నుండి 2 పని దినాలు",
    importantNotes: "Route maps entered online must reflect realistic closest geographic transit channels to avoid terminal depot declines.",
    importantNotesTe: "దరఖాస్తులో సమర్పించే గమ్యస్థానం తప్పనిసరిగా మీ గుర్తింపు పత్రంలోని చిరునామాతో సరిపోలాలి.",
    faqs: [
      { q: "Is pass dynamic for holiday sessions?", a: "Concession passes have strict calendars mapping current session schedule terms only." },
      { q: "Can I change route?", a: "Route modifications are handled directly at central RTC depot on writing fresh petition." }
    ],
    faqsTe: [
      { q: "సెలవుల్లో పాస్ పని చేస్తుందా?", a: "పాస్ కేవలం విద్యా దినాలు మరియు నిర్ణీత క్యాలెండర్ షెడ్యూల్ ప్రకారం పని చేస్తుంది." },
      { q: "నేను రూట్‌ ని మార్చుకోవచ్చా?", a: "రూట్లలో మార్పులు ఆర్టీసీ డిపో వద్ద కొత్త అర్జీ సమర్పణ ద్వారా మాత్రమే జరుగుతాయి." }
    ]
  },
  {
    id: "doc_11",
    name: "Identity Card (ID)",
    nameTe: "కళాశాల గుర్తింపు కార్డు (ID Card)",
    shortDesc: "Personalized smart security pass granting campus access and library borrow authorizations.",
    shortDescTe: "కళాశాల లోపలికి ప్రవేశించడానికి మరియు లైబ్రరీ సేవలకు అవసరమైన స్మార్ట్ గుర్తింపు కార్డు.",
    category: "Administration",
    purpose: "To coordinate on-campus security checkups, track library checkouts, and log emergency biometric profiles.",
    purposeTe: "క్యాంపస్ భద్రతా పరిశీలనలు, లైబ్రరీ బదిలీలు మరియు బయోమెట్రిక్ నమోదు కోసం ఇది ఉపయోగపడుతుంది.",
    requiredDocs: [
      "College Admission Allotment letter verification printout",
      "Passport sized photo with clean background",
      "Certified details form specifying blood group and emergency contact numbers"
    ],
    requiredDocsTe: [
      "కళాశాల అడ్మిషన్ లెటర్ మరియు కేటాయింపు రసీదు",
      "స్పష్టమైన బ్యాక్‌గ్రౌండ్ కలిగిన పాస్‌పోర్ట్ సైజ్ డిజిటల్ ఫోటో",
      "రక్త గ్రూప్ వివరాలు మరియు అత్యవసర సర్టిఫికేట్ కలిగిన నమోదు ఫారమ్"
    ],
    eligibility: "Fully enrolled students with approved academic roster status inside university master listings.",
    eligibilityTe: "విశ్వవిద్యాలయం మరియు కళాశాల మాస్టర్ రికార్డులలో కన్ఫర్మ్ అయిన ప్రతి విద్యార్థి.",
    steps: [
      "Visit administrative registration sector and fill personal database metadata form.",
      "Select/provide clean digital background portrait photographs.",
      "Register details within main identity division ledger.",
      "Collect RFID smart safety identity card securely."
    ],
    stepsTe: [
      "అడ్మినిస్ట్రేటివ్ రిజిస్ట్రేషన్ విభాగాన్ని సందర్శించి మీ ప్యాకేజీ వివరాలు పూరించండి.",
      "స్టూడెంట్ వింగ్ లో మీ ఫోటో నమూనా సమర్పించండి.",
      "డేటాబేస్ రిజిస్ట్రేషన్ పూర్తయిన తర్వాత ఆమోదం మెసేజ్ వస్తుంది.",
      "కార్డు ముద్రణ ముగిసిన తర్వాత ఆఫీస్ కౌంటర్ నుండి ఆర్ఎఫ్ఐడీ (RFID) ఐడీ కార్డు తీసుకోండి."
    ],
    office: "Student Card Division Counter, Admin Floor Central Wing",
    officeTe: "స్టూడెంట్ ఐడీ కార్డు విభాగం కౌంటర్, అడ్మిన్ మొదటి అంతస్తు",
    processingTime: "1 Working Day",
    processingTimeTe: "1 పని దినం",
    importantNotes: "Lost cards replacement warrants an administrative payment of Rs. 500 via bank challan, followed by a duplicate petition letter.",
    importantNotesTe: "ఐడీ కార్డు పోగొట్టుకున్నట్లయితే 500 రూపాయల చలాన్ చెల్లించి నకిలీ కార్డు కోసం దరఖాస్తు చేయాల్సి ఉంటుంది.",
    faqs: [
      { q: "Is digital pass acceptable?", a: "Digital cards in the Student App serve as provisional entrance checks. Exams require physical plastic card." },
      { q: "How to correct typos?", a: "Submit SSC Board Xerox proof to Card division during morning slots for immediate updates." }
    ],
    faqsTe: [
      { q: "డిజిటల్ కార్డు చెల్లుతుందా?", a: "యాప్ లోని డిజిటల్ కార్డు తాత్కాలిక ప్రవేశానికి ఉపయోగపడుతుంది కానీ పరీక్షకు అసలైన కార్డు ఉండాలి." },
      { q: "తప్పులు ఉంటే ఎలా మార్చాలి?", a: "సరిదిద్దవలసిన స్పెల్లింగ్ వివరాలతో పాటు ఎస్ఎస్సీ కాపీ గాలిలో ఉన్నప్పుడు సమర్పిస్తే వెంటనే మార్చబడుతుంది." }
    ]
  },
  {
    id: "doc_12",
    name: "Internship Permission Letter",
    nameTe: "ఇంటర్న్‌షిప్ అనుమతి పత్రం (Permission Letter)",
    shortDesc: "Official departmental validation confirming permission to accept industrial offsite training.",
    shortDescTe: "పరిశ్రమలలో లేదా కంపెనీలలో ఇంటర్న్‌షిప్ చేయడానికి అవసరమైన అధికారిక అనుమతి పత్రం.",
    category: "Placements",
    purpose: "To shift regular campus attendance credits to vocational offline workspace slots while maintaining student alignment.",
    purposeTe: "సేవలు కోరుతూ వెళ్ళే విద్యార్థుల ఇంటర్న్‌షిప్ సమయాన్ని హాజరు శాతానికి మరియు క్రెడిట్లకు అలైన్ చేయడానికి సహాయపడుతుంది.",
    requiredDocs: [
      "Verified Hiring Offer letter copy from recruiting corporate shell",
      "Consent form signed by student parents",
      "Department clearance registry tracking zero active backlogs status"
    ],
    requiredDocsTe: [
      "సదరు సంస్థ జారీ చేసిన అధికారిక నియామక ఇంటర్న్‌షిప్ లెటర్ నకలు",
      "తల్లిదండ్రుల అంగీకార ఒప్పంద పత్రం",
      "పాత బకాయి సబ్జెక్టులు లేవని తెలిపే విభాగపు క్లియరెన్స్ పత్రం"
    ],
    eligibility: "Pre-final and final year B.Tech students maintaining CGPA averages above 6.5 with zero active backlog loads.",
    eligibilityTe: "బీటెక్ మూడవ లేదా నాల్గవ సంవత్సరం చదువుతూ కనీసం 6.5 సీజీపీఏ సగటుతో బకాయిలు లేని విద్యార్థులు.",
    steps: [
      "Submit recruiter draft to Placement Cell coordinate lead for checkups.",
      "Get request endorsed by departmental HOD specifying absence dates.",
      "Get final approval seal from Dean of Academics registries.",
      "Log digital tracker details into placement registry to activate shift."
    ],
    stepsTe: [
      "కంపెనీ ఆఫర్ లెటర్ ను ముందుగా ప్లేస్‌మెంట్ సెల్ కోఆర్డినేటర్ కు చూపించండి.",
      "ఏ రోజులలో గైర్హాజరు అవుతున్నారో తెలుపుతూ హెచ్ఓడి (HOD) సంతకం పొందండి.",
      "అకడమిక్స్ డీన్ కార్యాలయం నుండి అధికారిక ముద్ర ఆమోదం తీసుకోండి.",
      "హాజరు బదిలీ కొరకు రిజిస్ట్రేషన్ కోడ్ రికార్డులలో అప్‌డేట్ చేయండి."
    ],
    office: "Training & Placement (T&P) Office Room Room 204, Placement Wing",
    officeTe: "శిక్షణ & ప్లేస్‌మెంట్ కార్యాలయం, గది నెం 204",
    processingTime: "2 to 3 Working Days",
    processingTimeTe: "2 నుండి 3 పని దినాలు",
    importantNotes: "Students are strictly expected to submit industrial feedback diaries weekly to coordinate remote attendance audits.",
    importantNotesTe: "ఇంటర్న్‌షిప్ సమయంలో ఆయా వర్క్ రిపోర్టులను ప్రతి వారం మీ గైడ్ కు ఈమెయిల్ చేయాల్సి ఉంటుంది.",
    faqs: [
      { q: "Is stipend logged?", a: "Letter focuses solely on safety context, academic permissions and credits clearance." },
      { q: "Is virtual internship accepted?", a: "Yes, on-approval virtual programs enjoy equivalent structural safety permission tracks." }
    ],
    faqsTe: [
      { q: "స్టైపండ్ వివరాలు రాస్తారా?", a: "లేదు, ఈ పత్రం కేవలం అకడమిక్ అనుమతి మరియు హాజరు కేటాయింపు కొరకు మాత్రమే." },
      { q: "వర్చువల్ ఇంటర్న్‌షిప్ కూడా అనుమతిస్తారా?", a: "అవును, ముందస్తు ఆమోదం ఆధారంగా ఆన్‌లైన్ ఇంటర్న్‌షిప్ లకు కూడా అనుమతి లభిస్తుంది." }
    ]
  },
  {
    id: "doc_13",
    name: "Project Approval Letter",
    nameTe: "ప్రాజెక్టు ఆమోద పత్రం",
    shortDesc: "Departmental project authentication validating abstract synopsis guides selection criteria.",
    shortDescTe: "ల్యాబ్ ప్రాజెక్టులు చేయడానికి సమర్పించే సారాంశం మరియు గైడ్ ఆమోద పత్రం.",
    category: "Academic",
    purpose: "To lock B.Tech minor/major engineering project selections, guiding scope audits before laboratory structures block.",
    purposeTe: "మైనర్ లేదా మేజర్ అకడమిక్ ప్రాజెక్టుల సినాప్సిస్ పరిశీలన మరియు ల్యాబ్ గైడ్ కేటాయింపులకు ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Target Synopsis/Abstract outline signed by academic panels coordinator",
      "Team rosters listing roll IDs and selected guide signature block",
      "Formally formatted request registry document copy"
    ],
    requiredDocsTe: [
      "ప్రాజెక్టు సినాప్సిస్ నివేదిక మరియు సమగ్ర రూపురేఖల కాపీ",
      "ప్రాజెక్టు బృంద సభ్యుల రోల్ నంబర్లు మరియు ఇంటర్నల్ గైడ్ అంగీకార సంతకం",
      "పూర్తిగా నింపిన ప్రాజెక్టు దరఖాస్తు ప్రతులు"
    ],
    eligibility: "Active final-year engineering students scheduled to satisfy structural B.Tech coursework requirements.",
    eligibilityTe: "బీటెక్ లో చివరి విద్యా సంవత్సరంలో ప్రాజెక్ట్ రికార్డుకు అర్హత పొందిన విద్యార్థులు.",
    steps: [
      "Present initial study Synopsis abstract directly to review panel desk.",
      "Acquire internal guide consent signature on abstract draft files.",
      "Submit endorsed proposal papers to Core HOD Desk.",
      "Collect validated approval codes for research journals."
    ],
    stepsTe: [
      "ప్రాజెక్టు సమీక్ష కమిటీకి మీ టాపిక్ సినాప్సిస్ ను సమర్పించండి.",
      "మీ బృందానికి కేటాయించిన ఇంటర్నల్ గైడ్ నుండి సంతకం తీసుకోండి.",
      "ఆమోద పత్రాలను సంబంధిత శాఖ హెచ్ఓడి (HOD) ఆఫీస్ లో ఇవ్వండి.",
      "ప్రాజెక్టు ఆమోద కోడ్ జారీ రికార్డును భద్రపరుచుకోండి."
    ],
    office: "Departmental HOD Office Counter, Core Branch Blocks",
    officeTe: "మీ విభాగానికి సంబంధించిన హెచ్ఓడి (HOD) కార్యాలయం",
    processingTime: "3 to 5 Working Days",
    processingTimeTe: "3 నుండి 5 పని దినాలు",
    importantNotes: "Once project title approvals are legally locked in files, changing topic names or swapping team guides is strictly prohibited.",
    importantNotesTe: "ఒకసారి శీర్షిక (Title) ఆమోదం పొందిన తర్వాత మార్పులు చేయడానికి ఎట్టి పరిస్థితుల్లోనూ అనుమతించబడదు.",
    faqs: [
      { q: "Can teams blend B.tech branches?", a: "Yes, structural inter-disciplinary groups can apply under special Dean approval channels." },
      { q: "Is external guide allowed?", a: "External mentors are accepted once paired with a co-guide from college database registers." }
    ],
    faqsTe: [
      { q: "వేరే బ్రాంచ్ విద్యార్థులతో కలవవచ్చా?", a: "అవును, మల్టీ-డిసిప్లినరీ ఐడియా ఉన్నప్పుడు డీన్ ప్రత్యేక ఆమోదంతో గ్రూపులుగా ఏర్పడవచ్చు." },
      { q: "బాహ్య ప్రాజెక్ట్ గైడ్ కు అనుమతి ఉందా?", a: "అవును, ఇండస్ట్రీ మెంటర్ లతో పాటు పర్యవేక్షణకు కాలేజీ ఇంటర్నల్ గైడ్ కూడా ఉండాలి." }
    ]
  },
  {
    id: "doc_14",
    name: "Migration Certificate",
    nameTe: "వలస ధృవీకరణ పత్రం (Migration Certificate)",
    shortDesc: "Statutory University exit cert facilitating registrations in distant board systems or overseas programs.",
    shortDescTe: "ఇతర విశ్వవిద్యాలయాలు లేదా విదేశీ విద్యాభ్యాసం కొరకు దరఖాస్తు చేసేటప్పుడు కావలసిన సర్టిఫికేట్.",
    category: "Administration",
    purpose: "To release a student profile from University administrative jurisdictions completely without record collides.",
    purposeTe: "విశ్వవిద్యాలయ పరిధి నుండి తాత్కాలికంగా కాకుండా పూర్తిగా వేరే యూనివర్సిటీకి మారడానికి సహాయపడుతుంది.",
    requiredDocs: [
      "Provisional Degree Certificate Xerox copy or final Consolidated scorecard",
      "Surrendered Student Portal ID verification certificate copy",
      "Paid SBI University migration ledger fee receipt token"
    ],
    requiredDocsTe: [
      "ప్రొవిజనల్ డిగ్రీ సర్టిఫికేట్ (PDC) లేదా ఆల్ సెమిస్టర్ మార్క్స్ మెమో కాపీ",
      "surrendered ఐడీ కార్డ్ ధ్రువీకరణ",
      "యూనివర్సిటీ వలస రుసుము చెల్లించిన ఆన్‌లైన్ పేమెంట్ రసీదు"
    ],
    eligibility: "Completed study graduates or students exiting current program to seek seat inside other University systems.",
    eligibilityTe: "కోర్సు పూర్తయిన పట్టభద్రులు లేదా కళాశాల విడిచి వేరే విశ్వవిద్యాలయంలో చేరాలని నిశ్చయించుకున్న విద్యార్థులు.",
    steps: [
      "Access migration request channel located inside JNTU/Affiliated Portal site.",
      "Clear administrative registry fee limits via central portals.",
      "Submit signed printouts and copies of final documents at counter.",
      "Collect dispatch number tracking status updates online."
    ],
    stepsTe: [
      "యూనివర్సిటీ లేదా కాలేజీ అధికారిక పోర్టల్ లో మేగ్రేషన్ దరఖాస్తు విభాగంలోకి వెళ్ళండి.",
      "నిర్ణీత మేగ్రేషన్ రుసుమును ఆన్‌లైన్ గేట్‌వే ద్వారా అనుసంధానించండి.",
      "నింపిన దరఖాస్తును ఒరిజినల్ ప్రొవిజనల్ గుర్తింపుల నకలుతో సమర్పించండి.",
      "మీ చిరునామాకు స్పీడ్ పోస్ట్ ద్వారా వచ్చే పత్రాన్ని సేకరించండి."
    ],
    office: "Affiliated University Registration counter, Block-C Wing 1",
    officeTe: "యూనివర్సిటీ అఫిలియేషన్ రిజిస్ట్రేషన్ కౌంటర్, బ్లాక్-C విభాగం",
    processingTime: "7 to 10 Working Days",
    processingTimeTe: "7 నుండి 10 పని దినాలు",
    importantNotes: "Migration sheets are dispatched strictly via speed post directly to registered address records to preserve safe transport.",
    importantNotesTe: "వలస ధృవీకరణ పత్రాలు రిజిస్టర్డ్ చిరునామాకు నేరుగా స్పీడ్ పోస్ట్ ద్వారా మాత్రమే పంపబడతాయి.",
    faqs: [
      { q: "Is the digital copy available?", a: "Yes, verified graduation profiles can acquire dynamic digitized migration sheets inside DigiLocker accounts." },
      { q: "Emergency express channels exist?", a: "Express fee channels allow immediate same-day office pickups inside university core campus." }
    ],
    faqsTe: [
      { q: "డిజిలాకర్ లో వస్తుందా?", a: "అవును, మీ డిజిలాకర్ ఖాతాలో డిజిటల్ వెర్షన్ కూడా డౌన్‌లోడ్ చేసుకోవచ్చు." },
      { q: "అత్యవసర సౌకర్యం ఉందా?", a: "యూనివర్సిటీ పరిపాలనా కేంద్రానికి నేరుగా హాజరై త్వరితగతిన పొందే సదుపాయం ఉంది." }
    ]
  },
  {
    id: "doc_15",
    name: "No Dues Certificate",
    nameTe: "నో డ్యూస్ క్లియరెన్స్ (No Dues Certificate)",
    shortDesc: "Mandatory master clearance ledger verifying complete financial & departmental settlement.",
    shortDescTe: "కాలేజీలో ఎలాంటి బకాయిలు లేవని తెలిపే అత్యంత కీలకమైన ధృవీకరణ పత్రం.",
    category: "Administration",
    purpose: "To coordinate checks across departments before final exits, ensuring zero physical/financial asset gaps.",
    purposeTe: "కళాశాల విడిచి వెళ్ళేటప్పుడు ఫీజులు, గ్రంథాలయ పుస్తకాలు లేదా ల్యాబ్ సామాగ్రి బకాయిలు లేవని ధృవీకరించుకోవడానికి ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Student Blue Booklet ledger sheet generated from accounts desks",
      "Surrendered Student Identity card checklist ticket",
      "Original fee receipts database record printouts"
    ],
    requiredDocsTe: [
      "అకౌంట్స్ సెక్షన్ జారీ చేసిన బకాయిల వివరాల కాగితం",
      "surrendered ఐడీ కార్డు నమూనా ఆఫీస్ రసీదు",
      "పూర్తిగా చెల్లించిన ఫీజు రికార్డు ప్రతులు"
    ],
    eligibility: "Completed course graduates, terminal exits, or students applying for structural TC transfers.",
    eligibilityTe: "కోర్సు పూర్తయిన విద్యార్థులు లేదా కళాశాల బదిలీ కోరుకునే విద్యార్థులు.",
    steps: [
      "Acquire official Vacant No-Dues blueprint booklet from Main Office Counter 3.",
      "Get physically checked stamp clearance blocks from library, sports and laboratories.",
      "Receive final balance calculation stamp inside Accounts section desk.",
      "Submit the verified compiled book to Registrar Desk to clear files."
    ],
    stepsTe: [
      "మెయిన్ ఆఫీస్ కౌంటర్ 3 నుండి నో-డ్యూస్ బుక్‌లెట్ (No Dues booklet) పొందండి.",
      "లైబ్రరీ, వర్క్‌ షాప్స్, ల్యాబ్స్ మరియు స్పోర్ట్స్ విభాగాలకు వెళ్లి బకాయిలు లేనట్లుగా స్టాంప్ సంతకం తీసుకోండి.",
      "చివరిగా అకౌంట్స్ కౌంటర్ విభాగం నుండి ఫీజు క్లియరెన్స్ సంతకం పొందండి.",
      "పూర్తిగా నిండిన బుక్‌లెట్‌ను రిజిస్ట్రార్ డెస్క్ వద్ద సమర్పించి మీ సర్టిఫికేట్లు పొందండి."
    ],
    office: "Central Administrative Block Main Counters, Base Sector Floor",
    officeTe: "సెంట్రల్ అడ్మినిస్ట్రేటివ్ ఆఫీస్ కౌంటర్లు, గ్రౌండ్ ఫ్లోర్",
    processingTime: "2 to 3 Working Days",
    processingTimeTe: "2 నుండి 3 పని దినాలు",
    importantNotes: "Unreturned library books, broken mechanical test devices, or sports issues will freeze stamps until fine clearances are finished.",
    importantNotesTe: "ఎలక్ట్రానిక్ వస్తువులు, స్పోర్ట్స్ సామాగ్రి లేదా లైబ్రరీ పుస్తకాలు తిరిగి ఇవ్వకపోతే నో-డ్యూస్ క్లియరెన్స్ నిలిపివేయబడుతుంది.",
    faqs: [
      { q: "Lost library-card penalty?", a: "Losing physical library tickets requires Rs.100 clearance payment to receive clearance signature." },
      { q: "Online bypass exists?", a: "Digital no-dues ledger on the student portal is acceptable for regular semester register cycles." }
    ],
    faqsTe: [
      { q: "లైబ్రరీ కార్డు పోతే ఏం చేయాలి?", a: "లైబ్రరీ కార్డు పోతే 100 రూపాయల చలాన్ చెల్లించి ఆలస్య రుసుము క్లియరెన్స్ సంతకం పొందాలి." },
      { q: "ఆన్‌లైన్ లో పొందవచ్చా?", a: "సాధారణ సెమిస్టర్ ముగింపు సమయాల్లో ఆన్‌లైన్ నో-డ్యూస్ సరిపోతుంది, కానీ పూర్తి నిష్క్రమణకు భౌతిక పత్రం కావాలి." }
    ]
  },
  {
    id: "doc_16",
    name: "Exam Registration Approval",
    nameTe: "పరీక్షల రిజిస్ట్రేషన్ దరఖాస్తు",
    shortDesc: "Annual/semester exam fee registration processing validation checklist.",
    shortDescTe: "సెమిస్టర్ పరీక్షల ఫీజు చెల్లింపుల ధృవీకరణ మరియు ఆమోద పత్రాన్ని పొందడం.",
    category: "Examination",
    purpose: "To register target subjects including backlogs, checking attendance limits for exam schedule seats.",
    purposeTe: "సెమిస్టర్ ముగింపు పరీక్షలకు రిజిస్టర్ చేసుకోవడం మరియు సబ్జెక్టుల హాజరును పరీక్షల షెడ్యూల్ కోసం సరిపోల్చడం.",
    requiredDocs: [
      "Fee payment transaction receipt PDF printed safely",
      "Subject selection ledger sheets matching department elective terms",
      "Previous memo scorecard to check prerequisites"
    ],
    requiredDocsTe: [
      "పరీక్ష ఫీజు ఆన్‌లైన్ పేమెంట్ సక్సెస్ రసీదు ప్రతులు",
      "ఎంచుకున్న సబ్జెక్టుల వివరాల విభాగ నివేదిక పత్రం",
      "మునుపటి సెమిస్టర్ మార్కుల మెమో నకలు (కొన్ని సబ్జెక్టులకు అవసరం)"
    ],
    eligibility: "Students on active nominal rolls schedule with minimum class presence standards cleared.",
    eligibilityTe: "హాజరు అర్హత ప్రమాణాలు సాధించిన మరియు సంబంధిత బ్రాంచ్ లో నమోదైన విద్యార్థి.",
    steps: [
      "Select subjects online inside College Exam Engine screen layout.",
      "Complete transaction for exam paper lists.",
      "Submit physical verified register sheets to departmental coordinator clerk.",
      "Get nominal roll ID codes confirmed physically."
    ],
    stepsTe: [
      "కాలేజీ ఎగ్జామ్ గేట్‌వేలో మొదటగా మీ సబ్జెక్టుల వివరాలు సరిచూసుకోండి.",
      "రెగ్యులర్ లేదా బ్యాక్‌లాగ్ పేపర్ల ఫీజు చెల్లింపు ప్రక్రియ పూర్తి చేయండి.",
      "వివరణాత్మక దరఖాస్తు ఫారాన్ని డిపార్ట్‌మెంట్ కోఆర్డినేటర్ కు అప్పగించండి.",
      "పరీక్షల జాబితాలో మీ రోల్ నంబర్ మరియు సీట్ కోడ్ ఆమోదించబడిందో లేదో సరిచూసుకోండి."
    ],
    office: "Examination Branch Wing Section B, Tower Building Flat Room 1",
    officeTe: "పరీక్షల నియంత్రణ విభాగం, టవర్ బిల్డింగ్ గది నెం 1",
    processingTime: "Immediate online registration confirmation",
    processingTimeTe: "ఆన్‌లైన్ లో వెంటనే పూర్తవుతుంది",
    importantNotes: "Late registrations incur progressive penal charges starting from Rs. 200, climbing up to Rs. 2000 as exams close.",
    importantNotesTe: "గడువు తేదీ ముగిసిన తర్వాత పరీక్ష రుసుముతో పాటు అదనపు జరిమానా చెల్లించాల్సి ఉంటుంది.",
    faqs: [
      { q: "Can I register backlogs?", a: "Yes, backlog registration slots map identically beside regular paper selectors." },
      { q: "Payment failure support?", a: "Wait 24 hours. Double billing blocks automatically release or reconcile with exam office banking registries." }
    ],
    faqsTe: [
      { q: "బ్యాక్‌లాగ్ పరీక్షల ఫీజు కలిసి కట్టవచ్చా?", a: "అవును, రెగ్యులర్ సబ్జెక్టులతో పాటు బ్యాక్‌లాగ్ పేపర్లను కూడా సెలెక్ట్ చేసుకునే ఆప్షన్ ఉంటుంది." },
      { q: "పేమెంట్ ఫెయిల్ అయితే ఏం చేయాలి?", a: "24 గంటల పాటు వేచి ఉండండి, డబుల్ డెబిట్ అయిన సొమ్ము తిరిగి బ్యాంక్ ఖాతాకు చేరుతుంది." }
    ]
  },
  {
    id: "doc_17",
    name: "Course Completion Certificate",
    nameTe: "కోర్సు పూర్తి చేసిన ధృవీకరణ పత్రం",
    shortDesc: "Interim certification proving fulfillment of academic structure prior to original degree release.",
    shortDescTe: "డిగ్రీ కాన్వొకేషన్ కంటే ముందే కోర్సు పూర్తి చేసినట్లు తెలియజేసే తాత్కాలిక పత్రం.",
    category: "Academic",
    purpose: "To provide legal verification of completed credits required by recruitment HR panels or immigration visas.",
    purposeTe: "ఉద్యోగ నియామకాలు లేదా ఇతర ఉన్నత విద్యా వీసాల కొరకు క్రెడిట్లు పూర్తి చేసినట్లు రుజువు చూపించడానికి ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Consolidated transcript scorecard containing verified semester records",
      "No-Due certification stamped book signed by Academics Dean office",
      "Verified exit report copy"
    ],
    requiredDocsTe: [
      "అన్ని సెమిస్టర్ల మార్కులను క్రోడీకరించిన ట్రాన్స్‌క్రిప్ట్ నకలు",
      "అకడమిక్స్ డీన్ సంతకం చేసిన నో-డ్యూస్ క్లియరెన్స్ నివేదిక",
      "పూర్తి అయిన ప్రాజెక్టుల ఆమోద పత్రాల నకలు"
    ],
    eligibility: "Completed graduates with approved thesis checks and cleared departmental clearance schedules.",
    eligibilityTe: "అన్ని ల్యాబ్‌లు, పరీక్షలు, ప్రాజెక్టులు పూర్తి చేసుకుని బకాయిలు లేని గ్రాడ్యుయేట్ పట్టభద్రులు.",
    steps: [
      "Complete final semester examinations and project work.",
      "Obtain complete offline No Dues checkup signatures completely.",
      "Submit written application at the Academic Dean desk.",
      "Acquire signed certificate copies for job placements."
    ],
    stepsTe: [
      "చివరి సెమిస్టర్ పరీక్షలు మరియు ప్రాజెక్ట్ సమీక్షలు విజయవంతంగా పూర్తి చేయండి.",
      "కార్యాలయాల నుండి లభించిన పూర్తి నో-డ్యూస్ రిపోర్టును దగ్గర పెట్టుకోండి.",
      "అకడమిక్ డీన్ కార్యాలయం వద్ద నిర్ణీత దరఖాస్తును సేకరించండి.",
      "వైస్-ప్రిన్సిపాల్ లేదా ప్రిన్సిపాల్ సంతకంతో కూడిన కోర్సు కంప్లీషన్ సర్టిఫికేట్ ను పొందండి."
    ],
    office: "Head of Academic Registry, Main Administrative Wing Room 4",
    officeTe: "అకడమిక్ రిజిస్ట్రీ హెడ్ ఆఫీస్, అడ్మినిస్ట్రేటివ్ బ్లాక్ గది నెం 4",
    processingTime: "3 to 4 Working Days",
    processingTimeTe: "3 నుండి 4 పని దినాలు",
    importantNotes: "Verify spelling mapping, date parameters, and overall credits counted to ensure correct certificate match.",
    importantNotesTe: "సర్టిఫికేట్ పై ఉండే మీ పేరు, కోర్సు పీరియడ్ మరియు ఇతర వివరాలను ఎస్ఎస్సీ రికార్డులతో సరిచూసుకోండి.",
    faqs: [
      { q: "Is this equal to degree certificate?", a: "No, this serves as temporary structural verification until University degree convocation is run." },
      { q: "Charge logs exist?", a: "Issued free of charge during structural semester exits." }
    ],
    faqsTe: [
      { q: "ఇది ఒరిజినల్ డిగ్రీ కింద చెల్లుతుందా?", a: "లేదు, ఒరిజినల్ డిగ్రీ యూనివర్సిటీ నుండి వచ్చే వరకు ఇది తాత్కాలిక ప్రత్యామ్నాయంగా మాత్రమే పనిచేస్తుంది." },
      { q: "రుసుము ఏదైనా ఉందా?", a: "లేదు, సాధారణ కోర్సు పూర్తి ముగింపు సమయంలో ఇవి ఉచితంగానే అందజేయబడతాయి." }
    ]
  },
  {
    id: "doc_18",
    name: "Library Clearance",
    nameTe: "గ్రంథాలయ క్లియరెన్స్ (Library Clearance)",
    shortDesc: "Verification check confirming return of borrowed library sheets, cards, and book logs.",
    shortDescTe: "గ్రంథాలయం నుండి తీసుకున్న పుస్తకాలు లేదా కార్డులు బకాయి లేవని ధృవీకరించు విధానం.",
    category: "Academic",
    purpose: "To clear library borrow privileges, surrendering ID linkage so academic sections can dispatch certifications.",
    purposeTe: "గ్రంథాలయ బకాయిలను సరిచూడటం మరియు అకడమిక్స్ క్లియరెన్స్ కోసం లైబ్రరీ కార్డును అప్పగించడం.",
    requiredDocs: [
      "Original physical Library card tickets issued during semester registration",
      "Student Security ID card",
      "Fine receipts checks if late book transactions were logged"
    ],
    requiredDocsTe: [
      "అడ్మిషన్ సమయంలో జారీ చేసిన అసలు లైబ్రరీ కార్డులు (లైబ్రరీ టోకెన్స్)",
      "కాలేజీ స్టూడెంట్ ఐడీ కార్డు",
      "ఏదైనా ఆలస్య రుసుము ఉంటే చెల్లించిన జరిమానా రసీదు చలాన్"
    ],
    eligibility: "Active students withdrawing from college, transferring, or completing final exit semesters.",
    eligibilityTe: "కళాశాల విడిచి వెళ్లే లేదా కోర్సు పూర్తి పూర్తయిన ప్రతి రిజిస్టర్డ్ విద్యార్థి.",
    steps: [
      "Bring all borrowed books block to Library cataloging return desk counters.",
      "Surrender official semester card paper tickets.",
      "Ask Librarian clerk to verify record database history against student roll ID details.",
      "Obtain signatures on No-Due blue book columns."
    ],
    stepsTe: [
      "తీసుకున్న అన్ని పుస్తకాలను గ్రంథాలయ రిటర్న్ డెస్క్ కౌంటర్ వద్ద అప్పగించండి.",
      "మీకు జారీ చేయబడిన అన్ని ఫిజికల్ లైబ్రరీ కార్డులని సరెండర్ చేయండి.",
      "లైబ్రరీ డేటాబేస్ కంప్యూటర్‌లో మీ రికార్డు పూర్తి క్లియరెన్స్ పొందడం నిర్ధారించుకోండి.",
      "నో-డ్యూస్ బుక్‌లెట్ లో లైబ్రరీ స్టాంప్ ఇన్‌ఛార్జ్ సంతకం తీసుకోండి."
    ],
    office: "Central Library Circulation Desk Counter Counter 1",
    officeTe: "సెంట్రల్ లైబ్రరీ సర్క్యులేషన్ డెస్క్ కౌంటర్ 1",
    processingTime: "Immediate",
    processingTimeTe: "వెంటనే లభిస్తుంది",
    importantNotes: "Borrowed books having structural tears or missing elements may need active market cost replacements to acquire clearances.",
    importantNotesTe: "తీసుకున్న పుస్తకం దెబ్బతిన్నట్లయితే దానికి సమానమైన కొత్త పుస్తకాన్ని సేకరించి లైబ్రరీకి కొనుగోలు చేసి ఇవ్వాలి.",
    faqs: [
      { q: "Lost card solutions?", a: "Losing physical library tickets warrants a penalty clearance of Rs. 100 per lost cardboard card." },
      { q: "Can my friend clear?", a: "Books can be dropped by anyone, but surrendering registry cards requires physical verification of student ID." }
    ],
    faqsTe: [
      { q: "లైబ్రరీ కార్డు పోతే ఎలా?", a: "కార్డు పోగొట్టుకున్నట్లయితే ప్రతి కార్డుకు 100 రూపాయల చొప్పున ఆలస్య రుసుము చెల్లించి క్లియరెన్స్ పొందవచ్చు." },
      { q: "స్నేహితులు సమర్పించవచ్చా?", a: "పుస్తకాలు ఎవరైనా అప్పగించవచ్చు, కానీ కార్డు సరెండర్ మరియు సంతకం కొరకు మీరే హాజరు కావాలి." }
    ]
  },
  {
    id: "doc_19",
    name: "Placement Registration",
    nameTe: "ప్లేస్‌మెంట్ రిజిస్ట్రేషన్ దరఖాస్తు",
    shortDesc: "Master verification logging graduates eligible to attend campus recruiter drives.",
    shortDescTe: "క్యాంపస్ ఇంటర్వ్యూలు మరియు ప్లేస్‌మెంట్ డ్రైవ్స్ లో పాల్గొనడానికి కావలసిన రిజిస్ట్రేషన్.",
    category: "Placements",
    purpose: "To align student recruitment profiles, record CGPA values, and organize candidate resume listings.",
    purposeTe: "కళాశాల ఇంటర్వ్యూలు లో పాల్గొనే అర్హత కల విద్యార్థుల ప్రొఫైల్స్, సీజీపీఏ రికార్డులను సమన్వయం చేయుటకు ఇది ఉపయోగపడుతుంది.",
    requiredDocs: [
      "Official Verified Student Master Resume PDF sheet",
      "Consolidated semester score summaries signed by academic dean to prevent score spoofing",
      "Copy of extra-academic certifications portfolio"
    ],
    requiredDocsTe: [
      "పూర్తిగా ధృవీకరించిన మీ వ్యక్తిగత ప్రొఫైల్ (Resume) మరియు సాఫ్ట్ కాపీ",
      "బీటెక్ 6వ సెమిస్టర్ వరకు గల ప్రొవిజనల్ మార్కుల నివేదిక పత్రం",
      "ఇతర అకడమిక్ / టెక్నికల్ సర్టిఫికేట్ల నకలు"
    ],
    eligibility: "Final-year graduation students scheduled for career exits with zero active disciplinary logs.",
    eligibilityTe: "క్యాంపస్ ఇంటర్వ్యూలలో కూర్చోవడానికి అర్హత కలిగి, క్రమశిక్షణ కేసులు లేని ఆఖరి సంవత్సరం విద్యార్థులు.",
    steps: [
      "Access Training & Placement dashboard page safely during announcement dates.",
      "Complete educational parameter logs specifying verified SGPA averages.",
      "Upload correct verified master resume document profile sheets.",
      "Present verified portfolio file copies physically to Placement officer counter."
    ],
    stepsTe: [
      "ప్లేస్‌మెంట్స్ విభాగం షెడ్యూల్ ప్రకటించిన సమయంలో అధికారిక పోర్టల్ లాగిన్ అవ్వండి.",
      "మీ సెమిస్టర్ల వారీ మార్కుల రికార్డు వివరాలను డేటాబేస్ పట్టికలకు సరిపోల్చండి.",
      "ధృవీకరించిన సమాచారంతో కూడిన రిజ్యూమ్ కాపీని పోర్టల్ లో అప్‌లోడ్ చేయండి.",
      "ధృవీకరణ పత్రాలను ప్లేస్‌మెంట్ సెల్ కోఆర్డినేటర్ కు అప్పగించి ఆమోదం సంతకం పొందండి."
    ],
    office: "Training & Placement Cell Division, Building Room B-205",
    officeTe: "శిక్షణ & ప్లేస్‌మెంట్ విభాగం కార్యాలయం, గది నెం B-205",
    processingTime: "1 to 2 Working Days to verify credentials",
    processingTimeTe: "1 నుండి 2 పని దినాలు (సమాచార తనిఖీ తర్వాత)",
    importantNotes: "Once a candidate is securely placed above baseline salary slots, they are legally mapped as placed in internal registry dashboards.",
    importantNotesTe: "ఒక కంపెనీలో ఉద్యోగం వచ్చిన తర్వాత, కళాశాల నిబంధనల ప్రకారం లభించే ఇతర డ్రైవ్ ల కొరకు ప్రత్యేక నియామక నియమ నిబంధనలు వర్తిస్తాయి.",
    faqs: [
      { q: "Is registry mandatory?", a: "Yes, candidates who miss placement verification cannot access college recruiter drive invites." },
      { q: "Can I update resume later?", a: "Resume edits are blocked 24 hours prior to scheduled industry drive slots to prevent registry sync errors." }
    ],
    faqsTe: [
      { q: "రిజిస్ట్రేషన్ తప్పనిసరిగా చేసుకోవాలా?", a: "అవును, రిజిస్ట్రేషన్ లేని విద్యార్థులు కళాశాలలో జరిగే ఏ డ్రైవ్లకు హాజరు కావడానికి వీలుపడదు." },
      { q: "రిజ్యూమ్ మార్చుకోవచ్చా?", a: "డ్రైవ్ ప్రారంభానికి 24 గంటల ముందే మార్పులకు అవకాశం ఉంటుంది, ముగిసిన తర్వాత మార్చుకోలేరు." }
    ]
  }
];

const CATEGORIES = ["All", "Academic", "Examination", "Hostel", "Accounts", "Placements", "Administration"] as const;

export default function CollegeDocumentCenter({ language }: { language: "en" | "te" | "auto" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>("purpose");

  const isTe = language === "te";

  // Filter documents based on search queries & categories
  const filteredDocs = useMemo(() => {
    return DOCUMENT_DATA.filter((doc) => {
      const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
      const textToSearch = `${doc.name} ${doc.nameTe} ${doc.shortDesc} ${doc.shortDescTe} ${doc.category} ${doc.office} ${doc.officeTe}`.toLowerCase();
      const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const selectedDocObj = useMemo(() => {
    return DOCUMENT_DATA.find((doc) => doc.id === selectedDocId) || null;
  }, [selectedDocId]);

  const uiLabels = {
    titleEn: "College Document Center",
    titleTe: "కళాశాల డాక్యుమెంట్ సెంటర్",
    searchPlaceholderEn: "Search Bonafide, Bus Pass, Hall Ticket, Revaluation, etc...",
    searchPlaceholderTe: "బోనఫైడ్, బస్ పాస్, హాల్ టికెట్, రీవాల్యుయేషన్ మొదలైన వాటి కోసం సెర్చ్ చేయండి...",
    allDocsEn: "All Documents",
    allDocsTe: "అన్ని పత్రాలు",
    purposeEn: "Full Purpose",
    purposeTe: "పూర్తి ప్రయోజనం",
    reqDocsEn: "Required Documents Checklist",
    reqDocsTe: "కావలసిన పత్రాల జాబితా (Checklist)",
    eligibilityEn: "Academic/Finance Eligibility",
    eligibilityTe: "అర్హత ప్రమాణాలు",
    stepsEn: "Step-by-Step Processing Path",
    stepsTe: "ధరఖాస్తు మరియు పూర్తి చేయు విధానం",
    officeEn: "Designated Office to Visit",
    officeTe: "సంప్రదించవలసిన కార్యాలయం విభాగం",
    processingTimeEn: "Estimated Processing Time",
    processingTimeTe: "అంచనా వేయబడిన సమయం",
    importantNotesEn: "Critical Notes",
    importantNotesTe: "ముఖ్యమైన గమనికలు",
    faqEn: "Frequently Asked Questions",
    faqTe: "తరచుగా అడిగే ప్రశ్నలు (FAQ)",
    viewDetailsEn: "View Process Details",
    viewDetailsTe: "పూర్తి వివరాలు చూడండి",
    noDocsEn: "No matching official document found inside college handbook catalogs.",
    noDocsTe: "కళాశాల రికార్డులలో ఈ పత్రం లేదా సమాచారం లభించలేదు.",
    filtersTitleEn: "Departments Catalog",
    filtersTitleTe: "విభాగాల కేటలాగ్",
    backEn: "Back to List",
    backTe: "తిరిగి జాబితాకు వెళ్ళండి",
    detailsHeaderEn: "HandBook Protocol",
    detailsHeaderTe: "హ్యాండ్ బుక్ ప్రోటోకాల్",
    docHeadingEn: "Official Institution Processes Ledger",
    docHeadingTe: "అధికారిక కళాశాల పత్రాల క్లియరెన్స్ సెంటర్"
  };

  const currentTitle = isTe ? uiLabels.titleTe : uiLabels.titleEn;
  const currentSearchPlaceholder = isTe ? uiLabels.searchPlaceholderTe : uiLabels.searchPlaceholderEn;
  const currentHeading = isTe ? uiLabels.docHeadingTe : uiLabels.docHeadingEn;

  const toggleAccordion = (sectionName: string) => {
    setOpenAccordion(openAccordion === sectionName ? null : sectionName);
  };

  return (
    <div className="flex-grow flex flex-col bg-white h-full text-slate-800 overflow-hidden font-sans relative antialiased selection:bg-slate-200">
      
      {/* Detail overlay/panel structure mapping simple human view */}
      {selectedDocObj ? (
        <div className="flex-1 flex flex-col h-full bg-white select-text relative overflow-y-auto">
          {/* Header of Detail Pane */}
          <div className="border-b border-slate-200 p-5 md:p-6 bg-slate-50 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3 space-x-1">
              <button 
                onClick={() => setSelectedDocId(null)}
                className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 cursor-pointer transition shrink-0 flex items-center gap-1.5 text-xs font-semibold select-none border border-slate-250 bg-white"
              >
                <X className="w-4 h-4" />
                <span>{isTe ? uiLabels.backTe : uiLabels.backEn}</span>
              </button>
              <div className="h-5 w-[1px] bg-slate-300 hidden sm:block"></div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest bg-slate-200 text-slate-900 border border-slate-300">
                {isTe ? uiLabels.detailsHeaderTe : uiLabels.detailsHeaderEn}
              </span>
            </div>
            
            <div className="text-[10px] font-mono p-1 text-slate-400 select-none font-semibold">
              ID: {selectedDocObj.id} • Category: {selectedDocObj.category}
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
            <div className="space-y-3 pb-6 border-b border-slate-250">
              <div className="inline-block px-2.5 py-0.5 rounded-sm text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                {selectedDocObj.category.toUpperCase()}
              </div>
              <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight leading-tighter">
                {isTe ? selectedDocObj.nameTe : selectedDocObj.name}
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
                {isTe ? selectedDocObj.shortDescTe : selectedDocObj.shortDesc}
              </p>
            </div>

            {/* Accordions Stack styling */}
            <div className="space-y-3">
              
              {/* Accordion 1: Purpose */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("purpose")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.purposeTe : uiLabels.purposeEn}</span>
                  </span>
                  {openAccordion === "purpose" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "purpose" && (
                  <div className="p-5 border-t border-slate-200 bg-white leading-relaxed text-sm text-slate-700">
                    {isTe ? selectedDocObj.purposeTe : selectedDocObj.purpose}
                  </div>
                )}
              </div>

              {/* Accordion 2: Required Documents */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("reqDocs")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <ClipboardList className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.reqDocsTe : uiLabels.reqDocsEn}</span>
                  </span>
                  {openAccordion === "reqDocs" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "reqDocs" && (
                  <div className="p-5 border-t border-slate-200 bg-white">
                    <ul className="space-y-3.5">
                      {(isTe ? selectedDocObj.requiredDocsTe : selectedDocObj.requiredDocs).map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-900 border border-slate-350 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Eligibility */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("eligibility")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.eligibilityTe : uiLabels.eligibilityEn}</span>
                  </span>
                  {openAccordion === "eligibility" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "eligibility" && (
                  <div className="p-5 border-t border-slate-200 bg-white leading-relaxed text-sm text-slate-700">
                    {isTe ? selectedDocObj.eligibilityTe : selectedDocObj.eligibility}
                  </div>
                )}
              </div>

              {/* Accordion 4: Steps */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("steps")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.stepsTe : uiLabels.stepsEn}</span>
                  </span>
                  {openAccordion === "steps" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "steps" && (
                  <div className="p-5 border-t border-slate-200 bg-white">
                    <div className="space-y-4">
                      {(isTe ? selectedDocObj.stepsTe : selectedDocObj.steps).map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start text-sm">
                          <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="text-slate-750 leading-relaxed pt-0.5 flex-1">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 5: Office Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("office")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.officeTe : uiLabels.officeEn}</span>
                  </span>
                  {openAccordion === "office" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "office" && (
                  <div className="p-5 border-t border-slate-200 bg-white text-sm">
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-semibold">
                      <Building className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                      <span>{isTe ? selectedDocObj.officeTe : selectedDocObj.office}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 6: Processing Time */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("time")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.processingTimeTe : uiLabels.processingTimeEn}</span>
                  </span>
                  {openAccordion === "time" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "time" && (
                  <div className="p-5 border-t border-slate-200 bg-white text-sm">
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 font-semibold">
                      <Clock className="w-5 h-5 text-slate-700 shrink-0" />
                      <span>{isTe ? selectedDocObj.processingTimeTe : selectedDocObj.processingTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 7: Notes */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("notes")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.importantNotesTe : uiLabels.importantNotesEn}</span>
                  </span>
                  {openAccordion === "notes" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "notes" && (
                  <div className="p-5 border-t border-slate-200 bg-white text-sm font-medium leading-relaxed text-amber-900 bg-amber-50/40 border-l-3 border-l-amber-500">
                    {isTe ? selectedDocObj.importantNotesTe : selectedDocObj.importantNotes}
                  </div>
                )}
              </div>

              {/* Accordion 8: FAQs */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <button
                  onClick={() => toggleAccordion("faqs")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer font-bold text-sm text-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-slate-700" />
                    <span>{isTe ? uiLabels.faqTe : uiLabels.faqEn}</span>
                  </span>
                  {openAccordion === "faqs" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === "faqs" && (
                  <div className="p-5 border-t border-slate-200 bg-white space-y-5">
                    {(isTe ? selectedDocObj.faqsTe : selectedDocObj.faqs).map((faq, fIdx) => (
                      <div key={fIdx} className="space-y-1.5 pb-4 last:pb-0 border-b border-slate-100 last:border-b-0">
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                          Q: {faq.q}
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          A: {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Document Master list with Search Grid */
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Main Top Header Block of Card grid */}
          <div className="border-b border-slate-200 bg-slate-50 p-6 md:p-8 shrink-0 space-y-6">
            <div className="max-w-4xl mx-auto space-y-2">
              <h1 className="text-xl md:text-2.5xl font-extrabold text-slate-900 tracking-tight leading-none">
                {currentTitle}
              </h1>
              <p className="text-slate-500 text-xs md:text-sm font-medium">
                {currentHeading}
              </p>
            </div>

            {/* Input Search Container */}
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full shadow-xs bg-white border border-slate-300 focus-within:border-slate-500 rounded-xl transition duration-150 px-4 py-3 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentSearchPlaceholder}
                  className="w-full bg-transparent border-none text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Flat B&W Category Picker Section */}
            <div className="max-w-4xl mx-auto space-y-2.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono">
                {isTe ? uiLabels.filtersTitleTe : uiLabels.filtersTitleEn}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-bold leading-none tracking-wide uppercase transition border cursor-pointer select-none ${
                        isActive
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                      }`}
                    >
                      {cat === "All" ? (isTe ? uiLabels.allDocsTe : "All") : cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Catalog Cards section scrolling container */}
          <div className="flex-1 overflow-y-auto bg-white px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="border border-slate-200 hover:border-slate-450 rounded-xl p-5 bg-white shadow-3xs transition duration-150 flex flex-col justify-between group space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-mono uppercase font-extrabold tracking-widest text-slate-400 bg-slate-50 p-1 rounded-sm border border-slate-200">
                            {doc.category}
                          </span>
                        </div>
                        <h3 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                          {isTe ? doc.nameTe : doc.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                          {isTe ? doc.shortDescTe : doc.shortDesc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-450 font-mono tracking-tight font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isTe ? doc.processingTimeTe : doc.processingTime}</span>
                        </span>
                        
                        <button
                          onClick={() => {
                            setSelectedDocId(doc.id);
                            setOpenAccordion("purpose"); // default open first accordion
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1 inline-flex shrink-0 select-none"
                        >
                          <span>{isTe ? uiLabels.viewDetailsTe : uiLabels.viewDetailsEn}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state of documents search filter */
                <div className="text-center py-16 px-4 border border-dashed border-slate-250 bg-slate-50/50 rounded-3xl max-w-lg mx-auto">
                  <div className="text-2xl mb-2 select-none">📁</div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {isTe ? "ఫలితాలు లభించలేదు" : "No Document Match"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    {isTe ? uiLabels.noDocsTe : uiLabels.noDocsEn}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

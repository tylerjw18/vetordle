const DIAGNOSES = [
  // Endocrine
  "Hypothyroidism","Hyperthyroidism","Diabetes mellitus","Diabetic ketoacidosis",
  "Hyperadrenocorticism","Hypoadrenocorticism","Primary hyperparathyroidism",
  "Hypoparathyroidism","Insulinoma","Phaeochromocytoma","Diabetes insipidus","Acromegaly",
  // Gastrointestinal
  "Parvoviral enteritis","Acute pancreatitis","Chronic pancreatitis",
  "Exocrine pancreatic insufficiency","Inflammatory bowel disease",
  "Protein-losing enteropathy","Gastric dilatation-volvulus","Intestinal foreign body",
  "Intussusception","Megaesophagus","Gastric ulceration","Haemorrhagic gastroenteritis",
  "Giardiasis","Anal sacculitis","Perianal fistula","Intestinal lymphoma","Colitis",
  "Oesophageal stricture","Campylobacteriosis","Tritrichomonas infection",
  // Hepatic / Biliary
  "Hepatic lipidosis","Portosystemic shunt","Copper-associated hepatopathy",
  "Chronic hepatitis","Cholangitis","Cholangiohepatitis","Hepatic neoplasia",
  "Gallbladder mucocoele","Biliary obstruction","Hepatic encephalopathy",
  // Renal / Urinary
  "Chronic kidney disease","Acute kidney injury","Pyelonephritis",
  "Glomerulonephritis","Protein-losing nephropathy","Feline lower urinary tract disease",
  "Calcium oxalate urolithiasis","Struvite urolithiasis","Uroabdomen",
  "Urethral obstruction","Renal dysplasia","Polycystic kidney disease",
  // Cardiac
  "Dilated cardiomyopathy","Hypertrophic cardiomyopathy","Restrictive cardiomyopathy",
  "Mitral valve disease","Tricuspid valve dysplasia","Pericardial effusion",
  "Cardiac tamponade","Congestive heart failure","Heartworm disease",
  "Aortic stenosis","Pulmonic stenosis","Ventricular septal defect",
  "Arrhythmogenic right ventricular cardiomyopathy","Atrial fibrillation",
  "Sick sinus syndrome","Taurine-deficient cardiomyopathy",
  // Respiratory
  "Bacterial pneumonia","Aspiration pneumonia","Feline asthma","Chronic bronchitis",
  "Tracheal collapse","Brachycephalic obstructive airway syndrome","Pleural effusion",
  "Chylothorax","Pyothorax","Pneumothorax","Pulmonary hypertension",
  "Pulmonary thromboembolism","Laryngeal paralysis","Nasopharyngeal polyp",
  "Nasal tumour","Angiostrongylus infection",
  // Neurological
  "Intervertebral disc disease","Degenerative myelopathy","Fibrocartilaginous embolism",
  "Atlantoaxial instability","Wobbler syndrome","Idiopathic epilepsy",
  "Structural epilepsy","Meningoencephalitis of unknown origin",
  "Granulomatous meningoencephalomyelitis","Feline ischaemic encephalopathy",
  "Peripheral vestibular syndrome","Central vestibular syndrome",
  "Myasthenia gravis","Polymyositis","Trigeminal neuritis","Facial nerve paralysis",
  "Hydrocephalus","Cerebellar abiotrophy",
  // Dermatological
  "Atopic dermatitis","Food-responsive dermatosis","Flea allergy dermatitis",
  "Generalised demodicosis","Localised demodicosis","Sarcoptic mange","Cheyletiellosis",
  "Dermatophytosis","Pemphigus foliaceus","Pemphigus vulgaris",
  "Discoid lupus erythematosus","Systemic lupus erythematosus","Sebaceous adenitis",
  "Alopecia X","Calcinosis cutis","Superficial pyoderma","Deep pyoderma",
  "Malassezia dermatitis","Cutaneous lymphoma","Skin fold pyoderma",
  // Musculoskeletal
  "Hip dysplasia","Cranial cruciate ligament rupture","Patellar luxation",
  "Elbow dysplasia","Osteochondritis dissecans","Hypertrophic osteodystrophy",
  "Panosteitis","Legg-Calvé-Perthes disease","Septic arthritis",
  "Immune-mediated polyarthritis","Osteomyelitis","Masticatory muscle myositis",
  "Bicipital tenosynovitis","Osteosarcoma",
  // Ophthalmic
  "Corneal ulceration","Corneal sequestrum","Anterior uveitis","Glaucoma",
  "Retinal detachment","Lens luxation","Keratoconjunctivitis sicca","Entropion",
  "Ectropion","Prolapsed nictitans gland","Cataracts","Progressive retinal atrophy",
  "Feline herpesvirus keratitis","Iris melanosis",
  // Haematological / Oncological
  "Immune-mediated haemolytic anaemia","Immune-mediated thrombocytopenia",
  "Evans syndrome","Iron deficiency anaemia","Multicentric lymphoma",
  "Alimentary lymphoma","Mediastinal lymphoma","Mast cell tumour",
  "Splenic haemangiosarcoma","Hepatic haemangiosarcoma","Fibrosarcoma",
  "Oral melanoma","Mammary carcinoma","Thyroid carcinoma","Histiocytic sarcoma",
  "Thymoma","Multiple myeloma","Transitional cell carcinoma",
  // Reproductive
  "Pyometra","Benign prostatic hyperplasia","Prostatic abscess","Orchitis",
  "Cryptorchidism","Dystocia","Mastitis","Vaginitis","Ovarian remnant syndrome",
  "Testicular tumour",
  // Infectious / Parasitic
  "Feline infectious peritonitis","Feline leukaemia virus","Feline immunodeficiency virus",
  "Canine distemper","Leptospirosis","Toxoplasmosis","Neosporosis","Blastomycosis",
  "Histoplasmosis","Aspergillosis","Cryptococcosis","Babesiosis","Ehrlichiosis",
  "Rocky Mountain spotted fever","Leishmaniosis",
  // Toxicological
  "Xylitol toxicity","NSAID toxicity","Paracetamol toxicity","Permethrin toxicity",
  "Lily toxicity","Grape and raisin toxicity","Zinc toxicity",
  "Anticoagulant rodenticide toxicity","Ethylene glycol toxicity","Chocolate toxicity",
  "Metaldehyde toxicity","Organophosphate toxicity","Sago palm toxicity",
  // Metabolic / Nutritional
  "Hypercalcaemia","Hypocalcaemia","Hypokalaemia","Hyperkalaemia","Hyponatraemia",
  "Uraemic encephalopathy","Nutritional secondary hyperparathyroidism",
].sort();

module.exports = { DIAGNOSES };

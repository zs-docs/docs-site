# Clinical Terminology Integration

## 🎯 Overview

Comprehensive clinical terminology integration for ZARISH HIS with Bangladesh healthcare context and Rohingya refugee support.

## 🏥 Bangladesh Clinical Terminology

### Localized Medical Terms

```xml
<!-- CodeSystem/bangladesh-conditions.xml -->
<CodeSystem xmlns="http://hl7.org/fhir">
  <id value="bangladesh-conditions"/>
  <url value="https://zarish-his.com/fhir/CodeSystem/bangladesh-conditions"/>
  <name value="BangladeshConditions"/>
  <title value="Bangladesh Medical Conditions"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Bangladesh-specific medical condition codes with Bengali translations"/>
  
  <content value="complete"/>
  <caseSensitive value="false"/>
  
  <concept>
    <code value="BD-FEV-001"/>
    <display value="Fever"/>
    <designation>
      <language value="bn"/>
      <value value="জ্বর"/>
    </designation>
    <designation>
      <language value="en"/>
      <use>
        <system value="http://snomed.info/sct"/>
        <code value="900000000000013009"/>
        <display value="Synonym"/>
      </use>
      <value value="Pyrexia"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="386661006"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-DIA-001"/>
    <display value="Diarrhea"/>
    <designation>
      <language value="bn"/>
      <value value="ডায়রিয়া"/>
    </designation>
    <designation>
      <language value="en"/>
      <use>
        <system value="http://snomed.info/sct"/>
        <code value="900000000000013009"/>
        <display value="Synonym"/>
      </use>
      <value value="Loose stools"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="49427004"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-DIA-002"/>
    <display value="Diabetes Mellitus"/>
    <designation>
      <language value="bn"/>
      <value value="ডায়াবেটিস মেলিটাস"/>
    </designation>
    <designation>
      <language value="en"/>
      <use>
        <system value="http://snomed.info/sct"/>
        <code value="900000000000013009"/>
        <display value="Synonym"/>
      </use>
      <value value="Diabetes"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="73211009"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-HYP-001"/>
    <display value="Hypertension"/>
    <designation>
      <language value="bn"/>
      <value value="উচ্চ রক্তচাপ"/>
    </designation>
    <designation>
      <language value="en"/>
      <use>
        <system value="http://snomed.info/sct"/>
        <code value="900000000000013009"/>
        <display value="Synonym"/>
      </use>
      <value value="High blood pressure"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="38341003"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-ARI-001"/>
    <display value="Acute Respiratory Infection"/>
    <designation>
      <language value="bn"/>
      <value value="তীব্র শ্বাসযন্ত্রের সংক্রমণ"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="16922000"/>
    </property>
  </concept>
</CodeSystem>
```

### Bangladesh Laboratory Tests

```xml
<!-- CodeSystem/bangladesh-lab-tests.xml -->
<CodeSystem xmlns="http://hl7.org/fhir">
  <id value="bangladesh-lab-tests"/>
  <url value="https://zarish-his.com/fhir/CodeSystem/bangladesh-lab-tests"/>
  <name value="BangladeshLabTests"/>
  <title value="Bangladesh Laboratory Tests"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Bangladesh-specific laboratory test codes with Bengali translations"/>
  
  <content value="complete"/>
  <caseSensitive value="false"/>
  
  <concept>
    <code value="BD-LAB-HEM-001"/>
    <display value="Hemoglobin Test"/>
    <designation>
      <language value="bn"/>
      <value value="হিমোগ্লোবিন পরীক্ষা"/>
    </designation>
    <property>
      <code value="loinc-equivalent"/>
      <valueCode value="55915-6"/>
    </property>
    <property>
      <code value="unit"/>
      <valueString value="g/dL"/>
    </property>
    <property>
      <code value="reference-range"/>
      <valueString value="Male: 13.5-17.5, Female: 12.0-15.5 g/dL"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-LAB-GLU-001"/>
    <display value="Blood Glucose Test"/>
    <designation>
      <language value="bn"/>
      <value value="রক্ত গ্লুকোজ পরীক্ষা"/>
    </designation>
    <property>
      <code value="loinc-equivalent"/>
      <valueCode value="2345-7"/>
    </property>
    <property>
      <code value="unit"/>
      <valueString value="mg/dL"/>
    </property>
    <property>
      <code value="reference-range"/>
      <valueString value="Fasting: 70-100, Random: 70-140 mg/dL"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-LAB-CRP-001"/>
    <display value="C-Reactive Protein"/>
    <designation>
      <language value="bn"/>
      <value value="সি-রিঅ্যাক্টিভ প্রোটিন"/>
    </designation>
    <property>
      <code value="loinc-equivalent"/>
      <valueCode value="1988-5"/>
    </property>
    <property>
      <code value="unit"/>
      <valueString value="mg/L"/>
    </property>
    <property>
      <code value="reference-range"/>
      <valueString value="&lt;3.0 mg/L"/>
    </property>
  </concept>
</CodeSystem>
```

### Bangladesh Medications

```xml
<!-- CodeSystem/bangladesh-medications.xml -->
<CodeSystem xmlns="http://hl7.org/fhir">
  <id value="bangladesh-medications"/>
  <url value="https://zarish-his.com/fhir/CodeSystem/bangladesh-medications"/>
  <name value="BangladeshMedications"/>
  <title value="Bangladesh Medications"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Bangladesh-specific medication codes with Bengali translations"/>
  
  <content value="complete"/>
  <caseSensitive value="false"/>
  
  <concept>
    <code value="BD-MED-001"/>
    <display value="Paracetamol 500mg Tablet"/>
    <designation>
      <language value="bn"/>
      <value value="প্যারাসিটামল ৫০০মিগি ট্যাবলেট"/>
    </designation>
    <property>
      <code value="generic-name"/>
      <valueString value="Paracetamol"/>
    </property>
    <property>
      <code value="atc-code"/>
      <valueCode value="N02BE01"/>
    </property>
    <property>
      <code value="dosage-form"/>
      <valueString value="Tablet"/>
    </property>
    <property>
      <code value="strength"/>
      <valueString value="500mg"/>
    </property>
  </concept>
  
  <concept>
    <code value="BD-MED-002"/>
    <display value="Amoxicillin 500mg Capsule"/>
    <designation>
      <language value="bn"/>
      <value value="অ্যামোক্সিসিলিন ৫০০মিগি ক্যাপসুল"/>
    </designation>
    <property>
      <code value="generic-name"/>
      <valueString value="Amoxicillin"/>
    </property>
    <property>
      <code value="atc-code"/>
      <valueCode value="J01CA04"/>
    </property>
    <property>
      <code value="dosage-form"/>
      <valueString value="Capsule"/>
    </property>
    <property>
      <code value="strength"/>
      <valueString value="500mg"/>
    </property>
  </concept>
</CodeSystem>
```

## 🏕️ Rohingya Clinical Terminology

### Refugee-Specific Conditions

```xml
<!-- CodeSystem/rohingya-conditions.xml -->
<CodeSystem xmlns="http://hl7.org/fhir">
  <id value="rohingya-conditions"/>
  <url value="https://zarish-his.com/fhir/CodeSystem/rohingya-conditions"/>
  <name value="RohingyaConditions"/>
  <title value="Rohingya Refugee Conditions"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Rohingya refugee-specific medical conditions with Burmese translations"/>
  
  <content value="complete"/>
  <caseSensitive value="false"/>
  
  <concept>
    <code value="RH-CHOL-001"/>
    <display value="Cholera"/>
    <designation>
      <language value="my"/>
      <value value="အစာအိမ်ရောဂါ"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="কলেরা"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="63650001"/>
    </property>
    <property>
      <code value="refugee-specific"/>
      <valueBoolean value="true"/>
    </property>
  </concept>
  
  <concept>
    <code value="RH-MAL-001"/>
    <display value="Malaria"/>
    <designation>
      <language value="my"/>
      <value value="ငှက်ဖျားရောဂါ"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="ম্যালেরিয়া"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="14744001"/>
    </property>
    <property>
      <code value="refugee-specific"/>
      <valueBoolean value="true"/>
    </property>
  </concept>
  
  <concept>
    <code value="RH-PTB-001"/>
    <display value="Pulmonary Tuberculosis"/>
    <designation>
      <language value="my"/>
      <value value="ချောင်းရောင်ရောဂါ"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="যক্ষ্মা"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="56717001"/>
    </property>
    <property>
      <code value="refugee-specific"/>
      <valueBoolean value="true"/>
    </property>
  </concept>
  
  <concept>
    <code value="RH-MAL-002"/>
    <display value="Acute Malnutrition"/>
    <designation>
      <language value="my"/>
      <value value="ချို့တဲ့ခြင်းရောဂါ"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="তীব্র অপুষ্টি"/>
    </designation>
    <property>
      <code value="snomed-equivalent"/>
      <valueCode value="78419002"/>
    </property>
    <property>
      <code value="refugee-specific"/>
      <valueBoolean value="true"/>
    </property>
  </concept>
</CodeSystem>
```

### Refugee Health Services

```xml
<!-- CodeSystem/refugee-health-services.xml -->
<CodeSystem xmlns="http://hl7.org/fhir">
  <id value="refugee-health-services"/>
  <url value="https://zarish-his.com/fhir/CodeSystem/refugee-health-services"/>
  <name value="RefugeeHealthServices"/>
  <title value="Refugee Health Services"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Rohingya refugee health service codes with multilingual support"/>
  
  <content value="complete"/>
  <caseSensitive value="false"/>
  
  <concept>
    <code value="RHS-OPD-001"/>
    <display value="Camp OPD Service"/>
    <designation>
      <language value="my"/>
      <value value="စခားပြင်ပဌာန်းဆေးကုသည်"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="ক্যাম্প বহির্বিভাগ সেবা"/>
    </designation>
    <property>
      <code value="service-type"/>
      <valueString value="outpatient"/>
    </property>
    <property>
      <code value="unhcr-standard"/>
      <valueString value="SPHERE-Health"/>
    </property>
  </concept>
  
  <concept>
    <code value="RHS-MCH-001"/>
    <display value="Maternal and Child Health"/>
    <designation>
      <language value="my"/>
      <value value="မိခင်နှင့်ကလေးကျန်မာရေး"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="মাতৃ ও শিশু স্বাস্থ্য"/>
    </designation>
    <property>
      <code value="service-type"/>
      <valueString value="maternal-child-health"/>
    </property>
    <property>
      <code value="unhcr-standard"/>
      <valueString value="MCH-Handbook"/>
    </property>
  </concept>
  
  <concept>
    <code value="RHS-NUT-001"/>
    <display value="Nutrition Support Program"/>
    <designation>
      <language value="my"/>
      <value value="အာဟာရထောက်ပံ့မှုအစီအစဉ်"/>
    </designation>
    <designation>
      <language value="bn"/>
      <value value="পুষ্টি সহায়তা কর্মসূচি"/>
    </designation>
    <property>
      <code value="service-type"/>
      <valueString value="nutrition"/>
    </property>
    <property>
      <code value="unhcr-standard"/>
      <valueString value="CMAM"/>
    </property>
  </concept>
</CodeSystem>
```

## 🔗 Terminology Mapping

### SNOMED CT Integration

```xml
<!-- ConceptMap/snomed-bangladesh-rohingya.xml -->
<ConceptMap xmlns="http://hl7.org/fhir">
  <id value="snomed-bangladesh-rohingya"/>
  <url value="https://zarish-his.com/fhir/ConceptMap/snomed-bangladesh-rohingya"/>
  <name value="SNOMEDBangladeshRohingya"/>
  <title value="SNOMED CT to Bangladesh and Rohingya Terminology"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Mapping SNOMED CT concepts to Bangladesh and Rohingya terminology"/>
  
  <sourceScope>
    <uri value="http://snomed.info/sct"/>
  </sourceScope>
  <targetScope>
    <uri value="https://zarish-his.com/fhir/CodeSystem/bangladesh-conditions"/>
  </targetScope>
  <targetScope>
    <uri value="https://zarish-his.com/fhir/CodeSystem/rohingya-conditions"/>
  </targetScope>
  
  <group>
    <source value="http://snomed.info/sct"/>
    <target value="https://zarish-his.com/fhir/CodeSystem/bangladesh-conditions"/>
    
    <!-- Fever -->
    <element>
      <code value="386661006"/>
      <display value="Fever"/>
      <target>
        <code value="BD-FEV-001"/>
        <display value="জ্বর (Fever)"/>
        <equivalence value="equivalent"/>
        <comment value="Common condition in Bangladesh"/>
      </target>
    </element>
    
    <!-- Diarrhea -->
    <element>
      <code value="49427004"/>
      <display value="Diarrhea"/>
      <target>
        <code value="BD-DIA-001"/>
        <display value="ডায়রিয়া (Diarrhea)"/>
        <equivalence value="equivalent"/>
        <comment value="Common in refugee camps"/>
      </target>
    </element>
    
    <!-- Diabetes Mellitus -->
    <element>
      <code value="73211009"/>
      <display value="Diabetes mellitus"/>
      <target>
        <code value="BD-DIA-002"/>
        <display value="ডায়াবেটিস মেলিটাস (Diabetes Mellitus)"/>
        <equivalence value="equivalent"/>
        <comment value="Growing concern in Bangladesh"/>
      </target>
    </element>
  </group>
  
  <group>
    <source value="http://snomed.info/sct"/>
    <target value="https://zarish-his.com/fhir/CodeSystem/rohingya-conditions"/>
    
    <!-- Cholera -->
    <element>
      <code value="63650001"/>
      <display value="Cholera"/>
      <target>
        <code value="RH-CHOL-001"/>
        <display value="အစာအိမ်ရောဂါ (Cholera)"/>
        <equivalence value="equivalent"/>
        <comment value="Refugee camp specific concern"/>
      </target>
    </element>
    
    <!-- Malaria -->
    <element>
      <code value="14744001"/>
      <display value="Malaria"/>
      <target>
        <code value="RH-MAL-001"/>
        <display value="ငှက်ဖျားရောဂါ (Malaria)"/>
        <equivalence value="equivalent"/>
        <comment value="Endemic in refugee areas"/>
      </target>
    </element>
  </group>
</ConceptMap>
```

### LOINC Integration

```xml
<!-- ConceptMap/loinc-bangladesh-lab.xml -->
<ConceptMap xmlns="http://hl7.org/fhir">
  <id value="loinc-bangladesh-lab"/>
  <url value="https://zarish-his.com/fhir/ConceptMap/loinc-bangladesh-lab"/>
  <name value="LOINCBangladeshLab"/>
  <title value="LOINC to Bangladesh Laboratory Tests"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Mapping LOINC codes to Bangladesh laboratory test terminology"/>
  
  <sourceScope>
    <uri value="http://loinc.org"/>
  </sourceScope>
  <targetScope>
    <uri value="https://zarish-his.com/fhir/CodeSystem/bangladesh-lab-tests"/>
  </targetScope>
  
  <group>
    <source value="http://loinc.org"/>
    <target value="https://zarish-his.com/fhir/CodeSystem/bangladesh-lab-tests"/>
    
    <!-- Hemoglobin -->
    <element>
      <code value="55915-6"/>
      <display value="Hemoglobin [Mass/volume] in Blood"/>
      <target>
        <code value="BD-LAB-HEM-001"/>
        <display value="হিমোগ্লোবিন পরীক্ষা (Hemoglobin Test)"/>
        <equivalence value="equivalent"/>
        <comment value="Standard hemoglobin test"/>
      </target>
    </element>
    
    <!-- Blood Glucose -->
    <element>
      <code value="2345-7"/>
      <display value="Glucose [Mass/volume] in Blood"/>
      <target>
        <code value="BD-LAB-GLU-001"/>
        <display value="রক্ত গ্লুকোজ পরীক্ষা (Blood Glucose Test)"/>
        <equivalence value="equivalent"/>
        <comment value="Common diabetes screening"/>
      </target>
    </element>
    
    <!-- C-Reactive Protein -->
    <element>
      <code value="1988-5"/>
      <display value="C reactive protein [Mass/volume] in Serum or Plasma"/>
      <target>
        <code value="BD-LAB-CRP-001"/>
        <display value="সি-রিঅ্যাক্টিভ প্রোটিন (C-Reactive Protein)"/>
        <equivalence value="equivalent"/>
        <comment value="Inflammation marker"/>
      </target>
    </element>
  </group>
</ConceptMap>
```

## 📊 Clinical Decision Support

### Bangladesh-Specific Rules

```xml
<!-- Library/bangladesh-clinical-rules.xml -->
<Library xmlns="http://hl7.org/fhir">
  <id value="bangladesh-clinical-rules"/>
  <url value="https://zarish-his.com/fhir/Library/bangladesh-clinical-rules"/>
  <name value="BangladeshClinicalRules"/>
  <title value="Bangladesh Clinical Decision Support Rules"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Clinical decision support rules for Bangladesh healthcare context"/>
  
  <type>
    <coding>
      <system value="http://terminology.hl7.org/CodeSystem/library-type"/>
      <code value="logic-library"/>
    </coding>
  </type>
  
  <content>
    <contentType value="text/cql"/>
    <data value="library BangladeshClinicalRules version '1.0.0'
      
      // Bangladesh-specific clinical rules
      
      // Dengue fever screening rule
      define 'DengueFeverScreening':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and exists (
              E.reasonCode C where C.coding[0].code = 'BD-FEV-001'
            )
            and exists (
              [Observation: 'BD-LAB-PLT-001'] O
                where O.value &lt; 100000 // Platelet count &lt; 100,000
            )
      
      // Diabetes screening rule
      define 'DiabetesScreening':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and E.subject.ageInYears &gt;= 40
            and not exists (
              [Condition: 'BD-DIA-002'] C
                where C.verificationStatus = 'refuted'
            )
      
      // Hypertension screening rule
      define 'HypertensionScreening':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and E.subject.ageInYears &gt;= 30
            and exists (
              [Observation: 'BD-LAB-BP-001'] O
                where O.value.systolic &gt; 140 or O.value.diastolic &gt; 90
            )
      
      // Malnutrition screening for refugees
      define 'RefugeeMalnutritionScreening':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and exists (
              E.extension[0].url = 'https://zarish-his.com/fhir/StructureDefinition/refugee-status'
            )
            and exists (
              [Observation: 'BD-LAB-BMI-001'] O
                where O.value &lt; 18.5 // BMI &lt; 18.5
            )
    "/>
  </content>
</Library>
```

### Refugee Health Rules

```xml
<!-- Library/refugee-health-rules.xml -->
<Library xmlns="http://hl7.org/fhir">
  <id value="refugee-health-rules"/>
  <url value="https://zarish-his.com/fhir/Library/refugee-health-rules"/>
  <name value="RefugeeHealthRules"/>
  <title value="Rohingya Refugee Health Rules"/>
  <status value="active"/>
  <date value="2026-01-21"/>
  <publisher value="ZARISH Health Systems"/>
  <description value="Clinical decision support rules for Rohingya refugee health"/>
  
  <type>
    <coding>
      <system value="http://terminology.hl7.org/CodeSystem/library-type"/>
      <code value="logic-library"/>
    </coding>
  </type>
  
  <content>
    <contentType value="text/cql"/>
    <data value="library RefugeeHealthRules version '1.0.0'
      
      // Rohingya refugee-specific clinical rules
      
      // Cholera outbreak alert
      define 'CholeraOutbreakAlert':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and exists (
              E.extension[0].url = 'https://zarish-his.com/fhir/StructureDefinition/refugee-status'
            )
            and exists (
              [Condition: 'RH-CHOL-001'] C
                where C.verificationStatus = 'confirmed'
            )
            and Count(
              [Condition: 'RH-CHOL-001'] C2
                where C2.recordedDate during 'Interval[Today - 3 days, Today]'
            ) &gt;= 5
      
      // Malaria prophylaxis recommendation
      define 'MalariaProphylaxisRecommendation':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and exists (
              E.extension[0].url = 'https://zarish-his.com/fhir/StructureDefinition/refugee-status'
            )
            and not exists (
              [MedicationRequest: 'BD-MED-MAL-001'] M
                where M.status = 'active'
            )
      
      // Malnutrition intervention
      define 'MalnutritionIntervention':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and exists (
              E.extension[0].url = 'https://zarish-his.com/fhir/StructureDefinition/refugee-status'
            )
            and exists (
              [Observation: 'RH-MAL-002'] O
                where O.value &lt; 16 // BMI &lt; 16 for severe malnutrition
            )
      
      // Mental health screening
      define 'MentalHealthScreening':
        ['Encounter'] E
          where E.period.start during 'Day of Today'
            and exists (
              E.extension[0].url = 'https://zarish-his.com/fhir/StructureDefinition/refugee-status'
            )
            and not exists (
              [Observation: 'RH-MHS-001'] O
                where O.issued during 'Interval[Today - 6 months, Today]'
            )
    "/>
  </content>
</Library>
```

---

**Guide Version**: 1.0  
**Last Updated**: January 2026  
**Compliance**: Clinical Terminology Standards

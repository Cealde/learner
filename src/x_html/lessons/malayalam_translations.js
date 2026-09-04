// ============================================================
// MALAYALAM TRANSLATIONS & AI LOCALIZATION DICTIONARY
// ============================================================

export const MALAYALAM_UI = {
  sidebarTitle: 'പാഠഭാഗങ്ങൾ',
  twinBadge: 'പഠനസഹായി',
  backJourney: '← പഠനയാത്ര',
  exitLesson: 'പുറത്തുകടക്കുക',
  progress: 'പുരോഗതി',
  prevPage: '← മുമ്പത്തെ പേജ്',
  nextPage: 'അടുത്ത പേജ് →',
  run: 'റൺ ചെയ്യുക',
  debug: 'ഡീബഗ്ഗ് ചെയ്യുക',
  step: 'അടുത്ത വരി (Step)',
  continue: 'തുടരുക (Continue)',
  reset: 'റീസെറ്റ്',
  clear: 'മായ്ക്കുക',
  editorTitle: 'പൈത്തൺ കോഡ് എഡിറ്റർ',
  editorSubtitle: 'ബ്രേക്ക്പോയിൻ്റ് ഇടാൻ വരിയുടെ ഇടത് വശത്ത് ക്ലിക്ക് ചെയ്യുക',
  taskBadge: 'ടാസ്ക് ലക്ഷ്യം',
  targetOutputHeader: 'പ്രതീക്ഷിക്കുന്ന ഫലം',
  memoryTitle: 'മെമ്മറിയും വേരിയബിളുകളും',
  noVars: 'സജീവ വേരിയബിളുകൾ ഒന്നുമില്ല. മെമ്മറി പരിശോധിക്കാൻ "Debug" അല്ലെങ്കിൽ "Step" ക്ലിക്ക് ചെയ്യുക.',
  outputTitle: 'ഔട്ട്പുട്ട് കൺസോൾ',
  termReady: 'പൈത്തൺ 3.13 ഇൻ്ററാക്ടീവ് എൻവയൺമെൻ്റ് സജ്ജമാണ്.',
  termHint: 'കോഡ് പ്രവർത്തിപ്പിക്കാൻ "Run" അല്ലെങ്കിൽ "Debug" ക്ലിക്ക് ചെയ്യുക.'
};

export const MALAYALAM_MODULE_NAMES = {
  1: [
    '0.1 • കമ്പ്യൂട്ടർ എന്ന യന്ത്രം',
    '0.1 • അടിസ്ഥാന ക്വിസ്',
    '0.2 • കോഡ് പ്രവർത്തിപ്പിക്കൽ',
    '0.2 • ഡീബഗ്ഗിംഗ് ക്വിസ്'
  ],
  2: [
    '1.1 • കോഡ് എഡിറ്റർ',
    '1.1 • എഡിറ്റർ ക്വിസ്',
    '1.2 • print() കമാൻഡ്',
    '1.2 • കോഡിംഗ് പരിശീലനം',
    '1.2 • print() ക്വിസ്',
    '1.3 • കോഡ് റൺ ചെയ്യുമ്പോൾ',
    '1.3 • പ്രവർത്തന ക്രമ ക്വിസ്'
  ],
  3: [
    '2.1 • വേരിയബിൾ എന്നാൽ എന്ത്?',
    '2.1 • വേരിയബിൾ ക്വിസ്',
    '2.1 • വേരിയബിൾ കോഡിംഗ്',
    '2.2 • നമ്പറുകളും ടെക്സ്റ്റും',
    '2.2 • ഡാറ്റാ ടൈപ്പ് ക്വിസ്',
    '2.2 • ഡാറ്റാ ടൈപ്പ് കോഡിംഗ്',
    '2.3 • വേരിയബിൾ മാറ്റങ്ങൾ',
    '2.3 • റീഅസൈൻമെന്റ് ക്വിസ്',
    '2.3 • അപ്ഡേറ്റിംഗ് കോഡിംഗ്',
    '2.3 • സമഗ്ര വേരിയബിൾ ക്വിസ്'
  ]
};

export const MALAYALAM_LESSON_DATA = {
  '1_3_1': {
    title: "വേരിയബിൾ എന്നാൽ എന്ത്?",
    subtitle: "മെമ്മറിയിൽ വിവരങ്ങൾ സൂക്ഷിക്കാം",
    topic: "2.1 • വേരിയബിൾ",
    body: `<div style="display: flex; flex-direction: column; gap: 18px; width: 100%;">
  <div style="text-align: center; margin-bottom: 4px; width: 100%;">
    <div style="display: inline-block; background-color: #ffffff; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 10px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
      2.1 • വിവരങ്ങൾ സൂക്ഷിക്കൽ
    </div>
    <h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 30px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase;">
      എന്താണ് ഒരു <hlt>വേരിയബിൾ</hlt>?
    </h1>
    <p style="font-size: 15px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 620px;">
      കമ്പ്യൂട്ടർ മെമ്മറിയിൽ വിവരങ്ങൾ ഒരു പേരിൽ സൂക്ഷിച്ചുവെച്ച് പിന്നീട് ആവശ്യമുള്ളപ്പോൾ ഉപയോഗിക്കാനുള്ള വഴിയാണ് വേരിയബിൾ.
    </p>
  </div>

  <div class="lesson-ref-card">
    <div class="lesson-ref-header">
      <span class="ref-badge">മുൻ അറിവുകൾ</span>
      <span class="lesson-ref-title">മുൻ പാഠങ്ങളുമായി ബന്ധിപ്പിക്കാം</span>
    </div>
    <p class="lesson-ref-desc">
      റാം (RAM) മെമ്മറി എങ്ങനെ ഡാറ്റ സൂക്ഷിക്കുന്നുവെന്നും print() കമാൻഡ് എങ്ങനെ പ്രവർത്തിക്കുന്നുവെന്നും ഓർക്കുക.
    </p>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <a href="1.html?spcl=1&lsn=1&sub=3&ref_from=1_3_1" class="ref-jump-btn">പാഠം 1.2: കമ്പ്യൂട്ടർ മെമ്മറി പരിശോധിക്കുക →</a>
      <a href="1.html?spcl=1&lsn=2&sub=3&ref_from=1_3_1" class="ref-jump-btn">പാഠം 2.2: print() കമാൻഡ് പരിശോധിക്കുക →</a>
    </div>
  </div>

  <div style="background: #fde047; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 20px;">
    <span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">
      ഉദാഹരണം A • ലേബൽ ചെയ്ത പെട്ടി
    </span>
    <h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">
      പുറത്ത് പേരെഴുതിയ ഒരു പെട്ടി
    </h2>
    <p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;">
      ഒരു പെട്ടിയുടെ പുറത്ത് <hlt>age</hlt> എന്ന് ലേബൽ ഒട്ടിച്ച് അതിനുള്ളിൽ <hlt>25</hlt> എന്നെഴുതിയ പേപ്പർ ഇടുന്നതുപോലെയാണ് വേരിയബിൾ.
    </p>
    <div style="background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 14px; border-radius: 4px;">
      age = <span style="color: #7ee787;">25</span><br/>
      <span style="color: #79c0ff;">print</span>(age)  <span style="color: #8b949e;"># 'age' പെട്ടി തുറന്ന് 25 കാണിക്കുന്നു</span>
    </div>
  </div>
</div>`
  },
  '1_3_2': {
    title: "വേരിയബിൾ ക്വിസ്",
    topic: "2.1 • വേരിയബിൾ",
    questions: [
      {
        badge: "ക്വിസ് • ചോദ്യം 1 / 4",
        question: "പൈത്തണിൽ ഒരു വേരിയബിളിൻ്റെ പ്രധാന ഉപയോഗം എന്താണ്?",
        code: "",
        options: [
          "മെമ്മറിയിൽ വിവരങ്ങൾ സൂക്ഷിച്ചുവെക്കാനുള്ള പേരുള്ള ഒരു പെട്ടി",
          "കമ്പ്യൂട്ടർ ഓഫ് ചെയ്യാനുള്ള കമാൻഡ്",
          "മോണിറ്ററിലേക്ക് ഘടിപ്പിക്കുന്ന കേബിൾ",
          "നമ്പറുകൾ മാത്രം ടൈപ്പ് ചെയ്യാനുള്ള കീബോർഡ് ബട്ടൺ"
        ],
        explanation_correct: "ശരിയുത്തരം! വേരിയബിൾ എന്നാൽ പിന്നീട് ഉപയോഗിക്കാനായി ഡാറ്റ സൂക്ഷിക്കുന്ന ഒരു ലേബൽ ചെയ്ത മെമ്മറി അറയാണ്.",
        explanation_incorrect: "തെറ്റായ ഉത്തരം. വേരിയബിൾ എന്നാൽ മെമ്മറിയിൽ ഡാറ്റ സൂക്ഷിക്കാനുള്ള കണ്ടെയ്നറാണ്."
      }
    ]
  },
  '1_3_3': {
    title: "വേരിയബിൾ കോഡിംഗ്",
    topic: "2.1 • കോഡിംഗ്",
    description: "name എന്ന വേരിയബിളിൽ 'Alice' ഉം age എന്നതിൽ 25 ഉം സൂക്ഷിച്ച് രണ്ടും print ചെയ്യുക.",
    intended_output: "Alice\n25",
    starter_code: "# 1. 'name' എന്നതിൽ \"Alice\" എന്ന് നൽകുക\n# 2. 'age' എന്നതിൽ 25 എന്ന് നൽകുക\n# 3. രണ്ടും print ചെയ്യുക:\n\n"
  },
  '1_1_1': {
    title: "കമ്പ്യൂട്ടർ ഒരു \"യന്ത്രം മാത്രം\"",
    subtitle: "കമ്പ്യൂട്ടറുകളെ മനസ്സിലാക്കാം",
    topic: "0.1 • കമ്പ്യൂട്ടർ അടിസ്ഥാനതത്വങ്ങൾ",
    body: `<div style="display: flex; flex-direction: column; gap: 20px; width: 100%;"><div style="text-align: center; margin-bottom: 8px; width: 100%;"><div style="display: inline-block; background-color: #ffffff; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">0.1 • കമ്പ്യൂട്ടർ അടിസ്ഥാനങ്ങൾ</div><h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 32px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: -0.5px;">കമ്പ്യൂട്ടർ ഒരു <hlt>"യന്ത്രം മാത്രം"</hlt></h1><p style="font-size: 16px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 580px;"><hlt>കമ്പ്യൂട്ടറുകൾ സ്വയം ചിന്തിക്കില്ല</hlt>—നാം നൽകുന്ന നിർദ്ദേശങ്ങൾ അവ മിന്നൽ വേഗത്തിൽ അനുസരിക്കുന്നു.</p></div><div style="background: #93c5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 20px; box-sizing: border-box;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">1. സാമാന്യബുദ്ധി ഇല്ല</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">കമ്പ്യൂട്ടറുകൾക്ക് അർത്ഥം മനസ്സിലാകില്ല</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0; line-height: 1.5;">നിങ്ങൾ എന്താണ് ഉദ്ദേശിച്ചതെന്ന് കമ്പ്യൂട്ടറിന് സ്വയം മനസ്സിലാകില്ല. വിട്ടുപോയ പടികൾ സ്വയം ഊഹിച്ചെടുക്കാനും കഴിയില്ല. നമ്മൾ കൃത്യമായി നൽകിയ നിർദ്ദേശങ്ങൾ മാത്രമേ അത് ചെയ്യുകയുള്ളൂ.</p></div><div style="background: #fca5a5; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 20px; box-sizing: border-box;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">2. കൃത്യമായ നിർദ്ദേശങ്ങൾ</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">ഓരോ പടിയും പ്രധാനമാണ്</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0; line-height: 1.5;">ഒരു കാര്യം ചെയ്യാൻ കമ്പ്യൂട്ടറിനോട് പറയുമ്പോൾ ഓരോ ഘട്ടവും കൃത്യമായിരിക്കണം. മനുഷ്യർക്ക് സ്വാഭാവികമായി തോന്നുന്ന ലളിതമായ കാര്യങ്ങൾ പോലും കമ്പ്യൂട്ടറിന് ചെറിയ ചെറിയ പടികളായി പറഞ്ഞു കൊടുക്കണം.</p></div><div style="background: #86efac; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 20px;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">3. ബുദ്ധിയുള്ളതായി തോന്നുന്നത് എന്തുകൊണ്ട്?</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">മിന്നൽ വേഗത</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0; line-height: 1.5;">ലളിതമായ ദശലക്ഷക്കണക്കിന് കണക്കുകൂട്ടലുകൾ കമ്പ്യൂട്ടറുകൾക്ക് അതിവേഗത്തിൽ ചെയ്യാൻ സാധിക്കും. അതുകൊണ്ടാണ് അവയ്ക്ക് വലിയ ബുദ്ധിയുണ്ടെന്ന് നമുക്ക് തോന്നുന്നത്.</p></div><div style="background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;"><p style="font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;">പ്രധാന ആശയം: കമ്പ്യൂട്ടർ ഒരു <hlt>അനുസരണയുള്ള യന്ത്രമാണ്</hlt>—നാം നൽകുന്ന നിർദ്ദേശങ്ങൾ കൃത്യമായി അനുസരിക്കുകയാണ് അതിൻ്റെ ശക്തി.</p></div></div>`
  },
  '1_1_2': {
    title: "പരിശീലന ക്വിസ്: കമ്പ്യൂട്ടർ അടിസ്ഥാനങ്ങൾ",
    topic: "0.1 • കമ്പ്യൂട്ടർ അടിസ്ഥാനതത്വങ്ങൾ",
    questions: [
      {
        badge: "ക്വിസ് • ചോദ്യം 1 / 8",
        question: "താഴെ പറയുന്നവയിൽ കമ്പ്യൂട്ടറിനെ ഏറ്റവും നന്നായി വിവരിക്കുന്നത് ഏതാണ്?",
        code: "instructions = [\"step 1\", \"step 2\", \"step 3\"]\n# കമ്പ്യൂട്ടർ നിർദ്ദേശങ്ങൾ പാലിക്കുന്നു.",
        options: [
          { prefix: "A", text: "നിർദ്ദേശങ്ങൾ അനുസരിച്ച് കാര്യങ്ങൾ ചെയ്യുന്ന ഒരു യന്ത്രം.", correct: true },
          { prefix: "B", text: "മനുഷ്യരെപ്പോലെ കാര്യങ്ങൾ സ്വയം മനസ്സിലാക്കുന്ന യന്ത്രം.", correct: false },
          { prefix: "C", text: "നിർദ്ദേശങ്ങളുടെ അർത്ഥം സ്വയം തീരുമാനിക്കുന്ന യന്ത്രം.", correct: false },
          { prefix: "D", text: "നിർദ്ദേശങ്ങൾ ആവശ്യമില്ലാതെ തന്നെ പ്രവർത്തിക്കുന്ന യന്ത്രം.", correct: false }
        ],
        explanation_correct: "<strong>മികച്ച ഉത്തരം!</strong><br/>നാം നൽകുന്ന നിർദ്ദേശങ്ങൾ സ്വീകരിച്ച് പ്രവർത്തിക്കുകയാണ് കമ്പ്യൂട്ടർ ചെയ്യുന്നത്.",
        explanation_incorrect: "<strong>വീണ്ടും ശ്രമിക്കുക!</strong><br/>കമ്പ്യൂട്ടറുകൾ സ്വയം തീരുമാനങ്ങൾ എടുക്കുകയല്ല, നിർദ്ദേശങ്ങൾ പാലിക്കുകയാണ് ചെയ്യുന്നത്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 2 / 8",
        question: "കമ്പ്യൂട്ടറിനെ \"സ്വന്തമായി ചിന്തിക്കാത്ത യന്ത്രം\" എന്ന് വിളിക്കുന്നത് എന്തുകൊണ്ട്?",
        code: "instruction = \"open door\"\n# നൽകിയ നിർദ്ദേശം കൃത്യമായി ചെയ്യുന്നു.",
        options: [
          { prefix: "A", text: "മനുഷ്യരെപ്പോലെ സ്വാഭാവിക സാമാന്യബുദ്ധി ഇല്ലാത്തതിനാൽ നിർദ്ദേശങ്ങൾ നൽകണം.", correct: true },
          { prefix: "B", text: "സങ്കീർണ്ണമായ കാര്യങ്ങൾ ചെയ്യാൻ അതിന് കഴിയില്ല.", correct: false },
          { prefix: "C", text: "ജീവിതകാലത്ത് ഒരൊറ്റ കാര്യം മാത്രമേ അതിന് ചെയ്യാനാകൂ.", correct: false },
          { prefix: "D", text: "വിവരങ്ങൾ വേഗത്തിൽ കൈകാര്യം ചെയ്യാൻ അതിന് സാധിക്കില്ല.", correct: false }
        ],
        explanation_correct: "<strong>ശരിയായ ഉത്തരം!</strong><br/>കമ്പ്യൂട്ടറുകൾക്ക് മനുഷ്യരെപ്പോലെ സാമാന്യബുദ്ധിയില്ല, അവയ്ക്ക് കൃത്യമായ നിർദ്ദേശങ്ങൾ വേണം.",
        explanation_incorrect: "<strong>തെറ്റായ ഉത്തരം!</strong><br/>കമ്പ്യൂട്ടറുകൾക്ക് ഉയർന്ന ശേഷിയുണ്ടെങ്കിലും മനുഷ്യ സഹജമായ സാമാന്യബുദ്ധി ഇല്ല."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 3 / 8",
        question: "ഒരു പ്രധാന ഘട്ടം വിട്ടുപോയ നിർദ്ദേശങ്ങൾ നൽകുമ്പോൾ കമ്പ്യൂട്ടറിൽ എന്ത് സംഭവിക്കുന്നു?",
        code: "# ഉദ്ദേശ്യം: വാതിൽ തുറന്ന് ഉള്ളിലേക്ക് കടക്കുക.\n# വിട്ടുപോയ ഘട്ടം കമ്പ്യൂട്ടർ സ്വയം ചെയ്യുമോ?",
        options: [
          { prefix: "A", text: "വിട്ടുപോയ ഘട്ടം കമ്പ്യൂട്ടർ സ്വയം ഊഹിച്ചെടുക്കില്ല.", correct: true },
          { prefix: "B", text: "കമ്പ്യൂട്ടർ എപ്പോഴും വിട്ടുപോയ ഭാഗം ശരിയായി ഊഹിക്കും.", correct: false },
          { prefix: "C", text: "മറ്റൊരു കമ്പ്യൂട്ടറോട് ചോദിച്ച് പരിഹരിക്കും.", correct: false },
          { prefix: "D", text: "മനുഷ്യ സാമാന്യബുദ്ധി ഉപയോഗിച്ച് പ്രവർത്തനം പൂർത്തിയാക്കും.", correct: false }
        ],
        explanation_correct: "<strong>ഉത്തരം ശരിയാണ്!</strong><br/>വിട്ടുപോയ വിവരങ്ങൾ സ്വയം ഊഹിച്ചെടുക്കാൻ കമ്പ്യൂട്ടറുകൾക്ക് കഴിയില്ല.",
        explanation_incorrect: "<strong>വീണ്ടും നോക്കുക!</strong><br/>കമ്പ്യൂട്ടറുകൾ നൽകിയ നിർദ്ദേശങ്ങൾ മാത്രമേ അനുസരിക്കൂ; സ്വയം ഊഹിക്കില്ല."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 4 / 8",
        question: "ഒരു കമ്പ്യൂട്ടർ കൃത്യമായി ചെയ്യാൻ താഴെ പറയുന്നവയിൽ ഏറ്റവും അനുയോജ്യമായ നിർദ്ദേശ ക്രമം ഏതാണ്?",
        code: "# ലക്ഷ്യം: വാതിലിലൂടെ അകത്ത് പ്രവേശിക്കുക",
        options: [
          { prefix: "A", text: "വാതിൽ തുറക്കുക, മുന്നോട്ട് നടക്കുക, വാതിൽ അടയ്ക്കുക.", correct: true },
          { prefix: "B", text: "എങ്ങനെയെങ്കിലും വാതിലിലൂടെ അകത്ത് കയറുക.", correct: false },
          { prefix: "C", text: "സാധാരണ ചെയ്യുന്നതുപോലെ ചെയ്യുക.", correct: false },
          { prefix: "D", text: "ഉചിതമെന്ന് തോന്നുമ്പോൾ അകത്തേക്ക് കയറുക.", correct: false }
        ],
        explanation_correct: "<strong>വളരെ നല്ലത്!</strong><br/>കമ്പ്യൂട്ടറുകൾക്ക് അവ്യക്തമായ വാക്കുകളല്ല, ഘട്ടം ഘട്ടമായുള്ള കൃത്യമായ നിർദ്ദേശങ്ങളാണ് ആവശ്യം.",
        explanation_incorrect: "<strong>തെറ്റാണ്!</strong><br/>അവ്യക്തമായ നിർദ്ദേശങ്ങൾ കമ്പ്യൂട്ടറിന് മനസ്സിലാക്കാൻ കഴിയില്ല."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 5 / 8",
        question: "ലളിതമായ നിർദ്ദേശങ്ങൾ മാത്രം പിന്തുടരുന്ന കമ്പ്യൂട്ടറുകൾക്ക് എങ്ങനെയാണ് വലിയ ബുദ്ധിയുള്ളതായി തോന്നുന്നത്?",
        code: "for step in range(1000000):\n    perform_instruction(step)\n# നിരവധി ലളിതമായ പടികൾ അതിവേഗം നടക്കുന്നു.",
        options: [
          { prefix: "A", text: "ദശലക്ഷക്കണക്കിന് ലളിതമായ പ്രവർത്തനങ്ങൾ അതിവേഗത്തിൽ ചെയ്യാൻ കഴിയുന്നതുകൊണ്ട്.", correct: true },
          { prefix: "B", text: "നിർദ്ദേശങ്ങൾ ചെയ്യുമ്പോൾ അതിന് മനുഷ്യ ബുദ്ധി ഉണ്ടാകുന്നതുകൊണ്ട്.", correct: false },
          { prefix: "C", text: "നിർദ്ദേശങ്ങൾ അപൂർണ്ണമാകുമ്പോൾ അത് സ്വയം മാറ്റുന്നതുകൊണ്ട്.", correct: false },
          { prefix: "D", text: "മനുഷ്യരെപ്പോലെ ഓരോ നിർദ്ദേശത്തിൻ്റെയും അന്തരാർത്ഥം ഗ്രഹിക്കുന്നതുകൊണ്ട്.", correct: false }
        ],
        explanation_correct: "<strong>കൃത്യമായ ഉത്തരം!</strong><br/>ലളിതമായ പ്രവർത്തനങ്ങൾ അതിവേഗത്തിൽ ലക്ഷക്കണക്കിന് തവണ ആവർത്തിക്കാനുള്ള കഴിവാണ് കമ്പ്യൂട്ടറുകളുടെ കരുത്ത്.",
        explanation_incorrect: "<strong>വീണ്ടും ചിന്തിക്കുക!</strong><br/>കമ്പ്യൂട്ടറുകൾക്ക് മനുഷ്യ ബുദ്ധിയില്ല, അവയുടെ ശക്തി മിന്നൽ വേഗതയിലാണ്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 6 / 8",
        question: "കമ്പ്യൂട്ടറുകൾക്ക് സ്വന്തമായി ചെയ്യാൻ കഴിയാത്ത കാര്യം ഏതാണ്?",
        code: "instruction = \"perform_task()\"",
        options: [
          { prefix: "A", text: "പറയാതെ വിട്ടുപോയ ഉദ്ദേശ്യം സാമാന്യബുദ്ധി ഉപയോഗിച്ച് മനസ്സിലാക്കൽ.", correct: true },
          { prefix: "B", text: "നൽകിയിരിക്കുന്ന നിർദ്ദേശങ്ങൾ ക്രമമായി ചെയ്യൽ.", correct: false },
          { prefix: "C", text: "നിർദ്ദേശിച്ച പ്രവർത്തനങ്ങൾ നടപ്പിലാക്കൽ.", correct: false },
          { prefix: "D", text: "ചെറിയ സമയം കൊണ്ട് നിരവധി കാര്യങ്ങൾ ചെയ്യൽ.", correct: false }
        ],
        explanation_correct: "<strong>ശരിയാണ്!</strong><br/>പറയാത്ത കാര്യങ്ങൾ സ്വയം മനസ്സിലാക്കാനുള്ള സാമാന്യബുദ്ധി കമ്പ്യൂട്ടറിനില്ല.",
        explanation_incorrect: "<strong>വീണ്ടും നോക്കുക!</strong><br/>നിർദ്ദേശങ്ങൾ പാലിക്കാനും വേഗത്തിൽ ചെയ്യാനും കമ്പ്യൂട്ടറിന് കഴിയും; സാമാന്യബുദ്ധിയാണ് ഇല്ലാത്തത്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 7 / 8",
        question: "നിർദ്ദേശങ്ങൾ വളരെ വ്യക്തവും കൃത്യവുമായിരിക്കണം എന്ന് പറയുന്നതിൻ്റെ പ്രധാന കാരണം എന്താണ്?",
        code: "# അവ്യക്ത നിർദ്ദേശം: \"നന്നായി ചെയ്യുക\"",
        options: [
          { prefix: "A", text: "അവ്യക്തമായ നിർദ്ദേശങ്ങളുടെ അർത്ഥം കമ്പ്യൂട്ടറിന് കൃത്യമായി നിർണ്ണയിക്കാൻ കഴിയില്ല.", correct: true },
          { prefix: "B", text: "ഒരേ സമയം ഒന്നിൽ കൂടുതൽ കാര്യങ്ങൾ ചെയ്യാൻ കഴിയില്ല.", correct: false },
          { prefix: "C", text: "നിർദ്ദേശങ്ങൾ വേഗത്തിൽ വായിക്കാൻ കഴിയില്ല.", correct: false },
          { prefix: "D", text: "സംഖ്യകൾ അടങ്ങിയ നിർദ്ദേശങ്ങൾ മാത്രമേ അതിന് മനസ്സിലാകൂ.", correct: false }
        ],
        explanation_correct: "<strong>മികച്ച ഉത്തരം!</strong><br/>അവ്യക്തമായ കാര്യങ്ങൾ ഊഹിച്ചെടുക്കാൻ കമ്പ്യൂട്ടറിന് സാധിക്കാത്തതുകൊണ്ടാണ് നിർദ്ദേശങ്ങൾ വ്യക്തമായി നൽകേണ്ടത്.",
        explanation_incorrect: "<strong>തെറ്റാണ്!</strong><br/>വേഗതയോ സംഖ്യകളോ അല്ല കാരണം; അവ്യക്തമായ കാര്യങ്ങൾ ഊഹിക്കാനുള്ള കഴിവില്ലായ്മയാണ്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 8 / 8",
        question: "കമ്പ്യൂട്ടറിൻ്റെ ലാളിത്യവും അതിൻ്റെ ശക്തിയും തമ്മിലുള്ള ബന്ധം വ്യക്തമാക്കുന്നത് ഏതാണ്?",
        code: "instruction_1()\ninstruction_2()\n# ലളിതമായ പടികൾ മിന്നൽ വേഗതയിൽ ആവർത്തിക്കുന്നു.",
        options: [
          { prefix: "A", text: "ലളിതമായ പ്രവർത്തനങ്ങൾ അതിവേഗത്തിലും വലിയ അളവിലും നടത്തുമ്പോൾ അത് വലിയ ശക്തിയായി മാറുന്നു.", correct: true },
          { prefix: "B", text: "ലളിതമായ പ്രവർത്തനങ്ങൾ ആവർത്തിക്കുമ്പോൾ കമ്പ്യൂട്ടറിന് തനിയെ ബുദ്ധി വരുന്നു.", correct: false },
          { prefix: "C", text: "കുറെ പ്രവർത്തനങ്ങൾ കഴിഞ്ഞാൽ കമ്പ്യൂട്ടറുകൾ സ്വയം ചിന്തിക്കാൻ തുടങ്ങുന്നു.", correct: false },
          { prefix: "D", text: "സങ്കീർണ്ണമായ കാര്യങ്ങൾ വരുമ്പോൾ കമ്പ്യൂട്ടറുകൾ നിർദ്ദേശങ്ങൾ ഒഴിവാക്കുന്നു.", correct: false }
        ],
        explanation_correct: "<strong>മൊഡ്യൂൾ പൂർത്തിയായി!</strong><br/>ലളിതമായ പ്രവർത്തനങ്ങൾ ഉയർന്ന വേഗതയിലും അളവിലും ചെയ്യുന്നതിലൂടെയാണ് വലിയ സങ്കീർണ്ണ പ്രശ്നങ്ങൾ കമ്പ്യൂട്ടർ പരിഹരിക്കുന്നത്.",
        explanation_incorrect: "<strong>അവസാന ചോദ്യം ഒന്നുകൂടി നോക്കൂ!</strong><br/>കമ്പ്യൂട്ടറുകൾ എല്ലായ്പ്പോഴും നിർദ്ദേശങ്ങൾ പാലിക്കുന്ന യന്ത്രങ്ങൾ തന്നെയാണ്."
      }
    ]
  },
  '1_1_3': {
    title: "കോഡ് റൺ ചെയ്യുമ്പോൾ എന്താണ് സംഭവിക്കുന്നത്?",
    subtitle: "പ്രോഗ്രാമുകൾ, മെമ്മറി & ബഗുകൾ",
    topic: "0.2 • കോഡ് പ്രവർത്തിപ്പിക്കൽ",
    body: `<div style="display: flex; flex-direction: column; gap: 20px; width: 100%;"><div style="text-align: center; margin-bottom: 8px; width: 100%;"><div style="display: inline-block; background-color: #ffffff; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">0.2 • കോഡ് പ്രവർത്തിപ്പിക്കൽ</div><h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 32px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: -0.5px;">കോഡ് റൺ ചെയ്യുമ്പോൾ <hlt>എന്താണ് സംഭവിക്കുന്നത്?</hlt></h1><p style="font-size: 16px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 600px;"><hlt>എഴുതുക → റൺ ചെയ്യുക → നിരീക്ഷിക്കുക → ഡീബഗ്ഗ് ചെയ്യുക</hlt> — പ്രവർത്തിക്കുന്ന പ്രോഗ്രാമിനുള്ളിൽ എന്താണ് സംഭവിക്കുന്നതെന്ന് കാണാം.</p></div><div style="background: #fef08a; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">1. എഴുതുക & റൺ ചെയ്യുക</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">പ്രോഗ്രാം പ്രവർത്തനം ആരംഭിക്കുന്നു</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0; line-height: 1.5;">നിർദ്ദേശങ്ങളുടെ ഒരു കൂട്ടമാണ് പ്രോഗ്രാം. നിങ്ങൾ <hlt>Run</hlt> ക്ലിക്ക് ചെയ്യുമ്പോൾ, കമ്പ്യൂട്ടർ ആ നിർദ്ദേശങ്ങൾ ഓരോന്നായി ചെയ്യാൻ തുടങ്ങുന്നു.</p></div><div style="background: #93c5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">2. മെമ്മറി</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">വിവരങ്ങൾ സൂക്ഷിക്കുന്ന സ്ഥലം</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;">പ്രോഗ്രാം പ്രവർത്തിക്കുമ്പോൾ അതിലെ വിവരങ്ങളും വിലകളും ഓർത്തുവെക്കാൻ മെമ്മറി ആവശ്യമാണ്. ഒരു വിവരത്തിന് നാം നൽകുന്ന പേരാണ് വേരിയബിൾ (Variable).</p><div style="background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 16px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 14px; border-radius: 4px;">score = <span style="color: #7ee787;">100</span><br/>name = <span style="color: #a5d6ff;">\"Alex\"</span></div></div><div style="background: #fca5a5; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">3. ബഗുകൾ (Bugs)</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">ഉദ്ദേശിച്ച ഫലം ലഭിക്കാതെ വരുമ്പോൾ</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;">കോഡിലെ പിശകുകൾ കാരണം പ്രോഗ്രാം തെറ്റായി പ്രവർത്തിക്കുന്നതിനെയാണ് <hlt>ബഗ് (Bug)</hlt> എന്ന് വിളിക്കുന്നത്. ചില ബഗുകൾ തെറ്റായ ഫലം തരുമ്പോൾ ചിലത് പ്രോഗ്രാം നിലച്ചുപോകാൻ കാരണമാകുന്നു.</p><div style="background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 16px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 14px; border-radius: 4px;">price = <span style="color: #7ee787;">10</span><br/>quantity = <span style="color: #7ee787;">3</span><br/>total = price + quantity <span style="color: #8b949e;"># ബഗ്: ഗുണിക്കേണ്ടതിനു പകരം കൂട്ടി</span></div></div><div style="background: #86efac; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;"><span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">4. ഡീബഗ്ഗിംഗ് (Debugging)</span><h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">കോഡ് ഡിറ്റക്ടീവാകാം</h2><p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;">കോഡിലെ തെറ്റുകൾ കണ്ടെത്തി പരിഹരിക്കുന്ന പ്രക്രിയയാണ് ഡീബഗ്ഗിംഗ്. ഊഹിക്കുന്നതിന് പകരം, പ്രോഗ്രാം വരി വരിയായി പ്രവർത്തിപ്പിച്ച് നമുക്ക് ഉള്ളിൽ നടക്കുന്ന കാര്യങ്ങൾ നിരീക്ഷിക്കാം.</p><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"><div style="background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;"><strong style="font-family: 'Title', monospace;">ബ്രേക്ക്പോയിൻ്റ് (Breakpoint)</strong><br/>ഒരു പ്രത്യേക വരിയിൽ പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തുക.</div><div style="background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;"><strong style="font-family: 'Title', monospace;">സ്റ്റെപ്പ് (Step)</strong><br/>ഓരോ വരിയായി പടിപടിയായി റൺ ചെയ്യുക.</div><div style="background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;"><strong style="font-family: 'Title', monospace;">പരിശോധന (Inspect)</strong><br/>മെമ്മറിയിലെ തത്സമയ വേരിയബിൾ മൂല്യങ്ങൾ കാണുക.</div><div style="background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;"><strong style="font-family: 'Title', monospace;">ബഗ് കണ്ടെത്തുക (Find Bug)</strong><br/>പ്രതീക്ഷിച്ച ഫലവും ലഭിച്ച ഫലവും താരതമ്യം ചെയ്യുക.</div></div></div><div style="background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;"><p style="font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;">പ്രധാന സന്ദേശം: <hlt>കോഡ് റൺ ചെയ്യുന്നത് കമ്പ്യൂട്ടറിനെക്കൊണ്ട് പണിയെടുപ്പിക്കാനാണ്; ഡീബഗ്ഗിംഗ് ഉള്ളിൽ നടക്കുന്ന കാര്യങ്ങൾ മനസ്സിലാക്കാനാണ്.</hlt></p></div></div>`
  },
  '1_1_4': {
    title: "പരിശീലന ക്വിസ്: കോഡ് റൺ ചെയ്യലും ഡീബഗ്ഗിംഗും",
    topic: "0.2 • കോഡ് പ്രവർത്തിപ്പിക്കൽ",
    questions: [
      {
        badge: "ക്വിസ് • ചോദ്യം 1 / 8",
        question: "ഒരു പ്രോഗ്രാമിൽ 'Run' അമർത്തുമ്പോൾ എന്താണ് സംഭവിക്കുന്നത്?",
        code: "print(\"Hello!\")\n# റൺ ചെയ്യുക",
        options: [
          { prefix: "A", text: "കമ്പ്യൂട്ടർ പ്രോഗ്രാമിലെ നിർദ്ദേശങ്ങൾ ഓരോന്നായി നടപ്പിലാക്കാൻ തുടങ്ങുന്നു.", correct: true },
          { prefix: "B", text: "എല്ലാ വിവരങ്ങളും കമ്പ്യൂട്ടർ ശാശ്വതമായി സേവ് ചെയ്യുന്നു.", correct: false },
          { prefix: "C", text: "കോഡിലെ എല്ലാ തെറ്റുകളും കമ്പ്യൂട്ടർ തനിയെ ശരിയാക്കുന്നു.", correct: false },
          { prefix: "D", text: "പ്രോഗ്രാമിനെ ഒരു ഹാർഡ്‌വെയർ ഉപകരണമാക്കി മാറ്റുന്നു.", correct: false }
        ],
        explanation_correct: "<strong>മികച്ച ഉത്തരം!</strong><br/>Run അമർത്തുമ്പോൾ കമ്പ്യൂട്ടർ നൽകിയിരിക്കുന്ന നിർദ്ദേശങ്ങൾ നടപ്പിലാക്കാൻ തുടങ്ങുന്നു.",
        explanation_incorrect: "<strong>തെറ്റാണ്!</strong><br/>റൺ ചെയ്യുന്നത് നിർദ്ദേശങ്ങൾ പ്രവർത്തിപ്പിക്കാനാണ്; തെറ്റുകൾ തനിയെ ശരിയാക്കില്ല."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 2 / 8",
        question: "പ്രവർത്തിക്കുന്ന ഒരു പ്രോഗ്രാമിന് മെമ്മറി ആവശ്യമായി വരുന്നത് എന്തുകൊണ്ട്?",
        code: "score = 100\nname = \"Alex\"\n# പ്രോഗ്രാം പ്രവർത്തിക്കുമ്പോൾ വിവരങ്ങൾ സൂക്ഷിക്കണം.",
        options: [
          { prefix: "A", text: "പ്രോഗ്രാം ഉപയോഗിക്കുന്ന വിവരങ്ങളും വിലകളും ഓർത്തുവെക്കാൻ.", correct: true },
          { prefix: "B", text: "മോണിറ്ററിലെ ചിത്രം വലുതാക്കി കാണിക്കാൻ.", correct: false },
          { prefix: "C", text: "പ്രോസസറിന് പകരമായി പ്രവർത്തിക്കാൻ.", correct: false },
          { prefix: "D", text: "വിട്ടുപോയ കോഡ് തനിയെ എഴുതിച്ചേർക്കാൻ.", correct: false }
        ],
        explanation_correct: "<strong>കൃത്യമായ ഉത്തരം!</strong><br/>പ്രോഗ്രാം ഉപയോഗിക്കുന്ന വിലകളും വിവരങ്ങളും സൂക്ഷിക്കാനാണ് മെമ്മറി.",
        explanation_incorrect: "<strong>വീണ്ടും ശ്രമിക്കുക!</strong><br/>മെമ്മറി വിവരങ്ങൾ സൂക്ഷിക്കാനാണ് ഉപയോഗിക്കുന്നത്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 3 / 8",
        question: "ഈ കോഡിൽ, പ്രോഗ്രാം റൺ ചെയ്യുമ്പോൾ 'score' എന്ന വേരിയബിൾ എന്തിനെയാണ് സൂചിപ്പിക്കുന്നത്?",
        code: "score = 100\nbonus = 20",
        options: [
          { prefix: "A", text: "100 എന്ന സംഖ്യയെ സൂചിപ്പിക്കാൻ ഉപയോഗിക്കുന്ന ഒരു പേര്.", correct: true },
          { prefix: "B", text: "ഹാർഡ് ഡിസ്കിൽ സേവ് ചെയ്യാനുള്ള ഒരു കമാൻഡ്.", correct: false },
          { prefix: "C", text: "പ്രോഗ്രാം താൽക്കാലികമായി നിർത്താനുള്ള ബ്രേക്ക്പോയിൻ്റ്.", correct: false },
          { prefix: "D", text: "പ്രോഗ്രാം റൺ ചെയ്യുന്ന പ്രോഗ്രാമിംഗ് ലാംഗ്വേജ്.", correct: false }
        ],
        explanation_correct: "<strong>വളരെ നല്ലത്!</strong><br/>'score' എന്നത് 100 എന്ന മൂല്യത്തെ വിളിക്കാനുള്ള വേരിയബിൾ നാമമാണ്.",
        explanation_incorrect: "<strong>വീണ്ടും നോക്കുക!</strong><br/>വേരിയബിൾ എന്നത് ഒരു മൂല്യത്തിന് നൽകുന്ന പേരാണ്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 4 / 8",
        question: "ഒരു പ്രോഗ്രാമിലെ 'ബഗ്' (Bug) എന്നാൽ എന്താണ്?",
        code: "price = 10\nquantity = 3\ntotal = price + quantity\n# ഗുണിക്കുന്നതിന് പകരം കൂട്ടി.",
        options: [
          { prefix: "A", text: "പ്രോഗ്രാം നാം ഉദ്ദേശിച്ചതിൽ നിന്നും വ്യത്യസ്തമായി പ്രവർത്തിക്കാൻ ഇടയാക്കുന്ന ഒരു പിശക്.", correct: true },
          { prefix: "B", text: "പ്രോഗ്രാമുകൾ വേഗത്തിൽ ഓടിക്കുന്ന ഒരു പ്രത്യേക കമാൻഡ്.", correct: false },
          { prefix: "C", text: "വേരിയബിളുകൾ സൂക്ഷിക്കുന്ന പ്രത്യേക മെമ്മറി.", correct: false },
          { prefix: "D", text: "പ്രോഗ്രാം തുടങ്ങാൻ ഉപയോഗിക്കുന്ന ബട്ടൺ.", correct: false }
        ],
        explanation_correct: "<strong>ശരിയായ ഉത്തരം!</strong><br/>പ്രോഗ്രാമിൽ വരുന്ന പിശകുകളെയാണ് ബഗുകൾ എന്ന് വിളിക്കുന്നത്.",
        explanation_incorrect: "<strong>തെറ്റാണ്!</strong><br/>ബഗ് എന്നാൽ ഉദ്ദേശിച്ച ഫലത്തിൽ നിന്നും വ്യതിചലിക്കുന്ന കോഡ് പിശകാണ്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 5 / 8",
        question: "ഡീബഗ്ഗിംഗ് (Debugging) എന്നാൽ എന്താണ്?",
        code: "target = 100\nactual = 80\n# യഥാർത്ഥ ഫലം എന്തുകൊണ്ട് മാറി എന്ന് പരിശോധിക്കുന്നു",
        options: [
          { prefix: "A", text: "പ്രോഗ്രാമിലെ പ്രശ്നങ്ങൾ കണ്ടെത്തി മനസ്സിലാക്കലും പരിഹരിക്കലും.", correct: true },
          { prefix: "B", text: "കമ്പ്യൂട്ടറിൻ്റെ വേഗത വർദ്ധിപ്പിക്കൽ.", correct: false },
          { prefix: "C", text: "മെമ്മറിയിൽ നിന്ന് എല്ലാ വേരിയബിളുകളും ഡിലീറ്റ് ചെയ്യൽ.", correct: false },
          { prefix: "D", text: "റൺ ചെയ്യാതെ കോഡ് എഴുതിവെക്കൽ.", correct: false }
        ],
        explanation_correct: "<strong>മികച്ച ഉത്തരം!</strong><br/>കോഡിലെ പിശകുകൾ കണ്ടെത്തി പരിഹരിക്കുന്ന പ്രക്രിയയാണ് ഡീബഗ്ഗിംഗ്.",
        explanation_incorrect: "<strong>തെറ്റാണ്!</strong><br/>ഡീബഗ്ഗിംഗ് എന്നാൽ ബഗുകൾ കണ്ടെത്തി തിരുത്തലാണ്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 6 / 8",
        question: "ഒരു 'ബ്രേക്ക്പോയിൻ്റ്' (Breakpoint) എന്താണ് ചെയ്യുന്നത്?",
        code: "score = 100\nname = \"Alex\"\ntotal = score + 50\n# വരി 3-ൽ ബ്രേക്ക്പോയിൻ്റ് ഇടുക",
        options: [
          { prefix: "A", text: "തിരഞ്ഞെടുത്ത വരിയിൽ പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തി ഉള്ളിലെ വിവരങ്ങൾ കാണാൻ സഹായിക്കുന്നു.", correct: true },
          { prefix: "B", text: "ആ വരി കോഡിൽ നിന്ന് എന്നെന്നേക്കുമായി ഡിലീറ്റ് ചെയ്യുന്നു.", correct: false },
          { prefix: "C", text: "തെറ്റായ കോഡ് സ്വയം ശരിയാക്കി മാറ്റുന്നു.", correct: false },
          { prefix: "D", text: "എല്ലാ വരികളും ഒരേ സമയം റൺ ചെയ്യിക്കുന്നു.", correct: false }
        ],
        explanation_correct: "<strong>ശരിയായ ഉത്തരം!</strong><br/>ബ്രേക്ക്പോയിൻ്റ് പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തി പരിശോധിക്കാൻ സഹായിക്കുന്നു.",
        explanation_incorrect: "<strong>വീണ്ടും ശ്രമിക്കുക!</strong><br/>ബ്രേക്ക്പോയിൻ്റ് നിർത്താൻ മാത്രമുള്ളതാണ്; ഡിലീറ്റ് ചെയ്യില്ല."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 7 / 8",
        question: "ഡീബഗ്ഗിംഗ് ചെയ്യുമ്പോൾ ഓരോ വരിയായി 'സ്റ്റെപ്പ്' (Step) ചെയ്യുന്നത് എന്തിനാണ്?",
        code: "a = 5\nb = 10\nc = a + b\n# ഓരോ വരിയായി സ്റ്റെപ്പ് ചെയ്യുക.",
        options: [
          { prefix: "A", text: "ഓരോ വരിയും പ്രവർത്തിക്കുമ്പോൾ മെമ്മറിയിൽ എന്ത് മാറ്റം വരുന്നുവെന്ന് നിരീക്ഷിക്കാൻ.", correct: true },
          { prefix: "B", text: "പ്രോഗ്രാമിലെ നിർദ്ദേശങ്ങൾ മുഴുവൻ ഒഴിവാക്കാൻ.", correct: false },
          { prefix: "C", text: "പ്രോഗ്രാമിൻ്റെ പ്രവർത്തനം പൂർണ്ണമായി അവസാനിപ്പിക്കാൻ.", correct: false },
          { prefix: "D", text: "എല്ലാ ബഗുകളും സ്വയം നീക്കം ചെയ്യാൻ.", correct: false }
        ],
        explanation_correct: "<strong>വളരെ നല്ലത്!</strong><br/>ഓരോ പടിയായി പ്രോഗ്രാം റൺ ചെയ്ത് മാറ്റങ്ങൾ നിരീക്ഷിക്കാനാണ് സ്റ്റെപ്പിംഗ്.",
        explanation_incorrect: "<strong>തെറ്റാണ്!</strong><br/>സ്റ്റെപ്പിംഗ് പടിപടിയായി പരിശോധിക്കാനാണ് ഉപയോഗിക്കുന്നത്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 8 / 8",
        question: "പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തുമ്പോൾ വേരിയബിളുകൾ പരിശോധിക്കുന്നതിലൂടെ എന്ത് മനസ്സിലാക്കാം?",
        code: "price = 10\nquantity = 3\ntotal = 13\n# ഡീബഗ്ഗർ നിലവിലെ മൂല്യങ്ങൾ കാണിക്കുന്നു.",
        options: [
          { prefix: "A", text: "ആ നിമിഷത്തിൽ പ്രോഗ്രാമിൻ്റെ മെമ്മറിയിൽ എന്തൊക്കെ മൂല്യങ്ങളാണ് ഉള്ളതെന്ന്.", correct: true },
          { prefix: "B", text: "ഭാവിയിൽ പ്രോഗ്രാമർ എന്ത് എഴുതുമെന്ന്.", correct: false },
          { prefix: "C", text: "മോണിറ്റർ എത്ര വൈദ്യുതി ഉപയോഗിക്കുന്നുവെന്ന്.", correct: false },
          { prefix: "D", text: "അടുത്തതായി ഏത് കമ്പ്യൂട്ടർ ലാംഗ്വേജ് കണ്ടുപിടിക്കപ്പെടുമെന്ന്.", correct: false }
        ],
        explanation_correct: "<strong>മൊഡ്യൂൾ പൂർത്തിയായി!</strong><br/>വേരിയബിളുകൾ പരിശോധിക്കുന്നത് നിലവിലെ മെമ്മറി സ്റ്റേറ്റ് മനസ്സിലാക്കാനാണ്.",
        explanation_incorrect: "<strong>അവസാന ചോദ്യം ഒന്നുകൂടി പരിശോധിക്കൂ!</strong><br/>വേരിയബിളുകൾ നിലവിലെ വിവരങ്ങളാണ് കാണിക്കുന്നത്."
      }
    ]
  }
};

export const MALAYALAM_OVERVIEWS = {
  breakdownBadge: (roundNum) => `AI വിശദീകരണം ${roundNum > 1 ? `• റൗണ്ട് ${roundNum}` : ''}`,
  breakdownHeading: 'പ്രയാസമുള്ള ആശയങ്ങൾ <hlt>വ്യക്തമായി മനസ്സിലാക്കാം</hlt>',
  breakdownIntro: (count) => `നിങ്ങളുടെ മുൻ ക്വിസ് ഉത്തരങ്ങൾ പരിശോധിച്ച്, നിങ്ങൾക്ക് സംശയമുള്ള ${count} പ്രധാന ആശയങ്ങൾ ഞങ്ങൾ ഇവിടെ വിശകലനം ചെയ്ത് തയ്യാറാക്കിയിരിക്കുന്നു.`,
  reviewPointsTitle: (count) => `പരിശോധിക്കേണ്ട പ്രധാന കാര്യങ്ങൾ (${count} എണ്ണം):`,
  questionLabel: '• ചോദ്യം:',
  earlierChoiceLabel: 'നേരത്തെ തിരഞ്ഞെടുത്തത്:',
  correctPrincipleLabel: 'ശരിയായ തത്വം:',
  breakdownFooter: 'ആശയങ്ങൾ വ്യക്തമായെങ്കിൽ <hlt>അടുത്ത പേജ് →</hlt> ക്ലിക്ക് ചെയ്ത് നിങ്ങളുടെ ലക്ഷ്യമിട്ട പുനർപഠന ക്വിസ് ആരംഭിക്കുക!',
  quizTopic: 'AI പുനർപഠന പരിശീലനം',
  quizTitle: (roundNum) => `ലക്ഷ്യമിട്ട പുനർപഠന ക്വിസ് ${roundNum > 1 ? `(റൗണ്ട് ${roundNum})` : ''}`,
  quizBadge: (qIdx, total) => `AI പുനർപഠന ക്വിസ് • ചോദ്യം ${qIdx} / ${total}`
};

export const MALAYALAM_CONCEPTS = {
  dumb_machine: {
    badge: 'ആശയം 01 • സ്വന്തമായി ചിന്തിക്കാത്ത യന്ത്രം',
    title: 'കമ്പ്യൂട്ടർ നൽകിയ നിർദ്ദേശങ്ങൾ മാത്രം പാലിക്കുന്ന യന്ത്രമാണ്',
    takeaway: 'കമ്പ്യൂട്ടറുകൾക്ക് മനുഷ്യനെപ്പോലെ സാമാന്യബുദ്ധിയില്ല. അവ എന്തെങ്കിലും ഊഹിച്ചെടുക്കുകയുമില്ല. <hlt>നൽകിയിരിക്കുന്ന നിർദ്ദേശങ്ങൾ അതേപടി നടപ്പിലാക്കുക</hlt> മാത്രമാണ് അവ ചെയ്യുന്നത്.',
    reinforceQuestions: [
      {
        question: 'മനുഷ്യനിൽ നിന്നും വ്യത്യസ്തമായി, ഒരു പ്രോഗ്രാം റൺ ചെയ്യുമ്പോൾ കമ്പ്യൂട്ടർ എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത്?',
        code: "while program_running:\n    execute_literal_machine_instruction()",
        options: [
          {
            prefix: "A",
            text: "സ്വന്തം വികാരങ്ങളോ സാമാന്യബുദ്ധിയോ ഇല്ലാതെ നൽകിയ നിർദ്ദേശങ്ങൾ കൃത്യമായി നടപ്പിലാക്കുന്നു.",
            correct: true
          },
          {
            prefix: "B",
            text: "പ്രോഗ്രാമർ എന്താണ് ഉദ്ദേശിച്ചതെന്ന് സ്വന്തം ബുദ്ധികൊണ്ട് മനസ്സിലാക്കുന്നു.",
            correct: false
          },
          {
            prefix: "C",
            text: "കോഡിൽ വിട്ടുപോയ പടികൾ തനിയെ കണ്ടുപിടിച്ച് പൂർത്തിയാക്കുന്നു.",
            correct: false
          },
          {
            prefix: "D",
            text: "കണക്കുകൂട്ടുന്നതിന് മുൻപ് അല്പനേരം ചിന്തിച്ച് തീരുമാനമെടുക്കുന്നു.",
            correct: false
          }
        ],
        explanation_correct: "കമ്പ്യൂട്ടർ എന്നത് സാമാന്യബുദ്ധിയില്ലാത്ത, നൽകിയ കമാൻഡുകൾ കൃത്യമായി അനുസരിക്കുന്ന ഒരു യന്ത്രമാണ്.",
        explanation_incorrect: "കമ്പ്യൂട്ടറുകൾക്ക് മനുഷ്യസഹജമായ ബുദ്ധിയില്ല; അവ നിർദ്ദേശങ്ങൾ അക്ഷരംപ്രതി അനുസരിക്കുന്നു."
      },
      {
        question: 'ഒരു പ്രധാന നിർദ്ദേശം (ഉദാഹരണത്തിന്: ചുവരിന് മുൻപ് നിൽക്കുക) വിട്ടുപോയാൽ കമ്പ്യൂട്ടർ എന്ത് ചെയ്യും?',
        code: "# നിർദ്ദേശം: മുന്നോട്ട് പോവുക\n# നിർത്താനുള്ള കമാൻഡ് നൽകിയിട്ടില്ല",
        options: [
          {
            prefix: "A",
            text: "സാമാന്യബുദ്ധി ഇല്ലാത്തതിനാൽ നൽകിയ നിർദ്ദേശം അനുസരിച്ച് മുന്നോട്ട് പോയിക്കൊണ്ടേയിരിക്കും.",
            correct: true
          },
          {
            prefix: "B",
            text: "മനുഷ്യ ബുദ്ധി ഉപയോഗിച്ച് തനിയെ നിൽക്കാനുള്ള കമാൻഡ് ഉണ്ടാക്കും.",
            correct: false
          },
          {
            prefix: "C",
            text: "എന്ത് ചെയ്യണമെന്ന് മറ്റ് കമ്പ്യൂട്ടറുകളോട് ചോദിക്കും.",
            correct: false
          },
          {
            prefix: "D",
            text: "ഉപയോക്താവിൻ്റെ ഉദ്ദേശ്യം ഊഹിച്ചെടുത്ത് വഴി മാറ്റും.",
            correct: false
          }
        ],
        explanation_correct: "വിട്ടുപോയ കാര്യങ്ങൾ സ്വയം ഊഹിച്ചെടുക്കാൻ കമ്പ്യൂട്ടറിന് കഴിയില്ല; നൽകിയ നിർദ്ദേശം മാത്രമേ അത് ചെയ്യൂ.",
        explanation_incorrect: "കമ്പ്യൂട്ടറുകൾ നിർദ്ദേശങ്ങൾ അന്ധമായി പാലിക്കുന്നു; തനിയെ സുരക്ഷാ നിർദ്ദേശങ്ങൾ ഉണ്ടാക്കില്ല."
      }
    ]
  },
  explicit_steps: {
    badge: 'ആശയം 02 • വ്യക്തമായ നിർദ്ദേശങ്ങൾ',
    title: 'നിർദ്ദേശങ്ങൾ കൃത്യവും ക്രമാനുഗതവുമായിരിക്കണം',
    takeaway: 'കമ്പ്യൂട്ടറുകൾക്ക് നാം ഉദ്ദേശിക്കുന്നത് എന്തെന്ന് ഊഹിക്കാൻ കഴിയില്ല. അതിനാൽ ഓരോ കാര്യവും <hlt>വ്യക്തമായ ഘട്ടങ്ങളായി</hlt> നൽകണം. അവ്യക്തമായ നിർദ്ദേശങ്ങൾ പരാജയപ്പെടും.',
    reinforceQuestions: [
      {
        question: 'അവ്യക്തമായ നിർദ്ദേശങ്ങൾക്ക് പകരം കൃത്യമായ നിർദ്ദേശങ്ങൾ കമ്പ്യൂട്ടറിന് ആവശ്യമായി വരുന്നത് എന്തുകൊണ്ട്?',
        code: "# അവ്യക്തം: 'പണി തീർക്കുക'\n# കൃത്യം: step_1(); step_2(); step_3()",
        options: [
          {
            prefix: "A",
            text: "അവ്യക്തമായ വാചകങ്ങളുടെ ഉദ്ദേശ്യം സ്വയം ഊഹിച്ചെടുക്കാൻ അതിന് കഴിയില്ല.",
            correct: true
          },
          {
            prefix: "B",
            text: "ദിവസത്തിൽ ഒരു നിർദ്ദേശം മാത്രമേ അതിന് ചെയ്യാൻ കഴിയൂ.",
            correct: false
          },
          {
            prefix: "C",
            text: "ക്യാപിറ്റൽ ലെറ്ററിൽ എഴുതാത്ത കോഡ് അത് വായിക്കില്ല.",
            correct: false
          },
          {
            prefix: "D",
            text: "അവ്യക്തമായ കോഡ് അത് തനിയെ ഡിലീറ്റ് ചെയ്തു കളയും.",
            correct: false
          }
        ],
        explanation_correct: "പറയാത്ത കാര്യങ്ങൾ ഊഹിച്ചെടുക്കാൻ കഴിയാത്തതുകൊണ്ടാണ് കൃത്യമായ നിർദ്ദേശങ്ങൾ നൽകേണ്ടത്.",
        explanation_incorrect: "അവ്യക്തമായ വാക്കുകളിൽ നിന്നും ഉദ്ദേശ്യം ഗ്രഹിക്കാൻ കമ്പ്യൂട്ടറിന് കഴിയില്ല."
      },
      {
        question: 'താഴെ പറയുന്നവയിൽ ഒരു കമ്പ്യൂട്ടറിന് ഏറ്റവും അനുയോജ്യമായ നിർദ്ദേശം ഏതാണ്?',
        code: "# ചലന നിർദ്ദേശങ്ങൾ",
        options: [
          {
            prefix: "A",
            text: "robot.turn_degrees(90); robot.drive_meters(2)",
            correct: true
          },
          {
            prefix: "B",
            text: "robot.go_somewhere_nearby()",
            correct: false
          },
          {
            prefix: "C",
            text: "robot.do_what_looks_reasonable()",
            correct: false
          },
          {
            prefix: "D",
            text: "robot.figure_out_the_route_by_yourself()",
            correct: false
          }
        ],
        explanation_correct: "കൃത്യമായ അളവുകളും നിർദ്ദേശങ്ങളും അടങ്ങിയ കമാൻഡുകളാണ് കമ്പ്യൂട്ടറിന് ആവശ്യം.",
        explanation_incorrect: "അവ്യക്തമായ കമാൻഡുകൾ കമ്പ്യൂട്ടറിന് ആശയക്കുഴപ്പമുണ്ടാക്കും."
      }
    ]
  },
  execution_power: {
    badge: 'ആശയം 03 • വേഗതയും നിർവ്വഹണവും',
    title: 'ലാളിത്യം + അതിവേഗത = വലിയ പ്രവർത്തനക്ഷമത',
    takeaway: 'കമ്പ്യൂട്ടറുകൾക്ക് വലിയ ബുദ്ധിയുണ്ടെന്ന തോന്നൽ ഉണ്ടാകുന്നത് അവ സെക്കൻഡിൽ <hlt>ദശലക്ഷക്കണക്കിന് ലളിതമായ കാര്യങ്ങൾ അതിവേഗത്തിൽ</hlt> ചെയ്യുന്നതുകൊണ്ടാണ്.',
    reinforceQuestions: [
      {
        question: 'ലളിതമായ നിർദ്ദേശങ്ങൾ ഉപയോഗിച്ച് സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾ പരിഹരിക്കാൻ കമ്പ്യൂട്ടറിന് ശക്തി നൽകുന്നത് എന്താണ്?',
        code: "for op in range(1000000):\n    simple_operation()",
        options: [
          {
            prefix: "A",
            text: "ലളിതമായ പ്രവർത്തനങ്ങൾ അതിവേഗത്തിൽ ലക്ഷക്കണക്കിന് തവണ ആവർത്തിക്കാനുള്ള കഴിവ്.",
            correct: true
          },
          {
            prefix: "B",
            text: "നിർദ്ദേശങ്ങൾ ആവർത്തിക്കുമ്പോൾ അതിന് തനിയെ ബുദ്ധി ഉണ്ടാകുന്നത്.",
            correct: false
          },
          {
            prefix: "C",
            text: "കഠിനമായ കാര്യങ്ങൾ വരുമ്പോൾ ലളിതമായ നിർദ്ദേശങ്ങൾ ഒഴിവാക്കുന്നത്.",
            correct: false
          },
          {
            prefix: "D",
            text: "വൈദ്യുതിയെ മനുഷ്യ ചിന്തകളാക്കി മാറ്റുന്നത്.",
            correct: false
          }
        ],
        explanation_correct: "ലളിതമായ പ്രവർത്തനങ്ങൾ അതിവേഗത്തിൽ നടപ്പിലാക്കുന്നതിലൂടെയാണ് കമ്പ്യൂട്ടറിൻ്റെ കരുത്ത് പ്രകടമാകുന്നത്.",
        explanation_incorrect: "വേഗതയും നിർവ്വഹണ ശേഷിയുമാണ് കാരണം; ചിന്താശേഷിയല്ല."
      },
      {
        question: 'വീഡിയോ ഗെയിമുകൾ പോലുള്ള സങ്കീർണ്ണമായ കാര്യങ്ങൾ കമ്പ്യൂട്ടർ എങ്ങനെയാണ് പ്രദർശിപ്പിക്കുന്നത്?',
        code: "# സെക്കൻഡിൽ 60 ഫ്രെയിമുകൾ കണക്കാക്കുന്നു",
        options: [
          {
            prefix: "A",
            text: "സെക്കൻഡിൻ്റെ ചെറിയൊരംശം കൊണ്ട് കോടിക്കണക്കിന് ലളിതമായ കണക്കുകൂട്ടലുകൾ നടത്തിക്കൊണ്ട്.",
            correct: true
          },
          {
            prefix: "B",
            text: "മനുഷ്യ ഭാവന ഉപയോഗിച്ച് ഗ്രാഫിക്സ് സ്വപ്നം കണ്ടുകൊണ്ട്.",
            correct: false
          },
          {
            prefix: "C",
            text: "നിർദ്ദേശങ്ങൾ അവഗണിച്ച് പിക്സലുകൾ തനിയെ ഊഹിച്ചുകൊണ്ട്.",
            correct: false
          },
          {
            prefix: "D",
            text: "ജീവിതകാലം മുഴുവൻ ഒരൊറ്റ മാസ്റ്റർ കമാൻഡ് മാത്രം ഉപയോഗിച്ചുകൊണ്ട്.",
            correct: false
          }
        ],
        explanation_correct: "ലളിതമായ ഘട്ടങ്ങൾ മിന്നൽ വേഗത്തിൽ ആവർത്തിച്ചാണ് വിഷ്വൽ ഗ്രാഫിക്സ് നിർമ്മിക്കുന്നത്.",
        explanation_incorrect: "കമ്പ്യൂട്ടറുകൾ ഭാവന ചെയ്യുന്നില്ല; അവ കണക്കുകൂട്ടലുകൾ വേഗത്തിൽ ചെയ്യുന്നു."
      }
    ]
  },
  memory_state: {
    badge: 'ആശയം 04 • മെമ്മറിയും വേരിയബിളുകളും',
    title: 'റൺ ചെയ്യുമ്പോൾ വിവരങ്ങൾ സൂക്ഷിക്കുന്നത് മെമ്മറിയിലാണ്',
    takeaway: 'കോഡ് പ്രവർത്തിക്കുമ്പോൾ ലഭിക്കുന്ന വിവരങ്ങളും മാറ്റങ്ങളും സൂക്ഷിക്കാൻ കമ്പ്യൂട്ടറിന് <hlt>മെമ്മറി</hlt> ആവശ്യമാണ്. ഈ വിവരങ്ങൾക്ക് നാം നൽകുന്ന പേരാണ് വേരിയബിളുകൾ.',
    reinforceQuestions: [
      {
        question: 'ഒരു പ്രോഗ്രാം പ്രവർത്തിക്കുമ്പോൾ മെമ്മറിയുടെ പ്രധാന ധർമ്മം എന്താണ്?',
        code: "score = 100\n# score സൂചിപ്പിക്കുന്ന 100 എന്ന വില മെമ്മറിയിൽ സൂക്ഷിക്കുന്നു",
        options: [
          {
            prefix: "A",
            text: "പ്രോഗ്രാം ഉപയോഗിക്കുന്ന വിവരങ്ങളും വേരിയബിൾ മൂല്യങ്ങളും സൂക്ഷിക്കുക.",
            correct: true
          },
          {
            prefix: "B",
            text: "പ്രോസസറിനെ മാറ്റി എഴുതുക.",
            correct: false
          },
          {
            prefix: "C",
            text: "പ്രോഗ്രാമർക്കായി വിട്ടുപോയ കോഡ് തനിയെ എഴുതുക.",
            correct: false
          },
          {
            prefix: "D",
            text: "ഒരു തെറ്റും സംഭവിക്കാതെ തടയുക.",
            correct: false
          }
        ],
        explanation_correct: "പ്രവർത്തിക്കുന്ന പ്രോഗ്രാമിന് ആവശ്യമായ വിവരങ്ങൾ സൂക്ഷിക്കുന്നത് മെമ്മറിയിലാണ്.",
        explanation_incorrect: "റൺടൈം വേരിയബിളുകളും ഡാറ്റയും മെമ്മറിയിലാണ് സൂക്ഷിക്കുന്നത്."
      },
      {
        question: 'ഒരു പ്രോഗ്രാം score = 50 നൽകിയ ശേഷം score = score + 25 എന്ന് മാറ്റിയാൽ മെമ്മറിയിൽ എന്ത് സൂക്ഷിക്കും?',
        code: "score = 50\nscore = score + 25\n# score-ൻ്റെ മെമ്മറിയിൽ എന്ത് ഉണ്ടാകും?",
        options: [
          {
            prefix: "A",
            text: "score എന്ന വേരിയബിളിന് കീഴിൽ പുതിയ മൂല്യമായ 75 സൂക്ഷിക്കും.",
            correct: true
          },
          {
            prefix: "B",
            text: "ഒരേ സ്ഥലത്ത് 50-ഉം 75-ഉം ഒരേസമയം നിലനിൽക്കും.",
            correct: false
          },
          {
            prefix: "C",
            text: "കൂട്ടിക്കഴിഞ്ഞാൽ മെമ്മറി നമ്പറുകൾ മായ്ച്ചു കളയും.",
            correct: false
          },
          {
            prefix: "D",
            text: "മോണിറ്റർ തിരഞ്ഞെടുക്കുന്ന ഏതെങ്കിലും ഒരു സംഖ്യ.",
            correct: false
          }
        ],
        explanation_correct: "വേരിയബിളുകൾ മെമ്മറിയിലെ ഏറ്റവും പുതിയ പുതുക്കിയ മൂല്യത്തെയാണ് സൂചിപ്പിക്കുന്നത്.",
        explanation_incorrect: "വേരിയബിളിന് ലഭിച്ച ഏറ്റവും പുതിയ മൂല്യമാണ് മെമ്മറിയിൽ നിലനിൽക്കുക."
      }
    ]
  },
  debugging: {
    badge: 'ആശയം 05 • ഡീബഗ്ഗിംഗും പരിശോധനയും',
    title: 'ഡീബഗ്ഗിംഗ്: ഊഹിക്കുന്നതിനു പകരം ബ്രേക്ക്പോയിൻ്റുകളും സ്റ്റെപ്പുകളും',
    takeaway: 'നാം ഉദ്ദേശിച്ചതും യഥാർത്ഥത്തിൽ സംഭവിച്ചതും തമ്മിലുള്ള വ്യത്യാസമാണ് ബഗ്. ഊഹിക്കുന്നതിനു പകരം <hlt>ബ്രേക്ക്പോയിൻ്റ്</hlt> ഉപയോഗിച്ച് നിർത്താനും <hlt>വരി വരിയായി സ്റ്റെപ്പ് ചെയ്ത്</hlt> മെമ്മറി പരിശോധിക്കാനും സാധിക്കും.',
    reinforceQuestions: [
      {
        question: 'ഡീബഗ്ഗിംഗിൽ ഒരു ബ്രേക്ക്പോയിൻ്റ് (Breakpoint) ഉപയോഗിക്കുന്നത് എന്തിനാണ്?',
        code: "score = 100\n# [ബ്രേക്ക്പോയിൻ്റ് ഇവിടെ നിർത്തുന്നു]\nprint(score)",
        options: [
          {
            prefix: "A",
            text: "തിരഞ്ഞെടുത്ത വരിയിൽ പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തി മെമ്മറിയിലെ കാര്യങ്ങൾ പരിശോധിക്കാൻ.",
            correct: true
          },
          {
            prefix: "B",
            text: "ആ വരി കോഡിൽ നിന്ന് എന്നെന്നേക്കുമായി ഡിലീറ്റ് ചെയ്യാൻ.",
            correct: false
          },
          {
            prefix: "C",
            text: "എല്ലാ നിർദ്ദേശങ്ങളും ഒരേ സമയം റൺ ചെയ്യിക്കാൻ.",
            correct: false
          },
          {
            prefix: "D",
            text: "ബഗുകൾ സ്വയം തിരുത്തി ശരിയാക്കാൻ.",
            correct: false
          }
        ],
        explanation_correct: "ബ്രേക്ക്പോയിൻ്റ് പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തി മെമ്മറി സ്റ്റേറ്റ് കാണാൻ സഹായിക്കുന്നു.",
        explanation_incorrect: "പരിശോധനയ്ക്കായി പ്രോഗ്രാം നിർത്താനാണ് ബ്രേക്ക്പോയിൻ്റ്; ഡിലീറ്റ് ചെയ്യാനല്ല."
      },
      {
        question: 'ബഗ് എവിടെയാണെന്ന് ഊഹിക്കുന്നതിനേക്കാൾ നല്ലത് ഡീബഗ്ഗർ ഉപയോഗിച്ച് ഓരോ വരിയായി സ്റ്റെപ്പ് ചെയ്യുന്നതാണ് എന്ന് പറയുന്നത് എന്തുകൊണ്ട്?',
        code: "for item in cart:\n    total += item.price\n# സ്റ്റെപ്പ് ചെയ്ത് പരിശോധിക്കുക",
        options: [
          {
            prefix: "A",
            text: "ഓരോ വരിയിലും മെമ്മറിയിലെ തത്സമയ മൂല്യങ്ങൾ കണ്ട് എവിടെയാണ് പിശക് സംഭവിച്ചതെന്ന് കൃത്യമായി അറിയാം.",
            correct: true
          },
          {
            prefix: "B",
            text: "ഡീബഗ്ഗർ നിങ്ങൾക്കായി കോഡ് തനിയെ എഴുതിത്തരും.",
            correct: false
          },
          {
            prefix: "C",
            text: "എറർ കണ്ടാൽ അത് മുഴുവൻ പ്രോഗ്രാമും ഡിലീറ്റ് ചെയ്യും.",
            correct: false
          },
          {
            prefix: "D",
            text: "വേരിയബിളുകളുടെ വിലകൾ മാറാതെ തടഞ്ഞു നിർത്തും.",
            correct: false
          }
        ],
        explanation_correct: "സ്റ്റെപ്പ് ചെയ്യുന്നതിലൂടെ ഓരോ വരിയിലും മെമ്മറിയിൽ എന്ത് മാറ്റം വരുന്നു എന്ന് കൃത്യമായി കാണാം.",
        explanation_incorrect: "ലൈൻ-ബൈ-ലൈൻ സ്റ്റെപ്പിംഗ് തത്സമയ വേരിയബിൾ പരിശോധന സാധ്യമാക്കുന്നു."
      }
    ]
  },
  '1_2_1': {
    title: "കോഡ് എഡിറ്ററും നിയന്ത്രണങ്ങളും",
    subtitle: "കൺട്രോളുകൾ, ഡീബഗ്ഗിംഗ്, ഔട്ട്പുട്ട്",
    topic: "1.1 • കോഡ് എഡിറ്റർ",
    body: `<div style="display: flex; flex-direction: column; gap: 20px; width: 100%;"><div style="text-align: center; margin-bottom: 8px; width: 100%;"><div style="display: inline-block; background-color: #ffffff; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">1.1 • എഡിറ്റർ കൺട്രോളുകൾ</div><h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 32px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: -0.5px;">നിങ്ങളുടെ <hlt>കോഡിംഗ് കൺട്രോൾ ഡെക്ക്</hlt></h1><p style="font-size: 16px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 600px;">നിങ്ങളുടെ ആദ്യ പൈത്തൺ പ്രോഗ്രാം എഴുതുന്നതിന് മുൻപ്, എഡിറ്ററിലെ പ്രധാന ബട്ടണുകൾ എന്തൊക്കെയാണെന്ന് പരിചയപ്പെടാം.</p></div><div style="background: #ffffff; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 6px; padding: 18px; box-sizing: border-box;"><div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #111111; padding-bottom: 10px; margin-bottom: 14px;"><span style="font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;"> വർക്ക്സ്പേസ് രൂപരേഖ</span><span style="background: #fef08a; border: 2px solid #111111; padding: 2px 8px; font-size: 11px; font-weight: 800;">Adhicode IDE</span></div><div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px;"><div style=\"background: #f8fafc; border: 2px solid #111111; padding: 14px; border-radius: 4px;\"><div style=\"font-weight: 900; font-size: 13px; color: #1e293b; margin-bottom: 8px; text-transform: uppercase;\">ഇടത് കോളം: കോഡ് എഡിറ്റർ</div><div style=\"background: #0f172a; color: #f8fafc; padding: 10px 12px; font-family: monospace; font-size: 12px; border-radius: 4px; border: 2px solid #111111; line-height: 1.6;\"><span style=\"color: #ef4444; font-weight: bold;\">● 1</span> | <span style=\"color: #38bdf8;\">name</span> = <span style=\"color: #a7f3d0;\">\"Alex\"</span><br/><span style=\"color: #64748b;\">&nbsp; 2</span> | <span style=\"color: #38bdf8;\">score</span> = <span style=\"color: #facc15;\">100</span><br/><span style=\"color: #ef4444; font-weight: bold;\">● 3</span> | <span style=\"color: #38bdf8;\">total</span> = score + 50</div><p style=\"font-size: 12px; color: #334155; margin: 8px 0 0 0; font-weight: 600;\"><strong style=\"color: #ef4444;\">● ബ്രേക്ക്പോയിൻ്റ്:</strong> വരിയുടെ നമ്പറിൽ ക്ലിക്ക് ചെയ്താൽ അവിടെ പ്രോഗ്രാം താൽക്കാലികമായി നിൽക്കും.</p></div><div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"background: #e0e7ff; border: 2px solid #111111; padding: 10px; border-radius: 4px;\"><div style=\"font-weight: 900; font-size: 12px; text-transform: uppercase;\">മെമ്മറിയും വേരിയബിളുകളും</div><p style=\"font-size: 11px; font-weight: 600; color: #1e1b4b; margin: 4px 0 0 0;\">കംപ്യൂട്ടർ മെമ്മറിയിലുള്ള വേരിയബിളുകൾ, അവയുടെ ടൈപ്പ്, വില എന്നിവ കാണിക്കുന്നു.</p></div><div style=\"background: #dcfce7; border: 2px solid #111111; padding: 10px; border-radius: 4px;\"><div style=\"font-weight: 900; font-size: 12px; text-transform: uppercase;\">ഔട്ട്പുട്ട് കൺസോൾ</div><p style=\"font-size: 11px; font-weight: 600; color: #064e3b; margin: 4px 0 0 0;\">പ്രോഗ്രാം ഫലങ്ങളും ലോഗുകളും സിസ്റ്റം എറർ മെസ്സേജുകളും ഇവിടെ പ്രത്യക്ഷപ്പെടുന്നു.</p></div></div></div></div><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 14px;\"><div style=\"background: #bbf7d0; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; border-radius: 4px; padding: 16px;\"><div style=\"display: flex; align-items: center; gap: 8px; margin-bottom: 8px;\"><span style=\"background: #ffffff; border: 2px solid #111111; padding: 2px 8px; font-weight: 900; font-size: 12px;\">RUN</span><strong style=\"font-size: 15px; text-transform: uppercase;\">റൺ ചെയ്യുക</strong></div><p style=\"font-size: 13px; font-weight: 600; color: #111111; margin: 0; line-height: 1.4;\">പ്രോഗ്രാമിലെ എല്ലാ നിർദ്ദേശങ്ങളും മുകളിൽ നിന്ന് താഴേക്ക് സാധാരണ വേഗതയിൽ റൺ ചെയ്യുന്നു.</p></div><div style=\"background: #fef08a; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; border-radius: 4px; padding: 16px;\"><div style=\"display: flex; align-items: center; gap: 8px; margin-bottom: 8px;\"><span style=\"background: #ffffff; border: 2px solid #111111; padding: 2px 8px; font-weight: 900; font-size: 12px;\">DEBUG</span><strong style=\"font-size: 15px; text-transform: uppercase;\">ഡീബഗ്ഗിംഗ്</strong></div><p style=\"font-size: 13px; font-weight: 600; color: #111111; margin: 0; line-height: 1.4;\">ഓരോ വരിയായി നിരീക്ഷിച്ച് പ്രവർത്തിപ്പിക്കുന്നു. ബ്രേക്ക്പോയിൻ്റുകളിൽ തനിയെ നിന്നുതരുന്നു.</p></div><div style=\"background: #93c5fd; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; border-radius: 4px; padding: 16px;\"><div style=\"display: flex; align-items: center; gap: 8px; margin-bottom: 8px;\"><span style=\"background: #ffffff; border: 2px solid #111111; padding: 2px 8px; font-weight: 900; font-size: 12px;\">STEP</span><strong style=\"font-size: 15px; text-transform: uppercase;\">അടുത്ത വരി (Step)</strong></div><p style=\"font-size: 13px; font-weight: 600; color: #111111; margin: 0; line-height: 1.4;\">കൃത്യമായി <strong>ഒരു വരി മാത്രം</strong> മുന്നോട്ട് പ്രവർത്തിപ്പിച്ച് വേരിയബിളുകളിലെ മാറ്റങ്ങൾ കാട്ടിത്തരുന്നു.</p></div><div style=\"background: #fca5a5; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; border-radius: 4px; padding: 16px;\"><div style=\"display: flex; align-items: center; gap: 8px; margin-bottom: 8px;\"><span style=\"background: #ffffff; border: 2px solid #111111; padding: 2px 8px; font-weight: 900; font-size: 12px;\">↺ RESET</span><strong style=\"font-size: 15px; text-transform: uppercase;\">റീസെറ്റ്</strong></div><p style=\"font-size: 13px; font-weight: 600; color: #111111; margin: 0; line-height: 1.4;\">മെമ്മറി ക്ലിയർ ചെയ്ത് ഒന്നാം വരിയിൽ നിന്ന് വീണ്ടും തുടങ്ങാൻ സഹായിക്കുന്നു.</p></div></div><div style=\"background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;\"><p style=\"font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;\"> ചുരുക്കം: <hlt>Run</hlt> സാധാരണ ഫലം കാണാനും <hlt>Debug & Step</hlt> കോഡിന്റെ പ്രവർത്തനം ഇഴകീറി പരിശോധിക്കാനും സഹായിക്കുന്നു!</p></div></div>`
  },
  '1_2_2': {
    title: "പരിശീലന ക്വിസ്: കോഡ് എഡിറ്റർ നിയന്ത്രണങ്ങൾ",
    topic: "1.1 • കോഡ് എഡിറ്റർ",
    questions: [
      {
        badge: "ക്വിസ് • ചോദ്യം 1 / 5",
        question: "കോഡ് എഡിറ്ററിലെ \"Run\" ബട്ടൺ ക്ലിക്ക് ചെയ്യുമ്പോൾ എന്ത് സംഭവിക്കുന്നു?",
        code: "# Press Run\ngreeting = \"Welcome to Python\"",
        options: [
          {
            prefix: "A",
            text: "പ്രോഗ്രാമിലെ എല്ലാ നിർദ്ദേശങ്ങളും മുകളിൽ നിന്ന് താഴേക്ക് സാധാരണ വേഗതയിൽ കമ്പ്യൂട്ടർ റൺ ചെയ്യുന്നു.",
            correct: true
          },
          {
            prefix: "B",
            text: "എല്ലാ വരികളിലും തനിയെ നിന്ന് ഉപയോക്താവിനോട് ചോദിക്കുന്നു.",
            correct: false
          },
          {
            prefix: "C",
            text: "കോഡ് മുഴുവൻ ഡിലീറ്റ് ചെയ്ത് വിൻഡോ അടയ്ക്കുന്നു.",
            correct: false
          },
          {
            prefix: "D",
            text: "പൈത്തൺ കോഡിനെ ഒരു ചിത്രമാക്കി മാറ്റുന്നു.",
            correct: false
          }
        ],
        explanation_correct: "റൺ ബട്ടൺ കോഡ് മുകളിൽ നിന്ന് താഴേക്ക് തുടർച്ചയായി പ്രവർത്തിപ്പിക്കുന്നു.",
        explanation_incorrect: "റൺ മുഴുവൻ കോഡും പൂർണ്ണ വേഗതയിൽ റൺ ചെയ്യുന്നു."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 2 / 5",
        question: "വരിയുടെ നമ്പറിൽ ക്ലിക്ക് ചെയ്ത് ബ്രേക്ക്പോയിൻ്റ് (●) ഇടുമ്പോൾ എന്ത് സംഭവിക്കുന്നു?",
        code: "● 1 | name = \"Alex\"\n  2 | score = 100",
        options: [
          {
            prefix: "A",
            text: "ഡീബഗ്ഗിംഗ് സമയത്ത് ആ വരിയിൽ എത്തുമ്പോൾ പ്രോഗ്രാം താൽക്കാലികമായി നിർത്തുന്നു.",
            correct: true
          },
          {
            prefix: "B",
            text: "ആ വരി പൈത്തൺ എന്നെന്നേക്കുമായി ഒഴിവാക്കുന്നു.",
            correct: false
          },
          {
            prefix: "C",
            text: "ആ വരി 10 തവണ ആവർത്തിക്കുന്നു.",
            correct: false
          },
          {
            prefix: "D",
            text: "ആ വരിക്ക് പാസ്‌വേഡ് നൽകുന്നു.",
            correct: false
          }
        ],
        explanation_correct: "മെമ്മറി പരിശോധിക്കാനായി പ്രോഗ്രാം താൽക്കാലികമായി നിർത്താനാണ് ബ്രേക്ക്പോയിൻ്റ്.",
        explanation_incorrect: "ബ്രേക്ക്പോയിൻ്റുകൾ ഡീബഗ്ഗർ പരിശോധനയ്ക്കായി താൽക്കാലികമായി നിർത്താൻ സഹായിക്കുന്നു."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 3 / 5",
        question: "\"Step\" () ബട്ടൺ എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത്?",
        code: "step_1 = \"Setup\"\nstep_2 = \"Process\"\nstep_3 = \"Display\"",
        options: [
          {
            prefix: "A",
            text: "കൃത്യമായി അടുത്ത ഒരു വരി മാത്രം റൺ ചെയ്ത് വേരിയബിളുകൾ കാണാൻ സഹായിക്കുന്നു.",
            correct: true
          },
          {
            prefix: "B",
            text: "ബാക്കിയുള്ള എല്ലാ വരികളും ഒഴിവാക്കുന്നു.",
            correct: false
          },
          {
            prefix: "C",
            text: "മുൻപത്തെ വരിയിലേക്ക് തിരിച്ചുപോകുന്നു.",
            correct: false
          },
          {
            prefix: "D",
            text: "കംപ്യൂട്ടർ ഓഫ് ചെയ്യുന്നു.",
            correct: false
          }
        ],
        explanation_correct: "സ്റ്റെപ്പ് ബട്ടൺ കൃത്യമായി ഒരു വരി മാത്രം പ്രവർത്തിപ്പിക്കുന്നു.",
        explanation_incorrect: "സ്റ്റെപ്പിംഗ് ഓരോ വരിയായി മെമ്മറിയിലെ മാറ്റങ്ങൾ കാണാൻ സഹായിക്കുന്നു."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 4 / 5",
        question: "പ്രോഗ്രാമിലെ വേരിയബിളുകളുടെ തത്സമയ വിലകളും ടൈപ്പുകളും എവിടെയാണ് കാണാൻ കഴിയുക?",
        code: "score = 100\nbonus = 25\ntotal = score + bonus",
        options: [
          {
            prefix: "A",
            text: "വലത് വശത്തുള്ള Memory & Variables ടേബിളിൽ.",
            correct: true
          },
          {
            prefix: "B",
            text: "കീബോർഡ് ക്രമീകരണങ്ങളിൽ.",
            correct: false
          },
          {
            prefix: "C",
            text: "ബ്രൗസർ ഹിസ്റ്ററിയിൽ.",
            correct: false
          },
          {
            prefix: "D",
            text: "റീസൈക്കിൾ ബിന്നിൽ.",
            correct: false
          }
        ],
        explanation_correct: "വേരിയബിൾ ഇൻസ്പെക്ടർ ടേബിളിൽ എല്ലാ വേരിയബിളുകളുടെയും തത്സമയ വിലകൾ കാണാം.",
        explanation_incorrect: "എഡിറ്ററിലെ മെമ്മറി ടേബിളിലാണ് വേരിയബിളുകളുടെ വിവരങ്ങൾ ലഭ്യമാകുന്നത്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 5 / 5",
        question: "ഔട്ട്പുട്ട് കൺസോളിന്റെ പ്രധാന ധർമ്മം എന്താണ്?",
        code: "status = \"Program finished\"",
        options: [
          {
            prefix: "A",
            text: "പ്രോഗ്രാം ഫലങ്ങളും സ്റ്റാറ്റസ് ലോഗുകളും എറർ മെസ്സേജുകളും സ്ക്രീനിൽ കാണിക്കുക.",
            correct: true
          },
          {
            prefix: "B",
            text: "3D ആനിമേഷൻ തനിയെ ഉണ്ടാക്കുക.",
            correct: false
          },
          {
            prefix: "C",
            text: "ഹാർഡ് ഡിസ്ക് ഫോർമാറ്റ് ചെയ്യുക.",
            correct: false
          },
          {
            prefix: "D",
            text: "നിങ്ങൾക്കായി കോഡ് ടൈപ്പ് ചെയ്യുക.",
            correct: false
          }
        ],
        explanation_correct: "പ്രോഗ്രാം പ്രിൻ്റ് ചെയ്യുന്ന വിവരങ്ങൾ കാണിക്കുന്നത് ഔട്ട്പുട്ട് കൺസോളിലാണ്.",
        explanation_incorrect: "ഔട്ട്പുട്ട് കൺസോൾ സ്ക്രീനിലേക്ക് പ്രിൻ്റ് ചെയ്യുന്ന വിവരങ്ങൾ കാട്ടിത്തരുന്നു."
      }
    ]
  },
  '1_2_3': {
    title: "print() കമാൻഡ് — നിങ്ങളുടെ ആദ്യ മാന്ത്രികം",
    subtitle: "സ്ക്രീനിൽ വിവരങ്ങൾ കാണിക്കാം",
    topic: "1.2 • PRINT() കമാൻഡ്",
    body: `<div style="display: flex; flex-direction: column; gap: 20px; width: 100%;"><div style="text-align: center; margin-bottom: 8px; width: 100%;"><div style="display: inline-block; background-color: #ffffff; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">1.2 • പൈത്തൺ അടിസ്ഥാനം</div><h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 32px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: -0.5px;">The <hlt>print()</hlt> കമാൻഡ് — നിങ്ങളുടെ ആദ്യ മാന്ത്രികം</h1><p style="font-size: 16px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 600px;">പ്രോഗ്രാമിംഗിൽ സ്ക്രീനിലേക്ക് വിവരങ്ങൾ കാട്ടാൻ ഉപയോഗിക്കുന്ന കമാൻഡാണ് <hlt>print()</hlt>.</p></div><div style=\"background: #fef08a; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">1. പോസ്റ്റ് ബോക്സ് ഉപമ</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">സ്ക്രീനിലേക്ക് സന്ദേശങ്ങൾ അയക്കാം</h2><p style=\"font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;\"><hlt>print()</hlt> കമാൻഡിനെ ഔട്ട്പുട്ട് സ്ക്രീനിലേക്കുള്ള ഒരു തപാൽ പെട്ടിയായി സങ്കൽപ്പിക്കാം. ബ്രാക്കറ്റിനുള്ളിൽ നിങ്ങൾ നൽകുന്നതെന്തും സ്ക്രീനിൽ കൃത്യമായി ലഭിക്കും.</p><div style=\"background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 16px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 14px; border-radius: 4px;\"><span style=\"color: #f472b6;\">print</span>(<span style=\"color: #a5d6ff;\">\"Hellow\"</span>) &nbsp;<span style=\"color: #8b949e;\"># ഫലം: Hellow</span></div></div><div style=\"background: #93c5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">2. അക്ഷരങ്ങളും (Strings) സംഖ്യകളും (Integers)</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">ക്വോട്ടുകൾ പ്രധാനം!</h2><p style=\"font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;\">പൈത്തണിൽ വാക്കുകൾ എല്ലായ്പ്പോഴും കൊട്ടേഷൻ മാർക്കുകളിൽ നൽകണം (<hlt>\"...\"</hlt>). ഇത് <strong>സ്ട്രിംഗ് (str)</strong> ആണ്. എന്നാൽ <hlt>5</hlt> പോലെയുള്ള യഥാർത്ഥ സംഖ്യകൾക്ക് കൊട്ടേഷൻ ആവശ്യമില്ല!</p><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\"><div style=\"background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;\"><strong style=\"font-family: 'Title', monospace; color: #0284c7;\">വാക്കുകൾ / സ്ട്രിംഗ് (str)</strong><div style=\"font-family: monospace; font-size: 13px; margin-top: 6px; background: #f1f5f9; padding: 6px; border-radius: 3px;\">print(\"Hellow\")</div><p style=\"font-size: 12px; margin: 6px 0 0 0; color: #475569;\">കൊട്ടേഷൻസ് പൈത്തണിനോട് പറയുന്നു: 'ഇത് വെറും അക്ഷരങ്ങളാണ്.'</p></div><div style=\"background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;\"><strong style=\"font-family: 'Title', monospace; color: #16a34a;\">സംഖ്യ / ഇൻ്റിജർ (int)</strong><div style=\"font-family: monospace; font-size: 13px; margin-top: 6px; background: #f1f5f9; padding: 6px; border-radius: 3px;\">print(5)</div><p style=\"font-size: 12px; margin: 6px 0 0 0; color: #475569;\">കൊട്ടേഷൻസ് ഇല്ല! കണക്കുകൂട്ടാൻ സാധിക്കുന്ന സംഖ്യയാണിത്.</p></div></div></div><div style=\"background: #fca5a5; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">3. പ്രധാന പിശകുകൾ</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">ഈ തെറ്റുകൾ ഒഴിവാക്കുക!</h2><div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\"><div style=\"background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;\"><strong style=\"color: #dc2626; font-size: 13px;\">ക്ലോസിംഗ് കോട്ട് ഇല്ല → SyntaxError</strong><div style=\"font-family: monospace; font-size: 13px; margin-top: 6px; background: #fef2f2; padding: 6px; border-radius: 3px; color: #991b1b;\">print(\"Hellow)</div><p style=\"font-size: 12px; margin: 6px 0 0 0; color: #475569;\">തുടക്കത്തിലെ കോട്ടിന് തുല്യമായി ഒടുക്കത്തിലും കോട്ട് വേണം. വിട്ടുപോയാൽ എറർ വരും.</p></div><div style=\"background: #ffffff; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 14px;\"><strong style=\"color: #d97706; font-size: 13px;\">വാക്കുകൾക്ക് കോട്ട് ഇല്ലെങ്കിൽ → NameError</strong><div style=\"font-family: monospace; font-size: 13px; margin-top: 6px; background: #fffbeb; padding: 6px; border-radius: 3px; color: #92400e;\">print(Hellow)</div><p style=\"font-size: 12px; margin: 6px 0 0 0; color: #475569;\">കോട്ട് ഇല്ലാതെ എഴുതിയാൽ പൈത്തൺ അതിനെ വേരിയബിൾ ആയി കരുതും, നിർവ്വചിച്ചിട്ടില്ലെങ്കിൽ NameError നൽകും.</p></div></div></div><div style=\"background: #86efac; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">4. അക്ഷരങ്ങളുടെ ശ്രേണി പ്രിൻ്റ് ചെയ്യൽ</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">അക്ഷരങ്ങൾ നിരയായി</h2><p style=\"font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;\">അക്ഷരങ്ങൾ ഇടവിട്ട് പ്രിൻ്റ് ചെയ്യാൻ <hlt>print(\"P Y T H O N\")</hlt> എന്ന് എഴുതാവുന്നതാണ്.</p><div style=\"background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 16px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 14px; border-radius: 4px;\"><span style=\"color: #f472b6;\">print</span>(<span style=\"color: #a5d6ff;\">\"P Y T H O N\"</span>)<br/><span style=\"color: #8b949e;\"># ഔട്ട്പുട്ടിൽ അക്ഷരങ്ങൾ കൃത്യമായി പ്രത്യക്ഷപ്പെടും!</span></div></div><div style=\"background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;\"><p style=\"font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;\"> കോഡിംഗിന് തയ്യാറാകൂ: അടുത്ത പേജിൽ 3 ലൈവ് ചലഞ്ചുകൾ പൂർത്തിയാക്കുക!</p></div></div>`
  },
  '1_2_4': {
    title: "ഇന്ററാക്ടീവ് കോഡിംഗ്: print() മാന്ത്രികം",
    subtitle: "നിങ്ങളുടെ ആദ്യ പൈത്തൺ പ്രോഗ്രാമുകൾ",
    topic: "1.2 • PRINT() കമാൻഡ്",
    description: "താഴെയുള്ള 3 ഘട്ടങ്ങളും വിജയകരമായി പൂർത്തിയാക്കി <hlt>print()</hlt> കമാൻഡ് സ്വായത്തമാക്കൂ!",
    intended_output: "Hellow",
    starter_code: "# ഘട്ടം 1: Hellow എന്ന് പ്രിൻ്റ് ചെയ്യുക\n# താഴെ കോഡ് എഴുതി Run ക്ലിക്ക് ചെയ്യുക:\n\n",
    challenges: [
      {
        stage: 1,
        title: "ഘട്ടം 1: \"Hellow\" പ്രിൻ്റ് ചെയ്യുക",
        description: "<hlt>print()</hlt> കമാൻഡ് ഉപയോഗിച്ച് കൺസോളിലേക്ക് <hlt>\"Hellow\"</hlt> എന്ന് പ്രിൻ്റ് ചെയ്യുക.",
        starter_code: "# ഘട്ടം 1: Hellow എന്ന് പ്രിൻ്റ് ചെയ്യുക\n# നിങ്ങളുടെ കോഡ് താഴെ എഴുതുക:\n\n",
        intended_output: "Hellow",
        ai_check: null
      },
      {
        stage: 2,
        title: "ഘട്ടം 2: സംഖ്യ 5 ഒരു ഇൻ്റിജറായി പ്രിൻ്റ് ചെയ്യുക",
        description: "ഇനി സംഖ്യ <hlt>5</hlt> പ്രിൻ്റ് ചെയ്യുക. പൈത്തണിൽ സംഖ്യകൾക്ക് കൊട്ടേഷൻസ് നൽകരുത്! നിങ്ങൾ കൊട്ടേഷൻ ഇല്ലാതെയാണോ എഴുതിയതെന്ന് നമ്മുടെ <strong>ഇൻബിൽറ്റ് AI</strong> പരിശോധിക്കും.",
        starter_code: "# ഘട്ടം 2: സംഖ്യ 5 ഇൻ്റിജറായി പ്രിൻ്റ് ചെയ്യുക (Quotes ഇല്ലാതെ!)\n# നിങ്ങളുടെ കോഡ് താഴെ എഴുതുക:\n\n",
        intended_output: "5",
        ai_check: "int_not_str_5"
      },
      {
        stage: 3,
        title: "ഘട്ടം 3: അക്ഷരങ്ങളുടെ ശ്രേണി പ്രിൻ്റ് ചെയ്യുക",
        description: "ഇടവിട്ട അക്ഷരങ്ങളുടെ ശ്രേണി പ്രിൻ്റ് ചെയ്യുക: <hlt>P Y T H O N</hlt>. <hlt>print(\"P Y T H O N\")</hlt> എന്ന് എഴുതി Run ക്ലിക്ക് ചെയ്യുക!",
        starter_code: "# ഘട്ടം 3: അക്ഷര ശ്രേണി പ്രിൻ്റ് ചെയ്യുക\n# നിങ്ങളുടെ കോഡ് താഴെ എഴുതുക:\n\n",
        intended_output: "P Y T H O N",
        ai_check: null
      }
    ]
  },
  '1_2_5': {
    title: "പരിശീലന ക്വിസ്: print() കമാൻഡും ഡാറ്റാ ടൈപ്പുകളും",
    topic: "1.2 • PRINT() കമാൻഡ്",
    questions: [
      {
        badge: "ക്വിസ് • ചോദ്യം 1 / 5",
        question: "താഴെ പറയുന്നവയിൽ \"Hellow\" എന്ന് കൃത്യമായി പ്രിൻ്റ് ചെയ്യുന്നത് ഏതാണ്?",
        code: "# ശരിയായ വാക്യം തിരഞ്ഞെടുക്കുക:",
        options: [
          {
            prefix: "A",
            text: "print(\"Hellow\")",
            correct: true
          },
          {
            prefix: "B",
            text: "Print(Hellow)",
            correct: false
          },
          {
            prefix: "C",
            text: "output \"Hellow\"",
            correct: false
          },
          {
            prefix: "D",
            text: "echo << \"Hellow\"",
            correct: false
          }
        ],
        explanation_correct: "പൈത്തണിലെ print() സ്മോൾ ലെറ്ററിലാണ് തുടങ്ങുന്നത്, ഒപ്പം കൊട്ടേഷൻസിൽ വാക്ക് നൽകണം.",
        explanation_incorrect: "പൈത്തൺ കേസ്-സെൻസിറ്റീവ് ആണ്, അതിനാൽ print(\"Hellow\") എന്ന് ചെറിയ അക്ഷരത്തിൽ എഴുതണം."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 2 / 5",
        question: "print(5) ഉം print(\"5\") ഉം തമ്മിലുള്ള പ്രധാന വ്യത്യാസം എന്താണ്?",
        code: "print(5)    # A\nprint(\"5\")  # B",
        options: [
          {
            prefix: "A",
            text: "5 എന്നത് കണക്കുകൂട്ടാൻ കഴിയുന്ന ഇൻ്റിജർ (int) ആണ്, \"5\" എന്നത് ഒരു അക്ഷര സ്ട്രിംഗ് (str) ആണ്.",
            correct: true
          },
          {
            prefix: "B",
            text: "print(5) എറർ ഉണ്ടാക്കുന്നു കാരണം സംഖ്യകൾ പ്രിൻ്റ് ചെയ്യാൻ കഴിയില്ല.",
            correct: false
          },
          {
            prefix: "C",
            text: "print(\"5\") 5 ശൂന്യമായ വരികൾ പ്രിൻ്റ് ചെയ്യുന്നു.",
            correct: false
          },
          {
            prefix: "D",
            text: "പൈത്തൺ മെമ്മറിയിൽ ഇവ രണ്ടും തമ്മിൽ യാതൊരു വ്യത്യാസവുമില്ല.",
            correct: false
          }
        ],
        explanation_correct: "ക്വോട്ടുകളില്ലാത്ത സംഖ്യകൾ ഇൻ്റിജറുകളായാണ് (int) കമ്പ്യൂട്ടർ മെമ്മറിയിൽ സൂക്ഷിക്കുന്നത്.",
        explanation_incorrect: "5 എന്നത് ഇൻ്റിജറും \"5\" എന്നത് സ്ട്രിംഗുമാണ്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 3 / 5",
        question: "ഈ കോഡ് റൺ ചെയ്യുമ്പോൾ പൈത്തൺ എറർ കാണിക്കുന്നത് എന്തുകൊണ്ട്?",
        code: "print(\"Hellow)",
        options: [
          {
            prefix: "A",
            text: "തുടങ്ങിയ കൊട്ടേഷൻ മാർക്ക് അവസാനിപ്പിച്ചിട്ടില്ല (Unterminated string).",
            correct: true
          },
          {
            prefix: "B",
            text: "\"Hellow\" എന്നത് പൈത്തൺ കീവേഡ് അല്ലാത്തതുകൊണ്ട്.",
            correct: false
          },
          {
            prefix: "C",
            text: "പൈത്തൺ ഇരട്ട കൊട്ടേഷൻസ് പിന്തുണയ്ക്കാത്തതുകൊണ്ട്.",
            correct: false
          },
          {
            prefix: "D",
            text: "ഒന്നാമത്തെ വരിയിൽ print() ഉപയോഗിക്കാൻ പറ്റാത്തതുകൊണ്ട്.",
            correct: false
          }
        ],
        explanation_correct: "തുടങ്ങിയ ക്വോട്ട് അടയ്ക്കാതിരുന്നാൽ സിന്റാക്സ് എറർ സംഭവിക്കുന്നു.",
        explanation_incorrect: "ക്വോട്ടേഷൻ മാർക്കുകൾ എപ്പോഴും ജോഡിയായി വരണം."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 4 / 5",
        question: "P Y T H O N എന്ന അക്ഷരങ്ങൾ കൃത്യമായി ഔട്ട്പുട്ട് ചെയ്യാൻ ഏതാണ് ശരിയായ രീതി?",
        code: "# Target: P Y T H O N",
        options: [
          {
            prefix: "A",
            text: "print(\"P Y T H O N\")",
            correct: true
          },
          {
            prefix: "B",
            text: "print(P, Y, T, H, O, N)",
            correct: false
          },
          {
            prefix: "C",
            text: "sequence[\"P Y T H O N\"]",
            correct: false
          },
          {
            prefix: "D",
            text: "letter_display(P-Y-T-H-O-N)",
            correct: false
          }
        ],
        explanation_correct: "അക്ഷരങ്ങൾ ക്വോട്ടുകളിൽ നൽകിയാൽ സ്ക്രീനിൽ കൃത്യമായി തെളിയും.",
        explanation_incorrect: "ക്വോട്ടുകളില്ലാതെ എഴുതിയാൽ പൈത്തൺ അവയെ വേരിയബിളുകളായി തെറ്റിദ്ധരിക്കും."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 5 / 5",
        question: "ക്വോട്ടുകൾ ഇല്ലാതെ print(Hellow) എന്ന് എഴുതിയാൽ എന്ത് സംഭവിക്കും?",
        code: "print(Hellow)",
        options: [
          {
            prefix: "A",
            text: "Hellow എന്നത് ഒരു വേരിയബിൾ ആണെന്ന് കരുതി NameError കാണിക്കും.",
            correct: true
          },
          {
            prefix: "B",
            text: "പൈത്തൺ തനിയെ ക്വോട്ടുകൾ ചേർത്ത് പ്രിൻ്റ് ചെയ്യും.",
            correct: false
          },
          {
            prefix: "C",
            text: "പൈത്തൺ അത് മറ്റൊരു ഭാഷയിലേക്ക് മാറ്റും.",
            correct: false
          },
          {
            prefix: "D",
            text: "കംപ്യൂട്ടർ റീസ്റ്റാർട്ട് ആകും.",
            correct: false
          }
        ],
        explanation_correct: "ക്വോട്ടുകളില്ലാത്ത വാക്കുകളെ വേരിയബിളുകളായാണ് പൈത്തൺ കരുതുന്നത്. വേരിയബിൾ ഇല്ലെങ്കിൽ NameError വരും.",
        explanation_incorrect: "മുൻകൂട്ടി നിർവ്വചിക്കാത്ത പേരുകൾക്ക് പൈത്തൺ NameError നൽകുന്നു."
      }
    ]
  },
  '1_2_6': {
    title: "കോഡ് റൺ ചെയ്യുമ്പോൾ സംഭവിക്കുന്നത് എന്ത്?",
    subtitle: "മുകളിൽ നിന്ന് താഴേക്കുള്ള പ്രവർത്തന ക്രമം",
    topic: "1.3 • കോഡ് പ്രവർത്തിപ്പിക്കൽ",
    body: `<div style="display: flex; flex-direction: column; gap: 20px; width: 100%;"><div style="text-align: center; margin-bottom: 8px; width: 100%;"><div style="display: inline-block; background-color: #ffffff; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">1.3 • പ്രോഗ്രാം ഫ്ലോ</div><h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 32px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: -0.5px;">പ്രവർത്തന <hlt>ക്രമം</hlt> (Order of Execution)</h1><p style="font-size: 16px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 600px;">നിങ്ങൾ Run ക്ലിക്ക് ചെയ്യുമ്പോൾ കമ്പ്യൂട്ടർ എങ്ങനെയാണ് ഓരോ വരിയും പ്രവർത്തിപ്പിക്കുന്നത് എന്ന് നോക്കാം.</p></div><div style=\"background: #fef08a; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">1. മുകളിൽ നിന്ന് താഴേക്ക്</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">പുസ്തകം വായിക്കുന്നത് പോലെ</h2><p style=\"font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;\">നാം പുസ്തകം വായിക്കുന്നത് പോലെ പൈത്തൺ <strong>മുകളിൽ നിന്ന് താഴേക്ക് ഓരോ വരിയായി</strong> മാത്രമേ കോഡ് വായിക്കുകയുള്ളൂ. അത് സ്വയം വരികൾ ചാടിക്കടക്കില്ല.</p><div style=\"display: flex; flex-direction: column; gap: 8px;\"><div style=\"background: #ffffff; border: 2px solid #111111; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;\"><span style=\"font-family: monospace; font-weight: bold; color: #0284c7;\">വരി 1: print(\"First\")</span><span style=\"font-size: 12px; font-weight: 800; background: #e0f2fe; border: 1px solid #111111; padding: 2px 8px;\">[1] ആദ്യം റൺ ചെയ്യുന്നു</span></div><div style=\"background: #ffffff; border: 2px solid #111111; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;\"><span style=\"font-family: monospace; font-weight: bold; color: #16a34a;\">വരി 2: print(\"Second\")</span><span style=\"font-size: 12px; font-weight: 800; background: #dcfce7; border: 1px solid #111111; padding: 2px 8px;\">[2] രണ്ടാമത് റൺ ചെയ്യുന്നു</span></div><div style=\"background: #ffffff; border: 2px solid #111111; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;\"><span style=\"font-family: monospace; font-weight: bold; color: #d97706;\">വരി 3: print(\"Third\")</span><span style=\"font-size: 12px; font-weight: 800; background: #fef3c7; border: 1px solid #111111; padding: 2px 8px;\">[3] അവസാനം റൺ ചെയ്യുന്നു</span></div></div></div><div style=\"background: #93c5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">2. ക്രമം ഫലത്തെ മാറ്റുന്നു</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">വരികളുടെ ക്രമം പ്രധാനം</h2><p style=\"font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;\">വരികളുടെ ക്രമം മാറ്റി എഴുതിയാൽ ഔട്ട്പുട്ടിലെ ക്രമവും ഉടൻ മാറും. കമ്പ്യൂട്ടർ എഴുതിയ അതേ ക്രമം പിന്തുടരുന്നു.</p><div style=\"background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 12px 16px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 14px; border-radius: 4px;\"><span style=\"color: #f472b6;\">print</span>(<span style=\"color: #a5d6ff;\">\"Game Over\"</span>)<br/><span style=\"color: #f472b6;\">print</span>(<span style=\"color: #a5d6ff;\">\"Welcome Player 1\"</span>)<br/><span style=\"color: #8b949e;\"># വരി 1 ലുള്ള 'Game Over' ആണ് ആദ്യം പ്രിൻ്റ് ആകുന്നത്!</span></div></div><div style=\"background: #fca5a5; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; box-sizing: border-box;\"><span style=\"display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;\">3. എറർ വന്നാൽ എന്ത് സംഭവിക്കും?</span><h2 style=\"font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;\">തൽക്ഷണം നിൽക്കുന്നു</h2><p style=\"font-size: 15px; font-weight: 600; color: #111111; margin: 0; line-height: 1.5;\">രണ്ടാമത്തെ വരിയിൽ ഒരു എറർ വന്നാൽ അതിന് മുമ്പുള്ള വരികൾ റൺ ആകുമെങ്കിലും രണ്ടാമത്തെ വരിയിൽ വെച്ച് പ്രോഗ്രാം നിലയ്ക്കുകയും താഴെയുള്ള വരികൾ റൺ ആകാതിരിക്കുകയും ചെയ്യുന്നു.</p></div><div style=\"background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;\"><p style=\"font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;\">പ്രധാന നിയമം: പൈത്തൺ പ്രോഗ്രാമുകൾ <hlt>തുടർച്ചയായ ക്രമത്തിലാണ്</hlt> പ്രവർത്തിക്കുന്നത്—വരി 1 തീർന്നതിന് ശേഷമേ വരി 2 തുടങ്ങൂ!</p></div></div>`
  },
  '1_2_7': {
    title: "പരിശീലന ക്വിസ്: പ്രവർത്തന ക്രമവും പ്രോഗ്രാം ഫ്ലോയും",
    topic: "1.3 • കോഡ് പ്രവർത്തിപ്പിക്കൽ",
    questions: [
      {
        badge: "ക്വിസ് • ചോദ്യം 1 / 5",
        question: "പൈത്തൺ ഇന്റർപ്രെറ്റർ ഏത് ക്രമത്തിലാണ് നിർദ്ദേശങ്ങൾ പ്രവർത്തിപ്പിക്കുന്നത്?",
        code: "# പൈത്തൺ പ്രവർത്തന നിയമം:",
        options: [
          {
            prefix: "A",
            text: "മുകളിൽ നിന്ന് താഴേക്ക് ഓരോ വരിയായി ക്രമത്തിൽ.",
            correct: true
          },
          {
            prefix: "B",
            text: "ചെറിയ വരികൾ ആദ്യം തിരഞ്ഞെടുത്ത് ക്രമരഹിതമായി.",
            correct: false
          },
          {
            prefix: "C",
            text: "താഴെ നിന്ന് മുകളിലേക്ക് റിവേഴ്സ് ആയി.",
            correct: false
          },
          {
            prefix: "D",
            text: "എല്ലാ വരികളും ഒരേ സമയം ഒരൊറ്റ നിമിഷത്തിൽ.",
            correct: false
          }
        ],
        explanation_correct: "പൈത്തൺ മുകളിൽ നിന്ന് താഴേക്ക് ഓരോ വരിയായി കൃത്യമായ ക്രമത്തിൽ പ്രവർത്തിക്കുന്നു.",
        explanation_incorrect: "പൈത്തൺ വരി 1 ൽ തുടങ്ങി താഴേക്ക് ക്രമമായി പോകുന്നു."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 2 / 5",
        question: "ഈ സ്ക്രിപ്റ്റ് റൺ ചെയ്യുമ്പോൾ കൺസോളിൽ എന്ത് ലഭിക്കും?",
        code: "print(\"Morning\")\nprint(\"Afternoon\")\nprint(\"Evening\")",
        options: [
          {
            prefix: "A",
            text: "Morning\nAfternoon\nEvening",
            correct: true
          },
          {
            prefix: "B",
            text: "Evening\nAfternoon\nMorning",
            correct: false
          },
          {
            prefix: "C",
            text: "Morning Afternoon Evening (എല്ലാം ഒരൊറ്റ വരിയിൽ)",
            correct: false
          },
          {
            prefix: "D",
            text: "Afternoon\nEvening\nMorning",
            correct: false
          }
        ],
        explanation_correct: "ഓരോ print() ഉം പുതിയ വരിയിൽ എഴുതിയ അതേ ക്രമത്തിൽ പ്രത്യക്ഷപ്പെടുന്നു.",
        explanation_incorrect: "എഴുതിയ അതേ മുകളിൽ നിന്ന് താഴേക്കുള്ള ക്രമത്തിലാണ് പ്രിൻ്റ് ആകുന്നത്."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 3 / 5",
        question: "വരി 2 ൽ ഒരു സിന്റാക്സ് എറർ ഉണ്ടായാൽ എന്ത് സംഭവിക്കും?",
        code: "print(\"Line 1\")\nprint(\"Line 2\"   # ക്ലോസിംഗ് ബ്രാക്കറ്റ് ഇല്ല\nprint(\"Line 3\")",
        options: [
          {
            prefix: "A",
            text: "പൈത്തൺ പ്രവർത്തനം നിർത്തി എറർ കാട്ടുന്നു; വരി 3 റൺ ആകില്ല.",
            correct: true
          },
          {
            prefix: "B",
            text: "വരി 2 ലെ എറർ അവഗണിച്ച് വരി 3 റൺ ചെയ്യുന്നു.",
            correct: false
          },
          {
            prefix: "C",
            text: "പൈത്തൺ ബ്രാക്കറ്റ് സ്വയം ശരിയാക്കുന്നു.",
            correct: false
          },
          {
            prefix: "D",
            text: "വരി 3 ആദ്യം റൺ ചെയ്യുന്നു.",
            correct: false
          }
        ],
        explanation_correct: "എറർ കണ്ടാൽ പൈത്തൺ ഉടൻ നിൽക്കും, പിന്നീടുള്ള വരികൾ പ്രവർത്തിക്കില്ല.",
        explanation_incorrect: "തടസ്സമില്ലാത്ത എററുകൾ വന്നാൽ പിന്നീടുള്ള വരികൾ റൺ ആകില്ല."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 4 / 5",
        question: "ഈ കോഡിന്റെ ഔട്ട്പുട്ട് എന്തായിരിക്കും?",
        code: "print(10)\nprint(20)",
        options: [
          {
            prefix: "A",
            text: "10\n20",
            correct: true
          },
          {
            prefix: "B",
            text: "30",
            correct: false
          },
          {
            prefix: "C",
            text: "20\n10",
            correct: false
          },
          {
            prefix: "D",
            text: "10 20",
            correct: false
          }
        ],
        explanation_correct: "ആദ്യം 10 പ്രിൻ്റ് ചെയ്യുന്നു, ശേഷം അടുത്ത വരിയിൽ 20 പ്രിൻ്റ് ചെയ്യുന്നു.",
        explanation_incorrect: "ഇവ രണ്ടും വെവ്വേറെ print കമാൻഡുകൾ ആയതിനാൽ 10 ഉം 20 ഉം വെവ്വേറെ വരികളിൽ വരുന്നു."
      },
      {
        badge: "ക്വിസ് • ചോദ്യം 5 / 5",
        question: "ശരിയോ തെറ്റോ: പ്രധാന്യത്തിന്റെ അടിസ്ഥാനത്തിൽ പൈത്തൺ വരികളുടെ ക്രമം സ്വയം മാറ്റുമോ?",
        code: "price = 100\nprint(price)\nname = \"Laptop\"",
        options: [
          {
            prefix: "A",
            text: "തെറ്റ് — പൈത്തൺ നിങ്ങൾ എഴുതിയ ക്രമം മാത്രമേ അനുസരിക്കൂ.",
            correct: true
          },
          {
            prefix: "B",
            text: "ശരി — പ്രധാന വേരിയബിളുകൾ പൈത്തൺ സ്വയം മുകളിലേക്ക് മാറ്റും.",
            correct: false
          }
        ],
        explanation_correct: "കമ്പ്യൂട്ടറുകൾക്ക് 'പ്രാധാന്യം' എന്ന സങ്കല്പമില്ല; എഴുതിയ ക്രമത്തിൽ മാത്രം പ്രവർത്തിക്കുന്നു!",
        explanation_incorrect: "പൈത്തൺ ഒരിക്കലും വരികളുടെ ക്രമം സ്വയം മാറ്റില്ല."
      }
    ]
  }
};



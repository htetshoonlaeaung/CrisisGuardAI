import { Language } from './translations';

const presetLabels: Record<string, string> = {
  med_cardiac: 'နှလုံးရပ်ခြင်း',
  med_arterial: 'သွေးထွက်သံယိုဖြစ်ခြင်း',
  med_choking: 'အသက်ရှူလမ်းကြောင်း ပိတ်ခြင်း',
  med_stroke: 'Stroke (F.A.S.T.)',
  med_burns: 'ပြင်းထန်သော မီးလောင်ဒဏ်',
  med_poison: 'အဆိပ် / အန္တရာယ်ရှိပစ္စည်း ထိတွေ့ခြင်း',
  fire_electrical: 'လျှပ်စစ်မီးလောင်ခြင်း',
  fire_grease: 'ဆီမီး / မီးဖိုမီးလောင်ခြင်း',
  fire_gas_leak: 'အိမ်တွင်း ဓာတ်ငွေ့ယိုစိမ့်ခြင်း',
  fire_trapped: 'အဆောက်အအုံမီးတွင် ပိတ်မိခြင်း',
  dis_flood_1floor: 'ရုတ်တရက်ရေကြီးခြင်း (တစ်ထပ်)',
  dis_earthquake_active: 'ငလျင်လှုပ်နေဆဲ',
  dis_tsunami: 'ဆူနာမီ သတိပေးချက် / ရေလှိုင်း',
  dis_quake_gas: 'ငလျင်နောက် ဓာတ်ငွေ့ယိုစိမ့်ခြင်း',
  road_unconscious: 'ယာဉ်မတော်တဆမှုတွင် သတိမရှိသူ',
  road_fire_trapped: 'ယာဉ်မီးလောင်ပြီး ပိတ်မိခြင်း',
  road_traffic_hazard: 'အမြန်လမ်းယာဉ်အန္တရာယ်',
  road_mci: 'လူနာအများအပြားဖြစ်စဉ် (MCI)',
};

const presetDescriptions: Record<string, string> = {
  med_cardiac: 'သတိမရှိပြီး အသက်ရှူမရှိ / မမှန်',
  med_arterial: 'ပြင်းထန်စွာ သွေးခုန်ထွက်ခြင်း / စုပုံယိုခြင်း',
  med_choking: 'စကားမပြောနိုင်၊ မချောင်းဆိုးနိုင်၊ အသက်မရှူနိုင်',
  med_stroke: 'မျက်နှာရွဲ့၊ လက်အားနည်း၊ စကားမရှင်း',
  med_burns: 'ကြီးမားသော အပူ/ဓာတု မီးလောင်ဒဏ်',
  med_poison: 'အန္တရာယ်ရှိသော ဓာတုပစ္စည်း သို့မဟုတ် အဆိပ်ဝင်ခြင်း',
  fire_electrical: 'လျှပ်စစ်ပစ္စည်း/ဘရိတ်ကာ မီးလောင်ခြင်း - ရေမသုံးရ',
  fire_grease: 'မီးဖိုပေါ် ဆီမီးလောင်ခြင်း - steam explosion အန္တရာယ်',
  fire_gas_leak: 'ကြက်ဥပုပ်နံ့ကဲ့သို့ ဓာတ်ငွေ့နံ့ - ပေါက်ကွဲနိုင်',
  fire_trapped: 'မီးခိုးထူပြီး ထွက်ပေါက်များ ပိတ်နေခြင်း',
  dis_flood_1floor: 'မြေညီထပ်တွင် ရေမြန်မြန်တက်နေခြင်း',
  dis_earthquake_active: 'ပြင်းထန်သော ငလျင်လှုပ်နေဆဲ',
  dis_tsunami: 'ကမ်းရိုးတန်းရေလျော့ / ကုန်းတွင်းရေလှိုင်းအန္တရာယ်',
  dis_quake_gas: 'အဆောက်အအုံရွေ့ပြီး ဓာတ်ငွေ့နံ့ပြင်းခြင်း',
  road_unconscious: 'spinal injury ဖြစ်နိုင်ပြီး မတုံ့ပြန်သောသူ',
  road_fire_trapped: 'မီးလောင်နေသော ယာဉ်အတွင်း ခရီးသည်ပိတ်မိနေခြင်း',
  road_traffic_hazard: 'အမြန်လမ်းတွင် မြန်နှုန်းမြင့် ယာဉ်တိုက်မှုအန္တရာယ်',
  road_mci: 'START triage လိုအပ်သော ဒဏ်ရာရသူများစွာ',
};

const factLabels: Record<string, string> = {
  'Unconscious / Unresponsive': 'သတိမရှိ / မတုံ့ပြန်',
  'Breathing Status': 'အသက်ရှူအခြေအနေ',
  'Bleeding Severity': 'သွေးယိုမှု ပြင်းထန်မှု',
  'Primary Symptom': 'အဓိက လက္ခဏာ',
  'Airway Passage': 'အသက်ရှူလမ်းကြောင်း',
  'Face Drooping (F.A.S.T.)': 'မျက်နှာတစ်ဖက်ရွဲ့ခြင်း (F.A.S.T.)',
  'Arm Weakness (F.A.S.T.)': 'လက်အားနည်းခြင်း (F.A.S.T.)',
  'Speech Slurred (F.A.S.T.)': 'စကားမရှင်းခြင်း (F.A.S.T.)',
  'Burn Type': 'မီးလောင်ဒဏ်အမျိုးအစား',
  'Burn Area': 'မီးလောင်ဒဏ်ဧရိယာ',
  'Hazard Type': 'အန္တရာယ်အမျိုးအစား',
  'Ignition Source': 'မီးစတင်ရာအကြောင်းရင်း',
  Location: 'တည်နေရာ',
  'Exits Blocked': 'ထွက်ပေါက်များ ပိတ်နေသည်',
  'Smoke Condition': 'မီးခိုးအခြေအနေ',
  'Disaster Type': 'ဘေးအန္တရာယ်အမျိုးအစား',
  'Water Level Rising': 'ရေတက်နေသည်',
  'Building Structure': 'အဆောက်အအုံပုံစံ',
  'Seismic Shaking': 'ငလျင်လှုပ်ခြင်း',
  'Gas Smell Detected': 'ဓာတ်ငွေ့နံ့ တွေ့ရှိ',
  'Coastal Proximity': 'ကမ်းရိုးတန်းအနီး',
  'Victim Unconscious': 'လူနာ သတိမရှိ',
  'Victim Breathing': 'လူနာ အသက်ရှူခြင်း',
  'Vehicle on Fire': 'ယာဉ်မီးလောင်နေသည်',
  'Victim Trapped in Wreck': 'ယာဉ်ပျက်ထဲတွင် ပိတ်မိ',
  'Active Highway Traffic': 'အမြန်လမ်းယာဉ်သွားလာမှု ရှိသည်',
  'Casualty Count': 'ဒဏ်ရာရသူ အရေအတွက်',
};

const actionLabels: Record<string, string> = {
  BEGIN_CPR_AND_CALL_EMERGENCY: 'CPR စတင်ပြီး အရေးပေါ်အကူအညီခေါ်ပါ',
  PERFORM_HEIMLICH_MANEUVER_AND_BACK_BLOWS: 'Heimlich maneuver နှင့် back blows ပြုလုပ်ပါ',
  APPLY_DIRECT_PRESSURE_AND_TOURNIQUET: 'တိုက်ရိုက်ဖိပြီး tourniquet သုံးပါ',
  ACTIVATE_STROKE_EMERGENCY_DISPATCH_FAST: 'Stroke အရေးပေါ် dispatch ကို F.A.S.T. ဖြင့် ချက်ချင်းခေါ်ပါ',
  COOL_WATER_RINSE_AND_STERILE_COVER: 'အေးသောရေဖြင့် ဆေးပြီး သန့်ရှင်းစွာ ဖုံးပါ',
  CONTACT_POISON_CONTROL_AND_STABILIZE: 'Poison Control ကိုဆက်သွယ်ပြီး လူနာကို တည်ငြိမ်အောင်ထားပါ',
  ISOLATE_POWER_AND_USE_CLASS_C_EXTINGUISHER: 'လျှပ်စစ်ဖြတ်ပြီး Class C မီးသတ်ဆေးဘူး သုံးပါ',
  SMOTHER_WITH_METAL_LID_AND_SHUT_BURNER: 'သတ္တုအဖုံးဖြင့် ပိတ်ပြီး မီးဖိုပိတ်ပါ',
  EVACUATE_IMMEDIATELY_DO_NOT_TOUCH_SWITCHES: 'ချက်ချင်းထွက်ခွာပါ၊ switch များ မကိုင်ပါနှင့်',
  SEAL_DOOR_AND_SIGNAL_FROM_WINDOW: 'တံခါးကိုပိတ်ဆို့ပြီး ပြတင်းပေါက်မှ အချက်ပြပါ',
  EVACUATE_TO_HIGHER_GROUND_NOW: 'မြင့်သောနေရာသို့ ချက်ချင်းပြောင်းရွှေ့ပါ',
  VERTICAL_EVACUATION_TO_UPPER_FLOORS: 'အပေါ်ထပ်များသို့ တက်၍ ဘေးကင်းရာယူပါ',
  DROP_COVER_AND_HOLD_ON: 'ငုံ့ပါ၊ ကာကွယ်ပါ၊ ခိုင်မြဲစွာကိုင်ထားပါ',
  EVACUATE_AND_SHUT_MAIN_GAS_VALVE: 'ထွက်ခွာပြီး main gas valve ကို ပိတ်ပါ',
  EVACUATE_INLAND_AND_UPHILL_IMMEDIATELY: 'ကုန်းတွင်းနှင့် မြင့်ရာသို့ ချက်ချင်းရွှေ့ပါ',
  BEGIN_CPR_PROTECT_CERVICAL_SPINE: 'CPR စတင်ပြီး လည်ပင်း/ကျောရိုးကို ကာကွယ်ပါ',
  EMERGENCY_EXTRICATION_OR_SAFE_PERIMETER_DEFENSE: 'အရေးပေါ်ထုတ်ယူရန် သို့မဟုတ် ဘေးကင်းပတ်လည်ကာကွယ်ရန်',
  ESTABLISH_HIGHWAY_SAFETY_PERIMETER_FIRST: 'အမြန်လမ်းဘေးကင်းရေးပတ်လည်ကို ပထမဆုံး သတ်မှတ်ပါ',
  EXECUTE_MASS_CASUALTY_START_TRIAGE: 'လူနာအများအပြား START triage လုပ်ဆောင်ပါ',
  CALL_EMERGENCY_SERVICES_AND_MONITOR_VITALS: 'အရေးပေါ်ဝန်ဆောင်မှုကိုခေါ်ပြီး vital signs စောင့်ကြည့်ပါ',
};

type ResultField = 'steps' | 'reasons' | 'prohibitions';

type ResultTranslationSet = Partial<Record<ResultField, string[]>>;

const missingMyanmarWarnings = new Set<string>();

function isDevMode(): boolean {
  return Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);
}

function warnMissingMyanmar(key: string, fallback?: string): void {
  if (!isDevMode() || missingMyanmarWarnings.has(key)) return;
  missingMyanmarWarnings.add(key);
  console.warn(`[i18n] Missing Myanmar translation: ${key}`, fallback);
}

const resultTranslations: Record<string, ResultTranslationSet> = {
  BEGIN_CPR_AND_CALL_EMERGENCY: {
    steps: [
      '199 / 191 / 192 ကို ချက်ချင်းခေါ်ပြီး ဖုန်းကို speaker mode ထားပါ။',
      'အနီးရှိတစ်ဦးကို Automated External Defibrillator (AED) ယူလာရန် စေလွှတ်ပါ။',
      'လူနာကို မာကျောပြီး ညီညာသောမျက်နှာပြင်ပေါ်တွင် ပက်လက်အနေအထားထားပါ။',
      'လက်ချောင်းများကို ယှက်ထားပြီး လက်ဖဝါးအောက်ခြေကို ရင်ဘတ်အလယ်ဗဟိုတွင် ထားပါ။',
      'ရင်ဘတ်ကို အနည်းဆုံး ၂ လက်မ (၅ စင်တီမီတာ) အနက်အထိ တစ်မိနစ်လျှင် ၁၀၀–၁၂၀ ကြိမ်နှုန်းဖြင့် ပြင်းပြင်းနှင့် မြန်မြန် ဖိနှိပ်ပါ။',
      'တစ်ကြိမ်နှင့်တစ်ကြိမ် ဖိနှိပ်မှုကြားတွင် လက်ကို လုံးဝမလွှတ်ဘဲ ရင်ဘတ်ကို မူလအနေအထားသို့ အပြည့်အဝ ပြန်တက်ခွင့်ပြုပါ။',
    ],
    reasons: [
      'လူနာသည် သတိမရှိ၊ တုံ့ပြန်မှုမရှိပြီး အသက်ရှူမရှိခြင်း သို့မဟုတ် agonal breathing ဖြစ်နေခြင်းကို တွေ့ရှိထားသည်။',
      'ဦးနှောက်နှင့် နှလုံးသွေးလည်ပတ်မှုကို ထိန်းထားရန် 100–120 BPM နှုန်းဖြင့် ရင်ဘတ်ဖိနှိပ်မှုကို မရပ်မနား ချက်ချင်းလုပ်ဆောင်ရန် လိုအပ်သည်။',
      'CPR နှင့် defibrillation နှောင့်နှေးသည့် မိနစ်တိုင်းတွင် အသက်ရှင်နိုင်ခြေ 7–10% ခန့် လျော့ကျနိုင်သည်။',
    ],
    prohibitions: [
      'ပါးစပ်မှ ရေ၊ အရည် သို့မဟုတ် ဆေး မပေးပါနှင့်။',
      'မလေ့ကျင့်ထားပါက သွေးခုန်နှုန်းရှာရန် CPR ဖိနှိပ်မှုကို မနှောင့်နှေးပါနှင့်။',
      'လူနာကို မည်သည့်အချိန်တွင်မဆို တစ်ယောက်တည်း မထားပါနှင့်။',
      'Paramedics သို့မဟုတ် AED ရောက်သည်အထိ ဖိနှိပ်မှုကို 10 စက္ကန့်ထက်ပို၍ မရပ်ပါနှင့်။',
    ],
  },
  PERFORM_HEIMLICH_MANEUVER_AND_BACK_BLOWS: {
    steps: [
      'လူနာသည် စကားမပြောနိုင်၊ ပြင်းပြင်းချောင်းမဆိုးနိုင်၊ အသက်မရှူနိုင်ကြောင်း စစ်ဆေးပါ။',
      'လူနာ၏နောက်တွင် ရပ်ပြီး ခန္ဓာကိုယ်ကို အနည်းငယ်ရှေ့သို့ ညွတ်စေပါ။',
      'လက်ဖဝါးအောက်ခြေဖြင့် ပခုံးရိုးနှစ်ခုကြားကို 5 ကြိမ် ပြင်းပြင်းရိုက်ပါ။',
      'အရာဝတ္ထု မထွက်သေးပါက ချက်အပေါ်နည်းနည်းတွင် လက်သီးကိုထားပြီး အခြားလက်ဖြင့်ကိုင်ကာ အတွင်းဘက်နှင့် အပေါ်ဘက်သို့ 5 ကြိမ် မြန်မြန်ဖိတင်ပါ။',
      'အရာဝတ္ထုထွက်လာသည်အထိ သို့မဟုတ် လူနာသတိလစ်သွားသည်အထိ back blows 5 ကြိမ်နှင့် abdominal thrusts 5 ကြိမ်ကို ဆက်လုပ်ပါ။ သတိလစ်လျှင် CPR စတင်ပါ။',
    ],
    reasons: [
      'အသက်ရှူလမ်းကြောင်း အပြည့်အဝပိတ်ဆို့ပါက 3–4 မိနစ်အတွင်း အောက်ဆီဂျင်လျော့နည်းခြင်း၊ ဦးနှောက်ထိခိုက်ခြင်းနှင့် အသက်အန္တရာယ် ဖြစ်နိုင်သည်။',
      'အစာအိမ်အထက်မှ ဖိတင်ခြင်းနှင့် ပခုံးရိုးကြားရိုက်ခြင်းတို့က ချောင်းဆိုးအားကဲ့သို့ ဖိအားဖန်တီးပြီး ပိတ်ဆို့နေသောအရာကို ထုတ်ရန်ကူညီသည်။',
    ],
    prohibitions: [
      'ပါးစပ်အတွင်းကို မမြင်ရဘဲ လက်ချောင်းဖြင့် မရှာပါနှင့်။ အရာဝတ္ထုကို အသက်ရှူလမ်းကြောင်းအတွင်း ပိုနက်စေနိုင်သည်။',
      'ရေ သို့မဟုတ် အရည် မတိုက်ပါနှင့်။',
      'လူနာကို ရပ်တည့်နေသောအနေအထားတွင် နောက်ကျောမရိုက်ပါနှင့်။ ပထမဦးစွာ ရှေ့သို့ ညွတ်စေပါ။',
    ],
  },
  APPLY_DIRECT_PRESSURE_AND_TOURNIQUET: {
    steps: [
      'သန့်ရှင်းသော gauze သို့မဟုတ် အဝတ်ဖြင့် ဒဏ်ရာပေါ်သို့ တိုက်ရိုက်၊ တည်ငြိမ်ပြီး ပြင်းသောဖိအားကို ဆက်တိုက်ပေးပါ။',
      'ခြေလက်မှ သွေးသည် ခုန်ထွက်နေခြင်း သို့မဟုတ် အသက်အန္တရာယ်ရှိပါက ဒဏ်ရာအထက် 2–3 လက်မတွင် commercial tourniquet တပ်ပါ။ အဆစ်ပေါ်တွင် မတပ်ပါနှင့်။',
      'အနီတောက်သွေးယိုမှု ရပ်ပြီး distal pulse မရှိတော့သည်အထိ windlass rod ကို တင်းကျပ်စွာလှည့်ကာ lock လုပ်ပါ။',
      'Tourniquet တပ်သည့် အချိန်အတိအကျကို tourniquet ပေါ် သို့မဟုတ် လူနာနဖူးပေါ်တွင် ရေးပါ။ ဥပမာ "TK 14:30"။',
      'Trauma-induced hypothermia မဖြစ်စေရန် လူနာကို စောင်ဖြင့် နွေးထွေးအောင်ထားပါ။',
    ],
    reasons: [
      'Arterial laceration သည် 3 မိနစ်အောက်အတွင်း အသက်အန္တရာယ်ဖြစ်စေသော သွေးဆုံးရှုံးမှု ဖြစ်နိုင်သည်။',
      'ဒဏ်ရာပေါ်တိုက်ရိုက်ဖိနှိပ်ခြင်းနှင့် tourniquet ဖြင့် အနီးပိုင်းသွေးကြောပိတ်ခြင်းသည် သွေးဆုံးရှုံးမှုကို ရပ်တန့်စေသည်။',
    ],
    prohibitions: [
      'သွေးစိုနေသော dressing များကို မဖြုတ်ပါနှင့်။ သွေးခဲမှုကိုထိန်းရန် အပေါ်မှ အလွှာအသစ် ထပ်တင်ပါ။',
      'Tourniquet ကို အဆစ်ပေါ်တွင် တိုက်ရိုက် မတပ်ပါနှင့်။',
      'တပ်ပြီးသား tourniquet ကို မဖြေလျော့၊ မဖြုတ်ပါနှင့်။ ထိုလုပ်ဆောင်ချက်ကို trauma surgeon များသာ ကိုင်တွယ်ရမည်။',
    ],
  },
  ACTIVATE_STROKE_EMERGENCY_DISPATCH_FAST: {
    steps: [
      '199 ကို ချက်ချင်းခေါ်ပြီး "acute stroke patient ဟု သံသယရှိသည်၊ stroke center သို့ အမြန်ပို့ဆောင်ရန် လိုအပ်သည်" ဟု ပြောပါ။',
      'လူနာကို နောက်ဆုံးအကြိမ် ပုံမှန်တွေ့ရှိခဲ့သော အချိန်အတိအကျကို မှတ်သားပါ။ Time is Brain ဖြစ်သည်။',
      'Aspiration အန္တရာယ်လျှော့ရန် လူနာကို ဘေးစောင်းအနေအထားထားပြီး ဦးခေါင်းကို 15–30 degrees မြှင့်ထားပါ။',
      'လည်ပင်းပတ်ဝန်းကျင်ရှိ တင်းကျပ်သောအဝတ်အစားများကို ဖြေလျော့ပြီး အသက်ရှူလမ်းကြောင်း ရှင်းလင်းအောင်ထားပါ။',
      'အသက်ရှူခြင်းနှင့် သတိအခြေအနေကို မရပ်မနား စောင့်ကြည့်ပါ။',
    ],
    reasons: [
      'F.A.S.T. လက္ခဏာများ အပြုသဘောဖြစ်ပါက acute cerebral ischemia သို့မဟုတ် hemorrhage ဖြစ်နိုင်ကြောင်း ညွှန်ပြသည်။',
      'Intravenous thrombolysis (tPA/TNK) နှင့် endovascular thrombectomy တို့သည် အချိန်အပေါ် အလွန်မူတည်သည်။ စတင်ပြီး 3–4.5 နာရီအတွင်း အကောင်းဆုံးဖြစ်သည်။',
    ],
    prohibitions: [
      'CT scan ဖြင့် hemorrhagic stroke ကို မပယ်ချနိုင်သေးမီ aspirin, ibuprofen သို့မဟုတ် blood thinners မပေးပါနှင့်။',
      'Aspiration နှင့် dysphagia အန္တရာယ်မြင့်သောကြောင့် လူနာကို အစားအစာ သို့မဟုတ် အရည် မပေးပါနှင့်။',
      'လူနာကို ကားမောင်းရန် သို့မဟုတ် ဆေးရုံသို့ လမ်းလျှောက်သွားရန် မခွင့်ပြုပါနှင့်။ ကြိုတင်အသိပေးထားသော emergency ambulance လိုအပ်သည်။',
    ],
  },
  COOL_WATER_RINSE_AND_STERILE_COVER: {
    steps: [
      'အပူဒဏ် ဆက်မပျက်စေရန် မီးလောင်ဒဏ်ရာကို သန့်ရှင်းပြီး အေးသောရေစီးဖြင့် 10–20 မိနစ် ချက်ချင်းအေးစေပါ။',
      'ရောင်ရမ်းမှု မစတင်မီ လက်ဝတ်ရတနာ၊ လက်စွပ်နှင့် မကပ်နေသော တင်းကျပ်သည့်အဝတ်များကို ဖယ်ရှားပါ။',
      'မီးလောင်ဒဏ်ရာကို သန့်ရှင်းခြောက်သွေ့သော sterile non-adherent dressing သို့မဟုတ် သန့်ရှင်းသော plastic wrap ဖြင့် လျော့ရဲစွာ ဖုံးပါ။',
      'Hypothermia မဖြစ်စေရန် မထိခိုက်သောနေရာများပေါ်တွင် စောင်အုပ်ပြီး လူနာကို နွေးထွေးအောင်ထားပါ။',
      'အသိအမှတ်ပြု burn center တွင် ချက်ချင်း ဆေးစစ်ကုသမှု ခံယူပါ။',
    ],
    reasons: [
      'အချိန်လုံလောက်စွာ အေးစေခြင်းသည် အရေပြားအတွင်း ကျန်ရှိနေသောအပူကို လျော့စေပြီး ဆဲလ်များ ဆက်လက်သေဆုံးခြင်းကို ရပ်တန့်စေသည်။',
      'လျော့ရဲသော sterile cover သည် ထိခိုက်လွယ်သော tissue ကို ဘက်တီးရီးယားညစ်ညမ်းမှုမှ ကာကွယ်သည်။',
    ],
    prohibitions: [
      'ရေခဲ သို့မဟုတ် အလွန်အေးသောရေ မသုံးပါနှင့်။ သွေးကြောကျဉ်းခြင်းနှင့် ဒုတိယတစ်ဆင့် frostbite necrosis ဖြစ်နိုင်သည်။',
      'Butter, toothpaste, grease သို့မဟုတ် အိမ်လုပ်ဆီ/ဆေး မလိမ်းပါနှင့်။',
      'ဖုများကို မဖောက်၊ မခွာပါနှင့်။',
      'မီးလောင်ဒဏ်ရာတွင် ကပ်နေသော သို့မဟုတ် အရည်ပျော်ကပ်နေသောအဝတ်ကို ဆွဲမဖြုတ်ပါနှင့်။',
    ],
  },
  CONTACT_POISON_CONTROL_AND_STABILIZE: {
    steps: [
      'Poison Help (US 1-800-222-1222 / ဒေသဆိုင်ရာ Poison Center) ကို ချက်ချင်းခေါ်ပါ။',
      'ပစ္စည်းအမည်၊ ဘူး/တံဆိပ်၊ ခန့်မှန်းပမာဏနှင့် ထိတွေ့ခဲ့သောအချိန်ကို ဖော်ထုတ်ပါ။',
      'ရှူရှိုက်မိပါက လူနာကို လေကောင်းလေသန့်ရှိရာသို့ ချက်ချင်းရွှေ့ပါ။',
      'အရေပြား သို့မဟုတ် မျက်လုံးထိပါက ရေများများဖြင့် 15–20 မိနစ် ဆေးကြောပါ။',
      'လူနာကို သက်သာစွာ အနားယူစေပြီး အသက်ရှူလမ်းကြောင်းကို စောင့်ကြည့်ပါ။',
    ],
    reasons: [
      'အဆိပ်၏ toxicokinetics သည် အမျိုးအစားပေါ်မူတည်၍ များစွာကွဲပြားသောကြောင့် သီးခြား antidote နှင့် decontamination protocol လိုအပ်သည်။',
      'Chemical နှင့် caustic ingestion များတွင် အသက်ဆုံးရှုံးမှု၏ အဓိကအကြောင်းရင်းမှာ airway compromise ဖြစ်သည်။',
    ],
    prohibitions: [
      'Poison Control မှ တိတိကျကျ ညွှန်ကြားမှသာ အန်စေပါ။ caustic acids/bases များသည် အစာရေမြောင်းကို ထပ်မံလောင်စေနိုင်သည်။',
      'ကျွမ်းကျင်သူညွှန်ကြားချက်မရှိဘဲ activated charcoal, milk သို့မဟုတ် အိမ်သုံးကုထုံး မပေးပါနှင့်။',
    ],
  },
  ISOLATE_POWER_AND_USE_CLASS_C_EXTINGUISHER: {
    steps: [
      'မီးကို မထိဘဲ လုံခြုံစွာ ရောက်နိုင်ပါက main electrical breaker panel ကို ချက်ချင်းပိတ်ပါ။',
      'လူအားလုံးကို ထွက်ခွာစေပြီး Fire Department (199 / 191 / 192) ကို ခေါ်ပါ။',
      'မီးသေးပြီး သင်လေ့ကျင့်ထားပါက Class C (CO2 သို့မဟုတ် Dry Chemical) fire extinguisher တစ်မျိုးတည်းကိုသာ သုံးပါ။',
      'PASS method (Pull, Aim, Squeeze, Sweep) ဖြင့် 6–8 feet အကွာမှ မီးအောက်ခြေကို ဦးတည်ဖြန်းပါ။',
      'မီးပြန့်လာပါက သို့မဟုတ် မီးခိုးမည်းလာပါက ချက်ချင်းထွက်ခွာပြီး တံခါးများကို ပိတ်ထားခဲ့ပါ။',
    ],
    reasons: [
      'လျှပ်စစ်စီးနေသော circuit များတွင် conductive agent သုံးသူတိုင်းအတွက် အသက်အန္တရာယ်ရှိသော electrocution risk ရှိသည်။',
      'Circuit ကို de-energize လုပ်ခြင်းသည် ignition source ကို ဖြတ်တောက်ပြီး ကျန်မီးလျှံများကို မီးသတ်ပစ္စည်းဖြင့် ဖိနှိပ်နိုင်စေသည်။',
    ],
    prohibitions: [
      'တင်းကျပ်သော အသက်ဘေးကင်းရေးစည်းမျဉ်း: လျှပ်စစ်မီးလောင်မှုတွင် ရေ သို့မဟုတ် ရေပါသော fire extinguisher ကို ဘယ်တော့မှ မသုံးပါနှင့်။ ပြင်းထန်သော electrocution အန္တရာယ်ရှိသည်။',
      'မီးလောင်နေသော wire, appliance သို့မဟုတ် လျှပ်ကူးသတ္တုမျက်နှာပြင်များကို မထိပါနှင့်။',
      'ထွက်ခွာပြီးနောက် အဆောက်အအုံအတွင်းသို့ ပြန်မဝင်ပါနှင့်။',
    ],
  },
  SMOTHER_WITH_METAL_LID_AND_SHUT_BURNER: {
    steps: [
      'Stove burner သို့မဟုတ် အပူရင်းမြစ်ကို ချက်ချင်းပိတ်ပါ။',
      'မီးလျှံကို အောက်ဆီဂျင်မရအောင် pan ကို ဘေးဘက်မှ tight-fitting metal lid, baking sheet သို့မဟုတ် fire blanket ဖြင့် ဖုံးပါ။',
      'Pan လုံးဝအေးသွားသည်အထိ အနည်းဆုံး 30 မိနစ် lid ကို မဖယ်ပါနှင့်။',
      'အခြားနည်းလမ်းအဖြစ် baking soda များများဖြန်းခြင်း သို့မဟုတ် Class K / Class B extinguisher သုံးနိုင်သည်။',
      'မီးသည် cooktop မှ လွတ်ထွက်လာပါက ချက်ချင်းထွက်ခွာပြီး 199 ကို ခေါ်ပါ။',
    ],
    reasons: [
      'Cooking oil သည် > 300°C အပူချိန်တွင် လောင်ကျွမ်းနိုင်ပြီး metal lid ဖြင့် oxygen ဖြတ်တောက်ခြင်းက combustion ကို ချက်ချင်းငြိမ်းစေသည်။',
      'ရေသည် အလွန်ပူနေသော ဆီအောက်သို့ ကျပြီး ရုတ်တရက် steam ဖြစ်ကာ မီးလောင်နေသောဆီအစက်များကို အခန်းအနှံ့ ပက်စေနိုင်သည်။',
    ],
    prohibitions: [
      'တင်းကျပ်သော အသက်ဘေးကင်းရေးစည်းမျဉ်း: ဆီမီး သို့မဟုတ် cooking oil မီးပေါ်သို့ ရေ ဘယ်တော့မှ မလောင်းပါနှင့်။ ပေါက်ကွဲသကဲ့သို့ steam fireball ဖြစ်နိုင်သည်။',
      'မီးလောင်နေသော pan ကို မရွှေ့၊ မသယ်ပါနှင့်။ မီးလောင်နေသောဆီ သင့်ကိုယ်နှင့် ပတ်ဝန်းကျင်သို့ ပက်နိုင်သည်။',
      'Flour, baking powder သို့မဟုတ် sugar မသုံးပါနှင့်။ Flour dust သည် မီးစွဲနိုင်သည်။',
    ],
  },
  EVACUATE_IMMEDIATELY_DO_NOT_TOUCH_SWITCHES: {
    steps: [
      'အဆောက်အအုံထဲမှ လူများနှင့် အိမ်မွေးတိရစ္ဆာန်များအားလုံးကို ချက်ချင်းထွက်ခွာစေပါ။',
      'ထွက်ခွာစဉ် သဘာဝလေဝင်လေထွက်ရရန် တံခါးနှင့် ပြတင်းပေါက်များကို ဖွင့်ထားခဲ့ပါ။',
      'အဆောက်အအုံမှ အနည်းဆုံး 300 feet အကွာ လေထန်ရာဘက်သို့ ရွှေ့ပါ။',
      'လုံခြုံစွာ အပြင်ရောက်ပြီးမှသာ 199 နှင့် emergency gas utility hotline ကို ခေါ်ပါ။',
      'Doorbell မနှိပ်ဘဲ အိမ်နီးချင်းများကို သတိပေးပါ။',
    ],
    reasons: [
      'စုနေသော natural gas သို့မဟုတ် propane သည် ပေါက်ကွဲနိုင်သော fuel-air mixture ဖြစ်စေသည်။',
      'Static electricity, light switch သို့မဟုတ် mobile phone circuitry မှ micro-arc လေးများသည် အခန်းတစ်ခုလုံးကို မီးလောင်ပေါက်ကွဲစေနိုင်သည်။',
    ],
    prohibitions: [
      'Electrical light switch, breaker သို့မဟုတ် appliance များကို ON သို့မဟုတ် OFF မလုပ်ပါနှင့်။',
      'အဆောက်အအုံအတွင်းတွင် telephone, cellphone သို့မဟုတ် doorbell မသုံးပါနှင့်။',
      'မီးခြစ်မခြစ်၊ ဖယောင်းတိုင်မထွန်း၊ ဆေးလိပ်မသောက်ပါနှင့်။',
      'အဆောက်အအုံအနီး ရပ်ထားသော motor vehicle များကို မစတင်ပါနှင့်။',
    ],
  },
  SEAL_DOOR_AND_SIGNAL_FROM_WINDOW: {
    steps: [
      'မီးနှင့် မီးခိုးဝင်ရောက်မှု နှောင့်နှေးစေရန် အခန်းတံခါးကို ချက်ချင်းပိတ်ပါ။',
      'တံခါးကြားများနှင့် air vent များကို စိုသောတော်ဝါ၊ စောင် သို့မဟုတ် duct tape ဖြင့် ပိတ်ဆို့ပါ။',
      'လုံခြုံပါက လေကောင်းရရန် ပြတင်းပေါက်ကို အနည်းငယ်ဖွင့်ပြီး မီးသတ်သမားများ မြင်နိုင်ရန် အရောင်တောက်သော sheet သို့မဟုတ် towel ကို ပြတင်းပေါက်မှ ချထားပါ။',
      'လေသည် ပိုအေးပြီး သန့်ရှင်းသောကြောင့် ကြမ်းပြင်နီးနီးတွင် နိမ့်နိမ့်နေပြီး လက်နှင့် ဒူးဖြင့် တွားပါ။',
      '199 ကို ခေါ်ပြီး အဆောက်အအုံအတွင်း သင့်အခန်းတည်နေရာအတိအကျကို ပြောပါ။',
    ],
    reasons: [
      'Toxic smoke inhalation (CO, HCN) သည် 2 မိနစ်အောက်အတွင်း သတိလစ်စေနိုင်သည်။',
      'တံခါးများကို ပိတ်ဆို့ခြင်းသည် pressurized compartment တစ်ခုဖန်တီးပြီး fire rescue အတွက် အရေးကြီးသော မိနစ်များကို ပေးနိုင်သည်။',
    ],
    prohibitions: [
      'မလိုအပ်လျှင် ပြတင်းပေါက်များ မခွဲပါနှင့်။ ပြတင်းပေါက်ခွဲခြင်းသည် မီးကို oxygen ပိုပေးပြီး မီးခိုးကို အတွင်းသို့ ဆွဲဝင်စေသည်။',
      'Rescue team များ အမြန်ရှာမတွေ့နိုင်သော closet သို့မဟုတ် bed အောက်တွင် မပုန်းပါနှင့်။',
      'မည်သည့်အခြေအနေတွင်မဆို elevator မသုံးပါနှင့်။',
    ],
  },
  EVACUATE_TO_HIGHER_GROUND_NOW: {
    steps: [
      'Escape route များ ရေအောက်မကျမီ သတ်မှတ်ထားသော မြင့်ရာ shelter သို့ ချက်ချင်းထွက်ခွာပါ။',
      'လုံခြုံစွာ ရောက်နိုင်ပါက မထွက်ခွာမီ main electricity နှင့် gas ကို ပိတ်ပါ။',
      'ဆေးဝါး၊ စာရွက်စာတမ်းများနှင့် waterproof torch ပါသော emergency go-bag ယူပါ။',
      'မြင့်သောလမ်းများကိုသာ လိုက်ပါ။ ရေစီးနေသောနေရာကို ခြေလျင် သို့မဟုတ် ယာဉ်ဖြင့် ဘယ်တော့မှ မဖြတ်ပါနှင့်။',
      'ရေသည် အဆောက်အအုံကို လျင်မြန်စွာ ဝိုင်းလာပါက ခေါင်မိုးပေါ်တက်ပြီး rescue အတွက် အချက်ပြပါ။ Roof access tool ယူပါ။',
    ],
    reasons: [
      'ရေလျင်မြန်စွာ တက်လာပါက single-story အဆောက်အအုံများတွင် vertical buffer မရှိသောကြောင့် လူများ ပိတ်မိနိုင်သည်။',
      '6 inches ပမာဏသာရှိသော မြန်သောရေစီးသည် လူကြီးတစ်ဦးကို လဲကျစေနိုင်ပြီး 12 inches သည် ကားများကို ဆွဲသွားနိုင်သည်။',
    ],
    prohibitions: [
      'တင်းကျပ်သော အသက်ဘေးကင်းရေးစည်းမျဉ်း: ရေကြီးရေစီးနေသောနေရာကို ကားမောင်း၍ သို့မဟုတ် လမ်းလျှောက်၍ ဘယ်တော့မှ မဖြတ်ပါနှင့်။ "Turn Around, Don’t Drown"။',
      'Roof-exit tools မရှိဘဲ ပိတ်လှောင်နေသော attic တွင် ခိုလှုံခြင်း မလုပ်ပါနှင့်။ ရေ rafters ထိတက်လာပါက ရေနစ်နိုင်သည်။',
      'ရေအောက်ကျနေသော electrical outlet, panel သို့မဟုတ် downed power line များကို မထိပါနှင့်။',
    ],
  },
  VERTICAL_EVACUATION_TO_UPPER_FLOORS: {
    steps: [
      'လူအားလုံး၊ အရေးကြီးပစ္စည်းများနှင့် emergency radio များကို အပေါ်ထပ်များသို့ ရွှေ့ပါ။ အနည်းဆုံး 2nd floor သို့မဟုတ် အထက်ဖြစ်ရမည်။',
      'ရေသည် outlet များထိ မတက်မီ ground floor main electrical circuit breaker ကို ပိတ်ပါ။',
      'ရေသည် ဆက်လက်မြန်မြန်တက်လာပါက roof access point ကို ပြင်ဆင်ပါ။',
      'Emergency NOAA weather radio သို့မဟုတ် civil defense broadcasts များကို စောင့်ကြည့်နားထောင်ပါ။',
    ],
    reasons: [
      'Vertical evacuation သည် ground-level hydrodynamic surge အထက်သို့ ချက်ချင်းမြင့်တက်ခိုလှုံနိုင်စေသည်။',
      'အန္တရာယ်ရှိသော လမ်းရေစီးထဲသို့ ပြင်ပထွက်ခွာရသော risk ကို လျှော့ချပေးသည်။',
    ],
    prohibitions: [
      'ရေဝင်လာပြီးနောက် ပစ္စည်းပြန်ယူရန် ground floor သို့မဟုတ် basement သို့ မပြန်ပါနှင့်။',
      'Tap water မသောက်ပါနှင့်။ Municipal water supply သည် flood runoff ကြောင့် ညစ်ညမ်းနိုင်သည်။',
    ],
  },
  DROP_COVER_AND_HOLD_ON: {
    steps: [
      'လဲကျခြင်းမှ ကာကွယ်ရန် လက်နှင့် ဒူးပေါ်သို့ ချက်ချင်း ငုံ့ချပါ။',
      'ခိုင်ခံ့သော စားပွဲ သို့မဟုတ် desk အောက်တွင် ဦးခေါင်းနှင့် လည်ပင်းကို ကာကွယ်ပါ။ စားပွဲမရှိပါက အတွင်းနံရံဘေးသို့ တွားသွားပါ။',
      'Shelter ကို လက်တစ်ဖက်ဖြင့် ခိုင်မြဲစွာကိုင်ထားပြီး လှုပ်ခါမှုရပ်သည်အထိ ၎င်းနှင့်အတူ ရွှေ့နိုင်ရန် ပြင်ဆင်ထားပါ။',
      'မှန်ပြတင်းပေါက်၊ အပြင်နံရံနှင့် အပေါ်မှကျနိုင်သော မီးအိမ်ကြီးများမှ ဝေးဝေးနေပါ။',
      'လှုပ်ခါမှုအားလုံး လုံးဝရပ်သွားသည်အထိ နေရာတွင် ဆက်နေပါ။',
    ],
    reasons: [
      'Earthquake casualty များ၏ 85% ကျော်သည် ပြိုကျသော non-structural debris နှင့် ကွဲသောမှန်များကြောင့် ဖြစ်သည်။',
      'ခိုင်ခံ့သော furniture သည် ပြိုကျလာသော masonry နှင့် ceiling elements များကို ကာကွယ်ပေးနိုင်သည်။',
    ],
    prohibitions: [
      'လှုပ်ခါနေစဉ် အပြင်သို့ မပြေးပါနှင့်။ အပြင် facade masonry ကျခြင်းသည် အသက်အန္တရာယ်ရှိသည်။',
      'Doorway တွင် မရပ်ပါနှင့်။ ခေတ်မီ doorway များသည် structural မဟုတ်ဘဲ တံခါးလှုပ်ရှားမှုက အန္တရာယ်ရှိနိုင်သည်။',
      'Elevator မသုံးပါနှင့်။',
    ],
  },
  EVACUATE_AND_SHUT_MAIN_GAS_VALVE: {
    steps: [
      'အဆောက်အအုံထဲမှ လူအားလုံးကို ချက်ချင်းထွက်ခွာစေပါ။',
      'အပြင်ဘက်ရှိ main gas meter valve ကို လုံခြုံစွာ ရောက်နိုင်ပါက wrench ဖြင့် ပိတ်ပါ။ Pipe နှင့် ထောင့်မှန်အနေအထားသို့ လှည့်ပါ။',
      'ပျက်စီးနေသော အဆောက်အအုံများ၊ သစ်ပင်များနှင့် power line များမှ ဝေးသော လွင်ပြင်သို့ ရွှေ့ပါ။',
      'ပြတ်တောက်နေသော gas line ကို အပြင်မှ emergency services သို့ သတင်းပို့ပါ။',
    ],
    reasons: [
      'ငလျင်နောက်ပိုင်း gas line ပြတ်တောက်ခြင်းသည် မြို့ပြမီးလောင်ပေါက်ကွဲမှုကြီးများကို မကြာခဏ ဖြစ်စေသည်။',
      'ချက်ချင်း shutoff လုပ်ခြင်းသည် ပိတ်လှောင်ပြိုကျနေသောနေရာများထဲသို့ fuel leak ဝင်ခြင်းကို ရပ်တန့်စေသည်။',
    ],
    prohibitions: [
      'အလင်းရရန် မီးခြစ် သို့မဟုတ် lighter မသုံးပါနှင့်။ Battery torch သာ သုံးပါ။',
      'Gas ကို ပိတ်ပြီးနောက် သင်ကိုယ်တိုင် ပြန်မဖွင့်ပါနှင့်။ Certified utility technician ကသာ ပြန်ဖွင့်ရမည်။',
    ],
  },
  EVACUATE_INLAND_AND_UPHILL_IMMEDIATELY: {
    steps: [
      'ချက်ချင်း ကမ်းရိုးတန်းမှ အနည်းဆုံး 2 miles (3 km) ကုန်းတွင်းသို့ နှင့် ပင်လယ်ရေမျက်နှာပြင်အထက် အနည်းဆုံး 100 feet (30 m) မြင့်သောနေရာသို့ ရွှေ့ပါ။',
      'ကမ်းရိုးတန်းငလျင်ပြင်းပြင်းခံစားရပါက သို့မဟုတ် ပင်လယ်ရေ ရုတ်တရက်လျော့သွားသည်ကို တွေ့ပါက official warning siren ကို မစောင့်ပါနှင့်။',
      'လမ်းပိတ်နေပါက ယာဉ်အတွင်း ပိတ်မိခြင်းမှ ရှောင်ရန် ခြေလျင်ထွက်ခွာပါ။',
      'မြင့်သောနေရာတွင် ဆက်နေပါ။ Tsunami လှိုင်းများသည် နာရီများစွာအတွင်း ထပ်ခါထပ်ခါ ရောက်နိုင်သည်။',
    ],
    reasons: [
      'Tsunami wave crest များသည် 500 mph အထိ သွားနိုင်ပြီး အလွန်ကြီးမားသော hydrostatic mass ရှိသည်။',
      'ပထမဆုံးလှိုင်းသည် အကြီးဆုံးမဟုတ်နိုင်ပါ။ အန္တရာယ်ရှိသော surge များသည် 12 နာရီကျော် ဆက်ရှိနိုင်သည်။',
    ],
    prohibitions: [
      'ရေလျော့သွားခြင်း သို့မဟုတ် လှိုင်းလာခြင်းကို ကြည့်ရန် ကမ်းခြေ သို့မဟုတ် ဆိပ်ကမ်းသို့ မသွားပါနှင့်။',
      'Emergency authorities မှ official "All Clear" ထုတ်ပြန်သည်အထိ ကမ်းရိုးတန်းဒေသများသို့ မပြန်ပါနှင့်။',
    ],
  },
  BEGIN_CPR_PROTECT_CERVICAL_SPINE: {
    steps: [
      '199 / 191 / 192 ကို ခေါ်ပြီး highway mile marker သို့မဟုတ် GPS intersection အတိအကျကို ပြောပါ။',
      'Oncoming traffic မှ scene ကို ကာကွယ်ထားကြောင်း သေချာပါစေ။ Hazard flasher, flare/triangle များကို 100m နောက်တွင် ထားပါ။',
      'လူနာ၏ ဦးခေါင်းနှင့် လည်ပင်းကို မလှည့်ဘဲ neutral alignment ဖြင့် ထောက်ပံ့ထားပါ။',
      'အသက်မရှူပါက မာကျောသောမြေပေါ်တွင် CPR compressions ကို 100–120 BPM ဖြင့် ပြုလုပ်ပါ။',
      'Trauma သံသယရှိပါက airway ဖွင့်ရန် head-tilt chin-lift အစား jaw-thrust maneuver ကို သုံးပါ။',
    ],
    reasons: [
      'အသက်ရှူရပ်ခြင်းသည် 4–6 မိနစ်အတွင်း ဦးနှောက်သေဆုံးမှု ဖြစ်စေနိုင်သည်။',
      'အမြန်နှုန်းမြင့်ယာဉ်တိုက်မှုများတွင် cervical vertebrae ကျိုးနိုင်ခြေမြင့်သောကြောင့် လည်ပင်းမလှည့်ခြင်းက spinal cord severance ကို ကာကွယ်နိုင်သည်။',
    ],
    prohibitions: [
      'မီး သို့မဟုတ် ပေါက်ကွဲမှုအန္တရာယ်ကြောင့် အရေးပေါ်ထုတ်ယူရခြင်း မလိုအပ်ပါက လူနာ၏လည်ပင်း သို့မဟုတ် ကျောရိုးကို မရွှေ့၊ မလှည့်ပါနှင့်။',
      'Airway လုံးဝပိတ်ပြီး မကိုင်တွယ်နိုင်သည့် အခြေအနေမဟုတ်လျှင် motorcycle helmet ကို မဖြုတ်ပါနှင့်။',
    ],
  },
  EMERGENCY_EXTRICATION_OR_SAFE_PERIMETER_DEFENSE: {
    steps: [
      '199 Heavy Rescue နှင့် Fire Engine ကို ချက်ချင်းခေါ်ပါ။',
      'ယာဉ် cabin အတွင်း မီးလောင်နေပြီး လူနာပိတ်မိနေပါက ကိုယ်ခန္ဓာ၏ long axis နှင့်တန်းညီစွာ အဝတ်ပခုံးပိုင်းမှ ဆွဲကာ rapid emergency drag ပြုလုပ်ပါ။',
      'ရရှိပါက Dry Chemical fire extinguisher ကို wheel wells နှင့် engine bay အောက်တွင် ဖြန်း၍ မီးလျှံကို လျှော့ချပါ။',
      'မီးကို မထိန်းချုပ်နိုင်ပါက 100-foot safe perimeter သတ်မှတ်ပြီး ပေါက်ကွဲနိုင်သော fuel tank/strut များမှ ဘေးလူများကို ကာကွယ်ပါ။',
    ],
    reasons: [
      'Vehicle fire အပူချိန်သည် synthetic material နှင့် pressurized fuel system ကြောင့် လျင်မြန်စွာ နှစ်ဆတက်နိုင်သည်။',
      'Life-over-limb triage အရ ချက်ချင်း thermal threat သည် potential spinal injury ထက် အရေးကြီးသောကြောင့် extrication ကို ဦးစားပေးရသည်။',
    ],
    prohibitions: [
      'မီးလောင်နေသော engine hood ကို လုံးဝဖွင့်မပစ်ပါနှင့်။ Oxygen rush ကြောင့် flashover ပိုမြန်နိုင်သည်။',
      'Bumper shock သို့မဟုတ် hatchback strut များ၏ တည့်တည့်မျဉ်းတွင် မရပ်ပါနှင့်။ Pressurized hazard ရှိသည်။',
    ],
  },
  ESTABLISH_HIGHWAY_SAFETY_PERIMETER_FIRST: {
    steps: [
      'သင့်ယာဉ်ကို crash scene ကိုကျော်၍ hazard warning light ဖွင့်ထားကာ ရပ်ပါ။',
      'Reflective warning triangle သို့မဟုတ် LED flare များကို highway တွင် accident နောက်ဘက် 100–150 paces အကွာတွင် ထားပါ။',
      'High-visibility reflective vest ဝတ်ပြီး active traffic lane များထဲမှ ဝေးဝေးနေပါ။',
      'Oncoming highway traffic ကို ကျောမပေးပါနှင့်။',
    ],
    reasons: [
      'Secondary collision impact များသည် roadside good Samaritan နှင့် first responder များအတွက် အသက်ဆုံးရှုံးမှု၏ အဓိကအကြောင်းရင်းဖြစ်သည်။',
      'ကြိုတင်သတိပေးခြင်းသည် high-speed rear-end collision များကို ကာကွယ်ပေးသည်။',
    ],
    prohibitions: [
      'လုံလောက်သော visual perimeter မရှိဘဲ live freeway lane အလယ်တွင် aid မပြုလုပ်ပါနှင့်။',
      'High-speed expressway lane များကို ခြေလျင်မဖြတ်ပါနှင့်။',
    ],
  },
  EXECUTE_MASS_CASUALTY_START_TRIAGE: {
    steps: [
      '199 dispatch မှ Mass Casualty Incident (MCI) response protocol ကို တောင်းဆိုပါ။',
      'လမ်းလျှောက်နိုင်သော ဒဏ်ရာရသူများကို သတ်မှတ်ထားသော safe staging area သို့ ရွှေ့စေပါ။ Tagged Green / Minor ဖြစ်သည်။',
      'လမ်းမလျှောက်နိုင်သော လူနာများကို Breathing, Perfusion, Mental Status (RPM protocol) ဖြင့် မြန်မြန်စစ်ဆေးပါ။',
      'နောက်လူနာသို့ မရွှေ့မီ major arterial bleed များတွင် rapid tourniquet တပ်ပါ။',
      'လူနာများကို Immediate (Red), Delayed (Yellow), Minor (Green), Deceased (Black) ဟု tag လုပ်ပါ။',
    ],
    reasons: [
      'MCI protocol များသည် salvageable red-tag emergency များသို့ resource ကို လျင်မြန်စွာ ညွှန်ပြခြင်းဖြင့် အသက်ရှင်နိုင်ခြေကို မြှင့်တင်သည်။',
      'Simple Triage and Rapid Treatment (START) သည် overtriage နှင့် hospital saturation ကို ကာကွယ်သည်။',
    ],
    prohibitions: [
      'Initial triage sweep အတွင်း လူနာတစ်ဦးလျှင် 30–60 စက္ကန့်ထက်ပို၍ မကုန်ဆုံးပါနှင့်။',
      'Scene လုံခြုံရေးယူပြီး global triage ပြီးမီ complex surgical aid မကြိုးစားပါနှင့်။',
    ],
  },
  CALL_EMERGENCY_SERVICES_AND_MONITOR_VITALS: {
    steps: [
      'ဖြစ်စဉ်ကို သတင်းပို့ရန် 199 / 191 / 192 / local emergency services ကို ချက်ချင်းခေါ်ပါ။',
      'သင့်လိပ်စာအတိအကျ၊ လမ်းဆုံများ သို့မဟုတ် GPS coordinates ကို dispatcher ထံ ပေးပါ။',
      'လူနာကို လုံခြုံသောအနေအထားတွင် စိတ်ငြိမ်၊ နွေးထွေးပြီး သက်သာစွာ အနားယူစေပါ။',
      'Paramedics ရောက်သည်အထိ airway, breathing နှင့် consciousness ကို ဆက်တိုက်စောင့်ကြည့်ပါ။',
      'Emergency responders များ ဝင်ရောက်နိုင်ရန် လမ်းကြောင်းများကို ရှင်းထားပါ။',
    ],
    reasons: [
      'စံ life-safety precaution အရ မရှင်းလင်းသော သို့မဟုတ် ပြောင်းလဲနေသော crisis input များကို professional medical/rescue dispatch အရေးပေါ်ခေါ်ဆိုခြင်းဖြင့် default လုပ်သည်။',
      'အရေးပေါ်ဝန်ဆောင်မှုကို စောစီးစွာ activate လုပ်ခြင်းသည် diagnostic assessment ပြီးနေစဉ် first responders များ လမ်းပေါ်ရောက်စေသည်။',
    ],
    prohibitions: [
      'Protective gear မရှိဘဲ structural unstable သို့မဟုတ် hazardous environment အတွင်း မဝင်ပါနှင့်။',
      'Professional medical personnel မှ ခွင့်ပြုသည်အထိ အစားအစာ၊ အရည် သို့မဟုတ် ဆေး မပေးပါနှင့်။',
      'လူနာ သို့မဟုတ် scene ကို တစ်ယောက်တည်း မထားပါနှင့်။',
    ],
  },
};

const genericEmergencyText: Record<string, string> = {
  'Call 199 / 191 / 192 immediately and put phone on speaker mode.': '199 / 191 / 192 ကိုချက်ချင်းခေါ်ပြီး ဖုန်းကို speaker mode ထားပါ။',
  'Send someone nearby to fetch an Automated External Defibrillator (AED).': 'အနီးရှိသူတစ်ဦးကို AED စက်ယူလာရန် စေလွှတ်ပါ။',
  'Position victim flat on their back on a firm, flat surface.': 'လူနာကို မာကျောပြီး ညီသောနေရာပေါ်တွင် ပက်လက်ထားပါ။',
  'DO NOT give oral fluids, liquids, or oral medications.': 'ပါးစပ်မှ ရေ၊ အရည် သို့မဟုတ် ဆေး မပေးပါနှင့်။',
  'DO NOT leave the victim unattended at any time.': 'လူနာကို မည်သည့်အချိန်တွင်မဆို တစ်ယောက်တည်း မထားပါနှင့်။',
};

const facilities: Record<string, string> = {
  oxygen: 'အောက်ဆီဂျင်',
  trauma: 'ဒဏ်ရာကုသမှု',
  'burn center': 'မီးလောင်ဒဏ်ဌာန',
  medical: 'ဆေးဘက်ဆိုင်ရာ',
  water: 'ရေ',
  food: 'အစားအစာ',
  beds: 'ကုတင်များ',
};

const proofTextTranslations: Record<string, string> = {
  'medical_rule_01: CARDIAC_ARREST_EMERGENCY': 'medical_rule_01: နှလုံးရပ်ခြင်း အရေးပေါ်အခြေအနေ',
  'Observed: unconscious = true': 'တွေ့ရှိချက်: unconscious = true',
  'Observed: breathing = none / agonal': 'တွေ့ရှိချက်: breathing = none / agonal',
  'Deduction: Acute cardiac cessation detected. Cerebral perfusion critical.': 'ဆုံးဖြတ်ချက်: ရုတ်တရက် နှလုံးရပ်သည့်အခြေအနေ တွေ့ရှိထားသည်။ ဦးနှောက်သွေးလည်ပတ်မှု အရေးကြီးသည်။',
  'Safety Invariant: Immediate 100-120 BPM compressions; zero delay for pulse check.': 'ဘေးကင်းရေး မပြောင်းလဲနိုင်သည့်စည်းမျဉ်း: 100-120 BPM ရင်ဘတ်ဖိနှိပ်မှုကို ချက်ချင်းလုပ်ပါ။ သွေးခုန်နှုန်းစစ်ရန် မနှောင့်နှေးပါနှင့်။',
  'medical_rule_02: COMPLETE_AIRWAY_OBSTRUCTION': 'medical_rule_02: အသက်ရှူလမ်းကြောင်း အပြည့်အဝပိတ်ဆို့ခြင်း',
  'Observed: symptom = choking': 'တွေ့ရှိချက်: symptom = choking',
  'Observed: airway_pass = blocked (inability to speak/cough)': 'တွေ့ရှိချက်: airway_pass = blocked (စကားမပြောနိုင် / ချောင်းမဆိုးနိုင်)',
  'Deduction: Mechanical foreign body airway obstruction.': 'ဆုံးဖြတ်ချက်: ပြင်ပအရာဝတ္ထုကြောင့် အသက်ရှူလမ်းကြောင်း ပိတ်ဆို့နေသည်။',
  'medical_rule_03: ARTERIAL_HEMORRHAGE': 'medical_rule_03: သွေးထွက်သံယိုဖြစ်ခြင်း',
  'Observed: bleeding = severe_pulsing / pooling': 'တွေ့ရှိချက်: bleeding = severe_pulsing / pooling',
  'Deduction: Arterial vascular rupture. High risk of hypovolemic hemorrhagic shock.': 'ဆုံးဖြတ်ချက်: သွေးလွှတ်ကြော ပေါက်ပြဲနေသည်။ သွေးဆုံးရှုံးမှုကြောင့် shock ဖြစ်နိုင်ခြေမြင့်သည်။',
  'medical_rule_04: ACUTE_CEREBROVASCULAR_EVENT_FAST': 'medical_rule_04: F.A.S.T. acute cerebrovascular event',
  'Deduction: Acute focal neurological deficit consistent with ischemic or hemorrhagic stroke.': 'ဆုံးဖြတ်ချက်: Ischemic သို့မဟုတ် hemorrhagic stroke နှင့် ကိုက်ညီသော acute focal neurological deficit ဖြစ်နိုင်သည်။',
  'Safety Invariant: Aspirin strictly contraindicated before CT scan rule-out of hemorrhage.': 'ဘေးကင်းရေး မပြောင်းလဲနိုင်သည့်စည်းမျဉ်း: CT scan ဖြင့် hemorrhage ကို မပယ်ချနိုင်သေးမီ aspirin ကို တင်းကျပ်စွာ မသုံးရ။',
  'medical_rule_05: SEVERE_BURN_TRAUMA': 'medical_rule_05: ပြင်းထန်သော မီးလောင်ဒဏ်ရာ',
  'Deduction: Dermal and subdermal tissue injury requiring thermal dissipation and barrier protection.': 'ဆုံးဖြတ်ချက်: အရေပြားနှင့် အောက်အရေပြား tissue ထိခိုက်ထားပြီး အပူလျော့ချခြင်းနှင့် ကာကွယ်ဖုံးအုပ်ခြင်း လိုအပ်သည်။',
  'medical_rule_06: TOXIC_EXPOSURE': 'medical_rule_06: အဆိပ် / အန္တရာယ်ရှိပစ္စည်း ထိတွေ့ခြင်း',
  'Substance exposure recorded': 'အန္တရာယ်ရှိပစ္စည်း ထိတွေ့မှုကို မှတ်တမ်းတင်ထားသည်။',
  'hazard_rule_01: ELECTRICAL_FIRE_SAFETY': 'hazard_rule_01: လျှပ်စစ်မီး ဘေးကင်းရေး',
  'Observed: hazard = fire, source = electrical': 'တွေ့ရှိချက်: hazard = fire, source = electrical',
  'STRICT LIFE-SAFETY INVARIANT: Water is an electrical conductor. NEVER use water on energized electrical fire.': 'တင်းကျပ်သော အသက်ဘေးကင်းရေး မပြောင်းလဲနိုင်သည့်စည်းမျဉ်း: ရေသည် လျှပ်စစ်ကူးသည်။ လျှပ်စစ်စီးနေသောမီးတွင် ရေကို ဘယ်တော့မှ မသုံးပါနှင့်။',
  'hazard_rule_02: GREASE_OIL_FIRE_SAFETY': 'hazard_rule_02: ဆီမီး / cooking oil မီး ဘေးကင်းရေး',
  'Observed: hazard = fire, source = cooking_oil/grease': 'တွေ့ရှိချက်: hazard = fire, source = cooking_oil/grease',
  'STRICT LIFE-SAFETY INVARIANT: Water on superheated oil creates instant explosive steam flare.': 'တင်းကျပ်သော အသက်ဘေးကင်းရေး မပြောင်းလဲနိုင်သည့်စည်းမျဉ်း: အလွန်ပူသောဆီပေါ် ရေကျပါက ချက်ချင်းပေါက်ကွဲသကဲ့သို့ steam flare ဖြစ်နိုင်သည်။',
  'hazard_rule_03: INDOOR_GAS_LEAK_EVACUATION': 'hazard_rule_03: အိမ်တွင်း ဓာတ်ငွေ့ယိုစိမ့်မှု ထွက်ခွာရေး',
  'Observed: hazard = gas_leak, location = indoors': 'တွေ့ရှိချက်: hazard = gas_leak, location = indoors',
  'Safety Invariant: Any minute spark can trigger catastrophic fuel-air deflagration.': 'ဘေးကင်းရေး မပြောင်းလဲနိုင်သည့်စည်းမျဉ်း: မီးပွားသေးသေးလေးပင် ပြင်းထန်သော fuel-air ပေါက်ကွဲလောင်ကျွမ်းမှုကို ဖြစ်စေနိုင်သည်။',
  'hazard_rule_04: TRAPPED_IN_FIRE_DEFENSIVE_SHELTER': 'hazard_rule_04: မီးတွင်ပိတ်မိခြင်း ကာကွယ်ခိုလှုံရေး',
  'Exit blocked by flames/smoke': 'ထွက်ပေါက်သည် မီးလျှံ သို့မဟုတ် မီးခိုးကြောင့် ပိတ်နေသည်။',
  'disaster_rule_01: FLASH_FLOOD_SINGLE_STORY_EVACUATION': 'disaster_rule_01: ရုတ်တရက်ရေကြီးခြင်း single-story ထွက်ခွာရေး',
  'Flood water rising in single story structure': 'Single-story အဆောက်အအုံတွင် ရေတက်နေသည်။',
  'disaster_rule_02: VERTICAL_EVACUATION': 'disaster_rule_02: အပေါ်ထပ်သို့ ခိုလှုံရွှေ့ပြောင်းခြင်း',
  'Flood in multi-story structure': 'Multi-story အဆောက်အအုံတွင် ရေကြီးနေသည်။',
  'disaster_rule_03: ACTIVE_EARTHQUAKE_PROTECTION': 'disaster_rule_03: ငလျင်လှုပ်နေစဉ် ကာကွယ်ခြင်း',
  'Active seismic shaking detected': 'ငလျင်လှုပ်ခါမှု ဆက်လက်ရှိနေသည်ကို တွေ့ရှိထားသည်။',
  'disaster_rule_04: POST_QUAKE_GAS_HAZARD': 'disaster_rule_04: ငလျင်နောက် ဓာတ်ငွေ့အန္တရာယ်',
  'Gas odor present post-quake': 'ငလျင်နောက်ပိုင်း ဓာတ်ငွေ့နံ့ ရှိနေသည်။',
  'disaster_rule_05: TSUNAMI_INLAND_EVACUATION': 'disaster_rule_05: Tsunami ကုန်းတွင်းသို့ ထွက်ခွာရေး',
  'Tsunami warning or coastal surge risk': 'Tsunami သတိပေးချက် သို့မဟုတ် ကမ်းရိုးတန်း surge အန္တရာယ် ရှိသည်။',
  'road_rule_01: CRASH_ARREST_SPINAL_PRECAUTION': 'road_rule_01: ယာဉ်တိုက်မှုတွင် အသက်ရှူရပ်ခြင်းနှင့် ကျောရိုးကာကွယ်မှု',
  'Unresponsive non-breathing crash victim': 'ယာဉ်တိုက်မှုလူနာသည် တုံ့ပြန်မှုမရှိ၊ အသက်မရှူနေပါ။',
  'road_rule_02: VEHICLE_FIRE_EXTRICATION': 'road_rule_02: ယာဉ်မီးလောင်မှုမှ အရေးပေါ်ထုတ်ယူခြင်း',
  'Vehicle fire with entrapment': 'ယာဉ်မီးလောင်နေပြီး လူနာပိတ်မိနေသည်။',
  'road_rule_03: ROADWAY_SAFETY_PERIMETER': 'road_rule_03: လမ်းပေါ်ဘေးကင်းရေးပတ်လည်',
  'Active vehicular traffic at scene': 'Scene တွင် ယာဉ်အသွားအလာ ဆက်လက်ရှိနေသည်။',
  'road_rule_04: MASS_CASUALTY_START_TRIAGE': 'road_rule_04: လူနာအများအပြား START triage',
  'Multiple casualties present': 'ဒဏ်ရာရသူများစွာ ရှိနေသည်။',
  'core_rule_fallback: PRECAUTIONARY_DISPATCH_INVARIANT': 'core_rule_fallback: သတိထားအရေးပေါ်ခေါ်ဆိုရေး မပြောင်းလဲနိုင်သည့်စည်းမျဉ်း',
  'Life-safety protocol mandates immediate emergency dispatch as safe baseline.': 'အသက်ဘေးကင်းရေး protocol အရ အခြေခံဘေးကင်းသော လုပ်ဆောင်ချက်အဖြစ် emergency dispatch ကို ချက်ချင်း activate လုပ်ရန် လိုအပ်သည်။',
};

function translateProofPattern(text: string): string | undefined {
  if (text.startsWith('FAST Signs:')) {
    return text
      .replace('FAST Signs:', 'F.A.S.T. လက္ခဏာများ:')
      .replace('Face Droop=', 'Face Droop=')
      .replace('Arm Weakness=', 'Arm Weakness=')
      .replace('Speech Difficulty=', 'Speech Difficulty=');
  }
  if (text.startsWith('Burn Type:')) {
    return text.replace('Burn Type:', 'မီးလောင်ဒဏ်ရာအမျိုးအစား:').replace('Burn Area:', 'မီးလောင်ဒဏ်ရာဧရိယာ:');
  }
  if (text.startsWith('Submitted facts:')) {
    const facts = text.replace('Submitted facts:', '').trim();
    return `တင်သွင်းထားသော facts: ${facts || 'facts မရှိပါ'}`;
  }
  return undefined;
}

export function translatePresetLabel(lang: Language, id: string, fallback: string): string {
  return lang === 'my' ? presetLabels[id] ?? fallback : fallback;
}

export function translatePresetDescription(lang: Language, id: string, fallback: string): string {
  return lang === 'my' ? presetDescriptions[id] ?? fallback : fallback;
}

export function translateFactLabel(lang: Language, fallback: string): string {
  return lang === 'my' ? factLabels[fallback] ?? fallback : fallback;
}

export function translateAction(lang: Language, action: string): string {
  if (lang !== 'my') return action;
  return actionLabels[action] ?? action;
}

export function translateEmergencyText(lang: Language, text: string): string {
  if (lang !== 'my') return text;
  if (genericEmergencyText[text]) return genericEmergencyText[text];
  if (/^DO NOT /.test(text)) return `မလုပ်ရ: ${text.replace(/^DO NOT /, '')}`;
  if (/^STRICT LIFE-SAFETY RULE:/.test(text)) return text.replace(/^STRICT LIFE-SAFETY RULE:/, 'တင်းကျပ်သော အသက်ဘေးကင်းရေး စည်းမျဉ်း:');
  return text;
}

export function translateResultItem(
  lang: Language,
  action: string,
  field: ResultField,
  index: number,
  fallback: string
): string {
  if (lang !== 'my') return fallback;
  const translated = resultTranslations[action]?.[field]?.[index];
  if (translated) return translated;
  warnMissingMyanmar(`result.${action}.${field}.${index}`, fallback);
  return fallback;
}

export function translateProofText(lang: Language, text: string): string {
  if (lang !== 'my') return text;
  const translated = proofTextTranslations[text] ?? translateProofPattern(text);
  if (translated) return translated;
  if (/^[a-z_]+/.test(text) || text.includes('⇒') || text.includes('∧') || text.includes('∨')) {
    return text;
  }
  warnMissingMyanmar('proof.text', text);
  return text;
}

export function translateFacility(lang: Language, facility: string): string {
  if (lang !== 'my') return facility;
  return facilities[facility.toLowerCase()] ?? facility;
}

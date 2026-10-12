// 慶良間ダイビングスポット診断
// 質問に答えるごとに各スポットへ点数を加算し、合計点の高い順に候補を表示する。

const QUESTIONS = [
  {
    key: "level",
    text: "ダイビングの経験はどのくらいですか？",
    choices: [
      { value: "none", icon: "🔰", label: "まったく初めて", note: "体験ダイビングやシュノーケルから始めたい" },
      { value: "beginner", icon: "🐠", label: "ライセンスを取ったばかり", note: "本数はまだ少なめ" },
      { value: "experienced", icon: "🐬", label: "経験を積んでいる", note: "ボートダイビングにも慣れている" },
    ],
  },
  {
    key: "want",
    text: "海の中でいちばん見たいものは？",
    choices: [
      { value: "turtle", icon: "🐢", label: "ウミガメ", note: "のんびり泳ぐ姿に会いたい" },
      { value: "fish", icon: "🪸", label: "サンゴと熱帯魚", note: "カラフルな景色を楽しみたい" },
      { value: "dynamic", icon: "🌊", label: "迫力ある地形や魚の群れ", note: "ダイナミックな水中景観が見たい" },
    ],
  },
  {
    key: "style",
    text: "どんなスタイルで楽しみたいですか？",
    choices: [
      { value: "beach", icon: "🏖️", label: "ビーチからのんびり", note: "砂浜から海に入りたい" },
      { value: "facilities", icon: "🏄", label: "設備やほかの遊びも充実", note: "カヤックや飲食店なども楽しみたい" },
      { value: "boat", icon: "🚤", label: "ボートで沖へ", note: "ショップのボートで出かけたい" },
    ],
  },
];

// スポットデータ
// 説明文は各出典の記載内容の範囲でまとめている。
const SPOTS = [
  {
    id: "tokashiku",
    name: "渡嘉志久ビーチ",
    island: "渡嘉敷島（渡嘉敷村）",
    tags: ["ビーチ", "遠浅", "ウミガメ"],
    desc: "渡嘉志久集落に面した遠浅のビーチで、波の穏やかな日が多いとされています。ウミガメのえさ場になっていて、遊泳区域内でウミガメに出会えることもあります。",
    point: "ウミガメ好きの初心者に。見られるかは運次第なので、追いかけずに離れて見守りましょう。",
    source: { label: "環境省「慶良間諸島国立公園」スタンプラリー案内", url: "https://www.env.go.jp/nature/mankitsu-project/stamp-rally/datail33.html" },
    score: {
      level: { none: 3, beginner: 3, experienced: 1 },
      want: { turtle: 3, fish: 1, dynamic: 0 },
      style: { beach: 3, facilities: 1, boat: 0 },
    },
  },
  {
    id: "aharen",
    name: "阿波連ビーチ",
    island: "渡嘉敷島（渡嘉敷村）",
    tags: ["ビーチ", "アクティビティ豊富", "設備充実"],
    desc: "渡嘉敷島の南西部にある、約800mの湾状の砂浜です。周辺に飲食店や宿泊施設が集まり、シュノーケルやシーカヤックなど海のアクティビティも楽しめます。運が良ければウミガメに出会えることもあるそうです。",
    point: "海遊びもごはんも楽しみたい人に。ライフガードの配置期間などは事前に確認しましょう。",
    source: [
      { label: "環境省「慶良間諸島国立公園」スタンプラリー案内", url: "https://www.env.go.jp/nature/mankitsu-project/stamp-rally/datail33.html" },
      { label: "観光庁 多言語解説文データベース（阿波連ビーチ）", url: "https://www.mlit.go.jp/tagengo-db/common/001552986.pdf" },
    ],
    score: {
      level: { none: 3, beginner: 2, experienced: 1 },
      want: { turtle: 2, fish: 2, dynamic: 0 },
      style: { beach: 2, facilities: 3, boat: 0 },
    },
  },
  {
    id: "ama",
    name: "阿真ビーチ",
    island: "座間味島（座間味村）",
    tags: ["ビーチ", "遠浅", "ウミガメ"],
    desc: "座間味港から徒歩約20分の、遠浅で穏やかな内海のビーチです。ウミガメに出会えるビーチとして知られています。水深がとても浅いため、満潮の時間帯に訪れるのがおすすめとされています。裏手にはキャンプ場があります。",
    point: "静かな雰囲気でウミガメを探したい人に。潮の時間をチェックしてから出かけましょう。",
    source: { label: "観光庁 多言語解説文データベース（阿真ビーチ）", url: "https://www.mlit.go.jp/tagengo-db/common/001553013.pdf" },
    score: {
      level: { none: 3, beginner: 3, experienced: 1 },
      want: { turtle: 3, fish: 1, dynamic: 0 },
      style: { beach: 3, facilities: 1, boat: 0 },
    },
  },
  {
    id: "furuzamami",
    name: "古座間味ビーチ",
    island: "座間味島（座間味村）",
    tags: ["ビーチ", "サンゴ", "熱帯魚"],
    desc: "水深があり、波打ち際から近い場所でサンゴのまわりに集まる熱帯魚を観察できるビーチです。ミシュラン・グリーンガイドで2つ星を獲得しています。",
    point: "カラフルな水中景色を見たい人に。サンゴを踏んだり触ったりしないよう注意しましょう。",
    source: { label: "環境省「慶良間諸島国立公園」スタンプラリー案内", url: "https://www.env.go.jp/nature/mankitsu-project/stamp-rally/datail33.html" },
    score: {
      level: { none: 2, beginner: 3, experienced: 2 },
      want: { turtle: 1, fish: 3, dynamic: 1 },
      style: { beach: 3, facilities: 2, boat: 0 },
    },
  },
  {
    id: "nishibama",
    name: "北浜（ニシバマ）ビーチ",
    island: "阿嘉島（座間味村）",
    tags: ["ビーチ", "ケラマブルー", "展望テラス"],
    desc: "白くまっすぐに伸びる砂浜と、「ケラマブルー」と呼ばれる海の色のグラデーションが特徴のビーチです。日陰のある展望テラス（ニシバマテラス）もあります。",
    point: "海の色や景色も楽しみたい人に。泳ぐ前に遊泳区域や設備の状況を確認しましょう。",
    source: { label: "環境省「慶良間諸島国立公園」スタンプラリー案内", url: "https://www.env.go.jp/nature/mankitsu-project/stamp-rally/datail33.html" },
    score: {
      level: { none: 2, beginner: 2, experienced: 1 },
      want: { turtle: 1, fish: 2, dynamic: 1 },
      style: { beach: 3, facilities: 2, boat: 0 },
    },
  },
  {
    id: "boat-trial",
    name: "ショップのボートダイビング（ポイントは当日決定）",
    island: "慶良間諸島の各ポイント",
    tags: ["ボート", "ガイド同行", "体験ダイビングも"],
    desc: "慶良間の海には多くのダイビングポイントがあり、どこに潜るかは当日の天候や海況を見てショップ・ガイドが判断するのが一般的です。初めての方は体験ダイビング、ライセンス保持者はファンダイビングとして、レベルに合わせて相談できます。",
    point: "特定のスポットにこだわらず、まずは安全に慶良間の海を体験したい人に。申し込み時に経験と希望を伝えましょう。",
    source: null,
    score: {
      level: { none: 3, beginner: 3, experienced: 2 },
      want: { turtle: 1, fish: 2, dynamic: 2 },
      style: { beach: 0, facilities: 1, boat: 3 },
    },
  },
  {
    id: "kuroshima-north",
    name: "黒島北（ボートポイント）",
    island: "黒島周辺",
    tags: ["ボート", "地形", "魚の群れ"],
    desc: "海面に突き出た2つの岩が目印のポイントで、水深約50mまで落ち込む地形が特徴とされています。ソフトコーラルや回遊魚の群れが見られることがあります。",
    point: "地形派・群れ派の経験者に。深場があるため、ガイドの指示に従い、自分の経験に合った範囲で潜りましょう。",
    source: { label: "SSI MyDiveGuide（Kuroshima North / Twin Rock）", url: "https://www.divessi.com/en/mydiveguide/divesite/kuroshima-north-twin-rock-japan-59520" },
    minLevel: "beginner", // 未経験者には表示しない
    score: {
      level: { none: 0, beginner: 1, experienced: 3 },
      want: { turtle: 0, fish: 1, dynamic: 3 },
      style: { beach: 0, facilities: 0, boat: 3 },
    },
  },
];

const LEVEL_ORDER = ["none", "beginner", "experienced"];
const RESULT_COUNT = 3;

// ===== 状態 =====
let current = 0;
let answers = {};

// ===== 要素 =====
const $ = (id) => document.getElementById(id);
const startSection = $("start");
const quizSection = $("quiz");
const resultSection = $("result");

function show(section) {
  [startSection, quizSection, resultSection].forEach((s) => {
    s.hidden = s !== section;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== 質問表示 =====
function renderQuestion() {
  const q = QUESTIONS[current];
  $("q-count").textContent = `Q${current + 1} / ${QUESTIONS.length}`;
  $("q-text").textContent = q.text;
  $("progress-bar").style.width = `${(current / QUESTIONS.length) * 100}%`;
  $("back-btn").disabled = current === 0;

  const box = $("choices");
  box.innerHTML = "";
  q.choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.dataset.value = c.value;
    btn.innerHTML = `<span class="icon" aria-hidden="true">${c.icon}</span><span>${c.label}<small>${c.note}</small></span>`;
    btn.addEventListener("click", () => choose(q.key, c.value));
    box.appendChild(btn);
  });
}

function choose(key, value) {
  answers[key] = value;
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
  } else {
    renderResult();
  }
}

// ===== 診断ロジック =====
function diagnose(ans) {
  const levelIndex = LEVEL_ORDER.indexOf(ans.level);
  return SPOTS
    .filter((s) => !s.minLevel || levelIndex >= LEVEL_ORDER.indexOf(s.minLevel))
    .map((s) => ({
      spot: s,
      total: QUESTIONS.reduce((sum, q) => sum + (s.score[q.key][ans[q.key]] || 0), 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, RESULT_COUNT)
    .map((r) => r.spot);
}

function labelOf(key, value) {
  const q = QUESTIONS.find((q) => q.key === key);
  return q.choices.find((c) => c.value === value).label;
}

// ===== 結果表示 =====
function renderResult() {
  const spots = diagnose(answers);
  $("result-summary").textContent =
    `「${labelOf("level", answers.level)}」「${labelOf("want", answers.want)}」「${labelOf("style", answers.style)}」と答えたあなたには、こんなスポット候補があります。`;

  const list = $("result-list");
  list.innerHTML = "";
  spots.forEach((s, i) => {
    const card = document.createElement("article");
    card.className = "card spot";
    card.dataset.spot = s.id;
    const sourceHtml = s.source
      ? "出典：" + [].concat(s.source)
          .map((src) => `<a href="${src.url}" target="_blank" rel="noopener">${src.label}</a>`)
          .join(" / ")
      : "一般的な案内です。内容はショップごとに異なります。";
    card.innerHTML = `
      <span class="spot-rank${i === 0 ? "" : " sub"}">${i === 0 ? "いちばんのおすすめ" : `候補 ${i + 1}`}</span>
      <h3>${s.name}</h3>
      <p class="spot-island">📍 ${s.island}</p>
      <ul class="tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      <p class="spot-desc">${s.desc}</p>
      <p class="spot-point">💡 ${s.point}</p>
      <p class="spot-source">${sourceHtml}</p>
    `;
    list.appendChild(card);
  });

  show(resultSection);
}

// ===== イベント =====
$("start-btn").addEventListener("click", () => {
  current = 0;
  answers = {};
  renderQuestion();
  show(quizSection);
});

$("back-btn").addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

$("retry-btn").addEventListener("click", () => {
  current = 0;
  answers = {};
  show(startSection);
});

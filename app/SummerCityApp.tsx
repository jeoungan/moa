"use client";

import { useEffect, useMemo, useState } from "react";

type Mission = {
  id: string;
  title: string;
  place: string;
  time: string;
  tag: string;
  energy: string;
};

type Post = {
  id: string;
  author: string;
  area: string;
  distance: string;
  time: string;
  title: string;
  body: string;
  tag: string;
  mission: string;
  palette: "aqua" | "sun" | "mint" | "coral" | "night" | "lime";
  scope: "near" | "all";
  saves: number;
};

const missions: Mission[] = [
  {
    id: "shade-coffee",
    title: "그늘 벤치에서 아이스 음료 마시기",
    place: "동네 공원",
    time: "20분",
    tag: "그늘",
    energy: "가볍게",
  },
  {
    id: "evening-photo",
    title: "퇴근길 노을 사진 한 장 남기기",
    place: "육교나 하천길",
    time: "10분",
    tag: "사진",
    energy: "혼자도 좋아요",
  },
  {
    id: "convenience-ice",
    title: "편의점 신상 아이스크림 기록하기",
    place: "집 근처 편의점",
    time: "15분",
    tag: "먹거리",
    energy: "시원하게",
  },
  {
    id: "library-cool",
    title: "동네 실내 스팟에서 한 시간 쉬기",
    place: "도서관/쇼핑몰",
    time: "60분",
    tag: "실내",
    energy: "조용하게",
  },
  {
    id: "night-walk",
    title: "해 진 뒤 밤공기 산책하기",
    place: "밝은 골목길",
    time: "25분",
    tag: "야간",
    energy: "천천히",
  },
  {
    id: "market-fruit",
    title: "작은 과일 한 팩 사서 나눠 먹기",
    place: "시장/마트",
    time: "30분",
    tag: "먹거리",
    energy: "둘이서",
  },
];

const initialPosts: Post[] = [
  {
    id: "p1",
    author: "망원동 소다",
    area: "망원",
    distance: "0.7km",
    time: "12분 전",
    title: "그늘 많은 골목에서 자두 에이드",
    body: "가게 앞 작은 의자에 앉았는데 바람이 꽤 괜찮았어요. 멀리 안 가도 휴가 기분 납니다.",
    tag: "그늘",
    mission: "그늘 벤치에서 아이스 음료 마시기",
    palette: "aqua",
    scope: "near",
    saves: 18,
  },
  {
    id: "p2",
    author: "성수 밤산책",
    area: "성수",
    distance: "1.2km",
    time: "26분 전",
    title: "서울숲 옆길은 해 지고 나서가 진짜",
    body: "낮엔 더워서 포기했는데 8시 이후엔 천천히 걷기 좋았어요. 물 하나 들고 가면 딱.",
    tag: "야간",
    mission: "해 진 뒤 밤공기 산책하기",
    palette: "night",
    scope: "near",
    saves: 31,
  },
  {
    id: "p3",
    author: "잠실멜론",
    area: "잠실",
    distance: "4.8km",
    time: "1시간 전",
    title: "편의점 멜론바로 짧은 피서",
    body: "집 앞에서 1,500원으로 끝낸 여름. 오늘은 이 정도의 소소함이 좋네요.",
    tag: "먹거리",
    mission: "편의점 신상 아이스크림 기록하기",
    palette: "mint",
    scope: "all",
    saves: 24,
  },
  {
    id: "p4",
    author: "연남 필름",
    area: "연남",
    distance: "6.1km",
    time: "2시간 전",
    title: "노을이 유리창에 걸린 순간",
    body: "카페 문 닫기 직전에 찍은 사진. 오늘의 여름 미션 완료.",
    tag: "사진",
    mission: "퇴근길 노을 사진 한 장 남기기",
    palette: "sun",
    scope: "all",
    saves: 42,
  },
  {
    id: "p5",
    author: "을지로 냉방",
    area: "을지로",
    distance: "8.4km",
    time: "어제",
    title: "점심시간 40분 도서관 피난",
    body: "업무 중간에 머리 식히기 좋았어요. 여름엔 실내 루트도 기록할 가치가 있네요.",
    tag: "실내",
    mission: "동네 실내 스팟에서 한 시간 쉬기",
    palette: "lime",
    scope: "all",
    saves: 15,
  },
];

const localAreas = [
  { name: "망원", pulse: 82, note: "그늘 산책 많음" },
  { name: "성수", pulse: 76, note: "야간 기록 증가" },
  { name: "연남", pulse: 69, note: "노을 사진 인기" },
  { name: "잠실", pulse: 64, note: "실내 피서 공유" },
];

const tags = ["전체", "그늘", "사진", "먹거리", "실내", "야간"];

function pickMission(currentId?: string) {
  const pool = missions.filter((mission) => mission.id !== currentId);
  return pool[Math.floor(Math.random() * pool.length)] ?? missions[0];
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function areaFromCoords(latitude: number, longitude: number) {
  if (latitude > 37.56 && longitude < 126.95) return "연남";
  if (latitude > 37.53 && longitude > 127.03) return "성수";
  if (latitude < 37.52 && longitude > 127.07) return "잠실";
  if (longitude < 126.95) return "망원";
  return "내 근처";
}

export function SummerCityApp() {
  const [mission, setMission] = useState<Mission>(missions[0]);
  const [acceptedMission, setAcceptedMission] = useState<Mission | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<"near" | "all" | "mine">("near");
  const [activeTag, setActiveTag] = useState("전체");
  const [neighborhood, setNeighborhood] = useState("망원");
  const [locationState, setLocationState] = useState("근처 피드");
  const [completedCount, setCompletedCount] = useState(3);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftTag, setDraftTag] = useState("그늘");
  const [shareState, setShareState] = useState("공유문구");

  useEffect(() => {
    const storedPosts = window.localStorage.getItem("summer-city-posts");
    const storedCount = window.localStorage.getItem("summer-city-count");

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts) as Post[]);
    }

    if (storedCount) {
      setCompletedCount(Number(storedCount));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("summer-city-posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    window.localStorage.setItem("summer-city-count", String(completedCount));
  }, [completedCount]);

  const visiblePosts = useMemo(() => {
    return posts.filter((post) => {
      const tabMatch =
        activeTab === "all" ||
        (activeTab === "near" && post.scope === "near") ||
        (activeTab === "mine" && post.author === "나");
      const tagMatch = activeTag === "전체" || post.tag === activeTag;
      return tabMatch && tagMatch;
    });
  }, [activeTab, activeTag, posts]);

  const todayProgress = Math.min(100, completedCount * 16 + 24);

  function useNearbyLocation() {
    setLocationState("위치 확인 중");

    if (!navigator.geolocation) {
      setLocationState("위치 미지원");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextArea = areaFromCoords(
          position.coords.latitude,
          position.coords.longitude,
        );
        setNeighborhood(nextArea);
        setLocationState("내 주변");
      },
      () => {
        setLocationState("동네 선택");
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 10, timeout: 7000 },
    );
  }

  function completeMission() {
    setAcceptedMission(mission);
    setDraftTitle(mission.title);
    setDraftBody("");
    setDraftTag(mission.tag);
    setCompletedCount((count) => count + 1);
    setActiveTab("mine");
  }

  function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = draftTitle.trim();
    const trimmedBody = draftBody.trim();
    if (!trimmedTitle || !trimmedBody) return;

    const newPost: Post = {
      id: makeId(),
      author: "나",
      area: neighborhood,
      distance: "지금",
      time: "방금",
      title: trimmedTitle,
      body: trimmedBody,
      tag: draftTag,
      mission: acceptedMission?.title ?? mission.title,
      palette: "coral",
      scope: "near",
      saves: 0,
    };

    setPosts((current) => [newPost, ...current]);
    setDraftTitle("");
    setDraftBody("");
    setAcceptedMission(null);
  }

  async function copyShareText() {
    const text = `오늘여름에서 '${mission.title}' 미션을 받았어요. ${neighborhood}의 여름 기록도 같이 보는 중!`;

    try {
      await navigator.clipboard.writeText(text);
      setShareState("복사됨");
      window.setTimeout(() => setShareState("공유문구"), 1600);
    } catch {
      setShareState("복사 실패");
      window.setTimeout(() => setShareState("공유문구"), 1600);
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band" aria-label="오늘여름 홈">
        <nav className="app-nav" aria-label="앱 메뉴">
          <div>
            <p className="eyebrow">도시 안의 여름</p>
            <h1>오늘여름</h1>
          </div>
          <button className="icon-button" type="button" onClick={useNearbyLocation}>
            <span aria-hidden="true">⌖</span>
            <span className="sr-only">내 위치 사용</span>
          </button>
        </nav>

        <div className="hero-grid">
          <article className="mission-panel" aria-label="오늘의 랜덤 미션">
            <div className="mission-visual" aria-hidden="true">
              <span className="sun-dot" />
              <span className="path-line" />
              <span className="cup-shape" />
            </div>
            <div className="mission-copy">
              <div className="panel-row">
                <span className="pill">{mission.tag}</span>
                <span className="meta-text">{mission.energy}</span>
              </div>
              <h2>{mission.title}</h2>
              <dl className="mission-facts">
                <div>
                  <dt>장소</dt>
                  <dd>{mission.place}</dd>
                </div>
                <div>
                  <dt>시간</dt>
                  <dd>{mission.time}</dd>
                </div>
              </dl>
              <div className="action-row">
                <button
                  className="primary-button"
                  type="button"
                  onClick={completeMission}
                >
                  완료 기록
                </button>
                <button
                  className="quiet-button"
                  type="button"
                  onClick={() => setMission(pickMission(mission.id))}
                >
                  바꾸기
                </button>
                <button className="quiet-button icon-only" type="button" onClick={copyShareText}>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">{shareState}</span>
                </button>
              </div>
            </div>
          </article>

          <aside className="pulse-panel" aria-label="동네 여름 지표">
            <div className="panel-row">
              <span className="location-chip">{neighborhood}</span>
              <span className="meta-text">{locationState}</span>
            </div>
            <div className="progress-orbit" aria-label={`오늘 여름 채움 ${todayProgress}%`}>
              <span>{todayProgress}%</span>
            </div>
            <p className="pulse-title">이번 주 {completedCount}개의 여름 순간</p>
            <div className="mini-bars" aria-hidden="true">
              <span style={{ height: "36%" }} />
              <span style={{ height: "58%" }} />
              <span style={{ height: "74%" }} />
              <span style={{ height: "48%" }} />
              <span style={{ height: "88%" }} />
            </div>
          </aside>
        </div>
      </section>

      <section className="local-strip" aria-label="동네 여름 현황">
        {localAreas.map((area) => (
          <button
            className={`area-tile ${area.name === neighborhood ? "is-active" : ""}`}
            key={area.name}
            type="button"
            onClick={() => setNeighborhood(area.name)}
          >
            <strong>{area.name}</strong>
            <span>{area.note}</span>
            <em>{area.pulse}</em>
          </button>
        ))}
      </section>

      <section className="feed-section" aria-label="여름 피드">
        <div className="section-head">
          <div>
            <p className="eyebrow">지금 올라온 것들</p>
            <h2>동네 여름 피드</h2>
          </div>
          <div className="segmented-control" role="tablist" aria-label="피드 범위">
            <button
              className={activeTab === "near" ? "is-selected" : ""}
              type="button"
              onClick={() => setActiveTab("near")}
            >
              근처
            </button>
            <button
              className={activeTab === "all" ? "is-selected" : ""}
              type="button"
              onClick={() => setActiveTab("all")}
            >
              전체
            </button>
            <button
              className={activeTab === "mine" ? "is-selected" : ""}
              type="button"
              onClick={() => setActiveTab("mine")}
            >
              내 기록
            </button>
          </div>
        </div>

        <div className="tag-row" aria-label="피드 태그">
          {tags.map((tag) => (
            <button
              className={activeTag === tag ? "is-selected" : ""}
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="content-grid">
          <div className="post-list">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className={`post-photo ${post.palette}`} aria-hidden="true">
                    <span />
                  </div>
                  <div className="post-content">
                    <div className="panel-row">
                      <span className="pill">{post.tag}</span>
                      <span className="meta-text">
                        {post.area} · {post.distance} · {post.time}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                    <div className="post-footer">
                      <span>{post.mission}</span>
                      <button type="button" aria-label={`${post.title} 저장`}>
                        +{post.saves}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <strong>아직 기록이 없어요</strong>
                <span>첫 여름 순간을 남겨보세요.</span>
              </div>
            )}
          </div>

          <form className="composer" onSubmit={submitPost} aria-label="여름 기록 작성">
            <div className="panel-row">
              <span className="location-chip">{neighborhood}</span>
              <span className="meta-text">내 여름 기록</span>
            </div>
            <label>
              <span>제목</span>
              <input
                maxLength={34}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="오늘 발견한 여름"
                value={draftTitle}
              />
            </label>
            <label>
              <span>태그</span>
              <select
                onChange={(event) => setDraftTag(event.target.value)}
                value={draftTag}
              >
                {tags.slice(1).map((tag) => (
                  <option key={tag}>{tag}</option>
                ))}
              </select>
            </label>
            <label>
              <span>기록</span>
              <textarea
                maxLength={120}
                onChange={(event) => setDraftBody(event.target.value)}
                placeholder="동네에서 느낀 여름을 짧게 남겨요"
                value={draftBody}
              />
            </label>
            <button className="primary-button" type="submit">
              피드에 올리기
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

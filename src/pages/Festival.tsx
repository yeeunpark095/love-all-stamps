import { useState } from "react";
import { Heart, MapPin, Stamp, Plane, BookOpen, Flame, Gift, Bot, Palette, Theater, Leaf, Sparkles, Star, Camera, Users, Music, School, Target, CircleDot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Festival = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"booths" | "exhibitions">("booths");

  const booths = [
    {
      name: "빛글",
      subtitle: "Student Press Club",
      icon: <Target className="w-6 h-6" />,
      tagline: "탐정처럼 추리하고, 친구들과 함께 도전해보세요 🔍",
      description: "주제별 미션 카드를 받고, 조건에 맞는 사람을 직접 찾아 데려오는 미션형 게임!"
    },
    {
      name: "KIKKER",
      subtitle: "International Exchange Club",
      icon: <Plane className="w-6 h-6" />,
      tagline: "전 세계 사랑을 전하는 KIKKER 항공에 탑승하세요!",
      description: "세계 곳곳의 문화를 만나는 특별한 여행이 여러분을 기다립니다 🌏"
    },
    {
      name: "BUKU",
      subtitle: "Book Talk Club",
      icon: <BookOpen className="w-6 h-6" />,
      tagline: "책처럼 펼쳐보는 연애 MBTI 테스트 ❤️",
      description: "달콤한 운세와 함께하는 북카페 ☕ 나만의 북클립 만들기 ✂️ 감성 충만! 독서와 사랑이 만나는 공간으로 초대합니다."
    },
    {
      name: "솔리언",
      subtitle: "Peer Counseling",
      icon: <Heart className="w-6 h-6" />,
      tagline: "작은 선물 속에 따뜻한 마음을 담은 추억의 뽑기판 🎁",
      description: "친구와 함께 뽑으며 오늘의 행복 메시지를 받아가세요."
    },
    {
      name: "물리를 만들다",
      subtitle: "Physics Club",
      icon: <Bot className="w-6 h-6" />,
      tagline: "직접 보고, 만지고, 조종하며 과학의 재미를 느껴보세요 🤖",
      description: "골드버그 장치, 로봇 & 드론 조종, 랜덤 상품 뽑기까지!"
    },
    {
      name: "STEAM 사회참여반",
      subtitle: "Social Participation Club",
      icon: <Flame className="w-6 h-6" />,
      tagline: "사랑의 단맛 vs 매운맛! '전남친 토스트' 간식 부스 🍞",
      description: "불타는 사랑 게임 체험 🔥 주제탐구 보고서 전시 📄 사랑을 과학적으로 분석해보는 유쾌한 부스!"
    },
    {
      name: "융합과학 STEAM 주제연구반",
      subtitle: "STEAM Research Club",
      icon: <Target className="w-6 h-6" />,
      tagline: "과학 오락실 OPEN!",
      description: "단서를 찾아 제한 시간 내 탈출하는 방탈출 게임 🕵️‍♀️ 과학 원리를 이용한 미니 게임 체험 🎮"
    },
    {
      name: "애드미찬양반",
      subtitle: "Worship Team",
      icon: <Music className="w-6 h-6" />,
      tagline: "2025 애드미 버스킹 – '사랑을 노래하다'",
      description: "따뜻한 음악이 흘러나오는 무대에서 잠시 쉬어가세요 🎶"
    },
    {
      name: "영어토론프레젠테이션",
      subtitle: "English Debate & Presentation",
      icon: <Users className="w-6 h-6" />,
      tagline: "손잡고 오세요! 친구와 함께하는 영어 스피드 퀴즈 ✋",
      description: "영어로 소통하며 즐기는 특별한 체험!"
    },
    {
      name: "수달(수학의 달인)",
      subtitle: "Math Club",
      icon: <Target className="w-6 h-6" />,
      tagline: "오늘의 수학 러브라인은?",
      description: "블라인드 소개팅 콘셉트 체험! 💞"
    },
    {
      name: "빅데이터투인사이트",
      subtitle: "Big Data Club",
      icon: <School className="w-6 h-6" />,
      tagline: "데이터 속 숨은 이야기를 찾아라!",
      description: "빅데이터 분석의 세계로 함께 떠나요 💻"
    },
    {
      name: "랩퀘스트",
      subtitle: "Lab Quest",
      icon: <Sparkles className="w-6 h-6" />,
      tagline: "분자 구조를 쿠키로 만든다고?! 🍪",
      description: "분자모형 쿠키 만들기 체험으로 과학과 달콤함을 동시에!"
    },
    {
      name: "슬램덩크",
      subtitle: "Basketball Club",
      icon: <CircleDot className="w-6 h-6" />,
      tagline: "사랑을 쏴라! 농구 커플 챌린지! 💞",
      description: "짝을 이뤄 슛 성공 개수만큼 상품은 짝꿍에게 전달!"
    },
    {
      name: "Ballin",
      subtitle: "Volleyball Club",
      icon: <CircleDot className="w-6 h-6" />,
      tagline: "러브 리시브! 💘",
      description: "사랑의 토스 릴레이로 짝꿍과 함께 배구 한 판!"
    },
    {
      name: "축구반",
      subtitle: "Soccer Club",
      icon: <Target className="w-6 h-6" />,
      tagline: "프리스타일 축구 & 승부차기 대결!",
      description: "최고의 플레이어에게는 상품 증정 ⚡"
    },
    {
      name: "디자인공예반",
      subtitle: "Design & Craft Club",
      icon: <Gift className="w-6 h-6" />,
      tagline: "내가 사랑한 것을 주제로 한 굿즈 제작 체험",
      description: "스스로 만든 디자인 작품 전시도 함께 관람하세요 🎁"
    },
    {
      name: "AI·SW 코딩반",
      subtitle: "Coding Club",
      icon: <Bot className="w-6 h-6" />,
      tagline: "게임과 코딩이 만나는 신기한 세상으로 초대합니다!",
      description: "아두이노 작품 전시, 햄스터봇 축구 경기 ⚽ 아두이노 상품 뽑기 🎁"
    },
    {
      name: "진로 DREAM",
      subtitle: "Career Exploration",
      icon: <Star className="w-6 h-6" />,
      tagline: "나의 꿈, 나의 진로를 직접 탐색해보세요",
      description: "진로직업체험센터와 연계한 다양한 직업 체험 부스"
    }
  ];

  const exhibitions = [
    {
      name: "ARTY 미술반",
      subtitle: "Art Club",
      icon: <Palette className="w-6 h-6" />,
      tagline: "그림으로 표현하는 사랑",
      description: "단체작품 '사랑'과 개인작 전시 💕 페이스페인팅, 쥬얼리 메이크업, 타투 등 특별 체험으로 나만의 아트 완성!"
    },
    {
      name: "간호보건동아리",
      subtitle: "Nursing & Health Club",
      icon: <Heart className="w-6 h-6" />,
      tagline: "스트레스 받을 때 우리 몸은 어떻게 변할까?",
      description: "직접 체험하며 스트레스 관리법을 배워보세요."
    },
    {
      name: "뮤지컬반",
      subtitle: "Musical Club",
      icon: <Theater className="w-6 h-6" />,
      tagline: "뮤지컬로 만나는 설레는 학창시절",
      description: "무대 위의 청춘이 펼쳐집니다!"
    },
    {
      name: "힙합댄스반",
      subtitle: "Hip-hop Dance Club",
      icon: <Music className="w-6 h-6" />,
      tagline: "열정 가득한 힙합댄스 공연",
      description: "리듬에 몸을 맡겨보세요!"
    },
    {
      name: "Be Creator",
      subtitle: "Festival Planning Team",
      icon: <Sparkles className="w-6 h-6" />,
      tagline: "성덕제를 만드는 사람들!",
      description: "축제 기획 과정과 자료 전시, 스탭들의 비하인드 공개 👀"
    },
    {
      name: "플로깅반",
      subtitle: "Plogging Club",
      icon: <Leaf className="w-6 h-6" />,
      tagline: "환경을 지키는 새로운 방식, 플로깅!",
      description: "활동 사진과 자료를 통해 지구를 위한 작은 발걸음을 배워요."
    },
    {
      name: "사회정책탐구반",
      subtitle: "Social Policy Research",
      icon: <BookOpen className="w-6 h-6" />,
      tagline: "사회 문제를 분석하고 해결책을 제시한 탐구 보고서 전시 💡",
      description: "학생들의 깊이 있는 사회 탐구 결과를 만나보세요."
    },
    {
      name: "친환경연구동아리",
      subtitle: "Eco Club",
      icon: <Leaf className="w-6 h-6" />,
      tagline: "친환경 컵으로 마시는 갤럭시 에이드 🥤",
      description: "텀블러 사용 시 친환경 키링·그립톡 증정!"
    },
    {
      name: "한걸음",
      subtitle: "Volunteer Club",
      icon: <Users className="w-6 h-6" />,
      tagline: "'한걸음'이 걸어온 이야기와 활동을 소개하는 전시 🌼",
      description: "나눔과 봉사의 따뜻한 발자취를 따라가보세요."
    },
    {
      name: "핸즈온 과학탐구반",
      subtitle: "Hands-on Science Club",
      icon: <Sparkles className="w-6 h-6" />,
      tagline: "학생들의 소모임 연구결과 전시",
      description: "직접 만든 실험 아이디어를 만나보세요."
    },
    {
      name: "FRAME (방송부)",
      subtitle: "Broadcasting Club",
      icon: <Camera className="w-6 h-6" />,
      tagline: "성덕 방송제 I ~ IV 시리즈 전격 상영!",
      description: "학생들이 직접 기획하고 촬영한 감동의 순간을 만나보세요 🎥"
    },
    {
      name: "애니메이션 동아리",
      subtitle: "Animation Club",
      icon: <Star className="w-6 h-6" />,
      tagline: "애니메이션은 어떻게 만들어질까?",
      description: "제작 과정 전시 + 직접 체험 코너도 마련!"
    },
    {
      name: "Guide Makers",
      subtitle: "Guide Making Club",
      icon: <BookOpen className="w-6 h-6" />,
      tagline: "학생이 직접 만든 영문 박물관 안내서 전시",
      description: "여러분도 가이드가 되어보세요!"
    },
    {
      name: "뷰티동아리",
      subtitle: "Beauty Club",
      icon: <Sparkles className="w-6 h-6" />,
      tagline: "나를 빛내는 맞춤 뷰티 솔루션 💋",
      description: "퍼스널 컬러 & 스타일링 팁도 함께 받아가세요."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-blue-100/50" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-block animate-bounce mb-4">
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            2025 성덕제 ❤️
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-800">
            사랑을 담다
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            사랑을 주제로 한 성덕제의 모든 체험과 전시를 한눈에!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-pink-500 hover:bg-pink-600 text-white gap-2"
              onClick={() => navigate("/stamps")}
            >
              <Stamp className="w-5 h-5" />
              스탬프 투어 시작하기
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 border-pink-300 text-pink-600 hover:bg-pink-50"
              onClick={() => navigate("/map")}
            >
              <MapPin className="w-5 h-5" />
              부스 배치도 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex gap-4 justify-center">
          <Button
            variant={activeTab === "booths" ? "default" : "outline"}
            className={activeTab === "booths" ? "bg-pink-500 hover:bg-pink-600" : "border-pink-300 text-pink-600 hover:bg-pink-50"}
            onClick={() => setActiveTab("booths")}
          >
            체험 부스
          </Button>
          <Button
            variant={activeTab === "exhibitions" ? "default" : "outline"}
            className={activeTab === "exhibitions" ? "bg-pink-500 hover:bg-pink-600" : "border-pink-300 text-pink-600 hover:bg-pink-50"}
            onClick={() => setActiveTab("exhibitions")}
          >
            전시 마당
          </Button>
        </div>
      </div>

      {/* Booths Section */}
      {activeTab === "booths" && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">체험 부스</h2>
            <p className="text-lg text-gray-600">사랑을 체험하고 느끼는 특별한 공간들</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {booths.map((booth, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur border-pink-100"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 group-hover:scale-110 transition-transform">
                      {booth.icon}
                    </div>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <CardTitle className="text-xl">{booth.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-500">{booth.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-pink-600 mb-2">{booth.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{booth.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Exhibitions Section */}
      {activeTab === "exhibitions" && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">전시 마당</h2>
            <p className="text-lg text-gray-600">사랑을 표현하고 감상하는 예술의 공간</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((exhibition, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur border-purple-100"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 group-hover:scale-110 transition-transform">
                      {exhibition.icon}
                    </div>
                    <Sparkles className="w-4 h-4 text-pink-400 fill-pink-400" />
                  </div>
                  <CardTitle className="text-xl">{exhibition.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-500">{exhibition.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-purple-600 mb-2">{exhibition.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{exhibition.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Quote Section */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Heart className="w-12 h-12 mx-auto mb-6 text-pink-500 fill-pink-500 animate-pulse" />
          <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-800 mb-4">
            "사랑이 있는 곳엔 늘 축제가 있다."
          </blockquote>
          <p className="text-gray-600">2025 성덕제에서 사랑의 모든 순간을 만나보세요</p>
        </div>
      </section>

      <Navigation />
    </div>
  );
};

export default Festival;

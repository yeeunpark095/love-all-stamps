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
      tagline: "사람을 찾아 사랑을 전하라!",
      description: "주제별 미션카드로 친구를 찾아오는 미션형 게임. 성덕제를 누비며 숨겨진 친구들을 발견하고 사랑의 메시지를 전달하세요."
    },
    {
      name: "KIKKER",
      subtitle: "International Exchange Club",
      icon: <Plane className="w-6 h-6" />,
      tagline: "전 세계로 사랑을 전하는 KIKKER 항공, 지금 탑승하세요!",
      description: "세계 각국의 문화를 체험하고 국경을 넘어 사랑을 나누는 특별한 여행. 글로벌 친구들과 소통하며 넓은 세상을 만나보세요."
    },
    {
      name: "BUKU",
      subtitle: "Book Talk Club",
      icon: <BookOpen className="w-6 h-6" />,
      tagline: "연애 MBTI 테스트, 운세 카페, 북클립 만들기!",
      description: "감성과 사랑이 만나는 독서 체험존. 연애 성향을 알아보고, 오늘의 운세를 확인하며, 나만의 북클립을 제작해보세요."
    },
    {
      name: "STEAM 사회참여반",
      subtitle: "Social Participation Club",
      icon: <Flame className="w-6 h-6" />,
      tagline: "전남친 토스트로 사랑의 단맛과 매운맛을!",
      description: "달콤하고 매콤한 '전남친 토스트' 간식 부스. 사랑의 다양한 맛을 느끼며 웃음과 추억을 만들어가세요."
    },
    {
      name: "디자인공예반",
      subtitle: "Design & Craft Club",
      icon: <Gift className="w-6 h-6" />,
      tagline: "내가 사랑한 것을 담은 나만의 굿즈 제작",
      description: "'내가 사랑한 것'을 주제로 세상에 단 하나뿐인 굿즈를 만들어보세요. 당신의 사랑을 형태로 담아가세요."
    },
    {
      name: "슬램덩크",
      subtitle: "Basketball Club",
      icon: <CircleDot className="w-6 h-6" />,
      tagline: "커플 슛 챌린지! 성공 개수만큼 상품은 짝꿍에게",
      description: "함께하는 순간이 더 빛나는 커플 슛 게임. 농구로 사랑을 증명하고 파트너에게 특별한 선물을 선사하세요."
    },
    {
      name: "AI·SW 코딩반",
      subtitle: "Coding Club",
      icon: <Bot className="w-6 h-6" />,
      tagline: "햄스터봇 축구, 아두이노 뽑기",
      description: "과학과 사랑의 융합 체험! 귀여운 햄스터봇과 함께하는 축구 게임과 아두이노 뽑기로 재미와 배움을 동시에."
    },
    {
      name: "솔리언",
      subtitle: "Peer Counseling",
      icon: <Heart className="w-6 h-6" />,
      tagline: "마음을 나누는 또래상담",
      description: "서로의 마음을 이해하고 공감하는 시간. 친구와 함께 사랑과 우정에 대해 이야기 나눠보세요."
    },
    {
      name: "애드미찬양반",
      subtitle: "Worship Team",
      icon: <Music className="w-6 h-6" />,
      tagline: "찬양으로 전하는 사랑의 메시지",
      description: "아름다운 찬양과 음악으로 사랑을 표현하는 특별한 공연. 감동적인 하모니를 경험하세요."
    },
    {
      name: "빅데이터투인사이트",
      subtitle: "Big Data Club",
      icon: <School className="w-6 h-6" />,
      tagline: "데이터로 읽는 사랑의 패턴",
      description: "빅데이터를 통해 발견하는 사랑의 흥미로운 인사이트. 숫자 속에 숨겨진 감성을 만나보세요."
    },
    {
      name: "한걸음",
      subtitle: "Volunteer Club",
      icon: <Users className="w-6 h-6" />,
      tagline: "나눔으로 실천하는 사랑",
      description: "작은 발걸음이 모여 큰 사랑이 되는 곳. 함께 만드는 따뜻한 세상을 경험하세요."
    },
    {
      name: "축구반",
      subtitle: "Soccer Club",
      icon: <Target className="w-6 h-6" />,
      tagline: "팀워크로 완성하는 사랑의 골",
      description: "함께 뛰고 함께 웃는 축구의 즐거움. 운동으로 하나되는 팀워크의 사랑을 느껴보세요."
    },
    {
      name: "Ballin",
      subtitle: "Basketball Club",
      icon: <CircleDot className="w-6 h-6" />,
      tagline: "농구로 연결되는 우정과 사랑",
      description: "코트 위에서 펼쳐지는 열정과 우정. 공을 주고받으며 마음도 나눠보세요."
    }
  ];

  const exhibitions = [
    {
      name: "ARTY 미술반",
      subtitle: "Art Club",
      icon: <Palette className="w-6 h-6" />,
      tagline: "그림으로 표현하는 사랑",
      description: "단체작 '사랑' 전시와 함께 페이스페인팅, 쥬얼리 메이크업 체험. 예술로 아름다움을 완성하세요."
    },
    {
      name: "뮤지컬반",
      subtitle: "Musical Club",
      icon: <Theater className="w-6 h-6" />,
      tagline: "뮤지컬로 만나는 설레는 학창시절",
      description: "무대 위에서 펼쳐지는 청춘과 사랑의 이야기. 감동적인 공연으로 여러분을 초대합니다."
    },
    {
      name: "친환경연구반",
      subtitle: "Eco Club",
      icon: <Leaf className="w-6 h-6" />,
      tagline: "지구를 사랑하는 방법",
      description: "갤럭시 에이드와 친환경 키링 만들기. 환경을 생각하는 작은 실천이 지구를 향한 큰 사랑입니다."
    },
    {
      name: "Be Creator",
      subtitle: "Festival Planning Team",
      icon: <Sparkles className="w-6 h-6" />,
      tagline: "축제를 사랑으로 만드는 사람들",
      description: "성덕제 기획과정을 소개하는 전시. 축제를 준비한 사람들의 열정과 사랑의 이야기를 만나보세요."
    },
    {
      name: "사진반",
      subtitle: "Photography Club",
      icon: <Camera className="w-6 h-6" />,
      tagline: "렌즈에 담긴 사랑의 순간들",
      description: "카메라로 포착한 아름다운 순간들. 사진 속에 영원히 남을 추억을 만들어보세요."
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

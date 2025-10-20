import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Search } from "lucide-react";
import boothMapImage from "@/assets/booth-map.jpg";

type BoothCategory = "체험" | "전시" | "공연" | "체육";

interface Booth {
  booth_id: number;
  name: string;
  location: string;
  description?: string;
  teacher?: string;
  category?: BoothCategory;
}

const categoryColors: Record<BoothCategory, string> = {
  "체험": "bg-category-experience",
  "전시": "bg-category-exhibition",
  "공연": "bg-category-performance",
  "체육": "bg-category-sports",
};

export default function Map() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("booths_public")
        .select("*")
        .order("booth_id");
      setBooths(data || []);
    };

    checkAuth();
  }, [navigate]);

  const filteredBooths = booths.filter(booth => 
    booth.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 본관 부스 (1-15)
  const mainBooths = filteredBooths.filter(b => b.booth_id >= 1 && b.booth_id <= 15);
  
  // 본관 배치 - 새로운 레이아웃
  const topRow = [8, 9, 10, 11, 12].map(id => mainBooths.find(b => b.booth_id === id)).filter(Boolean) as Booth[]; // 최상단: 빅데이터투인사이트 ~ 한걸음
  const middleRow = [1, 2, 3, 4, 5, 6].map(id => mainBooths.find(b => b.booth_id === id)).filter(Boolean) as Booth[]; // 중간: 영어토론프레젠테이션 ~ 솔리언
  const centerBooth = mainBooths.find(b => b.booth_id === 7); // 중앙: 애드미찬양반
  const sportsBooths = [
    { booth: mainBooths.find(b => b.booth_id === 13), emoji: "🏀" }, // 슬램덩크
    { booth: mainBooths.find(b => b.booth_id === 14), emoji: "🏐" }, // Ballin
    { booth: mainBooths.find(b => b.booth_id === 15), emoji: "⚽" }  // 축구반
  ].filter(item => item.booth) as { booth: Booth; emoji: string }[];

  // 서관 부스 구조
  const seogwanFloors = [
    {
      floor: "1F",
      bg: "bg-[#D8ECFF]",
      rooms: [
        { location: "미술1실", name: "융합과학STEAM주제연구반", booth_id: 16 },
        { location: "미술2실", name: "수달(수학의달인)", booth_id: 17 },
        { location: "융합과학실", name: "AI, SW 코딩반", booth_id: 18 }
      ]
    },
    {
      floor: "2F",
      bg: "bg-[#E4D4FF]",
      rooms: [
        { location: "과학1실", name: "물리를 만들다", booth_id: 19 },
        { location: "과학2실", name: "디자인공예반", booth_id: 20 },
        { location: "과학3실", name: "융합과학STEAM주제연구반", booth_id: 21 }
      ]
    },
    {
      floor: "3F",
      bg: "bg-[#D8ECFF]",
      rooms: [
        { location: "늘품관", name: "BUKU(독서토론반)", booth_id: 22 }
      ]
    }
  ];

  const BoothCard = ({ booth, emoji = "🎪" }: { booth: Booth; emoji?: string }) => {
    const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
    const categoryColor = booth.category ? categoryColors[booth.category] : "bg-white";
    
    return (
      <div
        onClick={() => setSelectedBooth(booth)}
        className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
      >
        {/* 원형 부스 마커 */}
        <div className={`${categoryColor} relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:shadow-xl transition-all`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
          <span className="text-2xl relative z-10">{emoji}</span>
        </div>
        {/* 부스명 - 도형 밖 */}
        <div className="text-[10px] font-semibold text-center leading-tight text-foreground w-[70px]">
          {cleanName}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#FFC9DE] to-[#CFE9FF] border-b-2 border-[#444444] p-6 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <span className="text-3xl">🏫</span>
          <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            부스 배치도
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Original Map Image */}
        <Card className="overflow-hidden border-2 border-[#444444] rounded-2xl bg-card">
          <div className="relative bg-white p-4">
            <img
              src={boothMapImage}
              alt="부스 배치도"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="p-4 border-2 border-[#999999] rounded-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="부스명으로 찾아보기..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-sm border-[1.5px] border-[#999999] rounded-lg"
            />
          </div>
        </Card>

        {/* Main Layout: 본관 위, 서관 아래 */}
        <div className="space-y-6">
          {/* ① 본관 구역 - 넓게 */}
          <Card className="p-6 border-2 border-[#444444] rounded-2xl bg-white">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-[#FFC9DE] to-[#CFE9FF] rounded-full px-5 py-2 mb-1">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  🏫 본관 구역
                </h2>
              </div>
              <p className="text-sm text-muted-foreground font-medium">성덕고등학교 본관 앞 운동장</p>
            </div>

            {/* Playground Layout - 더 크게 */}
            <div className="relative bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] rounded-2xl border-2 border-[#999999] p-12 min-h-[700px]">
              {/* 입구 표시 */}
              <div className="absolute top-4 left-4 flex items-center gap-1">
                <span className="text-xl">🚪</span>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-[#999999]">입구</span>
                <span className="text-sm">➡️</span>
              </div>

              {/* 오른쪽 사이드 - 체육 부스 (13-15) 세로 배치, 더 오른쪽으로 */}
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 space-y-16">
                {sportsBooths.map(({ booth, emoji }) => (
                  <BoothCard key={booth.booth_id} booth={booth} emoji={emoji} />
                ))}
              </div>

              {/* 1번줄 - 최상단 (8-12): 빅데이터투인사이트 ~ 한걸음 */}
              <div className="mb-20 mt-16">
                <div className="flex justify-center gap-10 max-w-[65%] mx-auto">
                  {topRow.map((booth) => (
                    <BoothCard key={booth.booth_id} booth={booth} emoji="🎪" />
                  ))}
                </div>
              </div>

              {/* 2번줄 - 중간 (1-6 + 애드미찬양반): 영어토론프레젠테이션 ~ 솔리언 + 애드미찬양반(중앙) */}
              <div className="mb-20">
                <div className="flex justify-center items-start gap-8 max-w-[75%] mx-auto">
                  {middleRow.slice(0, 3).map((booth) => (
                    <BoothCard key={booth.booth_id} booth={booth} emoji="🎪" />
                  ))}
                  {/* 애드미찬양반 중앙 배치 */}
                  {centerBooth && (
                    <BoothCard booth={centerBooth} emoji="🎤" />
                  )}
                  {middleRow.slice(3).map((booth) => (
                    <BoothCard key={booth.booth_id} booth={booth} emoji="🎪" />
                  ))}
                </div>
              </div>

              {/* Building label - 맨 아래 */}
              <div className="text-center mt-12">
                <div className="inline-block bg-foreground text-white px-6 py-2 rounded-lg font-semibold text-sm">
                  성덕고등학교 본관
                </div>
              </div>
            </div>
          </Card>

          {/* ② 서관 ZONE - 본관 아래 */}
          <Card className="p-6 border-2 border-[#444444] rounded-2xl bg-white max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-r from-[#FFC9DE] to-[#CFE9FF] rounded-full px-5 py-2 mb-1">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  🏢 서관 ZONE
                </h2>
              </div>
              <p className="text-sm text-muted-foreground font-medium">건물 내부 전시형 부스</p>
            </div>

            <div className="space-y-3">
              {seogwanFloors.map((floorData, idx) => (
                <div key={floorData.floor}>
                  <div className="bg-gradient-to-r from-[#4A5568] to-[#2D3748] border-[1.5px] border-[#444444] rounded-lg px-3 py-2 mb-2">
                    <h3 className="text-[15px] font-bold text-white">{floorData.floor}</h3>
                  </div>
                  <div className="space-y-2">
                    {floorData.rooms.map((room, roomIdx) => (
                      <div
                        key={`${floorData.floor}-${roomIdx}`}
                        onClick={() => room.booth_id && setSelectedBooth(booths.find(b => b.booth_id === room.booth_id) || null)}
                        className={`${floorData.bg} rounded-lg border-[1.5px] border-[#999999] p-3 h-[60px] flex items-center justify-between ${
                          room.booth_id ? 'cursor-pointer hover:shadow-md transition-all' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-bold text-[15px] text-foreground">{room.location}</div>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-[13px] text-muted-foreground">{room.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {filteredBooths.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            검색 결과가 없습니다
          </p>
        )}
      </div>

      {/* 부스 상세 정보 다이얼로그 */}
      <Dialog open={!!selectedBooth} onOpenChange={() => setSelectedBooth(null)}>
        <DialogContent className="max-w-md border-2 border-[#444444] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">🏕️</span>
              {selectedBooth?.name?.replace(/^\d+\.\s*/, '')}
            </DialogTitle>
          </DialogHeader>
          {selectedBooth && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-[1.5px] border-[#999999]">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-bold">
                  {selectedBooth.booth_id}
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">부스 번호</p>
                  <p className="font-semibold text-sm">#{selectedBooth.booth_id}</p>
                </div>
              </div>

              {selectedBooth.category && (
                <div className={`p-2.5 ${categoryColors[selectedBooth.category]} rounded-lg border-[1.5px] border-[#999999]`}>
                  <p className="text-xs text-muted-foreground">카테고리</p>
                  <p className="font-semibold text-sm">{selectedBooth.category}</p>
                </div>
              )}

              {selectedBooth.description && (
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm">체험 내용</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border-[1.5px] border-[#999999]">
                    {selectedBooth.description}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 bg-secondary/20 rounded-lg border-[1.5px] border-[#999999]">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">위치</p>
                    <p className="font-medium text-sm">{selectedBooth.location}</p>
                  </div>
                </div>
                
                {selectedBooth.teacher && (
                  <div className="flex items-center gap-2 p-2.5 bg-accent/20 rounded-lg border-[1.5px] border-[#999999]">
                    <span className="text-lg">👨‍🏫</span>
                    <div>
                      <p className="text-xs text-muted-foreground">담당 교사</p>
                      <p className="font-medium text-sm">{selectedBooth.teacher} 선생님</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
import boothMapImage from "@/assets/booth-map.jpg";

export default function Map() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<any>(null);

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
  const topRow = mainBooths.filter(b => b.booth_id >= 8 && b.booth_id <= 15);
  const bottomRow = mainBooths.filter(b => b.booth_id >= 1 && b.booth_id <= 7);

  // 서관 부스 (16-22)
  const seogwanBooths = filteredBooths.filter(b => b.booth_id >= 16 && b.booth_id <= 22);
  const floor1 = seogwanBooths.filter(b => b.booth_id >= 16 && b.booth_id <= 18);
  const floor2 = seogwanBooths.filter(b => b.booth_id >= 19 && b.booth_id <= 21);
  const floor3 = seogwanBooths.filter(b => b.booth_id === 22);

  // 부스 위치 좌표 (이미지 기준 %, 실제 배치도에 맞게 조정 필요)
  const boothPositions: Record<number, { x: number; y: number }> = {
    // 앞줄 (1-6)
    1: { x: 15, y: 65 },
    2: { x: 25, y: 65 },
    3: { x: 35, y: 65 },
    4: { x: 45, y: 65 },
    5: { x: 55, y: 65 },
    6: { x: 65, y: 65 },
    // 구령대 (7)
    7: { x: 50, y: 50 },
    // 윗줄 (8-12)
    8: { x: 20, y: 35 },
    9: { x: 30, y: 35 },
    10: { x: 40, y: 35 },
    11: { x: 50, y: 35 },
    12: { x: 60, y: 35 },
    // 사이드 (13-15)
    13: { x: 80, y: 60 },
    14: { x: 80, y: 50 },
    15: { x: 80, y: 40 },
  };

  const BoothCard = ({ booth }: { booth: any }) => {
    const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
    return (
      <div
        onClick={() => setSelectedBooth(booth)}
        className="bg-white rounded-xl border-2 border-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
      >
        <div className="text-xs font-bold text-center leading-tight text-foreground">
          {cleanName}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header Banner */}
      <div className="relative bg-festival-pink border-b-4 border-foreground p-8 text-center shadow-lg">
        <div className="max-w-6xl mx-auto">
          {/* Character illustrations */}
          <div className="absolute left-4 top-4 text-4xl">
            🐰
            <div className="mt-1 bg-white rounded-full px-3 py-1 border-2 border-foreground text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              똑똑~!
            </div>
          </div>
          <div className="absolute right-4 top-4 text-4xl">
            🐻
            <div className="mt-1 bg-white rounded-full px-3 py-1 border-2 border-foreground text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              체험부스 참여!
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-foreground mb-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
            🏫 성덕고등학교 부스배치도
          </h1>
          <p className="text-sm font-bold text-foreground/80">축제 체험부스 위치 안내</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Interactive Map Viewer with Clickable Booths */}
        <Card className="overflow-hidden shadow-xl border-4 border-foreground bg-card">
          <div className="bg-festival-pink/20 p-3 border-b-2 border-foreground">
            <p className="text-sm font-bold text-center text-foreground">
              💡 이미지를 확대하고 부스를 클릭해보세요!
            </p>
          </div>
          <div className="relative bg-white">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <Button
                      onClick={() => zoomIn()}
                      size="icon"
                      className="bg-white border-2 border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => zoomOut()}
                      size="icon"
                      className="bg-white border-2 border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => resetTransform()}
                      size="icon"
                      className="bg-white border-2 border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "600px",
                    }}
                  >
                    <div className="relative w-full h-[600px]">
                      {/* Background Image */}
                      <img
                        src={boothMapImage}
                        alt="부스 배치도"
                        className="w-full h-full object-contain"
                      />

                      {/* Clickable Booth Markers (본관 부스만) */}
                      {mainBooths.map((booth) => {
                        const position = boothPositions[booth.booth_id];
                        if (!position) return null;

                        const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;

                        return (
                          <div
                            key={booth.booth_id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooth(booth);
                            }}
                            className="absolute cursor-pointer group"
                            style={{
                              left: `${position.x}%`,
                              top: `${position.y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            {/* Pulsing marker */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                              <div className="relative w-10 h-10 bg-primary rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform">
                                <span className="text-white font-bold text-sm">
                                  {booth.booth_id}
                                </span>
                              </div>
                            </div>

                            {/* Tooltip on hover */}
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              <div className="bg-foreground text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border-2 border-white">
                                {cleanName}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-foreground">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="부스명으로 찾아보기..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-2 border-foreground"
            />
          </div>
        </Card>

        {/* Main Layout: 본관 + 서관 */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          {/* ① 본관 구역 */}
          <Card className="p-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)] border-4 border-foreground bg-white">
            <div className="mb-6 text-center">
              <div className="inline-block bg-festival-mint rounded-full px-6 py-3 border-3 border-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  🏟️ 본관 구역
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-bold">성덕고등학교 본관 앞 운동장</p>
            </div>

            {/* Playground Layout */}
            <div className="relative bg-festival-mint/30 rounded-2xl border-4 border-foreground p-6 min-h-[500px]">
              {/* Entrance marker */}
              <div className="absolute top-4 left-4 text-2xl">
                🚪
                <div className="text-xs font-bold bg-white px-2 py-1 rounded border-2 border-foreground mt-1">입구</div>
              </div>

              {/* 윗줄 (8-15) */}
              <div className="mb-8 mt-12">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {topRow.map((booth) => (
                    <BoothCard key={booth.booth_id} booth={booth} />
                  ))}
                </div>
              </div>

              {/* 아랫줄 (1-7) */}
              <div className="mb-6">
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {bottomRow.map((booth) => (
                    <BoothCard key={booth.booth_id} booth={booth} />
                  ))}
                </div>
              </div>

              {/* Building label */}
              <div className="text-center mt-8">
                <div className="inline-block bg-foreground text-white px-8 py-3 rounded-lg border-2 border-foreground font-bold text-lg shadow-[3px_3px_0_0_rgba(255,105,180,0.5)]">
                  성덕고등학교 본관
                </div>
              </div>
            </div>
          </Card>

          {/* ② 서관존 */}
          <Card className="p-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)] border-4 border-foreground bg-white">
            <div className="mb-6 text-center">
              <div className="inline-block bg-festival-purple rounded-full px-6 py-3 border-3 border-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  🏢 서관 ZONE
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-bold">건물 내부 전시형 부스</p>
            </div>

            <div className="space-y-4">
              {/* 1층 */}
              <div>
                <div className="bg-festival-sky border-2 border-foreground rounded-lg px-4 py-2 mb-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-extrabold text-foreground">1F</h3>
                </div>
                <div className="space-y-2">
                  {floor1.map((booth) => (
                    <div
                      key={booth.booth_id}
                      onClick={() => setSelectedBooth(booth)}
                      className="bg-festival-sky/40 rounded-lg border-2 border-foreground p-3 cursor-pointer hover:bg-festival-sky/60 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    >
                      <div className="font-bold text-sm text-foreground">{booth.location}</div>
                      <div className="text-xs text-foreground/70 mt-1">
                        {booth.name?.replace(/^\d+\.\s*/, '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2층 */}
              <div>
                <div className="bg-festival-purple border-2 border-foreground rounded-lg px-4 py-2 mb-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-extrabold text-foreground">2F</h3>
                </div>
                <div className="space-y-2">
                  {floor2.map((booth) => (
                    <div
                      key={booth.booth_id}
                      onClick={() => setSelectedBooth(booth)}
                      className="bg-festival-purple/40 rounded-lg border-2 border-foreground p-3 cursor-pointer hover:bg-festival-purple/60 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    >
                      <div className="font-bold text-sm text-foreground">{booth.location}</div>
                      <div className="text-xs text-foreground/70 mt-1">
                        {booth.name?.replace(/^\d+\.\s*/, '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3층 */}
              <div>
                <div className="bg-festival-sky border-2 border-foreground rounded-lg px-4 py-2 mb-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-extrabold text-foreground">3F</h3>
                </div>
                <div className="space-y-2">
                  {floor3.map((booth) => (
                    <div
                      key={booth.booth_id}
                      onClick={() => setSelectedBooth(booth)}
                      className="bg-festival-sky/40 rounded-lg border-2 border-foreground p-3 cursor-pointer hover:bg-festival-sky/60 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    >
                      <div className="font-bold text-sm text-foreground">{booth.location}</div>
                      <div className="text-xs text-foreground/70 mt-1">
                        {booth.name?.replace(/^\d+\.\s*/, '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        <DialogContent className="max-w-md border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">🏕️</span>
              {selectedBooth?.name?.replace(/^\d+\.\s*/, '')}
            </DialogTitle>
          </DialogHeader>
          {selectedBooth && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-foreground">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-base font-bold shadow-md border-2 border-foreground">
                  {selectedBooth.booth_id}
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">부스 번호</p>
                  <p className="font-bold">#{selectedBooth.booth_id}</p>
                </div>
              </div>

              {selectedBooth.description && (
                <div className="space-y-2">
                  <h4 className="font-bold text-base">체험 내용</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border-2 border-foreground">
                    {selectedBooth.description}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border-2 border-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">위치</p>
                    <p className="font-medium text-sm">{selectedBooth.location}</p>
                  </div>
                </div>
                
                {selectedBooth.teacher && (
                  <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg border-2 border-foreground">
                    <span className="text-xl">👨‍🏫</span>
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

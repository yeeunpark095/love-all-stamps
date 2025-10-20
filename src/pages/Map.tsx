import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Search } from "lucide-react";
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

  // 구역별로 부스 분류
  const getBoothsByZone = () => {
    return {
      front: filteredBooths.filter(b => b.booth_id >= 1 && b.booth_id <= 6),
      second: filteredBooths.filter(b => b.booth_id === 7),
      third: filteredBooths.filter(b => b.booth_id >= 8 && b.booth_id <= 12),
      side: filteredBooths.filter(b => b.booth_id >= 13 && b.booth_id <= 15),
      seogwan: filteredBooths.filter(b => b.booth_id >= 16 && b.booth_id <= 22),
    };
  };

  const zones = getBoothsByZone();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">체험부스 배치도</h1>
        <p className="text-white/90 text-sm">배치도를 확인하고 부스를 찾아보세요</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Map Viewer */}
        <Card className="overflow-hidden shadow-xl border-2 border-primary/20 bg-card">
          <div className="relative bg-white p-4">
            <img
              src={boothMapImage}
              alt="부스 배치도"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="p-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="부스명으로 찾아보기..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </Card>

        {/* Visual Booth Layout */}
        <Card className="p-8 shadow-lg bg-gradient-to-br from-card to-card/80">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            부스 배치도
          </h2>
          
          <div className="relative min-h-[700px] bg-muted/20 rounded-lg p-8">
            {/* 세번째 줄 (8-12) - 화면 위쪽 */}
            <div className="flex justify-center gap-3 mb-16 mt-8 relative">
              {zones.third.map((booth) => {
                const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                return (
                  <div
                    key={booth.booth_id}
                    className="cursor-pointer hover:scale-110 transition-all duration-300 group"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className="relative w-28 h-28">
                      <div className="w-full h-full bg-gradient-to-br from-accent/90 to-primary/90 shadow-xl flex flex-col items-center justify-center p-3 group-hover:shadow-2xl group-hover:from-accent group-hover:to-primary" style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}>
                        <div className="w-7 h-7 rounded-full bg-white text-accent text-xs font-bold flex items-center justify-center mb-2 shadow-md">
                          {booth.booth_id}
                        </div>
                        <p className="text-sm text-[#333] font-bold text-center leading-tight bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
                          {cleanName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 오른쪽 사이드 (13-15) - 위에서 아래로 15, 14, 13 */}
              <div className="absolute right-8 top-0 flex flex-col gap-3">
                {zones.side.slice().reverse().map((booth) => {
                  const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                  return (
                    <div
                      key={booth.booth_id}
                      className="cursor-pointer hover:scale-110 transition-all duration-300 group"
                      onClick={() => setSelectedBooth(booth)}
                    >
                      <div className="relative w-24 h-24">
                        <div className="w-full h-full bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl flex flex-col items-center justify-center p-2 group-hover:shadow-2xl group-hover:from-primary group-hover:to-secondary" style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}>
                          <div className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center mb-1.5 shadow-md">
                            {booth.booth_id}
                          </div>
                          <p className="text-xs text-[#333] font-bold text-center leading-tight bg-white/95 px-2 py-1 rounded-lg shadow-sm">
                            {cleanName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 두번째 줄 (7) - 중앙 구령대 */}
            <div className="flex justify-center mb-16">
              {zones.second.map((booth) => {
                const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                return (
                  <div
                    key={booth.booth_id}
                    className="cursor-pointer hover:scale-110 transition-all duration-300 group"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className="relative w-28 h-28">
                      <div className="w-full h-full bg-gradient-to-br from-secondary/90 via-accent/90 to-primary/90 shadow-xl flex flex-col items-center justify-center p-3 group-hover:shadow-2xl group-hover:from-secondary group-hover:to-primary" style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}>
                        <div className="w-7 h-7 rounded-full bg-white text-secondary text-xs font-bold flex items-center justify-center mb-2 shadow-md">
                          {booth.booth_id}
                        </div>
                        <p className="text-sm text-[#333] font-bold text-center leading-tight bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
                          {cleanName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 앞줄 (1-6) - 화면 아래쪽 */}
            <div className="flex justify-center gap-3 mb-8">
              {zones.front.map((booth) => {
                const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                return (
                  <div
                    key={booth.booth_id}
                    className="cursor-pointer hover:scale-110 transition-all duration-300 group"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className="relative w-28 h-28">
                      <div className="w-full h-full bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl flex flex-col items-center justify-center p-3 group-hover:shadow-2xl group-hover:from-primary group-hover:to-secondary" style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}>
                        <div className="w-7 h-7 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center mb-2 shadow-md">
                          {booth.booth_id}
                        </div>
                        <p className="text-sm text-[#333] font-bold text-center leading-tight bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
                          {cleanName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {filteredBooths.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              검색 결과가 없습니다
            </p>
          )}
        </Card>

        {/* 서관 코너 - 별도 섹션 */}
        <Card className="p-8 shadow-lg bg-gradient-to-br from-card to-card/80">
          <div className="text-center mb-6">
            <div className="inline-block bg-secondary/20 backdrop-blur-sm px-8 py-3 rounded-full mb-2">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <MapPin className="w-7 h-7 text-secondary" />
                서관 Zone
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">서관 특별 체험 부스</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 p-6 bg-muted/20 rounded-lg">
            {zones.seogwan.map((booth) => {
              const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
              return (
                <div
                  key={booth.booth_id}
                  className="cursor-pointer hover:scale-110 transition-all duration-300 group"
                  onClick={() => setSelectedBooth(booth)}
                >
                  <div className="relative w-28 h-28">
                    <div className="w-full h-full bg-gradient-to-br from-secondary/90 to-accent/90 shadow-xl flex flex-col items-center justify-center p-3 group-hover:shadow-2xl group-hover:from-secondary group-hover:to-accent" style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}>
                      <div className="w-7 h-7 rounded-full bg-white text-secondary text-xs font-bold flex items-center justify-center mb-2 shadow-md">
                        {booth.booth_id}
                      </div>
                      <p className="text-sm text-[#333] font-bold text-center leading-tight bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
                        {cleanName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 부스 상세 정보 다이얼로그 */}
      <Dialog open={!!selectedBooth} onOpenChange={() => setSelectedBooth(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">🏕️</span>
              {selectedBooth?.name?.replace(/^\d+\.\s*/, '')}
            </DialogTitle>
          </DialogHeader>
          {selectedBooth && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-base font-bold shadow-md">
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
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg">
                    {selectedBooth.description}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">위치</p>
                    <p className="font-medium text-sm">{selectedBooth.location}</p>
                  </div>
                </div>
                
                {selectedBooth.teacher && (
                  <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
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

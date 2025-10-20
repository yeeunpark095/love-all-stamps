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
      other: filteredBooths.filter(b => b.booth_id >= 16 && b.booth_id <= 22),
    };
  };

  const zones = getBoothsByZone();
  const zoneLabels = {
    front: "앞줄 (1-6)",
    second: "두번째 줄 (7)",
    third: "세번째 줄 (8-12)",
    side: "오른쪽 사이드 (13-15)",
    other: "기타 (16-22)"
  };

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
          
          <div className="relative min-h-[600px] bg-muted/20 rounded-lg p-6">
            {/* 앞줄 (1-6) */}
            <div className="flex justify-center gap-4 mb-8">
              {zones.front.map((booth) => {
                const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                return (
                  <div
                    key={booth.booth_id}
                    className="cursor-pointer hover:scale-110 transition-all group"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className="w-24 h-28 relative">
                      {/* 천막 */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-t-[24px] border-t-primary"></div>
                      <div className="absolute top-6 w-full h-20 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-lg shadow-lg flex flex-col items-center justify-center p-2 group-hover:shadow-xl">
                        <div className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center mb-1">
                          {booth.booth_id}
                        </div>
                        <p className="text-[10px] text-white font-bold text-center leading-tight line-clamp-2">
                          {cleanName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 두번째 줄 (7) */}
            <div className="flex justify-center mb-8">
              {zones.second.map((booth) => {
                const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                return (
                  <div
                    key={booth.booth_id}
                    className="cursor-pointer hover:scale-110 transition-all group"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className="w-24 h-28 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-t-[24px] border-t-secondary"></div>
                      <div className="absolute top-6 w-full h-20 bg-gradient-to-br from-secondary/80 to-accent/80 rounded-lg shadow-lg flex flex-col items-center justify-center p-2 group-hover:shadow-xl">
                        <div className="w-6 h-6 rounded-full bg-white text-secondary text-xs font-bold flex items-center justify-center mb-1">
                          {booth.booth_id}
                        </div>
                        <p className="text-[10px] text-white font-bold text-center leading-tight line-clamp-2">
                          {cleanName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 세번째 줄 (8-12) */}
            <div className="flex justify-center gap-4 mb-8">
              {zones.third.map((booth) => {
                const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                return (
                  <div
                    key={booth.booth_id}
                    className="cursor-pointer hover:scale-110 transition-all group"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <div className="w-24 h-28 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-t-[24px] border-t-accent"></div>
                      <div className="absolute top-6 w-full h-20 bg-gradient-to-br from-accent/80 to-primary/80 rounded-lg shadow-lg flex flex-col items-center justify-center p-2 group-hover:shadow-xl">
                        <div className="w-6 h-6 rounded-full bg-white text-accent text-xs font-bold flex items-center justify-center mb-1">
                          {booth.booth_id}
                        </div>
                        <p className="text-[10px] text-white font-bold text-center leading-tight line-clamp-2">
                          {cleanName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 오른쪽 사이드와 기타 부스 */}
            <div className="flex justify-between items-start">
              {/* 오른쪽 사이드 (13-15) */}
              <div className="flex flex-col gap-4">
                {zones.side.map((booth) => {
                  const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                  return (
                    <div
                      key={booth.booth_id}
                      className="cursor-pointer hover:scale-110 transition-all group"
                      onClick={() => setSelectedBooth(booth)}
                    >
                      <div className="w-24 h-28 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-t-[24px] border-t-primary"></div>
                        <div className="absolute top-6 w-full h-20 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-lg shadow-lg flex flex-col items-center justify-center p-2 group-hover:shadow-xl">
                          <div className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center mb-1">
                            {booth.booth_id}
                          </div>
                          <p className="text-[10px] text-white font-bold text-center leading-tight line-clamp-2">
                            {cleanName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 기타 부스 (16-22) */}
              <div className="flex flex-wrap gap-4 justify-end max-w-md">
                {zones.other.map((booth) => {
                  const cleanName = booth.name?.replace(/^\d+\.\s*/, '') || booth.name;
                  return (
                    <div
                      key={booth.booth_id}
                      className="cursor-pointer hover:scale-110 transition-all group"
                      onClick={() => setSelectedBooth(booth)}
                    >
                      <div className="w-24 h-28 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-t-[24px] border-t-secondary"></div>
                        <div className="absolute top-6 w-full h-20 bg-gradient-to-br from-secondary/80 to-accent/80 rounded-lg shadow-lg flex flex-col items-center justify-center p-2 group-hover:shadow-xl">
                          <div className="w-6 h-6 rounded-full bg-white text-secondary text-xs font-bold flex items-center justify-center mb-1">
                            {booth.booth_id}
                          </div>
                          <p className="text-[10px] text-white font-bold text-center leading-tight line-clamp-2">
                            {cleanName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {filteredBooths.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              검색 결과가 없습니다
            </p>
          )}
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

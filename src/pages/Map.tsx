import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import boothMapImage from "@/assets/booth-map.jpg";

export default function Map() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState<any[]>([]);

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


  // 배치도 순서대로 부스 정리
  const boothOrder = [
    "빅데이터투인사이트", "ARTY 미술반", "BUKU (독서토론반)", "빛글 (학생기자반)", 
    "한걸음", "애드미찬양반", "영어토론 프레젠테이션", "KIKKER (국제교류반)",
    "STEAM 사회참여반", "학생회", "랩퀘스트 (LabQuest)", "솔리언 (또래상담반)",
    "축구반", "Ballin (배구동아리)", "슬램덩크 (농구동아리)"
  ];

  const orderedBooths = boothOrder.map(name => 
    booths.find(b => b.name === name)
  ).filter(Boolean);

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

        {/* Booth List */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            전체 부스 목록
          </h2>
          <div className="grid gap-3">
            {orderedBooths.map((booth) => (
              <Card
                key={booth.booth_id}
                className="p-4 hover:shadow-md transition-all hover:border-primary/30 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-bold">
                        {booth.booth_id}
                      </span>
                      <h3 className="font-bold text-lg">{booth.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{booth.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-secondary/30 rounded-full">
                        📍 {booth.location}
                      </span>
                      {booth.teacher && (
                        <span className="px-2 py-1 bg-accent/30 rounded-full">
                          👨‍🏫 {booth.teacher} 선생님
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
}

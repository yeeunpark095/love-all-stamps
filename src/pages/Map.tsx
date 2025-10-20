import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, ZoomIn } from "lucide-react";
import boothMapImage from "@/assets/booth-map.jpg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function Map() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">체험부스 배치도</h1>
        <p className="text-white/90 text-sm">배치도를 확인하고 부스를 찾아보세요</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Map Viewer with Zoom */}
        <Card className="overflow-hidden shadow-xl border-2 border-primary/20 bg-card">
          <div className="p-2 bg-muted/30 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ZoomIn className="w-4 h-4" />
            <span>이미지를 클릭하여 확대/축소할 수 있습니다</span>
          </div>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            centerOnInit
          >
            <TransformComponent wrapperClass="!w-full !h-auto">
              <div className="relative bg-white p-4">
                <img
                  src={boothMapImage}
                  alt="부스 배치도"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
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

        {/* Booth List */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-card to-card/80">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            전체 부스 목록
          </h2>
          <div className="grid gap-4">
            {filteredBooths.map((booth) => {
              return (
                <Card
                  key={booth.booth_id}
                  className="p-5 hover:shadow-xl transition-all hover:border-primary/30 cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-base font-bold shadow-md">
                          {booth.booth_id}
                        </span>
                        <h3 className="font-bold text-xl">{booth.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{booth.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1 bg-secondary/20 rounded-full">
                          📍 {booth.location}
                        </span>
                        {booth.teacher && (
                          <span className="px-3 py-1 bg-accent/20 rounded-full">
                            👨‍🏫 {booth.teacher} 선생님
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {filteredBooths.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              검색 결과가 없습니다
            </p>
          )}
        </Card>
      </div>

      <Navigation />
    </div>
  );
}

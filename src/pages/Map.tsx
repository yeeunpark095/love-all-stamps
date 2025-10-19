import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import boothMapImage from "@/assets/booth-map.jpg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
        .from("booths")
        .select("*")
        .order("booth_id");
      setBooths(data || []);
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">체험부스 배치도</h1>
        <p className="text-white/90 text-sm">이미지를 확대/축소/드래그할 수 있습니다</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Map Viewer */}
        <Card className="overflow-hidden shadow-xl border-2 border-primary/20 bg-card">
          <div className="relative h-[60vh] bg-muted">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <Button
                      size="icon"
                      onClick={() => zoomIn()}
                      className="bg-white/90 hover:bg-white text-primary shadow-lg"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => zoomOut()}
                      className="bg-white/90 hover:bg-white text-primary shadow-lg"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => resetTransform()}
                      className="bg-white/90 hover:bg-white text-primary shadow-lg text-xs"
                    >
                      초기화
                    </Button>
                  </div>
                  <TransformComponent
                    wrapperClass="w-full h-full"
                    contentClass="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={boothMapImage}
                      alt="부스 배치도"
                      className="max-w-full max-h-full object-contain"
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </Card>

        {/* Booth List */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            전체 부스 목록
          </h2>
          <div className="grid gap-3">
            {booths.map((booth) => (
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
                          👨‍🏫 {booth.teacher}
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

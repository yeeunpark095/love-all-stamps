import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import boothMapImage from "@/assets/booth-map.jpg";

export default function Map() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  const getBoothCategory = (booth: any) => {
    const desc = booth.description?.toLowerCase() || '';
    if (desc.includes('체험') || desc.includes('만들기')) return 'experience';
    if (desc.includes('간식') || desc.includes('먹을')) return 'food';
    if (desc.includes('게임') || desc.includes('놀이')) return 'game';
    return 'etc';
  };

  const filteredBooths = booths.filter(booth => {
    const matchesSearch = booth.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || getBoothCategory(booth) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

        {/* Search Bar - Sticky */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-4">
          <Card className="p-4 shadow-lg">
            <div className="space-y-3">
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
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setCategoryFilter('experience')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === 'experience'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  🎨 체험형
                </button>
                <button
                  onClick={() => setCategoryFilter('food')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === 'food'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  🍭 간식형
                </button>
                <button
                  onClick={() => setCategoryFilter('game')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === 'game'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  🎮 게임형
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Booth List */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-card to-card/80 mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            전체 부스 목록
          </h2>
          <div className="space-y-4">
            {filteredBooths.map((booth) => {
              return (
                <Card
                  key={booth.booth_id}
                  className="p-6 hover:shadow-xl transition-all hover:border-primary/30 cursor-pointer hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white text-lg font-bold shadow-lg">
                          {booth.booth_id}
                        </span>
                        <h3 className="font-bold text-[22px] text-foreground leading-tight">{booth.name}</h3>
                      </div>
                      {booth.description && (
                        <p className="text-sm text-muted-foreground mb-4 pl-1 leading-relaxed" style={{ lineHeight: '1.6' }}>
                          {booth.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs items-center">
                        <span className="px-3 py-1.5 bg-secondary/20 rounded-full font-medium">
                          📍 {booth.location}
                        </span>
                        {booth.teacher && (
                          <span className="px-3 py-1.5 bg-accent/20 rounded-full font-medium">
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

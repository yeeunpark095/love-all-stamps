import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Frame, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Exhibitions() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("exhibitions")
        .select("*")
        .order("exhibition_id");
      setExhibitions(data || []);
    };

    checkAuth();
  }, [navigate]);

  const types = ["all", ...new Set(exhibitions.map(e => e.type))];
  const filtered = filter === "all" ? exhibitions : exhibitions.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">전시 안내</h1>
        <p className="text-white/90 text-sm">다양한 동아리의 전시를 만나보세요</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Filter */}
        <Card className="p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="font-bold">전시 유형</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                className={filter === type ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {type === "all" ? "전체" : type}
              </Button>
            ))}
          </div>
        </Card>

        {/* Exhibition List */}
        <div className="grid gap-4">
          {filtered.map((exhibition, index) => (
            <Card
              key={exhibition.exhibition_id}
              className="p-5 hover:shadow-lg transition-all hover:border-primary/30 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                  <Frame className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{exhibition.title}</h3>
                      <p className="text-sm text-primary font-semibold">{exhibition.club}</p>
                    </div>
                    <span className="px-3 py-1 bg-secondary/20 rounded-full text-xs font-medium">
                      {exhibition.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{exhibition.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-8 text-center">
            <Frame className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">해당하는 전시가 없습니다</p>
          </Card>
        )}
      </div>

      <Navigation />
    </div>
  );
}

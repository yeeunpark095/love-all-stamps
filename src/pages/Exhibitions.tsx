import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Info } from "lucide-react";

export default function Exhibitions() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<any>(null);

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

  const exhibitionData: { [key: string]: { emoji: string; title: string; description: string; teacher: string } } = {
    '간호보건동아리': {
      emoji: '💊',
      title: '"사랑할 때, 내 몸은 어떻게 반응할까?"',
      description: '스트레스 상황에서의 변화와 관리법을 과학적으로 알아보는 부스!',
      teacher: '심보경'
    },
    'Be creator': {
      emoji: '✨',
      title: '"축제를 만드는 사람들, 그들의 비밀 노트"',
      description: '성덕제의 기획 여정을 한눈에!\n기획서·아이디어·홍보 자료 등 창의력이 폭발하는 전시 💡',
      teacher: '박예은'
    },
    '플로깅': {
      emoji: '🌿',
      title: '"사랑은 줍는 것부터 시작돼요!"',
      description: '걷고, 주우며, 지구를 사랑하는 플로깅 이야기 🌎\n다양한 활동 사진과 자료 전시로 환경사랑을 전해요.',
      teacher: '이혜미'
    },
    '사회정책탐구반': {
      emoji: '⚖️',
      title: '"사회를 바꾸는 사랑, 정책으로 말하다"',
      description: '청소년의 시선으로 사회문제를 분석하고\n더 나은 세상을 위한 대안을 제시하는 정책 탐구 전시 🧠',
      teacher: '이은정'
    },
    '친환경연구동아리': {
      emoji: '🌱',
      title: '"지구를 사랑하는 생활 아이디어!"',
      description: '재활용과 창의성을 더한 친환경 생활용품 전시 ♻️\n작은 실천으로 만드는 지속가능한 사랑 이야기.',
      teacher: '이윤주'
    },
    '핸즈온 과학탐구반': {
      emoji: '🧪',
      title: '"손으로 만든 과학, 마음으로 담은 사랑"',
      description: '학생들이 직접 진행한 소모임 연구 결과 전시 🧪\n실험을 통해 발견한 호기심과 열정의 기록!',
      teacher: '오주현'
    },
    '애니메이션 동아리': {
      emoji: '🎬',
      title: '"사랑은 프레임 사이에 있다"',
      description: '애니메이션이 만들어지는 과정과 그 속의 스토리텔링 💕\n제작 과정 전시 + 애니메이션 체험 코너까지!',
      teacher: '김예원'
    },
    'Guide Makers': {
      emoji: '🌏',
      title: '"내가 만든 박물관, 영어로 안내해볼까?"',
      description: '직접 제작한 영문 안내서를 통해\n학생들의 언어 감각과 창의력을 엿볼 수 있는 전시 ✈️',
      teacher: '박형진'
    },
    '뷰티동아리': {
      emoji: '✨',
      title: '"나를 사랑하는 가장 예쁜 방법"',
      description: '퍼스널 컬러와 스타일링으로\n\'나\'를 빛내는 뷰티 솔루션 전시 💋',
      teacher: '민소정'
    },
    'STEAM사회참여반': {
      emoji: '💡',
      title: '"사랑의 단맛, 연구의 깊이"',
      description: '사회 문제를 과학적 시선으로 풀어낸\n탐구 보고서 전시와 연구 결과 공개 🧩',
      teacher: '정재은, 이은영'
    },
    'ARTY 미술반': {
      emoji: '🎨',
      title: '"사랑을 그리다, 예술로 피어나다"',
      description: '단체작 \'사랑\'과 개인작 전시 💕\n페이스페인팅, 쥬얼리 메이크업, 타투 등\n스페셜 체험으로 완성하는 예술적 사랑 🌹',
      teacher: '이규화'
    },
    '진로DREAM(드림)': {
      emoji: '🌟',
      title: '"사랑하는 일을 찾아서 – 나의 꿈 전시"',
      description: '다양한 직업 체험과 진로 탐색,\n그리고 \'나의 미래\'를 스스로 디자인한 작품 전시 🌟',
      teacher: '박건희'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 pb-24">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">전시 안내</h1>
        <p className="text-white/90 text-sm">다양한 동아리의 전시를 만나보세요</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Exhibition Grid - Album Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((exhibition, index) => {
            const data = exhibitionData[exhibition.club];
            if (!data) return null;
            
            return (
              <Card
                key={exhibition.exhibition_id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedExhibition({ ...exhibition, ...data })}
              >
                {/* Album Cover */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                  <span className="text-8xl z-10 group-hover:scale-110 transition-transform duration-300">{data.emoji}</span>
                </div>
                
                {/* Album Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-xl text-primary line-clamp-1">{exhibition.club}</h3>
                  <p className="text-sm font-medium text-foreground italic font-myeongjo line-clamp-2 min-h-[2.5rem]">
                    {data.title}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">
                      {data.teacher} 선생님
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {exhibitions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">전시 정보를 불러오는 중...</p>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedExhibition} onOpenChange={() => setSelectedExhibition(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <span className="text-5xl">{selectedExhibition?.emoji}</span>
              {selectedExhibition?.club}
            </DialogTitle>
          </DialogHeader>
          {selectedExhibition && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <p className="text-xl font-bold text-foreground italic font-myeongjo">
                  {selectedExhibition.title}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-lg">전시 소개</h4>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {selectedExhibition.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <p className="text-sm">
                  지도교사: <span className="font-medium">{selectedExhibition.teacher} 선생님</span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}

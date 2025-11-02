import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { CrisisButton } from "@/components/Layout/CrisisButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookmarkPlus, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const categories = ["Todos", "Sintomas", "Tratamentos", "Alimentação", "Bem-estar", "Diagnóstico"];

const articles = [
  {
    id: 1,
    title: "Entendendo a Endometriose: O Que Você Precisa Saber",
    category: "Sintomas",
    readTime: "5 min",
    excerpt: "Uma visão completa sobre a endometriose, seus sintomas e como identificar os sinais.",
    date: "15 Nov 2024",
    isSaved: false,
  },
  {
    id: 2,
    title: "Dieta Anti-inflamatória para Endometriose",
    category: "Alimentação",
    readTime: "8 min",
    excerpt: "Conheça os alimentos que podem ajudar a reduzir a inflamação e aliviar os sintomas.",
    date: "12 Nov 2024",
    isSaved: true,
  },
  {
    id: 3,
    title: "Opções de Tratamento: Guia Completo",
    category: "Tratamentos",
    readTime: "12 min",
    excerpt: "Explore as diferentes abordagens de tratamento disponíveis e como escolher a melhor para você.",
    date: "10 Nov 2024",
    isSaved: false,
  },
  {
    id: 4,
    title: "Exercícios e Endometriose: Como Se Movimentar com Segurança",
    category: "Bem-estar",
    readTime: "6 min",
    excerpt: "Descubra quais exercícios são seguros e benéficos para quem tem endometriose.",
    date: "8 Nov 2024",
    isSaved: true,
  },
  {
    id: 5,
    title: "O Caminho para o Diagnóstico: Exames e Especialistas",
    category: "Diagnóstico",
    readTime: "10 min",
    excerpt: "Entenda o processo de diagnóstico e quais exames são necessários.",
    date: "5 Nov 2024",
    isSaved: false,
  },
  {
    id: 6,
    title: "Técnicas de Gerenciamento da Dor",
    category: "Bem-estar",
    readTime: "7 min",
    excerpt: "Aprenda métodos naturais e práticos para lidar com a dor no dia a dia.",
    date: "3 Nov 2024",
    isSaved: false,
  },
  {
    id: 7,
    title: "O Impacto Emocional da Endometriose",
    category: "Bem-estar",
    readTime: "9 min",
    excerpt: "Como cuidar da sua saúde mental enquanto lida com uma doença crônica.",
    date: "1 Nov 2024",
    isSaved: true,
  },
];

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedArticles, setSavedArticles] = useState<number[]>([2, 4, 7]);
  const navigate = useNavigate();

  const toggleSave = (id: number) => {
    setSavedArticles(prev =>
      prev.includes(id) ? prev.filter(saved => saved !== id) : [...prev, id]
    );
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Artigos & Informações" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <Card className="shadow-medium border-border bg-gradient-secondary overflow-hidden">
          <CardContent className="p-6">
            <Badge className="mb-3 bg-secondary-dark text-white">Destaque</Badge>
            <h2 className="text-xl font-bold text-secondary-foreground mb-2">
              Como o LOTUS Pode Transformar Seu Cuidado
            </h2>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Descubra como usar todas as funcionalidades da plataforma para um acompanhamento completo.
            </p>
            <button className="flex items-center gap-2 text-secondary-foreground font-medium hover:gap-3 transition-all">
              Ler agora
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Artigos ({filteredArticles.length})
            </h3>
            {savedArticles.length > 0 && (
              <button
                onClick={() => navigate("/saved-articles")}
                className="text-sm text-primary hover:underline"
              >
                Ver salvos ({savedArticles.length})
              </button>
            )}
          </div>

          {filteredArticles.map((article) => (
            <Card key={article.id} className="shadow-soft border-border hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">{article.date}</p>
                  </div>

                  <button
                    onClick={() => toggleSave(article.id)}
                    className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
                  >
                    <BookmarkPlus
                      className={cn(
                        "w-5 h-5 transition-colors",
                        savedArticles.includes(article.id)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>

                <button className="w-full text-primary hover:text-primary-glow font-medium text-sm flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-primary-light/10 transition-all">
                  Ler artigo completo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <Card className="shadow-soft border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum artigo encontrado com esses critérios.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <CrisisButton />
      <BottomNav />
    </div>
  );
}

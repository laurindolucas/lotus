import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Política de Privacidade" showBack />
      
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Política de Privacidade - LOTUS
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Coleta de Dados</h3>
              <p className="text-muted-foreground">
                O aplicativo LOTUS coleta informações pessoais necessárias para oferecer uma experiência
                personalizada de acompanhamento de saúde, incluindo: nome, email, data de nascimento,
                informações sobre ciclo menstrual, sintomas, medicamentos e consultas médicas.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Uso dos Dados</h3>
              <p className="text-muted-foreground">
                Seus dados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Personalizar sua experiência no aplicativo</li>
                <li>Gerar relatórios e insights sobre sua saúde</li>
                <li>Enviar lembretes de medicamentos e consultas</li>
                <li>Melhorar nossos serviços</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Proteção de Dados</h3>
              <p className="text-muted-foreground">
                Utilizamos medidas de segurança robustas para proteger seus dados pessoais e de saúde.
                Seus dados são criptografados e armazenados em servidores seguros com acesso restrito.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Compartilhamento de Dados</h3>
              <p className="text-muted-foreground">
                Não compartilhamos, vendemos ou alugamos suas informações pessoais para terceiros.
                Seus dados de saúde são estritamente confidenciais e utilizados apenas dentro do aplicativo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Seus Direitos</h3>
              <p className="text-muted-foreground">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Exportar seus dados em formato legível</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Cookies e Tecnologias</h3>
              <p className="text-muted-foreground">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, mantendo
                suas preferências e sessão ativa no aplicativo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Alterações na Política</h3>
              <p className="text-muted-foreground">
                Podemos atualizar esta política periodicamente. Recomendamos que você revise
                regularmente para estar sempre informada sobre como protegemos seus dados.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Contato</h3>
              <p className="text-muted-foreground">
                Para questões sobre privacidade ou para exercer seus direitos, entre em contato
                através do email: privacidade@lotus.app
              </p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Última atualização: Janeiro de 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}

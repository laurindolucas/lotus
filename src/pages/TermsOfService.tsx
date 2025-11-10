import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Termos de Uso" showBack />
      
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              Termos de Uso - LOTUS
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Aceitação dos Termos</h3>
              <p className="text-muted-foreground">
                Ao usar o aplicativo LOTUS, você concorda com estes termos de uso. Se você não concorda
                com qualquer parte destes termos, não deve usar o aplicativo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Descrição do Serviço</h3>
              <p className="text-muted-foreground">
                O LOTUS é um aplicativo de acompanhamento de saúde focado em endometriose e bem-estar feminino.
                Oferecemos ferramentas para registrar sintomas, acompanhar ciclo menstrual, gerenciar medicamentos
                e agendar consultas médicas.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Não é Aconselhamento Médico</h3>
              <p className="text-muted-foreground font-semibold text-destructive">
                IMPORTANTE: O LOTUS não fornece aconselhamento médico, diagnóstico ou tratamento.
              </p>
              <p className="text-muted-foreground">
                O aplicativo é uma ferramenta de acompanhamento e organização. Sempre consulte profissionais
                de saúde qualificados para diagnósticos e tratamentos. Em caso de emergência, procure
                atendimento médico imediato.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Responsabilidades do Usuário</h3>
              <p className="text-muted-foreground">
                Você é responsável por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Manter suas credenciais de acesso seguras</li>
                <li>Fornecer informações precisas e atualizadas</li>
                <li>Usar o aplicativo apenas para fins legais</li>
                <li>Não compartilhar conteúdo inadequado ou ofensivo</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Propriedade Intelectual</h3>
              <p className="text-muted-foreground">
                Todo o conteúdo do aplicativo, incluindo textos, gráficos, logos e software, é propriedade
                do LOTUS e está protegido por leis de direitos autorais. Você não pode copiar, modificar
                ou distribuir este conteúdo sem autorização prévia.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Limitação de Responsabilidade</h3>
              <p className="text-muted-foreground">
                O LOTUS não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Decisões médicas tomadas com base nas informações do aplicativo</li>
                <li>Perda de dados por problemas técnicos</li>
                <li>Interrupções temporárias do serviço</li>
                <li>Uso indevido do aplicativo por terceiros</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">7. Cancelamento de Conta</h3>
              <p className="text-muted-foreground">
                Você pode cancelar sua conta a qualquer momento através das configurações do aplicativo.
                Reservamos o direito de suspender ou encerrar contas que violem estes termos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">8. Modificações dos Termos</h3>
              <p className="text-muted-foreground">
                Podemos modificar estes termos a qualquer momento. Alterações significativas serão
                notificadas através do aplicativo. O uso continuado após as modificações constitui
                aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">9. Lei Aplicável</h3>
              <p className="text-muted-foreground">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida
                nos tribunais competentes do Brasil.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">10. Contato</h3>
              <p className="text-muted-foreground">
                Para questões sobre estes termos, entre em contato através do email: contato@lotus.app
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

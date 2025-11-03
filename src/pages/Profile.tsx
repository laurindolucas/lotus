import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Maria Silva",
    email: "maria@exemplo.com",
    birthDate: "1990-05-15",
    phone: "(11) 98765-4321",
  });

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-24">
      <Header title="Meu Perfil" showBack showNotifications />
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="birthDate"
                  type="date"
                  value={userData.birthDate}
                  onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}

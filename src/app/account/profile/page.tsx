
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Edit3, KeyRound, Mail, Phone, Home, CreditCardIcon, ListOrderedIcon, ShieldCheckIcon, LogOut, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProfileForm {
  fullName: string;
  email: string;
  phone?: string;
}

export default function UserProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';
  const { user, refetchUser, logout } = useAuth();
  const [form, setForm] = useState<ProfileForm>({ fullName: "", email: "", phone: "" });
  const [nameUnlocked, setNameUnlocked] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ fullName: user.name, email: user.email, phone: user.phone });
    }
  }, [user]);

  const handleUnlockField = async (field: 'name' | 'email') => {
    const password = prompt(t('profile.enterPassword', 'Digite sua senha para continuar:'));
    if (!password) return;

    try {
      const res = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        toast({ title: t('profile.error', 'Erro'), description: t('profile.wrongPassword', 'Senha incorreta'), variant: 'destructive' });
        return;
      }

      if (field === 'name') {
        setNameUnlocked(true);
        setTimeout(() => setNameUnlocked(false), 300000); // 5 minutos
      } else {
        setEmailUnlocked(true);
        setTimeout(() => setEmailUnlocked(false), 300000); // 5 minutos
      }

      toast({ title: t('profile.fieldUnlocked', 'Campo desbloqueado'), description: t('profile.fieldUnlockedDesc', 'Você pode editar este campo por 5 minutos') });
    } catch {
      toast({ title: t('profile.error', 'Erro'), description: t('profile.verificationFailed', 'Falha na verificação'), variant: 'destructive' });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { phone: form.phone };
      
      // Só inclui nome se foi desbloqueado
      if (nameUnlocked) {
        payload.fullName = form.fullName;
      }
      
      // Só inclui email se foi desbloqueado
      if (emailUnlocked) {
        payload.email = form.email;
      }

      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error('Falha ao atualizar');
      
      await refetchUser();
      setNameUnlocked(false);
      setEmailUnlocked(false);
      toast({ title: t('profile.profileUpdated', 'Perfil atualizado'), description: t('profile.profileUpdatedDesc', 'Suas informações foram salvas com sucesso') });
    } catch (err) {
      toast({ title: t('profile.error', 'Erro'), description: t('profile.updateFailed', 'Não foi possível atualizar o perfil'), variant: 'destructive' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: t('profile.error', 'Erro'), description: t('profile.passwordMismatch', 'As senhas não coincidem'), variant: 'destructive' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({ title: t('profile.error', 'Erro'), description: t('profile.passwordTooShort', 'A senha deve ter pelo menos 6 caracteres'), variant: 'destructive' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Falha ao alterar senha');
      }

      setPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({ title: t('profile.changePasswordSuccess', 'Senha alterada'), description: t('profile.changePasswordSuccessDesc', 'Sua senha foi alterada com sucesso') });
    } catch (e: any) {
      toast({ title: t('profile.error', 'Erro'), description: e.message, variant: 'destructive' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><User className="mr-2 h-6 w-6 text-primary"/> {t('profile.title')}</CardTitle>
          <CardDescription>{t('profile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  {t('profile.fullName')}
                  {nameUnlocked ? (
                    <Unlock className="h-4 w-4 text-green-500" />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlockField('name')}
                      className="h-auto p-1"
                    >
                      <Lock className="h-4 w-4 text-amber-500" />
                    </Button>
                  )}
                </Label>
                <Input 
                  id="fullName" 
                  value={form.fullName} 
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                  readOnly={!nameUnlocked}
                  className={!nameUnlocked ? "bg-muted/50 cursor-not-allowed" : ""}
                />
                {!nameUnlocked && (
                  <p className="text-xs text-muted-foreground">{t('profile.clickToUnlock', 'Clique no cadeado para editar')}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="flex items-center gap-2">
                  {t('profile.email')}
                  {emailUnlocked ? (
                    <Unlock className="h-4 w-4 text-green-500" />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnlockField('email')}
                      className="h-auto p-1"
                    >
                      <Lock className="h-4 w-4 text-amber-500" />
                    </Button>
                  )}
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  readOnly={!emailUnlocked}
                  className={!emailUnlocked ? "bg-muted/50 cursor-not-allowed" : ""}
                />
                {!emailUnlocked && (
                  <p className="text-xs text-muted-foreground">{t('profile.clickToUnlock', 'Clique no cadeado para editar')}</p>
                )}
              </div>
            </div>
            <div className="space-y-1 max-w-xs">
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={form.phone || ''} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="050-123-4567"
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Edit3 className="mr-2 h-4 w-4" /> {t('profile.saveChanges')}
                </Button>
                <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <KeyRound className="mr-2 h-4 w-4" /> {t('profile.changePassword')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('profile.changePassword', 'Mudar Senha')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label>{t('profile.currentPassword', 'Senha Atual')}</Label>
                        <Input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder={t('profile.currentPasswordPlaceholder', 'Digite sua senha atual')}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>{t('profile.newPassword', 'Nova Senha')}</Label>
                        <Input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder={t('profile.newPasswordPlaceholder', 'Mínimo 6 caracteres')}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>{t('profile.confirmPassword', 'Confirmar Nova Senha')}</Label>
                        <Input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder={t('profile.confirmPasswordPlaceholder', 'Digite novamente a nova senha')}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
                        {t('profile.cancel', 'Cancelar')}
                      </Button>
                      <Button onClick={handleChangePassword} disabled={passwordLoading}>
                        {passwordLoading ? t('profile.changing', 'Alterando...') : t('profile.changePassword', 'Alterar Senha')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
          </form>
        </CardContent>
         <CardFooter className="border-t pt-4">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> {t('profile.logout')}
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Home className="mr-2 h-5 w-5 text-primary"/> כתובות שמורות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">נהל את כתובות המשלוח שלך לגישה מהירה.</p>
            <div className="p-3 border rounded-md bg-muted/20 text-xs text-muted-foreground">
                רחוב הדוגמה 1, תל אביב (ראשי)<br/>
                עבודה - רחוב המשרד 5, רמת גן
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/account/addresses">נהל כתובות</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><CreditCardIcon className="mr-2 h-5 w-5 text-primary"/> ארנק ואמצעי תשלום</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">נהל את אמצעי התשלום והארנק שלך.</p>
             <div className="p-3 border rounded-md bg-muted/20 text-xs text-muted-foreground">
                ויזה **** **** **** 1234
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/account/payment-methods">נהל ארנק ותשלומים</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><ListOrderedIcon className="mr-2 h-5 w-5 text-primary"/> היסטוריית הזמנות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">צפה בכל ההזמנות הקודמות שלך והזמן שוב בקלות.</p>
            <div className="p-3 border rounded-md bg-muted/20 text-xs text-muted-foreground">
                הזמנה #12345 - פיצה פאלאס - ₪75.50 (נמסר)
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/account/order-history">צפה בהיסטוריה המלאה</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

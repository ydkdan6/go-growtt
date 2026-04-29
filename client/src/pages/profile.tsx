import { useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Sprout,
  ChevronRight,
  User,
  HelpCircle,
  LogOut,
  Gift,
  FileText,
  Users,
  Star,
  Pencil,
  Camera,
  Phone,
  MapPin,
  Mail,
  Check,
  X,
} from "lucide-react";
import { useUserDetail } from "@/hooks/general/useUserDetails";
import { useUpdateProfile, useUpdateProfileImage } from "@/hooks/general/useUpdateProfile";

const menuItems = [
  { icon: FileText, label: "Transaction History", badge: null },
  { icon: Users, label: "Referrals", badge: "50 seeds" },
  { icon: HelpCircle, label: "Help & Support", badge: null },
];

export default function Profile() {
  const { data: user, isLoading } = useUserDetail();
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();
  const { mutate: updateImage, isPending: uploadingImage } = useUpdateProfileImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone_number: "", address: "" });

  const initials = user
    ? ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")).toUpperCase() || "GU"
    : "GU";

  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "Guest User";

  const seedBalance = Number(user?.seed_balance ?? 0);
  const level = user?.financial_literacy_level ?? "Beginner";

  const handleEditStart = () => {
    setForm({
      full_name: user?.full_name ?? "",
      phone_number: user?.phone_number ?? "",
      address: user?.address ?? "",
    });
    setEditing(true);
  };

  const handleSave = () => {
    updateProfile(
      { full_name: form.full_name, phone_number: form.phone_number, address: form.address },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateImage(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Profile</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-6">

        {/* Profile Card */}
        <Card className="border">
          <CardContent className="p-5">

            {/* Avatar + name row */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <Avatar className="w-20 h-20">
                  {user?.image && <AvatarImage src={user.image} alt={displayName} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  aria-label="Change photo"
                >
                  {uploadingImage
                    ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-3.5 h-3.5 text-primary-foreground" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
              </div>

              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div className="space-y-1.5">
                    <div className="h-5 w-36 bg-muted animate-pulse rounded" />
                    <div className="h-3.5 w-48 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-lg leading-tight truncate">{displayName}</h2>
                    <p className="text-sm text-muted-foreground truncate">{user?.email ?? ""}</p>
                    <Badge variant="secondary" className="mt-1.5 gap-1">
                      <Star className="w-3 h-3 text-primary" />
                      {level}
                    </Badge>
                  </>
                )}
              </div>

              {!editing && (
                <Button variant="ghost" size="icon" onClick={handleEditStart} aria-label="Edit profile">
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Edit form */}
            {editing ? (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs">Full Name</Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone_number" className="text-xs">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={form.phone_number}
                    onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs">Address</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Your address"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button className="flex-1" size="sm" onClick={handleSave} disabled={saving}>
                    {saving
                      ? <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      : <Check className="w-4 h-4 mr-2" />}
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Read-only detail rows */
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{user?.email ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">Phone Number</p>
                    <p className="text-sm font-medium truncate">{user?.phone_number || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">Address</p>
                    <p className="text-sm font-medium truncate">{user?.address || "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Seeds & Progress */}
            <div className="bg-muted/50 rounded-xl p-4 mt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{seedBalance} Seeds</span>
                </div>
                <Badge variant="outline" className="text-xs">Level 1</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress to Level 2</span>
                  <span className="text-muted-foreground">
                    {Math.min(Math.round((seedBalance / 200) * 100), 100)}%
                  </span>
                </div>
                <Progress value={Math.min(Math.round((seedBalance / 200) * 100), 100)} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Earn {Math.max(0, 200 - seedBalance)} more seeds to reach Level 2
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card className="border bg-gradient-to-r from-accent/20 to-accent/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Daily Rewards</p>
              <p className="text-xs text-muted-foreground">Claim your daily bonus seeds</p>
            </div>
            <Button size="sm" data-testid="button-claim-reward">Claim</Button>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <section>
          <Card className="border">
            <CardContent className="p-0">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 hover-elevate cursor-pointer ${
                    idx !== menuItems.length - 1 ? "border-b" : ""
                  }`}
                  data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Sprout className="w-3 h-3" />
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </main>

      <BottomNav currentPage="profile" />
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
    const { login, signup } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email: loginEmail, password: loginPassword });
        } catch (err: any) {
            toast({ title: "Login Failed", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup({ name: signupName, email: signupEmail, password: signupPassword });
        } catch (err: any) {
            toast({ title: "Signup Failed", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 p-4">
            <Card className="w-full max-w-sm mb-20 bg-neutral-900 border-neutral-800 text-neutral-200">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Welcome
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                        Login or create an account to access history.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4 bg-neutral-800">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <Input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="bg-neutral-800 border-neutral-700" />
                                <Input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="bg-neutral-800 border-neutral-700" />
                                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Connecting..." : "Login"}</Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <Input placeholder="Full Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required className="bg-neutral-800 border-neutral-700" />
                                <Input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required className="bg-neutral-800 border-neutral-700" />
                                <Input type="password" placeholder="Password (min 6 chars)" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} className="bg-neutral-800 border-neutral-700" />
                                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

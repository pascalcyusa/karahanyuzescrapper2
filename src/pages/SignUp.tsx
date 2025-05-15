// src/pages/SignUp.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Import Firebase auth and functions
import { auth, db } from "@/lib/firebase"; // Assuming firebase.ts is in src/lib
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // To save user data

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate(); // For redirection

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    let signUpSuccess = false; // Variable to track success
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Update profile (optional, but good for display name)
      await updateProfile(user, { displayName: values.name });

      // Store additional user info in Firestore (optional)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: values.name,
        email: values.email,
        createdAt: new Date(),
      });

      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
      });
      signUpSuccess = true; // Set success to true
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      // signUpSuccess remains false
    } finally {
      setIsLoading(false);
      if (signUpSuccess) {
        navigate("/"); // Navigate only if sign-up was successful
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    let googleSignUpSuccess = false; // Variable to track success
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user is new or existing (optional, Firestore can handle overwrite or merge)
      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(), // Or check if doc exists to not overwrite
      }, { merge: true }); // Use merge to avoid overwriting existing data if user signs in again

      toast({
        title: "Signed up with Google!",
        description: "Welcome to KPlayer.",
      });
      googleSignUpSuccess = true; // Set success to true
    } catch (error: any) {
      console.error("Google sign up error:", error);
      toast({
        title: "Google sign up failed",
        description: error.message || "Could not sign up with Google.",
        variant: "destructive",
      });
      // googleSignUpSuccess remains false
    } finally {
      setIsLoading(false);
      if (googleSignUpSuccess) {
        navigate("/"); // Navigate only if Google sign-up was successful
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              {/* ... (Google SVG icon) ... */}
              Sign up with Google
            </Button>
          </div>

          <div className="relative mb-4">
            {/* ... (Or continue with) ... */}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* ... (FormField for name, email, password, confirmPassword - no changes needed here) ... */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="youremail@example.com" type="email" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;